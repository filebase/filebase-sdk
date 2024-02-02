// src/bucketManager.js
import {
  CreateBucketCommand,
  DeleteBucketCommand,
  GetBucketAclCommand,
  ListBucketsCommand,
  PutBucketAclCommand,
  S3Client
} from "@aws-sdk/client-s3";
var BucketManager = class {
  #DEFAULT_ENDPOINT = "https://s3.filebase.com";
  #DEFAULT_REGION = "us-east-1";
  #client;
  /**
   * @summary Creates a new instance of the constructor.
   * @param {string} clientKey - The access key ID for authentication.
   * @param {string} clientSecret - The secret access key for authentication.
   * @tutorial quickstart-bucket
   * @example
   * import { BucketManager } from "@filebase/sdk";
   * const bucketManager = new BucketManager("KEY_FROM_DASHBOARD", "SECRET_FROM_DASHBOARD");
   */
  constructor(clientKey, clientSecret) {
    const clientEndpoint = process.env.NODE_ENV === "test" ? process.env.TEST_S3_ENDPOINT || this.#DEFAULT_ENDPOINT : this.#DEFAULT_ENDPOINT, clientConfiguration = {
      credentials: {
        accessKeyId: clientKey,
        secretAccessKey: clientSecret
      },
      endpoint: clientEndpoint,
      region: this.#DEFAULT_REGION,
      forcePathStyle: true
    };
    this.#client = new S3Client(clientConfiguration);
  }
  /**
   * @typedef {Object} bucket
   * @property {string} Name The name of the bucket
   * @property {date} Date the bucket was created
   */
  /**
   * @summary Creates a new bucket with the specified name.
   * @param {string} name - The name of the bucket to create.
   * @returns {Promise<bucket>} - A promise that resolves when the bucket is created.
   * @example
   * // Create bucket with name of `create-bucket-example`
   * await bucketManager.create(`create-bucket-example`);
   */
  async create(name) {
    const command = new CreateBucketCommand({
      Bucket: name
    });
    return await this.#client.send(command);
  }
  /**
   * @summary Lists the buckets in the client.
   * @returns {Promise<Array<bucket>>} - A promise that resolves with an array of objects representing the buckets in the client.
   * @example
   * // List all buckets
   * await bucketManager.list();
   */
  async list() {
    const command = new ListBucketsCommand({}), { Buckets } = await this.#client.send(command);
    return Buckets;
  }
  /**
   * @summary Deletes the specified bucket.
   * @param {string} name - The name of the bucket to delete.
   * @returns {Promise<boolean>} - A promise that resolves when the bucket is deleted.
   * @example
   * // Delete bucket with name of `bucket-name-to-delete`
   * await bucketManager.delete(`bucket-name-to-delete`);
   */
  async delete(name) {
    const command = new DeleteBucketCommand({
      Bucket: name
    });
    await this.#client.send(command);
    return true;
  }
  /**
   * @summary Sets the privacy of a given bucket.
   * @param {string} name - The name of the bucket to toggle.
   * @param {boolean} targetState - The new target state. [true=private,false=public]
   * @returns {Promise<boolean>} A promise that resolves to true if the bucket was successfully toggled.
   * @example
   * // Toggle bucket with label of `toggle-bucket-example`
   * await bucketManager.setPrivacy(`toggle-bucket-example`, true);  // Enabled
   * await bucketManager.setPrivacy(`toggle-bucket-example`, false); // Disabled
   */
  async setPrivacy(name, targetState) {
    const command = new PutBucketAclCommand({
      Bucket: name,
      ACL: targetState ? "private" : "public-read"
    });
    await this.#client.send(command);
    return true;
  }
  /**
   * @summary Gets the privacy of a given bucket
   * @param {string} name - The name of the bucket to query.
   * @returns {Promise<boolean>} A promise that resolves to true if the bucket is private.
   */
  async getPrivacy(name) {
    const command = new GetBucketAclCommand({
      Bucket: name
    });
    const response = await this.#client.send(command), readPermission = response.Grants.find((grant) => {
      return grant.Grantee.Type === "Group" && grant.Permission === "READ";
    });
    return !(typeof readPermission !== "undefined");
  }
};
var bucketManager_default = BucketManager;

// src/gatewayManager.js
import axios2 from "axios";

// src/helpers.js
import axios from "axios";
var GATEWAY_DEFAULT_TIMEOUT = 6e4;
async function downloadFromGateway(cid, options) {
  if (typeof options.endpoint !== "string") {
    throw new Error(`Default Gateway must be set`);
  }
  const downloadHeaders = {};
  if (options.token) {
    downloadHeaders["x-filebase-gateway-token"] = options.token;
  }
  const downloadResponse = await axios.request({
    method: "GET",
    baseURL: options.endpoint,
    url: `/ipfs/${cid}`,
    headers: downloadHeaders,
    type: "stream",
    timeout: (options == null ? void 0 : options.timeout) || GATEWAY_DEFAULT_TIMEOUT
  });
  return downloadResponse.data;
}
function apiErrorHandler(err) {
  var _a, _b, _c;
  if ((err == null ? void 0 : err.response) && ((_a = err == null ? void 0 : err.response) == null ? void 0 : _a.status) && (err.response.status.toString()[0] === "4" || err.response.status.toString()[0] === "5")) {
    throw new Error(
      ((_b = err.response.data.error) == null ? void 0 : _b.details) || ((_c = err.response.data.error) == null ? void 0 : _c.reason) || err
    );
  }
  throw err;
}

