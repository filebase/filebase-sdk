**node.js**
````js
// Import Classes
import {NameManager} from 'filebase-sdk';

// Initialize NameManager
const nameManager = new NameManager(S3_KEY, S3_SECRET);

// Create New IPNS Name with Broadcast Disabled
const ipnsCid = "QmZqkuqX1qTspb1GgmnzyRFetf1uMyA3CemvvgPZD39sPo";
const ipnsName = await nameManager.create(`myFirstIpnsKey`, ipnsCid, {
    enabled: true
});

// Update IPNS Value and Optionally Enable the Broadcast
const ipnsLabel = `myFirstIpnsKey`;
await nameManager.set(ipnsLabel, ipnsCid, {
    enabled: true,
});

// Enable IPNS Broadcast without updating the IPNS Record
await nameManager.toggle(ipnsLabel, true);

// List IPNS Names
const myIpnsNames = await nameManager.list();

// List Specific IPNS Name
const myIpnsName = await nameManager.list(ipnsLabel);

// Import IPNS Name
const myImportedIpnsName = await nameManager.import(ipnsLabel, ipnsCid, Base64EncodedPrivateKey, {
    enabled: false,
});

// Delete Name
await nameManager.delete(ipnsLabel);