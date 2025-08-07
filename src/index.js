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
  PutObjectCommand,
  S3Client,
} from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { unmarshalIPNSRecord } from "ipns";

/**
 */

class FilebaseClient {
  #DEFAULT_RPC_TIMEOUT = 60000;
  #DEFAULT_RPC_ENDPOINT = "https://rpc.filebase.io";
  #DEFAULT_S3_ENDPOINT = "https://s3.filebase.com";
  #DEFAULT_REGION = "us-east-1";

  #DEFAULT_ENDPOINT = "https://api.filebase.io";
  #DEFAULT_TIMEOUT = 60000;

  #GATEWAY_DEFAULT_TIMEOUT = 60000;
  #PUBLIC_IPFS_GATEWAY = "https://ipfs.filebase.io";
  #VALID_FORMATS = ["ipns-record", "raw", "car", "tar"];

  #default_bucket;
  #default_gateway;

  #ipfs_credentials;
  #ipfs_client;
  #gateways_client;
  #names_client;
  #s3_client;

  /**
   * @summary Creates a new instance of the constructor.
   * @param {string} clientKey - The access key ID for authentication.
   * @param {string} clientSecret - The secret access key for authentication.
   * @param {Object} [options] - Options for the client (optional)
   * @property {string} options.bucket The bucket to use for file operations (optional)
   * @property {string} options.gateway The gateway to use for file retrievals (optional)
   * @property {string} options.timeout The amount of time to wait for responses (optional)
   * @tutorial quickstart-bucket
   * @example
   * import FilebaseClient from "@filebase/sdk";
   * const client = new FilebaseClient("KEY_FROM_DASHBOARD", "SECRET_FROM_DASHBOARD", {
   *   bucket: "my-main-bucket"
   * });
   */
  constructor(clientKey, clientSecret, options) {
    //region S3 Client
    const clientEndpoint = options?.endpoints?.s3 || this.#DEFAULT_S3_ENDPOINT;
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
    const ipfsEndpoint = options?.endpoints?.rpc || this.#DEFAULT_RPC_ENDPOINT;
    this.#ipfs_credentials = `${clientKey}:${clientSecret}`;
    let ipfsCredentials = this.#ipfs_credentials;
    if (options?.bucket) {
      ipfsCredentials = `${ipfsCredentials}:${options.bucket}`;
      this.#default_bucket = options.bucket;
    }
    this.#ipfs_client = axios.create({
      baseURL: ipfsEndpoint,
      timeout: options?.timeout || this.#DEFAULT_RPC_TIMEOUT,
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
      options?.endpoints?.platform || this.#DEFAULT_ENDPOINT;
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
      options?.endpoints?.platform || this.#DEFAULT_ENDPOINT;
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
    this.#default_gateway = options?.gateway || this.#PUBLIC_IPFS_GATEWAY;
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
   * const createdBucket = await client.createBucket(`create-bucket-example`);
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
   * @returns {Promise<string>} A promise that resolves with the CID of the new directory/folder
   * @example
   * // Generate CID for bucket with name of `bucket-name-to-mfs`
   * const generatedCid = await client.generateBucketCid(`bucket-name-to-mfs`);
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

  /**
   * @summary Gets the IPFS Directory/Folder CID for a given bucket
   * @param {string} name - The name of the bucket to use.
   * @returns {Promise<string>} A promise that resolves with the CID of the directory
   * @example
   * // Get CID for bucket with name of `bucket-name-with-mfs`
   * const bucketCid = await client.generateBucketCid(`bucket-name-with-mfs`);
   */
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
   * const bucketList = await client.listBuckets();
   */
  async listBuckets() {
    const command = new ListBucketsCommand({}),
      { Buckets } = await this.#s3_client.send(command);

    return Buckets;
  }
  //endregion

  //region File Methods
  async #uploadFiles(formData, options) {
    const uploadHeaders = options.headers || {};
    uploadHeaders["Authorization"] =
      `Bearer ${this.#getIpfsCredentials(options?.bucket)}`;
    const uploadParams = options.params || {};
    uploadParams["preserve-filenames"] = "true";
    uploadParams["cid-version"] = uploadParams.cidVersion
      ? Number(uploadParams.cidVersion)
      : 0;

    const downloadResponse = await this.#ipfs_client.request({
      method: "POST",
      url: "api/v0/add",
      headers: uploadHeaders,
      params: uploadParams,
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

  /**
   * @summary Copies a file by name.  Can also copy files to another bucket.
   * @param {string} from - The name of the file to use as the source.
   * @param {string} to - The name to use for the destination file
   * @param {Object} [options] Options for copying file
   * @property {string} options.sourceBucket The bucket to copy the file from.
   * @property {string} entries.destinationBucket The bucket to copy the file into.
   * @returns {Promise<boolean>} - A promise that resolves when the file has been copied.
   * @example
   * // Copy file with name of `copy-file-example`
   * const copiedFile = await client.copyFile(`copy-file-example`, `copy-file-example-copy1`);
   */
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

  /**
   * @summary Deletes a file by name.
   * @param {string} name - The name of the file to delete.
   * @param {Object} [options] Options for deleting file
   * @property {string} options.bucket The bucket to delete the file from.
   * @returns {Promise<boolean>} - A promise that resolves when the file has been deleted.
   * @example
   * // Delete file with name of `delete-file-example`
   * const deletedFile = await client.deleteFile(`delete-file-example`);
   */
  async deleteFile(name, options) {
    const command = new DeleteObjectCommand({
      Bucket: options?.bucket || this.#default_bucket,
      Key: name,
    });

    await this.#s3_client.send(command);
    return true;
  }

  /**
   * @summary Downloads a file by name.
   * @param {string} name - The name of the file to download.
   * @param {Object} [options] Options for downloading file
   * @property {string} options.bucket The bucket to download the file from.
   * @returns {Promise<stream>} - A promise that resolves with the contents of the file.
   * @example
   * // Download file with name of `download-file-example`
   * const downloadedFile = await client.downloadFile(`download-file-example`);
   */
  async downloadFile(name, options) {
    const command = new GetObjectCommand({
        Bucket: options?.bucket || this.#default_bucket,
        Key: name,
      }),
      response = await this.#s3_client.send(command);

    return response.Body;
  }

  /**
   * @summary Generate presigned URL for uploading a file.
   * @param {string} name - The name of the file to upload.
   * @param {Object} [options] Options for downloading file
   * @property {string} options.bucket The bucket to upload the file into.
   * @property {string} options.expectedContentType The content type that the uploaded file should be.
   * @property {integer} options.expectedFileSize The number of bytes the file should be on upload.
   * @property {integer} options.expirationInSeconds The number of seconds for the URL to be valid.
   * @returns {Promise<string>} - A promise that resolves with the presigned URL to use for the upload.
   * @example
   * // Generate a presigned URL to upload a file with name of `presigned-upload-file-example`
   * const presignedUrl = await client.generatePresignedUrl(`presigned-upload-file-example`, {
   *   expirationInSeconds: 600,
   * });
   */
  async generatePresignedUrl(name, options) {
    const putObjectOptions = {
      Bucket: options?.bucket || this.#default_bucket,
      Key: name,
    };
    if (options?.expectedContentType) {
      putObjectOptions["ContentType"] = options?.expectedContentType;
    }
    if (options?.expectedFileSize) {
      putObjectOptions["ContentLength"] = options?.expectedFileSize;
    }

    try {
      const command = new PutObjectCommand(putObjectOptions);
      return await getSignedUrl(this.#s3_client, command, {
        expiresIn: options?.expirationInSeconds || 3600, // URL valid for 1 hour by default
      });
    } catch (error) {
      console.error(`Error generating presigned upload URL:`, error);
      throw error;
    }
  }

