import { test } from "node:test";
import assert from "node:assert/strict";
import ObjectManager from "../src/objectManager.js";
import BucketManager from "../src/bucketManager.js";
import * as Path from "node:path";
import { writeFile } from "node:fs/promises";
import { v4 as uuidv4 } from "uuid";
import os from "node:os";

const s3Config = {
  endpoint: process.env.TEST_S3_ENDPOINT,
  credentials: {
    accessKeyId: process.env.TEST_S3_KEY,
    secretAccessKey: process.env.TEST_S3_SECRET,
  },
  region: process.env.TEST_S3_REGION,
};

async function createBucket(name) {
  // Initialize BucketManager
  const bucketManager = new BucketManager(s3Config);

  // Create bucket with name
  const bucketNameToCreate = name;
  await bucketManager.create(bucketNameToCreate);

  // List buckets and assert new bucket exists
  const currentBuckets = await bucketManager.list(),
    createdBucket = currentBuckets.find((currentBucket) => {
      return currentBucket.Name === bucketNameToCreate;
    });

  return typeof createdBucket !== "undefined";
}

async function uploadObject(bucket, key, body) {
  // Initialize ObjectManager
  const objectManager = new ObjectManager(s3Config, bucket);

  // Upload Object
  await objectManager.upload(key, body);

  // Confirm Object Uploaded
  const objectsList = await objectManager.list({
      Prefix: key,
      MaxKeys: 1,
    }),
    uploadedObject = objectsList.length > 0 ? objectsList[0] : undefined;

  return typeof uploadedObject !== "undefined";
}

test("upload object", async () => {
  // Create Bucket `create-object-test-pass
  const uploadTestBucket = `create-object-test-pass`;
  await createBucket(uploadTestBucket);

  // Upload object `create-object-test`
  const uploaded = await uploadObject(
    uploadTestBucket,
    `create-object-test`,
    Buffer.from("upload object", "utf-8"),
  );
  assert.strictEqual(uploaded, true);
});

test("download object", async () => {
  // Create bucket `download-object-test-pass`
  const downloadTestBucket = `download-object-test-pass`;
  await createBucket(downloadTestBucket);

  // Upload object `download-object-test`
  const objectNameToCreate = `download-object-test`;
  const uploaded = await uploadObject(
    downloadTestBucket,
    objectNameToCreate,
    Buffer.from("download object", "utf-8"),
  );
  if (uploaded === false) {
    throw Error(`Failed to create object [download-object-test]`);
  }

  // Download object `download-object-test` and assert it completes
  const objectManager = new ObjectManager(s3Config, downloadTestBucket);
  const downloadStream = await objectManager.download(objectNameToCreate),
    downloadFilename = uuidv4(),
    downloadPath = Path.resolve(os.tmpdir(), downloadFilename),
    writeFileResult = await writeFile(downloadPath, downloadStream);
  assert.strictEqual(typeof writeFileResult, "undefined");
});

test("list objects", async () => {
  // Create bucket `list-objects-test-pass`
  const listTestBucket = `list-objects-test-pass`;
  await createBucket(listTestBucket);

  let createdObjectCount = 0;
  while (createdObjectCount < 26) {
    // Upload objects `list-object-test-[x]`
    const objectNameToCreate = `list-object-test-${createdObjectCount}`;
    await uploadObject(
      listTestBucket,
      objectNameToCreate,
      Buffer.from(`list objects ${createdObjectCount}`, "utf-8"),
    );
    createdObjectCount++;
  }

  const objectManager = new ObjectManager(s3Config, listTestBucket);

  const bucketList = await objectManager.list({
    MaxKeys: 5,
    Prefix: `list-object-test-`,
  });
  assert.equal(bucketList.length, 26);
});

test("delete object", async () => {
  // Create bucket `delete-object-test-pass`
  const deleteTestBucket = `delete-object-test-pass`;
  await createBucket(deleteTestBucket);

  // Upload object `delete-object-test`
  const objectNameToCreate = `delete-object-test`;
  const uploaded = await uploadObject(
    deleteTestBucket,
    objectNameToCreate,
    Buffer.from("delete object", "utf-8"),
  );
  if (uploaded === false) {
    throw Error(`Failed to create object [delete-object-test]`);
  }

  // Initialize ObjectManager
  const objectManager = new ObjectManager(s3Config, deleteTestBucket);

  // Delete object `delete-object-test`
  await objectManager.delete(objectNameToCreate);

  // List bucket and assert new object doesn't exist
  const existingObjects = await objectManager.list({
      Prefix: objectNameToCreate,
      MaxKeys: 1,
    }),
    uploadedObject =
      existingObjects.length > 0 ? existingObjects[0] : undefined;
  assert.equal(typeof uploadedObject, "undefined");
});

/*test("copy object", async () => {
  // Create bucket `copy-object-test-pass-src`
  const bucketSrc = `copy-object-test-pass-src`;
  await createBucket(bucketSrc);

  // Upload object `copy-object-test`
  const objectNameToCreateSrc = `copy-object-test`;
  const uploaded = await uploadObject(
    bucketSrc,
    objectNameToCreateSrc,
    Buffer.from("copy object", "utf-8"),
  );

  // Create bucket `copy-object-test-pass-dest`
  const bucketDest = `copy-object-test-pass-dest`;
  await createBucket(bucketDest);

  // Initialize ObjectManager
  const objectManager = new ObjectManager(s3Config, bucketDest);

  // Copy object `copy-object-test` from `copy-object-test-pass-src` to `copy-object-test-pass-dest`
  await objectManager.copy(objectNameToCreateSrc, bucketSrc);

  // List bucket and assert new object exists
  const existingObjects = await objectManager.list({
      Prefix: objectNameToCreateSrc,
      MaxKeys: 1,
    }),
    copiedObject = existingObjects.length > 0 ? existingObjects[0] : undefined;
  assert.equal(copiedObject.Name, objectNameToCreateSrc);
});*/
