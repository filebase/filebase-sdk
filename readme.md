<h1 align="center">&#x2025; Filebase SDK &#x2025;</h1>
<p align="center">Developer Friendly [ <a href="https://docs.ipfs.tech/concepts/what-is-ipfs/" title="What is IPFS?">IPFS</a> | <a href="https://docs.ipfs.tech/concepts/ipns/" title="What is IPNS?">IPNS</a> | S3 ]</p>

## About

The Filebase SDK provides a hybrid data management solution, blending S3-compatible cloud storage with IPFS
(InterPlanetary File System) pinning services. It features robust S3 bucket management, object handling for uploads and
downloads, and seamless integration with IPFS and IPNS (InterPlanetary Naming System) for decentralized storage
operations. The SDK supports advanced data tasks like compiling files into CAR (Content Addressable aRchive) formats and
ensures secure transactions through strong authentication. Designed for varied applications, the Filebase SDK is ideal
for scenarios demanding the dependability of cloud storage combined with the advantages of decentralized, peer-to-peer
storage, catering to diverse needs such as content distribution, data backup, and archival. Developing InterPlanetary
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

The snippet below shows how to create a new bucket, upload a new file to IPFS with `ObjectManager`, publish the 
object to IPNS, delete the object and finally delete the bucket.

To use the library in your project, use npm or yarn to install the [
`@filebase/sdk`](https://www.npmjs.com/package/@filebase/sdk) module. Requires node.js 16+.

**node.js**

````js
// Import example
import {FilebaseClient} from '@filebase/sdk'

// Create bucket
const client = new FilebaseClient(S3_KEY, S3_SECRET);
const bucketName = `create-bucket-[random string]`;
await client.createBucket(bucketName);

// Upload File
const client = new FilebaseClient(S3_KEY, S3_SECRET, {
  bucket: bucketName
});
const fileName = `new-object`;
const uploadedFile = await client.uploadFile(fileName, new Blob(["Hello Filebase!"]));

// Download File
const client = new FilebaseClient(S3_KEY, S3_SECRET, {
  bucket: bucketName
});
await client.downloadFile("/organized/my-object");
await client.fetchContentByCid(uploadedFile.cid, {
  endpoint: "my-custom-gateway.myfilebase.com",
});

// Copy File to a New Bucket
const client = new FilebaseClient(S3_KEY, S3_SECRET, {
  bucket: bucketName
});
const bucketCopyDestinationName = `copy-dest-bucket`
await client.createBucket(bucketCopyDestinationName);
await client.copyFile(`my-original-file`, 'my-copied-file', {
  destinationBucket: bucketCopyDestinationName
});

// Create New IPNS Name with Broadcast Disabled
const client = new FilebaseClient(S3_KEY, S3_SECRET);
const ipnsLabel = `myFirstIpnsKey`;
const ipnsName = await client.createIpnsName(ipnsLabel, uploadedObject.cid, {
  enabled: true
});
const downloadedFile = await client.fetchContentByIpnsName(ipnsLabel, {
  endpoint: "my-gw.myfilebase.com"
})

// Create New Gateway
const client = new FilebaseClient(S3_KEY, S3_SECRET);
const gatewayName = "myRandomGatewayName";
const myGateway = await client.createGateway(gatewayName);

// Create New Pin
const client = new FilebaseClient(S3_KEY, S3_SECRET, {
  bucket: bucketName,
  gateway: {
    endpoint: "https://myRandomGatewayName.myfilebase.com"
  }
});
const myNewPin = await client.pinFile("my-pin", "QmTJkc7crTuPG7xRmCQSz1yioBpCW3juFBtJPXhQfdCqGF");
````

Full API reference doc for the JS client are available at https://filebase.github.io/filebase-sdk

### Testing

Test are found in the `test` directory and are built to be run with the Node.js v20+ test runner.