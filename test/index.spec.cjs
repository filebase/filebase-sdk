const test = require("node:test");
const assert = require("node:assert/strict");
const Path = require("node:path");
const { writeFile } = require("node:fs/promises");
const { v4: uuidv4 } = require("uuid");
const os = require("node:os");
const { FilebaseClient } = require("../dist/node/index.js");

// Application Constants
const TEST_PREFIX = Date.now();
const TEST_IPFS_GATEWAY =
  process.env.TEST_IPFS_GATEWAY || "https://ipfs.filebase.io";
const TEST_S3_ENDPOINT =
  process.env.TEST_S3_ENDPOINT || "https://s3.filebase.com";
const TEST_RPC_ENDPOINT =
  process.env.TEST_RPC_ENDPOINT || "https://rpc.filebase.io";
const TEST_PLATFORM_ENDPOINT =
  process.env.TEST_PLATFORM_ENDPOINT || "https://api.filebase.io";
const CLIENT_KEY = process.env.TEST_KEY;
const CLIENT_SECRET = process.env.TEST_SECRET;

//region Bucket Tests
test("create bucket", async () => {
  // Initialize FilebaseClient
  const filebaseClient = new FilebaseClient(CLIENT_KEY, CLIENT_SECRET, {
    endpoints: {
      s3: TEST_S3_ENDPOINT,
      rpc: TEST_RPC_ENDPOINT,
      platform: TEST_PLATFORM_ENDPOINT,
    },
  });

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
  const filebaseClient = new FilebaseClient(CLIENT_KEY, CLIENT_SECRET, {
    endpoints: {
      s3: TEST_S3_ENDPOINT,
      rpc: TEST_RPC_ENDPOINT,
      platform: TEST_PLATFORM_ENDPOINT,
    },
  });

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
  const filebaseClient = new FilebaseClient(CLIENT_KEY, CLIENT_SECRET, {
    endpoints: {
      s3: TEST_S3_ENDPOINT,
      rpc: TEST_RPC_ENDPOINT,
      platform: TEST_PLATFORM_ENDPOINT,
    },
  });

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
    filebaseClient = new FilebaseClient(CLIENT_KEY, CLIENT_SECRET, {
      endpoints: {
        s3: TEST_S3_ENDPOINT,
        rpc: TEST_RPC_ENDPOINT,
        platform: TEST_PLATFORM_ENDPOINT,
      },
    }),
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
  const filebaseClient = new FilebaseClient(CLIENT_KEY, CLIENT_SECRET, {
    endpoints: {
      s3: TEST_S3_ENDPOINT,
      rpc: TEST_RPC_ENDPOINT,
      platform: TEST_PLATFORM_ENDPOINT,
    },
  });

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
  const filebaseClient = new FilebaseClient(CLIENT_KEY, CLIENT_SECRET, {
    endpoints: {
      s3: TEST_S3_ENDPOINT,
      rpc: TEST_RPC_ENDPOINT,
      platform: TEST_PLATFORM_ENDPOINT,
    },
  });

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
  const filebaseClient = new FilebaseClient(CLIENT_KEY, CLIENT_SECRET, {
    bucket,
    endpoints: {
      s3: TEST_S3_ENDPOINT,
      rpc: TEST_RPC_ENDPOINT,
      platform: TEST_PLATFORM_ENDPOINT,
    },
  });

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
  const filebaseClient = new FilebaseClient(CLIENT_KEY, CLIENT_SECRET, {
    bucket,
    endpoints: {
      s3: TEST_S3_ENDPOINT,
      rpc: TEST_RPC_ENDPOINT,
      platform: TEST_PLATFORM_ENDPOINT,
    },
  });

  // Upload Object
  await filebaseClient.uploadDirectory(key, body);

  // Confirm Object Uploaded
  const uploadedObject = await filebaseClient.getFileMetadata(key);

  return typeof uploadedObject !== "undefined" && uploadedObject !== false;
}

async function deleteObject(bucket, key) {
  // Initialize FilebaseClient
  const filebaseClient = new FilebaseClient(CLIENT_KEY, CLIENT_SECRET, {
    bucket,
    endpoints: {
      s3: TEST_S3_ENDPOINT,
      rpc: TEST_RPC_ENDPOINT,
      platform: TEST_PLATFORM_ENDPOINT,
    },
  });

  // Delete Object
  await filebaseClient.deleteFile(key);
  return true;
}

async function deleteBucket(bucket) {
  // Initialize FilebaseClient
  const filebaseClient = new FilebaseClient(CLIENT_KEY, CLIENT_SECRET, {
    endpoints: {
      s3: TEST_S3_ENDPOINT,
      rpc: TEST_RPC_ENDPOINT,
      platform: TEST_PLATFORM_ENDPOINT,
    },
  });

  // Delete Bucket
  await filebaseClient.deleteBucket(bucket);
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
      new Blob(["delete object"]),
    );
    if (uploaded === false) {
      throw Error(`Failed to create object [delete-object-test]`);
    }

    // Initialize FilebaseClient
    const filebaseClient = new FilebaseClient(CLIENT_KEY, CLIENT_SECRET, {
      bucket: deleteTestBucket,
      endpoints: {
        s3: TEST_S3_ENDPOINT,
        rpc: TEST_RPC_ENDPOINT,
        platform: TEST_PLATFORM_ENDPOINT,
      },
    });

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
      new Blob(["upload object"]),
    );

    assert.notEqual(uploaded, false);
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
      new Blob(["upload test object"]),
      "testObjects/1.txt",
    );
    uploadForm.append(
      "file",
      new Blob(["upload deep test object"]),
      "testObjects/deep/1.txt",
    );
    uploadForm.append(
      "file",
      new Blob(["upload top level test object"]),
      "topLevel.txt",
    );
    const uploaded = await uploadObjects(
      uploadDirectoryTestBucket,
      `create-directory-test`,
      uploadForm,
    );
    assert.notEqual(uploaded, false);
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
      new Blob(["download object"]),
    );
    if (uploaded === false) {
      throw Error(`Failed to create object [${objectNameToCreate}]`);
    }

    try {
      // Generate presigned URL for objects
      const filebaseClient = new FilebaseClient(CLIENT_KEY, CLIENT_SECRET, {
        bucket: downloadTestBucket,
        endpoints: {
          s3: TEST_S3_ENDPOINT,
          rpc: TEST_RPC_ENDPOINT,
          platform: TEST_PLATFORM_ENDPOINT,
        },
      });
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
      new Blob(["download object"]),
    );
    if (uploaded === false) {
      throw Error(`Failed to create object [download-object-test]`);
    }

    try {
      // Download object `download-object-test` and assert it completes
      const filebaseClient = new FilebaseClient(CLIENT_KEY, CLIENT_SECRET, {
        bucket: downloadTestBucket,
        endpoints: {
          s3: TEST_S3_ENDPOINT,
          rpc: TEST_RPC_ENDPOINT,
          platform: TEST_PLATFORM_ENDPOINT,
        },
      });
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
      new Blob(["download object"]),
    );
    if (uploaded === false) {
      throw Error(`Failed to create object [download-object-test]`);
    }

    try {
      // Download object `download-object-test` and assert it completes
      const filebaseClient = new FilebaseClient(CLIENT_KEY, CLIENT_SECRET, {
        bucket: downloadTestBucket,
        endpoints: {
          s3: TEST_S3_ENDPOINT,
          rpc: TEST_RPC_ENDPOINT,
          platform: TEST_PLATFORM_ENDPOINT,
          gateway: TEST_IPFS_GATEWAY,
        },
      });
      const downloadStream = await filebaseClient.fetchContentByCid(
          uploaded["Metadata"]["cid"],
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
        new Blob([`list objects ${createdObjectCount}`]),
      );
      createdObjectCount++;
    }

    const filebaseClient = new FilebaseClient(CLIENT_KEY, CLIENT_SECRET, {
      bucket: listTestBucket,
      endpoints: {
        s3: TEST_S3_ENDPOINT,
        rpc: TEST_RPC_ENDPOINT,
        platform: TEST_PLATFORM_ENDPOINT,
      },
    });

    const objectList = await filebaseClient.listFiles(`list-object-test-`, {
      MaxKeys: 50,
    });
    assert.equal(objectList.entries.length, 26);

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
      new Blob(["copy object"]),
    );
    try {
      assert.notEqual(uploaded, false);

      // Create bucket `copy-object-test-pass-dest`
      const bucketDest = `${TEST_PREFIX}-copy-object-test-pass-dest`;
      await createBucket(bucketDest);

      try {
        // Initialize FilebaseClient
        const filebaseClient = new FilebaseClient(CLIENT_KEY, CLIENT_SECRET, {
          bucket: bucketSrc,
          endpoints: {
            s3: TEST_S3_ENDPOINT,
            rpc: TEST_RPC_ENDPOINT,
            platform: TEST_PLATFORM_ENDPOINT,
          },
        });

        // Copy object `copy-object-test` from `copy-object-test-pass-src` to `copy-object-test-pass-dest`
        await filebaseClient.copyFile(
          objectNameToCreateSrc,
          objectNameToCreateSrc,
          {
            destinationBucket: bucketDest,
          },
        );
        try {
          // List bucket and assert new object exists
          const copiedObject = await filebaseClient.getFileMetadata(
            objectNameToCreateSrc,
            {
              bucket: bucketDest,
            },
          );
          assert.equal(copiedObject.ETag, '"1181cc81508b7da38b06cc32da7df1f0"');
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
    filebaseClient = new FilebaseClient(CLIENT_KEY, CLIENT_SECRET, {
      endpoints: {
        s3: TEST_S3_ENDPOINT,
        rpc: TEST_RPC_ENDPOINT,
        platform: TEST_PLATFORM_ENDPOINT,
      },
    });
  await filebaseClient.createGateway(testGatewayName);
  await filebaseClient.deleteGateway(testGatewayName);
  const deletedName = await filebaseClient.getGateway(testGatewayName);
  assert.strictEqual(deletedName, false);
});

test("create gateway", async () => {
  const testGatewayName = `${TEST_PREFIX}-create-gateway-test-pass`,
    filebaseClient = new FilebaseClient(CLIENT_KEY, CLIENT_SECRET, {
      endpoints: {
        s3: TEST_S3_ENDPOINT,
        rpc: TEST_RPC_ENDPOINT,
        platform: TEST_PLATFORM_ENDPOINT,
      },
    }),
    createdName = await filebaseClient.createGateway(testGatewayName);
  await filebaseClient.deleteGateway(testGatewayName);
  assert.strictEqual(createdName.name, testGatewayName);
});

test("update gateway", async () => {
  const testGatewayName = `${TEST_PREFIX}-update-gateway-test-pass`,
    filebaseClient = new FilebaseClient(CLIENT_KEY, CLIENT_SECRET, {
      endpoints: {
        s3: TEST_S3_ENDPOINT,
        rpc: TEST_RPC_ENDPOINT,
        platform: TEST_PLATFORM_ENDPOINT,
      },
    }),
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
    filebaseClient = new FilebaseClient(CLIENT_KEY, CLIENT_SECRET, {
      endpoints: {
        s3: TEST_S3_ENDPOINT,
        rpc: TEST_RPC_ENDPOINT,
        platform: TEST_PLATFORM_ENDPOINT,
      },
    }),
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
    filebaseClient = new FilebaseClient(CLIENT_KEY, CLIENT_SECRET, {
      endpoints: {
        s3: TEST_S3_ENDPOINT,
        rpc: TEST_RPC_ENDPOINT,
        platform: TEST_PLATFORM_ENDPOINT,
      },
    }),
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
    filebaseClient = new FilebaseClient(CLIENT_KEY, CLIENT_SECRET, {
      endpoints: {
        s3: TEST_S3_ENDPOINT,
        rpc: TEST_RPC_ENDPOINT,
        platform: TEST_PLATFORM_ENDPOINT,
      },
    });
  await filebaseClient.createIpnsName(testNameLabel, TEST_CID);
  await filebaseClient.deleteIpnsName(testNameLabel);
  const deletedName = await filebaseClient.getIpnsName(testNameLabel);
  assert.strictEqual(deletedName, false);
});

test("create name", async () => {
  const testNameLabel = `${TEST_PREFIX}-create-name-test-pass`,
    filebaseClient = new FilebaseClient(CLIENT_KEY, CLIENT_SECRET, {
      endpoints: {
        s3: TEST_S3_ENDPOINT,
        rpc: TEST_RPC_ENDPOINT,
        platform: TEST_PLATFORM_ENDPOINT,
      },
    }),
    createdName = await filebaseClient.createIpnsName(testNameLabel, TEST_CID);
  await filebaseClient.deleteIpnsName(testNameLabel);
  assert.strictEqual(createdName.label, testNameLabel);
  assert.strictEqual(createdName.cid, TEST_CID);
});

test("import name", async () => {
  const testNameLabel = `${TEST_PREFIX}-import-name-test-pass`,
    filebaseClient = new FilebaseClient(CLIENT_KEY, CLIENT_SECRET, {
      endpoints: {
        s3: TEST_S3_ENDPOINT,
        rpc: TEST_RPC_ENDPOINT,
        platform: TEST_PLATFORM_ENDPOINT,
      },
    }),
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
    filebaseClient = new FilebaseClient(CLIENT_KEY, CLIENT_SECRET, {
      endpoints: {
        s3: TEST_S3_ENDPOINT,
        rpc: TEST_RPC_ENDPOINT,
        platform: TEST_PLATFORM_ENDPOINT,
      },
    }),
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
    filebaseClient = new FilebaseClient(CLIENT_KEY, CLIENT_SECRET, {
      endpoints: {
        s3: TEST_S3_ENDPOINT,
        rpc: TEST_RPC_ENDPOINT,
        platform: TEST_PLATFORM_ENDPOINT,
      },
    }),
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
    filebaseClient = new FilebaseClient(CLIENT_KEY, CLIENT_SECRET, {
      endpoints: {
        s3: TEST_S3_ENDPOINT,
        rpc: TEST_RPC_ENDPOINT,
        platform: TEST_PLATFORM_ENDPOINT,
      },
    }),
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
    filebaseClient = new FilebaseClient(CLIENT_KEY, CLIENT_SECRET, {
      endpoints: {
        s3: TEST_S3_ENDPOINT,
        rpc: TEST_RPC_ENDPOINT,
        platform: TEST_PLATFORM_ENDPOINT,
      },
    }),
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
      new Blob(["download object"]),
    );
    if (uploaded === false) {
      throw Error(`Failed to create object [download-object-test]`);
    }

    try {
      // Download object `download-object-test` and assert it completes
      const filebaseClient = new FilebaseClient(CLIENT_KEY, CLIENT_SECRET, {
        bucket: downloadTestBucket,
        gateway: { endpoint: process.env.TEST_IPFS_GATEWAY },
        endpoints: {
          s3: TEST_S3_ENDPOINT,
          rpc: TEST_RPC_ENDPOINT,
          platform: TEST_PLATFORM_ENDPOINT,
        },
      });

      // Create IPNS Name
      const createdName = await filebaseClient.createIpnsName(
        `${objectNameToCreate}-ipns`,
        uploaded["Metadata"]["cid"],
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
    filebaseClient = new FilebaseClient(CLIENT_KEY, CLIENT_SECRET, {
      bucket: testBucketName,
      endpoints: {
        s3: TEST_S3_ENDPOINT,
        rpc: TEST_RPC_ENDPOINT,
        platform: TEST_PLATFORM_ENDPOINT,
      },
    });
  await createBucket(testBucketName);
  try {
    const createdPin = await filebaseClient.pinFile(testPinName, TEST_CID_1);
    assert.strictEqual(createdPin, true);
    await filebaseClient.deleteFile(testPinName);
  } finally {
    await deleteBucket(testBucketName);
  }
});
//endregion
