**node.js**
````js
// Import Classes
import {GatewayManager} from '@filebase/sdk';

// Initialize GatewayManager
const gatewayManager = new GatewayManager(S3_KEY, S3_SECRET);

// Create New Gateway with a custom domain of `cname.mycustomdomain.com`.
// The custom domain must already exist and have a CNAME record pointed at `myRandomGatewayName.myfilebase.com`.
const gatewayName = "myRandomGatewayName";
const myGateway = await gatewayManager.create(gatewayName);
await gatewayManager.create(gatewayname, {
  domain: `cname.mycustomdomain.com`
});

// Get Gateway Setup
const gatewayConfig = await gatewayManager.get(gatewayName);

// List IPFS Gateways
const myGateways = await gatewayManager.list();

// Update Gateway
const myUpdatedGateway = await gatewayManager.update(gatewayName, {
    enabled: false
});

// Toggle Gateway State
await gatewayManager.toggle(gatewayName, true)

// Delete Gateway
await gatewayManager.delete(gatewayName);