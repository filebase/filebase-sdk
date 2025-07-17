import axios from "axios";
import {
  CopyObjectCommand,
  CreateBucketCommand,
  DeleteBucketCommand,
  DeleteObjectCommand,
  GetBucketTaggingCommand,
  GetObjectCommand,
  HeadObjectCommand,
  ListBucketsCommand,
  ListObjectsV2Command,
  PutBucketTaggingCommand,
  S3Client,
} from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { unmarshalIPNSRecord } from "ipns";

class FilebaseClient {
  #DEFAULT_IPFS_TIMEOUT = 60000;
  #DEFAULT_IPFS_ENDPOINT = "https://rpc.filebase.io";
  #DEFAULT_S3_ENDPOINT = "https://s3.filebase.com";
  #DEFAULT_REGION = "us-east-1";

  #DEFAULT_ENDPOINT = "https://api.filebase.io";
  #DEFAULT_TIMEOUT = 60000;

  #GATEWAY_DEFAULT_TIMEOUT = 60000;
  #PUBLIC_IPFS_GATEWAY = "https://ipfs.filebase.io";
  #VALID_FORMATS = ["ipns-record", "raw", "car"];

  #default_bucket;
  #default_gateway;

  #ipfs_credentials;
  #ipfs_client;
  #gateways_client;
  #names_client;
  #s3_client;

  /**
   * @typedef {Object} clientOptions
   * @property {string} [bucket] The bucket to use for file operations (optional)
   */

