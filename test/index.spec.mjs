import { test } from "node:test";
import assert from "node:assert/strict";
import * as Path from "node:path";
import { writeFile } from "node:fs/promises";
import { v4 as uuidv4 } from "uuid";
import os from "node:os";
import FilebaseClient from "../src/index.js";

// Application Constants
const TEST_PREFIX = Date.now();

//region Bucket Tests
test("create bucket", async () => {
  // Initialize FilebaseClient
  const filebaseClient = new FilebaseClient(
    process.env.TEST_S3_KEY || process.env.TEST_KEY,
    process.env.TEST_S3_SECRET || process.env.TEST_SECRET,
  );

  // Create bucket `create-bucket-test-pass`
  const bucketNameToCreate = `${TEST_PREFIX}-create-bucket-test-pass`;
  await filebaseClient.createBucket(bucketNameToCreate);

  try {
    // List buckets
    const currentBuckets = await filebaseClient.listBuckets(),
      createdBucket = currentBuckets.find((currentBucket) => {
        return currentBucket.Name === bucketNameToCreate;
      });

    // Assert new bucket exists
    assert.equal(createdBucket.Name, bucketNameToCreate);
  } finally {
    // Delete new bucket
    await filebaseClient.deleteBucket(bucketNameToCreate);
  }
});

test("get bucket cid", async () => {
  // Initialize FilebaseClient
  const filebaseClient = new FilebaseClient(
    process.env.TEST_S3_KEY || process.env.TEST_KEY,
    process.env.TEST_S3_SECRET || process.env.TEST_SECRET,
  );

  // Create bucket `create-bucket-test-pass`
  const bucketNameToGet = `${TEST_PREFIX}-get-bucket-test-pass`;
  await filebaseClient.createBucket(bucketNameToGet);

  try {
    // Generate bucket CID
    await filebaseClient.generateBucketCid(bucketNameToGet);

    // Get bucket information
    const bucketCid = await filebaseClient.getBucketCid(bucketNameToGet);

    // Assert new bucket exists
    assert.equal(
      bucketCid,
      "bafybeiczsscdsbs7ffqz55asqdf3smv6klcw3gofszvwlyarci47bgf354",
    );
  } finally {
    // Delete new bucket
    await filebaseClient.deleteBucket(bucketNameToGet);
  }
});

test("generate bucket cid", async () => {
  // Initialize FilebaseClient
  const filebaseClient = new FilebaseClient(
    process.env.TEST_S3_KEY || process.env.TEST_KEY,
    process.env.TEST_S3_SECRET || process.env.TEST_SECRET,
  );

  // Create bucket `create-bucket-test-pass`
  const bucketNameToGenerate = `${TEST_PREFIX}-generate-bucket-test-pass`;
  await filebaseClient.createBucket(bucketNameToGenerate);

  try {
    // Generate bucket CID
    const generatedCid =
      await filebaseClient.generateBucketCid(bucketNameToGenerate);

    // Assert new bucket exists
    assert.equal(
      generatedCid,
      "bafybeiczsscdsbs7ffqz55asqdf3smv6klcw3gofszvwlyarci47bgf354",
    );
  } finally {
    // Delete new bucket
    await filebaseClient.deleteBucket(bucketNameToGenerate);
  }
});

test("list buckets", async () => {
  const testBucketName = `${TEST_PREFIX}-list-bucket-test-pass`,
    filebaseClient = new FilebaseClient(
      process.env.TEST_S3_KEY || process.env.TEST_KEY,
      process.env.TEST_S3_SECRET || process.env.TEST_SECRET,
    ),
    initialBucketsList = await filebaseClient.listBuckets(),
    countToCreate = 3;
  for (let i = 0; i < countToCreate; i++) {
    await filebaseClient.createBucket(`${testBucketName}-${i}`);
  }
  const bucketsList = await filebaseClient.listBuckets();
  for (let i = 0; i < countToCreate; i++) {
    await filebaseClient.deleteBucket(`${testBucketName}-${i}`);
  }
  assert.strictEqual(
    bucketsList.length,
    initialBucketsList.length + countToCreate,
  );
});

