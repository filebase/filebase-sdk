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
import {BucketManager, ObjectManager, NameManager, GatewayManager, PinManager} from 'filebase-sdk'

// Initialize BucketManager
const bucketManager = new BucketManager(S3_KEY, S3_SECRET);
// Create bucket
const bucketName = `create-bucket-[random string]`;
await bucketManager.create(bucketName);

// Initialize ObjectManager
const objectManager = new ObjectManager(S3_KEY, S3_SECRET, {
  bucket: bucketName
});
// Upload Object
const objectName = `new-object`;
const uploadedObject = await objectManager.upload(objectName, body);
// Download Object
await uploadedObject.download();
// Copy Object to a New Bucket
const bucketCopyDestinationName = `copy-dest-bucket`
await bucketManager.create(bucketCopyDestinationName);
await objectManager.copy(`new-object`, bucketCopyDestinationName);

// Initialize NameManager
const nameManager = new NameManager(S3_KEY, S3_SECRET);
// Create New IPNS Name with Broadcast Disabled
const ipnsLabel = `myFirstIpnsKey`;
const ipnsName = await nameManager.create(ipnsLabel, uploadedObject.cid, {
  enabled: true
});

// Initialize GatewayManager
const gatewayManager = new GatewayManager(S3_KEY, S3_SECRET);
// Create New Gateway
const gatewayName = "myRandomGatewayName";
const myGateway = await gatewayManager.create(gatewayName);

// Initialize PinManager
const pinManager = new PinManager(S3_KEY, S3_SECRET, {
  bucket: bucketName,
  gateway: {
    endpoint: "https://myRandomGatewayName.myfilebase.com"
  }
});
// Create New Pin with Metadata
const myNewPin = await pinManager.create("my-pin", "QmTJkc7crTuPG7xRmCQSz1yioBpCW3juFBtJPXhQfdCqGF", {
  "application": "my-custom-app-on-filebase"
});
````

Full API reference doc for the JS client are available at https://filebase.github.io/filebase-sdk

### Testing

Test are found in the `test` directory and are built to be run with the Node.js v20+ test runner.