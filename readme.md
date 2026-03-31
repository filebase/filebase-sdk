# 🗂️ Filebase SDK

[![npm version](https://badge.fury.io/js/@filebase%2Fsdk.svg)](https://badge.fury.io/js/@filebase%2Fsdk)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

---
## About

The Filebase SDK for JavaScript offers a straightforward way to add decentralized storage to your applications. It lets your team easily work with IPFS and IPNS, handling the tricky parts for you.

Here's what you can do:

* Manage Storage: Easily create and control your storage spaces and gateways.
* Handle IPFS Files: Upload, download, and "pin" files to the IPFS network with ease.
* Control IPNS Names: Set up and find IPNS names to keep your content links consistent.
* Move Data: Quickly copy files between different storage spots.

Just install it with `npm install @filebase/sdk`. This SDK helps your team quickly build solutions using the power of decentralized data. Check out the full guide for all the details!

### Getting started

The snippet below shows how to create a new bucket, create a new gateway, upload a file to IPFS, publish the 
file to IPNS.

To use the library in your project, use npm to install the [
`@filebase/sdk`](https://www.npmjs.com/package/@filebase/sdk) module.

**node.js**

````js
// Import example
import {FilebaseClient} from '@filebase/sdk'

// Create bucket
const client = new FilebaseClient(clientKey, clientSecret);
const bucketName = `create-bucket-[random string]`;
await client.createBucket(bucketName);

// Create New Gateway
const gatewayName = "myRandomGatewayName";
const myGateway = await client.createGateway(gatewayName);

// Upload File
const client = new FilebaseClient(clientKey, clientSecret, {
	bucket: bucketName,
	gateway: "https://myRandomGatewayName.myfilebase.com"
});
const fileName = `new-object`;
const uploadedFile = await client.uploadFile(fileName, new Blob(["Hello Filebase!"]));

// Pin File
const myNewPin = await client.pinFile("my-pin", "QmTJkc7crTuPG7xRmCQSz1yioBpCW3juFBtJPXhQfdCqGF");

// Download File
await client.downloadFile("/organized/my-object");
await client.fetchContentByCid(uploadedFile.cid, {
  endpoint: "my-custom-gateway.myfilebase.com",
});

// Copy File to a New Bucket
const bucketCopyDestinationName = `copy-dest-bucket`
await client.createBucket(bucketCopyDestinationName);
await client.copyFile(`my-original-file`, 'my-copied-file', {
  destinationBucket: bucketCopyDestinationName
});

// Create New IPNS Name with Broadcast Disabled
const ipnsLabel = `myFirstIpnsKey`;
const ipnsName = await client.createIpnsName(ipnsLabel, uploadedObject.cid, {
  enabled: true
});
const downloadedFile = await client.fetchContentByIpnsName(ipnsLabel, {
  endpoint: "my-gw.myfilebase.com"
})
````

Full API reference doc for the JS client are available at https://filebase.github.io/filebase-sdk