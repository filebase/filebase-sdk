**node.js**
````js
// Import Classes
import {ObjectManager} from 'filebase-sdk';

// Initialize ObjectManager
const bucketName = `create-object-[random string]`;
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

// Delete Object
await objectManager.delete(objectName);