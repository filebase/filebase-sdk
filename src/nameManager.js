import axios from "axios";

/** Provides methods for managing names in an REST endpoint. */
class NameManager {
  #DEFAULT_ENDPOINT = "https://api.filebase.io/v1/names";
  #DEFAULT_TIMEOUT = 60000;

  #client;

  /**
   * @summary Creates a new instance of the constructor.
   * @param {object} clientConfig - The configuration object for the client.
   * @param {object} clientConfig.credentials - The credentials object for authentication.
   * @param {string} clientConfig.credentials.accessKeyId - The access key ID for authentication.
   * @param {string} clientConfig.credentials.secretAccessKey - The secret access key for authentication.
   * @param {string} [clientConfig.endpoint="https://api.filebase.io/v1/names"] - The API endpoint URL.
   *
   * @return {object} - The instance of the constructor.
   */
  constructor(
    clientConfig = {
      credentials: {
        accessKeyId: null,
        secretAccessKey: null,
      },
    },
  ) {
    const configErrors = this.#validateClientConfig(clientConfig);
    if (configErrors.length > 0) {
      throw new Error(configErrors.join("\n"));
    }

    const encodedToken = Buffer.from(
        `${clientConfig.credentials.accessKeyId}:${clientConfig.credentials.secretAccessKey}`,
      ).toString("base64"),
      baseURL = clientConfig.endpoint || this.#DEFAULT_ENDPOINT;
    this.#client = axios.create({
      baseURL: baseURL,
      timeout: this.#DEFAULT_TIMEOUT,
      headers: { Authorization: encodedToken },
    });
  }

  /**
   * @summary Validates the client configuration.
   * @param {object} clientConfig - The client configuration object.
   * @returns {string[]} - An array containing any validation errors found in the client configuration.
   */
  #validateClientConfig(clientConfig) {
    let configErrors = [];

    if (typeof clientConfig?.credentials?.accessKeyId !== "string") {
      configErrors.push("clientConfig must contain credentials.accessKeyId");
    }

    if (typeof clientConfig?.credentials?.secretAccessKey !== "string") {
      configErrors.push(
        "clientConfig must contain credentials.secretAccessKey",
      );
    }

    return configErrors;
  }

  /**
   * @summary Creates a new IPNS name with the given name as the label and CID.
   * @param {string} label - The label of the new IPNS name.
   * @param {null|string} [cid] - The CID of the IPNS name. Default value is null.
   * @param {object} [options] - Additional options for the IPNS name.
   * @param {boolean} [options.enabled=true] - Whether the IPNS name is enabled or not.
   * @returns {Promise<any>} - A Promise that resolves with the response JSON.
   */
  async create(
    label,
    cid = null,
    options = {
      enabled: true,
    },
  ) {
    if (typeof label !== "string") {
      throw new Error(`param [label] is required and must be a string`);
    }
    const createResponse = await this.#client.request({
      method: "POST",
      data: {
        label,
        cid,
        enabled: options?.enabled !== false,
      },
    });
    return createResponse.json();
  }

  /**
   * @summary Imports a user's IPNS private key.
   * @param {string} label - The label for the IPNS name.
   * @param {string} privateKey - The existing private key encoded in Base64.
   * @param {null|string} [cid=null] - The CID (Content Identifier) of the data.
   *
   * @returns {Promise<Object>} - A Promise that resolves to the server response.
   */
  async import(label, privateKey, cid = null) {
    if (typeof label !== "string") {
      throw new Error(`param [name] is required and must be a string`);
    }
    if (typeof privateKey !== "string") {
      throw new Error(`param [privateKey] is required and must be a string`);
    }
    const importResponse = await this.#client.request({
      method: "POST",
      data: {
        label,
        privateKey,
        cid,
      },
    });
    return importResponse.json();
  }

  /**
   * @summary Updates the specified name with the given cid.
   * @param {string} label - The label of the name to update.
   * @param {string} cid - The cid to associate with the name.
   * @param {Object} options - The options for the set operation.
   * @param {boolean} [options.enabled] - Whether the name is enabled (default: false).
   *
   * @returns {Promise<any>} - A Promise that resolves with the response data from the server.
   */
  async update(label, cid, options = {}) {
    const setOptions = {
      cid,
    };
    if (options?.enabled) {
      setOptions.enabled = Boolean(options.enabled);
    }
    const setResponse = await this.#client.request({
      method: "PUT",
      url: `/${label}`,
      data: setOptions,
    });
    return setResponse.json();
  }

  /**
   * @summary Returns a list of IPNS name(s)
   * @param {string} [label] - Optional string parameter representing the label of the name to list.
   * @returns {Promise<Array>} - A promise that resolves to an array of names.
   */
  async list(label = null) {
    const getResponse = await this.#client.request({
      method: "GET",
      url: typeof label === "string" ? `/${label}` : undefined,
    });
    return getResponse.json();
  }

  /**
   * @summary Deletes an IPNS name with the given label.
   * @param {string} label - The label of the IPNS name to delete.
   * @returns {Promise<boolean>} - A promise that resolves to true if the resource is successfully deleted, otherwise false.
   */
  async delete(label) {
    const createResponse = await this.#client.request({
      method: "DELETE",
      url: `/${label}`,
    });
    return createResponse.status === 200;
  }

  /**
   * @summary Toggles the enabled state of a given IPNS name.
   * @param {string} label - The label of the IPNS name to toggle.
   * @param {boolean} enabled - The new enabled state.
   * @returns {Promise<any>} - A promise that resolves to the response data.
   */
  async toggle(label, enabled) {
    const enableResponse = await this.#client.request({
      method: "PUT",
      url: `/${label}`,
      data: {
        enabled: enabled,
      },
    });
    return enableResponse.json();
  }
}

export default NameManager;