test("delete bucket", async () => {
  // Initialize FilebaseClient
  const filebaseClient = new FilebaseClient(
    process.env.TEST_S3_KEY || process.env.TEST_KEY,
    process.env.TEST_S3_SECRET || process.env.TEST_SECRET,
  );

  // Create bucket `delete-bucket-test-pass`
  const bucketNameToCreate = `${TEST_PREFIX}-delete-bucket-test-pass`;
  await filebaseClient.createBucket(bucketNameToCreate);

  // List buckets and assert new bucket exists
  const currentBuckets = await filebaseClient.listBuckets(),
    createdBucket = currentBuckets.find((currentBucket) => {
      return currentBucket.Name === bucketNameToCreate;
    });
  if (typeof createdBucket === "undefined") {
    throw new Error(`Unable to create test bucket [delete-bucket-test-pass]`);
  }

  // Delete new bucket
  await filebaseClient.deleteBucket(bucketNameToCreate);

  // List buckets and assert new bucket does not exist
  const updatedBuckets = await filebaseClient.listBuckets(),
    deletedBucket = updatedBuckets.find((updatedBucket) => {
      return updatedBucket.Name === bucketNameToCreate;
    });
  assert.equal(typeof deletedBucket, "undefined");
});
//endregion

//region File Tests
async function createBucket(name) {
  // Initialize FilebaseClient
  const filebaseClient = new FilebaseClient(
    process.env.TEST_S3_KEY || process.env.TEST_KEY,
    process.env.TEST_S3_SECRET || process.env.TEST_SECRET,
  );

  // Create bucket with name
  const bucketNameToCreate = name;
  await filebaseClient.createBucket(bucketNameToCreate);

  // List buckets and assert new bucket exists
  const currentBuckets = await filebaseClient.listBuckets(),
    createdBucket = currentBuckets.find((currentBucket) => {
      return currentBucket.Name === bucketNameToCreate;
    });

  return typeof createdBucket !== "undefined";
}

async function uploadObject(bucket, key, body) {
  // Initialize FilebaseClient
  const filebaseClient = new FilebaseClient(
    process.env.TEST_S3_KEY || process.env.TEST_KEY,
    process.env.TEST_S3_SECRET || process.env.TEST_SECRET,
    { bucket },
  );

  // Upload Object
  await filebaseClient.uploadFile(key, body);

  // Confirm Object Uploaded
  const uploadedObject = await filebaseClient.getFileMetadata(key);

  return typeof uploadedObject !== "undefined" && uploadedObject !== false
    ? uploadedObject
    : false;
}

async function uploadObjects(bucket, key, body) {
  // Initialize FilebaseClient
  const filebaseClient = new FilebaseClient(
    process.env.TEST_S3_KEY || process.env.TEST_KEY,
    process.env.TEST_S3_SECRET || process.env.TEST_SECRET,
    { bucket },
  );

  // Upload Object
  await filebaseClient.uploadFiles(key, body);

  // Confirm Object Uploaded
  const uploadedObject = await filebaseClient.getFileMetadata(key);

  return typeof uploadedObject !== "undefined" && uploadedObject !== false;
}

async function deleteObject(bucket, key) {
  // Initialize FilebaseClient
  const filebaseClient = new FilebaseClient(
    process.env.TEST_S3_KEY || process.env.TEST_KEY,
    process.env.TEST_S3_SECRET || process.env.TEST_SECRET,
    { bucket },
  );

  // Delete Object
  await filebaseClient.deleteFile(key);
  return true;
}

