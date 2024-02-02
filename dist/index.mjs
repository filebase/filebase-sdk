var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __commonJS = (cb, mod) => function __require() {
  return mod || (0, cb[__getOwnPropNames(cb)[0]])((mod = { exports: {} }).exports, mod), mod.exports;
};
var __copyProps = (to, from3, except, desc) => {
  if (from3 && typeof from3 === "object" || typeof from3 === "function") {
    for (let key of __getOwnPropNames(from3))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from3[key], enumerable: !(desc = __getOwnPropDesc(from3, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));

// node_modules/varint/encode.js
var require_encode = __commonJS({
  "node_modules/varint/encode.js"(exports, module) {
    module.exports = encode8;
    var MSB3 = 128;
    var REST3 = 127;
    var MSBALL3 = ~REST3;
    var INT3 = Math.pow(2, 31);
    function encode8(num, out, offset) {
      if (Number.MAX_SAFE_INTEGER && num > Number.MAX_SAFE_INTEGER) {
        encode8.bytes = 0;
        throw new RangeError("Could not encode varint");
      }
      out = out || [];
      offset = offset || 0;
      var oldOffset = offset;
      while (num >= INT3) {
        out[offset++] = num & 255 | MSB3;
        num /= 128;
      }
      while (num & MSBALL3) {
        out[offset++] = num & 255 | MSB3;
        num >>>= 7;
      }
      out[offset] = num | 0;
      encode8.bytes = offset - oldOffset + 1;
      return out;
    }
  }
});

// node_modules/varint/decode.js
var require_decode = __commonJS({
  "node_modules/varint/decode.js"(exports, module) {
    module.exports = read3;
    var MSB3 = 128;
    var REST3 = 127;
    function read3(buf2, offset) {
      var res = 0, offset = offset || 0, shift = 0, counter = offset, b, l = buf2.length;
      do {
        if (counter >= l || shift > 49) {
          read3.bytes = 0;
          throw new RangeError("Could not decode varint");
        }
        b = buf2[counter++];
        res += shift < 28 ? (b & REST3) << shift : (b & REST3) * Math.pow(2, shift);
        shift += 7;
      } while (b >= MSB3);
      read3.bytes = counter - offset;
      return res;
    }
  }
});

// node_modules/varint/length.js
var require_length = __commonJS({
  "node_modules/varint/length.js"(exports, module) {
    var N13 = Math.pow(2, 7);
    var N23 = Math.pow(2, 14);
    var N33 = Math.pow(2, 21);
    var N43 = Math.pow(2, 28);
    var N53 = Math.pow(2, 35);
    var N63 = Math.pow(2, 42);
    var N73 = Math.pow(2, 49);
    var N83 = Math.pow(2, 56);
    var N93 = Math.pow(2, 63);
    module.exports = function(value) {
      return value < N13 ? 1 : value < N23 ? 2 : value < N33 ? 3 : value < N43 ? 4 : value < N53 ? 5 : value < N63 ? 6 : value < N73 ? 7 : value < N83 ? 8 : value < N93 ? 9 : 10;
    };
  }
});

// node_modules/varint/index.js
var require_varint = __commonJS({
  "node_modules/varint/index.js"(exports, module) {
    module.exports = {
      encode: require_encode(),
      decode: require_decode(),
      encodingLength: require_length()
    };
  }
});

// node_modules/eventemitter3/index.js
var require_eventemitter3 = __commonJS({
  "node_modules/eventemitter3/index.js"(exports, module) {
    "use strict";
    var has = Object.prototype.hasOwnProperty;
    var prefix = "~";
    function Events() {
    }
    if (Object.create) {
      Events.prototype = /* @__PURE__ */ Object.create(null);
      if (!new Events().__proto__)
        prefix = false;
    }
    function EE(fn, context, once) {
      this.fn = fn;
      this.context = context;
      this.once = once || false;
    }
    function addListener(emitter, event, fn, context, once) {
      if (typeof fn !== "function") {
        throw new TypeError("The listener must be a function");
      }
      var listener = new EE(fn, context || emitter, once), evt = prefix ? prefix + event : event;
      if (!emitter._events[evt])
        emitter._events[evt] = listener, emitter._eventsCount++;
      else if (!emitter._events[evt].fn)
        emitter._events[evt].push(listener);
      else
        emitter._events[evt] = [emitter._events[evt], listener];
      return emitter;
    }
    function clearEvent(emitter, evt) {
      if (--emitter._eventsCount === 0)
        emitter._events = new Events();
      else
        delete emitter._events[evt];
    }
    function EventEmitter2() {
      this._events = new Events();
      this._eventsCount = 0;
    }
    EventEmitter2.prototype.eventNames = function eventNames() {
      var names = [], events, name;
      if (this._eventsCount === 0)
        return names;
      for (name in events = this._events) {
        if (has.call(events, name))
          names.push(prefix ? name.slice(1) : name);
      }
      if (Object.getOwnPropertySymbols) {
        return names.concat(Object.getOwnPropertySymbols(events));
      }
      return names;
    };
    EventEmitter2.prototype.listeners = function listeners(event) {
      var evt = prefix ? prefix + event : event, handlers = this._events[evt];
      if (!handlers)
        return [];
      if (handlers.fn)
        return [handlers.fn];
      for (var i = 0, l = handlers.length, ee = new Array(l); i < l; i++) {
        ee[i] = handlers[i].fn;
      }
      return ee;
    };
    EventEmitter2.prototype.listenerCount = function listenerCount(event) {
      var evt = prefix ? prefix + event : event, listeners = this._events[evt];
      if (!listeners)
        return 0;
      if (listeners.fn)
        return 1;
      return listeners.length;
    };
    EventEmitter2.prototype.emit = function emit(event, a1, a2, a3, a4, a5) {
      var evt = prefix ? prefix + event : event;
      if (!this._events[evt])
        return false;
      var listeners = this._events[evt], len = arguments.length, args, i;
      if (listeners.fn) {
        if (listeners.once)
          this.removeListener(event, listeners.fn, void 0, true);
        switch (len) {
          case 1:
            return listeners.fn.call(listeners.context), true;
          case 2:
            return listeners.fn.call(listeners.context, a1), true;
          case 3:
            return listeners.fn.call(listeners.context, a1, a2), true;
          case 4:
            return listeners.fn.call(listeners.context, a1, a2, a3), true;
          case 5:
            return listeners.fn.call(listeners.context, a1, a2, a3, a4), true;
          case 6:
            return listeners.fn.call(listeners.context, a1, a2, a3, a4, a5), true;
        }
        for (i = 1, args = new Array(len - 1); i < len; i++) {
          args[i - 1] = arguments[i];
        }
        listeners.fn.apply(listeners.context, args);
      } else {
        var length3 = listeners.length, j;
        for (i = 0; i < length3; i++) {
          if (listeners[i].once)
            this.removeListener(event, listeners[i].fn, void 0, true);
          switch (len) {
            case 1:
              listeners[i].fn.call(listeners[i].context);
              break;
            case 2:
              listeners[i].fn.call(listeners[i].context, a1);
              break;
            case 3:
              listeners[i].fn.call(listeners[i].context, a1, a2);
              break;
            case 4:
              listeners[i].fn.call(listeners[i].context, a1, a2, a3);
              break;
            default:
              if (!args)
                for (j = 1, args = new Array(len - 1); j < len; j++) {
                  args[j - 1] = arguments[j];
                }
              listeners[i].fn.apply(listeners[i].context, args);
          }
        }
      }
      return true;
    };
    EventEmitter2.prototype.on = function on(event, fn, context) {
      return addListener(this, event, fn, context, false);
    };
    EventEmitter2.prototype.once = function once(event, fn, context) {
      return addListener(this, event, fn, context, true);
    };
    EventEmitter2.prototype.removeListener = function removeListener(event, fn, context, once) {
      var evt = prefix ? prefix + event : event;
      if (!this._events[evt])
        return this;
      if (!fn) {
        clearEvent(this, evt);
        return this;
      }
      var listeners = this._events[evt];
      if (listeners.fn) {
        if (listeners.fn === fn && (!once || listeners.once) && (!context || listeners.context === context)) {
          clearEvent(this, evt);
        }
      } else {
        for (var i = 0, events = [], length3 = listeners.length; i < length3; i++) {
          if (listeners[i].fn !== fn || once && !listeners[i].once || context && listeners[i].context !== context) {
            events.push(listeners[i]);
          }
        }
        if (events.length)
          this._events[evt] = events.length === 1 ? events[0] : events;
        else
          clearEvent(this, evt);
      }
      return this;
    };
    EventEmitter2.prototype.removeAllListeners = function removeAllListeners(event) {
      var evt;
      if (event) {
        evt = prefix ? prefix + event : event;
        if (this._events[evt])
          clearEvent(this, evt);
      } else {
        this._events = new Events();
        this._eventsCount = 0;
      }
      return this;
    };
    EventEmitter2.prototype.off = EventEmitter2.prototype.removeListener;
    EventEmitter2.prototype.addListener = EventEmitter2.prototype.on;
    EventEmitter2.prefixed = prefix;
    EventEmitter2.EventEmitter = EventEmitter2;
    if ("undefined" !== typeof module) {
      module.exports = EventEmitter2;
    }
  }
});

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

// node_modules/@ipld/car/src/buffer-reader.js
import fs from "fs";

// node_modules/cborg/lib/is.js
var typeofs = [
  "string",
  "number",
  "bigint",
  "symbol"
];
var objectTypeNames = [
  "Function",
  "Generator",
  "AsyncGenerator",
  "GeneratorFunction",
  "AsyncGeneratorFunction",
  "AsyncFunction",
  "Observable",
  "Array",
  "Buffer",
  "Object",
  "RegExp",
  "Date",
  "Error",
  "Map",
  "Set",
  "WeakMap",
  "WeakSet",
  "ArrayBuffer",
  "SharedArrayBuffer",
  "DataView",
  "Promise",
  "URL",
  "HTMLElement",
  "Int8Array",
  "Uint8Array",
  "Uint8ClampedArray",
  "Int16Array",
  "Uint16Array",
  "Int32Array",
  "Uint32Array",
  "Float32Array",
  "Float64Array",
  "BigInt64Array",
  "BigUint64Array"
];
function is(value) {
  if (value === null) {
    return "null";
  }
  if (value === void 0) {
    return "undefined";
  }
  if (value === true || value === false) {
    return "boolean";
  }
  const typeOf = typeof value;
  if (typeofs.includes(typeOf)) {
    return typeOf;
  }
  if (typeOf === "function") {
    return "Function";
  }
  if (Array.isArray(value)) {
    return "Array";
  }
  if (isBuffer(value)) {
    return "Buffer";
  }
  const objectType = getObjectType(value);
  if (objectType) {
    return objectType;
  }
  return "Object";
}
function isBuffer(value) {
  return value && value.constructor && value.constructor.isBuffer && value.constructor.isBuffer.call(null, value);
}
function getObjectType(value) {
  const objectTypeName = Object.prototype.toString.call(value).slice(8, -1);
  if (objectTypeNames.includes(objectTypeName)) {
    return objectTypeName;
  }
  return void 0;
}

// node_modules/cborg/lib/token.js
var Type = class {
  /**
   * @param {number} major
   * @param {string} name
   * @param {boolean} terminal
   */
  constructor(major, name, terminal) {
    this.major = major;
    this.majorEncoded = major << 5;
    this.name = name;
    this.terminal = terminal;
  }
  /* c8 ignore next 3 */
  toString() {
    return `Type[${this.major}].${this.name}`;
  }
  /**
   * @param {Type} typ
   * @returns {number}
   */
  compare(typ) {
    return this.major < typ.major ? -1 : this.major > typ.major ? 1 : 0;
  }
};
Type.uint = new Type(0, "uint", true);
Type.negint = new Type(1, "negint", true);
Type.bytes = new Type(2, "bytes", true);
Type.string = new Type(3, "string", true);
Type.array = new Type(4, "array", false);
Type.map = new Type(5, "map", false);
Type.tag = new Type(6, "tag", false);
Type.float = new Type(7, "float", true);
Type.false = new Type(7, "false", true);
Type.true = new Type(7, "true", true);
Type.null = new Type(7, "null", true);
Type.undefined = new Type(7, "undefined", true);
Type.break = new Type(7, "break", true);
var Token = class {
  /**
   * @param {Type} type
   * @param {any} [value]
   * @param {number} [encodedLength]
   */
  constructor(type, value, encodedLength) {
    this.type = type;
    this.value = value;
    this.encodedLength = encodedLength;
    this.encodedBytes = void 0;
    this.byteValue = void 0;
  }
  /* c8 ignore next 3 */
  toString() {
    return `Token[${this.type}].${this.value}`;
  }
};

// node_modules/cborg/lib/byte-utils.js
var useBuffer = globalThis.process && // @ts-ignore
!globalThis.process.browser && // @ts-ignore
globalThis.Buffer && // @ts-ignore
typeof globalThis.Buffer.isBuffer === "function";
var textDecoder = new TextDecoder();
var textEncoder = new TextEncoder();
function isBuffer2(buf2) {
  return useBuffer && globalThis.Buffer.isBuffer(buf2);
}
function asU8A(buf2) {
  if (!(buf2 instanceof Uint8Array)) {
    return Uint8Array.from(buf2);
  }
  return isBuffer2(buf2) ? new Uint8Array(buf2.buffer, buf2.byteOffset, buf2.byteLength) : buf2;
}
var toString = useBuffer ? (
  // eslint-disable-line operator-linebreak
  /**
   * @param {Uint8Array} bytes
   * @param {number} start
   * @param {number} end
   */
  (bytes, start, end) => {
    return end - start > 64 ? (
      // eslint-disable-line operator-linebreak
      // @ts-ignore
      globalThis.Buffer.from(bytes.subarray(start, end)).toString("utf8")
    ) : utf8Slice(bytes, start, end);
  }
) : (
  // eslint-disable-line operator-linebreak
  /**
   * @param {Uint8Array} bytes
   * @param {number} start
   * @param {number} end
   */
  (bytes, start, end) => {
    return end - start > 64 ? textDecoder.decode(bytes.subarray(start, end)) : utf8Slice(bytes, start, end);
  }
);
var fromString = useBuffer ? (
  // eslint-disable-line operator-linebreak
  /**
   * @param {string} string
   */
  (string) => {
    return string.length > 64 ? (
      // eslint-disable-line operator-linebreak
      // @ts-ignore
      globalThis.Buffer.from(string)
    ) : utf8ToBytes(string);
  }
) : (
  // eslint-disable-line operator-linebreak
  /**
   * @param {string} string
   */
  (string) => {
    return string.length > 64 ? textEncoder.encode(string) : utf8ToBytes(string);
  }
);
var fromArray = (arr) => {
  return Uint8Array.from(arr);
};
var slice = useBuffer ? (
  // eslint-disable-line operator-linebreak
  /**
   * @param {Uint8Array} bytes
   * @param {number} start
   * @param {number} end
   */
  (bytes, start, end) => {
    if (isBuffer2(bytes)) {
      return new Uint8Array(bytes.subarray(start, end));
    }
    return bytes.slice(start, end);
  }
) : (
  // eslint-disable-line operator-linebreak
  /**
   * @param {Uint8Array} bytes
   * @param {number} start
   * @param {number} end
   */
  (bytes, start, end) => {
    return bytes.slice(start, end);
  }
);
var concat = useBuffer ? (
  // eslint-disable-line operator-linebreak
  /**
   * @param {Uint8Array[]} chunks
   * @param {number} length
   * @returns {Uint8Array}
   */
  (chunks, length3) => {
    chunks = chunks.map((c) => c instanceof Uint8Array ? c : (
      // eslint-disable-line operator-linebreak
      // @ts-ignore
      globalThis.Buffer.from(c)
    ));
    return asU8A(globalThis.Buffer.concat(chunks, length3));
  }
) : (
  // eslint-disable-line operator-linebreak
  /**
   * @param {Uint8Array[]} chunks
   * @param {number} length
   * @returns {Uint8Array}
   */
  (chunks, length3) => {
    const out = new Uint8Array(length3);
    let off = 0;
    for (let b of chunks) {
      if (off + b.length > out.length) {
        b = b.subarray(0, out.length - off);
      }
      out.set(b, off);
      off += b.length;
    }
    return out;
  }
);
var alloc = useBuffer ? (
  // eslint-disable-line operator-linebreak
  /**
   * @param {number} size
   * @returns {Uint8Array}
   */
  (size) => {
    return globalThis.Buffer.allocUnsafe(size);
  }
) : (
  // eslint-disable-line operator-linebreak
  /**
   * @param {number} size
   * @returns {Uint8Array}
   */
  (size) => {
    return new Uint8Array(size);
  }
);
function compare(b1, b2) {
  if (isBuffer2(b1) && isBuffer2(b2)) {
    return b1.compare(b2);
  }
  for (let i = 0; i < b1.length; i++) {
    if (b1[i] === b2[i]) {
      continue;
    }
    return b1[i] < b2[i] ? -1 : 1;
  }
  return 0;
}
function utf8ToBytes(str) {
  const out = [];
  let p = 0;
  for (let i = 0; i < str.length; i++) {
    let c = str.charCodeAt(i);
    if (c < 128) {
      out[p++] = c;
    } else if (c < 2048) {
      out[p++] = c >> 6 | 192;
      out[p++] = c & 63 | 128;
    } else if ((c & 64512) === 55296 && i + 1 < str.length && (str.charCodeAt(i + 1) & 64512) === 56320) {
      c = 65536 + ((c & 1023) << 10) + (str.charCodeAt(++i) & 1023);
      out[p++] = c >> 18 | 240;
      out[p++] = c >> 12 & 63 | 128;
      out[p++] = c >> 6 & 63 | 128;
      out[p++] = c & 63 | 128;
    } else {
      out[p++] = c >> 12 | 224;
      out[p++] = c >> 6 & 63 | 128;
      out[p++] = c & 63 | 128;
    }
  }
  return out;
}
function utf8Slice(buf2, offset, end) {
  const res = [];
  while (offset < end) {
    const firstByte = buf2[offset];
    let codePoint = null;
    let bytesPerSequence = firstByte > 239 ? 4 : firstByte > 223 ? 3 : firstByte > 191 ? 2 : 1;
    if (offset + bytesPerSequence <= end) {
      let secondByte, thirdByte, fourthByte, tempCodePoint;
      switch (bytesPerSequence) {
        case 1:
          if (firstByte < 128) {
            codePoint = firstByte;
          }
          break;
        case 2:
          secondByte = buf2[offset + 1];
          if ((secondByte & 192) === 128) {
            tempCodePoint = (firstByte & 31) << 6 | secondByte & 63;
            if (tempCodePoint > 127) {
              codePoint = tempCodePoint;
            }
          }
          break;
        case 3:
          secondByte = buf2[offset + 1];
          thirdByte = buf2[offset + 2];
          if ((secondByte & 192) === 128 && (thirdByte & 192) === 128) {
            tempCodePoint = (firstByte & 15) << 12 | (secondByte & 63) << 6 | thirdByte & 63;
            if (tempCodePoint > 2047 && (tempCodePoint < 55296 || tempCodePoint > 57343)) {
              codePoint = tempCodePoint;
            }
          }
          break;
        case 4:
          secondByte = buf2[offset + 1];
          thirdByte = buf2[offset + 2];
          fourthByte = buf2[offset + 3];
          if ((secondByte & 192) === 128 && (thirdByte & 192) === 128 && (fourthByte & 192) === 128) {
            tempCodePoint = (firstByte & 15) << 18 | (secondByte & 63) << 12 | (thirdByte & 63) << 6 | fourthByte & 63;
            if (tempCodePoint > 65535 && tempCodePoint < 1114112) {
              codePoint = tempCodePoint;
            }
          }
      }
    }
    if (codePoint === null) {
      codePoint = 65533;
      bytesPerSequence = 1;
    } else if (codePoint > 65535) {
      codePoint -= 65536;
      res.push(codePoint >>> 10 & 1023 | 55296);
      codePoint = 56320 | codePoint & 1023;
    }
    res.push(codePoint);
    offset += bytesPerSequence;
  }
  return decodeCodePointsArray(res);
}
var MAX_ARGUMENTS_LENGTH = 4096;
function decodeCodePointsArray(codePoints) {
  const len = codePoints.length;
  if (len <= MAX_ARGUMENTS_LENGTH) {
    return String.fromCharCode.apply(String, codePoints);
  }
  let res = "";
  let i = 0;
  while (i < len) {
    res += String.fromCharCode.apply(
      String,
      codePoints.slice(i, i += MAX_ARGUMENTS_LENGTH)
    );
  }
  return res;
}

// node_modules/cborg/lib/bl.js
var defaultChunkSize = 256;
var Bl = class {
  /**
   * @param {number} [chunkSize]
   */
  constructor(chunkSize = defaultChunkSize) {
    this.chunkSize = chunkSize;
    this.cursor = 0;
    this.maxCursor = -1;
    this.chunks = [];
    this._initReuseChunk = null;
  }
  reset() {
    this.cursor = 0;
    this.maxCursor = -1;
    if (this.chunks.length) {
      this.chunks = [];
    }
    if (this._initReuseChunk !== null) {
      this.chunks.push(this._initReuseChunk);
      this.maxCursor = this._initReuseChunk.length - 1;
    }
  }
  /**
   * @param {Uint8Array|number[]} bytes
   */
  push(bytes) {
    let topChunk = this.chunks[this.chunks.length - 1];
    const newMax = this.cursor + bytes.length;
    if (newMax <= this.maxCursor + 1) {
      const chunkPos = topChunk.length - (this.maxCursor - this.cursor) - 1;
      topChunk.set(bytes, chunkPos);
    } else {
      if (topChunk) {
        const chunkPos = topChunk.length - (this.maxCursor - this.cursor) - 1;
        if (chunkPos < topChunk.length) {
          this.chunks[this.chunks.length - 1] = topChunk.subarray(0, chunkPos);
          this.maxCursor = this.cursor - 1;
        }
      }
      if (bytes.length < 64 && bytes.length < this.chunkSize) {
        topChunk = alloc(this.chunkSize);
        this.chunks.push(topChunk);
        this.maxCursor += topChunk.length;
        if (this._initReuseChunk === null) {
          this._initReuseChunk = topChunk;
        }
        topChunk.set(bytes, 0);
      } else {
        this.chunks.push(bytes);
        this.maxCursor += bytes.length;
      }
    }
    this.cursor += bytes.length;
  }
  /**
   * @param {boolean} [reset]
   * @returns {Uint8Array}
   */
  toBytes(reset = false) {
    let byts;
    if (this.chunks.length === 1) {
      const chunk = this.chunks[0];
      if (reset && this.cursor > chunk.length / 2) {
        byts = this.cursor === chunk.length ? chunk : chunk.subarray(0, this.cursor);
        this._initReuseChunk = null;
        this.chunks = [];
      } else {
        byts = slice(chunk, 0, this.cursor);
      }
    } else {
      byts = concat(this.chunks, this.cursor);
    }
    if (reset) {
      this.reset();
    }
    return byts;
  }
};

// node_modules/cborg/lib/common.js
var decodeErrPrefix = "CBOR decode error:";
var encodeErrPrefix = "CBOR encode error:";
var uintMinorPrefixBytes = [];
uintMinorPrefixBytes[23] = 1;
uintMinorPrefixBytes[24] = 2;
uintMinorPrefixBytes[25] = 3;
uintMinorPrefixBytes[26] = 5;
uintMinorPrefixBytes[27] = 9;
function assertEnoughData(data, pos, need) {
  if (data.length - pos < need) {
    throw new Error(`${decodeErrPrefix} not enough data for type`);
  }
}

// node_modules/cborg/lib/0uint.js
var uintBoundaries = [24, 256, 65536, 4294967296, BigInt("18446744073709551616")];
function readUint8(data, offset, options) {
  assertEnoughData(data, offset, 1);
  const value = data[offset];
  if (options.strict === true && value < uintBoundaries[0]) {
    throw new Error(`${decodeErrPrefix} integer encoded in more bytes than necessary (strict decode)`);
  }
  return value;
}
function readUint16(data, offset, options) {
  assertEnoughData(data, offset, 2);
  const value = data[offset] << 8 | data[offset + 1];
  if (options.strict === true && value < uintBoundaries[1]) {
    throw new Error(`${decodeErrPrefix} integer encoded in more bytes than necessary (strict decode)`);
  }
  return value;
}
function readUint32(data, offset, options) {
  assertEnoughData(data, offset, 4);
  const value = data[offset] * 16777216 + (data[offset + 1] << 16) + (data[offset + 2] << 8) + data[offset + 3];
  if (options.strict === true && value < uintBoundaries[2]) {
    throw new Error(`${decodeErrPrefix} integer encoded in more bytes than necessary (strict decode)`);
  }
  return value;
}
function readUint64(data, offset, options) {
  assertEnoughData(data, offset, 8);
  const hi = data[offset] * 16777216 + (data[offset + 1] << 16) + (data[offset + 2] << 8) + data[offset + 3];
  const lo = data[offset + 4] * 16777216 + (data[offset + 5] << 16) + (data[offset + 6] << 8) + data[offset + 7];
  const value = (BigInt(hi) << BigInt(32)) + BigInt(lo);
  if (options.strict === true && value < uintBoundaries[3]) {
    throw new Error(`${decodeErrPrefix} integer encoded in more bytes than necessary (strict decode)`);
  }
  if (value <= Number.MAX_SAFE_INTEGER) {
    return Number(value);
  }
  if (options.allowBigInt === true) {
    return value;
  }
  throw new Error(`${decodeErrPrefix} integers outside of the safe integer range are not supported`);
}
function decodeUint8(data, pos, _minor, options) {
  return new Token(Type.uint, readUint8(data, pos + 1, options), 2);
}
function decodeUint16(data, pos, _minor, options) {
  return new Token(Type.uint, readUint16(data, pos + 1, options), 3);
}
function decodeUint32(data, pos, _minor, options) {
  return new Token(Type.uint, readUint32(data, pos + 1, options), 5);
}
function decodeUint64(data, pos, _minor, options) {
  return new Token(Type.uint, readUint64(data, pos + 1, options), 9);
}
function encodeUint(buf2, token) {
  return encodeUintValue(buf2, 0, token.value);
}
function encodeUintValue(buf2, major, uint) {
  if (uint < uintBoundaries[0]) {
    const nuint = Number(uint);
    buf2.push([major | nuint]);
  } else if (uint < uintBoundaries[1]) {
    const nuint = Number(uint);
    buf2.push([major | 24, nuint]);
  } else if (uint < uintBoundaries[2]) {
    const nuint = Number(uint);
    buf2.push([major | 25, nuint >>> 8, nuint & 255]);
  } else if (uint < uintBoundaries[3]) {
    const nuint = Number(uint);
    buf2.push([major | 26, nuint >>> 24 & 255, nuint >>> 16 & 255, nuint >>> 8 & 255, nuint & 255]);
  } else {
    const buint = BigInt(uint);
    if (buint < uintBoundaries[4]) {
      const set = [major | 27, 0, 0, 0, 0, 0, 0, 0];
      let lo = Number(buint & BigInt(4294967295));
      let hi = Number(buint >> BigInt(32) & BigInt(4294967295));
      set[8] = lo & 255;
      lo = lo >> 8;
      set[7] = lo & 255;
      lo = lo >> 8;
      set[6] = lo & 255;
      lo = lo >> 8;
      set[5] = lo & 255;
      set[4] = hi & 255;
      hi = hi >> 8;
      set[3] = hi & 255;
      hi = hi >> 8;
      set[2] = hi & 255;
      hi = hi >> 8;
      set[1] = hi & 255;
      buf2.push(set);
    } else {
      throw new Error(`${decodeErrPrefix} encountered BigInt larger than allowable range`);
    }
  }
}
encodeUint.encodedSize = function encodedSize(token) {
  return encodeUintValue.encodedSize(token.value);
};
encodeUintValue.encodedSize = function encodedSize2(uint) {
  if (uint < uintBoundaries[0]) {
    return 1;
  }
  if (uint < uintBoundaries[1]) {
    return 2;
  }
  if (uint < uintBoundaries[2]) {
    return 3;
  }
  if (uint < uintBoundaries[3]) {
    return 5;
  }
  return 9;
};
encodeUint.compareTokens = function compareTokens(tok1, tok2) {
  return tok1.value < tok2.value ? -1 : tok1.value > tok2.value ? 1 : (
    /* c8 ignore next */
    0
  );
};

// node_modules/cborg/lib/1negint.js
function decodeNegint8(data, pos, _minor, options) {
  return new Token(Type.negint, -1 - readUint8(data, pos + 1, options), 2);
}
function decodeNegint16(data, pos, _minor, options) {
  return new Token(Type.negint, -1 - readUint16(data, pos + 1, options), 3);
}
function decodeNegint32(data, pos, _minor, options) {
  return new Token(Type.negint, -1 - readUint32(data, pos + 1, options), 5);
}
var neg1b = BigInt(-1);
var pos1b = BigInt(1);
function decodeNegint64(data, pos, _minor, options) {
  const int = readUint64(data, pos + 1, options);
  if (typeof int !== "bigint") {
    const value = -1 - int;
    if (value >= Number.MIN_SAFE_INTEGER) {
      return new Token(Type.negint, value, 9);
    }
  }
  if (options.allowBigInt !== true) {
    throw new Error(`${decodeErrPrefix} integers outside of the safe integer range are not supported`);
  }
  return new Token(Type.negint, neg1b - BigInt(int), 9);
}
function encodeNegint(buf2, token) {
  const negint = token.value;
  const unsigned = typeof negint === "bigint" ? negint * neg1b - pos1b : negint * -1 - 1;
  encodeUintValue(buf2, token.type.majorEncoded, unsigned);
}
encodeNegint.encodedSize = function encodedSize3(token) {
  const negint = token.value;
  const unsigned = typeof negint === "bigint" ? negint * neg1b - pos1b : negint * -1 - 1;
  if (unsigned < uintBoundaries[0]) {
    return 1;
  }
  if (unsigned < uintBoundaries[1]) {
    return 2;
  }
  if (unsigned < uintBoundaries[2]) {
    return 3;
  }
  if (unsigned < uintBoundaries[3]) {
    return 5;
  }
  return 9;
};
encodeNegint.compareTokens = function compareTokens2(tok1, tok2) {
  return tok1.value < tok2.value ? 1 : tok1.value > tok2.value ? -1 : (
    /* c8 ignore next */
    0
  );
};

// node_modules/cborg/lib/2bytes.js
function toToken(data, pos, prefix, length3) {
  assertEnoughData(data, pos, prefix + length3);
  const buf2 = slice(data, pos + prefix, pos + prefix + length3);
  return new Token(Type.bytes, buf2, prefix + length3);
}
function decodeBytesCompact(data, pos, minor, _options) {
  return toToken(data, pos, 1, minor);
}
function decodeBytes8(data, pos, _minor, options) {
  return toToken(data, pos, 2, readUint8(data, pos + 1, options));
}
function decodeBytes16(data, pos, _minor, options) {
  return toToken(data, pos, 3, readUint16(data, pos + 1, options));
}
function decodeBytes32(data, pos, _minor, options) {
  return toToken(data, pos, 5, readUint32(data, pos + 1, options));
}
function decodeBytes64(data, pos, _minor, options) {
  const l = readUint64(data, pos + 1, options);
  if (typeof l === "bigint") {
    throw new Error(`${decodeErrPrefix} 64-bit integer bytes lengths not supported`);
  }
  return toToken(data, pos, 9, l);
}
function tokenBytes(token) {
  if (token.encodedBytes === void 0) {
    token.encodedBytes = token.type === Type.string ? fromString(token.value) : token.value;
  }
  return token.encodedBytes;
}
function encodeBytes(buf2, token) {
  const bytes = tokenBytes(token);
  encodeUintValue(buf2, token.type.majorEncoded, bytes.length);
  buf2.push(bytes);
}
encodeBytes.encodedSize = function encodedSize4(token) {
  const bytes = tokenBytes(token);
  return encodeUintValue.encodedSize(bytes.length) + bytes.length;
};
encodeBytes.compareTokens = function compareTokens3(tok1, tok2) {
  return compareBytes(tokenBytes(tok1), tokenBytes(tok2));
};
function compareBytes(b1, b2) {
  return b1.length < b2.length ? -1 : b1.length > b2.length ? 1 : compare(b1, b2);
}

// node_modules/cborg/lib/3string.js
function toToken2(data, pos, prefix, length3, options) {
  const totLength = prefix + length3;
  assertEnoughData(data, pos, totLength);
  const tok = new Token(Type.string, toString(data, pos + prefix, pos + totLength), totLength);
  if (options.retainStringBytes === true) {
    tok.byteValue = slice(data, pos + prefix, pos + totLength);
  }
  return tok;
}
function decodeStringCompact(data, pos, minor, options) {
  return toToken2(data, pos, 1, minor, options);
}
function decodeString8(data, pos, _minor, options) {
  return toToken2(data, pos, 2, readUint8(data, pos + 1, options), options);
}
function decodeString16(data, pos, _minor, options) {
  return toToken2(data, pos, 3, readUint16(data, pos + 1, options), options);
}
function decodeString32(data, pos, _minor, options) {
  return toToken2(data, pos, 5, readUint32(data, pos + 1, options), options);
}
function decodeString64(data, pos, _minor, options) {
  const l = readUint64(data, pos + 1, options);
  if (typeof l === "bigint") {
    throw new Error(`${decodeErrPrefix} 64-bit integer string lengths not supported`);
  }
  return toToken2(data, pos, 9, l, options);
}
var encodeString = encodeBytes;

// node_modules/cborg/lib/4array.js
function toToken3(_data, _pos, prefix, length3) {
  return new Token(Type.array, length3, prefix);
}
function decodeArrayCompact(data, pos, minor, _options) {
  return toToken3(data, pos, 1, minor);
}
function decodeArray8(data, pos, _minor, options) {
  return toToken3(data, pos, 2, readUint8(data, pos + 1, options));
}
function decodeArray16(data, pos, _minor, options) {
  return toToken3(data, pos, 3, readUint16(data, pos + 1, options));
}
function decodeArray32(data, pos, _minor, options) {
  return toToken3(data, pos, 5, readUint32(data, pos + 1, options));
}
function decodeArray64(data, pos, _minor, options) {
  const l = readUint64(data, pos + 1, options);
  if (typeof l === "bigint") {
    throw new Error(`${decodeErrPrefix} 64-bit integer array lengths not supported`);
  }
  return toToken3(data, pos, 9, l);
}
function decodeArrayIndefinite(data, pos, _minor, options) {
  if (options.allowIndefinite === false) {
    throw new Error(`${decodeErrPrefix} indefinite length items not allowed`);
  }
  return toToken3(data, pos, 1, Infinity);
}
function encodeArray(buf2, token) {
  encodeUintValue(buf2, Type.array.majorEncoded, token.value);
}
encodeArray.compareTokens = encodeUint.compareTokens;
encodeArray.encodedSize = function encodedSize5(token) {
  return encodeUintValue.encodedSize(token.value);
};

// node_modules/cborg/lib/5map.js
function toToken4(_data, _pos, prefix, length3) {
  return new Token(Type.map, length3, prefix);
}
function decodeMapCompact(data, pos, minor, _options) {
  return toToken4(data, pos, 1, minor);
}
function decodeMap8(data, pos, _minor, options) {
  return toToken4(data, pos, 2, readUint8(data, pos + 1, options));
}
function decodeMap16(data, pos, _minor, options) {
  return toToken4(data, pos, 3, readUint16(data, pos + 1, options));
}
function decodeMap32(data, pos, _minor, options) {
  return toToken4(data, pos, 5, readUint32(data, pos + 1, options));
}
function decodeMap64(data, pos, _minor, options) {
  const l = readUint64(data, pos + 1, options);
  if (typeof l === "bigint") {
    throw new Error(`${decodeErrPrefix} 64-bit integer map lengths not supported`);
  }
  return toToken4(data, pos, 9, l);
}
function decodeMapIndefinite(data, pos, _minor, options) {
  if (options.allowIndefinite === false) {
    throw new Error(`${decodeErrPrefix} indefinite length items not allowed`);
  }
  return toToken4(data, pos, 1, Infinity);
}
function encodeMap(buf2, token) {
  encodeUintValue(buf2, Type.map.majorEncoded, token.value);
}
encodeMap.compareTokens = encodeUint.compareTokens;
encodeMap.encodedSize = function encodedSize6(token) {
  return encodeUintValue.encodedSize(token.value);
};

// node_modules/cborg/lib/6tag.js
function decodeTagCompact(_data, _pos, minor, _options) {
  return new Token(Type.tag, minor, 1);
}
function decodeTag8(data, pos, _minor, options) {
  return new Token(Type.tag, readUint8(data, pos + 1, options), 2);
}
function decodeTag16(data, pos, _minor, options) {
  return new Token(Type.tag, readUint16(data, pos + 1, options), 3);
}
function decodeTag32(data, pos, _minor, options) {
  return new Token(Type.tag, readUint32(data, pos + 1, options), 5);
}
function decodeTag64(data, pos, _minor, options) {
  return new Token(Type.tag, readUint64(data, pos + 1, options), 9);
}
function encodeTag(buf2, token) {
  encodeUintValue(buf2, Type.tag.majorEncoded, token.value);
}
encodeTag.compareTokens = encodeUint.compareTokens;
encodeTag.encodedSize = function encodedSize7(token) {
  return encodeUintValue.encodedSize(token.value);
};

// node_modules/cborg/lib/7float.js
var MINOR_FALSE = 20;
var MINOR_TRUE = 21;
var MINOR_NULL = 22;
var MINOR_UNDEFINED = 23;
function decodeUndefined(_data, _pos, _minor, options) {
  if (options.allowUndefined === false) {
    throw new Error(`${decodeErrPrefix} undefined values are not supported`);
  } else if (options.coerceUndefinedToNull === true) {
    return new Token(Type.null, null, 1);
  }
  return new Token(Type.undefined, void 0, 1);
}
function decodeBreak(_data, _pos, _minor, options) {
  if (options.allowIndefinite === false) {
    throw new Error(`${decodeErrPrefix} indefinite length items not allowed`);
  }
  return new Token(Type.break, void 0, 1);
}
function createToken(value, bytes, options) {
  if (options) {
    if (options.allowNaN === false && Number.isNaN(value)) {
      throw new Error(`${decodeErrPrefix} NaN values are not supported`);
    }
    if (options.allowInfinity === false && (value === Infinity || value === -Infinity)) {
      throw new Error(`${decodeErrPrefix} Infinity values are not supported`);
    }
  }
  return new Token(Type.float, value, bytes);
}
function decodeFloat16(data, pos, _minor, options) {
  return createToken(readFloat16(data, pos + 1), 3, options);
}
function decodeFloat32(data, pos, _minor, options) {
  return createToken(readFloat32(data, pos + 1), 5, options);
}
function decodeFloat64(data, pos, _minor, options) {
  return createToken(readFloat64(data, pos + 1), 9, options);
}
function encodeFloat(buf2, token, options) {
  const float = token.value;
  if (float === false) {
    buf2.push([Type.float.majorEncoded | MINOR_FALSE]);
  } else if (float === true) {
    buf2.push([Type.float.majorEncoded | MINOR_TRUE]);
  } else if (float === null) {
    buf2.push([Type.float.majorEncoded | MINOR_NULL]);
  } else if (float === void 0) {
    buf2.push([Type.float.majorEncoded | MINOR_UNDEFINED]);
  } else {
    let decoded;
    let success = false;
    if (!options || options.float64 !== true) {
      encodeFloat16(float);
      decoded = readFloat16(ui8a, 1);
      if (float === decoded || Number.isNaN(float)) {
        ui8a[0] = 249;
        buf2.push(ui8a.slice(0, 3));
        success = true;
      } else {
        encodeFloat32(float);
        decoded = readFloat32(ui8a, 1);
        if (float === decoded) {
          ui8a[0] = 250;
          buf2.push(ui8a.slice(0, 5));
          success = true;
        }
      }
    }
    if (!success) {
      encodeFloat64(float);
      decoded = readFloat64(ui8a, 1);
      ui8a[0] = 251;
      buf2.push(ui8a.slice(0, 9));
    }
  }
}
encodeFloat.encodedSize = function encodedSize8(token, options) {
  const float = token.value;
  if (float === false || float === true || float === null || float === void 0) {
    return 1;
  }
  if (!options || options.float64 !== true) {
    encodeFloat16(float);
    let decoded = readFloat16(ui8a, 1);
    if (float === decoded || Number.isNaN(float)) {
      return 3;
    }
    encodeFloat32(float);
    decoded = readFloat32(ui8a, 1);
    if (float === decoded) {
      return 5;
    }
  }
  return 9;
};
var buffer = new ArrayBuffer(9);
var dataView = new DataView(buffer, 1);
var ui8a = new Uint8Array(buffer, 0);
function encodeFloat16(inp) {
  if (inp === Infinity) {
    dataView.setUint16(0, 31744, false);
  } else if (inp === -Infinity) {
    dataView.setUint16(0, 64512, false);
  } else if (Number.isNaN(inp)) {
    dataView.setUint16(0, 32256, false);
  } else {
    dataView.setFloat32(0, inp);
    const valu32 = dataView.getUint32(0);
    const exponent = (valu32 & 2139095040) >> 23;
    const mantissa = valu32 & 8388607;
    if (exponent === 255) {
      dataView.setUint16(0, 31744, false);
    } else if (exponent === 0) {
      dataView.setUint16(0, (inp & 2147483648) >> 16 | mantissa >> 13, false);
    } else {
      const logicalExponent = exponent - 127;
      if (logicalExponent < -24) {
        dataView.setUint16(0, 0);
      } else if (logicalExponent < -14) {
        dataView.setUint16(0, (valu32 & 2147483648) >> 16 | /* sign bit */
        1 << 24 + logicalExponent, false);
      } else {
        dataView.setUint16(0, (valu32 & 2147483648) >> 16 | logicalExponent + 15 << 10 | mantissa >> 13, false);
      }
    }
  }
}
function readFloat16(ui8a2, pos) {
  if (ui8a2.length - pos < 2) {
    throw new Error(`${decodeErrPrefix} not enough data for float16`);
  }
  const half = (ui8a2[pos] << 8) + ui8a2[pos + 1];
  if (half === 31744) {
    return Infinity;
  }
  if (half === 64512) {
    return -Infinity;
  }
  if (half === 32256) {
    return NaN;
  }
  const exp = half >> 10 & 31;
  const mant = half & 1023;
  let val;
  if (exp === 0) {
    val = mant * 2 ** -24;
  } else if (exp !== 31) {
    val = (mant + 1024) * 2 ** (exp - 25);
  } else {
    val = mant === 0 ? Infinity : NaN;
  }
  return half & 32768 ? -val : val;
}
function encodeFloat32(inp) {
  dataView.setFloat32(0, inp, false);
}
function readFloat32(ui8a2, pos) {
  if (ui8a2.length - pos < 4) {
    throw new Error(`${decodeErrPrefix} not enough data for float32`);
  }
  const offset = (ui8a2.byteOffset || 0) + pos;
  return new DataView(ui8a2.buffer, offset, 4).getFloat32(0, false);
}
function encodeFloat64(inp) {
  dataView.setFloat64(0, inp, false);
}
function readFloat64(ui8a2, pos) {
  if (ui8a2.length - pos < 8) {
    throw new Error(`${decodeErrPrefix} not enough data for float64`);
  }
  const offset = (ui8a2.byteOffset || 0) + pos;
  return new DataView(ui8a2.buffer, offset, 8).getFloat64(0, false);
}
encodeFloat.compareTokens = encodeUint.compareTokens;

// node_modules/cborg/lib/jump.js
function invalidMinor(data, pos, minor) {
  throw new Error(`${decodeErrPrefix} encountered invalid minor (${minor}) for major ${data[pos] >>> 5}`);
}
function errorer(msg) {
  return () => {
    throw new Error(`${decodeErrPrefix} ${msg}`);
  };
}
var jump = [];
for (let i = 0; i <= 23; i++) {
  jump[i] = invalidMinor;
}
jump[24] = decodeUint8;
jump[25] = decodeUint16;
jump[26] = decodeUint32;
jump[27] = decodeUint64;
jump[28] = invalidMinor;
jump[29] = invalidMinor;
jump[30] = invalidMinor;
jump[31] = invalidMinor;
for (let i = 32; i <= 55; i++) {
  jump[i] = invalidMinor;
}
jump[56] = decodeNegint8;
jump[57] = decodeNegint16;
jump[58] = decodeNegint32;
jump[59] = decodeNegint64;
jump[60] = invalidMinor;
jump[61] = invalidMinor;
jump[62] = invalidMinor;
jump[63] = invalidMinor;
for (let i = 64; i <= 87; i++) {
  jump[i] = decodeBytesCompact;
}
jump[88] = decodeBytes8;
jump[89] = decodeBytes16;
jump[90] = decodeBytes32;
jump[91] = decodeBytes64;
jump[92] = invalidMinor;
jump[93] = invalidMinor;
jump[94] = invalidMinor;
jump[95] = errorer("indefinite length bytes/strings are not supported");
for (let i = 96; i <= 119; i++) {
  jump[i] = decodeStringCompact;
}
jump[120] = decodeString8;
jump[121] = decodeString16;
jump[122] = decodeString32;
jump[123] = decodeString64;
jump[124] = invalidMinor;
jump[125] = invalidMinor;
jump[126] = invalidMinor;
jump[127] = errorer("indefinite length bytes/strings are not supported");
for (let i = 128; i <= 151; i++) {
  jump[i] = decodeArrayCompact;
}
jump[152] = decodeArray8;
jump[153] = decodeArray16;
jump[154] = decodeArray32;
jump[155] = decodeArray64;
jump[156] = invalidMinor;
jump[157] = invalidMinor;
jump[158] = invalidMinor;
jump[159] = decodeArrayIndefinite;
for (let i = 160; i <= 183; i++) {
  jump[i] = decodeMapCompact;
}
jump[184] = decodeMap8;
jump[185] = decodeMap16;
jump[186] = decodeMap32;
jump[187] = decodeMap64;
jump[188] = invalidMinor;
jump[189] = invalidMinor;
jump[190] = invalidMinor;
jump[191] = decodeMapIndefinite;
for (let i = 192; i <= 215; i++) {
  jump[i] = decodeTagCompact;
}
jump[216] = decodeTag8;
jump[217] = decodeTag16;
jump[218] = decodeTag32;
jump[219] = decodeTag64;
jump[220] = invalidMinor;
jump[221] = invalidMinor;
jump[222] = invalidMinor;
jump[223] = invalidMinor;
for (let i = 224; i <= 243; i++) {
  jump[i] = errorer("simple values are not supported");
}
jump[244] = invalidMinor;
jump[245] = invalidMinor;
jump[246] = invalidMinor;
jump[247] = decodeUndefined;
jump[248] = errorer("simple values are not supported");
jump[249] = decodeFloat16;
jump[250] = decodeFloat32;
jump[251] = decodeFloat64;
jump[252] = invalidMinor;
jump[253] = invalidMinor;
jump[254] = invalidMinor;
jump[255] = decodeBreak;
var quick = [];
for (let i = 0; i < 24; i++) {
  quick[i] = new Token(Type.uint, i, 1);
}
for (let i = -1; i >= -24; i--) {
  quick[31 - i] = new Token(Type.negint, i, 1);
}
quick[64] = new Token(Type.bytes, new Uint8Array(0), 1);
quick[96] = new Token(Type.string, "", 1);
quick[128] = new Token(Type.array, 0, 1);
quick[160] = new Token(Type.map, 0, 1);
quick[244] = new Token(Type.false, false, 1);
quick[245] = new Token(Type.true, true, 1);
quick[246] = new Token(Type.null, null, 1);
function quickEncodeToken(token) {
  switch (token.type) {
    case Type.false:
      return fromArray([244]);
    case Type.true:
      return fromArray([245]);
    case Type.null:
      return fromArray([246]);
    case Type.bytes:
      if (!token.value.length) {
        return fromArray([64]);
      }
      return;
    case Type.string:
      if (token.value === "") {
        return fromArray([96]);
      }
      return;
    case Type.array:
      if (token.value === 0) {
        return fromArray([128]);
      }
      return;
    case Type.map:
      if (token.value === 0) {
        return fromArray([160]);
      }
      return;
    case Type.uint:
      if (token.value < 24) {
        return fromArray([Number(token.value)]);
      }
      return;
    case Type.negint:
      if (token.value >= -24) {
        return fromArray([31 - Number(token.value)]);
      }
  }
}

// node_modules/cborg/lib/encode.js
var defaultEncodeOptions = {
  float64: false,
  mapSorter,
  quickEncodeToken
};
function makeCborEncoders() {
  const encoders = [];
  encoders[Type.uint.major] = encodeUint;
  encoders[Type.negint.major] = encodeNegint;
  encoders[Type.bytes.major] = encodeBytes;
  encoders[Type.string.major] = encodeString;
  encoders[Type.array.major] = encodeArray;
  encoders[Type.map.major] = encodeMap;
  encoders[Type.tag.major] = encodeTag;
  encoders[Type.float.major] = encodeFloat;
  return encoders;
}
var cborEncoders = makeCborEncoders();
var buf = new Bl();
var Ref = class _Ref {
  /**
   * @param {object|any[]} obj
   * @param {Reference|undefined} parent
   */
  constructor(obj, parent) {
    this.obj = obj;
    this.parent = parent;
  }
  /**
   * @param {object|any[]} obj
   * @returns {boolean}
   */
  includes(obj) {
    let p = this;
    do {
      if (p.obj === obj) {
        return true;
      }
    } while (p = p.parent);
    return false;
  }
  /**
   * @param {Reference|undefined} stack
   * @param {object|any[]} obj
   * @returns {Reference}
   */
  static createCheck(stack, obj) {
    if (stack && stack.includes(obj)) {
      throw new Error(`${encodeErrPrefix} object contains circular references`);
    }
    return new _Ref(obj, stack);
  }
};
var simpleTokens = {
  null: new Token(Type.null, null),
  undefined: new Token(Type.undefined, void 0),
  true: new Token(Type.true, true),
  false: new Token(Type.false, false),
  emptyArray: new Token(Type.array, 0),
  emptyMap: new Token(Type.map, 0)
};
var typeEncoders = {
  /**
   * @param {any} obj
   * @param {string} _typ
   * @param {EncodeOptions} _options
   * @param {Reference} [_refStack]
   * @returns {TokenOrNestedTokens}
   */
  number(obj, _typ, _options, _refStack) {
    if (!Number.isInteger(obj) || !Number.isSafeInteger(obj)) {
      return new Token(Type.float, obj);
    } else if (obj >= 0) {
      return new Token(Type.uint, obj);
    } else {
      return new Token(Type.negint, obj);
    }
  },
  /**
   * @param {any} obj
   * @param {string} _typ
   * @param {EncodeOptions} _options
   * @param {Reference} [_refStack]
   * @returns {TokenOrNestedTokens}
   */
  bigint(obj, _typ, _options, _refStack) {
    if (obj >= BigInt(0)) {
      return new Token(Type.uint, obj);
    } else {
      return new Token(Type.negint, obj);
    }
  },
  /**
   * @param {any} obj
   * @param {string} _typ
   * @param {EncodeOptions} _options
   * @param {Reference} [_refStack]
   * @returns {TokenOrNestedTokens}
   */
  Uint8Array(obj, _typ, _options, _refStack) {
    return new Token(Type.bytes, obj);
  },
  /**
   * @param {any} obj
   * @param {string} _typ
   * @param {EncodeOptions} _options
   * @param {Reference} [_refStack]
   * @returns {TokenOrNestedTokens}
   */
  string(obj, _typ, _options, _refStack) {
    return new Token(Type.string, obj);
  },
  /**
   * @param {any} obj
   * @param {string} _typ
   * @param {EncodeOptions} _options
   * @param {Reference} [_refStack]
   * @returns {TokenOrNestedTokens}
   */
  boolean(obj, _typ, _options, _refStack) {
    return obj ? simpleTokens.true : simpleTokens.false;
  },
  /**
   * @param {any} _obj
   * @param {string} _typ
   * @param {EncodeOptions} _options
   * @param {Reference} [_refStack]
   * @returns {TokenOrNestedTokens}
   */
  null(_obj, _typ, _options, _refStack) {
    return simpleTokens.null;
  },
  /**
   * @param {any} _obj
   * @param {string} _typ
   * @param {EncodeOptions} _options
   * @param {Reference} [_refStack]
   * @returns {TokenOrNestedTokens}
   */
  undefined(_obj, _typ, _options, _refStack) {
    return simpleTokens.undefined;
  },
  /**
   * @param {any} obj
   * @param {string} _typ
   * @param {EncodeOptions} _options
   * @param {Reference} [_refStack]
   * @returns {TokenOrNestedTokens}
   */
  ArrayBuffer(obj, _typ, _options, _refStack) {
    return new Token(Type.bytes, new Uint8Array(obj));
  },
  /**
   * @param {any} obj
   * @param {string} _typ
   * @param {EncodeOptions} _options
   * @param {Reference} [_refStack]
   * @returns {TokenOrNestedTokens}
   */
  DataView(obj, _typ, _options, _refStack) {
    return new Token(Type.bytes, new Uint8Array(obj.buffer, obj.byteOffset, obj.byteLength));
  },
  /**
   * @param {any} obj
   * @param {string} _typ
   * @param {EncodeOptions} options
   * @param {Reference} [refStack]
   * @returns {TokenOrNestedTokens}
   */
  Array(obj, _typ, options, refStack) {
    if (!obj.length) {
      if (options.addBreakTokens === true) {
        return [simpleTokens.emptyArray, new Token(Type.break)];
      }
      return simpleTokens.emptyArray;
    }
    refStack = Ref.createCheck(refStack, obj);
    const entries = [];
    let i = 0;
    for (const e of obj) {
      entries[i++] = objectToTokens(e, options, refStack);
    }
    if (options.addBreakTokens) {
      return [new Token(Type.array, obj.length), entries, new Token(Type.break)];
    }
    return [new Token(Type.array, obj.length), entries];
  },
  /**
   * @param {any} obj
   * @param {string} typ
   * @param {EncodeOptions} options
   * @param {Reference} [refStack]
   * @returns {TokenOrNestedTokens}
   */
  Object(obj, typ, options, refStack) {
    const isMap = typ !== "Object";
    const keys = isMap ? obj.keys() : Object.keys(obj);
    const length3 = isMap ? obj.size : keys.length;
    if (!length3) {
      if (options.addBreakTokens === true) {
        return [simpleTokens.emptyMap, new Token(Type.break)];
      }
      return simpleTokens.emptyMap;
    }
    refStack = Ref.createCheck(refStack, obj);
    const entries = [];
    let i = 0;
    for (const key of keys) {
      entries[i++] = [
        objectToTokens(key, options, refStack),
        objectToTokens(isMap ? obj.get(key) : obj[key], options, refStack)
      ];
    }
    sortMapEntries(entries, options);
    if (options.addBreakTokens) {
      return [new Token(Type.map, length3), entries, new Token(Type.break)];
    }
    return [new Token(Type.map, length3), entries];
  }
};
typeEncoders.Map = typeEncoders.Object;
typeEncoders.Buffer = typeEncoders.Uint8Array;
for (const typ of "Uint8Clamped Uint16 Uint32 Int8 Int16 Int32 BigUint64 BigInt64 Float32 Float64".split(" ")) {
  typeEncoders[`${typ}Array`] = typeEncoders.DataView;
}
function objectToTokens(obj, options = {}, refStack) {
  const typ = is(obj);
  const customTypeEncoder = options && options.typeEncoders && /** @type {OptionalTypeEncoder} */
  options.typeEncoders[typ] || typeEncoders[typ];
  if (typeof customTypeEncoder === "function") {
    const tokens = customTypeEncoder(obj, typ, options, refStack);
    if (tokens != null) {
      return tokens;
    }
  }
  const typeEncoder = typeEncoders[typ];
  if (!typeEncoder) {
    throw new Error(`${encodeErrPrefix} unsupported type: ${typ}`);
  }
  return typeEncoder(obj, typ, options, refStack);
}
function sortMapEntries(entries, options) {
  if (options.mapSorter) {
    entries.sort(options.mapSorter);
  }
}
function mapSorter(e1, e2) {
  const keyToken1 = Array.isArray(e1[0]) ? e1[0][0] : e1[0];
  const keyToken2 = Array.isArray(e2[0]) ? e2[0][0] : e2[0];
  if (keyToken1.type !== keyToken2.type) {
    return keyToken1.type.compare(keyToken2.type);
  }
  const major = keyToken1.type.major;
  const tcmp = cborEncoders[major].compareTokens(keyToken1, keyToken2);
  if (tcmp === 0) {
    console.warn("WARNING: complex key types used, CBOR key sorting guarantees are gone");
  }
  return tcmp;
}
function tokensToEncoded(buf2, tokens, encoders, options) {
  if (Array.isArray(tokens)) {
    for (const token of tokens) {
      tokensToEncoded(buf2, token, encoders, options);
    }
  } else {
    encoders[tokens.type.major](buf2, tokens, options);
  }
}
function encodeCustom(data, encoders, options) {
  const tokens = objectToTokens(data, options);
  if (!Array.isArray(tokens) && options.quickEncodeToken) {
    const quickBytes = options.quickEncodeToken(tokens);
    if (quickBytes) {
      return quickBytes;
    }
    const encoder = encoders[tokens.type.major];
    if (encoder.encodedSize) {
      const size = encoder.encodedSize(tokens, options);
      const buf2 = new Bl(size);
      encoder(buf2, tokens, options);
      if (buf2.chunks.length !== 1) {
        throw new Error(`Unexpected error: pre-calculated length for ${tokens} was wrong`);
      }
      return asU8A(buf2.chunks[0]);
    }
  }
  buf.reset();
  tokensToEncoded(buf, tokens, encoders, options);
  return buf.toBytes(true);
}
function encode(data, options) {
  options = Object.assign({}, defaultEncodeOptions, options);
  return encodeCustom(data, cborEncoders, options);
}

// node_modules/cborg/lib/decode.js
var defaultDecodeOptions = {
  strict: false,
  allowIndefinite: true,
  allowUndefined: true,
  allowBigInt: true
};
var Tokeniser = class {
  /**
   * @param {Uint8Array} data
   * @param {DecodeOptions} options
   */
  constructor(data, options = {}) {
    this._pos = 0;
    this.data = data;
    this.options = options;
  }
  pos() {
    return this._pos;
  }
  done() {
    return this._pos >= this.data.length;
  }
  next() {
    const byt = this.data[this._pos];
    let token = quick[byt];
    if (token === void 0) {
      const decoder = jump[byt];
      if (!decoder) {
        throw new Error(`${decodeErrPrefix} no decoder for major type ${byt >>> 5} (byte 0x${byt.toString(16).padStart(2, "0")})`);
      }
      const minor = byt & 31;
      token = decoder(this.data, this._pos, minor, this.options);
    }
    this._pos += token.encodedLength;
    return token;
  }
};
var DONE = Symbol.for("DONE");
var BREAK = Symbol.for("BREAK");
function tokenToArray(token, tokeniser, options) {
  const arr = [];
  for (let i = 0; i < token.value; i++) {
    const value = tokensToObject(tokeniser, options);
    if (value === BREAK) {
      if (token.value === Infinity) {
        break;
      }
      throw new Error(`${decodeErrPrefix} got unexpected break to lengthed array`);
    }
    if (value === DONE) {
      throw new Error(`${decodeErrPrefix} found array but not enough entries (got ${i}, expected ${token.value})`);
    }
    arr[i] = value;
  }
  return arr;
}
function tokenToMap(token, tokeniser, options) {
  const useMaps = options.useMaps === true;
  const obj = useMaps ? void 0 : {};
  const m = useMaps ? /* @__PURE__ */ new Map() : void 0;
  for (let i = 0; i < token.value; i++) {
    const key = tokensToObject(tokeniser, options);
    if (key === BREAK) {
      if (token.value === Infinity) {
        break;
      }
      throw new Error(`${decodeErrPrefix} got unexpected break to lengthed map`);
    }
    if (key === DONE) {
      throw new Error(`${decodeErrPrefix} found map but not enough entries (got ${i} [no key], expected ${token.value})`);
    }
    if (useMaps !== true && typeof key !== "string") {
      throw new Error(`${decodeErrPrefix} non-string keys not supported (got ${typeof key})`);
    }
    if (options.rejectDuplicateMapKeys === true) {
      if (useMaps && m.has(key) || !useMaps && key in obj) {
        throw new Error(`${decodeErrPrefix} found repeat map key "${key}"`);
      }
    }
    const value = tokensToObject(tokeniser, options);
    if (value === DONE) {
      throw new Error(`${decodeErrPrefix} found map but not enough entries (got ${i} [no value], expected ${token.value})`);
    }
    if (useMaps) {
      m.set(key, value);
    } else {
      obj[key] = value;
    }
  }
  return useMaps ? m : obj;
}
function tokensToObject(tokeniser, options) {
  if (tokeniser.done()) {
    return DONE;
  }
  const token = tokeniser.next();
  if (token.type === Type.break) {
    return BREAK;
  }
  if (token.type.terminal) {
    return token.value;
  }
  if (token.type === Type.array) {
    return tokenToArray(token, tokeniser, options);
  }
  if (token.type === Type.map) {
    return tokenToMap(token, tokeniser, options);
  }
  if (token.type === Type.tag) {
    if (options.tags && typeof options.tags[token.value] === "function") {
      const tagged = tokensToObject(tokeniser, options);
      return options.tags[token.value](tagged);
    }
    throw new Error(`${decodeErrPrefix} tag not supported (${token.value})`);
  }
  throw new Error("unsupported");
}
function decodeFirst(data, options) {
  if (!(data instanceof Uint8Array)) {
    throw new Error(`${decodeErrPrefix} data to decode must be a Uint8Array`);
  }
  options = Object.assign({}, defaultDecodeOptions, options);
  const tokeniser = options.tokenizer || new Tokeniser(data, options);
  const decoded = tokensToObject(tokeniser, options);
  if (decoded === DONE) {
    throw new Error(`${decodeErrPrefix} did not find any content to decode`);
  }
  if (decoded === BREAK) {
    throw new Error(`${decodeErrPrefix} got unexpected break`);
  }
  return [decoded, data.subarray(tokeniser.pos())];
}
function decode(data, options) {
  const [decoded, remainder] = decodeFirst(data, options);
  if (remainder.length > 0) {
    throw new Error(`${decodeErrPrefix} too many terminals, data makes no sense`);
  }
  return decoded;
}

// node_modules/@ipld/dag-cbor/node_modules/multiformats/dist/src/bytes.js
var empty = new Uint8Array(0);
function equals(aa, bb) {
  if (aa === bb)
    return true;
  if (aa.byteLength !== bb.byteLength) {
    return false;
  }
  for (let ii = 0; ii < aa.byteLength; ii++) {
    if (aa[ii] !== bb[ii]) {
      return false;
    }
  }
  return true;
}
function coerce(o) {
  if (o instanceof Uint8Array && o.constructor.name === "Uint8Array")
    return o;
  if (o instanceof ArrayBuffer)
    return new Uint8Array(o);
  if (ArrayBuffer.isView(o)) {
    return new Uint8Array(o.buffer, o.byteOffset, o.byteLength);
  }
  throw new Error("Unknown type, must be binary type");
}

// node_modules/@ipld/dag-cbor/node_modules/multiformats/dist/src/vendor/base-x.js
function base(ALPHABET, name) {
  if (ALPHABET.length >= 255) {
    throw new TypeError("Alphabet too long");
  }
  var BASE_MAP = new Uint8Array(256);
  for (var j = 0; j < BASE_MAP.length; j++) {
    BASE_MAP[j] = 255;
  }
  for (var i = 0; i < ALPHABET.length; i++) {
    var x = ALPHABET.charAt(i);
    var xc = x.charCodeAt(0);
    if (BASE_MAP[xc] !== 255) {
      throw new TypeError(x + " is ambiguous");
    }
    BASE_MAP[xc] = i;
  }
  var BASE = ALPHABET.length;
  var LEADER = ALPHABET.charAt(0);
  var FACTOR = Math.log(BASE) / Math.log(256);
  var iFACTOR = Math.log(256) / Math.log(BASE);
  function encode8(source) {
    if (source instanceof Uint8Array)
      ;
    else if (ArrayBuffer.isView(source)) {
      source = new Uint8Array(source.buffer, source.byteOffset, source.byteLength);
    } else if (Array.isArray(source)) {
      source = Uint8Array.from(source);
    }
    if (!(source instanceof Uint8Array)) {
      throw new TypeError("Expected Uint8Array");
    }
    if (source.length === 0) {
      return "";
    }
    var zeroes = 0;
    var length3 = 0;
    var pbegin = 0;
    var pend = source.length;
    while (pbegin !== pend && source[pbegin] === 0) {
      pbegin++;
      zeroes++;
    }
    var size = (pend - pbegin) * iFACTOR + 1 >>> 0;
    var b58 = new Uint8Array(size);
    while (pbegin !== pend) {
      var carry = source[pbegin];
      var i2 = 0;
      for (var it1 = size - 1; (carry !== 0 || i2 < length3) && it1 !== -1; it1--, i2++) {
        carry += 256 * b58[it1] >>> 0;
        b58[it1] = carry % BASE >>> 0;
        carry = carry / BASE >>> 0;
      }
      if (carry !== 0) {
        throw new Error("Non-zero carry");
      }
      length3 = i2;
      pbegin++;
    }
    var it2 = size - length3;
    while (it2 !== size && b58[it2] === 0) {
      it2++;
    }
    var str = LEADER.repeat(zeroes);
    for (; it2 < size; ++it2) {
      str += ALPHABET.charAt(b58[it2]);
    }
    return str;
  }
  function decodeUnsafe(source) {
    if (typeof source !== "string") {
      throw new TypeError("Expected String");
    }
    if (source.length === 0) {
      return new Uint8Array();
    }
    var psz = 0;
    if (source[psz] === " ") {
      return;
    }
    var zeroes = 0;
    var length3 = 0;
    while (source[psz] === LEADER) {
      zeroes++;
      psz++;
    }
    var size = (source.length - psz) * FACTOR + 1 >>> 0;
    var b256 = new Uint8Array(size);
    while (source[psz]) {
      var carry = BASE_MAP[source.charCodeAt(psz)];
      if (carry === 255) {
        return;
      }
      var i2 = 0;
      for (var it3 = size - 1; (carry !== 0 || i2 < length3) && it3 !== -1; it3--, i2++) {
        carry += BASE * b256[it3] >>> 0;
        b256[it3] = carry % 256 >>> 0;
        carry = carry / 256 >>> 0;
      }
      if (carry !== 0) {
        throw new Error("Non-zero carry");
      }
      length3 = i2;
      psz++;
    }
    if (source[psz] === " ") {
      return;
    }
    var it4 = size - length3;
    while (it4 !== size && b256[it4] === 0) {
      it4++;
    }
    var vch = new Uint8Array(zeroes + (size - it4));
    var j2 = zeroes;
    while (it4 !== size) {
      vch[j2++] = b256[it4++];
    }
    return vch;
  }
  function decode13(string) {
    var buffer2 = decodeUnsafe(string);
    if (buffer2) {
      return buffer2;
    }
    throw new Error(`Non-${name} character`);
  }
  return {
    encode: encode8,
    decodeUnsafe,
    decode: decode13
  };
}
var src = base;
var _brrp__multiformats_scope_baseX = src;
var base_x_default = _brrp__multiformats_scope_baseX;

// node_modules/@ipld/dag-cbor/node_modules/multiformats/dist/src/bases/base.js
var Encoder = class {
  name;
  prefix;
  baseEncode;
  constructor(name, prefix, baseEncode) {
    this.name = name;
    this.prefix = prefix;
    this.baseEncode = baseEncode;
  }
  encode(bytes) {
    if (bytes instanceof Uint8Array) {
      return `${this.prefix}${this.baseEncode(bytes)}`;
    } else {
      throw Error("Unknown type, must be binary type");
    }
  }
};
var Decoder = class {
  name;
  prefix;
  baseDecode;
  prefixCodePoint;
  constructor(name, prefix, baseDecode) {
    this.name = name;
    this.prefix = prefix;
    if (prefix.codePointAt(0) === void 0) {
      throw new Error("Invalid prefix character");
    }
    this.prefixCodePoint = prefix.codePointAt(0);
    this.baseDecode = baseDecode;
  }
  decode(text) {
    if (typeof text === "string") {
      if (text.codePointAt(0) !== this.prefixCodePoint) {
        throw Error(`Unable to decode multibase string ${JSON.stringify(text)}, ${this.name} decoder only supports inputs prefixed with ${this.prefix}`);
      }
      return this.baseDecode(text.slice(this.prefix.length));
    } else {
      throw Error("Can only multibase decode strings");
    }
  }
  or(decoder) {
    return or(this, decoder);
  }
};
var ComposedDecoder = class {
  decoders;
  constructor(decoders) {
    this.decoders = decoders;
  }
  or(decoder) {
    return or(this, decoder);
  }
  decode(input) {
    const prefix = input[0];
    const decoder = this.decoders[prefix];
    if (decoder != null) {
      return decoder.decode(input);
    } else {
      throw RangeError(`Unable to decode multibase string ${JSON.stringify(input)}, only inputs prefixed with ${Object.keys(this.decoders)} are supported`);
    }
  }
};
function or(left, right) {
  return new ComposedDecoder({
    ...left.decoders ?? { [left.prefix]: left },
    ...right.decoders ?? { [right.prefix]: right }
  });
}
var Codec = class {
  name;
  prefix;
  baseEncode;
  baseDecode;
  encoder;
  decoder;
  constructor(name, prefix, baseEncode, baseDecode) {
    this.name = name;
    this.prefix = prefix;
    this.baseEncode = baseEncode;
    this.baseDecode = baseDecode;
    this.encoder = new Encoder(name, prefix, baseEncode);
    this.decoder = new Decoder(name, prefix, baseDecode);
  }
  encode(input) {
    return this.encoder.encode(input);
  }
  decode(input) {
    return this.decoder.decode(input);
  }
};
function from({ name, prefix, encode: encode8, decode: decode13 }) {
  return new Codec(name, prefix, encode8, decode13);
}
function baseX({ name, prefix, alphabet }) {
  const { encode: encode8, decode: decode13 } = base_x_default(alphabet, name);
  return from({
    prefix,
    name,
    encode: encode8,
    decode: (text) => coerce(decode13(text))
  });
}
function decode2(string, alphabet, bitsPerChar, name) {
  const codes = {};
  for (let i = 0; i < alphabet.length; ++i) {
    codes[alphabet[i]] = i;
  }
  let end = string.length;
  while (string[end - 1] === "=") {
    --end;
  }
  const out = new Uint8Array(end * bitsPerChar / 8 | 0);
  let bits = 0;
  let buffer2 = 0;
  let written = 0;
  for (let i = 0; i < end; ++i) {
    const value = codes[string[i]];
    if (value === void 0) {
      throw new SyntaxError(`Non-${name} character`);
    }
    buffer2 = buffer2 << bitsPerChar | value;
    bits += bitsPerChar;
    if (bits >= 8) {
      bits -= 8;
      out[written++] = 255 & buffer2 >> bits;
    }
  }
  if (bits >= bitsPerChar || (255 & buffer2 << 8 - bits) !== 0) {
    throw new SyntaxError("Unexpected end of data");
  }
  return out;
}
function encode2(data, alphabet, bitsPerChar) {
  const pad = alphabet[alphabet.length - 1] === "=";
  const mask = (1 << bitsPerChar) - 1;
  let out = "";
  let bits = 0;
  let buffer2 = 0;
  for (let i = 0; i < data.length; ++i) {
    buffer2 = buffer2 << 8 | data[i];
    bits += 8;
    while (bits > bitsPerChar) {
      bits -= bitsPerChar;
      out += alphabet[mask & buffer2 >> bits];
    }
  }
  if (bits !== 0) {
    out += alphabet[mask & buffer2 << bitsPerChar - bits];
  }
  if (pad) {
    while ((out.length * bitsPerChar & 7) !== 0) {
      out += "=";
    }
  }
  return out;
}
function rfc4648({ name, prefix, bitsPerChar, alphabet }) {
  return from({
    prefix,
    name,
    encode(input) {
      return encode2(input, alphabet, bitsPerChar);
    },
    decode(input) {
      return decode2(input, alphabet, bitsPerChar, name);
    }
  });
}

// node_modules/@ipld/dag-cbor/node_modules/multiformats/dist/src/bases/base32.js
var base32 = rfc4648({
  prefix: "b",
  name: "base32",
  alphabet: "abcdefghijklmnopqrstuvwxyz234567",
  bitsPerChar: 5
});
var base32upper = rfc4648({
  prefix: "B",
  name: "base32upper",
  alphabet: "ABCDEFGHIJKLMNOPQRSTUVWXYZ234567",
  bitsPerChar: 5
});
var base32pad = rfc4648({
  prefix: "c",
  name: "base32pad",
  alphabet: "abcdefghijklmnopqrstuvwxyz234567=",
  bitsPerChar: 5
});
var base32padupper = rfc4648({
  prefix: "C",
  name: "base32padupper",
  alphabet: "ABCDEFGHIJKLMNOPQRSTUVWXYZ234567=",
  bitsPerChar: 5
});
var base32hex = rfc4648({
  prefix: "v",
  name: "base32hex",
  alphabet: "0123456789abcdefghijklmnopqrstuv",
  bitsPerChar: 5
});
var base32hexupper = rfc4648({
  prefix: "V",
  name: "base32hexupper",
  alphabet: "0123456789ABCDEFGHIJKLMNOPQRSTUV",
  bitsPerChar: 5
});
var base32hexpad = rfc4648({
  prefix: "t",
  name: "base32hexpad",
  alphabet: "0123456789abcdefghijklmnopqrstuv=",
  bitsPerChar: 5
});
var base32hexpadupper = rfc4648({
  prefix: "T",
  name: "base32hexpadupper",
  alphabet: "0123456789ABCDEFGHIJKLMNOPQRSTUV=",
  bitsPerChar: 5
});
var base32z = rfc4648({
  prefix: "h",
  name: "base32z",
  alphabet: "ybndrfg8ejkmcpqxot1uwisza345h769",
  bitsPerChar: 5
});

// node_modules/@ipld/dag-cbor/node_modules/multiformats/dist/src/bases/base58.js
var base58btc = baseX({
  name: "base58btc",
  prefix: "z",
  alphabet: "123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz"
});
var base58flickr = baseX({
  name: "base58flickr",
  prefix: "Z",
  alphabet: "123456789abcdefghijkmnopqrstuvwxyzABCDEFGHJKLMNPQRSTUVWXYZ"
});

// node_modules/@ipld/dag-cbor/node_modules/multiformats/dist/src/vendor/varint.js
var encode_1 = encode3;
var MSB = 128;
var REST = 127;
var MSBALL = ~REST;
var INT = Math.pow(2, 31);
function encode3(num, out, offset) {
  out = out || [];
  offset = offset || 0;
  var oldOffset = offset;
  while (num >= INT) {
    out[offset++] = num & 255 | MSB;
    num /= 128;
  }
  while (num & MSBALL) {
    out[offset++] = num & 255 | MSB;
    num >>>= 7;
  }
  out[offset] = num | 0;
  encode3.bytes = offset - oldOffset + 1;
  return out;
}
var decode3 = read;
var MSB$1 = 128;
var REST$1 = 127;
function read(buf2, offset) {
  var res = 0, offset = offset || 0, shift = 0, counter = offset, b, l = buf2.length;
  do {
    if (counter >= l) {
      read.bytes = 0;
      throw new RangeError("Could not decode varint");
    }
    b = buf2[counter++];
    res += shift < 28 ? (b & REST$1) << shift : (b & REST$1) * Math.pow(2, shift);
    shift += 7;
  } while (b >= MSB$1);
  read.bytes = counter - offset;
  return res;
}
var N1 = Math.pow(2, 7);
var N2 = Math.pow(2, 14);
var N3 = Math.pow(2, 21);
var N4 = Math.pow(2, 28);
var N5 = Math.pow(2, 35);
var N6 = Math.pow(2, 42);
var N7 = Math.pow(2, 49);
var N8 = Math.pow(2, 56);
var N9 = Math.pow(2, 63);
var length = function(value) {
  return value < N1 ? 1 : value < N2 ? 2 : value < N3 ? 3 : value < N4 ? 4 : value < N5 ? 5 : value < N6 ? 6 : value < N7 ? 7 : value < N8 ? 8 : value < N9 ? 9 : 10;
};
var varint = {
  encode: encode_1,
  decode: decode3,
  encodingLength: length
};
var _brrp_varint = varint;
var varint_default = _brrp_varint;

// node_modules/@ipld/dag-cbor/node_modules/multiformats/dist/src/varint.js
function decode4(data, offset = 0) {
  const code3 = varint_default.decode(data, offset);
  return [code3, varint_default.decode.bytes];
}
function encodeTo(int, target, offset = 0) {
  varint_default.encode(int, target, offset);
  return target;
}
function encodingLength(int) {
  return varint_default.encodingLength(int);
}

// node_modules/@ipld/dag-cbor/node_modules/multiformats/dist/src/hashes/digest.js
function create(code3, digest) {
  const size = digest.byteLength;
  const sizeOffset = encodingLength(code3);
  const digestOffset = sizeOffset + encodingLength(size);
  const bytes = new Uint8Array(digestOffset + size);
  encodeTo(code3, bytes, 0);
  encodeTo(size, bytes, sizeOffset);
  bytes.set(digest, digestOffset);
  return new Digest(code3, size, digest, bytes);
}
function decode5(multihash) {
  const bytes = coerce(multihash);
  const [code3, sizeOffset] = decode4(bytes);
  const [size, digestOffset] = decode4(bytes.subarray(sizeOffset));
  const digest = bytes.subarray(sizeOffset + digestOffset);
  if (digest.byteLength !== size) {
    throw new Error("Incorrect length");
  }
  return new Digest(code3, size, digest, bytes);
}
function equals2(a, b) {
  if (a === b) {
    return true;
  } else {
    const data = b;
    return a.code === data.code && a.size === data.size && data.bytes instanceof Uint8Array && equals(a.bytes, data.bytes);
  }
}
var Digest = class {
  code;
  size;
  digest;
  bytes;
  /**
   * Creates a multihash digest.
   */
  constructor(code3, size, digest, bytes) {
    this.code = code3;
    this.size = size;
    this.digest = digest;
    this.bytes = bytes;
  }
};

// node_modules/@ipld/dag-cbor/node_modules/multiformats/dist/src/cid.js
function format(link, base3) {
  const { bytes, version } = link;
  switch (version) {
    case 0:
      return toStringV0(bytes, baseCache(link), base3 ?? base58btc.encoder);
    default:
      return toStringV1(bytes, baseCache(link), base3 ?? base32.encoder);
  }
}
var cache = /* @__PURE__ */ new WeakMap();
function baseCache(cid) {
  const baseCache3 = cache.get(cid);
  if (baseCache3 == null) {
    const baseCache4 = /* @__PURE__ */ new Map();
    cache.set(cid, baseCache4);
    return baseCache4;
  }
  return baseCache3;
}
var CID = class _CID {
  code;
  version;
  multihash;
  bytes;
  "/";
  /**
   * @param version - Version of the CID
   * @param code - Code of the codec content is encoded in, see https://github.com/multiformats/multicodec/blob/master/table.csv
   * @param multihash - (Multi)hash of the of the content.
   */
  constructor(version, code3, multihash, bytes) {
    this.code = code3;
    this.version = version;
    this.multihash = multihash;
    this.bytes = bytes;
    this["/"] = bytes;
  }
  /**
   * Signalling `cid.asCID === cid` has been replaced with `cid['/'] === cid.bytes`
   * please either use `CID.asCID(cid)` or switch to new signalling mechanism
   *
   * @deprecated
   */
  get asCID() {
    return this;
  }
  // ArrayBufferView
  get byteOffset() {
    return this.bytes.byteOffset;
  }
  // ArrayBufferView
  get byteLength() {
    return this.bytes.byteLength;
  }
  toV0() {
    switch (this.version) {
      case 0: {
        return this;
      }
      case 1: {
        const { code: code3, multihash } = this;
        if (code3 !== DAG_PB_CODE) {
          throw new Error("Cannot convert a non dag-pb CID to CIDv0");
        }
        if (multihash.code !== SHA_256_CODE) {
          throw new Error("Cannot convert non sha2-256 multihash CID to CIDv0");
        }
        return _CID.createV0(multihash);
      }
      default: {
        throw Error(`Can not convert CID version ${this.version} to version 0. This is a bug please report`);
      }
    }
  }
  toV1() {
    switch (this.version) {
      case 0: {
        const { code: code3, digest } = this.multihash;
        const multihash = create(code3, digest);
        return _CID.createV1(this.code, multihash);
      }
      case 1: {
        return this;
      }
      default: {
        throw Error(`Can not convert CID version ${this.version} to version 1. This is a bug please report`);
      }
    }
  }
  equals(other) {
    return _CID.equals(this, other);
  }
  static equals(self, other) {
    const unknown = other;
    return unknown != null && self.code === unknown.code && self.version === unknown.version && equals2(self.multihash, unknown.multihash);
  }
  toString(base3) {
    return format(this, base3);
  }
  toJSON() {
    return { "/": format(this) };
  }
  link() {
    return this;
  }
  [Symbol.toStringTag] = "CID";
  // Legacy
  [Symbol.for("nodejs.util.inspect.custom")]() {
    return `CID(${this.toString()})`;
  }
  /**
   * Takes any input `value` and returns a `CID` instance if it was
   * a `CID` otherwise returns `null`. If `value` is instanceof `CID`
   * it will return value back. If `value` is not instance of this CID
   * class, but is compatible CID it will return new instance of this
   * `CID` class. Otherwise returns null.
   *
   * This allows two different incompatible versions of CID library to
   * co-exist and interop as long as binary interface is compatible.
   */
  static asCID(input) {
    if (input == null) {
      return null;
    }
    const value = input;
    if (value instanceof _CID) {
      return value;
    } else if (value["/"] != null && value["/"] === value.bytes || value.asCID === value) {
      const { version, code: code3, multihash, bytes } = value;
      return new _CID(version, code3, multihash, bytes ?? encodeCID(version, code3, multihash.bytes));
    } else if (value[cidSymbol] === true) {
      const { version, multihash, code: code3 } = value;
      const digest = decode5(multihash);
      return _CID.create(version, code3, digest);
    } else {
      return null;
    }
  }
  /**
   * @param version - Version of the CID
   * @param code - Code of the codec content is encoded in, see https://github.com/multiformats/multicodec/blob/master/table.csv
   * @param digest - (Multi)hash of the of the content.
   */
  static create(version, code3, digest) {
    if (typeof code3 !== "number") {
      throw new Error("String codecs are no longer supported");
    }
    if (!(digest.bytes instanceof Uint8Array)) {
      throw new Error("Invalid digest");
    }
    switch (version) {
      case 0: {
        if (code3 !== DAG_PB_CODE) {
          throw new Error(`Version 0 CID must use dag-pb (code: ${DAG_PB_CODE}) block encoding`);
        } else {
          return new _CID(version, code3, digest, digest.bytes);
        }
      }
      case 1: {
        const bytes = encodeCID(version, code3, digest.bytes);
        return new _CID(version, code3, digest, bytes);
      }
      default: {
        throw new Error("Invalid version");
      }
    }
  }
  /**
   * Simplified version of `create` for CIDv0.
   */
  static createV0(digest) {
    return _CID.create(0, DAG_PB_CODE, digest);
  }
  /**
   * Simplified version of `create` for CIDv1.
   *
   * @param code - Content encoding format code.
   * @param digest - Multihash of the content.
   */
  static createV1(code3, digest) {
    return _CID.create(1, code3, digest);
  }
  /**
   * Decoded a CID from its binary representation. The byte array must contain
   * only the CID with no additional bytes.
   *
   * An error will be thrown if the bytes provided do not contain a valid
   * binary representation of a CID.
   */
  static decode(bytes) {
    const [cid, remainder] = _CID.decodeFirst(bytes);
    if (remainder.length !== 0) {
      throw new Error("Incorrect length");
    }
    return cid;
  }
  /**
   * Decoded a CID from its binary representation at the beginning of a byte
   * array.
   *
   * Returns an array with the first element containing the CID and the second
   * element containing the remainder of the original byte array. The remainder
   * will be a zero-length byte array if the provided bytes only contained a
   * binary CID representation.
   */
  static decodeFirst(bytes) {
    const specs = _CID.inspectBytes(bytes);
    const prefixSize = specs.size - specs.multihashSize;
    const multihashBytes = coerce(bytes.subarray(prefixSize, prefixSize + specs.multihashSize));
    if (multihashBytes.byteLength !== specs.multihashSize) {
      throw new Error("Incorrect length");
    }
    const digestBytes = multihashBytes.subarray(specs.multihashSize - specs.digestSize);
    const digest = new Digest(specs.multihashCode, specs.digestSize, digestBytes, multihashBytes);
    const cid = specs.version === 0 ? _CID.createV0(digest) : _CID.createV1(specs.codec, digest);
    return [cid, bytes.subarray(specs.size)];
  }
  /**
   * Inspect the initial bytes of a CID to determine its properties.
   *
   * Involves decoding up to 4 varints. Typically this will require only 4 to 6
   * bytes but for larger multicodec code values and larger multihash digest
   * lengths these varints can be quite large. It is recommended that at least
   * 10 bytes be made available in the `initialBytes` argument for a complete
   * inspection.
   */
  static inspectBytes(initialBytes) {
    let offset = 0;
    const next = () => {
      const [i, length3] = decode4(initialBytes.subarray(offset));
      offset += length3;
      return i;
    };
    let version = next();
    let codec = DAG_PB_CODE;
    if (version === 18) {
      version = 0;
      offset = 0;
    } else {
      codec = next();
    }
    if (version !== 0 && version !== 1) {
      throw new RangeError(`Invalid CID version ${version}`);
    }
    const prefixSize = offset;
    const multihashCode = next();
    const digestSize = next();
    const size = offset + digestSize;
    const multihashSize = size - prefixSize;
    return { version, codec, multihashCode, digestSize, multihashSize, size };
  }
  /**
   * Takes cid in a string representation and creates an instance. If `base`
   * decoder is not provided will use a default from the configuration. It will
   * throw an error if encoding of the CID is not compatible with supplied (or
   * a default decoder).
   */
  static parse(source, base3) {
    const [prefix, bytes] = parseCIDtoBytes(source, base3);
    const cid = _CID.decode(bytes);
    if (cid.version === 0 && source[0] !== "Q") {
      throw Error("Version 0 CID string must not include multibase prefix");
    }
    baseCache(cid).set(prefix, source);
    return cid;
  }
};
function parseCIDtoBytes(source, base3) {
  switch (source[0]) {
    case "Q": {
      const decoder = base3 ?? base58btc;
      return [
        base58btc.prefix,
        decoder.decode(`${base58btc.prefix}${source}`)
      ];
    }
    case base58btc.prefix: {
      const decoder = base3 ?? base58btc;
      return [base58btc.prefix, decoder.decode(source)];
    }
    case base32.prefix: {
      const decoder = base3 ?? base32;
      return [base32.prefix, decoder.decode(source)];
    }
    default: {
      if (base3 == null) {
        throw Error("To parse non base32 or base58btc encoded CID multibase decoder must be provided");
      }
      return [source[0], base3.decode(source)];
    }
  }
}
function toStringV0(bytes, cache3, base3) {
  const { prefix } = base3;
  if (prefix !== base58btc.prefix) {
    throw Error(`Cannot string encode V0 in ${base3.name} encoding`);
  }
  const cid = cache3.get(prefix);
  if (cid == null) {
    const cid2 = base3.encode(bytes).slice(1);
    cache3.set(prefix, cid2);
    return cid2;
  } else {
    return cid;
  }
}
function toStringV1(bytes, cache3, base3) {
  const { prefix } = base3;
  const cid = cache3.get(prefix);
  if (cid == null) {
    const cid2 = base3.encode(bytes);
    cache3.set(prefix, cid2);
    return cid2;
  } else {
    return cid;
  }
}
var DAG_PB_CODE = 112;
var SHA_256_CODE = 18;
function encodeCID(version, code3, multihash) {
  const codeOffset = encodingLength(version);
  const hashOffset = codeOffset + encodingLength(code3);
  const bytes = new Uint8Array(hashOffset + multihash.byteLength);
  encodeTo(version, bytes, 0);
  encodeTo(code3, bytes, codeOffset);
  bytes.set(multihash, hashOffset);
  return bytes;
}
var cidSymbol = Symbol.for("@ipld/js-cid/CID");

// node_modules/@ipld/dag-cbor/src/index.js
var CID_CBOR_TAG = 42;
function cidEncoder(obj) {
  if (obj.asCID !== obj && obj["/"] !== obj.bytes) {
    return null;
  }
  const cid = CID.asCID(obj);
  if (!cid) {
    return null;
  }
  const bytes = new Uint8Array(cid.bytes.byteLength + 1);
  bytes.set(cid.bytes, 1);
  return [
    new Token(Type.tag, CID_CBOR_TAG),
    new Token(Type.bytes, bytes)
  ];
}
function undefinedEncoder() {
  throw new Error("`undefined` is not supported by the IPLD Data Model and cannot be encoded");
}
function numberEncoder(num) {
  if (Number.isNaN(num)) {
    throw new Error("`NaN` is not supported by the IPLD Data Model and cannot be encoded");
  }
  if (num === Infinity || num === -Infinity) {
    throw new Error("`Infinity` and `-Infinity` is not supported by the IPLD Data Model and cannot be encoded");
  }
  return null;
}
var _encodeOptions = {
  float64: true,
  typeEncoders: {
    Object: cidEncoder,
    undefined: undefinedEncoder,
    number: numberEncoder
  }
};
var encodeOptions = {
  ..._encodeOptions,
  typeEncoders: {
    ..._encodeOptions.typeEncoders
  }
};
function cidDecoder(bytes) {
  if (bytes[0] !== 0) {
    throw new Error("Invalid CID for CBOR tag 42; expected leading 0x00");
  }
  return CID.decode(bytes.subarray(1));
}
var _decodeOptions = {
  allowIndefinite: false,
  coerceUndefinedToNull: true,
  allowNaN: false,
  allowInfinity: false,
  allowBigInt: true,
  // this will lead to BigInt for ints outside of
  // safe-integer range, which may surprise users
  strict: true,
  useMaps: false,
  rejectDuplicateMapKeys: true,
  /** @type {import('cborg').TagDecoder[]} */
  tags: []
};
_decodeOptions.tags[CID_CBOR_TAG] = cidDecoder;
var decodeOptions = {
  ..._decodeOptions,
  tags: _decodeOptions.tags.slice()
};
var encode4 = (node) => encode(node, _encodeOptions);
var decode6 = (data) => decode(data, _decodeOptions);

// node_modules/multiformats/vendor/base-x.js
function base2(ALPHABET, name) {
  if (ALPHABET.length >= 255) {
    throw new TypeError("Alphabet too long");
  }
  var BASE_MAP = new Uint8Array(256);
  for (var j = 0; j < BASE_MAP.length; j++) {
    BASE_MAP[j] = 255;
  }
  for (var i = 0; i < ALPHABET.length; i++) {
    var x = ALPHABET.charAt(i);
    var xc = x.charCodeAt(0);
    if (BASE_MAP[xc] !== 255) {
      throw new TypeError(x + " is ambiguous");
    }
    BASE_MAP[xc] = i;
  }
  var BASE = ALPHABET.length;
  var LEADER = ALPHABET.charAt(0);
  var FACTOR = Math.log(BASE) / Math.log(256);
  var iFACTOR = Math.log(256) / Math.log(BASE);
  function encode8(source) {
    if (source instanceof Uint8Array)
      ;
    else if (ArrayBuffer.isView(source)) {
      source = new Uint8Array(source.buffer, source.byteOffset, source.byteLength);
    } else if (Array.isArray(source)) {
      source = Uint8Array.from(source);
    }
    if (!(source instanceof Uint8Array)) {
      throw new TypeError("Expected Uint8Array");
    }
    if (source.length === 0) {
      return "";
    }
    var zeroes = 0;
    var length3 = 0;
    var pbegin = 0;
    var pend = source.length;
    while (pbegin !== pend && source[pbegin] === 0) {
      pbegin++;
      zeroes++;
    }
    var size = (pend - pbegin) * iFACTOR + 1 >>> 0;
    var b58 = new Uint8Array(size);
    while (pbegin !== pend) {
      var carry = source[pbegin];
      var i2 = 0;
      for (var it1 = size - 1; (carry !== 0 || i2 < length3) && it1 !== -1; it1--, i2++) {
        carry += 256 * b58[it1] >>> 0;
        b58[it1] = carry % BASE >>> 0;
        carry = carry / BASE >>> 0;
      }
      if (carry !== 0) {
        throw new Error("Non-zero carry");
      }
      length3 = i2;
      pbegin++;
    }
    var it2 = size - length3;
    while (it2 !== size && b58[it2] === 0) {
      it2++;
    }
    var str = LEADER.repeat(zeroes);
    for (; it2 < size; ++it2) {
      str += ALPHABET.charAt(b58[it2]);
    }
    return str;
  }
  function decodeUnsafe(source) {
    if (typeof source !== "string") {
      throw new TypeError("Expected String");
    }
    if (source.length === 0) {
      return new Uint8Array();
    }
    var psz = 0;
    if (source[psz] === " ") {
      return;
    }
    var zeroes = 0;
    var length3 = 0;
    while (source[psz] === LEADER) {
      zeroes++;
      psz++;
    }
    var size = (source.length - psz) * FACTOR + 1 >>> 0;
    var b256 = new Uint8Array(size);
    while (source[psz]) {
      var carry = BASE_MAP[source.charCodeAt(psz)];
      if (carry === 255) {
        return;
      }
      var i2 = 0;
      for (var it3 = size - 1; (carry !== 0 || i2 < length3) && it3 !== -1; it3--, i2++) {
        carry += BASE * b256[it3] >>> 0;
        b256[it3] = carry % 256 >>> 0;
        carry = carry / 256 >>> 0;
      }
      if (carry !== 0) {
        throw new Error("Non-zero carry");
      }
      length3 = i2;
      psz++;
    }
    if (source[psz] === " ") {
      return;
    }
    var it4 = size - length3;
    while (it4 !== size && b256[it4] === 0) {
      it4++;
    }
    var vch = new Uint8Array(zeroes + (size - it4));
    var j2 = zeroes;
    while (it4 !== size) {
      vch[j2++] = b256[it4++];
    }
    return vch;
  }
  function decode13(string) {
    var buffer2 = decodeUnsafe(string);
    if (buffer2) {
      return buffer2;
    }
    throw new Error(`Non-${name} character`);
  }
  return {
    encode: encode8,
    decodeUnsafe,
    decode: decode13
  };
}
var src2 = base2;
var _brrp__multiformats_scope_baseX2 = src2;
var base_x_default2 = _brrp__multiformats_scope_baseX2;

// node_modules/multiformats/src/bytes.js
var empty2 = new Uint8Array(0);
var equals3 = (aa, bb) => {
  if (aa === bb)
    return true;
  if (aa.byteLength !== bb.byteLength) {
    return false;
  }
  for (let ii = 0; ii < aa.byteLength; ii++) {
    if (aa[ii] !== bb[ii]) {
      return false;
    }
  }
  return true;
};
var coerce2 = (o) => {
  if (o instanceof Uint8Array && o.constructor.name === "Uint8Array")
    return o;
  if (o instanceof ArrayBuffer)
    return new Uint8Array(o);
  if (ArrayBuffer.isView(o)) {
    return new Uint8Array(o.buffer, o.byteOffset, o.byteLength);
  }
  throw new Error("Unknown type, must be binary type");
};

// node_modules/multiformats/src/bases/base.js
var Encoder2 = class {
  /**
   * @param {Base} name
   * @param {Prefix} prefix
   * @param {(bytes:Uint8Array) => string} baseEncode
   */
  constructor(name, prefix, baseEncode) {
    this.name = name;
    this.prefix = prefix;
    this.baseEncode = baseEncode;
  }
  /**
   * @param {Uint8Array} bytes
   * @returns {API.Multibase<Prefix>}
   */
  encode(bytes) {
    if (bytes instanceof Uint8Array) {
      return `${this.prefix}${this.baseEncode(bytes)}`;
    } else {
      throw Error("Unknown type, must be binary type");
    }
  }
};
var Decoder2 = class {
  /**
   * @param {Base} name
   * @param {Prefix} prefix
   * @param {(text:string) => Uint8Array} baseDecode
   */
  constructor(name, prefix, baseDecode) {
    this.name = name;
    this.prefix = prefix;
    if (prefix.codePointAt(0) === void 0) {
      throw new Error("Invalid prefix character");
    }
    this.prefixCodePoint = /** @type {number} */
    prefix.codePointAt(0);
    this.baseDecode = baseDecode;
  }
  /**
   * @param {string} text
   */
  decode(text) {
    if (typeof text === "string") {
      if (text.codePointAt(0) !== this.prefixCodePoint) {
        throw Error(`Unable to decode multibase string ${JSON.stringify(text)}, ${this.name} decoder only supports inputs prefixed with ${this.prefix}`);
      }
      return this.baseDecode(text.slice(this.prefix.length));
    } else {
      throw Error("Can only multibase decode strings");
    }
  }
  /**
   * @template {string} OtherPrefix
   * @param {API.UnibaseDecoder<OtherPrefix>|ComposedDecoder<OtherPrefix>} decoder
   * @returns {ComposedDecoder<Prefix|OtherPrefix>}
   */
  or(decoder) {
    return or2(this, decoder);
  }
};
var ComposedDecoder2 = class {
  /**
   * @param {Decoders<Prefix>} decoders
   */
  constructor(decoders) {
    this.decoders = decoders;
  }
  /**
   * @template {string} OtherPrefix
   * @param {API.UnibaseDecoder<OtherPrefix>|ComposedDecoder<OtherPrefix>} decoder
   * @returns {ComposedDecoder<Prefix|OtherPrefix>}
   */
  or(decoder) {
    return or2(this, decoder);
  }
  /**
   * @param {string} input
   * @returns {Uint8Array}
   */
  decode(input) {
    const prefix = (
      /** @type {Prefix} */
      input[0]
    );
    const decoder = this.decoders[prefix];
    if (decoder) {
      return decoder.decode(input);
    } else {
      throw RangeError(`Unable to decode multibase string ${JSON.stringify(input)}, only inputs prefixed with ${Object.keys(this.decoders)} are supported`);
    }
  }
};
var or2 = (left, right) => new ComposedDecoder2(
  /** @type {Decoders<L|R>} */
  {
    ...left.decoders || { [
      /** @type API.UnibaseDecoder<L> */
      left.prefix
    ]: left },
    ...right.decoders || { [
      /** @type API.UnibaseDecoder<R> */
      right.prefix
    ]: right }
  }
);
var Codec2 = class {
  /**
   * @param {Base} name
   * @param {Prefix} prefix
   * @param {(bytes:Uint8Array) => string} baseEncode
   * @param {(text:string) => Uint8Array} baseDecode
   */
  constructor(name, prefix, baseEncode, baseDecode) {
    this.name = name;
    this.prefix = prefix;
    this.baseEncode = baseEncode;
    this.baseDecode = baseDecode;
    this.encoder = new Encoder2(name, prefix, baseEncode);
    this.decoder = new Decoder2(name, prefix, baseDecode);
  }
  /**
   * @param {Uint8Array} input
   */
  encode(input) {
    return this.encoder.encode(input);
  }
  /**
   * @param {string} input
   */
  decode(input) {
    return this.decoder.decode(input);
  }
};
var from2 = ({ name, prefix, encode: encode8, decode: decode13 }) => new Codec2(name, prefix, encode8, decode13);
var baseX2 = ({ prefix, name, alphabet }) => {
  const { encode: encode8, decode: decode13 } = base_x_default2(alphabet, name);
  return from2({
    prefix,
    name,
    encode: encode8,
    /**
     * @param {string} text
     */
    decode: (text) => coerce2(decode13(text))
  });
};
var decode7 = (string, alphabet, bitsPerChar, name) => {
  const codes = {};
  for (let i = 0; i < alphabet.length; ++i) {
    codes[alphabet[i]] = i;
  }
  let end = string.length;
  while (string[end - 1] === "=") {
    --end;
  }
  const out = new Uint8Array(end * bitsPerChar / 8 | 0);
  let bits = 0;
  let buffer2 = 0;
  let written = 0;
  for (let i = 0; i < end; ++i) {
    const value = codes[string[i]];
    if (value === void 0) {
      throw new SyntaxError(`Non-${name} character`);
    }
    buffer2 = buffer2 << bitsPerChar | value;
    bits += bitsPerChar;
    if (bits >= 8) {
      bits -= 8;
      out[written++] = 255 & buffer2 >> bits;
    }
  }
  if (bits >= bitsPerChar || 255 & buffer2 << 8 - bits) {
    throw new SyntaxError("Unexpected end of data");
  }
  return out;
};
var encode5 = (data, alphabet, bitsPerChar) => {
  const pad = alphabet[alphabet.length - 1] === "=";
  const mask = (1 << bitsPerChar) - 1;
  let out = "";
  let bits = 0;
  let buffer2 = 0;
  for (let i = 0; i < data.length; ++i) {
    buffer2 = buffer2 << 8 | data[i];
    bits += 8;
    while (bits > bitsPerChar) {
      bits -= bitsPerChar;
      out += alphabet[mask & buffer2 >> bits];
    }
  }
  if (bits) {
    out += alphabet[mask & buffer2 << bitsPerChar - bits];
  }
  if (pad) {
    while (out.length * bitsPerChar & 7) {
      out += "=";
    }
  }
  return out;
};
var rfc46482 = ({ name, prefix, bitsPerChar, alphabet }) => {
  return from2({
    prefix,
    name,
    encode(input) {
      return encode5(input, alphabet, bitsPerChar);
    },
    decode(input) {
      return decode7(input, alphabet, bitsPerChar, name);
    }
  });
};

// node_modules/multiformats/src/bases/base32.js
var base322 = rfc46482({
  prefix: "b",
  name: "base32",
  alphabet: "abcdefghijklmnopqrstuvwxyz234567",
  bitsPerChar: 5
});
var base32upper2 = rfc46482({
  prefix: "B",
  name: "base32upper",
  alphabet: "ABCDEFGHIJKLMNOPQRSTUVWXYZ234567",
  bitsPerChar: 5
});
var base32pad2 = rfc46482({
  prefix: "c",
  name: "base32pad",
  alphabet: "abcdefghijklmnopqrstuvwxyz234567=",
  bitsPerChar: 5
});
var base32padupper2 = rfc46482({
  prefix: "C",
  name: "base32padupper",
  alphabet: "ABCDEFGHIJKLMNOPQRSTUVWXYZ234567=",
  bitsPerChar: 5
});
var base32hex2 = rfc46482({
  prefix: "v",
  name: "base32hex",
  alphabet: "0123456789abcdefghijklmnopqrstuv",
  bitsPerChar: 5
});
var base32hexupper2 = rfc46482({
  prefix: "V",
  name: "base32hexupper",
  alphabet: "0123456789ABCDEFGHIJKLMNOPQRSTUV",
  bitsPerChar: 5
});
var base32hexpad2 = rfc46482({
  prefix: "t",
  name: "base32hexpad",
  alphabet: "0123456789abcdefghijklmnopqrstuv=",
  bitsPerChar: 5
});
var base32hexpadupper2 = rfc46482({
  prefix: "T",
  name: "base32hexpadupper",
  alphabet: "0123456789ABCDEFGHIJKLMNOPQRSTUV=",
  bitsPerChar: 5
});
var base32z2 = rfc46482({
  prefix: "h",
  name: "base32z",
  alphabet: "ybndrfg8ejkmcpqxot1uwisza345h769",
  bitsPerChar: 5
});

// node_modules/multiformats/src/bases/base58.js
var base58btc2 = baseX2({
  name: "base58btc",
  prefix: "z",
  alphabet: "123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz"
});
var base58flickr2 = baseX2({
  name: "base58flickr",
  prefix: "Z",
  alphabet: "123456789abcdefghijkmnopqrstuvwxyzABCDEFGHJKLMNPQRSTUVWXYZ"
});

// node_modules/multiformats/vendor/varint.js
var encode_12 = encode6;
var MSB2 = 128;
var REST2 = 127;
var MSBALL2 = ~REST2;
var INT2 = Math.pow(2, 31);
function encode6(num, out, offset) {
  out = out || [];
  offset = offset || 0;
  var oldOffset = offset;
  while (num >= INT2) {
    out[offset++] = num & 255 | MSB2;
    num /= 128;
  }
  while (num & MSBALL2) {
    out[offset++] = num & 255 | MSB2;
    num >>>= 7;
  }
  out[offset] = num | 0;
  encode6.bytes = offset - oldOffset + 1;
  return out;
}
var decode8 = read2;
var MSB$12 = 128;
var REST$12 = 127;
function read2(buf2, offset) {
  var res = 0, offset = offset || 0, shift = 0, counter = offset, b, l = buf2.length;
  do {
    if (counter >= l) {
      read2.bytes = 0;
      throw new RangeError("Could not decode varint");
    }
    b = buf2[counter++];
    res += shift < 28 ? (b & REST$12) << shift : (b & REST$12) * Math.pow(2, shift);
    shift += 7;
  } while (b >= MSB$12);
  read2.bytes = counter - offset;
  return res;
}
var N12 = Math.pow(2, 7);
var N22 = Math.pow(2, 14);
var N32 = Math.pow(2, 21);
var N42 = Math.pow(2, 28);
var N52 = Math.pow(2, 35);
var N62 = Math.pow(2, 42);
var N72 = Math.pow(2, 49);
var N82 = Math.pow(2, 56);
var N92 = Math.pow(2, 63);
var length2 = function(value) {
  return value < N12 ? 1 : value < N22 ? 2 : value < N32 ? 3 : value < N42 ? 4 : value < N52 ? 5 : value < N62 ? 6 : value < N72 ? 7 : value < N82 ? 8 : value < N92 ? 9 : 10;
};
var varint2 = {
  encode: encode_12,
  decode: decode8,
  encodingLength: length2
};
var _brrp_varint2 = varint2;
var varint_default2 = _brrp_varint2;

// node_modules/multiformats/src/varint.js
var decode9 = (data, offset = 0) => {
  const code3 = varint_default2.decode(data, offset);
  return [code3, varint_default2.decode.bytes];
};
var encodeTo2 = (int, target, offset = 0) => {
  varint_default2.encode(int, target, offset);
  return target;
};
var encodingLength2 = (int) => {
  return varint_default2.encodingLength(int);
};

// node_modules/multiformats/src/hashes/digest.js
var create2 = (code3, digest) => {
  const size = digest.byteLength;
  const sizeOffset = encodingLength2(code3);
  const digestOffset = sizeOffset + encodingLength2(size);
  const bytes = new Uint8Array(digestOffset + size);
  encodeTo2(code3, bytes, 0);
  encodeTo2(size, bytes, sizeOffset);
  bytes.set(digest, digestOffset);
  return new Digest2(code3, size, digest, bytes);
};
var decode10 = (multihash) => {
  const bytes = coerce2(multihash);
  const [code3, sizeOffset] = decode9(bytes);
  const [size, digestOffset] = decode9(bytes.subarray(sizeOffset));
  const digest = bytes.subarray(sizeOffset + digestOffset);
  if (digest.byteLength !== size) {
    throw new Error("Incorrect length");
  }
  return new Digest2(code3, size, digest, bytes);
};
var equals4 = (a, b) => {
  if (a === b) {
    return true;
  } else {
    const data = (
      /** @type {{code?:unknown, size?:unknown, bytes?:unknown}} */
      b
    );
    return a.code === data.code && a.size === data.size && data.bytes instanceof Uint8Array && equals3(a.bytes, data.bytes);
  }
};
var Digest2 = class {
  /**
   * Creates a multihash digest.
   *
   * @param {Code} code
   * @param {Size} size
   * @param {Uint8Array} digest
   * @param {Uint8Array} bytes
   */
  constructor(code3, size, digest, bytes) {
    this.code = code3;
    this.size = size;
    this.digest = digest;
    this.bytes = bytes;
  }
};

// node_modules/multiformats/src/cid.js
var format2 = (link, base3) => {
  const { bytes, version } = link;
  switch (version) {
    case 0:
      return toStringV02(
        bytes,
        baseCache2(link),
        /** @type {API.MultibaseEncoder<"z">} */
        base3 || base58btc2.encoder
      );
    default:
      return toStringV12(
        bytes,
        baseCache2(link),
        /** @type {API.MultibaseEncoder<Prefix>} */
        base3 || base322.encoder
      );
  }
};
var cache2 = /* @__PURE__ */ new WeakMap();
var baseCache2 = (cid) => {
  const baseCache3 = cache2.get(cid);
  if (baseCache3 == null) {
    const baseCache4 = /* @__PURE__ */ new Map();
    cache2.set(cid, baseCache4);
    return baseCache4;
  }
  return baseCache3;
};
var CID2 = class _CID {
  /**
   * @param {Version} version - Version of the CID
   * @param {Format} code - Code of the codec content is encoded in, see https://github.com/multiformats/multicodec/blob/master/table.csv
   * @param {API.MultihashDigest<Alg>} multihash - (Multi)hash of the of the content.
   * @param {Uint8Array} bytes
   */
  constructor(version, code3, multihash, bytes) {
    this.code = code3;
    this.version = version;
    this.multihash = multihash;
    this.bytes = bytes;
    this["/"] = bytes;
  }
  /**
   * Signalling `cid.asCID === cid` has been replaced with `cid['/'] === cid.bytes`
   * please either use `CID.asCID(cid)` or switch to new signalling mechanism
   *
   * @deprecated
   */
  get asCID() {
    return this;
  }
  // ArrayBufferView
  get byteOffset() {
    return this.bytes.byteOffset;
  }
  // ArrayBufferView
  get byteLength() {
    return this.bytes.byteLength;
  }
  /**
   * @returns {CID<Data, API.DAG_PB, API.SHA_256, 0>}
   */
  toV0() {
    switch (this.version) {
      case 0: {
        return (
          /** @type {CID<Data, API.DAG_PB, API.SHA_256, 0>} */
          this
        );
      }
      case 1: {
        const { code: code3, multihash } = this;
        if (code3 !== DAG_PB_CODE2) {
          throw new Error("Cannot convert a non dag-pb CID to CIDv0");
        }
        if (multihash.code !== SHA_256_CODE2) {
          throw new Error("Cannot convert non sha2-256 multihash CID to CIDv0");
        }
        return (
          /** @type {CID<Data, API.DAG_PB, API.SHA_256, 0>} */
          _CID.createV0(
            /** @type {API.MultihashDigest<API.SHA_256>} */
            multihash
          )
        );
      }
      default: {
        throw Error(
          `Can not convert CID version ${this.version} to version 0. This is a bug please report`
        );
      }
    }
  }
  /**
   * @returns {CID<Data, Format, Alg, 1>}
   */
  toV1() {
    switch (this.version) {
      case 0: {
        const { code: code3, digest } = this.multihash;
        const multihash = create2(code3, digest);
        return (
          /** @type {CID<Data, Format, Alg, 1>} */
          _CID.createV1(this.code, multihash)
        );
      }
      case 1: {
        return (
          /** @type {CID<Data, Format, Alg, 1>} */
          this
        );
      }
      default: {
        throw Error(
          `Can not convert CID version ${this.version} to version 1. This is a bug please report`
        );
      }
    }
  }
  /**
   * @param {unknown} other
   * @returns {other is CID<Data, Format, Alg, Version>}
   */
  equals(other) {
    return _CID.equals(this, other);
  }
  /**
   * @template {unknown} Data
   * @template {number} Format
   * @template {number} Alg
   * @template {API.Version} Version
   * @param {API.Link<Data, Format, Alg, Version>} self
   * @param {unknown} other
   * @returns {other is CID}
   */
  static equals(self, other) {
    const unknown = (
      /** @type {{code?:unknown, version?:unknown, multihash?:unknown}} */
      other
    );
    return unknown && self.code === unknown.code && self.version === unknown.version && equals4(self.multihash, unknown.multihash);
  }
  /**
   * @param {API.MultibaseEncoder<string>} [base]
   * @returns {string}
   */
  toString(base3) {
    return format2(this, base3);
  }
  /**
   * @returns {API.LinkJSON<this>}
   */
  toJSON() {
    return { "/": format2(this) };
  }
  link() {
    return this;
  }
  get [Symbol.toStringTag]() {
    return "CID";
  }
  // Legacy
  [Symbol.for("nodejs.util.inspect.custom")]() {
    return `CID(${this.toString()})`;
  }
  /**
   * Takes any input `value` and returns a `CID` instance if it was
   * a `CID` otherwise returns `null`. If `value` is instanceof `CID`
   * it will return value back. If `value` is not instance of this CID
   * class, but is compatible CID it will return new instance of this
   * `CID` class. Otherwise returns null.
   *
   * This allows two different incompatible versions of CID library to
   * co-exist and interop as long as binary interface is compatible.
   *
   * @template {unknown} Data
   * @template {number} Format
   * @template {number} Alg
   * @template {API.Version} Version
   * @template {unknown} U
   * @param {API.Link<Data, Format, Alg, Version>|U} input
   * @returns {CID<Data, Format, Alg, Version>|null}
   */
  static asCID(input) {
    if (input == null) {
      return null;
    }
    const value = (
      /** @type {any} */
      input
    );
    if (value instanceof _CID) {
      return value;
    } else if (value["/"] != null && value["/"] === value.bytes || value.asCID === value) {
      const { version, code: code3, multihash, bytes } = value;
      return new _CID(
        version,
        code3,
        /** @type {API.MultihashDigest<Alg>} */
        multihash,
        bytes || encodeCID2(version, code3, multihash.bytes)
      );
    } else if (value[cidSymbol2] === true) {
      const { version, multihash, code: code3 } = value;
      const digest = (
        /** @type {API.MultihashDigest<Alg>} */
        decode10(multihash)
      );
      return _CID.create(version, code3, digest);
    } else {
      return null;
    }
  }
  /**
   *
   * @template {unknown} Data
   * @template {number} Format
   * @template {number} Alg
   * @template {API.Version} Version
   * @param {Version} version - Version of the CID
   * @param {Format} code - Code of the codec content is encoded in, see https://github.com/multiformats/multicodec/blob/master/table.csv
   * @param {API.MultihashDigest<Alg>} digest - (Multi)hash of the of the content.
   * @returns {CID<Data, Format, Alg, Version>}
   */
  static create(version, code3, digest) {
    if (typeof code3 !== "number") {
      throw new Error("String codecs are no longer supported");
    }
    if (!(digest.bytes instanceof Uint8Array)) {
      throw new Error("Invalid digest");
    }
    switch (version) {
      case 0: {
        if (code3 !== DAG_PB_CODE2) {
          throw new Error(
            `Version 0 CID must use dag-pb (code: ${DAG_PB_CODE2}) block encoding`
          );
        } else {
          return new _CID(version, code3, digest, digest.bytes);
        }
      }
      case 1: {
        const bytes = encodeCID2(version, code3, digest.bytes);
        return new _CID(version, code3, digest, bytes);
      }
      default: {
        throw new Error("Invalid version");
      }
    }
  }
  /**
   * Simplified version of `create` for CIDv0.
   *
   * @template {unknown} [T=unknown]
   * @param {API.MultihashDigest<typeof SHA_256_CODE>} digest - Multihash.
   * @returns {CID<T, typeof DAG_PB_CODE, typeof SHA_256_CODE, 0>}
   */
  static createV0(digest) {
    return _CID.create(0, DAG_PB_CODE2, digest);
  }
  /**
   * Simplified version of `create` for CIDv1.
   *
   * @template {unknown} Data
   * @template {number} Code
   * @template {number} Alg
   * @param {Code} code - Content encoding format code.
   * @param {API.MultihashDigest<Alg>} digest - Miltihash of the content.
   * @returns {CID<Data, Code, Alg, 1>}
   */
  static createV1(code3, digest) {
    return _CID.create(1, code3, digest);
  }
  /**
   * Decoded a CID from its binary representation. The byte array must contain
   * only the CID with no additional bytes.
   *
   * An error will be thrown if the bytes provided do not contain a valid
   * binary representation of a CID.
   *
   * @template {unknown} Data
   * @template {number} Code
   * @template {number} Alg
   * @template {API.Version} Ver
   * @param {API.ByteView<API.Link<Data, Code, Alg, Ver>>} bytes
   * @returns {CID<Data, Code, Alg, Ver>}
   */
  static decode(bytes) {
    const [cid, remainder] = _CID.decodeFirst(bytes);
    if (remainder.length) {
      throw new Error("Incorrect length");
    }
    return cid;
  }
  /**
   * Decoded a CID from its binary representation at the beginning of a byte
   * array.
   *
   * Returns an array with the first element containing the CID and the second
   * element containing the remainder of the original byte array. The remainder
   * will be a zero-length byte array if the provided bytes only contained a
   * binary CID representation.
   *
   * @template {unknown} T
   * @template {number} C
   * @template {number} A
   * @template {API.Version} V
   * @param {API.ByteView<API.Link<T, C, A, V>>} bytes
   * @returns {[CID<T, C, A, V>, Uint8Array]}
   */
  static decodeFirst(bytes) {
    const specs = _CID.inspectBytes(bytes);
    const prefixSize = specs.size - specs.multihashSize;
    const multihashBytes = coerce2(
      bytes.subarray(prefixSize, prefixSize + specs.multihashSize)
    );
    if (multihashBytes.byteLength !== specs.multihashSize) {
      throw new Error("Incorrect length");
    }
    const digestBytes = multihashBytes.subarray(
      specs.multihashSize - specs.digestSize
    );
    const digest = new Digest2(
      specs.multihashCode,
      specs.digestSize,
      digestBytes,
      multihashBytes
    );
    const cid = specs.version === 0 ? _CID.createV0(
      /** @type {API.MultihashDigest<API.SHA_256>} */
      digest
    ) : _CID.createV1(specs.codec, digest);
    return [
      /** @type {CID<T, C, A, V>} */
      cid,
      bytes.subarray(specs.size)
    ];
  }
  /**
   * Inspect the initial bytes of a CID to determine its properties.
   *
   * Involves decoding up to 4 varints. Typically this will require only 4 to 6
   * bytes but for larger multicodec code values and larger multihash digest
   * lengths these varints can be quite large. It is recommended that at least
   * 10 bytes be made available in the `initialBytes` argument for a complete
   * inspection.
   *
   * @template {unknown} T
   * @template {number} C
   * @template {number} A
   * @template {API.Version} V
   * @param {API.ByteView<API.Link<T, C, A, V>>} initialBytes
   * @returns {{ version:V, codec:C, multihashCode:A, digestSize:number, multihashSize:number, size:number }}
   */
  static inspectBytes(initialBytes) {
    let offset = 0;
    const next = () => {
      const [i, length3] = decode9(initialBytes.subarray(offset));
      offset += length3;
      return i;
    };
    let version = (
      /** @type {V} */
      next()
    );
    let codec = (
      /** @type {C} */
      DAG_PB_CODE2
    );
    if (
      /** @type {number} */
      version === 18
    ) {
      version = /** @type {V} */
      0;
      offset = 0;
    } else {
      codec = /** @type {C} */
      next();
    }
    if (version !== 0 && version !== 1) {
      throw new RangeError(`Invalid CID version ${version}`);
    }
    const prefixSize = offset;
    const multihashCode = (
      /** @type {A} */
      next()
    );
    const digestSize = next();
    const size = offset + digestSize;
    const multihashSize = size - prefixSize;
    return { version, codec, multihashCode, digestSize, multihashSize, size };
  }
  /**
   * Takes cid in a string representation and creates an instance. If `base`
   * decoder is not provided will use a default from the configuration. It will
   * throw an error if encoding of the CID is not compatible with supplied (or
   * a default decoder).
   *
   * @template {string} Prefix
   * @template {unknown} Data
   * @template {number} Code
   * @template {number} Alg
   * @template {API.Version} Ver
   * @param {API.ToString<API.Link<Data, Code, Alg, Ver>, Prefix>} source
   * @param {API.MultibaseDecoder<Prefix>} [base]
   * @returns {CID<Data, Code, Alg, Ver>}
   */
  static parse(source, base3) {
    const [prefix, bytes] = parseCIDtoBytes2(source, base3);
    const cid = _CID.decode(bytes);
    if (cid.version === 0 && source[0] !== "Q") {
      throw Error("Version 0 CID string must not include multibase prefix");
    }
    baseCache2(cid).set(prefix, source);
    return cid;
  }
};
var parseCIDtoBytes2 = (source, base3) => {
  switch (source[0]) {
    case "Q": {
      const decoder = base3 || base58btc2;
      return [
        /** @type {Prefix} */
        base58btc2.prefix,
        decoder.decode(`${base58btc2.prefix}${source}`)
      ];
    }
    case base58btc2.prefix: {
      const decoder = base3 || base58btc2;
      return [
        /** @type {Prefix} */
        base58btc2.prefix,
        decoder.decode(source)
      ];
    }
    case base322.prefix: {
      const decoder = base3 || base322;
      return [
        /** @type {Prefix} */
        base322.prefix,
        decoder.decode(source)
      ];
    }
    default: {
      if (base3 == null) {
        throw Error(
          "To parse non base32 or base58btc encoded CID multibase decoder must be provided"
        );
      }
      return [
        /** @type {Prefix} */
        source[0],
        base3.decode(source)
      ];
    }
  }
};
var toStringV02 = (bytes, cache3, base3) => {
  const { prefix } = base3;
  if (prefix !== base58btc2.prefix) {
    throw Error(`Cannot string encode V0 in ${base3.name} encoding`);
  }
  const cid = cache3.get(prefix);
  if (cid == null) {
    const cid2 = base3.encode(bytes).slice(1);
    cache3.set(prefix, cid2);
    return cid2;
  } else {
    return cid;
  }
};
var toStringV12 = (bytes, cache3, base3) => {
  const { prefix } = base3;
  const cid = cache3.get(prefix);
  if (cid == null) {
    const cid2 = base3.encode(bytes);
    cache3.set(prefix, cid2);
    return cid2;
  } else {
    return cid;
  }
};
var DAG_PB_CODE2 = 112;
var SHA_256_CODE2 = 18;
var encodeCID2 = (version, code3, multihash) => {
  const codeOffset = encodingLength2(version);
  const hashOffset = codeOffset + encodingLength2(code3);
  const bytes = new Uint8Array(hashOffset + multihash.byteLength);
  encodeTo2(version, bytes, 0);
  encodeTo2(code3, bytes, codeOffset);
  bytes.set(multihash, hashOffset);
  return bytes;
};
var cidSymbol2 = Symbol.for("@ipld/js-cid/CID");

// node_modules/@ipld/car/src/decoder-common.js
var import_varint3 = __toESM(require_varint(), 1);
var V2_HEADER_LENGTH = (
  /* characteristics */
  16 + 8 + 8 + 8
);
function decodeVarint(bytes, seeker) {
  if (!bytes.length) {
    throw new Error("Unexpected end of data");
  }
  const i = import_varint3.default.decode(bytes);
  seeker.seek(
    /** @type {number} */
    import_varint3.default.decode.bytes
  );
  return i;
}
function decodeV2Header(bytes) {
  const dv = new DataView(bytes.buffer, bytes.byteOffset, bytes.byteLength);
  let offset = 0;
  const header = {
    version: 2,
    /** @type {[bigint, bigint]} */
    characteristics: [
      dv.getBigUint64(offset, true),
      dv.getBigUint64(offset += 8, true)
    ],
    dataOffset: Number(dv.getBigUint64(offset += 8, true)),
    dataSize: Number(dv.getBigUint64(offset += 8, true)),
    indexOffset: Number(dv.getBigUint64(offset += 8, true))
  };
  return header;
}

// node_modules/@ipld/car/src/header-validator.js
var Kinds = {
  Null: (
    /** @returns {undefined|null} */
    (obj) => obj === null ? obj : void 0
  ),
  Int: (
    /** @returns {undefined|number} */
    (obj) => Number.isInteger(obj) ? obj : void 0
  ),
  Float: (
    /** @returns {undefined|number} */
    (obj) => typeof obj === "number" && Number.isFinite(obj) ? obj : void 0
  ),
  String: (
    /** @returns {undefined|string} */
    (obj) => typeof obj === "string" ? obj : void 0
  ),
  Bool: (
    /** @returns {undefined|boolean} */
    (obj) => typeof obj === "boolean" ? obj : void 0
  ),
  Bytes: (
    /** @returns {undefined|Uint8Array} */
    (obj) => obj instanceof Uint8Array ? obj : void 0
  ),
  Link: (
    /** @returns {undefined|object} */
    (obj) => obj !== null && typeof obj === "object" && obj.asCID === obj ? obj : void 0
  ),
  List: (
    /** @returns {undefined|Array<any>} */
    (obj) => Array.isArray(obj) ? obj : void 0
  ),
  Map: (
    /** @returns {undefined|object} */
    (obj) => obj !== null && typeof obj === "object" && obj.asCID !== obj && !Array.isArray(obj) && !(obj instanceof Uint8Array) ? obj : void 0
  )
};
var Types = {
  "CarV1HeaderOrV2Pragma > roots (anon) > valueType (anon)": Kinds.Link,
  "CarV1HeaderOrV2Pragma > roots (anon)": (
    /** @returns {undefined|any} */
    (obj) => {
      if (Kinds.List(obj) === void 0) {
        return void 0;
      }
      for (let i = 0; i < obj.length; i++) {
        let v = obj[i];
        v = Types["CarV1HeaderOrV2Pragma > roots (anon) > valueType (anon)"](v);
        if (v === void 0) {
          return void 0;
        }
        if (v !== obj[i]) {
          const ret = obj.slice(0, i);
          for (let j = i; j < obj.length; j++) {
            let v2 = obj[j];
            v2 = Types["CarV1HeaderOrV2Pragma > roots (anon) > valueType (anon)"](v2);
            if (v2 === void 0) {
              return void 0;
            }
            ret.push(v2);
          }
          return ret;
        }
      }
      return obj;
    }
  ),
  Int: Kinds.Int,
  CarV1HeaderOrV2Pragma: (
    /** @returns {undefined|any} */
    (obj) => {
      if (Kinds.Map(obj) === void 0) {
        return void 0;
      }
      const entries = Object.entries(obj);
      let ret = obj;
      let requiredCount = 1;
      for (let i = 0; i < entries.length; i++) {
        const [key, value] = entries[i];
        switch (key) {
          case "roots":
            {
              const v = Types["CarV1HeaderOrV2Pragma > roots (anon)"](obj[key]);
              if (v === void 0) {
                return void 0;
              }
              if (v !== value || ret !== obj) {
                if (ret === obj) {
                  ret = {};
                  for (let j = 0; j < i; j++) {
                    ret[entries[j][0]] = entries[j][1];
                  }
                }
                ret.roots = v;
              }
            }
            break;
          case "version":
            {
              requiredCount--;
              const v = Types.Int(obj[key]);
              if (v === void 0) {
                return void 0;
              }
              if (v !== value || ret !== obj) {
                if (ret === obj) {
                  ret = {};
                  for (let j = 0; j < i; j++) {
                    ret[entries[j][0]] = entries[j][1];
                  }
                }
                ret.version = v;
              }
            }
            break;
          default:
            return void 0;
        }
      }
      if (requiredCount > 0) {
        return void 0;
      }
      return ret;
    }
  )
};
var Reprs = {
  "CarV1HeaderOrV2Pragma > roots (anon) > valueType (anon)": Kinds.Link,
  "CarV1HeaderOrV2Pragma > roots (anon)": (
    /** @returns {undefined|any} */
    (obj) => {
      if (Kinds.List(obj) === void 0) {
        return void 0;
      }
      for (let i = 0; i < obj.length; i++) {
        let v = obj[i];
        v = Reprs["CarV1HeaderOrV2Pragma > roots (anon) > valueType (anon)"](v);
        if (v === void 0) {
          return void 0;
        }
        if (v !== obj[i]) {
          const ret = obj.slice(0, i);
          for (let j = i; j < obj.length; j++) {
            let v2 = obj[j];
            v2 = Reprs["CarV1HeaderOrV2Pragma > roots (anon) > valueType (anon)"](v2);
            if (v2 === void 0) {
              return void 0;
            }
            ret.push(v2);
          }
          return ret;
        }
      }
      return obj;
    }
  ),
  Int: Kinds.Int,
  CarV1HeaderOrV2Pragma: (
    /** @returns {undefined|any} */
    (obj) => {
      if (Kinds.Map(obj) === void 0) {
        return void 0;
      }
      const entries = Object.entries(obj);
      let ret = obj;
      let requiredCount = 1;
      for (let i = 0; i < entries.length; i++) {
        const [key, value] = entries[i];
        switch (key) {
          case "roots":
            {
              const v = Reprs["CarV1HeaderOrV2Pragma > roots (anon)"](value);
              if (v === void 0) {
                return void 0;
              }
              if (v !== value || ret !== obj) {
                if (ret === obj) {
                  ret = {};
                  for (let j = 0; j < i; j++) {
                    ret[entries[j][0]] = entries[j][1];
                  }
                }
                ret.roots = v;
              }
            }
            break;
          case "version":
            {
              requiredCount--;
              const v = Reprs.Int(value);
              if (v === void 0) {
                return void 0;
              }
              if (v !== value || ret !== obj) {
                if (ret === obj) {
                  ret = {};
                  for (let j = 0; j < i; j++) {
                    ret[entries[j][0]] = entries[j][1];
                  }
                }
                ret.version = v;
              }
            }
            break;
          default:
            return void 0;
        }
      }
      if (requiredCount > 0) {
        return void 0;
      }
      return ret;
    }
  )
};
var CarV1HeaderOrV2Pragma = {
  toTyped: Types.CarV1HeaderOrV2Pragma,
  toRepresentation: Reprs.CarV1HeaderOrV2Pragma
};

// node_modules/@ipld/car/src/buffer-reader.js
var fsread = fs.readSync;

// node_modules/cborg/lib/length.js
var cborEncoders2 = makeCborEncoders();

// node_modules/@ipld/car/src/buffer-writer.js
var import_varint4 = __toESM(require_varint(), 1);
var headerPreludeTokens = [
  new Token(Type.map, 2),
  new Token(Type.string, "version"),
  new Token(Type.uint, 1),
  new Token(Type.string, "roots")
];
var CID_TAG = new Token(Type.tag, 42);

// node_modules/@ipld/car/src/decoder.js
async function readHeader(reader, strictVersion) {
  const length3 = decodeVarint(await reader.upTo(8), reader);
  if (length3 === 0) {
    throw new Error("Invalid CAR header (zero length)");
  }
  const header = await reader.exactly(length3, true);
  const block = decode6(header);
  if (CarV1HeaderOrV2Pragma.toTyped(block) === void 0) {
    throw new Error("Invalid CAR header format");
  }
  if (block.version !== 1 && block.version !== 2 || strictVersion !== void 0 && block.version !== strictVersion) {
    throw new Error(`Invalid CAR version: ${block.version}${strictVersion !== void 0 ? ` (expected ${strictVersion})` : ""}`);
  }
  if (block.version === 1) {
    if (!Array.isArray(block.roots)) {
      throw new Error("Invalid CAR header format");
    }
    return block;
  }
  if (block.roots !== void 0) {
    throw new Error("Invalid CAR header format");
  }
  const v2Header = decodeV2Header(await reader.exactly(V2_HEADER_LENGTH, true));
  reader.seek(v2Header.dataOffset - reader.pos);
  const v1Header = await readHeader(reader, 1);
  return Object.assign(v1Header, v2Header);
}
function bytesReader(bytes) {
  let pos = 0;
  return {
    async upTo(length3) {
      const out = bytes.subarray(pos, pos + Math.min(length3, bytes.length - pos));
      return out;
    },
    async exactly(length3, seek = false) {
      if (length3 > bytes.length - pos) {
        throw new Error("Unexpected end of data");
      }
      const out = bytes.subarray(pos, pos + length3);
      if (seek) {
        pos += length3;
      }
      return out;
    },
    seek(length3) {
      pos += length3;
    },
    get pos() {
      return pos;
    }
  };
}
function chunkReader(readChunk) {
  let pos = 0;
  let have = 0;
  let offset = 0;
  let currentChunk = new Uint8Array(0);
  const read3 = async (length3) => {
    have = currentChunk.length - offset;
    const bufa = [currentChunk.subarray(offset)];
    while (have < length3) {
      const chunk = await readChunk();
      if (chunk == null) {
        break;
      }
      if (have < 0) {
        if (chunk.length > have) {
          bufa.push(chunk.subarray(-have));
        }
      } else {
        bufa.push(chunk);
      }
      have += chunk.length;
    }
    currentChunk = new Uint8Array(bufa.reduce((p, c) => p + c.length, 0));
    let off = 0;
    for (const b of bufa) {
      currentChunk.set(b, off);
      off += b.length;
    }
    offset = 0;
  };
  return {
    async upTo(length3) {
      if (currentChunk.length - offset < length3) {
        await read3(length3);
      }
      return currentChunk.subarray(offset, offset + Math.min(currentChunk.length - offset, length3));
    },
    async exactly(length3, seek = false) {
      if (currentChunk.length - offset < length3) {
        await read3(length3);
      }
      if (currentChunk.length - offset < length3) {
        throw new Error("Unexpected end of data");
      }
      const out = currentChunk.subarray(offset, offset + length3);
      if (seek) {
        pos += length3;
        offset += length3;
      }
      return out;
    },
    seek(length3) {
      pos += length3;
      offset += length3;
    },
    get pos() {
      return pos;
    }
  };
}

// node_modules/@ipld/car/src/reader.js
import fs2 from "fs";
import { promisify } from "util";
var fsread2 = promisify(fs2.read);

// node_modules/@ipld/car/src/writer.js
import fs3 from "fs";
import { promisify as promisify2 } from "util";

// node_modules/@ipld/car/src/encoder.js
var import_varint5 = __toESM(require_varint(), 1);
function createHeader(roots) {
  const headerBytes = encode4({ version: 1, roots });
  const varintBytes = import_varint5.default.encode(headerBytes.length);
  const header = new Uint8Array(varintBytes.length + headerBytes.length);
  header.set(varintBytes, 0);
  header.set(headerBytes, varintBytes.length);
  return header;
}
function createEncoder(writer) {
  return {
    /**
     * @param {CID[]} roots
     * @returns {Promise<void>}
     */
    async setRoots(roots) {
      const bytes = createHeader(roots);
      await writer.write(bytes);
    },
    /**
     * @param {Block} block
     * @returns {Promise<void>}
     */
    async writeBlock(block) {
      const { cid, bytes } = block;
      await writer.write(new Uint8Array(import_varint5.default.encode(cid.bytes.length + bytes.length)));
      await writer.write(cid.bytes);
      if (bytes.length) {
        await writer.write(bytes);
      }
    },
    /**
     * @returns {Promise<void>}
     */
    async close() {
      await writer.end();
    }
  };
}

// node_modules/@ipld/car/src/iterator-channel.js
function noop() {
}
function create3() {
  const chunkQueue = [];
  let drainer = null;
  let drainerResolver = noop;
  let ended = false;
  let outWait = null;
  let outWaitResolver = noop;
  const makeDrainer = () => {
    if (!drainer) {
      drainer = new Promise((resolve) => {
        drainerResolver = () => {
          drainer = null;
          drainerResolver = noop;
          resolve();
        };
      });
    }
    return drainer;
  };
  const writer = {
    /**
     * @param {T} chunk
     * @returns {Promise<void>}
     */
    write(chunk) {
      chunkQueue.push(chunk);
      const drainer2 = makeDrainer();
      outWaitResolver();
      return drainer2;
    },
    async end() {
      ended = true;
      const drainer2 = makeDrainer();
      outWaitResolver();
      await drainer2;
    }
  };
  const iterator = {
    /** @returns {Promise<IteratorResult<T>>} */
    async next() {
      const chunk = chunkQueue.shift();
      if (chunk) {
        if (chunkQueue.length === 0) {
          drainerResolver();
        }
        return { done: false, value: chunk };
      }
      if (ended) {
        drainerResolver();
        return { done: true, value: void 0 };
      }
      if (!outWait) {
        outWait = new Promise((resolve) => {
          outWaitResolver = () => {
            outWait = null;
            outWaitResolver = noop;
            return resolve(iterator.next());
          };
        });
      }
      return outWait;
    }
  };
  return { writer, iterator };
}

// node_modules/@ipld/car/src/writer-browser.js
var CarWriter = class _CarWriter {
  /**
   * @param {CID[]} roots
   * @param {CarEncoder} encoder
   */
  constructor(roots, encoder) {
    this._encoder = encoder;
    this._mutex = encoder.setRoots(roots);
    this._ended = false;
  }
  /**
   * Write a `Block` (a `{ cid:CID, bytes:Uint8Array }` pair) to the archive.
   *
   * @function
   * @memberof CarWriter
   * @instance
   * @async
   * @param {Block} block - A `{ cid:CID, bytes:Uint8Array }` pair.
   * @returns {Promise<void>} The returned promise will only resolve once the
   * bytes this block generates are written to the `out` iterable.
   */
  async put(block) {
    if (!(block.bytes instanceof Uint8Array) || !block.cid) {
      throw new TypeError("Can only write {cid, bytes} objects");
    }
    if (this._ended) {
      throw new Error("Already closed");
    }
    const cid = CID2.asCID(block.cid);
    if (!cid) {
      throw new TypeError("Can only write {cid, bytes} objects");
    }
    this._mutex = this._mutex.then(() => this._encoder.writeBlock({ cid, bytes: block.bytes }));
    return this._mutex;
  }
  /**
   * Finalise the CAR archive and signal that the `out` iterable should end once
   * any remaining bytes are written.
   *
   * @function
   * @memberof CarWriter
   * @instance
   * @async
   * @returns {Promise<void>}
   */
  async close() {
    if (this._ended) {
      throw new Error("Already closed");
    }
    await this._mutex;
    this._ended = true;
    return this._encoder.close();
  }
  /**
   * Create a new CAR writer "channel" which consists of a
   * `{ writer:CarWriter, out:AsyncIterable<Uint8Array> }` pair.
   *
   * @async
   * @static
   * @memberof CarWriter
   * @param {CID[] | CID | void} roots
   * @returns {WriterChannel} The channel takes the form of
   * `{ writer:CarWriter, out:AsyncIterable<Uint8Array> }`.
   */
  static create(roots) {
    roots = toRoots(roots);
    const { encoder, iterator } = encodeWriter();
    const writer = new _CarWriter(roots, encoder);
    const out = new CarWriterOut(iterator);
    return { writer, out };
  }
  /**
   * Create a new CAR appender "channel" which consists of a
   * `{ writer:CarWriter, out:AsyncIterable<Uint8Array> }` pair.
   * This appender does not consider roots and does not produce a CAR header.
   * It is designed to append blocks to an _existing_ CAR archive. It is
   * expected that `out` will be concatenated onto the end of an existing
   * archive that already has a properly formatted header.
   *
   * @async
   * @static
   * @memberof CarWriter
   * @returns {WriterChannel} The channel takes the form of
   * `{ writer:CarWriter, out:AsyncIterable<Uint8Array> }`.
   */
  static createAppender() {
    const { encoder, iterator } = encodeWriter();
    encoder.setRoots = () => Promise.resolve();
    const writer = new _CarWriter([], encoder);
    const out = new CarWriterOut(iterator);
    return { writer, out };
  }
  /**
   * Update the list of roots in the header of an existing CAR as represented
   * in a Uint8Array.
   *
   * This operation is an _overwrite_, the total length of the CAR will not be
   * modified. A rejection will occur if the new header will not be the same
   * length as the existing header, in which case the CAR will not be modified.
   * It is the responsibility of the user to ensure that the roots being
   * replaced encode as the same length as the new roots.
   *
   * The byte array passed in an argument will be modified and also returned
   * upon successful modification.
   *
   * @async
   * @static
   * @memberof CarWriter
   * @param {Uint8Array} bytes
   * @param {CID[]} roots - A new list of roots to replace the existing list in
   * the CAR header. The new header must take up the same number of bytes as the
   * existing header, so the roots should collectively be the same byte length
   * as the existing roots.
   * @returns {Promise<Uint8Array>}
   */
  static async updateRootsInBytes(bytes, roots) {
    const reader = bytesReader(bytes);
    await readHeader(reader);
    const newHeader = createHeader(roots);
    if (Number(reader.pos) !== newHeader.length) {
      throw new Error(`updateRoots() can only overwrite a header of the same length (old header is ${reader.pos} bytes, new header is ${newHeader.length} bytes)`);
    }
    bytes.set(newHeader, 0);
    return bytes;
  }
};
var CarWriterOut = class {
  /**
   * @param {AsyncIterator<Uint8Array>} iterator
   */
  constructor(iterator) {
    this._iterator = iterator;
  }
  [Symbol.asyncIterator]() {
    if (this._iterating) {
      throw new Error("Multiple iterator not supported");
    }
    this._iterating = true;
    return this._iterator;
  }
};
function encodeWriter() {
  const iw = create3();
  const { writer, iterator } = iw;
  const encoder = createEncoder(writer);
  return { encoder, iterator };
}
function toRoots(roots) {
  if (roots === void 0) {
    return [];
  }
  if (!Array.isArray(roots)) {
    const cid = CID2.asCID(roots);
    if (!cid) {
      throw new TypeError("roots must be a single CID or an array of CIDs");
    }
    return [cid];
  }
  const _roots = [];
  for (const root of roots) {
    const _root = CID2.asCID(root);
    if (!_root) {
      throw new TypeError("roots must be a single CID or an array of CIDs");
    }
    _roots.push(_root);
  }
  return _roots;
}

// node_modules/@ipld/car/src/writer.js
var fsread3 = promisify2(fs3.read);
var fswrite = promisify2(fs3.write);
var CarWriter2 = class extends CarWriter {
  /**
   * Update the list of roots in the header of an existing CAR file. The first
   * argument must be a file descriptor for CAR file that is open in read and
   * write mode (not append), e.g. `fs.open` or `fs.promises.open` with `'r+'`
   * mode.
   *
   * This operation is an _overwrite_, the total length of the CAR will not be
   * modified. A rejection will occur if the new header will not be the same
   * length as the existing header, in which case the CAR will not be modified.
   * It is the responsibility of the user to ensure that the roots being
   * replaced encode as the same length as the new roots.
   *
   * This function is **only available in Node.js** and not a browser
   * environment.
   *
   * @async
   * @static
   * @memberof CarWriter
   * @param {fs.promises.FileHandle | number} fd - A file descriptor from the
   * Node.js `fs` module. Either an integer, from `fs.open()` or a `FileHandle`
   * from `fs.promises.open()`.
   * @param {CID[]} roots - A new list of roots to replace the existing list in
   * the CAR header. The new header must take up the same number of bytes as the
   * existing header, so the roots should collectively be the same byte length
   * as the existing roots.
   * @returns {Promise<void>}
   */
  static async updateRootsInFile(fd, roots) {
    const chunkSize = 256;
    let bytes;
    let offset = 0;
    let readChunk;
    if (typeof fd === "number") {
      readChunk = async () => (await fsread3(fd, bytes, 0, chunkSize, offset)).bytesRead;
    } else if (typeof fd === "object" && typeof fd.read === "function") {
      readChunk = async () => (await fd.read(bytes, 0, chunkSize, offset)).bytesRead;
    } else {
      throw new TypeError("Bad fd");
    }
    const fdReader = chunkReader(async () => {
      bytes = new Uint8Array(chunkSize);
      const read3 = await readChunk();
      offset += read3;
      return read3 < chunkSize ? bytes.subarray(0, read3) : bytes;
    });
    await readHeader(fdReader);
    const newHeader = createHeader(roots);
    if (fdReader.pos !== newHeader.length) {
      throw new Error(`updateRoots() can only overwrite a header of the same length (old header is ${fdReader.pos} bytes, new header is ${newHeader.length} bytes)`);
    }
    if (typeof fd === "number") {
      await fswrite(fd, newHeader, 0, newHeader.length, 0);
    } else if (typeof fd === "object" && typeof fd.read === "function") {
      await fd.write(newHeader, 0, newHeader.length, 0);
    }
  }
};

// node_modules/it-drain/dist/src/index.js
function isAsyncIterable(thing) {
  return thing[Symbol.asyncIterator] != null;
}
function drain(source) {
  if (isAsyncIterable(source)) {
    return (async () => {
      for await (const _ of source) {
      }
    })();
  } else {
    for (const _ of source) {
    }
  }
}
var src_default = drain;

// node_modules/it-peekable/dist/src/index.js
function peekable(iterable) {
  const [iterator, symbol] = iterable[Symbol.asyncIterator] != null ? [iterable[Symbol.asyncIterator](), Symbol.asyncIterator] : [iterable[Symbol.iterator](), Symbol.iterator];
  const queue = [];
  return {
    peek: () => {
      return iterator.next();
    },
    push: (value) => {
      queue.push(value);
    },
    next: () => {
      if (queue.length > 0) {
        return {
          done: false,
          value: queue.shift()
        };
      }
      return iterator.next();
    },
    [symbol]() {
      return this;
    }
  };
}
var src_default2 = peekable;

// node_modules/it-map/dist/src/index.js
function isAsyncIterable2(thing) {
  return thing[Symbol.asyncIterator] != null;
}
function map(source, func) {
  if (isAsyncIterable2(source)) {
    return async function* () {
      for await (const val of source) {
        yield func(val);
      }
    }();
  }
  const peekable2 = src_default2(source);
  const { value, done } = peekable2.next();
  if (done === true) {
    return function* () {
    }();
  }
  const res = func(value);
  if (typeof res.then === "function") {
    return async function* () {
      yield await res;
      for await (const val of peekable2) {
        yield func(val);
      }
    }();
  }
  const fn = func;
  return function* () {
    yield res;
    for (const val of peekable2) {
      yield fn(val);
    }
  }();
}
var src_default3 = map;

// node_modules/p-defer/index.js
function pDefer() {
  const deferred = {};
  deferred.promise = new Promise((resolve, reject) => {
    deferred.resolve = resolve;
    deferred.reject = reject;
  });
  return deferred;
}

// node_modules/eventemitter3/index.mjs
var import_index = __toESM(require_eventemitter3(), 1);

// node_modules/p-timeout/index.js
var TimeoutError = class extends Error {
  constructor(message) {
    super(message);
    this.name = "TimeoutError";
  }
};
var AbortError = class extends Error {
  constructor(message) {
    super();
    this.name = "AbortError";
    this.message = message;
  }
};
var getDOMException = (errorMessage) => globalThis.DOMException === void 0 ? new AbortError(errorMessage) : new DOMException(errorMessage);
var getAbortedReason = (signal) => {
  const reason = signal.reason === void 0 ? getDOMException("This operation was aborted.") : signal.reason;
  return reason instanceof Error ? reason : getDOMException(reason);
};
function pTimeout(promise, milliseconds, fallback, options) {
  let timer;
  const cancelablePromise = new Promise((resolve, reject) => {
    if (typeof milliseconds !== "number" || Math.sign(milliseconds) !== 1) {
      throw new TypeError(`Expected \`milliseconds\` to be a positive number, got \`${milliseconds}\``);
    }
    if (milliseconds === Number.POSITIVE_INFINITY) {
      resolve(promise);
      return;
    }
    options = {
      customTimers: { setTimeout, clearTimeout },
      ...options
    };
    if (options.signal) {
      const { signal } = options;
      if (signal.aborted) {
        reject(getAbortedReason(signal));
      }
      signal.addEventListener("abort", () => {
        reject(getAbortedReason(signal));
      });
    }
    timer = options.customTimers.setTimeout.call(void 0, () => {
      if (typeof fallback === "function") {
        try {
          resolve(fallback());
        } catch (error) {
          reject(error);
        }
        return;
      }
      const message = typeof fallback === "string" ? fallback : `Promise timed out after ${milliseconds} milliseconds`;
      const timeoutError = fallback instanceof Error ? fallback : new TimeoutError(message);
      if (typeof promise.cancel === "function") {
        promise.cancel();
      }
      reject(timeoutError);
    }, milliseconds);
    (async () => {
      try {
        resolve(await promise);
      } catch (error) {
        reject(error);
      } finally {
        options.customTimers.clearTimeout.call(void 0, timer);
      }
    })();
  });
  cancelablePromise.clear = () => {
    clearTimeout(timer);
    timer = void 0;
  };
  return cancelablePromise;
}

// node_modules/p-queue/dist/lower-bound.js
function lowerBound(array, value, comparator) {
  let first = 0;
  let count = array.length;
  while (count > 0) {
    const step = Math.trunc(count / 2);
    let it = first + step;
    if (comparator(array[it], value) <= 0) {
      first = ++it;
      count -= step + 1;
    } else {
      count = step;
    }
  }
  return first;
}

// node_modules/p-queue/dist/priority-queue.js
var __classPrivateFieldGet = function(receiver, state, kind, f) {
  if (kind === "a" && !f)
    throw new TypeError("Private accessor was defined without a getter");
  if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver))
    throw new TypeError("Cannot read private member from an object whose class did not declare it");
  return kind === "m" ? f : kind === "a" ? f.call(receiver) : f ? f.value : state.get(receiver);
};
var _PriorityQueue_queue;
var PriorityQueue = class {
  constructor() {
    _PriorityQueue_queue.set(this, []);
  }
  enqueue(run, options) {
    options = {
      priority: 0,
      ...options
    };
    const element = {
      priority: options.priority,
      run
    };
    if (this.size && __classPrivateFieldGet(this, _PriorityQueue_queue, "f")[this.size - 1].priority >= options.priority) {
      __classPrivateFieldGet(this, _PriorityQueue_queue, "f").push(element);
      return;
    }
    const index = lowerBound(__classPrivateFieldGet(this, _PriorityQueue_queue, "f"), element, (a, b) => b.priority - a.priority);
    __classPrivateFieldGet(this, _PriorityQueue_queue, "f").splice(index, 0, element);
  }
  dequeue() {
    const item = __classPrivateFieldGet(this, _PriorityQueue_queue, "f").shift();
    return item === null || item === void 0 ? void 0 : item.run;
  }
  filter(options) {
    return __classPrivateFieldGet(this, _PriorityQueue_queue, "f").filter((element) => element.priority === options.priority).map((element) => element.run);
  }
  get size() {
    return __classPrivateFieldGet(this, _PriorityQueue_queue, "f").length;
  }
};
_PriorityQueue_queue = /* @__PURE__ */ new WeakMap();
var priority_queue_default = PriorityQueue;

