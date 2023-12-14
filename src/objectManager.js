// S3 Imports
import {
  DeleteObjectCommand,
  GetObjectCommand,
  HeadObjectCommand,
  ListObjectsV2Command,
  S3Client,
} from "@aws-sdk/client-s3";
import { Upload } from "@aws-sdk/lib-storage";
// Helia Imports
import { CarWriter } from "@ipld/car";
import { car } from "@helia/car";
import { unixfs } from "@helia/unixfs";
import { FsBlockstore } from "blockstore-fs";
// Utility Imports
import { createReadStream, createWriteStream } from "node:fs";
import { mkdir, rm } from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import { Readable } from "node:stream";
import { v4 as uuidv4 } from "uuid";

/** Interacts with an S3 client to perform various operations on objects in a bucket. */
class ObjectManager {
  #DEFAULT_ENDPOINT = "https://s3.filebase.com";
  #DEFAULT_REGION = "us-east-1";
  #DEFAULT_MAX_CONCURRENT_UPLOADS = 4;

  #client;
  #defaultBucket;
  #maxConcurrentUploads;

  /**
   * @typedef {Object} objectManagerOptions Optional settings for the constructor.
   * @property {string} [bucket] Default bucket to use.
   * @property {number} [maxConcurrentUploads] The maximum number of concurrent uploads.
   */

  /**
   * @summary Creates a new instance of the constructor.
   * @param {string} clientKey - The access key ID for authentication.
   * @param {string} clientSecret - The secret access key for authentication.
   * @param {objectManagerOptions} options - Optional settings for the constructor.
   * @example
   * import { ObjectManager } from "@filebase/sdk";
   * const objectManager = new ObjectManager("KEY_FROM_DASHBOARD", "SECRET_FROM_DASHBOARD", {
   *   bucket: "my-default-bucket",
   *   maxConcurrentUploads: 4
   * });
   */
  constructor(clientKey, clientSecret, options) {
    const clientEndpoint =
        process.env.NODE_ENV === "test"
          ? process.env.TEST_S3_ENDPOINT || this.#DEFAULT_ENDPOINT
          : this.#DEFAULT_ENDPOINT,
      clientConfiguration = {
        credentials: {
          accessKeyId: clientKey,
          secretAccessKey: clientSecret,
        },
        endpoint: clientEndpoint,
        region: this.#DEFAULT_REGION,
      };
    this.#defaultBucket = options?.bucket;
    this.#maxConcurrentUploads =
      options?.maxConcurrentUploads || this.#DEFAULT_MAX_CONCURRENT_UPLOADS;
    this.#client = new S3Client(clientConfiguration);
  }

  /**
   * @typedef {Object} object
   * @property {string} cid The CID of the uploaded object
   * @property {array<objectEntry>} [entries] If a directory then returns an array of the containing objects
   */

  /**
   * @typedef {Object} objectEntry
   * @property {string} cid The CID of the uploaded object
   * @property {string} path The path of the object
   */

  /**
   * If the source parameter is an array of objects, it will pack multiple files into a CAR file for upload.
   * The method returns a Promise that resolves to an object containing the CID (Content Identifier) of the uploaded file
   * and an optional entries object when uploading a CAR file.
   *
   * @summary Uploads a file or a CAR file to the specified bucket.
   * @param {string} key - The key or path of the file in the bucket.
   * @param {Buffer|ReadableStream|Array<Object>} source - The content of the file to be uploaded.
   *    If an array of objects is provided, each object should have a 'path' property specifying the path of the file
   *    and a 'content' property specifying the content of the file.
   * @param {string} [bucket] - The bucket name. Default is the value of the defaultBucket property.
   * @returns {Promise<object>}
   * @example
   * // Upload Object
   * await objectManager.upload("my-object", Buffer.from("Hello World!"));
   * // Upload Directory
   * await objectManager.upload("my-first-directory", [
   *  {
   *   path: "/testObjects/1.txt",
   *   content: Buffer.from("upload test object", "utf-8"),
   *  },
   *  {
   *   path: "/testObjects/deep/1.txt",
   *   content: Buffer.from("upload deep test object", "utf-8"),
   *  },
   *  {
   *   path: "/topLevel.txt",
   *   content: Buffer.from("upload top level test object", "utf-8"),
   *  },
   * ]);
   */
  async upload(key, source, bucket = this.#defaultBucket) {
    // Generate Upload UUID
    const uploadUUID = uuidv4();

    // Setup Upload Options
    const uploadOptions = {
      client: this.#client,
      params: {
        Bucket: bucket,
        Key: key,
        Body: source,
      },
      queueSize: this.#maxConcurrentUploads,
      partSize: 26843546, //25.6Mb || 250Gb Max File Size
    };

    // Pack Multiple Files into CAR file for upload
    let parsedEntries = {};
    if (Array.isArray(source)) {
      // Mark Upload as a CAR file import
      uploadOptions.params.Metadata = {
        import: "car",
      };

      let temporaryCarFilePath, temporaryBlockstoreDir;
      try {
        // Setup Blockstore
        temporaryBlockstoreDir = path.resolve(
          os.tmpdir(),
          "filebase-sdk",
          "uploads",
          uploadUUID,
        );
        temporaryCarFilePath = `${temporaryBlockstoreDir}/main.car`;
        await mkdir(temporaryBlockstoreDir, { recursive: true });
        const temporaryBlockstore = new FsBlockstore(temporaryBlockstoreDir);

        const heliaFs = unixfs({
          blockstore: temporaryBlockstore,
        });

        for (let sourceEntry of source) {
          sourceEntry.path =
            sourceEntry.path[0] === "/"
              ? `/${uploadUUID}${sourceEntry.path}`
              : `/${uploadUUID}/${sourceEntry.path}`;
        }
        for await (const entry of heliaFs.addAll(source)) {
          parsedEntries[entry.path] = entry;
        }
        const rootEntry = parsedEntries[uploadUUID];

        // Get carFile stream here
        const carExporter = car({ blockstore: temporaryBlockstore }),
          { writer, out } = CarWriter.create([rootEntry.cid]);

        // Put carFile stream to disk
        const output = createWriteStream(temporaryCarFilePath);
        Readable.from(out).pipe(output);
        await carExporter.export(rootEntry.cid, writer);

        // Set Uploader to Read from carFile on disk
        uploadOptions.params.Body = createReadStream(temporaryCarFilePath);

        // Upload carFile via S3
        const parallelUploads3 = new Upload(uploadOptions);
        await parallelUploads3.done();
        await temporaryBlockstore.close();
      } finally {
        if (typeof temporaryBlockstoreDir !== "undefined") {
          // Delete Temporary Blockstore
          await rm(temporaryBlockstoreDir, { recursive: true, force: true });
        }
      }
    } else {
      // Upload file via S3
      const parallelUploads3 = new Upload(uploadOptions);
      await parallelUploads3.done();
    }

    // Get CID from Platform
    const command = new HeadObjectCommand({
        Bucket: bucket,
        Key: key,
        Body: source,
      }),
      headResult = await this.#client.send(command),
      responseCid = headResult.Metadata.cid;

    if (Object.keys(parsedEntries).length === 0) {
      return {
        cid: responseCid,
      };
    }
    return {
      cid: responseCid,
      entries: parsedEntries,
    };
  }

