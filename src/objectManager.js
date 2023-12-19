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
import { downloadFromGateway } from "./helpers.js";

/** Interacts with an S3 client to perform various operations on objects in a bucket. */
class ObjectManager {
  #DEFAULT_ENDPOINT = "https://s3.filebase.com";
  #DEFAULT_REGION = "us-east-1";
  #DEFAULT_MAX_CONCURRENT_UPLOADS = 4;

  #client;
  #credentials;
  #defaultBucket;
  #gatewayConfiguration;
  #maxConcurrentUploads;

  /**
   * @typedef {Object} objectManagerOptions Optional settings for the constructor.
   * @property {string} [bucket] Default bucket to use.
   * @property {objectDownloadOptions} [gateway] Default gateway to use.
   * @property {number} [maxConcurrentUploads] The maximum number of concurrent uploads.
   */

  /**
   * @typedef {Object} objectDownloadOptions Optional settings for downloading objects
   * @property {string} endpoint Default gateway to use.
   * @property {string} [token] Token for the default gateway.
   * @property {number} [timeout=60000] Timeout for the default gateway
   */

  /**
   * @summary Creates a new instance of the constructor.
   * @param {string} clientKey - The access key ID for authentication.
   * @param {string} clientSecret - The secret access key for authentication.
   * @param {objectManagerOptions} options - Optional settings for the constructor.
   * @tutorial quickstart-object
   * @example
   * import { ObjectManager } from "@filebase/sdk";
   * const objectManager = new ObjectManager("KEY_FROM_DASHBOARD", "SECRET_FROM_DASHBOARD", {
   *   bucket: "my-default-bucket",
   *   maxConcurrentUploads: 4,
   *   gateway: {
   *     endpoint: "https://my-default-gateway.mydomain.com
   *     token: SUPER_SECRET_GATEWAY_TOKEN
   *   }
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
        forcePathStyle: true,
      };
    this.#defaultBucket = options?.bucket;
    this.#maxConcurrentUploads =
      options?.maxConcurrentUploads || this.#DEFAULT_MAX_CONCURRENT_UPLOADS;
    this.#credentials = {
      key: clientKey,
      secret: clientSecret,
    };
    this.#client = new S3Client(clientConfiguration);

    this.#gatewayConfiguration = {
      endpoint: options?.gateway?.endpoint,
      token: options?.gateway?.token,
      timeout: options?.gateway?.timeout,
    };
  }

  /**
   * @typedef {Object} objectOptions
   * @property {string} [bucket] - The bucket to pin the IPFS CID into.
   */

  /**
   * @typedef {Object} objectHeadResult
   * @property {string} cid The CID of the uploaded object
   * @property {function} download Convenience function to download the object via S3 or the selected gateway
   * @property {array<Object>} [entries] If a directory then returns an array of the containing objects
   * @property {string} entries.cid The CID of the uploaded object
   * @property {string} entries.path The path of the object
   */

