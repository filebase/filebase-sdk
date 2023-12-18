**node.js**
````js
// Import Classes
import {BucketManager} from 'filebase-sdk'

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

// Delete Bucket
await bucketManager.delete(bucketName);