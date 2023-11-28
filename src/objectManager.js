import {
  CopyObjectCommand,
  DeleteObjectCommand,
  GetObjectCommand,
  HeadObjectCommand,
  ListObjectsV2Command,
  S3Client,
} from "@aws-sdk/client-s3";
import { Upload } from "@aws-sdk/lib-storage";
import { FsBlockstore } from "blockstore-fs";
import { unixfs } from "@helia/unixfs";
import { v4 as uuidv4 } from "uuid";
import path from "node:path";
import os from "node:os";
import { mkdir, rm } from "node:fs/promises";
import { car } from "@helia/car";

export default class ObjectManager {
  #client;
  #defaultBucket;
  #maxConcurrentUploads = 4;

  constructor(
    S3ClientConfig,
    defaultBucket,
    options = {
      maxConcurrentUploads: 4,
    },
  ) {
    // Login to S3 Endpoint
    this.#client = new S3Client(S3ClientConfig);
    this.#defaultBucket = defaultBucket;

    if (options?.maxConcurrentUploads) {
      this.#maxConcurrentUploads = Number(options.maxConcurrentUploads);
    }
  }

  async upload(key, source, bucket = this.#defaultBucket) {
    // Setup Upload Options
    const uploadOptions = {
      client: this.#client,
      params: {
        Bucket: bucket,
        Key: key,
        Body: source,
      },
      queueSize: this.#maxConcurrentUploads,
      partSize: 1024 * 1024 * 105,
      leavePartsOnError: false, // optional manually handle dropped parts
    };

    // Pack Multiple Files into CAR file for upload
    let parsedEntries = {};
    if (Array.isArray(source)) {
      // Mark Upload as a CAR file import
      uploadOptions.params.Metadata = {
        import: "car",
      };
      const uploadUUID = uuidv4(),
        temporaryBlockstorePath = path.resolve(
          os.tmpdir(),
          "filebase-sdk",
          "uploads",
          uploadUUID,
        );

      try {
        await mkdir(temporaryBlockstorePath, { recursive: true });
        const temporaryFsBlockstore = new FsBlockstore(temporaryBlockstorePath),
          heliaFs = unixfs({
            blockstore: temporaryFsBlockstore,
          });

        for await (const entry of heliaFs.import(source)) {
          parsedEntries[entry.path] = entry;
        }
        const rootEntry = parsedEntries["/"];

        // Get carFile stream here and override body
        const carExporter = car({ blockstore: temporaryFsBlockstore });
        source = await carExporter.export(rootEntry.cid);
      } catch (e) {
        throw e;
      } finally {
        // Delete Temporary Blockstore
        await rm(temporaryBlockstorePath, { recursive: true, force: true });
      }
    }

    // Upload file/carFile via S3
    const parallelUploads3 = new Upload(uploadOptions);
    await parallelUploads3.done();

    // Get CID from Platform
    const command = new HeadObjectCommand({
        Bucket: bucket,
        Key: key,
        Body: source,
      }),
      headResult = await this.#client.send(command),
      responseCid = headResult.Metadata.cid;

    if (parsedEntries.length === 0) {
      return {
        cid: responseCid,
      };
    }
    return {
      cid: responseCid,
      entries: parsedEntries,
    };
  }

  async download(key, bucket = this.#defaultBucket) {
    const command = new GetObjectCommand({
        Bucket: bucket,
        Key: key,
      }),
      response = await this.#client.send(command);

    return response.Body;
  }

  async list(listOptions = {}, bucket = this.#defaultBucket, limit = 1000) {
    const commandOptions = {
        Bucket: bucket,
        MaxKeys: limit,
      },
      command = new ListObjectsV2Command({
        ...listOptions,
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

  async delete(key, bucket = this.#defaultBucket) {
    const command = new DeleteObjectCommand({
      Bucket: bucket,
      Key: key,
    });

    return await this.#client.send(command);
  }

  async copy(
    sourceKey,
    destinationBucket,
    sourceBucket = this.#defaultBucket,
    destinationKey = null,
  ) {
    const command = new CopyObjectCommand({
      CopySource: `${sourceBucket}/${sourceKey}`,
      Bucket: destinationBucket,
      Key: destinationKey || sourceKey,
    });

    return await this.#client.send(command);
  }
}
