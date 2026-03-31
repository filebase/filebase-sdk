**node.js**
````js
// Import Client
import { FilebaseClient } from '@filebase/sdk';

// Initialize FilebaseClient
const client = new FilebaseClient(S3_KEY, S3_SECRET);

// Create New IPNS Name with Broadcast Disabled
const ipnsCid = "QmZqkuqX1qTspb1GgmnzyRFetf1uMyA3CemvvgPZD39sPo";
const ipnsName = await client.createIpnsName(`myFirstIpnsKey`, ipnsCid, {
    enabled: true
});

// Update IPNS Value and Optionally Enable the Broadcast
const ipnsLabel = `myFirstIpnsKey`;
await client.updateIpnsName(ipnsLabel, ipnsCid, {
    enabled: true
});

// List IPNS Names
const myIpnsNames = await client.listIpnsNames();

// List Specific IPNS Name
const myIpnsName = await client.getIpnsName(ipnsLabel);

// Import IPNS Name
const myImportedIpnsName = await client.importIpnsName(ipnsLabel, ipnsCid, Base64EncodedPrivateKey, {
    enabled: false,
});

// Resolve IPNS CID
const resolvedCid = await client.resolveIpnsName(ipnsCid);

// Delete Name
await client.deleteIpnsName(ipnsLabel);