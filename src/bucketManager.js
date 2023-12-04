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
   * @param {Object} clientConfig - The configuration object for the S3Client.
   */
  constructor(clientConfig) {
    this.#client = new S3Client(clientConfig);
  }

  /**
   * @summary Creates a new bucket with the specified name.
   * @param {string} name - The name of the bucket to create.
   * @returns {Promise<*>} - A promise that resolves when the bucket is created.
   */
  async create(name) {
    const command = new CreateBucketCommand({
      Bucket: name,
    });

    return await this.#client.send(command);
  }

  /**
   * @summary Lists the buckets in the client.
   * @param {Object} listBucketOptions - The options for listing buckets.
   * @returns {Promise<Array<Object>>} - A promise that resolves with an array of objects representing the buckets in the client.
   */
  async list(listBucketOptions = {}) {
    const command = new ListBucketsCommand(listBucketOptions),
      { Buckets } = await this.#client.send(command);

    return Buckets;
  }

  /**
   * @summary Deletes the specified bucket.
   * @param {string} name - The name of the bucket to delete.
   * @returns {Promise<void>} - A promise that resolves when the bucket is deleted.
   */
  async delete(name) {
    const command = new DeleteBucketCommand({
      Bucket: name,
    });

    return await this.#client.send(command);
  }
}

export default BucketManager;
