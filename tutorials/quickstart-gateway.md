**node.js**
````js
// Import Client
import { FilebaseClient } from '@filebase/sdk';

// Initialize FilebaseClient
const client = new FilebaseClient(S3_KEY, S3_SECRET);

// Create New Gateway with a custom domain of `cname.mycustomdomain.com`.
// The custom domain must already exist and have a CNAME record pointed at `myRandomGatewayName.myfilebase.com`.
const gatewayName = "myRandomGatewayName";
const myGateway = await client.createGateway(gatewayname, {
  domain: `cname.mycustomdomain.com`
});

// Get Gateway Setup
const gatewayConfig = await client.getGateway(gatewayName);

// List IPFS Gateways
const myGateways = await client.listGateways();

// Update Gateway
const myUpdatedGateway = await client.updateGateway(gatewayName, {
    enabled: false
});

// Delete Gateway
await client.deleteGateway(gatewayName);