<h1 align="center">💾<br/>Filebase SDK</h1>
<p align="center">Developer Friendly [ <a href="https://docs.ipfs.tech/concepts/what-is-ipfs/" title="What is IPFS?">IPFS</a> | <a href="https://docs.ipfs.tech/concepts/ipns/" title="What is IPNS?">IPNS</a> | S3 ]</p>

## About

The Filebase SDK provides a hybrid data management solution, blending S3-compatible cloud storage with IPFS 
(InterPlanetary File System) pinning services. It features robust S3 bucket management, object handling for uploads and 
downloads, and seamless integration with IPFS and IPNS (InterPlanetary Naming System) for decentralized storage 
operations. The SDK supports advanced data tasks like compiling files into CAR (Content Addressable aRchive) formats and
ensures secure transactions through strong authentication. Designed for varied applications, the Filebase SDK is ideal 
for scenarios demanding the dependability of cloud storage combined with the advantages of decentralized, peer-to-peer 
storage, catering to diverse needs such as content distribution, data backup, and archival.  Developing InterPlanetary
Applications has never been easier.

### JS Client

Install the package using npm

```shell
npm install filebase-sdk
```

or yarn:

```shell
yarn add filebase-sdk
```

### Getting started

The snippet below shows how to create a new bucket with `BucketManager`, upload a new object to IPFS 
with `ObjectManager`, publish the object to IPNS with `NameManager`, delete the object with `ObjectManager` and finally
delete the bucket with `BucketManager`.

To use the library in your project, use npm or yarn to install the [`filebase-sdk`](https://www.npmjs.com/package/filebase-sdk) module.

**node.js**
````js
// Import Classes
import {BucketManager, ObjectManager, NameManager} from 'filebase-sdk'

// Setup S3 Config
const s3Config = {};

// Initialize BucketManager
const bucketManager = new BucketManager(s3Config);
// Create bucket
const bucketName = `create-bucket-[random string]`;
await bucketManager.create(bucketName);
// List buckets
const bucketsList = await bucketManager.list();
console.dir(bucketsList);

// Initialize ObjectManager
const objectManager = new ObjectManager(s3Config, bucketName);
// Upload Object
const objectName = `new-object`;
const uploadedObject = await objectManager.upload(objectName, body);
// Confirm Object Uploaded
const objectsList = await objectManager.list({
    Prefix: key,
    MaxKeys: 1,
  });
console.dir(objectsList)

// Initialize NameManager
const nameManager = new NameManager(s3Config);
// Create New IPNS Name with Broadcast Disabled
const ipnsName = await nameManager.create(`myFirstIpnsKey`, uploadedObject.cid, {
  enabled: true
});
// Update IPNS Value and Optionally Enable the Broadcast
await nameManager.set(`myFirstIpnsKey`, uploadedObject.cid, {
  enabled: true,
});
// Enable IPNS Broadcast without updating the IPNS Record
await nameManager.toggle(`myFirstIpnsKey`, true);

// Delete Object
await objectManager.delete(objectName);

// Delete Bucket
await bucketManager.delete(bucketName)
````

Full API reference doc for the JS client are available at https://filebase.github.io/filebase-sdk

### Building filebase-sdk

Want to help us improve filebase-sdk? This project uses node v20 and npm v9

Install the deps with `npm`

```console
# install deps
npm install
```

Build code from src with `npm`

```console
# build from src
npm run build
```

### Testing

Test are found in the `test` directory and are built to be run with the Node.js v20+ test runner.