// node_modules/p-queue/dist/index.js
var __classPrivateFieldSet = function(receiver, state, value, kind, f) {
  if (kind === "m")
    throw new TypeError("Private method is not writable");
  if (kind === "a" && !f)
    throw new TypeError("Private accessor was defined without a setter");
  if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver))
    throw new TypeError("Cannot write private member to an object whose class did not declare it");
  return kind === "a" ? f.call(receiver, value) : f ? f.value = value : state.set(receiver, value), value;
};
var __classPrivateFieldGet2 = function(receiver, state, kind, f) {
  if (kind === "a" && !f)
    throw new TypeError("Private accessor was defined without a getter");
  if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver))
    throw new TypeError("Cannot read private member from an object whose class did not declare it");
  return kind === "m" ? f : kind === "a" ? f.call(receiver) : f ? f.value : state.get(receiver);
};
var _PQueue_instances;
var _PQueue_carryoverConcurrencyCount;
var _PQueue_isIntervalIgnored;
var _PQueue_intervalCount;
var _PQueue_intervalCap;
var _PQueue_interval;
var _PQueue_intervalEnd;
var _PQueue_intervalId;
var _PQueue_timeoutId;
var _PQueue_queue;
var _PQueue_queueClass;
var _PQueue_pending;
var _PQueue_concurrency;
var _PQueue_isPaused;
var _PQueue_throwOnTimeout;
var _PQueue_doesIntervalAllowAnother_get;
var _PQueue_doesConcurrentAllowAnother_get;
var _PQueue_next;
var _PQueue_onResumeInterval;
var _PQueue_isIntervalPaused_get;
var _PQueue_tryToStartAnother;
var _PQueue_initializeIntervalIfNeeded;
var _PQueue_onInterval;
var _PQueue_processQueue;
var _PQueue_throwOnAbort;
var _PQueue_onEvent;
var AbortError2 = class extends Error {
};
var PQueue = class extends import_index.default {
  // TODO: The `throwOnTimeout` option should affect the return types of `add()` and `addAll()`
  constructor(options) {
    var _a, _b, _c, _d;
    super();
    _PQueue_instances.add(this);
    _PQueue_carryoverConcurrencyCount.set(this, void 0);
    _PQueue_isIntervalIgnored.set(this, void 0);
    _PQueue_intervalCount.set(this, 0);
    _PQueue_intervalCap.set(this, void 0);
    _PQueue_interval.set(this, void 0);
    _PQueue_intervalEnd.set(this, 0);
    _PQueue_intervalId.set(this, void 0);
    _PQueue_timeoutId.set(this, void 0);
    _PQueue_queue.set(this, void 0);
    _PQueue_queueClass.set(this, void 0);
    _PQueue_pending.set(this, 0);
    _PQueue_concurrency.set(this, void 0);
    _PQueue_isPaused.set(this, void 0);
    _PQueue_throwOnTimeout.set(this, void 0);
    Object.defineProperty(this, "timeout", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: void 0
    });
    options = {
      carryoverConcurrencyCount: false,
      intervalCap: Number.POSITIVE_INFINITY,
      interval: 0,
      concurrency: Number.POSITIVE_INFINITY,
      autoStart: true,
      queueClass: priority_queue_default,
      ...options
    };
    if (!(typeof options.intervalCap === "number" && options.intervalCap >= 1)) {
      throw new TypeError(`Expected \`intervalCap\` to be a number from 1 and up, got \`${(_b = (_a = options.intervalCap) === null || _a === void 0 ? void 0 : _a.toString()) !== null && _b !== void 0 ? _b : ""}\` (${typeof options.intervalCap})`);
    }
    if (options.interval === void 0 || !(Number.isFinite(options.interval) && options.interval >= 0)) {
      throw new TypeError(`Expected \`interval\` to be a finite number >= 0, got \`${(_d = (_c = options.interval) === null || _c === void 0 ? void 0 : _c.toString()) !== null && _d !== void 0 ? _d : ""}\` (${typeof options.interval})`);
    }
    __classPrivateFieldSet(this, _PQueue_carryoverConcurrencyCount, options.carryoverConcurrencyCount, "f");
    __classPrivateFieldSet(this, _PQueue_isIntervalIgnored, options.intervalCap === Number.POSITIVE_INFINITY || options.interval === 0, "f");
    __classPrivateFieldSet(this, _PQueue_intervalCap, options.intervalCap, "f");
    __classPrivateFieldSet(this, _PQueue_interval, options.interval, "f");
    __classPrivateFieldSet(this, _PQueue_queue, new options.queueClass(), "f");
    __classPrivateFieldSet(this, _PQueue_queueClass, options.queueClass, "f");
    this.concurrency = options.concurrency;
    this.timeout = options.timeout;
    __classPrivateFieldSet(this, _PQueue_throwOnTimeout, options.throwOnTimeout === true, "f");
    __classPrivateFieldSet(this, _PQueue_isPaused, options.autoStart === false, "f");
  }
  get concurrency() {
    return __classPrivateFieldGet2(this, _PQueue_concurrency, "f");
  }
  set concurrency(newConcurrency) {
    if (!(typeof newConcurrency === "number" && newConcurrency >= 1)) {
      throw new TypeError(`Expected \`concurrency\` to be a number from 1 and up, got \`${newConcurrency}\` (${typeof newConcurrency})`);
    }
    __classPrivateFieldSet(this, _PQueue_concurrency, newConcurrency, "f");
    __classPrivateFieldGet2(this, _PQueue_instances, "m", _PQueue_processQueue).call(this);
  }
  async add(function_, options = {}) {
    options = {
      timeout: this.timeout,
      throwOnTimeout: __classPrivateFieldGet2(this, _PQueue_throwOnTimeout, "f"),
      ...options
    };
    return new Promise((resolve, reject) => {
      __classPrivateFieldGet2(this, _PQueue_queue, "f").enqueue(async () => {
        var _a;
        var _b, _c;
        __classPrivateFieldSet(this, _PQueue_pending, (_b = __classPrivateFieldGet2(this, _PQueue_pending, "f"), _b++, _b), "f");
        __classPrivateFieldSet(this, _PQueue_intervalCount, (_c = __classPrivateFieldGet2(this, _PQueue_intervalCount, "f"), _c++, _c), "f");
        try {
          if ((_a = options.signal) === null || _a === void 0 ? void 0 : _a.aborted) {
            throw new AbortError2("The task was aborted.");
          }
          let operation = function_({ signal: options.signal });
          if (options.timeout) {
            operation = pTimeout(Promise.resolve(operation), options.timeout);
          }
          if (options.signal) {
            operation = Promise.race([operation, __classPrivateFieldGet2(this, _PQueue_instances, "m", _PQueue_throwOnAbort).call(this, options.signal)]);
          }
          const result = await operation;
          resolve(result);
          this.emit("completed", result);
        } catch (error) {
          if (error instanceof TimeoutError && !options.throwOnTimeout) {
            resolve();
            return;
          }
          reject(error);
          this.emit("error", error);
        } finally {
          __classPrivateFieldGet2(this, _PQueue_instances, "m", _PQueue_next).call(this);
        }
      }, options);
      this.emit("add");
      __classPrivateFieldGet2(this, _PQueue_instances, "m", _PQueue_tryToStartAnother).call(this);
    });
  }
  async addAll(functions, options) {
    return Promise.all(functions.map(async (function_) => this.add(function_, options)));
  }
  /**
  Start (or resume) executing enqueued tasks within concurrency limit. No need to call this if queue is not paused (via `options.autoStart = false` or by `.pause()` method.)
  */
  start() {
    if (!__classPrivateFieldGet2(this, _PQueue_isPaused, "f")) {
      return this;
    }
    __classPrivateFieldSet(this, _PQueue_isPaused, false, "f");
    __classPrivateFieldGet2(this, _PQueue_instances, "m", _PQueue_processQueue).call(this);
    return this;
  }
  /**
  Put queue execution on hold.
  */
  pause() {
    __classPrivateFieldSet(this, _PQueue_isPaused, true, "f");
  }
  /**
  Clear the queue.
  */
  clear() {
    __classPrivateFieldSet(this, _PQueue_queue, new (__classPrivateFieldGet2(this, _PQueue_queueClass, "f"))(), "f");
  }
  /**
      Can be called multiple times. Useful if you for example add additional items at a later time.
  
      @returns A promise that settles when the queue becomes empty.
      */
  async onEmpty() {
    if (__classPrivateFieldGet2(this, _PQueue_queue, "f").size === 0) {
      return;
    }
    await __classPrivateFieldGet2(this, _PQueue_instances, "m", _PQueue_onEvent).call(this, "empty");
  }
  /**
      @returns A promise that settles when the queue size is less than the given limit: `queue.size < limit`.
  
      If you want to avoid having the queue grow beyond a certain size you can `await queue.onSizeLessThan()` before adding a new item.
  
      Note that this only limits the number of items waiting to start. There could still be up to `concurrency` jobs already running that this call does not include in its calculation.
      */
  async onSizeLessThan(limit) {
    if (__classPrivateFieldGet2(this, _PQueue_queue, "f").size < limit) {
      return;
    }
    await __classPrivateFieldGet2(this, _PQueue_instances, "m", _PQueue_onEvent).call(this, "next", () => __classPrivateFieldGet2(this, _PQueue_queue, "f").size < limit);
  }
  /**
      The difference with `.onEmpty` is that `.onIdle` guarantees that all work from the queue has finished. `.onEmpty` merely signals that the queue is empty, but it could mean that some promises haven't completed yet.
  
      @returns A promise that settles when the queue becomes empty, and all promises have completed; `queue.size === 0 && queue.pending === 0`.
      */
  async onIdle() {
    if (__classPrivateFieldGet2(this, _PQueue_pending, "f") === 0 && __classPrivateFieldGet2(this, _PQueue_queue, "f").size === 0) {
      return;
    }
    await __classPrivateFieldGet2(this, _PQueue_instances, "m", _PQueue_onEvent).call(this, "idle");
  }
  /**
  Size of the queue, the number of queued items waiting to run.
  */
  get size() {
    return __classPrivateFieldGet2(this, _PQueue_queue, "f").size;
  }
  /**
      Size of the queue, filtered by the given options.
  
      For example, this can be used to find the number of items remaining in the queue with a specific priority level.
      */
  sizeBy(options) {
    return __classPrivateFieldGet2(this, _PQueue_queue, "f").filter(options).length;
  }
  /**
  Number of running items (no longer in the queue).
  */
  get pending() {
    return __classPrivateFieldGet2(this, _PQueue_pending, "f");
  }
  /**
  Whether the queue is currently paused.
  */
  get isPaused() {
    return __classPrivateFieldGet2(this, _PQueue_isPaused, "f");
  }
};
_PQueue_carryoverConcurrencyCount = /* @__PURE__ */ new WeakMap(), _PQueue_isIntervalIgnored = /* @__PURE__ */ new WeakMap(), _PQueue_intervalCount = /* @__PURE__ */ new WeakMap(), _PQueue_intervalCap = /* @__PURE__ */ new WeakMap(), _PQueue_interval = /* @__PURE__ */ new WeakMap(), _PQueue_intervalEnd = /* @__PURE__ */ new WeakMap(), _PQueue_intervalId = /* @__PURE__ */ new WeakMap(), _PQueue_timeoutId = /* @__PURE__ */ new WeakMap(), _PQueue_queue = /* @__PURE__ */ new WeakMap(), _PQueue_queueClass = /* @__PURE__ */ new WeakMap(), _PQueue_pending = /* @__PURE__ */ new WeakMap(), _PQueue_concurrency = /* @__PURE__ */ new WeakMap(), _PQueue_isPaused = /* @__PURE__ */ new WeakMap(), _PQueue_throwOnTimeout = /* @__PURE__ */ new WeakMap(), _PQueue_instances = /* @__PURE__ */ new WeakSet(), _PQueue_doesIntervalAllowAnother_get = function _PQueue_doesIntervalAllowAnother_get2() {
  return __classPrivateFieldGet2(this, _PQueue_isIntervalIgnored, "f") || __classPrivateFieldGet2(this, _PQueue_intervalCount, "f") < __classPrivateFieldGet2(this, _PQueue_intervalCap, "f");
}, _PQueue_doesConcurrentAllowAnother_get = function _PQueue_doesConcurrentAllowAnother_get2() {
  return __classPrivateFieldGet2(this, _PQueue_pending, "f") < __classPrivateFieldGet2(this, _PQueue_concurrency, "f");
}, _PQueue_next = function _PQueue_next2() {
  var _a;
  __classPrivateFieldSet(this, _PQueue_pending, (_a = __classPrivateFieldGet2(this, _PQueue_pending, "f"), _a--, _a), "f");
  __classPrivateFieldGet2(this, _PQueue_instances, "m", _PQueue_tryToStartAnother).call(this);
  this.emit("next");
}, _PQueue_onResumeInterval = function _PQueue_onResumeInterval2() {
  __classPrivateFieldGet2(this, _PQueue_instances, "m", _PQueue_onInterval).call(this);
  __classPrivateFieldGet2(this, _PQueue_instances, "m", _PQueue_initializeIntervalIfNeeded).call(this);
  __classPrivateFieldSet(this, _PQueue_timeoutId, void 0, "f");
}, _PQueue_isIntervalPaused_get = function _PQueue_isIntervalPaused_get2() {
  const now = Date.now();
  if (__classPrivateFieldGet2(this, _PQueue_intervalId, "f") === void 0) {
    const delay = __classPrivateFieldGet2(this, _PQueue_intervalEnd, "f") - now;
    if (delay < 0) {
      __classPrivateFieldSet(this, _PQueue_intervalCount, __classPrivateFieldGet2(this, _PQueue_carryoverConcurrencyCount, "f") ? __classPrivateFieldGet2(this, _PQueue_pending, "f") : 0, "f");
    } else {
      if (__classPrivateFieldGet2(this, _PQueue_timeoutId, "f") === void 0) {
        __classPrivateFieldSet(this, _PQueue_timeoutId, setTimeout(() => {
          __classPrivateFieldGet2(this, _PQueue_instances, "m", _PQueue_onResumeInterval).call(this);
        }, delay), "f");
      }
      return true;
    }
  }
  return false;
}, _PQueue_tryToStartAnother = function _PQueue_tryToStartAnother2() {
  if (__classPrivateFieldGet2(this, _PQueue_queue, "f").size === 0) {
    if (__classPrivateFieldGet2(this, _PQueue_intervalId, "f")) {
      clearInterval(__classPrivateFieldGet2(this, _PQueue_intervalId, "f"));
    }
    __classPrivateFieldSet(this, _PQueue_intervalId, void 0, "f");
    this.emit("empty");
    if (__classPrivateFieldGet2(this, _PQueue_pending, "f") === 0) {
      this.emit("idle");
    }
    return false;
  }
  if (!__classPrivateFieldGet2(this, _PQueue_isPaused, "f")) {
    const canInitializeInterval = !__classPrivateFieldGet2(this, _PQueue_instances, "a", _PQueue_isIntervalPaused_get);
    if (__classPrivateFieldGet2(this, _PQueue_instances, "a", _PQueue_doesIntervalAllowAnother_get) && __classPrivateFieldGet2(this, _PQueue_instances, "a", _PQueue_doesConcurrentAllowAnother_get)) {
      const job = __classPrivateFieldGet2(this, _PQueue_queue, "f").dequeue();
      if (!job) {
        return false;
      }
      this.emit("active");
      job();
      if (canInitializeInterval) {
        __classPrivateFieldGet2(this, _PQueue_instances, "m", _PQueue_initializeIntervalIfNeeded).call(this);
      }
      return true;
    }
  }
  return false;
}, _PQueue_initializeIntervalIfNeeded = function _PQueue_initializeIntervalIfNeeded2() {
  if (__classPrivateFieldGet2(this, _PQueue_isIntervalIgnored, "f") || __classPrivateFieldGet2(this, _PQueue_intervalId, "f") !== void 0) {
    return;
  }
  __classPrivateFieldSet(this, _PQueue_intervalId, setInterval(() => {
    __classPrivateFieldGet2(this, _PQueue_instances, "m", _PQueue_onInterval).call(this);
  }, __classPrivateFieldGet2(this, _PQueue_interval, "f")), "f");
  __classPrivateFieldSet(this, _PQueue_intervalEnd, Date.now() + __classPrivateFieldGet2(this, _PQueue_interval, "f"), "f");
}, _PQueue_onInterval = function _PQueue_onInterval2() {
  if (__classPrivateFieldGet2(this, _PQueue_intervalCount, "f") === 0 && __classPrivateFieldGet2(this, _PQueue_pending, "f") === 0 && __classPrivateFieldGet2(this, _PQueue_intervalId, "f")) {
    clearInterval(__classPrivateFieldGet2(this, _PQueue_intervalId, "f"));
    __classPrivateFieldSet(this, _PQueue_intervalId, void 0, "f");
  }
  __classPrivateFieldSet(this, _PQueue_intervalCount, __classPrivateFieldGet2(this, _PQueue_carryoverConcurrencyCount, "f") ? __classPrivateFieldGet2(this, _PQueue_pending, "f") : 0, "f");
  __classPrivateFieldGet2(this, _PQueue_instances, "m", _PQueue_processQueue).call(this);
}, _PQueue_processQueue = function _PQueue_processQueue2() {
  while (__classPrivateFieldGet2(this, _PQueue_instances, "m", _PQueue_tryToStartAnother).call(this)) {
  }
}, _PQueue_throwOnAbort = async function _PQueue_throwOnAbort2(signal) {
  return new Promise((_resolve, reject) => {
    signal.addEventListener("abort", () => {
      reject(new AbortError2("The task was aborted."));
    }, { once: true });
  });
}, _PQueue_onEvent = async function _PQueue_onEvent2(event, filter) {
  return new Promise((resolve) => {
    const listener = () => {
      if (filter && !filter()) {
        return;
      }
      this.off(event, listener);
      resolve();
    };
    this.on(event, listener);
  });
};
var dist_default = PQueue;

