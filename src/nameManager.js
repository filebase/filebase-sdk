import axios from "axios";

/** Provides methods for managing names in an REST endpoint. */
class NameManager {
  #DEFAULT_ENDPOINT = "https://api.filebase.io";
  #DEFAULT_TIMEOUT = 60000;

  #client;

  /**
   * @summary Creates a new instance of the constructor.
   * @param {string} clientKey - The access key ID for authentication.
   * @param {string} clientSecret - The secret access key for authentication.
   * @example
   * import { NameManager } from "@filebase/sdk";
   * const nameManager = new NameManager("KEY_FROM_DASHBOARD", "SECRET_FROM_DASHBOARD");
   */
  constructor(clientKey, clientSecret) {
    const clientEndpoint =
        process.env.NODE_ENV === "test"
          ? process.env.TEST_NAME_ENDPOINT || this.#DEFAULT_ENDPOINT
          : this.#DEFAULT_ENDPOINT,
      encodedToken = Buffer.from(`${clientKey}:${clientSecret}`).toString(
        "base64",
      ),
      baseURL = `${clientEndpoint}/v1/names`;
    this.#client = axios.create({
      baseURL: baseURL,
      timeout: this.#DEFAULT_TIMEOUT,
      headers: { Authorization: `Bearer ${encodedToken}` },
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
   * @example
   * // Update name with label of `update-name-example` and set the value of the IPNS name.
   * await nameManager.update(`update-name-example`, `bafybeidt4nmaci476lyon2mvgfmwyzysdazienhxs2bqnfpdainzjuwjom`);
   */
  async update(label, cid, options = {}) {
    const updateOptions = {
      cid,
    };
    if (options?.enabled) {
      updateOptions.enabled = Boolean(options.enabled);
    }
    const updateResponse = await this.#client.request({
      method: "PUT",
      url: `/${label}`,
      data: updateOptions,
    });
    return updateResponse.status === 200;
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
    const listResponse = await this.#client.request({
      method: "GET",
    });
    return listResponse.data;
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
    const deleteResponse = await this.#client.request({
      method: "DELETE",
      url: `/${label}`,
    });
    return deleteResponse.status === 202;
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
    const toggleResponse = await this.#client.request({
      method: "PUT",
      url: `/${label}`,
      data: {
        enabled: targetState,
      },
    });
    return toggleResponse.status === 200;
  }
}

export default NameManager;