  /**
   * @summary Creates a new instance of the constructor.
   * @param {string} clientKey - The access key ID for authentication.
   * @param {string} clientSecret - The secret access key for authentication.
   * @param {clientOptions} [options] - Options for the client (optional)
   * @tutorial quickstart-bucket
   * @example
   * import FilebaseClient from "@filebase/sdk";
   * const client = new FilebaseClient("KEY_FROM_DASHBOARD", "SECRET_FROM_DASHBOARD");
   */
  constructor(clientKey, clientSecret, options) {
    //region S3 Client
    const clientEndpoint =
      process.env.NODE_ENV === "test"
        ? process.env.TEST_S3_ENDPOINT || this.#DEFAULT_S3_ENDPOINT
        : this.#DEFAULT_S3_ENDPOINT;
    this.#s3_client = new S3Client({
      credentials: {
        accessKeyId: clientKey,
        secretAccessKey: clientSecret,
      },
      endpoint: clientEndpoint,
      region: this.#DEFAULT_REGION,
      forcePathStyle: true,
    });
    //endregion

    //region IPFS Client
    const ipfsEndpoint =
      process.env.NODE_ENV === "test"
        ? process.env.TEST_IPFS_ENDPOINT || this.#DEFAULT_IPFS_ENDPOINT
        : this.#DEFAULT_IPFS_ENDPOINT;
    this.#ipfs_credentials = `${clientKey}:${clientSecret}`;
    let ipfsCredentials = this.#ipfs_credentials;
    if (options?.bucket) {
      ipfsCredentials = `${ipfsCredentials}:${options.bucket}`;
      this.#default_bucket = options.bucket;
    }
    this.#ipfs_client = axios.create({
      baseURL: ipfsEndpoint,
      timeout: options?.timeout || this.#DEFAULT_IPFS_TIMEOUT,
      headers: {
        common: {
          Authorization: `Bearer ${Buffer.from(ipfsCredentials).toString("base64")}`,
        },
      },
      responseType: "text",
    });
    //endregion

    //region Gateways Client
    const gatewayClientEndpoint =
      process.env.NODE_ENV === "test"
        ? process.env.TEST_GW_ENDPOINT ||
          options?.gateway?.endpoint ||
          this.#DEFAULT_ENDPOINT
        : options?.gateway?.endpoint || this.#DEFAULT_ENDPOINT;
    this.#gateways_client = axios.create({
      baseURL: `${gatewayClientEndpoint}/v1/gateways`,
      timeout: options?.timeout || this.#GATEWAY_DEFAULT_TIMEOUT,
      headers: {
        common: {
          Authorization: `Bearer ${Buffer.from(this.#ipfs_credentials).toString("base64")}`,
        },
      },
    });
    //endregion

    //region Names Client
    const namesClientEndpoint =
      process.env.NODE_ENV === "test"
        ? process.env.TEST_NAME_ENDPOINT || this.#DEFAULT_ENDPOINT
        : this.#DEFAULT_ENDPOINT;
    this.#names_client = axios.create({
      baseURL: `${namesClientEndpoint}/v1/names`,
      timeout: this.#DEFAULT_TIMEOUT,
      headers: {
        common: {
          Authorization: `Bearer ${Buffer.from(this.#ipfs_credentials).toString("base64")}`,
        },
      },
    });
    //endregion

    //region IPFS Gateway Client
    this.#default_gateway =
      options?.gateway.endpoint || this.#PUBLIC_IPFS_GATEWAY;
    //endregion
  }

  //region Utility Methods
  #apiErrorHandler(err) {
    if (
      err?.response &&
      err?.response?.status &&
      (err.response.status.toString()[0] === "4" ||
        err.response.status.toString()[0] === "5")
    ) {
      throw new Error(
        err.response.data.error?.details ||
          err.response.data.error?.reason ||
          err,
      );
    }
    throw err;
  }

  #getIpfsCredentials(bucket) {
    let encodedCredentials = this.#ipfs_credentials;
    if (bucket) {
      encodedCredentials = `${encodedCredentials}:${bucket}`;
    } else if (this.#default_bucket) {
      encodedCredentials = `${encodedCredentials}:${this.#default_bucket}`;
    } else {
      throw new Error("Bucket must be set");
    }
    return Buffer.from(encodedCredentials).toString("base64");
  }
  //endregion

  //region Bucket Methods
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
   * await client.createBucket(`create-bucket-example`);
   */
  async createBucket(name) {
    const command = new CreateBucketCommand({
      Bucket: name,
    });

    return await this.#s3_client.send(command);
  }

  /**
   * @summary Deletes the specified bucket.
   * @param {string} name - The name of the bucket to delete.
   * @returns {Promise<boolean>} - A promise that resolves when the bucket is deleted.
   * @example
   * // Delete bucket with name of `bucket-name-to-delete`
   * await client.deleteBucket(`bucket-name-to-delete`);
   */
  async deleteBucket(name) {
    const command = new DeleteBucketCommand({
      Bucket: name,
    });

    await this.#s3_client.send(command);
    return true;
  }

  /**
   * @summary Generates the IPFS Directory/Folder CID for a given bucket
   * @param {string} name - The name of the bucket to use.
   * @returns {Promise<boolean>} A promise that resolves with the CID of the new directory/folder
   */
  async generateBucketCid(name) {
    const command = new PutBucketTaggingCommand({
      Bucket: name,
      Tagging: {
        TagSet: [
          {
            Key: "generateBucketCid",
            Value: "true",
          },
        ],
      },
    });

    let cid = false;
    command.middlewareStack.add((next) => async (args) => {
      const response = await next(args);

      // Get cid from headers
      cid = response.response.headers["x-amz-meta-cid"];
      return response;
    });

    await this.#s3_client.send(command);
    return cid;
  }

  async getBucketCid(name) {
    const getCidCommand = new GetBucketTaggingCommand({
      Bucket: name,
    });
    const getCidResponse = await this.#s3_client.send(getCidCommand);
    if (
      typeof getCidResponse !== "undefined" &&
      getCidResponse.TagSet !== "undefined"
    ) {
      const resolvedTag = getCidResponse.TagSet.find((element) => {
        return element.Key === "CID";
      });
      if (typeof resolvedTag !== "undefined" && resolvedTag.Value !== "") {
        return resolvedTag.Value;
      }
    }
    throw new Error(`Failed to Fetch CID for Bucket`);
  }

  /**
   * @summary Lists the buckets in the client.
   * @returns {Promise<Array<bucket>>} - A promise that resolves with an array of objects representing the buckets in the client.
   * @example
   * // List all buckets
   * await client.listBuckets();
   */
  async listBuckets() {
    const command = new ListBucketsCommand({}),
      { Buckets } = await this.#s3_client.send(command);

    return Buckets;
  }
  //endregion

  //region File Methods
  async #uploadFiles(formData, options) {
    options.headers = options.headers || {};
    options.headers = {
      ...options.headers,
    };
    options.headers["Authorization"] =
      `Bearer ${this.#getIpfsCredentials(options?.bucket)}`;
    options.searchParams = options.searchParams || {};
    options.searchParams["preserve-filenames"] = "true";

    const downloadResponse = await this.#ipfs_client.request({
      method: "POST",
      url: "api/v0/add",
      headers: options.headers,
      params: options.searchParams,
      data: formData,
      validateStatus: function (status) {
        return status === 200;
      },
    });

    const pins = [];
    for (const entry of downloadResponse.data.split("\n")) {
      if (entry === "") {
        continue;
      }
      const parsedEntry = JSON.parse(entry);
      pins.push({
        name: parsedEntry["Name"],
        cid: parsedEntry["Hash"],
        size: parsedEntry["Size"],
      });
    }
    return pins;
  }

  async copyFile(from, to, options) {
    const copySource = `${
        options?.sourceBucket || this.#default_bucket
      }/${from}`,
      command = new CopyObjectCommand({
        CopySource: copySource,
        Bucket: options?.destinationBucket || this.#default_bucket,
        Key: to,
      });

    await this.#s3_client.send(command);
    return true;
  }

  async deleteFile(path, options) {
    const command = new DeleteObjectCommand({
      Bucket: options?.bucket || this.#default_bucket,
      Key: path,
    });

    await this.#s3_client.send(command);
    return true;
  }

  async downloadFile(path, options) {
    const command = new GetObjectCommand({
        Bucket: options?.bucket || this.#default_bucket,
        Key: path,
      }),
      response = await this.#s3_client.send(command);

    return response.Body;
  }

  async generatePresignedUrl(objectKey, expiresInSeconds = 3600, options) {
    const command = new GetObjectCommand({
      Bucket: options?.bucket || this.#default_bucket,
      Key: objectKey,
    });

    try {
      return await getSignedUrl(this.#s3_client, command, {
        expiresIn: expiresInSeconds, // URL valid for 1 hour by default
      });
    } catch (error) {
      console.error("Error generating presigned download URL:", error);
      throw error;
    }
  }

  /**
   * @typedef {Object} objectOptions
   * @property {string} [bucket] - The bucket to pin the IPFS CID into.
   */

  /**
   * @typedef {Object} objectHeadResult
   * @property {string} cid The CID of the uploaded object
   * @property {array<Object>} [entries] If a directory then returns an array of the containing objects
   * @property {string} entries.cid The CID of the uploaded object
   * @property {string} entries.path The path of the object
   */

  /**
   * @summary Gets an objects info and metadata using the S3 API.
   * @param {string} path - The key of the object to be inspected.
   * @param {objectOptions} [options] - The options for inspecting the object.
   * @returns {Promise<objectHeadResult|false>}
   */
  async getFileMetadata(path, options) {
    try {
      const command = new HeadObjectCommand({
        Bucket: options?.bucket || this.#default_bucket,
        Key: path,
      });
      return await this.#s3_client.send(command);
    } catch (err) {
      if (err.name === "NotFound") {
        return false;
      }
      throw err;
    }
  }

  /**
   * @typedef {Object} listFilesResult
   * @property {Array<Object>} entries List of Files stored in the Bucket
   * @property {string} entries.cid CID of the Object
   * @property {string} entries.name Name of the Object
   * @property {number} entries.size Size in Bytes of the Object
   * @property {string} entries.lastModified Date Last Modified of the Object
   * @property {function} [nextPage] Convenience function to get the next page of files
   */

  /**
   * @typedef {Object} listObjectOptions
   * @property {string} [Bucket] The name of the bucket. If not provided, the default bucket will be used.
   * @property {string|null} [ContinuationToken=null] Continues listing from this objects name.
   * @property {string|null} [Delimiter=null] Character used to group keys
   * @property {number} [MaxKeys=1000] The maximum number of objects to retrieve. Defaults to 1000.
   */

  /**
   * Retrieves a list of files from a specified bucket.
   *
   * @param {string} prefix - The prefix to filter the files list with.
   * @param {listObjectOptions} [options] - The options for listing files.
   * @returns {Promise<listFilesResult>} - A promise that resolves to an array of files.
   * @example
   * // List files in bucket with a limit of 1000
   * await filebaseClient.listFiles('my-favorites-folder', {
   *   MaxKeys: 1000
   * });
   */
  async listFiles(
    prefix = undefined,
    options = {
      Bucket: this.#default_bucket,
      ContinuationToken: null,
      Delimiter: null,
      MaxKeys: 1000,
    },
  ) {
    const listOptions = {
      ...options,
      Prefix: prefix,
    };
    if (listOptions?.MaxKeys && listOptions.MaxKeys > 100000) {
      throw new Error(`MaxKeys Maximum value is 100000`);
    }
    const bucket = listOptions?.Bucket || this.#default_bucket,
      limit = listOptions?.MaxKeys || 1000,
      commandOptions = {
        Bucket: bucket,
        MaxKeys: limit,
      },
      command = new ListObjectsV2Command({
        ...listOptions,
        ...commandOptions,
      });

    const { Contents, IsTruncated, NextContinuationToken } =
      await this.#s3_client.send(command);
    const listResponse = {
      entries: Contents.map((item) => {
        return {
          cid: item.CID,
          name: item.Key,
          size: item.Size,
          lastModified: item.LastModified,
        };
      }),
    };
    if (IsTruncated) {
      listResponse["nextPage"] = this.listFiles(prefix, {
        ...options,
        ContinuationToken: NextContinuationToken,
      });
    }
    return listResponse;
  }

  async pinFile(path, cid, options) {
    await this.#ipfs_client.request({
      method: "POST",
      url: "api/v0/pin/add",
      headers: {
        Authorization: `Bearer ${this.#getIpfsCredentials(options?.bucket)}`,
      },
      params: {
        name: path,
        arg: cid,
      },
      validateStatus: function (status) {
        return status === 200;
      },
    });
    return true;
  }

  async uploadDirectory(path, formData, options = {}) {
    const uploadedFiles = await this.#uploadFiles(formData, {
      headers: {
        Authorization: `Bearer ${this.#getIpfsCredentials(options?.bucket)}`,
      },
      params: {
        "directory-name": path,
        "wrap-with-directory": "true",
      },
    });
    return uploadedFiles[0];
  }

  async uploadFile(path, content, options = {}) {
    const uploadFormData = new FormData();
    uploadFormData.append("file", content, path);

    const uploadedFiles = await this.uploadFiles(uploadFormData, options);
    return uploadedFiles[0];
  }

  async uploadFiles(formData, options) {
    const uploadOptions = {};
    return await this.#uploadFiles(formData, uploadOptions);
  }
  //endregion

  //region IPNS Name Methods
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
   * await client.createIpnsName(`create-name-example`, `QmdmQXB2mzChmMeKY47C43LxUdg1NDJ5MWcKMKxDu7RgQm`);
   */
  async createIpnsName(
    label,
    cid,
    options = {
      enabled: true,
    },
  ) {
    try {
      const createResponse = await this.#names_client.request({
        method: "POST",
        data: {
          label,
          cid,
          enabled: options?.enabled !== false,
        },
      });
      return createResponse.data;
    } catch (err) {
      this.#apiErrorHandler(err);
    }
  }

  /**
   * @summary Deletes an IPNS name with the given label.
   * @param {string} label - The label of the IPNS name to delete.
   * @returns {Promise<boolean>} - A promise that resolves to true if the IPNS name was successfully deleted.
   * @example
   * // List IPNS name with label of `delete-name-example`
   * await client.deleteIpnsName(`delete-name-example`);
   */
  async deleteIpnsName(label) {
    try {
      await this.#names_client.request({
        method: "DELETE",
        url: `/${label}`,
        validateStatus: (status) => {
          return status === 204;
        },
      });
      return true;
    } catch (err) {
      this.#apiErrorHandler(err);
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
  async getIpnsName(label) {
    try {
      const getResponse = await this.#names_client.request({
        method: "GET",
        url: `/${label}`,
        validateStatus: (status) => {
          return status === 200 || status === 404;
        },
      });
      return getResponse.status === 200 ? getResponse.data : false;
    } catch (err) {
      this.#apiErrorHandler(err);
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
   * await client.importIpnsName(
   *  `create-name-example`,
   *  `QmdmQXB2mzChmMeKY47C43LxUdg1NDJ5MWcKMKxDu7RgQm`
   *  `BASE64_ENCODED_PRIVATEKEY`
   * );
   */
  async importIpnsName(
    label,
    cid,
    privateKey,
    options = {
      enabled: true,
    },
  ) {
    try {
      const importResponse = await this.#names_client.request({
        method: "POST",
        data: {
          label,
          cid,
          network_private_key: privateKey,
          enabled: options?.enabled !== false,
        },
      });
      return importResponse.data;
    } catch (err) {
      this.#apiErrorHandler(err);
    }
  }

  /**
   * @summary Returns a list of IPNS names
   * @returns {Promise<Array.<name>>} - A promise that resolves to an array of names.
   * @example
   * // List all IPNS names
   * await client.listIpnsNames();
   */
  async listIpnsNames() {
    try {
      const listResponse = await this.#names_client.request({
        method: "GET",
      });
      return listResponse.data;
    } catch (err) {
      this.#apiErrorHandler(err);
    }
  }

  async resolveIpnsName(value) {
    try {
      const resolvedIpnsName = await this.#fetchIpnsRecord(value);
      const buf = Buffer.from(resolvedIpnsName);
      const body = new Uint8Array(buf, 0, buf.byteLength);
      const ipnsRecord = unmarshalIPNSRecord(body);
      return ipnsRecord.value;
    } catch (err) {
      this.#apiErrorHandler(err);
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
   * await client.updateIpnsName(`update-name-example`, `bafybeidt4nmaci476lyon2mvgfmwyzysdazienhxs2bqnfpdainzjuwjom`);
   */
  async updateIpnsName(label, cid, options = {}) {
    try {
      const updateOptions = {
        cid,
      };
      if (options?.enabled) {
        updateOptions.enabled = Boolean(options.enabled);
      }
      await this.#names_client.request({
        method: "PUT",
        url: `/${label}`,
        data: updateOptions,
        validateStatus: (status) => {
          return status === 200;
        },
      });
      return true;
    } catch (err) {
      this.#apiErrorHandler(err);
    }
  }
  //endregion

  //region Gateway Methods
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
   * await client.createGateway(`create-gateway-example`, {
   *   domain: `cname.mycustomdomain.com`
   * });
   */
  async createGateway(name, options = {}) {
    try {
      let createOptions = {
        name,
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
      const createResponse = await this.#gateways_client.request({
        method: "POST",
        data: createOptions,
      });
      return createResponse.data;
    } catch (err) {
      this.#apiErrorHandler(err);
    }
  }

  /**
   * @summary Deletes a gateway with the given name.
   * @param {string} name - The name of the gateway to delete.
   * @returns {Promise<boolean>} - A promise that resolves to true if the gateway was successfully deleted.
   * @example
   * // Delete gateway with name of `delete-gateway-example`
   * await client.deleteGateway(`delete-name-example`);
   */
  async deleteGateway(name) {
    try {
      await this.#gateways_client.request({
        method: "DELETE",
        url: `/${name}`,
        validateStatus: (status) => {
          return status === 204;
        },
      });
      return true;
    } catch (err) {
      this.#apiErrorHandler(err);
    }
  }

  /**
   * @summary Returns the value of a gateway
   * @param {string} name - Parameter representing the name to get.
   * @returns {Promise<gateway|false>} - A promise that resolves to the value of a gateway.
   * @example
   * // Get gateway with name of `gateway-get-example`
   * await client.getGateway(`gateway-get-example`);
   */
  async getGateway(name) {
    try {
      const getResponse = await this.#gateways_client.request({
        method: "GET",
        url: `/${name}`,
        validateStatus: (status) => {
          return status === 200 || status === 404;
        },
      });
      return getResponse.status === 200 ? getResponse.data : false;
    } catch (err) {
      this.#apiErrorHandler(err);
    }
  }

  /**
   * @summary Returns a list of gateways
   * @returns {Promise<Array.<gateway>>} - A promise that resolves to an array of gateways.
   * @example
   * // List all gateways
   * await client.listGateways();
   */
  async listGateways() {
    try {
      const getResponse = await this.#gateways_client.request({
        method: "GET",
      });
      return getResponse.data;
    } catch (err) {
      this.#apiErrorHandler(err);
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
   * await client.updateGateway(`update-gateway-example`, {
   *   private: true
   * });
   */
  async updateGateway(name, options) {
    try {
      const updateOptions = {
        name,
      };
      if (options?.domain) {
        updateOptions.domain = String(options.private);
      }
      if (options?.enabled) {
        updateOptions.enabled = Boolean(options.enabled);
      }
      if (options?.private) {
        updateOptions.private = Boolean(options.private);
      }
      await this.#gateways_client.request({
        method: "PUT",
        url: `/${name}`,
        data: updateOptions,
        validateStatus: (status) => {
          return status === 200;
        },
      });
      return true;
    } catch (err) {
      this.#apiErrorHandler(err);
    }
  }
  //endregion

  //region Content Fetch Methods
  async #fetchContentFromGateway(cid, resolver, options) {
    const selectedEndpoint = options?.endpoint || this.#default_gateway;
    if (typeof selectedEndpoint !== "string") {
      throw new Error(
        "A valid gateway endpoint must be configured or provided.",
      );
    }

    const downloadHeaders = {};
    if (options.token) {
      downloadHeaders["x-filebase-gateway-token"] = options.token;
    }

    if (options.format) {
      if (this.#VALID_FORMATS.includes(options.format)) {
        downloadHeaders["Accept"] =
          `application/vnd.ipfs.${options.format.toLowerCase()}`;
      } else {
        throw new Error(`Invalid Format [${options.format}]`);
      }
    }

    const downloadResponse = await axios.request({
      method: "GET",
      baseURL: selectedEndpoint,
      url: `/${resolver}/${cid}`,
      headers: downloadHeaders,
      responseType: "arraybuffer",
      timeout: options?.timeout || this.#GATEWAY_DEFAULT_TIMEOUT,
    });
    return downloadResponse.data;
  }

  async #fetchIpnsRecord(cid) {
    return this.#fetchContentFromGateway(cid, "ipns", {
      format: "ipns-record",
    });
  }

  async fetchContentByCid(cid, options = {}) {
    return this.#fetchContentFromGateway(cid, "ipfs", options);
  }

  async fetchContentByIpnsName(cid, options = {}) {
    return this.#fetchContentFromGateway(cid, "ipns", options);
  }
  //endregion
}

export default FilebaseClient;