// node_modules/@ipld/dag-pb/src/pb-decode.js
var textDecoder2 = new TextDecoder();
function decodeVarint2(bytes, offset) {
  let v = 0;
  for (let shift = 0; ; shift += 7) {
    if (shift >= 64) {
      throw new Error("protobuf: varint overflow");
    }
    if (offset >= bytes.length) {
      throw new Error("protobuf: unexpected end of data");
    }
    const b = bytes[offset++];
    v += shift < 28 ? (b & 127) << shift : (b & 127) * 2 ** shift;
    if (b < 128) {
      break;
    }
  }
  return [v, offset];
}
function decodeBytes(bytes, offset) {
  let byteLen;
  [byteLen, offset] = decodeVarint2(bytes, offset);
  const postOffset = offset + byteLen;
  if (byteLen < 0 || postOffset < 0) {
    throw new Error("protobuf: invalid length");
  }
  if (postOffset > bytes.length) {
    throw new Error("protobuf: unexpected end of data");
  }
  return [bytes.subarray(offset, postOffset), postOffset];
}
function decodeKey(bytes, index) {
  let wire;
  [wire, index] = decodeVarint2(bytes, index);
  return [wire & 7, wire >> 3, index];
}
function decodeLink(bytes) {
  const link = {};
  const l = bytes.length;
  let index = 0;
  while (index < l) {
    let wireType, fieldNum;
    [wireType, fieldNum, index] = decodeKey(bytes, index);
    if (fieldNum === 1) {
      if (link.Hash) {
        throw new Error("protobuf: (PBLink) duplicate Hash section");
      }
      if (wireType !== 2) {
        throw new Error(`protobuf: (PBLink) wrong wireType (${wireType}) for Hash`);
      }
      if (link.Name !== void 0) {
        throw new Error("protobuf: (PBLink) invalid order, found Name before Hash");
      }
      if (link.Tsize !== void 0) {
        throw new Error("protobuf: (PBLink) invalid order, found Tsize before Hash");
      }
      [link.Hash, index] = decodeBytes(bytes, index);
    } else if (fieldNum === 2) {
      if (link.Name !== void 0) {
        throw new Error("protobuf: (PBLink) duplicate Name section");
      }
      if (wireType !== 2) {
        throw new Error(`protobuf: (PBLink) wrong wireType (${wireType}) for Name`);
      }
      if (link.Tsize !== void 0) {
        throw new Error("protobuf: (PBLink) invalid order, found Tsize before Name");
      }
      let byts;
      [byts, index] = decodeBytes(bytes, index);
      link.Name = textDecoder2.decode(byts);
    } else if (fieldNum === 3) {
      if (link.Tsize !== void 0) {
        throw new Error("protobuf: (PBLink) duplicate Tsize section");
      }
      if (wireType !== 0) {
        throw new Error(`protobuf: (PBLink) wrong wireType (${wireType}) for Tsize`);
      }
      [link.Tsize, index] = decodeVarint2(bytes, index);
    } else {
      throw new Error(`protobuf: (PBLink) invalid fieldNumber, expected 1, 2 or 3, got ${fieldNum}`);
    }
  }
  if (index > l) {
    throw new Error("protobuf: (PBLink) unexpected end of data");
  }
  return link;
}
function decodeNode(bytes) {
  const l = bytes.length;
  let index = 0;
  let links = void 0;
  let linksBeforeData = false;
  let data = void 0;
  while (index < l) {
    let wireType, fieldNum;
    [wireType, fieldNum, index] = decodeKey(bytes, index);
    if (wireType !== 2) {
      throw new Error(`protobuf: (PBNode) invalid wireType, expected 2, got ${wireType}`);
    }
    if (fieldNum === 1) {
      if (data) {
        throw new Error("protobuf: (PBNode) duplicate Data section");
      }
      [data, index] = decodeBytes(bytes, index);
      if (links) {
        linksBeforeData = true;
      }
    } else if (fieldNum === 2) {
      if (linksBeforeData) {
        throw new Error("protobuf: (PBNode) duplicate Links section");
      } else if (!links) {
        links = [];
      }
      let byts;
      [byts, index] = decodeBytes(bytes, index);
      links.push(decodeLink(byts));
    } else {
      throw new Error(`protobuf: (PBNode) invalid fieldNumber, expected 1 or 2, got ${fieldNum}`);
    }
  }
  if (index > l) {
    throw new Error("protobuf: (PBNode) unexpected end of data");
  }
  const node = {};
  if (data) {
    node.Data = data;
  }
  node.Links = links || [];
  return node;
}

