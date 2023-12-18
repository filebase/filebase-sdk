import { test } from "node:test";
import assert from "node:assert/strict";
import ObjectManager from "../src/objectManager.js";
import BucketManager from "../src/bucketManager.js";
import * as Path from "node:path";
import { writeFile } from "node:fs/promises";
import { v4 as uuidv4 } from "uuid";
import os from "node:os";

const TEST_PREFIX = Date.now();

async function createBucket(name) {
  // Initialize BucketManager
  const bucketManager = new BucketManager(
    process.env.TEST_S3_KEY || process.env.TEST_KEY,
    process.env.TEST_S3_SECRET || process.env.TEST_SECRET,
  );

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
  const objectManager = new ObjectManager(
    process.env.TEST_S3_KEY || process.env.TEST_KEY,
    process.env.TEST_S3_SECRET || process.env.TEST_SECRET,
    { bucket },
  );

  // Upload Object
  await objectManager.upload(key, body);

  // Confirm Object Uploaded
  const objectsList = await objectManager.list({
      Prefix: key,
      MaxKeys: 1,
    }),
    uploadedObject =
      objectsList.Contents.length > 0 ? objectsList.Contents[0] : undefined;

  return typeof uploadedObject !== "undefined";
}

async function deleteObject(bucket, key) {
  // Initialize ObjectManager
  const objectManager = new ObjectManager(
    process.env.TEST_S3_KEY || process.env.TEST_KEY,
    process.env.TEST_S3_SECRET || process.env.TEST_SECRET,
    { bucket },
  );

  // Delete Object
  await objectManager.delete(key);
  return true;
}

async function deleteBucket(bucket) {
  // Initialize BucketManager
  const bucketManager = new BucketManager(
    process.env.TEST_S3_KEY || process.env.TEST_KEY,
    process.env.TEST_S3_SECRET || process.env.TEST_SECRET,
  );

  // Delete Bucket
  await bucketManager.delete(bucket);
  return true;
}

test("delete object", async () => {
  // Create bucket `delete-object-test-pass`
  const deleteTestBucket = `${TEST_PREFIX}-delete-object-test-pass`;
  await createBucket(deleteTestBucket);

  try {
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
    const objectManager = new ObjectManager(
      process.env.TEST_S3_KEY || process.env.TEST_KEY,
      process.env.TEST_S3_SECRET || process.env.TEST_SECRET,
      { bucket: deleteTestBucket },
    );

    // Delete object `delete-object-test`
    await objectManager.delete(objectNameToCreate);

    // List bucket and assert new object doesn't exist
    const existingObjects = await objectManager.list({
        Prefix: objectNameToCreate,
        MaxKeys: 1,
      }),
      uploadedObject =
        existingObjects.Contents.length > 0
          ? existingObjects.Contents[0]
          : undefined;
    assert.equal(typeof uploadedObject, "undefined");
  } finally {
    await deleteBucket(deleteTestBucket);
  }
});

test("upload object", async () => {
  // Create Bucket `create-object-test-pass
  const uploadTestBucket = `${TEST_PREFIX}-create-object-test-pass`;
  await createBucket(uploadTestBucket);

  try {
    // Upload object `create-object-test`
    const uploaded = await uploadObject(
      uploadTestBucket,
      `create-object-test`,
      Buffer.from("upload object", "utf-8"),
    );

    assert.strictEqual(uploaded, true);
    await deleteObject(uploadTestBucket, `create-object-test`);
  } finally {
    await deleteBucket(uploadTestBucket);
  }
});

test("upload directory", async () => {
  // Create Bucket `create-object-test-pass
  const uploadDirectoryTestBucket = `${TEST_PREFIX}-create-directory-test-pass`;
  await createBucket(uploadDirectoryTestBucket);

  try {
    // Upload object `create-object-test`
    const uploaded = await uploadObject(
      uploadDirectoryTestBucket,
      `create-directory-test`,
      [
        {
          path: "/testObjects/1.txt",
          content: Buffer.from("upload test object", "utf-8"),
        },
        {
          path: "/testObjects/deep/1.txt",
          content: Buffer.from("upload deep test object", "utf-8"),
        },
        {
          path: "/topLevel.txt",
          content: Buffer.from("upload top level test object", "utf-8"),
        },
      ],
    );
    assert.strictEqual(uploaded, true);
    await deleteObject(uploadDirectoryTestBucket, `create-directory-test`);
  } finally {
    await deleteBucket(uploadDirectoryTestBucket);
  }
});

test("download object", async () => {
  // Create bucket `download-object-test-pass`
  const downloadTestBucket = `${TEST_PREFIX}-download-object-test-pass`;
  await createBucket(downloadTestBucket);

  try {
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

    try {
      // Download object `download-object-test` and assert it completes
      const objectManager = new ObjectManager(
        process.env.TEST_S3_KEY || process.env.TEST_KEY,
        process.env.TEST_S3_SECRET || process.env.TEST_SECRET,
        { bucket: downloadTestBucket },
      );
      const downloadStream = await objectManager.download(objectNameToCreate),
        downloadFilename = uuidv4(),
        downloadPath = Path.resolve(os.tmpdir(), downloadFilename),
        writeFileResult = await writeFile(downloadPath, downloadStream);
      assert.strictEqual(typeof writeFileResult, "undefined");
    } finally {
      await deleteObject(downloadTestBucket, objectNameToCreate);
    }
  } finally {
    await deleteBucket(downloadTestBucket);
  }
});

test("list objects", async () => {
  // Create bucket `list-objects-test-pass`
  const listTestBucket = `${TEST_PREFIX}-list-objects-test-pass`;
  await createBucket(listTestBucket);

  try {
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

    const objectManager = new ObjectManager(
      process.env.TEST_S3_KEY || process.env.TEST_KEY,
      process.env.TEST_S3_SECRET || process.env.TEST_SECRET,
      { bucket: listTestBucket },
    );

    const objectList = await objectManager.list({
      MaxKeys: 50,
      Prefix: `list-object-test-`,
    });
    assert.equal(objectList.Contents.length, 26);

    let deletedObjectCount = 0;
    while (deletedObjectCount < 26) {
      // Delete objects `list-object-test-[x]`
      const objectNameToDelete = `list-object-test-${deletedObjectCount}`;
      await deleteObject(listTestBucket, objectNameToDelete);
      deletedObjectCount++;
    }
  } finally {
    await deleteBucket(listTestBucket);
  }
});
