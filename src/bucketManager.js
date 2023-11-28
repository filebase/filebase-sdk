import {
  CreateBucketCommand,
  DeleteBucketCommand,
  ListBucketsCommand,
  S3Client,
} from "@aws-sdk/client-s3";
export default class BucketManager {
  #client;
  #defaultBucket;

  constructor(S3ClientConfig) {
    // Login to S3 Endpoint
    this.#client = new S3Client(S3ClientConfig);
  }

  async create(name) {
    const command = new CreateBucketCommand({
      Bucket: name,
    });

    return await this.#client.send(command);
  }

  async list() {
    const command = new ListBucketsCommand({}),
      { Buckets } = await this.#client.send(command);

    return Buckets;
  }

  async delete(name = this.#defaultBucket) {
    const command = new DeleteBucketCommand({
      Bucket: name,
    });

    return await this.#client.send(command);
  }
}