async function deleteBucket(bucket) {
  // Initialize FilebaseClient
  const filebaseClient = new FilebaseClient(
    process.env.TEST_S3_KEY || process.env.TEST_KEY,
    process.env.TEST_S3_SECRET || process.env.TEST_SECRET,
  );

  // Delete Bucket
  await filebaseClient.deleteFile(bucket);
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

    // Initialize FilebaseClient
    const filebaseClient = new FilebaseClient(
      process.env.TEST_S3_KEY || process.env.TEST_KEY,
      process.env.TEST_S3_SECRET || process.env.TEST_SECRET,
      { bucket: deleteTestBucket },
    );

    // Delete object `delete-object-test`
    await filebaseClient.deleteFile(objectNameToCreate);

    // List bucket and assert new object doesn't exist
    const uploadedObject =
      await filebaseClient.getFileMetadata(objectNameToCreate);
    assert.equal(uploadedObject, false);
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
    const uploadForm = new FormData();
    uploadForm.append(
      "file",
      Buffer.from("upload test object", "utf-8"),
      "/testObjects/1.txt",
    );
    uploadForm.append(
      "file",
      Buffer.from("upload deep test object", "utf-8"),
      "/testObjects/deep/1.txt",
    );
    uploadForm.append(
      "file",
      Buffer.from("upload top level test object", "utf-8"),
      "/topLevel.txt",
    );
    const uploaded = await uploadObjects(
      uploadDirectoryTestBucket,
      `create-directory-test`,
      uploadForm,
    );
    assert.strictEqual(uploaded, true);
    await deleteObject(uploadDirectoryTestBucket, `create-directory-test`);
  } finally {
    await deleteBucket(uploadDirectoryTestBucket);
  }
});

