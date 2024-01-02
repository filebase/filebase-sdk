import test from "node:test";
import assert from "node:assert/strict";
import { BucketManager } from "../dist/index.mjs";

const TEST_PREFIX = Date.now();

test("create bucket", async (t) => {
  // Initialize BucketManager
  const bucketManager = new BucketManager(
    process.env.TEST_S3_KEY || process.env.TEST_KEY,
    process.env.TEST_S3_SECRET || process.env.TEST_SECRET,
  );

  // Create bucket `create-bucket-test-pass`
  const bucketNameToCreate = `${TEST_PREFIX}-create-bucket-test-pass`;
  await bucketManager.create(bucketNameToCreate);

  try {
    // List buckets
    const currentBuckets = await bucketManager.list(),
      createdBucket = currentBuckets.find((currentBucket) => {
        return currentBucket.Name === bucketNameToCreate;
      });

    // Assert new bucket exists
    assert.equal(createdBucket.Name, bucketNameToCreate);
  } finally {
    // Delete new bucket
    await bucketManager.delete(bucketNameToCreate);
  }
});

test("list buckets", async () => {
  const testBucketName = `${TEST_PREFIX}-list-bucket-test-pass`,
    bucketManager = new BucketManager(
      process.env.TEST_S3_KEY || process.env.TEST_KEY,
      process.env.TEST_S3_SECRET || process.env.TEST_SECRET,
    ),
    initialBucketsList = await bucketManager.list(),
    countToCreate = 3;
  for (let i = 0; i < countToCreate; i++) {
    await bucketManager.create(`${testBucketName}-${i}`);
  }
  const bucketsList = await bucketManager.list();
  for (let i = 0; i < countToCreate; i++) {
    await bucketManager.delete(`${testBucketName}-${i}`);
  }
  assert.strictEqual(
    bucketsList.length,
    initialBucketsList.length + countToCreate,
  );
});

test("delete bucket", async (t) => {
  // Initialize BucketManager
  const bucketManager = new BucketManager(
    process.env.TEST_S3_KEY || process.env.TEST_KEY,
    process.env.TEST_S3_SECRET || process.env.TEST_SECRET,
  );

  // Create bucket `delete-bucket-test-pass`
  const bucketNameToCreate = `${TEST_PREFIX}-delete-bucket-test-pass`;
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

test("set bucket privacy to public", async (t) => {
  // Initialize BucketManager
  const bucketManager = new BucketManager(
    process.env.TEST_S3_KEY || process.env.TEST_KEY,
    process.env.TEST_S3_SECRET || process.env.TEST_SECRET,
  );

  // Create bucket `toggle-bucket-test-pass`
  const bucketNameToCreate = `${TEST_PREFIX}-toggle-bucket-test-pass`;
  await bucketManager.create(bucketNameToCreate);

  try {
    // List buckets
    const currentBuckets = await bucketManager.list(),
      createdBucket = currentBuckets.find((currentBucket) => {
        return currentBucket.Name === bucketNameToCreate;
      });

    // Check Privacy
    const initialPrivacy = await bucketManager.getPrivacy(bucketNameToCreate);
    if (initialPrivacy === false) {
      throw new Error(`Unexpected Privacy State on Bucket`);
    }

    // Toggle Privacy
    await bucketManager.setPrivacy(bucketNameToCreate, false);

    // Check Privacy
    const updatedPrivacy = await bucketManager.getPrivacy(bucketNameToCreate);
    if (updatedPrivacy === true) {
      throw new Error(`Unexpected Privacy State on Bucket`);
    }

    // Assert new bucket exists
    assert.equal(createdBucket.Name, bucketNameToCreate);
  } finally {
    // Delete new bucket
    await bucketManager.delete(bucketNameToCreate);
  }
});
