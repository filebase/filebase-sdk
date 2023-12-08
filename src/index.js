import BucketManager from "./bucketManager.js";
import ObjectManager from "./objectManager.js";
import NameManager from "./nameManager.js";

/**
 * @typedef {Object} clientCredentials
 * @property {string} accessKeyId The access key ID for authentication.
 * @property {string} secretAccessKey The secret access key for authentication.
 */

/**
 * @typedef {Object} clientConfig
 * @property {clientCredentials} credentials The credentials object for authentication.
 * @property {string} endpoint The API endpoint URL.
 */

export { BucketManager, ObjectManager, NameManager };
