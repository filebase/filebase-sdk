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
  TEST_PREFIX = Date.now(),
  TEST_BUCKET = `${TEST_PREFIX}-pinning-test`;

async function ensureBucketExists(bucketName) {
  try {
    // Initialize BucketManager
    const bucketManager = new BucketManager(
      process.env.TEST_NAME_KEY || process.env.TEST_KEY,
      process.env.TEST_NAME_SECRET || process.env.TEST_SECRET,
    );
    await bucketManager.create(bucketName);
  } catch (err) {
    console.log(`Bucket Already Exists`);
  }
}

test("create pin", async () => {
  const testPinName = `${TEST_PREFIX}-create-pin-test-pass`,
    pinManager = new PinManager(
      process.env.TEST_NAME_KEY || process.env.TEST_KEY,
      process.env.TEST_NAME_SECRET || process.env.TEST_SECRET,
      {
        bucket: TEST_BUCKET,
      },
    );
  await ensureBucketExists(TEST_BUCKET);
  const createdPin = await pinManager.create(testPinName, TEST_CID_1);
  assert.strictEqual(createdPin.pin.cid, TEST_CID_1);
});

test("replace pin with name", async () => {
  const testPinName = `${TEST_PREFIX}-replace-pin-test-pass`,
    pinManager = new PinManager(
      process.env.TEST_NAME_KEY || process.env.TEST_KEY,
      process.env.TEST_NAME_SECRET || process.env.TEST_SECRET,
      {
        bucket: TEST_BUCKET,
      },
    );
  await ensureBucketExists(TEST_BUCKET);
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
});

test("replace pin without name", async () => {
  const testPinName = `${TEST_PREFIX}-replace-pin-test-pass`,
    pinManager = new PinManager(
      process.env.TEST_NAME_KEY || process.env.TEST_KEY,
      process.env.TEST_NAME_SECRET || process.env.TEST_SECRET,
      {
        bucket: TEST_BUCKET,
      },
    );
  await ensureBucketExists(TEST_BUCKET);
  const createdPin = await pinManager.create(testPinName, TEST_CID_1);
  assert.strictEqual(createdPin.pin.cid, TEST_CID_1);
  const replacedPin = await pinManager.replace(
    createdPin.requestid,
    TEST_CID_2,
  );
  assert.strictEqual(replacedPin.pin.name, testPinName);
  assert.strictEqual(replacedPin.pin.cid, TEST_CID_2);
  await pinManager.delete(replacedPin.requestid);
});

test("get pin", async () => {
  const testPinName = `${TEST_PREFIX}-get-pin-test-pass`,
    pinManager = new PinManager(
      process.env.TEST_NAME_KEY || process.env.TEST_KEY,
      process.env.TEST_NAME_SECRET || process.env.TEST_SECRET,
      {
        bucket: TEST_BUCKET,
      },
    );
  await ensureBucketExists(TEST_BUCKET);
  const createdPin = await pinManager.create(testPinName, TEST_CID_1);
  assert.strictEqual(createdPin.pin.cid, TEST_CID_1);
  try {
    const queriedPin = await pinManager.get(createdPin.requestid);
    assert.strictEqual(queriedPin.requestid, createdPin.requestid);
    assert.strictEqual(queriedPin.pin.cid, TEST_CID_1);
  } finally {
    await pinManager.delete(createdPin.requestid);
  }
});

test("download pin", async () => {
  const testPinName = `${TEST_PREFIX}-download-pin-test-pass`,
    pinManager = new PinManager(
      process.env.TEST_NAME_KEY || process.env.TEST_KEY,
      process.env.TEST_NAME_SECRET || process.env.TEST_SECRET,
      {
        bucket: TEST_BUCKET,
        gateway: {
          endpoint: process.env.TEST_IPFS_GATEWAY,
        },
      },
    );
  await ensureBucketExists(TEST_BUCKET);
  const createdPin = await pinManager.create(testPinName, TEST_CID_1);
  assert.strictEqual(createdPin.pin.cid, TEST_CID_1);
  const downloadStream = await pinManager.download(createdPin.pin.cid),
    downloadFilename = uuidv4(),
    downloadPath = Path.resolve(os.tmpdir(), downloadFilename),
    writeFileResult = await writeFile(downloadPath, downloadStream);
  assert.strictEqual(typeof writeFileResult, "undefined");
});

test("download pin by reference", async () => {
  const testPinName = `${TEST_PREFIX}-download-pin-test-pass`,
    pinManager = new PinManager(
      process.env.TEST_NAME_KEY || process.env.TEST_KEY,
      process.env.TEST_NAME_SECRET || process.env.TEST_SECRET,
      {
        bucket: TEST_BUCKET,
        gateway: {
          endpoint: process.env.TEST_IPFS_GATEWAY,
        },
      },
    );
  await ensureBucketExists(TEST_BUCKET);
  const createdPin = await pinManager.create(testPinName, TEST_CID_1);
  assert.strictEqual(createdPin.pin.cid, TEST_CID_1);
  const pinToDownload = await pinManager.get(createdPin.requestid),
    downloadStream = await pinToDownload.download(),
    downloadFilename = uuidv4(),
    downloadPath = Path.resolve(os.tmpdir(), downloadFilename),
    writeFileResult = await writeFile(downloadPath, downloadStream);
  assert.strictEqual(typeof writeFileResult, "undefined");
});

test("list pins", async () => {
  const testPinName = `${TEST_PREFIX}-list-pin-test-pass`,
    pinManager = new PinManager(
      process.env.TEST_NAME_KEY || process.env.TEST_KEY,
      process.env.TEST_NAME_SECRET || process.env.TEST_SECRET,
      {
        bucket: TEST_BUCKET,
      },
    );
  await ensureBucketExists(TEST_BUCKET);
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
});

test("delete pin", async () => {
  const testPinName = `${TEST_PREFIX}-delete-pin-test-pass`,
    pinManager = new PinManager(
      process.env.TEST_NAME_KEY || process.env.TEST_KEY,
      process.env.TEST_NAME_SECRET || process.env.TEST_SECRET,
      {
        bucket: TEST_BUCKET,
      },
    );
  await ensureBucketExists(TEST_BUCKET);
  const createdPin = await pinManager.create(testPinName, TEST_CID_1);
  assert.strictEqual(createdPin.pin.cid, TEST_CID_1);
  await pinManager.delete(createdPin.requestid);
  const deletedPin = await pinManager.get(createdPin.requestid);
  assert.strictEqual(deletedPin, false);
});