// node_modules/@ipld/dag-pb/src/pb-encode.js
var textEncoder2 = new TextEncoder();
var maxInt32 = 2 ** 32;
var maxUInt32 = 2 ** 31;

// node_modules/@ipld/dag-pb/src/util.js
var textEncoder3 = new TextEncoder();

// node_modules/@ipld/dag-pb/src/index.js
var code = 112;
function decode11(bytes) {
  const pbn = decodeNode(bytes);
  const node = {};
  if (pbn.Data) {
    node.Data = pbn.Data;
  }
  if (pbn.Links) {
    node.Links = pbn.Links.map((l) => {
      const link = {};
      try {
        link.Hash = CID2.decode(l.Hash);
      } catch (e) {
      }
      if (!link.Hash) {
        throw new Error("Invalid Hash field found in link, expected CID");
      }
      if (l.Name !== void 0) {
        link.Name = l.Name;
      }
      if (l.Tsize !== void 0) {
        link.Tsize = l.Tsize;
      }
      return link;
    });
  }
  return node;
}

// node_modules/cborg/lib/json/encode.js
var JSONEncoder = class extends Array {
  constructor() {
    super();
    this.inRecursive = [];
  }
  /**
   * @param {Bl} buf
   */
  prefix(buf2) {
    const recurs = this.inRecursive[this.inRecursive.length - 1];
    if (recurs) {
      if (recurs.type === Type.array) {
        recurs.elements++;
        if (recurs.elements !== 1) {
          buf2.push([44]);
        }
      }
      if (recurs.type === Type.map) {
        recurs.elements++;
        if (recurs.elements !== 1) {
          if (recurs.elements % 2 === 1) {
            buf2.push([44]);
          } else {
            buf2.push([58]);
          }
        }
      }
    }
  }
  /**
   * @param {Bl} buf
   * @param {Token} token
   */
  [Type.uint.major](buf2, token) {
    this.prefix(buf2);
    const is2 = String(token.value);
    const isa = [];
    for (let i = 0; i < is2.length; i++) {
      isa[i] = is2.charCodeAt(i);
    }
    buf2.push(isa);
  }
  /**
   * @param {Bl} buf
   * @param {Token} token
   */
  [Type.negint.major](buf2, token) {
    this[Type.uint.major](buf2, token);
  }
  /**
   * @param {Bl} _buf
   * @param {Token} _token
   */
  [Type.bytes.major](_buf, _token) {
    throw new Error(`${encodeErrPrefix} unsupported type: Uint8Array`);
  }
  /**
   * @param {Bl} buf
   * @param {Token} token
   */
  [Type.string.major](buf2, token) {
    this.prefix(buf2);
    const byts = fromString(JSON.stringify(token.value));
    buf2.push(byts.length > 32 ? asU8A(byts) : byts);
  }
  /**
   * @param {Bl} buf
   * @param {Token} _token
   */
  [Type.array.major](buf2, _token) {
    this.prefix(buf2);
    this.inRecursive.push({ type: Type.array, elements: 0 });
    buf2.push([91]);
  }
  /**
   * @param {Bl} buf
   * @param {Token} _token
   */
  [Type.map.major](buf2, _token) {
    this.prefix(buf2);
    this.inRecursive.push({ type: Type.map, elements: 0 });
    buf2.push([123]);
  }
  /**
   * @param {Bl} _buf
   * @param {Token} _token
   */
  [Type.tag.major](_buf, _token) {
  }
  /**
   * @param {Bl} buf
   * @param {Token} token
   */
  [Type.float.major](buf2, token) {
    if (token.type.name === "break") {
      const recurs = this.inRecursive.pop();
      if (recurs) {
        if (recurs.type === Type.array) {
          buf2.push([93]);
        } else if (recurs.type === Type.map) {
          buf2.push([125]);
        } else {
          throw new Error("Unexpected recursive type; this should not happen!");
        }
        return;
      }
      throw new Error("Unexpected break; this should not happen!");
    }
    if (token.value === void 0) {
      throw new Error(`${encodeErrPrefix} unsupported type: undefined`);
    }
    this.prefix(buf2);
    if (token.type.name === "true") {
      buf2.push([116, 114, 117, 101]);
      return;
    } else if (token.type.name === "false") {
      buf2.push([102, 97, 108, 115, 101]);
      return;
    } else if (token.type.name === "null") {
      buf2.push([110, 117, 108, 108]);
      return;
    }
    const is2 = String(token.value);
    const isa = [];
    let dp = false;
    for (let i = 0; i < is2.length; i++) {
      isa[i] = is2.charCodeAt(i);
      if (!dp && (isa[i] === 46 || isa[i] === 101 || isa[i] === 69)) {
        dp = true;
      }
    }
    if (!dp) {
      isa.push(46);
      isa.push(48);
    }
    buf2.push(isa);
  }
};

