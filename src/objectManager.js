// Environment Imports
import logger from "./logger.js";
// S3 Imports
import {
  CopyObjectCommand,
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
import { mfs } from "@helia/mfs";
import { unixfs } from "@helia/unixfs";
import { MemoryBlockstore } from "blockstore-core/memory";
import { MemoryDatastore } from "datastore-core";
// Utility Imports
import { v4 as uuidv4 } from "uuid";
import { downloadFromGateway } from "./helpers.js";
import PQueue from "p-queue";

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
    const uploadLogger = logger.child({ uploadUUID });

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
      source.sort((a, b) => {
        return countSlashes(b.path) - countSlashes(a.path);
      });

      let temporaryCarFilePath, temporaryBlockstoreDir;
      try {
        // Setup Blockstore
        let temporaryBlockstore = new MemoryBlockstore(),
          temporaryDatastore = new MemoryDatastore();
        if (isNode()) {
          const { mkdir } = await import("node:fs/promises");
          const { FsBlockstore } = await import("blockstore-fs");
          const os = await import("node:os");
          const path = await import("node:path");
          temporaryBlockstoreDir = path.resolve(
            os.tmpdir(),
            "filebase-sdk",
            "uploads",
            uploadUUID,
          );
          temporaryCarFilePath = `${temporaryBlockstoreDir}/main.car`;
          await mkdir(temporaryBlockstoreDir, { recursive: true });
          temporaryBlockstore = new FsBlockstore(temporaryBlockstoreDir);
        }
        let createdFiles = new Map();
        const heliaFs = unixfs({
          blockstore: temporaryBlockstore,
        });
        uploadLogger.verbose("UNIXFS_ADD", {
          count: source.length,
        });
        let createFilePromises = [];
        const queue = new PQueue({ concurrency: 50 });
        for (const entry of source) {
          if (entry.content === null) {
            continue;
          }
          const task = (async () => {
            await queue.add(async () => {
              uploadLogger.silly("SOURCE_IMPORT_STARTED", {
                path: entry.path,
                size: queue.size,
              });

              if (isNode()) {
                const { Readable } = await import("node:stream");
                let createdFile;
                if (
                  (entry.type === "import" && entry.content !== null) ||
                  entry.content instanceof Readable
                ) {
                  let filehandle;
                  try {
                    if (entry.type === "import") {
                      const { open } = await import("node:fs/promises");
                      const path = await import("node:path");
                      filehandle = await open(path.resolve(entry.content), "r");
                      entry.content = filehandle.createReadStream();
                    }
                    createdFile = await heliaFs.addByteStream(entry.content);
                  } catch (err) {
                    if (typeof filehandle !== "undefined") {
                      await filehandle.close();
                    }
                    throw err;
                  }
                  if (typeof filehandle !== "undefined") {
                    await filehandle.close();
                  }
                } else if (entry.content !== null) {
                  createdFile = await heliaFs.addBytes(entry.content);
                } else {
                  return;
                }
                createdFiles.set(entry.path, createdFile);
                uploadLogger.verbose("SOURCE_IMPORT_COMPLETED", {
                  path: entry.path,
                  size: queue.size,
                });
              } else {
                let createdFile;
                if (entry.type === "import" && entry.content !== null) {
                  try {
                    createdFile = await heliaFs.addByteStream(entry.content);
                  } catch (err) {
                    throw err;
                  }
                } else if (entry.content !== null) {
                  createdFile = await heliaFs.addBytes(entry.content);
                } else {
                  return;
                }
                createdFiles.set(entry.path, createdFile);
                uploadLogger.verbose("SOURCE_IMPORT_COMPLETED", {
                  path: entry.path,
                  size: queue.size,
                });
              }
            });
          })();
          if (queue.size > 150) {
            await queue.onSizeLessThan(100);
          }
          createFilePromises.push(task);
          uploadLogger.verbose("SOURCE_IMPORT_QUEUED", {
            path: entry.path,
            size: queue.size,
          });
        }
        await Promise.all(createFilePromises);
        uploadLogger.verbose("UNIXFS_ADDED", {
          count: createdFiles.size,
        });

        const heliaMfs = mfs({
          blockstore: temporaryBlockstore,
          datastore: temporaryDatastore,
        });
        uploadLogger.verbose("MFS_ADDING", {
          count: source.length,
          output: temporaryCarFilePath,
        });
        for (const entry of source) {
          if (entry.content === null) {
            uploadLogger.silly("MFS_DIR_CREATING", {
              path: entry.path,
            });
            await heliaMfs.mkdir(entry.path);
            uploadLogger.verbose("MFS_DIR_CREATED", {
              path: entry.path,
            });
          } else {
            const entryFile = createdFiles.get(entry.path);
            uploadLogger.silly("MFS_FILE_COPY", {
              cid: entryFile,
              path: entry.path,
            });
            await heliaMfs.cp(entryFile, entry.path, {
              force: true,
            });
            uploadLogger.verbose("MFS_FILE_COPIED", {
              cid: entryFile,
              path: entry.path,
            });
          }
        }
        for (const entry of source) {
          parsedEntries[entry.path] = await heliaMfs.stat(entry.path);
          uploadLogger.silly("MFS_PATH_STAT", parsedEntries[entry.path]);
        }
        parsedEntries["/"] = await heliaMfs.stat("/");
        const rootEntry = parsedEntries["/"];
        uploadLogger.verbose("MFS_ADDED", {
          root: rootEntry,
          count: Object.keys(parsedEntries).length,
        });

        // Get carFile stream here
        uploadLogger.verbose("CAR_EXPORTING", {
          root: rootEntry,
        });
        const carExporter = car({ blockstore: temporaryBlockstore }),
          { writer, out } = CarWriter.create([rootEntry.cid]);

        if (isNode()) {
          const { createReadStream, createWriteStream } = await import(
            "node:fs"
          );
          const { Readable } = await import("node:stream");
          // Put carFile stream to disk
          const output = createWriteStream(temporaryCarFilePath);
          Readable.from(out).pipe(output);
          await carExporter.export(rootEntry.cid, writer);
          uploadLogger.verbose("CAR_EXPORTED", {
            root: rootEntry,
          });

          // Set Uploader to Read from carFile on disk
          uploadOptions.params.Body = createReadStream(temporaryCarFilePath);
        }

        // Upload carFile via S3
        uploadLogger.verbose("CAR_UPLOADING", {
          entry: rootEntry,
          source: temporaryCarFilePath,
        });
        const parallelUploads3 = new Upload(uploadOptions);
        parallelUploads3.on("httpUploadProgress", (progress) => {
          uploadLogger.debug("CAR_UPLOAD_PROGRESS", progress);
        });
        await parallelUploads3.done();
        uploadLogger.verbose("CAR_UPLOADED", {
          entry: rootEntry,
          source: temporaryCarFilePath,
        });
        await temporaryBlockstore.close();
      } catch (err) {
        console.error(err.message);
        throw err;
      } finally {
        if (typeof temporaryBlockstoreDir !== "undefined" && isNode()) {
          const { rm } = await import("node:fs/promises");
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
   * @param {objectOptions} [options] - The options for downloading the object.
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

  /**
   * @typedef {Object} copyObjectOptions
   * @property {string} [sourceBucket] The source bucket from where the object is to be copied.
   * @property {string} [destinationKey] The key of the object in the destination bucket. By default, it is the same as the sourceKey.
   */

  /**
   * If the destinationKey is not provided, the object will be copied with the same key as the sourceKey.
   *
   * @summary Copy the object from sourceKey in the sourceBucket to destinationKey in the destinationBucket.
   * @param {string} sourceKey - The key of the object to be copied from the sourceBucket.
   * @param {string} destinationBucket - The bucket where the object will be copied to.
   * @param {copyObjectOptions} [options] - Additional options for the copy operation.
   *
   * @returns {Promise<Boolean>} - A Promise that resolves with the result of the copy operation.
   * @example
   * // Copy object `copy-object-test` from `copy-object-test-pass-src` to `copy-object-test-pass-dest`
   * // TIP: Set bucket on constructor, it will be used as the default source for copying objects.
   * await objectManager.copy(`copy-object-test`, `copy-object-dest`, {
   *   sourceBucket: `copy-object-src`
   * });
   */
  async copy(
    sourceKey,
    destinationBucket,
    options = {
      sourceBucket: this.#defaultBucket,
      destinationKey: undefined,
    },
  ) {
    const copySource = `${
        options?.sourceBucket || this.#defaultBucket
      }/${sourceKey}`,
      command = new CopyObjectCommand({
        CopySource: copySource,
        Bucket: destinationBucket,
        Key: options?.destinationKey || sourceKey,
      });

    await this.#client.send(command);
    return true;
  }
}

// Function to count slashes in a path
function countSlashes(path) {
  return (path.match(/\//g) || []).length;
}

// Function to check if the code is running in Node.js or the browser
function isNode() {
  return typeof process !== "undefined" && process.release.name === "node";
}

export default ObjectManager;
