**node.js**
````js
// Import Client
import { FilebaseClient } from '@filebase/sdk';

// Initialize FilebaseClient
const bucketName = `create-file-[random string]`;
const client = new FilebaseClient(S3_KEY, S3_SECRET, {
  bucket: bucketName
});

// Upload File
const fileName = `new-file`;
const uploadedFile = await client.uploadFile(fileName, new Blob["Hello Filebase!"]);

// Confirm File Uploaded
const filesList = await client.listFiles(key, {
    limit: 1,
});
console.dir(filesList);

// Delete File
await client.deleteFile(fileName);