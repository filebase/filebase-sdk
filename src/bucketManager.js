import {
  CreateBucketCommand,
  DeleteBucketCommand,
  ListBucketsCommand,
  S3Client,
} from "@aws-sdk/client-s3";

/** Provides methods for managing buckets in an S3 endpoint. */
class BucketManager {
  #client;

  /**
   * @summary Creates a new instance of the S3Client class.
   * @param {clientConfig} clientConfig - The configuration object for the S3Client.
   * @example
   * import { bucketManager } from "@filebase/sdk";
   * const bucketManager = new BucketManager(S3_CONFIG);
   */
  constructor(clientConfig) {
    clientConfig.region = clientConfig.region || "us-east-1";
    this.#client = new S3Client(clientConfig);
  }

  /**
   * @typedef {Object} bucket
   * @property {string} Name The name of the bucket
   * @property {date} Date the bucket was created
   */

  /**
   * @summary Creates a new bucket with the specified name.
   * @param {string} name - The name of the bucket to create.
   * @returns {Promise<bucket>} - A promise that resolves when the bucket is created.
   * @example
   * // Create bucket with name of `create-bucket-example`
   * await bucketManager.create(`create-bucket-example`);
   */
  async create(name) {
    const command = new CreateBucketCommand({
      Bucket: name,
    });

    return await this.#client.send(command);
  }

  /**
   * @summary Lists the buckets in the client.
   * @returns {Promise<Array<bucket>>} - A promise that resolves with an array of objects representing the buckets in the client.
   * @example
   * // List all buckets
   * await bucketManager.list();
   */
  async list() {
    const command = new ListBucketsCommand({}),
      { Buckets } = await this.#client.send(command);

    return Buckets;
  }

  /**
   * @summary Deletes the specified bucket.
   * @param {string} name - The name of the bucket to delete.
   * @returns {Promise<boolean>} - A promise that resolves when the bucket is deleted.
   * @example
   * // Delete bucket with name of `bucket-name-to-delete`
   * await bucketManager.delete(`bucket-name-to-delete`);
   */
  async delete(name) {
    const command = new DeleteBucketCommand({
      Bucket: name,
    });

    await this.#client.send(command);
    return true;
  }
}

export default BucketManager;