test("generate presigned url for object", async () => {
  // Create bucket `download-object-test-pass`
  const downloadTestBucket = `${TEST_PREFIX}-presigned-url-object-test-pass`;
  await createBucket(downloadTestBucket);

  try {
    // Upload object `download-object-test`
    const objectNameToCreate = `presigned-url-object-test`;
    const uploaded = await uploadObject(
      downloadTestBucket,
      objectNameToCreate,
      Buffer.from("download object", "utf-8"),
    );
    if (uploaded === false) {
      throw Error(`Failed to create object [${objectNameToCreate}]`);
    }

    try {
      // Generate presigned URL for objects
      const filebaseClient = new FilebaseClient(
        process.env.TEST_S3_KEY || process.env.TEST_KEY,
        process.env.TEST_S3_SECRET || process.env.TEST_SECRET,
        { bucket: downloadTestBucket },
      );
      const presignedUrl =
        await filebaseClient.generatePresignedUrl(objectNameToCreate);
      assert.strictEqual(typeof presignedUrl, "string");
    } finally {
      await deleteObject(downloadTestBucket, objectNameToCreate);
    }
  } finally {
    await deleteBucket(downloadTestBucket);
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
      const filebaseClient = new FilebaseClient(
        process.env.TEST_S3_KEY || process.env.TEST_KEY,
        process.env.TEST_S3_SECRET || process.env.TEST_SECRET,
        { bucket: downloadTestBucket },
      );
      const downloadStream =
          await filebaseClient.downloadFile(objectNameToCreate),
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

test("download object using gateway (ipfs)", async () => {
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
      const filebaseClient = new FilebaseClient(
        process.env.TEST_S3_KEY || process.env.TEST_KEY,
        process.env.TEST_S3_SECRET || process.env.TEST_SECRET,
        {
          bucket: downloadTestBucket,
          gateway: { endpoint: process.env.TEST_IPFS_GATEWAY },
        },
      );
      const downloadStream = await filebaseClient.fetchContentByCid(
          uploaded["cid"],
        ),
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

    const filebaseClient = new FilebaseClient(
      process.env.TEST_S3_KEY || process.env.TEST_KEY,
      process.env.TEST_S3_SECRET || process.env.TEST_SECRET,
      { bucket: listTestBucket },
    );

    const objectList = await filebaseClient.listFiles(`list-object-test-`, {
      MaxKeys: 50,
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

test("copy object", async () => {
  // Create bucket `copy-object-test-pass-src`
  const bucketSrc = `${TEST_PREFIX}-copy-object-test-pass-src`;
  await createBucket(bucketSrc);

  try {
    // Upload object `copy-object-test`
    const objectNameToCreateSrc = `copy-object-test`;
    const uploaded = await uploadObject(
      bucketSrc,
      objectNameToCreateSrc,
      Buffer.from("copy object", "utf-8"),
    );
    try {
      assert.equal(uploaded, true);

      // Create bucket `copy-object-test-pass-dest`
      const bucketDest = `${TEST_PREFIX}-copy-object-test-pass-dest`;
      await createBucket(bucketDest);

      try {
        // Initialize FilebaseClient
        const filebaseClient = new FilebaseClient(
          process.env.TEST_S3_KEY || process.env.TEST_KEY,
          process.env.TEST_S3_SECRET || process.env.TEST_SECRET,
          { bucket: bucketSrc },
        );

        // Copy object `copy-object-test` from `copy-object-test-pass-src` to `copy-object-test-pass-dest`
        await filebaseClient.copyFile(objectNameToCreateSrc, bucketDest);
        try {
          // List bucket and assert new object exists
          const copiedObject = await filebaseClient.getFileMetadata(
            objectNameToCreateSrc,
          );
          assert.equal(copiedObject.ETag, '"8605273d870f50fde0d8fbcad4a8f702"');
        } finally {
          await deleteObject(bucketDest, objectNameToCreateSrc);
        }
      } finally {
        await deleteBucket(bucketDest);
      }
    } finally {
      await deleteObject(bucketSrc, objectNameToCreateSrc);
    }
  } finally {
    await deleteBucket(bucketSrc);
  }
});
//endregion

//region Gateway Tests
test("delete gateway", async () => {
  const testGatewayName = `${TEST_PREFIX}-delete-gateway-test-pass`,
    filebaseClient = new FilebaseClient(
      process.env.TEST_GW_KEY || process.env.TEST_KEY,
      process.env.TEST_GW_SECRET || process.env.TEST_SECRET,
    );
  await filebaseClient.createGateway(testGatewayName);
  await filebaseClient.deleteGateway(testGatewayName);
  const deletedName = await filebaseClient.getGateway(testGatewayName);
  assert.strictEqual(deletedName, false);
});

test("create gateway", async () => {
  const testGatewayName = `${TEST_PREFIX}-create-gateway-test-pass`,
    filebaseClient = new FilebaseClient(
      process.env.TEST_GW_KEY || process.env.TEST_KEY,
      process.env.TEST_GW_SECRET || process.env.TEST_SECRET,
    ),
    createdName = await filebaseClient.createGateway(testGatewayName);
  await filebaseClient.deleteGateway(testGatewayName);
  assert.strictEqual(createdName.name, testGatewayName);
});

test("update gateway", async () => {
  const testGatewayName = `${TEST_PREFIX}-update-gateway-test-pass`,
    filebaseClient = new FilebaseClient(
      process.env.TEST_GW_KEY || process.env.TEST_KEY,
      process.env.TEST_GW_SECRET || process.env.TEST_SECRET,
    ),
    createdName = await filebaseClient.createGateway(testGatewayName);
  try {
    const updatedName = await filebaseClient.updateGateway(createdName.name, {
      private: true,
      enabled: false,
    });
    assert.strictEqual(updatedName, true);
  } finally {
    await filebaseClient.deleteGateway(testGatewayName);
  }
});

test("get gateway", async () => {
  const testGatewayName = `${TEST_PREFIX}-get-gateway-test-pass`,
    filebaseClient = new FilebaseClient(
      process.env.TEST_GW_KEY || process.env.TEST_KEY,
      process.env.TEST_GW_SECRET || process.env.TEST_SECRET,
    ),
    createdName = await filebaseClient.createGateway(testGatewayName, {});
  try {
    const testName = await filebaseClient.getGateway(createdName.name);
    assert.strictEqual(testName.name, testGatewayName);
  } finally {
    await filebaseClient.deleteGateway(testGatewayName);
  }
});

test("list gateways", async () => {
  const testGatewayName = `${TEST_PREFIX}-list-names-test-pass`,
    filebaseClient = new FilebaseClient(
      process.env.TEST_GW_KEY || process.env.TEST_KEY,
      process.env.TEST_GW_SECRET || process.env.TEST_SECRET,
    ),
    initialGatewaysList = await filebaseClient.listGateways(),
    countToCreate = 3;
  for (let i = 0; i < countToCreate; i++) {
    await filebaseClient.createGateway(`${testGatewayName}-${i}`);
  }
  const gatewaysList = await filebaseClient.listGateways();
  for (let i = 0; i < countToCreate; i++) {
    await filebaseClient.deleteGateway(`${testGatewayName}-${i}`);
  }
  assert.strictEqual(
    gatewaysList.length,
    initialGatewaysList.length + countToCreate,
  );
});
//endregion

//region Names Tests
const TEST_CID = process.env.TEST_NAME_CID,
  TEST_PRIVATE_KEY = process.env.TEST_NAME_PRIVATE_KEY;

test("delete name", async () => {
  const testNameLabel = `${TEST_PREFIX}-delete-name-test-pass`,
    filebaseClient = new FilebaseClient(
      process.env.TEST_NAME_KEY || process.env.TEST_KEY,
      process.env.TEST_NAME_SECRET || process.env.TEST_SECRET,
    );
  await filebaseClient.createIpnsName(testNameLabel, TEST_CID);
  await filebaseClient.deleteIpnsName(testNameLabel);
  const deletedName = await filebaseClient.getIpnsName(testNameLabel);
  assert.strictEqual(deletedName, false);
});

test("create name", async () => {
  const testNameLabel = `${TEST_PREFIX}-create-name-test-pass`,
    filebaseClient = new FilebaseClient(
      process.env.TEST_NAME_KEY || process.env.TEST_KEY,
      process.env.TEST_NAME_SECRET || process.env.TEST_SECRET,
    ),
    createdName = await filebaseClient.createIpnsName(testNameLabel, TEST_CID);
  await filebaseClient.deleteIpnsName(testNameLabel);
  assert.strictEqual(createdName.label, testNameLabel);
  assert.strictEqual(createdName.cid, TEST_CID);
});

test("import name", async () => {
  const testNameLabel = `${TEST_PREFIX}-import-name-test-pass`,
    filebaseClient = new FilebaseClient(
      process.env.TEST_NAME_KEY || process.env.TEST_KEY,
      process.env.TEST_NAME_SECRET || process.env.TEST_SECRET,
    ),
    importedName = await filebaseClient.importIpnsName(
      testNameLabel,
      TEST_CID,
      TEST_PRIVATE_KEY,
    );
  await filebaseClient.deleteIpnsName(testNameLabel);
  assert.strictEqual(importedName.label, testNameLabel);
  assert.strictEqual(importedName.cid, TEST_CID);
});

test("update name", async () => {
  const testNameLabel = `${TEST_PREFIX}-update-name-test-pass`,
    filebaseClient = new FilebaseClient(
      process.env.TEST_NAME_KEY || process.env.TEST_KEY,
      process.env.TEST_NAME_SECRET || process.env.TEST_SECRET,
    ),
    createdName = await filebaseClient.createIpnsName(testNameLabel, TEST_CID);
  try {
    const updatedName = await filebaseClient.updateIpnsName(
      createdName.label,
      TEST_CID,
    );
    assert.strictEqual(updatedName, true);
  } finally {
    await filebaseClient.deleteIpnsName(testNameLabel);
  }
});

test("get name", async () => {
  const testNameLabel = `${TEST_PREFIX}-get-name-test-pass`,
    filebaseClient = new FilebaseClient(
      process.env.TEST_NAME_KEY || process.env.TEST_KEY,
      process.env.TEST_NAME_SECRET || process.env.TEST_SECRET,
    ),
    createdName = await filebaseClient.createIpnsName(testNameLabel, TEST_CID);
  try {
    const testName = await filebaseClient.getIpnsName(createdName.label);
    assert.strictEqual(testName.label, testNameLabel);
    assert.strictEqual(testName.cid, TEST_CID);
  } finally {
    await filebaseClient.deleteIpnsName(testNameLabel);
  }
});

test("resolve name", async () => {
  const testNameLabel = `${TEST_PREFIX}-resolve-name-test-pass`,
    filebaseClient = new FilebaseClient(
      process.env.TEST_NAME_KEY || process.env.TEST_KEY,
      process.env.TEST_NAME_SECRET || process.env.TEST_SECRET,
    ),
    createdName = await filebaseClient.createIpnsName(testNameLabel, TEST_CID);
  try {
    const testNameValue = await filebaseClient.resolveIpnsName(
      createdName.network_key,
    );
    assert.strictEqual(testNameValue, `/ipfs/${TEST_CID}`);
  } finally {
    await filebaseClient.deleteIpnsName(testNameLabel);
  }
});

test("list names", async () => {
  const testNameLabel = `${TEST_PREFIX}-list-names-test-pass`,
    filebaseClient = new FilebaseClient(
      process.env.TEST_NAME_KEY || process.env.TEST_KEY,
      process.env.TEST_NAME_SECRET || process.env.TEST_SECRET,
    ),
    initialNamesList = await filebaseClient.listIpnsNames(),
    countToCreate = 3;
  for (let i = 0; i < countToCreate; i++) {
    await filebaseClient.createIpnsName(`${testNameLabel}-${i}`, TEST_CID);
  }
  const namesList = await filebaseClient.listIpnsNames();
  for (let i = 0; i < countToCreate; i++) {
    await filebaseClient.deleteIpnsName(`${testNameLabel}-${i}`);
  }
  assert.strictEqual(namesList.length, initialNamesList.length + countToCreate);
});

test("download object using gateway (ipns)", async () => {
  // Create bucket `download-object-test-pass`
  const downloadTestBucket = `${TEST_PREFIX}-download-object-ipns-test-pass`;
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
      const filebaseClient = new FilebaseClient(
        process.env.TEST_S3_KEY || process.env.TEST_KEY,
        process.env.TEST_S3_SECRET || process.env.TEST_SECRET,
        {
          bucket: downloadTestBucket,
          gateway: { endpoint: process.env.TEST_IPFS_GATEWAY },
        },
      );

      // Create IPNS Name
      const createdName = await filebaseClient.createIpnsName(
        `${objectNameToCreate}-ipns`,
        uploaded.cid,
      );

      const downloadStream = await filebaseClient.fetchContentByIpnsName(
          createdName["network_key"],
        ),
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
//endregion

//region Pinning API Tests
const TEST_CID_1 = "QmSEu6zGwKgkQA3ZKaDnvkrwre1kkQa7eRFCbQi7waNwTT";

test("create pin", async () => {
  const testBucketName = `${TEST_PREFIX}-create-pin-test-pass`,
    testPinName = `${TEST_PREFIX}-create-pin-test-pass`,
    filebaseClient = new FilebaseClient(
      process.env.TEST_NAME_KEY || process.env.TEST_KEY,
      process.env.TEST_NAME_SECRET || process.env.TEST_SECRET,
      {
        bucket: testBucketName,
      },
    );
  await createBucket(testBucketName);
  try {
    const createdPin = await filebaseClient.pinFile(testPinName, TEST_CID_1);
    assert.strictEqual(createdPin.pin.cid, TEST_CID_1);
    await filebaseClient.deleteFile(createdPin.name);
  } finally {
    await deleteBucket(testBucketName);
  }
});
//endregion