// src/gatewayManager.js
var GatewayManager = class {
  #DEFAULT_ENDPOINT = "https://api.filebase.io";
  #DEFAULT_TIMEOUT = 6e4;
  #client;
  /**
   * @summary Creates a new instance of the constructor.
   * @param {string} clientKey - The access key ID for authentication.
   * @param {string} clientSecret - The secret access key for authentication.
   * @tutorial quickstart-gateway
   * @example
   * import { GatewayManager } from "@filebase/sdk";
   * const gatewayManager = new GatewayManager("KEY_FROM_DASHBOARD", "SECRET_FROM_DASHBOARD");
   */
  constructor(clientKey, clientSecret) {
    const clientEndpoint = process.env.NODE_ENV === "test" ? process.env.TEST_GW_ENDPOINT || this.#DEFAULT_ENDPOINT : this.#DEFAULT_ENDPOINT, encodedToken = Buffer.from(`${clientKey}:${clientSecret}`).toString(
      "base64"
    ), baseURL = `${clientEndpoint}/v1/gateways`;
    this.#client = axios2.create({
      baseURL,
      timeout: this.#DEFAULT_TIMEOUT,
      headers: { Authorization: `Bearer ${encodedToken}` }
    });
  }
  /**
   * @typedef {Object} gateway
   * @property {string} name Name for the gateway
   * @property {string} domain Custom Domain for the gateway
   * @property {boolean} enabled Whether the gateway is enabled or not
   * @property {string} private Whether the gateway is scoped to users content
   * @property {date} created_at Date the gateway was created
   * @property {date} updated_at Date the gateway was last updated
   */
  /**
   * @typedef {Object} gatewayOptions
   * @property {boolean} [domain] Optional Domain to allow for using a Custom Domain
   * @property {string} [enabled] Optional Toggle to use for enabling the gateway
   * @property {boolean} [private] Optional Boolean determining if gateway is Public or Private
   */
  /**
   * @summary Creates a gateway with the given name and options
   * @param {string} name Unique name across entire platform for the gateway.  Must be a valid subdomain name.
   * @param {gatewayOptions} [options]
   * @returns {Promise<gateway>} - A promise that resolves to the value of a gateway.
   * @example
   * // Create gateway with name of `create-gateway-example` and a custom domain of `cname.mycustomdomain.com`.
   * // The custom domain must already exist and have a CNAME record pointed at `create-gateway-example.myfilebase.com`.
   * await gatewayManager.create(`create-gateway-example`, {
   *   domain: `cname.mycustomdomain.com`
   * });
   */
  async create(name, options = {}) {
    try {
      let createOptions = {
        name
      };
      if (typeof options.domain === "string") {
        createOptions.domain = options.domain;
      }
      if (typeof options.enabled === "boolean") {
        createOptions.enabled = options.enabled;
      }
      if (typeof options.private === "boolean") {
        createOptions.private = options.private;
      }
      const createResponse = await this.#client.request({
        method: "POST",
        data: createOptions
      });
      return createResponse.data;
    } catch (err) {
      apiErrorHandler(err);
    }
  }
  /**
   * @summary Deletes a gateway with the given name.
   * @param {string} name - The name of the gateway to delete.
   * @returns {Promise<boolean>} - A promise that resolves to true if the gateway was successfully deleted.
   * @example
   * // Delete gateway with name of `delete-gateway-example`
   * await gatewayManager.delete(`delete-name-example`);
   */
  async delete(name) {
    try {
      await this.#client.request({
        method: "DELETE",
        url: `/${name}`,
        validateStatus: (status) => {
          return status === 204;
        }
      });
      return true;
    } catch (err) {
      apiErrorHandler(err);
    }
  }
  /**
   * @summary Returns the value of a gateway
   * @param {string} name - Parameter representing the name to get.
   * @returns {Promise<gateway|false>} - A promise that resolves to the value of a gateway.
   * @example
   * // Get gateway with name of `gateway-get-example`
   * await gatewayManager.get(`gateway-get-example`);
   */
  async get(name) {
    try {
      const getResponse = await this.#client.request({
        method: "GET",
        url: `/${name}`,
        validateStatus: (status) => {
          return status === 200 || status === 404;
        }
      });
      return getResponse.status === 200 ? getResponse.data : false;
    } catch (err) {
      apiErrorHandler(err);
    }
  }
  /**
   * @summary Returns a list of gateways
   * @returns {Promise<Array.<gateway>>} - A promise that resolves to an array of gateways.
   * @example
   * // List all gateways
   * await gatewayManager.list();
   */
  async list() {
    try {
      const getResponse = await this.#client.request({
        method: "GET"
      });
      return getResponse.data;
    } catch (err) {
      apiErrorHandler(err);
    }
  }
  /**
   * @summary Updates the specified gateway.
   * @param {string} name - The name of the gateway to update.
   * @param {gatewayOptions} options - The options for the update operation.
   *
   * @returns {Promise<boolean>} - A Promise that resolves to true if the gateway was updated.
   * @example
   * // Update gateway with name of `update-gateway-example` and set the gateway to only serve CIDs pinned by user.
   * await gatewayManager.update(`update-gateway-example`, {
   *   private: true
   * });
   */
  async update(name, options) {
    try {
      const updateOptions = {
        name
      };
      if (options == null ? void 0 : options.domain) {
        updateOptions.domain = String(options.private);
      }
      if (options == null ? void 0 : options.enabled) {
        updateOptions.enabled = Boolean(options.enabled);
      }
      if (options == null ? void 0 : options.private) {
        updateOptions.private = Boolean(options.private);
      }
      await this.#client.request({
        method: "PUT",
        url: `/${name}`,
        data: updateOptions,
        validateStatus: (status) => {
          return status === 200;
        }
      });
      return true;
    } catch (err) {
      apiErrorHandler(err);
    }
  }
  /**
   * @summary Toggles the enabled state of a given gateway.
   * @param {string} name - The name of the gateway to toggle.
   * @param {boolean} targetState - The new target state.
   * @returns {Promise<boolean>} A promise that resolves to true if the gateway was successfully toggled.
   * @example
   * // Toggle gateway with label of `toggle-gateway-example`
   * await gatewayManager.toggle(`toggle-gateway-example`, true);  // Enabled
   * await gatewayManager.toggle(`toggle-gateway-example`, false); // Disabled
   */
  async toggle(name, targetState) {
    try {
      await this.#client.request({
        method: "PUT",
        url: `/${name}`,
        data: {
          enabled: Boolean(targetState)
        },
        validateStatus: (status) => {
          return status === 200;
        }
      });
      return true;
    } catch (err) {
      apiErrorHandler(err);
    }
  }
};
var gatewayManager_default = GatewayManager;

