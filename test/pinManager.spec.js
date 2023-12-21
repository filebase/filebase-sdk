import { test } from "node:test";
import assert from "node:assert/strict";
import { PinManager } from "../src/index.js";
import { v4 as uuidv4 } from "uuid";
import Path from "node:path";
import os from "node:os";
import { writeFile } from "node:fs/promises";
import BucketManager from "../src/bucketManager.js";

const TEST_CID_1 = "QmSEu6zGwKgkQA3ZKaDnvkrwre1kkQa7eRFCbQi7waNwTT",
  TEST_CID_2 = "QmNXcMdXadLRTxLpHJMsGnaeKz26d2F6NgUDVWScp54EfC",
  TEST_PREFIX = Date.now();

async function createBucket(name) {
  // Initialize BucketManager
  const bucketManager = new BucketManager(
    process.env.TEST_NAME_KEY || process.env.TEST_KEY,
    process.env.TEST_NAME_SECRET || process.env.TEST_SECRET,
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

test("create pin", async () => {
  const testBucketName = `${TEST_PREFIX}-create-pin-test-pass`,
    testPinName = `${TEST_PREFIX}-create-pin-test-pass`,
    pinManager = new PinManager(
      process.env.TEST_NAME_KEY || process.env.TEST_KEY,
      process.env.TEST_NAME_SECRET || process.env.TEST_SECRET,
      {
        bucket: testBucketName,
      },
    );
  await createBucket(testBucketName);
  try {
    const createdPin = await pinManager.create(testPinName, TEST_CID_1);
    assert.strictEqual(createdPin.pin.cid, TEST_CID_1);
    await pinManager.delete(createdPin.requestid);
  } finally {
    await deleteBucket(testBucketName);
  }
});

test("replace pin with name", async () => {
  const testBucketName = `${TEST_PREFIX}-replname-pin-test-pass`,
    testPinName = `${TEST_PREFIX}-replace-pin-test-pass`,
    pinManager = new PinManager(
      process.env.TEST_NAME_KEY || process.env.TEST_KEY,
      process.env.TEST_NAME_SECRET || process.env.TEST_SECRET,
      {
        bucket: testBucketName,
      },
    );
  await createBucket(testBucketName);
  try {
    const createdPin = await pinManager.create(testPinName, TEST_CID_1);
    assert.strictEqual(createdPin.pin.cid, TEST_CID_1);
    const replacedPin = await pinManager.replace(
      createdPin.requestid,
      TEST_CID_2,
      {
        name: `${testPinName}-replaced`,
      },
    );
    assert.strictEqual(replacedPin.pin.cid, TEST_CID_2);
    assert.strictEqual(replacedPin.pin.name, `${testPinName}-replaced`);
    await pinManager.delete(replacedPin.requestid);
  } finally {
    await deleteBucket(testBucketName);
  }
});

test("replace pin without name", async () => {
  const testBucketName = `${TEST_PREFIX}-replace-pin-test-pass`,
    testPinName = `${TEST_PREFIX}-replace-pin-test-pass`,
    pinManager = new PinManager(
      process.env.TEST_NAME_KEY || process.env.TEST_KEY,
      process.env.TEST_NAME_SECRET || process.env.TEST_SECRET,
      {
        bucket: testBucketName,
      },
    );
  await createBucket(testBucketName);
  try {
    const createdPin = await pinManager.create(testPinName, TEST_CID_1);
    assert.strictEqual(createdPin.pin.cid, TEST_CID_1);
    const replacedPin = await pinManager.replace(
      createdPin.requestid,
      TEST_CID_2,
    );
    assert.strictEqual(replacedPin.pin.name, testPinName);
    assert.strictEqual(replacedPin.pin.cid, TEST_CID_2);
    await pinManager.delete(replacedPin.requestid);
  } finally {
    await deleteBucket(testBucketName);
  }
});

test("get pin", async () => {
  const testBucketName = `${TEST_PREFIX}-get-pin-test-pass`,
    testPinName = `${TEST_PREFIX}-get-pin-test-pass`,
    pinManager = new PinManager(
      process.env.TEST_NAME_KEY || process.env.TEST_KEY,
      process.env.TEST_NAME_SECRET || process.env.TEST_SECRET,
      {
        bucket: testBucketName,
      },
    );
  await createBucket(testBucketName);
  try {
    const createdPin = await pinManager.create(testPinName, TEST_CID_1);
    assert.strictEqual(createdPin.pin.cid, TEST_CID_1);
    try {
      const queriedPin = await pinManager.get(createdPin.requestid);
      assert.strictEqual(queriedPin.requestid, createdPin.requestid);
      assert.strictEqual(queriedPin.pin.cid, TEST_CID_1);
    } finally {
      await pinManager.delete(createdPin.requestid);
    }
  } finally {
    await deleteBucket(testBucketName);
  }
});

test("download pin", async () => {
  const testBucketName = `${TEST_PREFIX}-download-pin-test-pass`,
    testPinName = `${TEST_PREFIX}-download-pin-test-pass`,
    pinManager = new PinManager(
      process.env.TEST_NAME_KEY || process.env.TEST_KEY,
      process.env.TEST_NAME_SECRET || process.env.TEST_SECRET,
      {
        bucket: testBucketName,
        gateway: {
          endpoint: process.env.TEST_IPFS_GATEWAY,
        },
      },
    );
  await createBucket(testBucketName);
  try {
    const createdPin = await pinManager.create(testPinName, TEST_CID_1);
    try {
      assert.strictEqual(createdPin.pin.cid, TEST_CID_1);
      const downloadStream = await pinManager.download(createdPin.pin.cid),
        downloadFilename = uuidv4(),
        downloadPath = Path.resolve(os.tmpdir(), downloadFilename),
        writeFileResult = await writeFile(downloadPath, downloadStream);
      assert.strictEqual(typeof writeFileResult, "undefined");
    } finally {
      await pinManager.delete(createdPin.requestid);
    }
  } finally {
    await deleteBucket(testBucketName);
  }
});

test("download pin by reference", async () => {
  const testBucketName = `${TEST_PREFIX}-download-ref-test-pass`,
    testPinName = `${TEST_PREFIX}-download-pin-test-pass`,
    pinManager = new PinManager(
      process.env.TEST_NAME_KEY || process.env.TEST_KEY,
      process.env.TEST_NAME_SECRET || process.env.TEST_SECRET,
      {
        bucket: testBucketName,
        gateway: {
          endpoint: process.env.TEST_IPFS_GATEWAY,
        },
      },
    );
  await createBucket(testBucketName);
  try {
    const createdPin = await pinManager.create(testPinName, TEST_CID_1);
    try {
      assert.strictEqual(createdPin.pin.cid, TEST_CID_1);
      const pinToDownload = await pinManager.get(createdPin.requestid),
        downloadStream = await pinToDownload.download(),
        downloadFilename = uuidv4(),
        downloadPath = Path.resolve(os.tmpdir(), downloadFilename),
        writeFileResult = await writeFile(downloadPath, downloadStream);
      assert.strictEqual(typeof writeFileResult, "undefined");
    } finally {
      await pinManager.delete(createdPin.requestid);
    }
  } finally {
    await deleteBucket(testBucketName);
  }
});

test("list pins", async () => {
  const testBucketName = `${TEST_PREFIX}-list-pin-test-pass`,
    testPinName = `${TEST_PREFIX}-list-pin-test-pass`,
    pinManager = new PinManager(
      process.env.TEST_NAME_KEY || process.env.TEST_KEY,
      process.env.TEST_NAME_SECRET || process.env.TEST_SECRET,
      {
        bucket: testBucketName,
      },
    );
  await createBucket(testBucketName);
  try {
    const existingPinList = await pinManager.list(),
      countToCreate = 25;
    let createdPins = [];
    for (let i = 0; i < countToCreate; i++) {
      createdPins.push(
        await pinManager.create(`${testPinName}_${i}`, TEST_CID_1),
      );
    }
    try {
      const pinList = await pinManager.list();
      assert.strictEqual(pinList.count, existingPinList.count + countToCreate);
    } finally {
      for (const createdPin of createdPins) {
        await pinManager.delete(createdPin.requestid);
      }
    }
  } finally {
    await deleteBucket(testBucketName);
  }
});

test("delete pin", async () => {
  const testBucketName = `${TEST_PREFIX}-delete-pin-test-pass`,
    testPinName = `${TEST_PREFIX}-delete-pin-test-pass`,
    pinManager = new PinManager(
      process.env.TEST_NAME_KEY || process.env.TEST_KEY,
      process.env.TEST_NAME_SECRET || process.env.TEST_SECRET,
      {
        bucket: testBucketName,
      },
    );
  await createBucket(testBucketName);
  try {
    const createdPin = await pinManager.create(testPinName, TEST_CID_1);
    assert.strictEqual(createdPin.pin.cid, TEST_CID_1);
    await pinManager.delete(createdPin.requestid);
    const deletedPin = await pinManager.get(createdPin.requestid);
    assert.strictEqual(deletedPin, false);
  } finally {
    await deleteBucket(testBucketName);
  }
});
