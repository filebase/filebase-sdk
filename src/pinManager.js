import axios from "axios";

/** Provides methods for managing pins in an REST endpoint. */
class PinManager {
  #DEFAULT_ENDPOINT = "https://api.filebase.io";
  #DEFAULT_TIMEOUT = 60000;

  #DEFAULT_GATEWAY = "https://ipfs.filebase.io";

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
   * @property {string} [endpoint="https://ipfs.filebase.io"] Default gateway to use.
   * @property {string} [token] Token for the default gateway.
   * @property {number} [timeout=60000] Timeout for the default gateway
   */

  /**
   * @summary Creates a new instance of the constructor.
   * @param {string} clientKey - The access key ID for authentication.
   * @param {string} clientSecret - The secret access key for authentication.
   * @param {pinManagerOptions} [options] - Optional settings for the constructor.
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
    this.#defaultBucket = options?.bucket;
    const PSAClientEndpoint =
        process.env.NODE_ENV === "test"
          ? process.env.TEST_NAME_ENDPOINT || this.#DEFAULT_ENDPOINT
          : this.#DEFAULT_ENDPOINT,
      baseURL = `${PSAClientEndpoint}/v1/ipfs/pins`;
    this.#credentials = {
      key: clientKey,
      secret: clientSecret,
    };
    this.#client = axios.create({
      baseURL: baseURL,
      timeout: this.#DEFAULT_TIMEOUT,
    });

    this.#gatewayConfiguration = {
      endpoint: options?.gateway?.endpoint || this.#DEFAULT_GATEWAY,
      token: options?.gateway?.token,
      timeout: options?.gateway?.timeout || this.#DEFAULT_TIMEOUT,
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
   *
   * @param {listPinOptions} [listOptions]
   * @param {pinOptions} [options]
   * @returns {Promise<listPinResults>}
   */
  async list(listOptions, options) {
    const encodedToken = this.#getEncodedToken(options?.bucket),
      getResponse = await this.#client.request({
        method: "GET",
        params: listOptions,
        headers: { Authorization: `Bearer ${encodedToken}` },
      });
    for (let pinStatus of getResponse.data.results) {
      pinStatus.download = () => {
        return this.download(pinStatus.pin.cid);
      };
    }
    return getResponse.data;
  }

  /**
   *
   * @param {string} key Key or path of the file in the bucket
   * @param {string} cid Content Identifier (CID) to be pinned recursively
   * @param {Object} [metadata] Optional metadata for pin object
   * @param {pinOptions} [options] Options for pinning the object
   * @returns {Promise<pinStatus>}
   */
  async create(key, cid, metadata, options) {
    const encodedToken = this.#getEncodedToken(options?.bucket),
      pinStatus = await this.#client.request({
        method: "POST",
        data: {
          cid,
          name: key,
          meta: metadata,
        },
        headers: { Authorization: `Bearer ${encodedToken}` },
      });
    pinStatus.data.download = () => {
      return this.download(pinStatus.data.pin.cid);
    };
    return pinStatus.data;
  }

  async replace(requestid, cid, metadata, options) {
    const encodedToken = this.#getEncodedToken(options?.bucket),
      pinStatusResult = await this.#client.request({
        method: "POST",
        url: requestid,
        data: {
          cid,
          meta: metadata,
        },
        validateStatus: (status) => {
          return status === 200 || status === 404;
        },
        headers: { Authorization: `Bearer ${encodedToken}` },
      });
    if (pinStatusResult.status === 404) {
      throw new Error(`Could not find matching requestid`);
    }
    const pinStatus = pinStatusResult;
    pinStatus.download = () => {
      return this.download(pinStatus.pin.cid);
    };
    return pinStatus;
  }

  /**
   *
   * @param {string} cid
   * @param {pinDownloadOptions} [options]
   * @returns {Promise<stream>}
   */
  async download(cid, options) {
    const downloadHeaders = {};
    if (this.#gatewayConfiguration.token || options?.token) {
      downloadHeaders["x-filebase-gateway-token"] =
        this.#gatewayConfiguration.token || options.token;
    }

    const downloadEndpoint =
        options?.endpoint || this.#gatewayConfiguration.endpoint,
      getResponse = await this.#client.request({
        method: "GET",
        baseURL: downloadEndpoint,
        url: `/ipfs/${cid}`,
        headers: downloadHeaders,
        type: "stream",
        timeout: this.#gatewayConfiguration.timeout,
      });
    return getResponse.data;
  }

  /**
   *
   * @param {string} requestid Globally unique identifier of the pin request
   * @param {pinOptions} [options] Options for getting the pin
   * @returns {Promise<pinStatus|false>}
   */
  async get(requestid, options) {
    const encodedToken = this.#getEncodedToken(options?.bucket),
      getResponseResult = await this.#client.request({
        method: "GET",
        url: `/${requestid}`,
        headers: { Authorization: `Bearer ${encodedToken}` },
        validateStatus: (status) => {
          return status === 200 || status === 404;
        },
      });
    if (getResponseResult.status === 404) {
      return false;
    }
    const pinStatus = getResponseResult.data;
    pinStatus.download = () => {
      return this.download(pinStatus.pin.cid);
    };
    return pinStatus;
  }

  /**
   *
   * @param requestid Globally unique identifier of the pin request
   * @param {pinOptions} [options] Options for deleting the pin
   * @returns {Promise<boolean>}
   */
  async delete(requestid, options) {
    const encodedToken = this.#getEncodedToken(options?.bucket),
      deleteResponse = await this.#client.request({
        method: "DELETE",
        url: `/${requestid}`,
        headers: { Authorization: `Bearer ${encodedToken}` },
        validateStatus: (status) => {
          return status === 202 || status === 404;
        },
      });
    if (deleteResponse.status === 404) {
      throw new Error(`Could not find matching requestid`);
    }
    return true;
  }

  #getEncodedToken(bucket) {
    bucket = bucket || this.#defaultBucket;
    return Buffer.from(
      `${this.#credentials.key}:${this.#credentials.secret}:${bucket}`,
    ).toString("base64");
  }
}

export default PinManager;