// node_modules/cborg/lib/json/decode.js
var Tokenizer = class {
  /**
   * @param {Uint8Array} data
   * @param {DecodeOptions} options
   */
  constructor(data, options = {}) {
    this._pos = 0;
    this.data = data;
    this.options = options;
    this.modeStack = ["value"];
    this.lastToken = "";
  }
  pos() {
    return this._pos;
  }
  /**
   * @returns {boolean}
   */
  done() {
    return this._pos >= this.data.length;
  }
  /**
   * @returns {number}
   */
  ch() {
    return this.data[this._pos];
  }
  /**
   * @returns {string}
   */
  currentMode() {
    return this.modeStack[this.modeStack.length - 1];
  }
  skipWhitespace() {
    let c = this.ch();
    while (c === 32 || c === 9 || c === 13 || c === 10) {
      c = this.data[++this._pos];
    }
  }
  /**
   * @param {number[]} str
   */
  expect(str) {
    if (this.data.length - this._pos < str.length) {
      throw new Error(`${decodeErrPrefix} unexpected end of input at position ${this._pos}`);
    }
    for (let i = 0; i < str.length; i++) {
      if (this.data[this._pos++] !== str[i]) {
        throw new Error(`${decodeErrPrefix} unexpected token at position ${this._pos}, expected to find '${String.fromCharCode(...str)}'`);
      }
    }
  }
  parseNumber() {
    const startPos = this._pos;
    let negative = false;
    let float = false;
    const swallow = (chars) => {
      while (!this.done()) {
        const ch = this.ch();
        if (chars.includes(ch)) {
          this._pos++;
        } else {
          break;
        }
      }
    };
    if (this.ch() === 45) {
      negative = true;
      this._pos++;
    }
    if (this.ch() === 48) {
      this._pos++;
      if (this.ch() === 46) {
        this._pos++;
        float = true;
      } else {
        return new Token(Type.uint, 0, this._pos - startPos);
      }
    }
    swallow([48, 49, 50, 51, 52, 53, 54, 55, 56, 57]);
    if (negative && this._pos === startPos + 1) {
      throw new Error(`${decodeErrPrefix} unexpected token at position ${this._pos}`);
    }
    if (!this.done() && this.ch() === 46) {
      if (float) {
        throw new Error(`${decodeErrPrefix} unexpected token at position ${this._pos}`);
      }
      float = true;
      this._pos++;
      swallow([48, 49, 50, 51, 52, 53, 54, 55, 56, 57]);
    }
    if (!this.done() && (this.ch() === 101 || this.ch() === 69)) {
      float = true;
      this._pos++;
      if (!this.done() && (this.ch() === 43 || this.ch() === 45)) {
        this._pos++;
      }
      swallow([48, 49, 50, 51, 52, 53, 54, 55, 56, 57]);
    }
    const numStr = String.fromCharCode.apply(null, this.data.subarray(startPos, this._pos));
    const num = parseFloat(numStr);
    if (float) {
      return new Token(Type.float, num, this._pos - startPos);
    }
    if (this.options.allowBigInt !== true || Number.isSafeInteger(num)) {
      return new Token(num >= 0 ? Type.uint : Type.negint, num, this._pos - startPos);
    }
    return new Token(num >= 0 ? Type.uint : Type.negint, BigInt(numStr), this._pos - startPos);
  }
  /**
   * @returns {Token}
   */
  parseString() {
    if (this.ch() !== 34) {
      throw new Error(`${decodeErrPrefix} unexpected character at position ${this._pos}; this shouldn't happen`);
    }
    this._pos++;
    for (let i = this._pos, l = 0; i < this.data.length && l < 65536; i++, l++) {
      const ch = this.data[i];
      if (ch === 92 || ch < 32 || ch >= 128) {
        break;
      }
      if (ch === 34) {
        const str = String.fromCharCode.apply(null, this.data.subarray(this._pos, i));
        this._pos = i + 1;
        return new Token(Type.string, str, l);
      }
    }
    const startPos = this._pos;
    const chars = [];
    const readu4 = () => {
      if (this._pos + 4 >= this.data.length) {
        throw new Error(`${decodeErrPrefix} unexpected end of unicode escape sequence at position ${this._pos}`);
      }
      let u4 = 0;
      for (let i = 0; i < 4; i++) {
        let ch = this.ch();
        if (ch >= 48 && ch <= 57) {
          ch -= 48;
        } else if (ch >= 97 && ch <= 102) {
          ch = ch - 97 + 10;
        } else if (ch >= 65 && ch <= 70) {
          ch = ch - 65 + 10;
        } else {
          throw new Error(`${decodeErrPrefix} unexpected unicode escape character at position ${this._pos}`);
        }
        u4 = u4 * 16 + ch;
        this._pos++;
      }
      return u4;
    };
    const readUtf8Char = () => {
      const firstByte = this.ch();
      let codePoint = null;
      let bytesPerSequence = firstByte > 239 ? 4 : firstByte > 223 ? 3 : firstByte > 191 ? 2 : 1;
      if (this._pos + bytesPerSequence > this.data.length) {
        throw new Error(`${decodeErrPrefix} unexpected unicode sequence at position ${this._pos}`);
      }
      let secondByte, thirdByte, fourthByte, tempCodePoint;
      switch (bytesPerSequence) {
        case 1:
          if (firstByte < 128) {
            codePoint = firstByte;
          }
          break;
        case 2:
          secondByte = this.data[this._pos + 1];
          if ((secondByte & 192) === 128) {
            tempCodePoint = (firstByte & 31) << 6 | secondByte & 63;
            if (tempCodePoint > 127) {
              codePoint = tempCodePoint;
            }
          }
          break;
        case 3:
          secondByte = this.data[this._pos + 1];
          thirdByte = this.data[this._pos + 2];
          if ((secondByte & 192) === 128 && (thirdByte & 192) === 128) {
            tempCodePoint = (firstByte & 15) << 12 | (secondByte & 63) << 6 | thirdByte & 63;
            if (tempCodePoint > 2047 && (tempCodePoint < 55296 || tempCodePoint > 57343)) {
              codePoint = tempCodePoint;
            }
          }
          break;
        case 4:
          secondByte = this.data[this._pos + 1];
          thirdByte = this.data[this._pos + 2];
          fourthByte = this.data[this._pos + 3];
          if ((secondByte & 192) === 128 && (thirdByte & 192) === 128 && (fourthByte & 192) === 128) {
            tempCodePoint = (firstByte & 15) << 18 | (secondByte & 63) << 12 | (thirdByte & 63) << 6 | fourthByte & 63;
            if (tempCodePoint > 65535 && tempCodePoint < 1114112) {
              codePoint = tempCodePoint;
            }
          }
      }
      if (codePoint === null) {
        codePoint = 65533;
        bytesPerSequence = 1;
      } else if (codePoint > 65535) {
        codePoint -= 65536;
        chars.push(codePoint >>> 10 & 1023 | 55296);
        codePoint = 56320 | codePoint & 1023;
      }
      chars.push(codePoint);
      this._pos += bytesPerSequence;
    };
    while (!this.done()) {
      const ch = this.ch();
      let ch1;
      switch (ch) {
        case 92:
          this._pos++;
          if (this.done()) {
            throw new Error(`${decodeErrPrefix} unexpected string termination at position ${this._pos}`);
          }
          ch1 = this.ch();
          this._pos++;
          switch (ch1) {
            case 34:
            case 39:
            case 92:
            case 47:
              chars.push(ch1);
              break;
            case 98:
              chars.push(8);
              break;
            case 116:
              chars.push(9);
              break;
            case 110:
              chars.push(10);
              break;
            case 102:
              chars.push(12);
              break;
            case 114:
              chars.push(13);
              break;
            case 117:
              chars.push(readu4());
              break;
            default:
              throw new Error(`${decodeErrPrefix} unexpected string escape character at position ${this._pos}`);
          }
          break;
        case 34:
          this._pos++;
          return new Token(Type.string, decodeCodePointsArray(chars), this._pos - startPos);
        default:
          if (ch < 32) {
            throw new Error(`${decodeErrPrefix} invalid control character at position ${this._pos}`);
          } else if (ch < 128) {
            chars.push(ch);
            this._pos++;
          } else {
            readUtf8Char();
          }
      }
    }
    throw new Error(`${decodeErrPrefix} unexpected end of string at position ${this._pos}`);
  }
  /**
   * @returns {Token}
   */
  parseValue() {
    switch (this.ch()) {
      case 123:
        this.modeStack.push("obj-start");
        this._pos++;
        return new Token(Type.map, Infinity, 1);
      case 91:
        this.modeStack.push("array-start");
        this._pos++;
        return new Token(Type.array, Infinity, 1);
      case 34: {
        return this.parseString();
      }
      case 110:
        this.expect([110, 117, 108, 108]);
        return new Token(Type.null, null, 4);
      case 102:
        this.expect([102, 97, 108, 115, 101]);
        return new Token(Type.false, false, 5);
      case 116:
        this.expect([116, 114, 117, 101]);
        return new Token(Type.true, true, 4);
      case 45:
      case 48:
      case 49:
      case 50:
      case 51:
      case 52:
      case 53:
      case 54:
      case 55:
      case 56:
      case 57:
        return this.parseNumber();
      default:
        throw new Error(`${decodeErrPrefix} unexpected character at position ${this._pos}`);
    }
  }
  /**
   * @returns {Token}
   */
  next() {
    this.skipWhitespace();
    switch (this.currentMode()) {
      case "value":
        this.modeStack.pop();
        return this.parseValue();
      case "array-value": {
        this.modeStack.pop();
        if (this.ch() === 93) {
          this._pos++;
          this.skipWhitespace();
          return new Token(Type.break, void 0, 1);
        }
        if (this.ch() !== 44) {
          throw new Error(`${decodeErrPrefix} unexpected character at position ${this._pos}, was expecting array delimiter but found '${String.fromCharCode(this.ch())}'`);
        }
        this._pos++;
        this.modeStack.push("array-value");
        this.skipWhitespace();
        return this.parseValue();
      }
      case "array-start": {
        this.modeStack.pop();
        if (this.ch() === 93) {
          this._pos++;
          this.skipWhitespace();
          return new Token(Type.break, void 0, 1);
        }
        this.modeStack.push("array-value");
        this.skipWhitespace();
        return this.parseValue();
      }
      case "obj-key":
        if (this.ch() === 125) {
          this.modeStack.pop();
          this._pos++;
          this.skipWhitespace();
          return new Token(Type.break, void 0, 1);
        }
        if (this.ch() !== 44) {
          throw new Error(`${decodeErrPrefix} unexpected character at position ${this._pos}, was expecting object delimiter but found '${String.fromCharCode(this.ch())}'`);
        }
        this._pos++;
        this.skipWhitespace();
      case "obj-start": {
        this.modeStack.pop();
        if (this.ch() === 125) {
          this._pos++;
          this.skipWhitespace();
          return new Token(Type.break, void 0, 1);
        }
        const token = this.parseString();
        this.skipWhitespace();
        if (this.ch() !== 58) {
          throw new Error(`${decodeErrPrefix} unexpected character at position ${this._pos}, was expecting key/value delimiter ':' but found '${String.fromCharCode(this.ch())}'`);
        }
        this._pos++;
        this.modeStack.push("obj-value");
        return token;
      }
      case "obj-value": {
        this.modeStack.pop();
        this.modeStack.push("obj-key");
        this.skipWhitespace();
        return this.parseValue();
      }
      default:
        throw new Error(`${decodeErrPrefix} unexpected parse state at position ${this._pos}; this shouldn't happen`);
    }
  }
};
function decode12(data, options) {
  options = Object.assign({ tokenizer: new Tokenizer(data, options) }, options);
  return decode(data, options);
}

