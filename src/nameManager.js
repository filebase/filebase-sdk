import axios from "axios";

/** Provides methods for managing names in an REST endpoint. */
class NameManager {
  #client;

  /**
   * @summary Creates a new instance of the constructor.
   * @param {string} key - The key required for authorization.
   * @param {string} secret - The secret required for authorization.
   * @param {string} [endpoint="https://api.filebase.io/v1/names"] - The endpoint URL for the API.
   *
   * @return {object} - The instance of the constructor.
   */
  constructor(key, secret, endpoint = "https://api.filebase.io/v1/names") {
    const encodedToken = Buffer.from(`${key}:${secret}`).toString("base64");
    this.#client = axios.create({
      baseURL: endpoint,
      timeout: 60000,
      headers: { Authorization: encodedToken },
    });
  }

  /**
   * @summary Creates a new IPNS name with the given name and CID.
   * @param {string} name - The name of the object.
   * @param {null|string} [cid] - The CID of the object. Default value is null.
   * @param {object} [options] - Additional options for the IPNS name.
   * @param {boolean} [options.enabled=true] - Whether the IPNS name is enabled or not.
   * @returns {Promise<any>} - A Promise that resolves with the response JSON.
   */
  async create(
    name,
    cid = null,
    options = {
      enabled: true,
    },
  ) {
    if (typeof name !== "string") {
      throw new Error(`param [name] is required and must be a string`);
    }
    const createResponse = await this.#client.request({
      method: "POST",
      data: {
        name,
        cid,
        enabled: options?.enabled !== false,
      },
    });
    return createResponse.json();
  }

  /**
   * @summary Imports a user's IPNS private key.
   * @param {string} name - The name of the user.
   * @param {string} privateKey - The user's private key.
   * @param {null|string} [cid=null] - The CID (Content Identifier) of the data.
   *
   * @returns {Promise<Object>} - A Promise that resolves to the server response.
   */
  async import(name, privateKey, cid = null) {
    if (typeof name !== "string") {
      throw new Error(`param [name] is required and must be a string`);
    }
    if (typeof privateKey !== "string") {
      throw new Error(`param [privateKey] is required and must be a string`);
    }
    const importResponse = await this.#client.request({
      method: "POST",
      data: {
        name,
        privateKey,
        cid,
      },
    });
    return importResponse.json();
  }

  /**
   * @summary Sets the specified name with the given cid.
   * @param {string} name - The name to set.
   * @param {string} cid - The cid to associate with the name.
   * @param {Object} options - The options for the set operation.
   * @param {boolean} [options.enabled] - Whether the name is enabled (default: false).
   *
   * @returns {Promise<any>} - A Promise that resolves with the response data from the server.
   */
  async set(name, cid, options = {}) {
    const setOptions = {
      cid,
    };
    if (options?.enabled) {
      setOptions.enabled = Boolean(options.enabled);
    }
    const setResponse = await this.#client.request({
      method: "PUT",
      url: `/${name}`,
      data: setOptions,
    });
    return setResponse.json();
  }

  /**
   * @summary Retrieves current value from the server based on the given name parameter.
   * @param {string} name - The name parameter to fetch the current value for.
   * @returns {Promise<*>} - A promise that resolves with the fetched data.
   */
  async get(name) {
    const getResponse = await this.#client.request({
      method: "GET",
      url: `/${name}`,
    });
    return getResponse.json();
  }

  /**
   * @summary Returns a list of names with the specified limit and options.
   * @param {number} limit - The maximum number of names to retrieve. Default is 1000.
   * @param {object} options - Additional options for retrieving the names. Default is { continuationToken: false }.
   * @returns {Promise<*>} - A promise that resolves to an array of names.
   */
  async list(limit = 1000, options = { continuationToken: false }) {
    let names = [],
      continuationToken = options?.continuationToken || false,
      isTruncated = true,
      fetchLimit = limit + 1;
    while (isTruncated === true) {
      let pageParams = {
        limit: fetchLimit,
      };
      if (continuationToken) {
        pageParams.after = continuationToken;
      }
      const getResponse = await this.#client.request({
          method: "GET",
          params: pageParams,
        }),
        pageNames = getResponse.json();
      if (pageNames.length < fetchLimit) {
        isTruncated = false;
      }
      names = names.concat(pageNames);
    }
    return names.slice(0, limit);
  }

  /**
   * @summary Deletes a resource with the given name.
   * @param {string} name - The name of the resource to delete.
   * @returns {Promise<boolean>} - A promise that resolves to true if the resource is successfully deleted, otherwise false.
   */
  async delete(name) {
    const createResponse = await this.#client.request({
      method: "DELETE",
      url: `/${name}`,
    });
    return createResponse.status === 200;
  }

  /**
   * @summary Toggles the enabled state of a given IPNS name.
   * @param {string} name - The name of the item to toggle.
   * @param {boolean} enabled - The new enabled state.
   * @returns {Promise<any>} - A promise that resolves to the response data.
   */
  async toggle(name, enabled) {
    const enableResponse = await this.#client.request({
      method: "PUT",
      url: `/${name}`,
      data: {
        enabled: enabled,
      },
    });
    return enableResponse.json();
  }
}

export default NameManager;
