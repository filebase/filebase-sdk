import { test } from "node:test";
import assert from "node:assert/strict";
import NameManager from "../src/nameManager.js";

const TEST_CID = process.env.TEST_IPNS_CID,
  TEST_PRIVATE_KEY = process.env.TEST_IPNS_PRIVATE_KEY,
  TEST_PREFIX = Date.now(),
  S3_CONFIG = {
    endpoint: process.env.TEST_IPNS_ENDPOINT,
    credentials: {
      accessKeyId: process.env.TEST_IPNS_KEY,
      secretAccessKey: process.env.TEST_IPNS_SECRET,
    },
  };

test("delete name", async () => {
  const testNameLabel = `${TEST_PREFIX}-delete-name-test-pass`,
    nameManager = new NameManager(S3_CONFIG);
  await nameManager.create(testNameLabel, TEST_CID);
  await nameManager.delete(testNameLabel);
  const deletedName = await nameManager.list(testNameLabel);
  assert.strictEqual(deletedName, false);
});
test("create name", async () => {
  const testNameLabel = `${TEST_PREFIX}-create-name-test-pass`,
    nameManager = new NameManager(S3_CONFIG),
    createdName = await nameManager.create(testNameLabel, TEST_CID);
  await nameManager.delete(testNameLabel);
  assert.strictEqual(createdName.label, testNameLabel);
  assert.strictEqual(createdName.cid, TEST_CID);
});

test("import name", async () => {
  const testNameLabel = `${TEST_PREFIX}-import-name-test-pass`,
    nameManager = new NameManager(S3_CONFIG),
    importedName = await nameManager.import(
      testNameLabel,
      TEST_CID,
      TEST_PRIVATE_KEY,
    );
  await nameManager.delete(testNameLabel);
  assert.strictEqual(importedName.label, testNameLabel);
  assert.strictEqual(importedName.cid, TEST_CID);
});

test("update name", async () => {
  const testNameLabel = `${TEST_PREFIX}-update-name-test-pass`,
    nameManager = new NameManager(S3_CONFIG),
    createdName = await nameManager.create(testNameLabel, TEST_CID),
    updatedName = await nameManager.update(createdName.label, TEST_CID);
  await nameManager.delete(testNameLabel);
  assert.strictEqual(updatedName, true);
});

test("resolve name", async () => {
  const testNameLabel = `${TEST_PREFIX}-resolve-name-test-pass`,
    nameManager = new NameManager(S3_CONFIG),
    createdName = await nameManager.create(testNameLabel, TEST_CID),
    resolvedName = await nameManager.resolve(createdName.label);
  await nameManager.delete(testNameLabel);
  assert.strictEqual(resolvedName.label, testNameLabel);
  assert.strictEqual(resolvedName.cid, TEST_CID);
});

test("list names", async () => {
  const testNameLabel = `${TEST_PREFIX}-list-names-test-pass`,
    nameManager = new NameManager(S3_CONFIG);
  for (let i = 0; i < 10; i++) {
    await nameManager.create(`${testNameLabel}-${i}`, TEST_CID);
  }
  const namesList = await nameManager.list();
  for (let i = 0; i < 10; i++) {
    await nameManager.delete(`${testNameLabel}-${i}`);
  }
  assert.strictEqual(namesList.length, 10);
});

test("toggle name", async () => {
  const testNameLabel = `${TEST_PREFIX}-toggle-name-test-pass`,
    nameManager = new NameManager(S3_CONFIG);
  await nameManager.create(testNameLabel, TEST_CID, {
    enabled: false,
  });
  const resolvedName = await nameManager.list(testNameLabel);
  if (resolvedName?.enabled === true) {
    throw new Error(`Incorrect State on Resolved Name`);
  }
  await nameManager.toggle(testNameLabel, true);
  const updatedName = await nameManager.resolve(testNameLabel);
  await nameManager.delete(testNameLabel);
  assert.strictEqual(updatedName.label, testNameLabel);
  assert.strictEqual(updatedName.cid, TEST_CID);
  assert.strictEqual(updatedName.enabled, true);
});