// node_modules/multiformats/src/bases/base64.js
var base64 = rfc46482({
  prefix: "m",
  name: "base64",
  alphabet: "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/",
  bitsPerChar: 6
});
var base64pad = rfc46482({
  prefix: "M",
  name: "base64pad",
  alphabet: "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=",
  bitsPerChar: 6
});
var base64url = rfc46482({
  prefix: "u",
  name: "base64url",
  alphabet: "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_",
  bitsPerChar: 6
});
var base64urlpad = rfc46482({
  prefix: "U",
  name: "base64urlpad",
  alphabet: "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_=",
  bitsPerChar: 6
});

// node_modules/multiformats/src/codecs/raw.js
var code2 = 85;

// node_modules/@helia/car/dist/src/utils/dag-walkers.js
var dagPbWalker = {
  codec: code,
  async *walk(block) {
    const node = decode11(block);
    yield* node.Links.map((l) => l.Hash);
  }
};
var rawWalker = {
  codec: code2,
  async *walk() {
  }
};
var CID_TAG2 = 42;
var cborWalker = {
  codec: 113,
  async *walk(block) {
    const cids = [];
    const tags = [];
    tags[CID_TAG2] = (bytes) => {
      if (bytes[0] !== 0) {
        throw new Error("Invalid CID for CBOR tag 42; expected leading 0x00");
      }
      const cid = CID2.decode(bytes.subarray(1));
      cids.push(cid);
      return cid;
    };
    decode(block, {
      tags
    });
    yield* cids;
  }
};
var DagJsonTokenizer = class extends Tokenizer {
  tokenBuffer;
  constructor(data, options) {
    super(data, options);
    this.tokenBuffer = [];
  }
  done() {
    return this.tokenBuffer.length === 0 && super.done();
  }
  _next() {
    if (this.tokenBuffer.length > 0) {
      return this.tokenBuffer.pop();
    }
    return super.next();
  }
  /**
   * Implements rules outlined in https://github.com/ipld/specs/pull/356
   */
  next() {
    const token = this._next();
    if (token.type === Type.map) {
      const keyToken = this._next();
      if (keyToken.type === Type.string && keyToken.value === "/") {
        const valueToken = this._next();
        if (valueToken.type === Type.string) {
          const breakToken = this._next();
          if (breakToken.type !== Type.break) {
            throw new Error("Invalid encoded CID form");
          }
          this.tokenBuffer.push(valueToken);
          return new Token(Type.tag, 42, 0);
        }
        if (valueToken.type === Type.map) {
          const innerKeyToken = this._next();
          if (innerKeyToken.type === Type.string && innerKeyToken.value === "bytes") {
            const innerValueToken = this._next();
            if (innerValueToken.type === Type.string) {
              for (let i = 0; i < 2; i++) {
                const breakToken = this._next();
                if (breakToken.type !== Type.break) {
                  throw new Error("Invalid encoded Bytes form");
                }
              }
              const bytes = base64.decode(`m${innerValueToken.value}`);
              return new Token(Type.bytes, bytes, innerValueToken.value.length);
            }
            this.tokenBuffer.push(innerValueToken);
          }
          this.tokenBuffer.push(innerKeyToken);
        }
        this.tokenBuffer.push(valueToken);
      }
      this.tokenBuffer.push(keyToken);
    }
    return token;
  }
};
var jsonWalker = {
  codec: 297,
  async *walk(block) {
    const cids = [];
    const tags = [];
    tags[CID_TAG2] = (string) => {
      const cid = CID2.parse(string);
      cids.push(cid);
      return cid;
    };
    decode12(block, {
      tags,
      tokenizer: new DagJsonTokenizer(block, {
        tags,
        allowIndefinite: true,
        allowUndefined: true,
        allowNaN: true,
        allowInfinity: true,
        allowBigInt: true,
        strict: false,
        rejectDuplicateMapKeys: false
      })
    });
    yield* cids;
  }
};

