**node.js**
````js
// Import Client
import { FilebaseClient } from '@filebase/sdk';

// Initialize FilebaseClient
const client = new FilebaseClient(S3_KEY, S3_SECRET, {
    bucket: bucketName,
    endpoints: {
        gateway: "https://myRandomGatewayName.myfilebase.com"
    }
});

// Create New Pin
const myNewPin = await client.pinFile("my-pin", "QmTJkc7crTuPG7xRmCQSz1yioBpCW3juFBtJPXhQfdCqGF");