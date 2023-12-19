import {
  CreateBucketCommand,
  DeleteBucketCommand,
  GetBucketAclCommand,
  ListBucketsCommand,
  PutBucketAclCommand,
  S3Client,
} from "@aws-sdk/client-s3";

/** Provides methods for managing buckets in an S3 endpoint. */
class BucketManager {
  #DEFAULT_ENDPOINT = "https://s3.filebase.com";
  #DEFAULT_REGION = "us-east-1";

  #client;

  /**
   * @summary Creates a new instance of the constructor.
   * @param {string} clientKey - The access key ID for authentication.
   * @param {string} clientSecret - The secret access key for authentication.
   * @tutorial quickstart-bucket
   * @example
   * import { BucketManager } from "@filebase/sdk";
   * const bucketManager = new BucketManager("KEY_FROM_DASHBOARD", "SECRET_FROM_DASHBOARD");
   */
  constructor(clientKey, clientSecret) {
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
    this.#client = new S3Client(clientConfiguration);
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

  /**
   * @summary Sets the privacy of a given bucket.
   * @param {string} name - The name of the bucket to toggle.
   * @param {boolean} targetState - The new target state. [true=private,false=public]
   * @returns {Promise<boolean>} A promise that resolves to true if the bucket was successfully toggled.
   * @example
   * // Toggle bucket with label of `toggle-bucket-example`
   * await bucketManager.setPrivacy(`toggle-bucket-example`, true);  // Enabled
   * await bucketManager.setPrivacy(`toggle-bucket-example`, false); // Disabled
   */

  async setPrivacy(name, targetState) {
    const command = new PutBucketAclCommand({
      Bucket: name,
      ACL: targetState ? "private" : "public-read",
    });

    await this.#client.send(command);
    return true;
  }

  /**
   * @summary Gets the privacy of a given bucket
   * @param {string} name - The name of the bucket to query.
   * @returns {Promise<boolean>} A promise that resolves to true if the bucket is private.
   */
  async getPrivacy(name) {
    const command = new GetBucketAclCommand({
      Bucket: name,
    });

    const response = await this.#client.send(command),
      readPermission = response.Grants.find((grant) => {
        return grant.Grantee.Type === "Group" && grant.Permission === "READ";
      });
    return !(typeof readPermission !== "undefined");
  }
}

export default BucketManager;
