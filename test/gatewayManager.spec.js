import { test } from "node:test";
import assert from "node:assert/strict";
import GatewayManager from "../src/gatewayManager.js";

const TEST_PREFIX = Date.now(),
  S3_CONFIG = {
    endpoint: process.env.TEST_GW_ENDPOINT,
    credentials: {
      accessKeyId: process.env.TEST_GW_KEY,
      secretAccessKey: process.env.TEST_GW_SECRET,
    },
  };

test("delete gateway", async () => {
  const testGatewayName = `${TEST_PREFIX}-delete-gateway-test-pass`,
    gatewayManager = new GatewayManager(S3_CONFIG);
  await gatewayManager.create(testGatewayName);
  await gatewayManager.delete(testGatewayName);
  const deletedName = await gatewayManager.get(testGatewayName);
  assert.strictEqual(deletedName, false);
});
test("create gateway", async () => {
  const testGatewayName = `${TEST_PREFIX}-create-gateway-test-pass`,
    gatewayManager = new GatewayManager(S3_CONFIG),
    createdName = await gatewayManager.create(testGatewayName);
  await gatewayManager.delete(testGatewayName);
  assert.strictEqual(createdName.name, testGatewayName);
});

test("update gateway", async () => {
  const testGatewayName = `${TEST_PREFIX}-update-gateway-test-pass`,
    gatewayManager = new GatewayManager(S3_CONFIG),
    createdName = await gatewayManager.create(testGatewayName),
    updatedName = await gatewayManager.update(createdName.name, {
      private: true,
      enabled: false,
    });
  await gatewayManager.delete(testGatewayName);
  assert.strictEqual(updatedName, true);
});

test("get gateway", async () => {
  const testGatewayName = `${TEST_PREFIX}-get-gateway-test-pass`,
    gatewayManager = new GatewayManager(S3_CONFIG),
    createdName = await gatewayManager.create(testGatewayName, {}),
    testName = await gatewayManager.get(createdName.name);
  await gatewayManager.delete(testGatewayName);
  assert.strictEqual(testName.name, testGatewayName);
});

test("list gateways", async () => {
  const testGatewayName = `${TEST_PREFIX}-list-names-test-pass`,
    gatewayManager = new GatewayManager(S3_CONFIG);
  const initialGatewaysList = await gatewayManager.list();
  for (let i = 0; i < 10; i++) {
    await gatewayManager.create(`${testGatewayName}-${i}`);
  }
  const gatewaysList = await gatewayManager.list();
  for (let i = 0; i < 10; i++) {
    await gatewayManager.delete(`${testGatewayName}-${i}`);
  }
  assert.strictEqual(gatewaysList.length, initialGatewaysList.length + 10);
});

/*test("toggle gateway", async () => {
  const testGatewayName = `${TEST_PREFIX}-toggle-gateway-test-pass`,
    gatewayManager = new GatewayManager(S3_CONFIG);
  await gatewayManager.create(testGatewayName, {
    enabled: false,
  });
  const resolvedName = await gatewayManager.get(testGatewayName);
  if (resolvedName?.enabled === true) {
    throw new Error(`Incorrect State on Resolved Name`);
  }
  await gatewayManager.toggle(testGatewayName, true);
  const updatedName = await gatewayManager.get(testGatewayName);
  await gatewayManager.delete(testGatewayName);
  assert.strictEqual(updatedName.name, testGatewayName);
  assert.strictEqual(updatedName.enabled, true);
});*/
