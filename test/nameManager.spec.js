import { test } from "node:test";
import assert from "node:assert/strict";
import NameManager from "../src/nameManager.js";

const s3Config = {
  endpoint: process.env.TEST_S3_ENDPOINT,
  credentials: {
    accessKeyId: process.env.TEST_S3_KEY,
    secretAccessKey: process.env.TEST_S3_SECRET,
  },
  region: process.env.TEST_S3_REGION,
};

test("delete name", async () => {
  const testNameLabel = `delete-name-test-pass`,
    nameManager = new NameManager(s3Config),
    createdName = await nameManager.create(testNameLabel);
  await nameManager.delete(testNameLabel);
  assert.strictEqual(createdName.label, testNameLabel);
});
test("create name", async () => {
  const testNameLabel = `create-name-test-pass`,
    nameManager = new NameManager(s3Config),
    createdName = await nameManager.create(testNameLabel);
  await nameManager.delete(testNameLabel);
  assert.strictEqual(createdName.label, testNameLabel);
});

test("import name", async () => {
  const testNameLabel = `import-name-test-pass`,
    testNamePrivateKey =
      "CAESQAzjYGmMMK9wjF7PpgC7v4YAGiirw6OQ3So5Sm23SvnUiHe6bfUNOFKmyCXRxh4yXVwFAtvYeq/bZGB1ROPgoWQ=",
    nameManager = new NameManager(s3Config),
    importedName = await nameManager.import(testNameLabel, testNamePrivateKey);
  await nameManager.delete(testNameLabel);
  assert.strictEqual(importedName.label, testNameLabel);
});

test("update name", async () => {
  const testNameLabel = `update-name-test-pass`,
    testNameValue = "QmeSNqhnDa45qg349oSaXGYx6FPsePGVqGCfHK7BWUwjub",
    nameManager = new NameManager(s3Config),
    createdName = await nameManager.create(testNameLabel),
    updatedName = await nameManager.update(createdName.label, testNameValue);
  await nameManager.delete(testNameLabel);
  assert.strictEqual(updatedName.cid, testNameLabel);
});

test("list name", async () => {
  const testNameLabel = `resolve-name-test-pass`,
    testNameValue = "QmeSNqhnDa45qg349oSaXGYx6FPsePGVqGCfHK7BWUwjub",
    nameManager = new NameManager(s3Config),
    createdName = await nameManager.create(testNameLabel, testNameValue),
    resolvedName = await nameManager.list(createdName.label);
  await nameManager.delete(testNameLabel);
  assert.strictEqual(resolvedName.cid, testNameValue);
});

test("list names", async () => {
  const testNameLabel = `list-names-test-pass`,
    nameManager = new NameManager(s3Config);
  for (let i = 0; i < 10; i++) {
    await nameManager.create(`${testNameLabel}-${i}`);
  }
  const namesList = await nameManager.list();
  await nameManager.delete(testNameLabel);
  assert.strictEqual(namesList.length, 10);
});

test("toggle name", async () => {
  const testNameLabel = `toggle-name-test-pass`,
    nameManager = new NameManager(s3Config),
    createdName = await nameManager.create(
      testNameLabel,
      "QmeSNqhnDa45qg349oSaXGYx6FPsePGVqGCfHK7BWUwjub",
      {
        enabled: false,
      },
    ),
    resolvedName = await nameManager.list(testNameLabel);
  if (resolvedName?.enabled === true) {
    throw new Error(`Incorrect State on Resolved Name`);
  }
  await nameManager.toggle(testNameLabel, true);
  const updatedName = await nameManager.list(testNameLabel);
  await nameManager.delete(testNameLabel);
  assert.strictEqual(updatedName.enabled, true);
});
