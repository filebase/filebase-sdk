import axios from "axios";

class GatewayManager {
  #DEFAULT_ENDPOINT = "https://api.filebase.io";
  #DEFAULT_TIMEOUT = 60000;

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
    const clientEndpoint =
        process.env.NODE_ENV === "test"
          ? process.env.TEST_GW_ENDPOINT || this.#DEFAULT_ENDPOINT
          : this.#DEFAULT_ENDPOINT,
      encodedToken = Buffer.from(`${clientKey}:${clientSecret}`).toString(
        "base64",
      ),
      baseURL = `${clientEndpoint}/v1/gateways`;
    this.#client = axios.create({
      baseURL: baseURL,
      timeout: this.#DEFAULT_TIMEOUT,
      headers: { Authorization: `Bearer ${encodedToken}` },
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
    const createResponse = await this.#client.request({
      method: "POST",
      data: createOptions,
    });
    return createResponse.data;
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
    const deleteResponse = await this.#client.request({
      method: "DELETE",
      url: `/${name}`,
      validateStatus: (status) => {
        return status === 204 || status === 404;
      },
    });
    if (deleteResponse.status === 404) {
      throw new Error(`Could not find matching name for gateway`);
    }
    return true;
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
    const getResponse = await this.#client.request({
      method: "GET",
      url: `/${name}`,
      validateStatus: (status) => {
        return status === 200 || status === 404;
      },
    });
    return getResponse.status === 200 ? getResponse.data : false;
  }

  /**
   * @summary Returns a list of gateways
   * @returns {Promise<Array.<gateway>>} - A promise that resolves to an array of gateways.
   * @example
   * // List all gateways
   * await gatewayManager.list();
   */
  async list() {
    const getResponse = await this.#client.request({
      method: "GET",
    });
    return getResponse.data;
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
    const updateResponse = await this.#client.request({
      method: "PUT",
      url: `/${name}`,
      data: updateOptions,
      validateStatus: (status) => {
        return status === 200 || status === 404;
      },
    });
    if (updateResponse.status === 404) {
      throw new Error(`Could not find matching name for gateway`);
    }
    return true;
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
    const toggleResponse = await this.#client.request({
      method: "PUT",
      url: `/${name}`,
      data: {
        enabled: Boolean(targetState),
      },
      validateStatus: (status) => {
        return status === 200 || status === 404;
      },
    });
    if (toggleResponse.status === 404) {
      throw new Error(`Could not find matching name for gateway`);
    }
    return toggleResponse.status === 200;
  }
}

export default GatewayManager;