  /**
   * @summary Downloads an object from the specified bucket using the provided key.
   * @param {string} key - The key of the object to be downloaded.
   * @param {string} [bucket] - The name of the bucket to download from. If not provided, the default bucket will be used.
   * @returns {Promise<Object>} - A promise that resolves with the contents of the downloaded object as a Stream.
   * @example
   * // Download object with name of `download-object-example`
   * await objectManager.download(`download-object-example`);
   */
  async download(key, bucket = this.#defaultBucket) {
    const command = new GetObjectCommand({
        Bucket: bucket,
        Key: key,
      }),
      response = await this.#client.send(command);

    return response.Body;
  }

  /**
   * @typedef {Object} listObjectOptions
   * @property {string} [Bucket] The name of the bucket. If not provided, the default bucket will be used.
   * @property {string} [ContinuationToken=null] Continues listing from this objects name.
   * @property {string} [Delimiter=null] Character used to group keys
   * @property {number} [MaxKeys=1000] The maximum number of objects to retrieve. Defaults to 1000.
   */

  /**
   * Retrieves a list of objects from a specified bucket.
   *
   * @param {listObjectOptions} options - The options for listing objects.
   * @returns {Promise<Array>} - A promise that resolves to an array of objects.
   * @example
   * // List objects in bucket with a limit of 1000
   * await objectManager.list({
   *   MaxKeys: 1000
   * });
   */
  async list(
    options = {
      Bucket: this.#defaultBucket,
      ContinuationToken: null,
      Delimiter: null,
      MaxKeys: 1000,
    },
  ) {
    if (options?.MaxKeys && options.MaxKeys > 100000) {
      throw new Error(`MaxKeys Maximum value is 100000`);
    }
    const bucket = options?.Bucket || this.#defaultBucket,
      limit = options?.MaxKeys || 1000,
      commandOptions = {
        Bucket: bucket,
        MaxKeys: limit,
      },
      command = new ListObjectsV2Command({
        ...options,
        ...commandOptions,
      });

    let isTruncated = true,
      bucketContents = [];
    while (isTruncated && bucketContents.length < limit) {
      const { Contents, IsTruncated, NextContinuationToken } =
        await this.#client.send(command);
      if (typeof Contents === "undefined") {
        isTruncated = false;
        continue;
      }
      bucketContents = bucketContents.concat(Contents);
      isTruncated = IsTruncated;
      command.input.ContinuationToken = NextContinuationToken;
    }
    return bucketContents.slice(0, limit);
  }

  /**
   * @summary Deletes an object from the specified bucket using the provided key.
   * @param {string} key - The key of the object to be deleted.
   * @param {string} [bucket] - The name of the bucket that contains the object. Defaults to the default bucket.
   * @returns {Promise<Boolean>} - A Promise that resolves with the result of the delete operation.
   * @example
   * // Delete object with name of `delete-object-example`
   * await objectManager.delete(`delete-object-example`);
   */
  async delete(key, bucket = this.#defaultBucket) {
    const command = new DeleteObjectCommand({
      Bucket: bucket,
      Key: key,
    });

    await this.#client.send(command);
    return true;
  }
}

export default ObjectManager;
