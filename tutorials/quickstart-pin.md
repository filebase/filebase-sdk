**node.js**
````js
// Import Classes
import {PinManager} from 'filebase-sdk';

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