// src/nameManager.js
import axios3 from "axios";
var NameManager = class {
  #DEFAULT_ENDPOINT = "https://api.filebase.io";
  #DEFAULT_TIMEOUT = 6e4;
  #client;
  /**
   * @summary Creates a new instance of the constructor.
   * @param {string} clientKey - The access key ID for authentication.
   * @param {string} clientSecret - The secret access key for authentication.
   * @tutorial quickstart-name
   * @example
   * import { NameManager } from "@filebase/sdk";
   * const nameManager = new NameManager("KEY_FROM_DASHBOARD", "SECRET_FROM_DASHBOARD");
   */
  constructor(clientKey, clientSecret) {
    const clientEndpoint = process.env.NODE_ENV === "test" ? process.env.TEST_NAME_ENDPOINT || this.#DEFAULT_ENDPOINT : this.#DEFAULT_ENDPOINT, encodedToken = Buffer.from(`${clientKey}:${clientSecret}`).toString(
      "base64"
    ), baseURL = `${clientEndpoint}/v1/names`;
    this.#client = axios3.create({
      baseURL,
      timeout: this.#DEFAULT_TIMEOUT,
      headers: { Authorization: `Bearer ${encodedToken}` }
    });
  }
  /**
   * @typedef {Object} name
   * @property {string} label Descriptive label for the Key
   * @property {string} network_key IPNS Key CID
   * @property {string} cid Value that name Publishes
   * @property {number} sequence Version Number for the name
   * @property {boolean} enabled Whether the name is being Published or not
   * @property {date} published_at Date the name was last published to the DHT
   * @property {date} created_at Date the name was created
   * @property {date} updated_at Date the name was last updated
   */
  /**
   * @typedef {Object} nameOptions
   * @property {boolean} [enabled] Whether the name is enabled or not.
   */
  /**
   * @summary Creates a new IPNS name with the given name as the label and CID.
   * @param {string} label - The label of the new IPNS name.
   * @param {string} cid - The CID of the IPNS name.
   * @param {nameOptions} [options] - Additional options for the IPNS name.
   * @returns {Promise<name>} - A Promise that resolves with the response JSON.
   * @example
   * // Create IPNS name with label of `create-name-example` and CID of `QmdmQXB2mzChmMeKY47C43LxUdg1NDJ5MWcKMKxDu7RgQm`
   * await nameManager.create(`create-name-example`, `QmdmQXB2mzChmMeKY47C43LxUdg1NDJ5MWcKMKxDu7RgQm`);
   */
  async create(label, cid, options = {
    enabled: true
  }) {
    try {
      const createResponse = await this.#client.request({
        method: "POST",
        data: {
          label,
          cid,
          enabled: (options == null ? void 0 : options.enabled) !== false
        }
      });
      return createResponse.data;
    } catch (err) {
      apiErrorHandler(err);
    }
  }
  /**
   * @summary Imports a user's IPNS private key.
   * @param {string} label - The label for the IPNS name.
   * @param {string} cid - The CID (Content Identifier) of the data.
   * @param {string} privateKey - The existing private key encoded in Base64.
   * @param {nameOptions} [options] - Additional options for the IPNS name.
   * @returns {Promise<name>} - A Promise that resolves to the server response.
   * @example
   * // Import IPNS private key with label of `create-name-example`, CID of `QmdmQXB2mzChmMeKY47C43LxUdg1NDJ5MWcKMKxDu7RgQm`
   * // and a private key encoded with base64
   * await nameManager.import(
   *  `create-name-example`,
   *  `QmdmQXB2mzChmMeKY47C43LxUdg1NDJ5MWcKMKxDu7RgQm`
   *  `BASE64_ENCODED_PRIVATEKEY`
   * );
   */
  async import(label, cid, privateKey, options = {
    enabled: true
  }) {
    try {
      const importResponse = await this.#client.request({
        method: "POST",
        data: {
          label,
          cid,
          network_private_key: privateKey,
          enabled: (options == null ? void 0 : options.enabled) !== false
        }
      });
      return importResponse.data;
    } catch (err) {
      apiErrorHandler(err);
    }
  }
  /**
   * @summary Updates the specified name with the given CID.
   * @param {string} label - The label of the name to update.
   * @param {string} cid - The cid to associate with the name.
   * @param {nameOptions} options - The options for the set operation.
   *
   * @returns {Promise<boolean>} - A Promise that resolves to true if the IPNS name was updated.
   * @example
   * // Update name with label of `update-name-example` and set the value of the IPNS name.
   * await nameManager.update(`update-name-example`, `bafybeidt4nmaci476lyon2mvgfmwyzysdazienhxs2bqnfpdainzjuwjom`);
   */
  async update(label, cid, options = {}) {
    try {
      const updateOptions = {
        cid
      };
      if (options == null ? void 0 : options.enabled) {
        updateOptions.enabled = Boolean(options.enabled);
      }
      await this.#client.request({
        method: "PUT",
        url: `/${label}`,
        data: updateOptions,
        validateStatus: (status) => {
          return status === 200;
        }
      });
      return true;
    } catch (err) {
      apiErrorHandler(err);
    }
  }
  /**
   * @summary Returns the value of an IPNS name
   * @param {string} label - Parameter representing the label of the name to resolve.
   * @returns {Promise<name>} - A promise that resolves to the value of a name.
   * @example
   * // Get IPNS name with label of `list-name-example`
   * await nameManager.get(`list-name-example`);
   */
  async get(label) {
    try {
      const getResponse = await this.#client.request({
        method: "GET",
        url: `/${label}`,
        validateStatus: (status) => {
          return status === 200 || status === 404;
        }
      });
      return getResponse.status === 200 ? getResponse.data : false;
    } catch (err) {
      apiErrorHandler(err);
    }
  }
  /**
   * @summary Returns a list of IPNS names
   * @returns {Promise<Array.<name>>} - A promise that resolves to an array of names.
   * @example
   * // List all IPNS names
   * await nameManager.list();
   */
  async list() {
    try {
      const listResponse = await this.#client.request({
        method: "GET"
      });
      return listResponse.data;
    } catch (err) {
      apiErrorHandler(err);
    }
  }
  /**
   * @summary Deletes an IPNS name with the given label.
   * @param {string} label - The label of the IPNS name to delete.
   * @returns {Promise<boolean>} - A promise that resolves to true if the IPNS name was successfully deleted.
   * @example
   * // List IPNS name with label of `delete-name-example`
   * await nameManager.delete(`delete-name-example`);
   */
  async delete(label) {
    try {
      await this.#client.request({
        method: "DELETE",
        url: `/${label}`,
        validateStatus: (status) => {
          return status === 204;
        }
      });
      return true;
    } catch (err) {
      apiErrorHandler(err);
    }
  }
  /**
   * @summary Toggles the enabled state of a given IPNS name.
   * @param {string} label - The label of the IPNS name to toggle.
   * @param {boolean} targetState - The new target state.
   * @returns {Promise<boolean>} A promise that resolves to true if the IPNS name was successfully toggled.
   * @example
   * // Toggle IPNS name with label of `toggle-name-example`
   * await nameManager.toggle(`toggle-name-example`, true);  // Enabled
   * await nameManager.toggle(`toggle-name-example`, false); // Disabled
   */
  async toggle(label, targetState) {
    try {
      await this.#client.request({
        method: "PUT",
        url: `/${label}`,
        data: {
          enabled: targetState
        },
        validateStatus: (status) => {
          return status === 200;
        }
      });
      return true;
    } catch (err) {
      apiErrorHandler(err);
    }
  }
};
var nameManager_default = NameManager;

