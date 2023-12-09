import BucketManager from "./bucketManager.js";
import ObjectManager from "./objectManager.js";
import NameManager from "./nameManager.js";

/**
 * @typedef {Object} clientConfiguration
 * @property {clientConfigurationCredentials} credentials The credentials object for authentication.
 */

/**
 * @typedef {Object} clientConfigurationCredentials
 * @property {string} accessKeyId The access key ID for authentication.
 * @property {string} secretAccessKey The secret access key for authentication.
 */

export { BucketManager, ObjectManager, NameManager };