  /**
   * @summary Gets an objects info and metadata using the S3 API.
   * @param {string} name - The key of the object to be inspected.
   * @param {Object} [options] - The options for inspecting the object.
   * @property {string} options.bucket - The bucket to pin the IPFS CID into.
   * @returns {Promise<Object|false>}
   */
  async getFileMetadata(name, options) {
    try {
      const command = new HeadObjectCommand({
        Bucket: options?.bucket || this.#default_bucket,
        Key: name,
      });
      const headOutput = await this.#s3_client.send(command);
      return headOutput["Metadata"];
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
   * Retrieves a list of files from a specified bucket.
   *
   * @param {string} prefix - The prefix to filter the files list with.
   * @param {Object} [options] - The options for listing files.
   * @property {string} options.bucket The name of the bucket. If not provided, the default bucket will be used.
   * @property {string} options.nextToken Continues listing from this objects name.
   * @property {number} options.limit=1000 Continues listing from this objects name.
   * @returns {Promise<listFilesResult>} - A promise that resolves to an array of files.
   * @example
   * // List files in bucket with a limit of 1000
   * await client.listFiles('my-favorites-folder', {
   *   limit: 1000
   * });
   */
  async listFiles(
    prefix = undefined,
    options = {
      bucket: this.#default_bucket,
      nextToken: null,
      limit: 1000,
    },
  ) {
    const listOptions = {
      Bucket: options?.bucket || this.#default_bucket,
      Prefix: prefix || "",
      Delimiter: "/",
      MaxKeys: listOptions?.limit || 1000,
    };
    if (listOptions?.limit && listOptions.limit > 100000) {
      throw new Error(`Maximum limit is 100000`);
    }
    if (options?.nextToken) {
      listOptions.ContinuationToken = options?.nextToken;
    }
    const command = new ListObjectsV2Command({
      ...listOptions,
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
        ...listOptions,
        continuationToken: NextContinuationToken,
      });
    }
    return listResponse;
  }

  /**
   * @typedef {Object} pinnedFile
   * @property {string} name Name of the pinned file
   * @property {string} cid CID of the pinned file
   * @property {number} size Size in Bytes of the pinned file
   */

  /**
   * @summary Uploads an array of Files as a directory
   * @param {string} name - The name of the directory once pinned.
   * @param {File[]} input - The array of files to include in the directory.
   * @param {Object} [options] Options for uploading directory
   * @property {number} options.cidVersion The version of CID to use for the files hash.
   * @property {string} options.bucket The bucket to upload the pinned directory into.
   * @returns {Promise<pinnedFile>} - A promise that resolves when the directory has finished uploading.
   * @example
   * // Pin file with name of `pin-file-example`
   * const pinnedFile = await client.pinFile(`pin-file-example`, 'QmbQDovX7wRe9ek7u6QXe9zgCXkTzoUSsTFJEkrYV1HrVR');
   */
  async uploadDirectory(name, input, options = {}) {
    const uploadedFiles = await this.#uploadFiles(input, {
      headers: {
        Authorization: `Bearer ${this.#getIpfsCredentials(options?.bucket)}`,
      },
      params: {
        "cid-version": options?.cidVersion || 0,
        "directory-name": name,
        "wrap-with-directory": "true",
      },
    });
    return uploadedFiles[0];
  }

  /**
   * @summary Uploads a single file
   * @param {string} name - The name of the file once pinned.
   * @param {File} content - The file to upload.
   * @param {Object} [options] Options for uploading file
   * @property {number} options.cidVersion The version of CID to use for the files hash.
   * @property {string} options.bucket The bucket to upload the pinned directory into.
   * @property {Object} options.headers The headers to pass to the RPC API.
   * @property {Object} options.params The params to pass to the RPC API.
   * @returns {Promise<pinnedFile>} - A promise that resolves when the file has finished uploading.
   * @example
   * // Upload file with name of `upload-file-example`
   * const uploadedFile = await client.uploadFile(`upload-file-example`, new Blob(["Hello Filebase!"]));
   */
  async uploadFile(name, content, options = {}) {
    const uploadFormData = new FormData();
    uploadFormData.append("file", content, name);

    const uploadedFiles = await this.uploadFiles(uploadFormData, options);
    return uploadedFiles[0];
  }

  /**
   * @summary Uploads multiple files at once.
   * @param {FormData} content - The form to upload.
   * @param {Object} [options] Options for uploading file
   * @property {number} options.cidVersion The version of CID to use for the files hash.
   * @property {string} options.bucket The bucket to upload the pinned directory into.
   * @property {Object} options.headers The headers to pass to the RPC API.
   * @property {Object} options.params The params to pass to the RPC API.
   * @returns {Promise<pinnedFile[]>} - A promise that resolves when the file has finished uploading.
   * @example
   * // Upload files with a form
   * const uploadForm = new FormData();
   * uploadForm.append('File', new Blob(['Hello Jack!']), 'jacks/file.txt');
   * uploadForm.append('File', new Blob(['Hello Jill!']), 'jills/file.txt');
   * const uploadedFiles = await client.uploadFiles(uploadForm);
   */
  uploadFiles(content, options = {}) {
    return this.#uploadFiles(content, options);
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
   * @summary Creates a new IPNS name with the given name as the label and CID.
   * @param {string} label - The label of the new IPNS name.
   * @param {string} cid - The CID of the IPNS name.
   * @param {Object} [options] - Additional options for the IPNS name.
   * @param {boolean} options.enabled - Whether the name is enabled or not.
   * @returns {Promise<name>} - A Promise that resolves with the response JSON.
   * @example
   * // Create IPNS name with label of `create-name-example` and CID of `QmdmQXB2mzChmMeKY47C43LxUdg1NDJ5MWcKMKxDu7RgQm`
   * const createdName = await client.createIpnsName(`create-name-example`, `QmdmQXB2mzChmMeKY47C43LxUdg1NDJ5MWcKMKxDu7RgQm`);
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
   * const ipnsName = await nameManager.get(`list-name-example`);
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
   * @param {Object} [options] - Additional options for the IPNS name.
   * @param {boolean} options.enabled - Whether the name is enabled or not.
   * @returns {Promise<name>} - A Promise that resolves to the server response.
   * @example
   * // Import IPNS private key with label of `create-name-example`, CID of `QmdmQXB2mzChmMeKY47C43LxUdg1NDJ5MWcKMKxDu7RgQm`
   * // and a private key encoded with base64
   * const createdName = await client.importIpnsName(
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
   * const namesList = await client.listIpnsNames();
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

  /**
   * @summary Resolves an IPNS CID using your selected gateway
   * @param {string} value - The IPNS CID to resolve.
   * @param {Object} [options] - Optional options for fetching content.
   * @param {string} options.endpoint - Gateway to use for downloading data.
   * @param {string} options.format - Format for returned data. ["car", "tar", "raw", "ipns-record"]
   * @param {number} options.timeout - Timeout for request in milliseconds.
   * @param {string} options.token - Token for accessing gateway.
   * @returns {Promise<string>} - A promise that resolves to the IPFS CID.
   */
  async resolveIpnsName(value, options = {}) {
    try {
      const resolvedIpnsName = await this.#fetchContentFromGateway(
        value,
        "ipns",
        {
          ...options,
          format: "ipns-record",
        },
      );
      return unmarshalIPNSRecord(Buffer.from(resolvedIpnsName)).value.replace(
        "/ipfs/",
        "",
      );
    } catch (err) {
      this.#apiErrorHandler(err);
    }
  }

  /**
   * @summary Updates the specified name with the given CID.
   * @param {string} label - The label of the name to update.
   * @param {string} cid - The cid to associate with the name.
   * @param {Object} options - The options for the set operation.
   * @param {boolean} options.enabled - Whether the name is enabled or not.   *
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
   * const createdGateway = await client.createGateway(`create-gateway-example`, {
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
   * const existingGateway = await client.getGateway(`gateway-get-example`);
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
   * const gatewaysList = await client.listGateways();
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

  //region Pinning Methods
  /**
   * @summary Pins a file by name and CID.
   * @param {string} name - The name of the file to pin.
   * @param {string} cid - The CID of the file to pin.
   * @param {Object} [options] Options for pinning file
   * @property {string} options.bucket The bucket to pin the file to.
   * @returns {Promise<boolean>} - A promise that resolves when the file has been queued for pinning.
   * @example
   * // Pin file with name of `pin-file-example`
   * const pinnedFile = await client.pinFile(`pin-file-example`, 'QmbQDovX7wRe9ek7u6QXe9zgCXkTzoUSsTFJEkrYV1HrVR');
   */
  async pinFile(name, cid, options) {
    await this.#ipfs_client.request({
      method: "POST",
      url: "api/v0/pin/add",
      headers: {
        Authorization: `Bearer ${this.#getIpfsCredentials(options?.bucket)}`,
      },
      params: {
        name: name,
        arg: cid,
      },
      validateStatus: function (status) {
        return status === 200;
      },
    });
    return true;
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
      url: `${selectedEndpoint}/${resolver}/${cid}`,
      headers: downloadHeaders,
      responseType: "arraybuffer",
      timeout: options?.timeout || this.#GATEWAY_DEFAULT_TIMEOUT,
    });
    return downloadResponse.data;
  }

  /**
   * @summary Fetches content by the IPFS CID from your selected gateway.
   * @param {string} cid - The CID for the IPFS content to fetch data from.
   * @param {Object} [options] - Optional options for fetching content.
   * @param {string} options.endpoint - Gateway to use for downloading data.
   * @param {string} options.format - Format for returned data. ["car", "tar", "raw", "ipns-record"]
   * @param {number} options.timeout - Timeout for request in milliseconds.
   * @param {string} options.token - Token for accessing gateway.
   * @returns {Promise<stream>}
   */
  async fetchContentByCid(cid, options = {}) {
    return this.#fetchContentFromGateway(cid, "ipfs", options);
  }

  /**
   * @summary Fetches content by the IPNS CID from your selected gateway.
   * @param {string} cid - The CID for the IPNS name to fetch data from.
   * @param {Object} [options] - Optional options for fetching content.
   * @param {string} options.endpoint - Gateway to use for downloading data.
   * @param {string} options.format - Format for returned data. ["car", "tar", "raw", "ipns-record"]
   * @param {number} options.timeout - Timeout for request in milliseconds.
   * @param {string} options.token - Token for accessing gateway.
   * @returns {Promise<stream>}
   */
  async fetchContentByIpnsName(cid, options = {}) {
    return this.#fetchContentFromGateway(cid, "ipns", options);
  }
  //endregion
}

export { FilebaseClient };