// src/objectManager.js
import {
  CopyObjectCommand,
  DeleteObjectCommand,
  GetObjectCommand,
  HeadObjectCommand,
  ListObjectsV2Command,
  S3Client as S3Client2
} from "@aws-sdk/client-s3";
import { Upload } from "@aws-sdk/lib-storage";
import { CarWriter } from "@ipld/car";
import { car } from "@helia/car";
import { unixfs } from "@helia/unixfs";
import { FsBlockstore } from "blockstore-fs";
import { createReadStream, createWriteStream } from "node:fs";
import { mkdir, rm } from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import { Readable } from "node:stream";
import { v4 as uuidv4 } from "uuid";
var ObjectManager = class {
  #DEFAULT_ENDPOINT = "https://s3.filebase.com";
  #DEFAULT_REGION = "us-east-1";
  #DEFAULT_MAX_CONCURRENT_UPLOADS = 4;
  #client;
  #credentials;
  #defaultBucket;
  #gatewayConfiguration;
  #maxConcurrentUploads;
  /**
   * @typedef {Object} objectManagerOptions Optional settings for the constructor.
   * @property {string} [bucket] Default bucket to use.
   * @property {objectDownloadOptions} [gateway] Default gateway to use.
   * @property {number} [maxConcurrentUploads] The maximum number of concurrent uploads.
   */
  /**
   * @typedef {Object} objectDownloadOptions Optional settings for downloading objects
   * @property {string} endpoint Default gateway to use.
   * @property {string} [token] Token for the default gateway.
   * @property {number} [timeout=60000] Timeout for the default gateway
   */
  /**
   * @summary Creates a new instance of the constructor.
   * @param {string} clientKey - The access key ID for authentication.
   * @param {string} clientSecret - The secret access key for authentication.
   * @param {objectManagerOptions} options - Optional settings for the constructor.
   * @tutorial quickstart-object
   * @example
   * import { ObjectManager } from "@filebase/sdk";
   * const objectManager = new ObjectManager("KEY_FROM_DASHBOARD", "SECRET_FROM_DASHBOARD", {
   *   bucket: "my-default-bucket",
   *   maxConcurrentUploads: 4,
   *   gateway: {
   *     endpoint: "https://my-default-gateway.mydomain.com
   *     token: SUPER_SECRET_GATEWAY_TOKEN
   *   }
   * });
   */
  constructor(clientKey, clientSecret, options) {
    var _a, _b, _c;
    const clientEndpoint = process.env.NODE_ENV === "test" ? process.env.TEST_S3_ENDPOINT || this.#DEFAULT_ENDPOINT : this.#DEFAULT_ENDPOINT, clientConfiguration = {
      credentials: {
        accessKeyId: clientKey,
        secretAccessKey: clientSecret
      },
      endpoint: clientEndpoint,
      region: this.#DEFAULT_REGION,
      forcePathStyle: true
    };
    this.#defaultBucket = options == null ? void 0 : options.bucket;
    this.#maxConcurrentUploads = (options == null ? void 0 : options.maxConcurrentUploads) || this.#DEFAULT_MAX_CONCURRENT_UPLOADS;
    this.#credentials = {
      key: clientKey,
      secret: clientSecret
    };
    this.#client = new S3Client2(clientConfiguration);
    this.#gatewayConfiguration = {
      endpoint: (_a = options == null ? void 0 : options.gateway) == null ? void 0 : _a.endpoint,
      token: (_b = options == null ? void 0 : options.gateway) == null ? void 0 : _b.token,
      timeout: (_c = options == null ? void 0 : options.gateway) == null ? void 0 : _c.timeout
    };
  }
  /**
   * @typedef {Object} objectOptions
   * @property {string} [bucket] - The bucket to pin the IPFS CID into.
   */
  /**
   * @typedef {Object} objectHeadResult
   * @property {string} cid The CID of the uploaded object
   * @property {function} download Convenience function to download the object via S3 or the selected gateway
   * @property {array<Object>} [entries] If a directory then returns an array of the containing objects
   * @property {string} entries.cid The CID of the uploaded object
   * @property {string} entries.path The path of the object
   */
  /**
   * If the source parameter is an array of objects, it will pack multiple files into a CAR file for upload.
   * The method returns a Promise that resolves to an object containing the CID (Content Identifier) of the uploaded file
   * and an optional entries object when uploading a CAR file.
   *
   * @summary Uploads a file or a CAR file to the specified bucket.
   * @param {string} key - The key or path of the file in the bucket.
   * @param {Buffer|ReadableStream|Array<Object>} source - The content of the object to be uploaded.
   *    If an array of files is provided, each file should have a 'path' property specifying the path of the file
   *    and a 'content' property specifying the content of the file.  The SDK will then construct a CAR file locally
   *    and use that as the content of the object to be uploaded.
   * @param {Object} [metadata] Optional metadata for pin object
   * @param {objectOptions} [options] - The options for uploading the object.
   * @returns {Promise<objectHeadResult>}
   * @example
   * // Upload Object
   * await objectManager.upload("my-object", Buffer.from("Hello World!"));
   * // Upload Object with Metadata
   * await objectManager.upload("my-custom-object", Buffer.from("Hello Big World!"), {
   *   "application": "my-filebase-app"
   * });
   * // Upload Directory
   * await objectManager.upload("my-first-directory", [
   *  {
   *   path: "/testObjects/1.txt",
   *   content: Buffer.from("upload test object", "utf-8"),
   *  },
   *  {
   *   path: "/testObjects/deep/1.txt",
   *   content: Buffer.from("upload deep test object", "utf-8"),
   *  },
   *  {
   *   path: "/topLevel.txt",
   *   content: Buffer.from("upload top level test object", "utf-8"),
   *  },
   * ]);
   */
  async upload(key, source, metadata, options) {
    const uploadUUID = uuidv4();
    const bucket = (options == null ? void 0 : options.bucket) || this.#defaultBucket, uploadOptions = {
      client: this.#client,
      params: {
        Bucket: bucket,
        Key: key,
        Body: source,
        Metadata: metadata || {}
      },
      queueSize: this.#maxConcurrentUploads,
      partSize: 26843546
      //25.6Mb || 250Gb Max File Size
    };
    let parsedEntries = {};
    if (Array.isArray(source)) {
      uploadOptions.params.Metadata = {
        ...uploadOptions.params.Metadata,
        import: "car"
      };
      let temporaryCarFilePath, temporaryBlockstoreDir;
      try {
        temporaryBlockstoreDir = path.resolve(
          os.tmpdir(),
          "filebase-sdk",
          "uploads",
          uploadUUID
        );
        temporaryCarFilePath = `${temporaryBlockstoreDir}/main.car`;
        await mkdir(temporaryBlockstoreDir, { recursive: true });
        const temporaryBlockstore = new FsBlockstore(temporaryBlockstoreDir);
        const heliaFs = unixfs({
          blockstore: temporaryBlockstore
        });
        for (let sourceEntry of source) {
          sourceEntry.path = sourceEntry.path[0] === "/" ? `/${uploadUUID}${sourceEntry.path}` : `/${uploadUUID}/${sourceEntry.path}`;
        }
        for await (const entry of heliaFs.addAll(source)) {
          parsedEntries[entry.path] = entry;
        }
        const rootEntry = parsedEntries[uploadUUID];
        const carExporter = car({ blockstore: temporaryBlockstore }), { writer, out } = CarWriter.create([rootEntry.cid]);
        const output = createWriteStream(temporaryCarFilePath);
        Readable.from(out).pipe(output);
        await carExporter.export(rootEntry.cid, writer);
        uploadOptions.params.Body = createReadStream(temporaryCarFilePath);
        const parallelUploads3 = new Upload(uploadOptions);
        await parallelUploads3.done();
        await temporaryBlockstore.close();
      } finally {
        if (typeof temporaryBlockstoreDir !== "undefined") {
          await rm(temporaryBlockstoreDir, { recursive: true, force: true });
        }
      }
    } else {
      const parallelUploads3 = new Upload(uploadOptions);
      await parallelUploads3.done();
    }
    const command = new HeadObjectCommand({
      Bucket: bucket,
      Key: key,
      Body: source
    }), headResult = await this.#client.send(command), responseCid = headResult.Metadata.cid;
    if (Object.keys(parsedEntries).length === 0) {
      return {
        cid: responseCid,
        download: () => {
          return this.#routeDownload(responseCid, key, options);
        }
      };
    }
    return {
      cid: responseCid,
      download: () => {
        return this.#routeDownload(responseCid, key, options);
      },
      entries: parsedEntries
    };
  }
  async #routeDownload(cid, key, options) {
    return typeof this.#gatewayConfiguration.endpoint !== "undefined" ? downloadFromGateway(cid, this.#gatewayConfiguration) : this.download(key, options);
  }
  /**
   * @summary Gets an objects info and metadata using the S3 API.
   * @param {string} key - The key of the object to be inspected.
   * @param {objectOptions} [options] - The options for inspecting the object.
   * @returns {Promise<objectHeadResult|false>}
   */
  async get(key, options) {
    const bucket = (options == null ? void 0 : options.bucket) || this.#defaultBucket;
    try {
      const command = new HeadObjectCommand({
        Bucket: bucket,
        Key: key
      }), response = await this.#client.send(command);
      response.download = () => {
        return this.#routeDownload(response.Metadata.cid, key, options);
      };
      return response;
    } catch (err) {
      if (err.name === "NotFound") {
        return false;
      }
      throw err;
    }
  }
  /**
   * @summary Downloads an object from the specified bucket using the provided key.
   * @param {string} key - The key of the object to be downloaded.
   * @param {objectOptions} [options] - The options for downloading the object..
   * @returns {Promise<Object>} - A promise that resolves with the contents of the downloaded object as a Stream.
   * @example
   * // Download object with name of `download-object-example`
   * await objectManager.download(`download-object-example`);
   */
  async download(key, options) {
    if (typeof this.#gatewayConfiguration.endpoint === "string") {
      const objectToFetch = await this.get(key, options);
      return objectToFetch.download();
    } else {
      const command = new GetObjectCommand({
        Bucket: (options == null ? void 0 : options.bucket) || this.#defaultBucket,
        Key: key
      }), response = await this.#client.send(command);
      return response.Body;
    }
  }
  /**
   * @typedef {Object} listObjectsResult
   * @property {boolean} IsTruncated Indicates if more results exist on the server
   * @property {string} NextContinuationToken ContinuationToken used to paginate list requests
   * @property {Array<Object>} Contents List of Keys stored in the S3 Bucket
   * @property {string} Contents.Key Key of the Object
   * @property {string} Contents.LastModified Date Last Modified of the Object
   * @property {string} Contents.CID CID of the Object
   * @property {string} Contents.ETag ETag of the Object
   * @property {number} Contents.Size Size in Bytes of the Object
   * @property {string} Contents.StorageClass Class of Storage of the Object
   * @property {function} Contents.download Convenience function to download the item using the S3 gateway
   */
  /**
   * @typedef {Object} listObjectOptions
   * @property {string} [Bucket] The name of the bucket. If not provided, the default bucket will be used.
   * @property {string} [ContinuationToken=null] Continues listing from this objects name.
   * @property {string} [Delimiter=null] Character used to group keys
   * @property {number} [MaxKeys=1000] The maximum number of objects to retrieve. Defaults to 1000.
   */
  /**
   * Retrieves a list of objects from a specified bucket.
   *
   * @param {listObjectOptions} options - The options for listing objects.
   * @returns {Promise<listObjectsResult>} - A promise that resolves to an array of objects.
   * @example
   * // List objects in bucket with a limit of 1000
   * await objectManager.list({
   *   MaxKeys: 1000
   * });
   */
  async list(options = {
    Bucket: this.#defaultBucket,
    ContinuationToken: null,
    Delimiter: null,
    MaxKeys: 1e3
  }) {
    if ((options == null ? void 0 : options.MaxKeys) && options.MaxKeys > 1e5) {
      throw new Error(`MaxKeys Maximum value is 100000`);
    }
    const bucket = (options == null ? void 0 : options.Bucket) || this.#defaultBucket, limit = (options == null ? void 0 : options.MaxKeys) || 1e3, commandOptions = {
      Bucket: bucket,
      MaxKeys: limit
    }, command = new ListObjectsV2Command({
      ...options,
      ...commandOptions
    });
    const { Contents, IsTruncated, NextContinuationToken } = await this.#client.send(command);
    return { Contents, IsTruncated, NextContinuationToken };
  }
  /**
   * @summary Deletes an object from the specified bucket using the provided key.
   * @param {string} key - The key of the object to be deleted.
   * @param {objectOptions} [options] - The options for deleting the file.
   * @returns {Promise<Boolean>} - A Promise that resolves with the result of the delete operation.
   * @example
   * // Delete object with name of `delete-object-example`
   * await objectManager.delete(`delete-object-example`);
   */
  async delete(key, options) {
    const command = new DeleteObjectCommand({
      Bucket: (options == null ? void 0 : options.bucket) || this.#defaultBucket,
      Key: key
    });
    await this.#client.send(command);
    return true;
  }
  /**
   * @typedef {Object} copyObjectOptions
   * @property {string} [sourceBucket] The source bucket from where the object is to be copied.
   * @property {string} [destinationKey] The key of the object in the destination bucket. By default, it is the same as the sourceKey.
   */
  /**
   * If the destinationKey is not provided, the object will be copied with the same key as the sourceKey.
   *
   * @summary Copy the object from sourceKey in the sourceBucket to destinationKey in the destinationBucket.
   * @param {string} sourceKey - The key of the object to be copied from the sourceBucket.
   * @param {string} destinationBucket - The bucket where the object will be copied to.
   * @param {copyObjectOptions} [options] - Additional options for the copy operation.
   *
   * @returns {Promise<Boolean>} - A Promise that resolves with the result of the copy operation.
   * @example
   * // Copy object `copy-object-test` from `copy-object-test-pass-src` to `copy-object-test-pass-dest`
   * // TIP: Set bucket on constructor and it will be used as the default source for copying objects.
   * await objectManager.copy(`copy-object-test`, `copy-object-dest`, {
   *   sourceBucket: `copy-object-src`
   * });
   */
  async copy(sourceKey, destinationBucket, options = {
    sourceBucket: this.#defaultBucket,
    destinationKey: void 0
  }) {
    const copySource = `${(options == null ? void 0 : options.sourceBucket) || this.#defaultBucket}/${sourceKey}`, command = new CopyObjectCommand({
      CopySource: copySource,
      Bucket: destinationBucket,
      Key: (options == null ? void 0 : options.destinationKey) || sourceKey
    });
    await this.#client.send(command);
    return true;
  }
};
var objectManager_default = ObjectManager;

