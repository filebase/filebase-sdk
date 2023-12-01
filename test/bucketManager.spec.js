import test from "node:test";
import assert from "node:assert/strict";
import BucketManager from "../src/bucketManager.js";

const s3Config = {
  endpoint: process.env.TEST_S3_ENDPOINT,
  credentials: {
    accessKeyId: process.env.TEST_S3_KEY,
    secretAccessKey: process.env.TEST_S3_SECRET,
  },
  region: process.env.TEST_S3_REGION,
};

test("create bucket", async (t) => {
  // Initialize BucketManager
  const bucketManager = new BucketManager(s3Config);

  // Create bucket `create-bucket-test-pass`
  const bucketNameToCreate = `create-bucket-test-pass`;
  await bucketManager.create(bucketNameToCreate);

  // List buckets and assert new bucket exists
  const currentBuckets = await bucketManager.list(),
    createdBucket = currentBuckets.find((currentBucket) => {
      return currentBucket.Name === bucketNameToCreate;
    });
  assert.equal(createdBucket.Name, bucketNameToCreate);
});

test("delete bucket", async (t) => {
  // Initialize BucketManager
  const bucketManager = new BucketManager(s3Config);

  // Create bucket `delete-bucket-test-pass`
  const bucketNameToCreate = `delete-bucket-test-pass`;
  await bucketManager.create(bucketNameToCreate);

  // List buckets and assert new bucket exists
  const currentBuckets = await bucketManager.list(),
    createdBucket = currentBuckets.find((currentBucket) => {
      return currentBucket.Name === bucketNameToCreate;
    });
  if (typeof createdBucket === "undefined") {
    throw new Error(`Unable to create test bucket [delete-bucket-test-pass]`);
  }

  // Delete new bucket
  await bucketManager.delete(bucketNameToCreate);

  // List buckets and assert new bucket does not exist
  const updatedBuckets = await bucketManager.list(),
    deletedBucket = updatedBuckets.find((updatedBucket) => {
      return updatedBucket.Name === bucketNameToCreate;
    });
  assert.equal(typeof deletedBucket, "undefined");
});
