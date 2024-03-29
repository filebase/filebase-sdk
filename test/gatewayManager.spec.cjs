const test = require("node:test");
const assert = require("node:assert/strict");
const { GatewayManager } = require("../dist/index.js");

const TEST_PREFIX = Date.now();

test("delete gateway", async () => {
  const testGatewayName = `${TEST_PREFIX}-delete-gateway-test-pass`,
    gatewayManager = new GatewayManager(
      process.env.TEST_GW_KEY || process.env.TEST_KEY,
      process.env.TEST_GW_SECRET || process.env.TEST_SECRET,
    );
  await gatewayManager.create(testGatewayName);
  await gatewayManager.delete(testGatewayName);
  const deletedName = await gatewayManager.get(testGatewayName);
  assert.strictEqual(deletedName, false);
});
test("create gateway", async () => {
  const testGatewayName = `${TEST_PREFIX}-create-gateway-test-pass`,
    gatewayManager = new GatewayManager(
      process.env.TEST_GW_KEY || process.env.TEST_KEY,
      process.env.TEST_GW_SECRET || process.env.TEST_SECRET,
    ),
    createdName = await gatewayManager.create(testGatewayName);
  await gatewayManager.delete(testGatewayName);
  assert.strictEqual(createdName.name, testGatewayName);
});

test("update gateway", async () => {
  const testGatewayName = `${TEST_PREFIX}-update-gateway-test-pass`,
    gatewayManager = new GatewayManager(
      process.env.TEST_GW_KEY || process.env.TEST_KEY,
      process.env.TEST_GW_SECRET || process.env.TEST_SECRET,
    ),
    createdName = await gatewayManager.create(testGatewayName);
  try {
    const updatedName = await gatewayManager.update(createdName.name, {
      private: true,
      enabled: false,
    });
    assert.strictEqual(updatedName, true);
  } finally {
    await gatewayManager.delete(testGatewayName);
  }
});

test("get gateway", async () => {
  const testGatewayName = `${TEST_PREFIX}-get-gateway-test-pass`,
    gatewayManager = new GatewayManager(
      process.env.TEST_GW_KEY || process.env.TEST_KEY,
      process.env.TEST_GW_SECRET || process.env.TEST_SECRET,
    ),
    createdName = await gatewayManager.create(testGatewayName, {});
  try {
    const testName = await gatewayManager.get(createdName.name);
    assert.strictEqual(testName.name, testGatewayName);
  } finally {
    await gatewayManager.delete(testGatewayName);
  }
});

test("list gateways", async () => {
  const testGatewayName = `${TEST_PREFIX}-list-names-test-pass`,
    gatewayManager = new GatewayManager(
      process.env.TEST_GW_KEY || process.env.TEST_KEY,
      process.env.TEST_GW_SECRET || process.env.TEST_SECRET,
    ),
    initialGatewaysList = await gatewayManager.list(),
    countToCreate = 3;
  for (let i = 0; i < countToCreate; i++) {
    await gatewayManager.create(`${testGatewayName}-${i}`);
  }
  const gatewaysList = await gatewayManager.list();
  for (let i = 0; i < countToCreate; i++) {
    await gatewayManager.delete(`${testGatewayName}-${i}`);
  }
  assert.strictEqual(
    gatewaysList.length,
    initialGatewaysList.length + countToCreate,
  );
});

test("toggle gateway off", async () => {
  const testGatewayName = `${TEST_PREFIX}-toggle-gateway-test-pass`,
    gatewayManager = new GatewayManager(
      process.env.TEST_GW_KEY || process.env.TEST_KEY,
      process.env.TEST_GW_SECRET || process.env.TEST_SECRET,
    );
  await gatewayManager.create(testGatewayName);
  try {
    const resolvedName = await gatewayManager.get(testGatewayName);
    if (resolvedName?.enabled === false) {
      throw new Error(`Incorrect State on Resolved Name`);
    }
    await gatewayManager.toggle(testGatewayName, false);
    const updatedName = await gatewayManager.get(testGatewayName);
    assert.strictEqual(updatedName.name, testGatewayName);
    assert.strictEqual(updatedName.enabled, false);
  } finally {
    await gatewayManager.delete(testGatewayName);
  }
});

test("toggle gateway on", async () => {
  const testGatewayName = `${TEST_PREFIX}-toggle-gateway-test-pass`,
    gatewayManager = new GatewayManager(
      process.env.TEST_GW_KEY || process.env.TEST_KEY,
      process.env.TEST_GW_SECRET || process.env.TEST_SECRET,
    );
  await gatewayManager.create(testGatewayName, {
    enabled: false,
  });
  try {
    const resolvedName = await gatewayManager.get(testGatewayName);
    if (resolvedName?.enabled === true) {
      throw new Error(`Incorrect State on Resolved Name`);
    }
    await gatewayManager.toggle(testGatewayName, true);
    const updatedName = await gatewayManager.get(testGatewayName);
    assert.strictEqual(updatedName.name, testGatewayName);
    assert.strictEqual(updatedName.enabled, true);
  } finally {
    await gatewayManager.delete(testGatewayName);
  }
});