// src/pinManager.js
import axios4 from "axios";
var PinManager = class {
  #DEFAULT_ENDPOINT = "https://api.filebase.io";
  #DEFAULT_TIMEOUT = 6e4;
  #client;
  #credentials;
  #gatewayConfiguration;
  #defaultBucket;
  /**
   * @typedef {Object} pinManagerOptions Optional settings for the constructor.
   * @property {string} [bucket] Default bucket to use.
   * @property {pinDownloadOptions} [gateway] Default gateway to use.
   */
  /**
   * @typedef {Object} pinDownloadOptions Optional settings for downloading pins
   * @property {string} endpoint Default gateway to use.
   * @property {string} [token] Token for the default gateway.
   * @property {number} [timeout=60000] Timeout for the default gateway
   */
  /**
   * @summary Creates a new instance of the constructor.
   * @param {string} clientKey - The access key ID for authentication.
   * @param {string} clientSecret - The secret access key for authentication.
   * @param {pinManagerOptions} [options] - Optional settings for the constructor.
   * @tutorial quickstart-pin
   * @example
   * import { PinManager } from "@filebase/sdk";
   * const pinManager = new PinManager("KEY_FROM_DASHBOARD", "SECRET_FROM_DASHBOARD", {
   *   bucket: "my-default-bucket",
   *   gateway: {
   *     endpoint: "https://my-default-gateway.mydomain.com
   *     token: SUPER_SECRET_GATEWAY_TOKEN
   *   }
   * });
   */
  constructor(clientKey, clientSecret, options) {
    var _a, _b, _c;
    this.#defaultBucket = options == null ? void 0 : options.bucket;
    const PSAClientEndpoint = process.env.NODE_ENV === "test" ? process.env.TEST_NAME_ENDPOINT || this.#DEFAULT_ENDPOINT : this.#DEFAULT_ENDPOINT, baseURL = `${PSAClientEndpoint}/v1/ipfs/pins`;
    this.#credentials = {
      key: clientKey,
      secret: clientSecret
    };
    this.#client = axios4.create({
      baseURL,
      timeout: this.#DEFAULT_TIMEOUT
    });
    this.#gatewayConfiguration = {
      endpoint: (_a = options == null ? void 0 : options.gateway) == null ? void 0 : _a.endpoint,
      token: (_b = options == null ? void 0 : options.gateway) == null ? void 0 : _b.token,
      timeout: ((_c = options == null ? void 0 : options.gateway) == null ? void 0 : _c.timeout) || this.#DEFAULT_TIMEOUT
    };
  }
  /**
   * @typedef {Object} pinStatus
   * @property {string} requestid Globally unique identifier of the pin request; can be used to check the status of ongoing pinning, or pin removal
   * @property {string} status Status a pin object can have at a pinning service. ("queued","pinning","pinned","failed")
   * @property {string} created Immutable timestamp indicating when a pin request entered a pinning service; can be used for filtering results and pagination
   * @property {Object} pin Pin object
   * @property {string} pin.cid Content Identifier (CID) pinned recursively
   * @property {string} pin.name Name for pinned data; can be used for lookups later
   * @property {Array<string>} pin.origins Optional list of multiaddrs known to provide the data
   * @property {Object} pin.meta Optional metadata for pin object
   * @property {Array<string>} delegates List of multiaddrs designated by pinning service that will receive the pin data
   * @property {object} [info] Optional info for PinStatus response
   * @property {function} download Convenience function to download pin
   */
  /**
   * @typedef {Object} pinOptions
   * @property {string} [bucket] - The bucket to pin the IPFS CID into.
   */
  /**
   * @typedef {Object} listPinOptions
   * @property {Array<string>} [cid] Return pin objects responsible for pinning the specified CID(s); be aware that using longer hash functions introduces further constraints on the number of CIDs that will fit under the limit of 2000 characters per URL in browser contexts
   * @property {string} [name] Return pin objects with specified name (by default a case-sensitive, exact match)
   * @property {string} [match] Customize the text matching strategy applied when the name filter is present; exact (the default) is a case-sensitive exact match, partial matches anywhere in the name, iexact and ipartial are case-insensitive versions of the exact and partial strategies
   * @property {Array<string>} [status] Return pin objects for pins with the specified status (when missing, service defaults to pinned only)
   * @property {string} [before] Return results created (queued) before provided timestamp
   * @property {string} [after] Return results created (queued) after provided timestamp
   * @property {number} [limit] Max records to return
   * @property {Object} [meta] Return pin objects that match specified metadata keys passed as a string representation of a JSON object; when implementing a client library, make sure the parameter is URL-encoded to ensure safe transport
   */
  /**
   * @typedef {Object} listPinResults
   * @property {number} count Total number of pin objects that exist for passed query filters
   * @property {Array<pinStatus>} Array of PinStatus results
   */
  /**
   * @summary List the pins in a given bucket
   * @param {listPinOptions} [listOptions]
   * @param {pinOptions} [options]
   * @returns {Promise<listPinResults>}
   * @example
   * // List pins in bucket with a limit of 1000
   * await pinManager.list({
   *   limit: 1000
   * });
   */
  async list(listOptions, options) {
    try {
      const encodedToken = this.#getEncodedToken(options == null ? void 0 : options.bucket), getResponse = await this.#client.request({
        method: "GET",
        params: listOptions,
        headers: { Authorization: `Bearer ${encodedToken}` }
      });
      for (let pinStatus of getResponse.data.results) {
        pinStatus.download = () => {
          return this.download(pinStatus.pin.cid);
        };
      }
      return getResponse.data;
    } catch (err) {
      apiErrorHandler(err);
    }
  }
  /**
   * @summary Create a pin in the selected bucket
   * @param {string} key Key or path of the file in the bucket
   * @param {string} cid Content Identifier (CID) to be pinned recursively
   * @param {Object} [metadata] Optional metadata for pin object
   * @param {pinOptions} [options] Options for pinning the object
   * @returns {Promise<pinStatus>}
   * @example
   * // Create Pin with Metadata
   * await pinManager.create("my-pin", "QmTJkc7crTuPG7xRmCQSz1yioBpCW3juFBtJPXhQfdCqGF", {
   *   "application": "my-custom-app-on-filebase"
   * });
   */
  async create(key, cid, metadata, options) {
    try {
      const encodedToken = this.#getEncodedToken(options == null ? void 0 : options.bucket), pinStatus = await this.#client.request({
        method: "POST",
        data: {
          cid,
          name: key,
          meta: metadata
        },
        headers: { Authorization: `Bearer ${encodedToken}` }
      });
      pinStatus.data.download = () => {
        return this.download(pinStatus.data.pin.cid);
      };
      return pinStatus.data;
    } catch (err) {
      apiErrorHandler(err);
    }
  }
  /**
   * @typedef {Object} replacePinOptions
   * @augments pinOptions
   * @property {Object} [metadata] Optional metadata to set on pin during replacement
   * @property {string} [name] Optional name for pin to set during replacement
   */
  /**
   * @summary Replace a pinned object in the selected bucket
   * @param {string} requestid Unique ID for the pinned object
   * @param {string} cid Content Identifier (CID) to be pinned recursively
   * @param {replacePinOptions} [options] Options for pinning the object
   * @returns {Promise<pinStatus>}
   * @example
   * // Replace Pin with Metadata
   * await pinManager.create("qr4231213", "QmTJkc7crTuPG7xRmCQSz1yioBpCW3juFBtJPXhQfdCqGF", {
   *   "revision": Date.now()
   * }
   */
  async replace(requestid, cid, options) {
    try {
      let replaceData = {
        cid,
        meta: (options == null ? void 0 : options.metadata) || {}
      };
      if (options == null ? void 0 : options.name) {
        replaceData.name = options.name;
      }
      const encodedToken = this.#getEncodedToken(options == null ? void 0 : options.bucket), pinStatusResult = await this.#client.request({
        method: "POST",
        url: `/${requestid}`,
        data: replaceData,
        validateStatus: (status) => {
          return status === 200;
        },
        headers: { Authorization: `Bearer ${encodedToken}` }
      });
      const pinStatus = pinStatusResult.data;
      pinStatus.download = () => {
        return this.download(pinStatus.pin.cid);
      };
      return pinStatus;
    } catch (err) {
      apiErrorHandler(err);
    }
  }
  /**
   * @summary Download a pin from the selected IPFS gateway
   * @param {string} cid
   * @param {pinDownloadOptions} [options]
   * @returns {Promise<stream>}
   * @example
   * // Download Pin by CID
   * await pinManager.download("QmTJkc7crTuPG7xRmCQSz1yioBpCW3juFBtJPXhQfdCqGF");
   */
  async download(cid, options) {
    const downloadOptions = Object.assign(this.#gatewayConfiguration, options);
    return downloadFromGateway(cid, downloadOptions);
  }
  /**
   * @summary Get details about a pinned object
   * @param {string} requestid Globally unique identifier of the pin request
   * @param {pinOptions} [options] Options for getting the pin
   * @returns {Promise<pinStatus|false>}
   * @example
   * // Get Pin Info by RequestId
   * await pinManager.get("qr4231214");
   */
  async get(requestid, options) {
    try {
      const encodedToken = this.#getEncodedToken(options == null ? void 0 : options.bucket), getResponseResult = await this.#client.request({
        method: "GET",
        url: `/${requestid}`,
        headers: { Authorization: `Bearer ${encodedToken}` },
        validateStatus: (status) => {
          return status === 200 || status === 404;
        }
      });
      if (getResponseResult.status === 404) {
        return false;
      }
      const pinStatus = getResponseResult.data;
      pinStatus.download = () => {
        return this.download(pinStatus.pin.cid);
      };
      return pinStatus;
    } catch (err) {
      apiErrorHandler(err);
    }
  }
  /**
   * @summary Delete a pinned object from the selected bucket
   * @param requestid Globally unique identifier of the pin request
   * @param {pinOptions} [options] Options for deleting the pin
   * @returns {Promise<boolean>}
   * @example
   * // Delete Pin by RequestId
   * await pinManager.delete("qr4231213");
   */
  async delete(requestid, options) {
    try {
      const encodedToken = this.#getEncodedToken(options == null ? void 0 : options.bucket);
      await this.#client.request({
        method: "DELETE",
        url: `/${requestid}`,
        headers: { Authorization: `Bearer ${encodedToken}` },
        validateStatus: (status) => {
          return status === 202;
        }
      });
      return true;
    } catch (err) {
      apiErrorHandler(err);
    }
  }
  #getEncodedToken(bucket) {
    bucket = bucket || this.#defaultBucket;
    return Buffer.from(
      `${this.#credentials.key}:${this.#credentials.secret}:${bucket}`
    ).toString("base64");
  }
};
var pinManager_default = PinManager;
export {
  bucketManager_default as BucketManager,
  gatewayManager_default as GatewayManager,
  nameManager_default as NameManager,
  objectManager_default as ObjectManager,
  pinManager_default as PinManager
};