  /**
   * If the source parameter is an array of objects, it will pack multiple files into a CAR file for upload.
   * The method returns a Promise that resolves to an object containing the CID (Content Identifier) of the uploaded file
   * and an optional entries object when uploading a CAR file.
   *
   * @summary Uploads a file or a CAR file to the specified bucket.
   * @param {string} key - The key or path of the file in the bucket.
   * @param {Buffer|ReadableStream|Array<Object>} source - The content of the object to be uploaded.
   *    If an array of files is provided, each file should have a 'path' property specifying the path of the file
   *    and a 'content' property specifying the content of the file.  The SDK will then construct a CAR file locally
   *    and use that as the content of the object to be uploaded.
   * @param {Object} [metadata] Optional metadata for pin object
   * @param {objectOptions} [options] - The options for uploading the object.
   * @returns {Promise<objectHeadResult>}
   * @example
   * // Upload Object
   * await objectManager.upload("my-object", Buffer.from("Hello World!"));
   * // Upload Object with Metadata
   * await objectManager.upload("my-custom-object", Buffer.from("Hello Big World!"), {
   *   "application": "my-filebase-app"
   * });
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
  async upload(key, source, metadata, options) {
    // Generate Upload UUID
    const uploadUUID = uuidv4();

    // Setup Upload Options
    const bucket = options?.bucket || this.#defaultBucket,
      uploadOptions = {
        client: this.#client,
        params: {
          Bucket: bucket,
          Key: key,
          Body: source,
          Metadata: metadata || {},
        },
        queueSize: this.#maxConcurrentUploads,
        partSize: 26843546, //25.6Mb || 250Gb Max File Size
      };

    // Pack Multiple Files into CAR file for upload
    let parsedEntries = {};
    if (Array.isArray(source)) {
      // Mark Upload as a CAR file import
      uploadOptions.params.Metadata = {
        ...uploadOptions.params.Metadata,
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
        download: () => {
          return this.#routeDownload(responseCid, key, options);
        },
      };
    }
    return {
      cid: responseCid,
      download: () => {
        return this.#routeDownload(responseCid, key, options);
      },
      entries: parsedEntries,
    };
  }

  async #routeDownload(cid, key, options) {
    return typeof this.#gatewayConfiguration.endpoint !== "undefined"
      ? downloadFromGateway(cid, this.#gatewayConfiguration)
      : this.download(key, options);
  }

  /**
   * @summary Gets an objects info and metadata using the S3 API.
   * @param {string} key - The key of the object to be inspected.
   * @param {objectOptions} [options] - The options for inspecting the object.
   * @returns {Promise<objectHeadResult|false>}
   */
  async get(key, options) {
    const bucket = options?.bucket || this.#defaultBucket;
    try {
      const command = new HeadObjectCommand({
          Bucket: bucket,
          Key: key,
        }),
        response = await this.#client.send(command);

      response.download = () => {
        return this.#routeDownload(response.Metadata.cid, key, options);
      };

      return response;
    } catch (err) {
      if (err.name === "NotFound") {
        return false;
      }
      throw err;
    }
  }

  /**
   * @summary Downloads an object from the specified bucket using the provided key.
   * @param {string} key - The key of the object to be downloaded.
   * @param {objectOptions} [options] - The options for downloading the object..
   * @returns {Promise<Object>} - A promise that resolves with the contents of the downloaded object as a Stream.
   * @example
   * // Download object with name of `download-object-example`
   * await objectManager.download(`download-object-example`);
   */
  async download(key, options) {
    // Download via IPFS Gateway if Setup or S3 by Default
    if (typeof this.#gatewayConfiguration.endpoint === "string") {
      const objectToFetch = await this.get(key, options);
      return objectToFetch.download();
    } else {
      const command = new GetObjectCommand({
          Bucket: options?.bucket || this.#defaultBucket,
          Key: key,
        }),
        response = await this.#client.send(command);

      return response.Body;
    }
  }

  /**
   * @typedef {Object} listObjectsResult
   * @property {boolean} IsTruncated Indicates if more results exist on the server
   * @property {string} NextContinuationToken ContinuationToken used to paginate list requests
   * @property {Array<Object>} Contents List of Keys stored in the S3 Bucket
   * @property {string} Contents.Key Key of the Object
   * @property {string} Contents.LastModified Date Last Modified of the Object
   * @property {string} Contents.CID CID of the Object
   * @property {string} Contents.ETag ETag of the Object
   * @property {number} Contents.Size Size in Bytes of the Object
   * @property {string} Contents.StorageClass Class of Storage of the Object
   * @property {function} Contents.download Convenience function to download the item using the S3 gateway
   */

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
   * @returns {Promise<listObjectsResult>} - A promise that resolves to an array of objects.
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

    const { Contents, IsTruncated, NextContinuationToken } =
      await this.#client.send(command);
    return { Contents, IsTruncated, NextContinuationToken };
  }

  /**
   * @summary Deletes an object from the specified bucket using the provided key.
   * @param {string} key - The key of the object to be deleted.
   * @param {objectOptions} [options] - The options for deleting the file.
   * @returns {Promise<Boolean>} - A Promise that resolves with the result of the delete operation.
   * @example
   * // Delete object with name of `delete-object-example`
   * await objectManager.delete(`delete-object-example`);
   */
  async delete(key, options) {
    const command = new DeleteObjectCommand({
      Bucket: options?.bucket || this.#defaultBucket,
      Key: key,
    });

    await this.#client.send(command);
    return true;
  }
}

export default ObjectManager;
