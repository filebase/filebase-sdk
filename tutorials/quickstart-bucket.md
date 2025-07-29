**node.js**
````js
// Import Client
import { FilebaseClient } from '@filebase/sdk';

// Initialize FilebaseClient
const client = new FilebaseClient(S3_KEY, S3_SECRET);

// Create bucket
const bucketName = `create-bucket-[random string]`;
await client.createBucket(bucketName);

// List buckets
const bucketsList = await client.listBuckets();

// Delete Bucket
await client.deleteBucket(bucketName);