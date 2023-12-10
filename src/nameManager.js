import axios from "axios";

/** Provides methods for managing names in an REST endpoint. */
class NameManager {
  #DEFAULT_ENDPOINT = "https://api.filebase.io";
  #DEFAULT_TIMEOUT = 60000;

  #client;

  /**
   * @summary Creates a new instance of the constructor.
   * @param {clientConfiguration} clientConfiguration - The configuration object for the client.
   * @example
   * import { NameManager } from "@filebase/sdk";
   * const nameManager = new NameManager({
   *   credentials: {
   *       accessKeyId: "KEY_FROM_DASHBOARD",
   *       secretAccessKey: "SECRET_FROM_DASHBOARD",
   *   },
   * });
   */
  constructor(
    clientConfiguration = {
      credentials: {
        accessKeyId: null,
        secretAccessKey: null,
      },
    },
  ) {
    clientConfiguration.endpoint =
      clientConfiguration.endpoint || this.#DEFAULT_ENDPOINT;
    const configErrors = this.#validateclientConfiguration(clientConfiguration);
    if (configErrors.length > 0) {
      throw new Error(configErrors.join("\n"));
    }

    const encodedToken = Buffer.from(
        `${clientConfiguration.credentials.accessKeyId}:${clientConfiguration.credentials.secretAccessKey}`,
      ).toString("base64"),
      baseURL = `${clientConfiguration.endpoint}/v1/names`;
    this.#client = axios.create({
      baseURL: baseURL,
      timeout: this.#DEFAULT_TIMEOUT,
      headers: { Authorization: `Bearer ${encodedToken}` },
    });
  }

  /**
   * @summary Validates the client configuration.
   * @param {clientConfiguration} clientConfiguration - The client configuration object.
   * @returns {string[]} - An array containing any validation errors found in the client configuration.
   */
  #validateclientConfiguration(clientConfiguration) {
    let configErrors = [];

    if (typeof clientConfiguration?.credentials?.accessKeyId !== "string") {
      configErrors.push(
        "clientConfiguration must contain credentials.accessKeyId",
      );
    }

    if (typeof clientConfiguration?.credentials?.secretAccessKey !== "string") {
      configErrors.push(
        "clientConfiguration must contain credentials.secretAccessKey",
      );
    }

    return configErrors;
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
   * @property {boolean} enabled Whether the name is enabled or not.
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
  async create(
    label,
    cid,
    options = {
      enabled: true,
    },
  ) {
    const createResponse = await this.#client.request({
      method: "POST",
      data: {
        label,
        cid,
        enabled: options?.enabled !== false,
      },
    });
    return createResponse.data;
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
  async import(
    label,
    cid,
    privateKey,
    options = {
      enabled: true,
    },
  ) {
    const importResponse = await this.#client.request({
      method: "POST",
      data: {
        label,
        cid,
        network_private_key: privateKey,
        enabled: options?.enabled !== false,
      },
    });
    return importResponse.data;
  }

  /**
   * @summary Updates the specified name with the given CID.
   * @param {string} label - The label of the name to update.
   * @param {string} cid - The cid to associate with the name.
   * @param {nameOptions} options - The options for the set operation.
   *
   * @returns {Promise<boolean>} - A Promise that resolves to true if the IPNS name was updated.
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
    return setResponse.status === 200;
  }

  /**
   * @summary Returns the value of an IPNS name
   * @param {string} label - Parameter representing the label of the name to resolve.
   * @returns {Promise<Array.<name>>} - A promise that resolves to the value of a name.
   * @example
   * // Resolve IPNS name with label of `list-name-example`
   * await nameManager.resolve(`list-name-example`);
   */
  async resolve(label) {
    const getResponse = await this.#client.request({
      method: "GET",
      url: `/${label}`,
      validateStatus: (status) => {
        return status === 200 || status === 404;
      },
    });
    return getResponse.status === 200 ? getResponse.data : false;
  }

  /**
   * @summary Returns a list of IPNS names
   * @returns {Promise<Array.<name>>} - A promise that resolves to an array of names.
   * @example
   * // List all IPNS names
   * await nameManager.list();
   */
  async list() {
    const getResponse = await this.#client.request({
      method: "GET",
    });
    return getResponse.data;
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
    const createResponse = await this.#client.request({
      method: "DELETE",
      url: `/${label}`,
    });
    return createResponse.status === 202;
  }

  /**
   * @summary Toggles the enabled state of a given IPNS name.
   * @param {string} label - The label of the IPNS name to toggle.
   * @param {boolean} enabled - The new enabled state.
   * @returns {Promise<boolean>} A promise that resolves to true if the IPNS name was successfully toggled.
   * @example
   * // Toggle IPNS name with label of `toggle-name-example`
   * await nameManager.toggle(`toggle-name-example`, true);  // Enabled
   * await nameManager.toggle(`toggle-name-example`, false); // Disabled
   */
  async toggle(label, enabled) {
    const enableResponse = await this.#client.request({
      method: "PUT",
      url: `/${label}`,
      data: {
        enabled: enabled,
      },
    });
    return enableResponse.status === 200;
  }
}

export default NameManager;