// node_modules/@helia/car/dist/src/index.js
var DEFAULT_DAG_WALKERS = [
  rawWalker,
  dagPbWalker,
  cborWalker,
  jsonWalker
];
var DAG_WALK_QUEUE_CONCURRENCY = 1;
var DefaultCar = class {
  components;
  dagWalkers;
  constructor(components, init) {
    this.components = components;
    this.dagWalkers = {};
    [...DEFAULT_DAG_WALKERS, ...init.dagWalkers ?? []].forEach((dagWalker) => {
      this.dagWalkers[dagWalker.codec] = dagWalker;
    });
  }
  async import(reader, options) {
    await src_default(this.components.blockstore.putMany(src_default3(reader.blocks(), ({ cid, bytes }) => ({ cid, block: bytes })), options));
  }
  async export(root, writer, options) {
    const deferred = pDefer();
    const roots = Array.isArray(root) ? root : [root];
    const queue = new dist_default({
      concurrency: DAG_WALK_QUEUE_CONCURRENCY
    });
    queue.on("idle", () => {
      deferred.resolve();
    });
    queue.on("error", (err) => {
      deferred.resolve(err);
    });
    for (const root2 of roots) {
      void queue.add(async () => {
        await this.#walkDag(root2, queue, async (cid, bytes) => {
          await writer.put({ cid, bytes });
        }, options);
      });
    }
    try {
      await deferred.promise;
    } finally {
      await writer.close();
    }
  }
  /**
   * Walk the DAG behind the passed CID, ensure all blocks are present in the blockstore
   * and update the pin count for them
   */
  async #walkDag(cid, queue, withBlock, options) {
    const dagWalker = this.dagWalkers[cid.code];
    if (dagWalker == null) {
      throw new Error(`No dag walker found for cid codec ${cid.code}`);
    }
    const block = await this.components.blockstore.get(cid, options);
    await withBlock(cid, block);
    for await (const cid2 of dagWalker.walk(block)) {
      void queue.add(async () => {
        await this.#walkDag(cid2, queue, withBlock, options);
      });
    }
  }
};
function car(helia, init = {}) {
  return new DefaultCar(helia, init);
}

// src/objectManager.js
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
        const carExporter = car({ blockstore: temporaryBlockstore }), { writer, out } = CarWriter2.create([rootEntry.cid]);
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
