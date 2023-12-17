<h1 align="center">&#x2022; Filebase SDK &#x2022;</h1>
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
npm install @filebase/sdk
```

or yarn:

```shell
yarn add @filebase/sdk
```

### Getting started

The snippet below shows how to create a new bucket with `BucketManager`, upload a new object to IPFS 
with `ObjectManager`, publish the object to IPNS with `NameManager`, delete the object with `ObjectManager` and finally
delete the bucket with `BucketManager`.

To use the library in your project, use npm or yarn to install the [`@filebase/sdk`](https://www.npmjs.com/package/@filebase/sdk) module.  Requires node.js 16+.

**node.js**
````js
// Import Classes
import {BucketManager, ObjectManager, NameManager, GatewayManager} from 'filebase-sdk'

// Initialize BucketManager
const bucketManager = new BucketManager(S3_KEY, S3_SECRET);
// Create bucket
const bucketName = `create-bucket-[random string]`;
await bucketManager.create(bucketName);
// List buckets
const bucketsList = await bucketManager.list();
// Toggle bucket privacy off
await bucketManager.setPrivacy(bucketName, false);
console.dir(bucketsList);

// Initialize ObjectManager
const objectManager = new ObjectManager(S3_KEY, S3_SECRET, bucketName);
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
const nameManager = new NameManager(S3_KEY, S3_SECRET);
// Create New IPNS Name with Broadcast Disabled
const ipnsName = await nameManager.create(`myFirstIpnsKey`, uploadedObject.cid, {
  enabled: true
});
// Update IPNS Value and Optionally Enable the Broadcast
const ipnsLabel = `myFirstIpnsKey`;
await nameManager.set(ipnsLabel, uploadedObject.cid, {
  enabled: true,
});
// Enable IPNS Broadcast without updating the IPNS Record
await nameManager.toggle(ipnsLabel, true);
// List IPNS Names
const myIpnsNames = await nameManager.list();
// List Specific IPNS Name
const myIpnsName = await nameManager.list(ipnsLabel);
// Import IPNS Name
const myImportedIpnsName = await nameManager.import(ipnsLabel, uploadedObject.cid, Base64EncodedPrivateKey, {
  enabled: false,
});

// Initialize GatewayManager
const gatewayManager = new GatewayManager(S3_KEY, S3_SECRET);
// Create New Gateway
const gatewayName = "myRandomGatewayName";
const myGateway = await gatewayManager.create(gatewayName);
// Get Gateway Setup
const gatewayConfig = await gatewayManager.get(gatewayName);
// List IPFS Gateways
const myGateways = await gatewayManager.list();
// Update Gateway
const myUpdatedGateway = await gatewayManager.update(gatewayName, {
  enabled: false
});
// Toggle Gateway State
await gatewayManager.toggle(gatewayName, true)

// Delete Object
await objectManager.delete(objectName);

// Delete Bucket
await bucketManager.delete(bucketName);

// Delete Name
await nameManager.delete(ipnsLabel);

// Delete Gateway
await gatewayManager.delete(gatewayName);
````

Full API reference doc for the JS client are available at https://filebase.github.io/filebase-sdk

### Testing

Test are found in the `test` directory and are built to be run with the Node.js v20+ test runner.