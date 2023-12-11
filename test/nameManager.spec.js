import { test } from "node:test";
import assert from "node:assert/strict";
import NameManager from "../src/nameManager.js";

const TEST_CID = process.env.TEST_NAME_CID,
  TEST_PRIVATE_KEY = process.env.TEST_NAME_PRIVATE_KEY,
  TEST_PREFIX = Date.now();

test("delete name", async () => {
  const testNameLabel = `${TEST_PREFIX}-delete-name-test-pass`,
    nameManager = new NameManager(
      process.env.TEST_NAME_KEY || process.env.TEST_KEY,
      process.env.TEST_NAME_SECRET || process.env.TEST_SECRET,
    );
  await nameManager.create(testNameLabel, TEST_CID);
  await nameManager.delete(testNameLabel);
  const deletedName = await nameManager.get(testNameLabel);
  assert.strictEqual(deletedName, false);
});
test("create name", async () => {
  const testNameLabel = `${TEST_PREFIX}-create-name-test-pass`,
    nameManager = new NameManager(
      process.env.TEST_NAME_KEY || process.env.TEST_KEY,
      process.env.TEST_NAME_SECRET || process.env.TEST_SECRET,
    ),
    createdName = await nameManager.create(testNameLabel, TEST_CID);
  await nameManager.delete(testNameLabel);
  assert.strictEqual(createdName.label, testNameLabel);
  assert.strictEqual(createdName.cid, TEST_CID);
});

test("import name", async () => {
  const testNameLabel = `${TEST_PREFIX}-import-name-test-pass`,
    nameManager = new NameManager(
      process.env.TEST_NAME_KEY || process.env.TEST_KEY,
      process.env.TEST_NAME_SECRET || process.env.TEST_SECRET,
    ),
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
    nameManager = new NameManager(
      process.env.TEST_NAME_KEY || process.env.TEST_KEY,
      process.env.TEST_NAME_SECRET || process.env.TEST_SECRET,
    ),
    createdName = await nameManager.create(testNameLabel, TEST_CID),
    updatedName = await nameManager.update(createdName.label, TEST_CID);
  await nameManager.delete(testNameLabel);
  assert.strictEqual(updatedName, true);
});

test("get name", async () => {
  const testNameLabel = `${TEST_PREFIX}-get-name-test-pass`,
    nameManager = new NameManager(
      process.env.TEST_NAME_KEY || process.env.TEST_KEY,
      process.env.TEST_NAME_SECRET || process.env.TEST_SECRET,
    ),
    createdName = await nameManager.create(testNameLabel, TEST_CID),
    testName = await nameManager.get(createdName.label);
  await nameManager.delete(testNameLabel);
  assert.strictEqual(testName.label, testNameLabel);
  assert.strictEqual(testName.cid, TEST_CID);
});

test("list names", async () => {
  const testNameLabel = `${TEST_PREFIX}-list-names-test-pass`,
    nameManager = new NameManager(
      process.env.TEST_NAME_KEY || process.env.TEST_KEY,
      process.env.TEST_NAME_SECRET || process.env.TEST_SECRET,
    ),
    initialNamesList = await nameManager.list(),
    countToCreate = 3;
  for (let i = 0; i < countToCreate; i++) {
    await nameManager.create(`${testNameLabel}-${i}`, TEST_CID);
  }
  const namesList = await nameManager.list();
  for (let i = 0; i < countToCreate; i++) {
    await nameManager.delete(`${testNameLabel}-${i}`);
  }
  assert.strictEqual(namesList.length, initialNamesList.length + countToCreate);
});

test("toggle name on", async () => {
  const testNameLabel = `${TEST_PREFIX}-toggle-name-test-pass`,
    nameManager = new NameManager(
      process.env.TEST_NAME_KEY || process.env.TEST_KEY,
      process.env.TEST_NAME_SECRET || process.env.TEST_SECRET,
    );
  await nameManager.create(testNameLabel, TEST_CID, {
    enabled: false,
  });
  const resolvedName = await nameManager.list(testNameLabel);
  if (resolvedName?.enabled === true) {
    throw new Error(`Incorrect State on Resolved Name`);
  }
  await nameManager.toggle(testNameLabel, true);
  const updatedName = await nameManager.get(testNameLabel);
  await nameManager.delete(testNameLabel);
  assert.strictEqual(updatedName.label, testNameLabel);
  assert.strictEqual(updatedName.cid, TEST_CID);
  assert.strictEqual(updatedName.enabled, true);
});

test("toggle name off", async () => {
  const testNameLabel = `${TEST_PREFIX}-toggle-name-test-pass`,
    nameManager = new NameManager(
      process.env.TEST_NAME_KEY || process.env.TEST_KEY,
      process.env.TEST_NAME_SECRET || process.env.TEST_SECRET,
    );
  await nameManager.create(testNameLabel, TEST_CID);
  const resolvedName = await nameManager.list(testNameLabel);
  if (resolvedName?.enabled === false) {
    throw new Error(`Incorrect State on Resolved Name`);
  }
  await nameManager.toggle(testNameLabel, false);
  const updatedName = await nameManager.get(testNameLabel);
  await nameManager.delete(testNameLabel);
  assert.strictEqual(updatedName.label, testNameLabel);
  assert.strictEqual(updatedName.cid, TEST_CID);
  assert.strictEqual(updatedName.enabled, false);
});
