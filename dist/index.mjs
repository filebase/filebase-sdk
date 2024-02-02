var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __require = /* @__PURE__ */ ((x) => typeof require !== "undefined" ? require : typeof Proxy !== "undefined" ? new Proxy(x, {
  get: (a, b) => (typeof require !== "undefined" ? require : a)[b]
}) : x)(function(x) {
  if (typeof require !== "undefined")
    return require.apply(this, arguments);
  throw Error('Dynamic require of "' + x + '" is not supported');
});
var __commonJS = (cb, mod) => function __require2() {
  return mod || (0, cb[__getOwnPropNames(cb)[0]])((mod = { exports: {} }).exports, mod), mod.exports;
};
var __export = (target, all) => {
  for (var name4 in all)
    __defProp(target, name4, { get: all[name4], enumerable: true });
};
var __copyProps = (to, from4, except, desc) => {
  if (from4 && typeof from4 === "object" || typeof from4 === "function") {
    for (let key of __getOwnPropNames(from4))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from4[key], enumerable: !(desc = __getOwnPropDesc(from4, key)) || desc.enumerable });
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
    module.exports = encode12;
    var MSB3 = 128;
    var REST3 = 127;
    var MSBALL3 = ~REST3;
    var INT3 = Math.pow(2, 31);
    function encode12(num, out, offset) {
      if (Number.MAX_SAFE_INTEGER && num > Number.MAX_SAFE_INTEGER) {
        encode12.bytes = 0;
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
      encode12.bytes = offset - oldOffset + 1;
      return out;
    }
  }
});

// node_modules/varint/decode.js
var require_decode = __commonJS({
  "node_modules/varint/decode.js"(exports, module) {
    module.exports = read4;
    var MSB3 = 128;
    var REST3 = 127;
    function read4(buf2, offset) {
      var res = 0, offset = offset || 0, shift = 0, counter = offset, b, l = buf2.length;
      do {
        if (counter >= l || shift > 49) {
          read4.bytes = 0;
          throw new RangeError("Could not decode varint");
        }
        b = buf2[counter++];
        res += shift < 28 ? (b & REST3) << shift : (b & REST3) * Math.pow(2, shift);
        shift += 7;
      } while (b >= MSB3);
      read4.bytes = counter - offset;
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
      var names = [], events, name4;
      if (this._eventsCount === 0)
        return names;
      for (name4 in events = this._events) {
        if (has.call(events, name4))
          names.push(prefix ? name4.slice(1) : name4);
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
        var length4 = listeners.length, j;
        for (i = 0; i < length4; i++) {
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
        for (var i = 0, events = [], length4 = listeners.length; i < length4; i++) {
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

// node_modules/err-code/index.js
var require_err_code = __commonJS({
  "node_modules/err-code/index.js"(exports, module) {
    "use strict";
    function assign(obj, props) {
      for (const key in props) {
        Object.defineProperty(obj, key, {
          value: props[key],
          enumerable: true,
          configurable: true
        });
      }
      return obj;
    }
    function createError(err, code5, props) {
      if (!err || typeof err === "string") {
        throw new TypeError("Please pass an Error to err-code");
      }
      if (!props) {
        props = {};
      }
      if (typeof code5 === "object") {
        props = code5;
        code5 = "";
      }
      if (code5) {
        props.code = code5;
      }
      try {
        return assign(err, props);
      } catch (_) {
        props.message = err.message;
        props.stack = err.stack;
        const ErrClass = function() {
        };
        ErrClass.prototype = Object.create(Object.getPrototypeOf(err));
        const output = assign(new ErrClass(), props);
        return output;
      }
    }
    module.exports = createError;
  }
});

// node_modules/murmurhash3js-revisited/lib/murmurHash3js.js
var require_murmurHash3js = __commonJS({
  "node_modules/murmurhash3js-revisited/lib/murmurHash3js.js"(exports, module) {
    (function(root, undefined2) {
      "use strict";
      var library = {
        "version": "3.0.0",
        "x86": {},
        "x64": {},
        "inputValidation": true
      };
      function _validBytes(bytes) {
        if (!Array.isArray(bytes) && !ArrayBuffer.isView(bytes)) {
          return false;
        }
        for (var i = 0; i < bytes.length; i++) {
          if (!Number.isInteger(bytes[i]) || bytes[i] < 0 || bytes[i] > 255) {
            return false;
          }
        }
        return true;
      }
      function _x86Multiply(m, n) {
        return (m & 65535) * n + (((m >>> 16) * n & 65535) << 16);
      }
      function _x86Rotl(m, n) {
        return m << n | m >>> 32 - n;
      }
      function _x86Fmix(h) {
        h ^= h >>> 16;
        h = _x86Multiply(h, 2246822507);
        h ^= h >>> 13;
        h = _x86Multiply(h, 3266489909);
        h ^= h >>> 16;
        return h;
      }
      function _x64Add(m, n) {
        m = [m[0] >>> 16, m[0] & 65535, m[1] >>> 16, m[1] & 65535];
        n = [n[0] >>> 16, n[0] & 65535, n[1] >>> 16, n[1] & 65535];
        var o = [0, 0, 0, 0];
        o[3] += m[3] + n[3];
        o[2] += o[3] >>> 16;
        o[3] &= 65535;
        o[2] += m[2] + n[2];
        o[1] += o[2] >>> 16;
        o[2] &= 65535;
        o[1] += m[1] + n[1];
        o[0] += o[1] >>> 16;
        o[1] &= 65535;
        o[0] += m[0] + n[0];
        o[0] &= 65535;
        return [o[0] << 16 | o[1], o[2] << 16 | o[3]];
      }
      function _x64Multiply(m, n) {
        m = [m[0] >>> 16, m[0] & 65535, m[1] >>> 16, m[1] & 65535];
        n = [n[0] >>> 16, n[0] & 65535, n[1] >>> 16, n[1] & 65535];
        var o = [0, 0, 0, 0];
        o[3] += m[3] * n[3];
        o[2] += o[3] >>> 16;
        o[3] &= 65535;
        o[2] += m[2] * n[3];
        o[1] += o[2] >>> 16;
        o[2] &= 65535;
        o[2] += m[3] * n[2];
        o[1] += o[2] >>> 16;
        o[2] &= 65535;
        o[1] += m[1] * n[3];
        o[0] += o[1] >>> 16;
        o[1] &= 65535;
        o[1] += m[2] * n[2];
        o[0] += o[1] >>> 16;
        o[1] &= 65535;
        o[1] += m[3] * n[1];
        o[0] += o[1] >>> 16;
        o[1] &= 65535;
        o[0] += m[0] * n[3] + m[1] * n[2] + m[2] * n[1] + m[3] * n[0];
        o[0] &= 65535;
        return [o[0] << 16 | o[1], o[2] << 16 | o[3]];
      }
      function _x64Rotl(m, n) {
        n %= 64;
        if (n === 32) {
          return [m[1], m[0]];
        } else if (n < 32) {
          return [m[0] << n | m[1] >>> 32 - n, m[1] << n | m[0] >>> 32 - n];
        } else {
          n -= 32;
          return [m[1] << n | m[0] >>> 32 - n, m[0] << n | m[1] >>> 32 - n];
        }
      }
      function _x64LeftShift(m, n) {
        n %= 64;
        if (n === 0) {
          return m;
        } else if (n < 32) {
          return [m[0] << n | m[1] >>> 32 - n, m[1] << n];
        } else {
          return [m[1] << n - 32, 0];
        }
      }
      function _x64Xor(m, n) {
        return [m[0] ^ n[0], m[1] ^ n[1]];
      }
      function _x64Fmix(h) {
        h = _x64Xor(h, [0, h[0] >>> 1]);
        h = _x64Multiply(h, [4283543511, 3981806797]);
        h = _x64Xor(h, [0, h[0] >>> 1]);
        h = _x64Multiply(h, [3301882366, 444984403]);
        h = _x64Xor(h, [0, h[0] >>> 1]);
        return h;
      }
      library.x86.hash32 = function(bytes, seed) {
        if (library.inputValidation && !_validBytes(bytes)) {
          return undefined2;
        }
        seed = seed || 0;
        var remainder = bytes.length % 4;
        var blocks = bytes.length - remainder;
        var h1 = seed;
        var k1 = 0;
        var c1 = 3432918353;
        var c2 = 461845907;
        for (var i = 0; i < blocks; i = i + 4) {
          k1 = bytes[i] | bytes[i + 1] << 8 | bytes[i + 2] << 16 | bytes[i + 3] << 24;
          k1 = _x86Multiply(k1, c1);
          k1 = _x86Rotl(k1, 15);
          k1 = _x86Multiply(k1, c2);
          h1 ^= k1;
          h1 = _x86Rotl(h1, 13);
          h1 = _x86Multiply(h1, 5) + 3864292196;
        }
        k1 = 0;
        switch (remainder) {
          case 3:
            k1 ^= bytes[i + 2] << 16;
          case 2:
            k1 ^= bytes[i + 1] << 8;
          case 1:
            k1 ^= bytes[i];
            k1 = _x86Multiply(k1, c1);
            k1 = _x86Rotl(k1, 15);
            k1 = _x86Multiply(k1, c2);
            h1 ^= k1;
        }
        h1 ^= bytes.length;
        h1 = _x86Fmix(h1);
        return h1 >>> 0;
      };
      library.x86.hash128 = function(bytes, seed) {
        if (library.inputValidation && !_validBytes(bytes)) {
          return undefined2;
        }
        seed = seed || 0;
        var remainder = bytes.length % 16;
        var blocks = bytes.length - remainder;
        var h1 = seed;
        var h2 = seed;
        var h3 = seed;
        var h4 = seed;
        var k1 = 0;
        var k2 = 0;
        var k3 = 0;
        var k4 = 0;
        var c1 = 597399067;
        var c2 = 2869860233;
        var c3 = 951274213;
        var c4 = 2716044179;
        for (var i = 0; i < blocks; i = i + 16) {
          k1 = bytes[i] | bytes[i + 1] << 8 | bytes[i + 2] << 16 | bytes[i + 3] << 24;
          k2 = bytes[i + 4] | bytes[i + 5] << 8 | bytes[i + 6] << 16 | bytes[i + 7] << 24;
          k3 = bytes[i + 8] | bytes[i + 9] << 8 | bytes[i + 10] << 16 | bytes[i + 11] << 24;
          k4 = bytes[i + 12] | bytes[i + 13] << 8 | bytes[i + 14] << 16 | bytes[i + 15] << 24;
          k1 = _x86Multiply(k1, c1);
          k1 = _x86Rotl(k1, 15);
          k1 = _x86Multiply(k1, c2);
          h1 ^= k1;
          h1 = _x86Rotl(h1, 19);
          h1 += h2;
          h1 = _x86Multiply(h1, 5) + 1444728091;
          k2 = _x86Multiply(k2, c2);
          k2 = _x86Rotl(k2, 16);
          k2 = _x86Multiply(k2, c3);
          h2 ^= k2;
          h2 = _x86Rotl(h2, 17);
          h2 += h3;
          h2 = _x86Multiply(h2, 5) + 197830471;
          k3 = _x86Multiply(k3, c3);
          k3 = _x86Rotl(k3, 17);
          k3 = _x86Multiply(k3, c4);
          h3 ^= k3;
          h3 = _x86Rotl(h3, 15);
          h3 += h4;
          h3 = _x86Multiply(h3, 5) + 2530024501;
          k4 = _x86Multiply(k4, c4);
          k4 = _x86Rotl(k4, 18);
          k4 = _x86Multiply(k4, c1);
          h4 ^= k4;
          h4 = _x86Rotl(h4, 13);
          h4 += h1;
          h4 = _x86Multiply(h4, 5) + 850148119;
        }
        k1 = 0;
        k2 = 0;
        k3 = 0;
        k4 = 0;
        switch (remainder) {
          case 15:
            k4 ^= bytes[i + 14] << 16;
          case 14:
            k4 ^= bytes[i + 13] << 8;
          case 13:
            k4 ^= bytes[i + 12];
            k4 = _x86Multiply(k4, c4);
            k4 = _x86Rotl(k4, 18);
            k4 = _x86Multiply(k4, c1);
            h4 ^= k4;
          case 12:
            k3 ^= bytes[i + 11] << 24;
          case 11:
            k3 ^= bytes[i + 10] << 16;
          case 10:
            k3 ^= bytes[i + 9] << 8;
          case 9:
            k3 ^= bytes[i + 8];
            k3 = _x86Multiply(k3, c3);
            k3 = _x86Rotl(k3, 17);
            k3 = _x86Multiply(k3, c4);
            h3 ^= k3;
          case 8:
            k2 ^= bytes[i + 7] << 24;
          case 7:
            k2 ^= bytes[i + 6] << 16;
          case 6:
            k2 ^= bytes[i + 5] << 8;
          case 5:
            k2 ^= bytes[i + 4];
            k2 = _x86Multiply(k2, c2);
            k2 = _x86Rotl(k2, 16);
            k2 = _x86Multiply(k2, c3);
            h2 ^= k2;
          case 4:
            k1 ^= bytes[i + 3] << 24;
          case 3:
            k1 ^= bytes[i + 2] << 16;
          case 2:
            k1 ^= bytes[i + 1] << 8;
          case 1:
            k1 ^= bytes[i];
            k1 = _x86Multiply(k1, c1);
            k1 = _x86Rotl(k1, 15);
            k1 = _x86Multiply(k1, c2);
            h1 ^= k1;
        }
        h1 ^= bytes.length;
        h2 ^= bytes.length;
        h3 ^= bytes.length;
        h4 ^= bytes.length;
        h1 += h2;
        h1 += h3;
        h1 += h4;
        h2 += h1;
        h3 += h1;
        h4 += h1;
        h1 = _x86Fmix(h1);
        h2 = _x86Fmix(h2);
        h3 = _x86Fmix(h3);
        h4 = _x86Fmix(h4);
        h1 += h2;
        h1 += h3;
        h1 += h4;
        h2 += h1;
        h3 += h1;
        h4 += h1;
        return ("00000000" + (h1 >>> 0).toString(16)).slice(-8) + ("00000000" + (h2 >>> 0).toString(16)).slice(-8) + ("00000000" + (h3 >>> 0).toString(16)).slice(-8) + ("00000000" + (h4 >>> 0).toString(16)).slice(-8);
      };
      library.x64.hash128 = function(bytes, seed) {
        if (library.inputValidation && !_validBytes(bytes)) {
          return undefined2;
        }
        seed = seed || 0;
        var remainder = bytes.length % 16;
        var blocks = bytes.length - remainder;
        var h1 = [0, seed];
        var h2 = [0, seed];
        var k1 = [0, 0];
        var k2 = [0, 0];
        var c1 = [2277735313, 289559509];
        var c2 = [1291169091, 658871167];
        for (var i = 0; i < blocks; i = i + 16) {
          k1 = [bytes[i + 4] | bytes[i + 5] << 8 | bytes[i + 6] << 16 | bytes[i + 7] << 24, bytes[i] | bytes[i + 1] << 8 | bytes[i + 2] << 16 | bytes[i + 3] << 24];
          k2 = [bytes[i + 12] | bytes[i + 13] << 8 | bytes[i + 14] << 16 | bytes[i + 15] << 24, bytes[i + 8] | bytes[i + 9] << 8 | bytes[i + 10] << 16 | bytes[i + 11] << 24];
          k1 = _x64Multiply(k1, c1);
          k1 = _x64Rotl(k1, 31);
          k1 = _x64Multiply(k1, c2);
          h1 = _x64Xor(h1, k1);
          h1 = _x64Rotl(h1, 27);
          h1 = _x64Add(h1, h2);
          h1 = _x64Add(_x64Multiply(h1, [0, 5]), [0, 1390208809]);
          k2 = _x64Multiply(k2, c2);
          k2 = _x64Rotl(k2, 33);
          k2 = _x64Multiply(k2, c1);
          h2 = _x64Xor(h2, k2);
          h2 = _x64Rotl(h2, 31);
          h2 = _x64Add(h2, h1);
          h2 = _x64Add(_x64Multiply(h2, [0, 5]), [0, 944331445]);
        }
        k1 = [0, 0];
        k2 = [0, 0];
        switch (remainder) {
          case 15:
            k2 = _x64Xor(k2, _x64LeftShift([0, bytes[i + 14]], 48));
          case 14:
            k2 = _x64Xor(k2, _x64LeftShift([0, bytes[i + 13]], 40));
          case 13:
            k2 = _x64Xor(k2, _x64LeftShift([0, bytes[i + 12]], 32));
          case 12:
            k2 = _x64Xor(k2, _x64LeftShift([0, bytes[i + 11]], 24));
          case 11:
            k2 = _x64Xor(k2, _x64LeftShift([0, bytes[i + 10]], 16));
          case 10:
            k2 = _x64Xor(k2, _x64LeftShift([0, bytes[i + 9]], 8));
          case 9:
            k2 = _x64Xor(k2, [0, bytes[i + 8]]);
            k2 = _x64Multiply(k2, c2);
            k2 = _x64Rotl(k2, 33);
            k2 = _x64Multiply(k2, c1);
            h2 = _x64Xor(h2, k2);
          case 8:
            k1 = _x64Xor(k1, _x64LeftShift([0, bytes[i + 7]], 56));
          case 7:
            k1 = _x64Xor(k1, _x64LeftShift([0, bytes[i + 6]], 48));
          case 6:
            k1 = _x64Xor(k1, _x64LeftShift([0, bytes[i + 5]], 40));
          case 5:
            k1 = _x64Xor(k1, _x64LeftShift([0, bytes[i + 4]], 32));
          case 4:
            k1 = _x64Xor(k1, _x64LeftShift([0, bytes[i + 3]], 24));
          case 3:
            k1 = _x64Xor(k1, _x64LeftShift([0, bytes[i + 2]], 16));
          case 2:
            k1 = _x64Xor(k1, _x64LeftShift([0, bytes[i + 1]], 8));
          case 1:
            k1 = _x64Xor(k1, [0, bytes[i]]);
            k1 = _x64Multiply(k1, c1);
            k1 = _x64Rotl(k1, 31);
            k1 = _x64Multiply(k1, c2);
            h1 = _x64Xor(h1, k1);
        }
        h1 = _x64Xor(h1, [0, bytes.length]);
        h2 = _x64Xor(h2, [0, bytes.length]);
        h1 = _x64Add(h1, h2);
        h2 = _x64Add(h2, h1);
        h1 = _x64Fmix(h1);
        h2 = _x64Fmix(h2);
        h1 = _x64Add(h1, h2);
        h2 = _x64Add(h2, h1);
        return ("00000000" + (h1[0] >>> 0).toString(16)).slice(-8) + ("00000000" + (h1[1] >>> 0).toString(16)).slice(-8) + ("00000000" + (h2[0] >>> 0).toString(16)).slice(-8) + ("00000000" + (h2[1] >>> 0).toString(16)).slice(-8);
      };
      if (typeof exports !== "undefined") {
        if (typeof module !== "undefined" && module.exports) {
          exports = module.exports = library;
        }
        exports.murmurHash3 = library;
      } else if (typeof define === "function" && define.amd) {
        define([], function() {
          return library;
        });
      } else {
        library._murmurHash3 = root.murmurHash3;
        library.noConflict = function() {
          root.murmurHash3 = library._murmurHash3;
          library._murmurHash3 = undefined2;
          library.noConflict = undefined2;
          return library;
        };
        root.murmurHash3 = library;
      }
    })(exports);
  }
});

// node_modules/murmurhash3js-revisited/index.js
var require_murmurhash3js_revisited = __commonJS({
  "node_modules/murmurhash3js-revisited/index.js"(exports, module) {
    module.exports = require_murmurHash3js();
  }
});

// node_modules/sparse-array/index.js
var require_sparse_array = __commonJS({
  "node_modules/sparse-array/index.js"(exports, module) {
    "use strict";
    var BITS_PER_BYTE = 7;
    module.exports = class SparseArray {
      constructor() {
        this._bitArrays = [];
        this._data = [];
        this._length = 0;
        this._changedLength = false;
        this._changedData = false;
      }
      set(index, value) {
        let pos = this._internalPositionFor(index, false);
        if (value === void 0) {
          if (pos !== -1) {
            this._unsetInternalPos(pos);
            this._unsetBit(index);
            this._changedLength = true;
            this._changedData = true;
          }
        } else {
          let needsSort = false;
          if (pos === -1) {
            pos = this._data.length;
            this._setBit(index);
            this._changedData = true;
          } else {
            needsSort = true;
          }
          this._setInternalPos(pos, index, value, needsSort);
          this._changedLength = true;
        }
      }
      unset(index) {
        this.set(index, void 0);
      }
      get(index) {
        this._sortData();
        const pos = this._internalPositionFor(index, true);
        if (pos === -1) {
          return void 0;
        }
        return this._data[pos][1];
      }
      push(value) {
        this.set(this.length, value);
        return this.length;
      }
      get length() {
        this._sortData();
        if (this._changedLength) {
          const last2 = this._data[this._data.length - 1];
          this._length = last2 ? last2[0] + 1 : 0;
          this._changedLength = false;
        }
        return this._length;
      }
      forEach(iterator) {
        let i = 0;
        while (i < this.length) {
          iterator(this.get(i), i, this);
          i++;
        }
      }
      map(iterator) {
        let i = 0;
        let mapped = new Array(this.length);
        while (i < this.length) {
          mapped[i] = iterator(this.get(i), i, this);
          i++;
        }
        return mapped;
      }
      reduce(reducer, initialValue) {
        let i = 0;
        let acc = initialValue;
        while (i < this.length) {
          const value = this.get(i);
          acc = reducer(acc, value, i);
          i++;
        }
        return acc;
      }
      find(finder) {
        let i = 0, found, last2;
        while (i < this.length && !found) {
          last2 = this.get(i);
          found = finder(last2);
          i++;
        }
        return found ? last2 : void 0;
      }
      _internalPositionFor(index, noCreate) {
        const bytePos = this._bytePosFor(index, noCreate);
        if (bytePos >= this._bitArrays.length) {
          return -1;
        }
        const byte = this._bitArrays[bytePos];
        const bitPos = index - bytePos * BITS_PER_BYTE;
        const exists2 = (byte & 1 << bitPos) > 0;
        if (!exists2) {
          return -1;
        }
        const previousPopCount = this._bitArrays.slice(0, bytePos).reduce(popCountReduce, 0);
        const mask = ~(4294967295 << bitPos + 1);
        const bytePopCount = popCount(byte & mask);
        const arrayPos = previousPopCount + bytePopCount - 1;
        return arrayPos;
      }
      _bytePosFor(index, noCreate) {
        const bytePos = Math.floor(index / BITS_PER_BYTE);
        const targetLength = bytePos + 1;
        while (!noCreate && this._bitArrays.length < targetLength) {
          this._bitArrays.push(0);
        }
        return bytePos;
      }
      _setBit(index) {
        const bytePos = this._bytePosFor(index, false);
        this._bitArrays[bytePos] |= 1 << index - bytePos * BITS_PER_BYTE;
      }
      _unsetBit(index) {
        const bytePos = this._bytePosFor(index, false);
        this._bitArrays[bytePos] &= ~(1 << index - bytePos * BITS_PER_BYTE);
      }
      _setInternalPos(pos, index, value, needsSort) {
        const data = this._data;
        const elem = [index, value];
        if (needsSort) {
          this._sortData();
          data[pos] = elem;
        } else {
          if (data.length) {
            if (data[data.length - 1][0] >= index) {
              data.push(elem);
            } else if (data[0][0] <= index) {
              data.unshift(elem);
            } else {
              const randomIndex = Math.round(data.length / 2);
              this._data = data.slice(0, randomIndex).concat(elem).concat(data.slice(randomIndex));
            }
          } else {
            this._data.push(elem);
          }
          this._changedData = true;
          this._changedLength = true;
        }
      }
      _unsetInternalPos(pos) {
        this._data.splice(pos, 1);
      }
      _sortData() {
        if (this._changedData) {
          this._data.sort(sortInternal);
        }
        this._changedData = false;
      }
      bitField() {
        const bytes = [];
        let pendingBitsForResultingByte = 8;
        let pendingBitsForNewByte = 0;
        let resultingByte = 0;
        let newByte;
        const pending = this._bitArrays.slice();
        while (pending.length || pendingBitsForNewByte) {
          if (pendingBitsForNewByte === 0) {
            newByte = pending.shift();
            pendingBitsForNewByte = 7;
          }
          const usingBits = Math.min(pendingBitsForNewByte, pendingBitsForResultingByte);
          const mask = ~(255 << usingBits);
          const masked = newByte & mask;
          resultingByte |= masked << 8 - pendingBitsForResultingByte;
          newByte = newByte >>> usingBits;
          pendingBitsForNewByte -= usingBits;
          pendingBitsForResultingByte -= usingBits;
          if (!pendingBitsForResultingByte || !pendingBitsForNewByte && !pending.length) {
            bytes.push(resultingByte);
            resultingByte = 0;
            pendingBitsForResultingByte = 8;
          }
        }
        for (var i = bytes.length - 1; i > 0; i--) {
          const value = bytes[i];
          if (value === 0) {
            bytes.pop();
          } else {
            break;
          }
        }
        return bytes;
      }
      compactArray() {
        this._sortData();
        return this._data.map(valueOnly);
      }
    };
    function popCountReduce(count, byte) {
      return count + popCount(byte);
    }
    function popCount(_v) {
      let v = _v;
      v = v - (v >> 1 & 1431655765);
      v = (v & 858993459) + (v >> 2 & 858993459);
      return (v + (v >> 4) & 252645135) * 16843009 >> 24;
    }
    function sortInternal(a, b) {
      return a[0] - b[0];
    }
    function valueOnly(elem) {
      return elem[1];
    }
  }
});

// node_modules/rabin-wasm/src/rabin.js
var require_rabin = __commonJS({
  "node_modules/rabin-wasm/src/rabin.js"(exports, module) {
    var Rabin = class {
      /**
       * Creates an instance of Rabin.
       * @param { import("./../dist/rabin-wasm") } asModule
       * @param {number} [bits=12]
       * @param {number} [min=8 * 1024]
       * @param {number} [max=32 * 1024]
       * @param {number} polynomial
       * @memberof Rabin
       */
      constructor(asModule, bits = 12, min = 8 * 1024, max = 32 * 1024, windowSize = 64, polynomial) {
        this.bits = bits;
        this.min = min;
        this.max = max;
        this.asModule = asModule;
        this.rabin = new asModule.Rabin(bits, min, max, windowSize, polynomial);
        this.polynomial = polynomial;
      }
      /**
       * Fingerprints the buffer
       *
       * @param {Uint8Array} buf
       * @returns {Array<number>}
       * @memberof Rabin
       */
      fingerprint(buf2) {
        const {
          __retain,
          __release,
          __allocArray,
          __getInt32Array,
          Int32Array_ID,
          Uint8Array_ID
        } = this.asModule;
        const lengths = new Int32Array(Math.ceil(buf2.length / this.min));
        const lengthsPtr = __retain(__allocArray(Int32Array_ID, lengths));
        const pointer = __retain(__allocArray(Uint8Array_ID, buf2));
        const out = this.rabin.fingerprint(pointer, lengthsPtr);
        const processed = __getInt32Array(out);
        __release(pointer);
        __release(lengthsPtr);
        const end = processed.indexOf(0);
        return end >= 0 ? processed.subarray(0, end) : processed;
      }
    };
    module.exports = Rabin;
  }
});

// node_modules/@assemblyscript/loader/index.js
var require_loader = __commonJS({
  "node_modules/@assemblyscript/loader/index.js"(exports) {
    "use strict";
    var ID_OFFSET = -8;
    var SIZE_OFFSET = -4;
    var ARRAYBUFFER_ID = 0;
    var STRING_ID = 1;
    var ARRAYBUFFERVIEW = 1 << 0;
    var ARRAY = 1 << 1;
    var SET = 1 << 2;
    var MAP = 1 << 3;
    var VAL_ALIGN_OFFSET = 5;
    var VAL_ALIGN = 1 << VAL_ALIGN_OFFSET;
    var VAL_SIGNED = 1 << 10;
    var VAL_FLOAT = 1 << 11;
    var VAL_NULLABLE = 1 << 12;
    var VAL_MANAGED = 1 << 13;
    var KEY_ALIGN_OFFSET = 14;
    var KEY_ALIGN = 1 << KEY_ALIGN_OFFSET;
    var KEY_SIGNED = 1 << 19;
    var KEY_FLOAT = 1 << 20;
    var KEY_NULLABLE = 1 << 21;
    var KEY_MANAGED = 1 << 22;
    var ARRAYBUFFERVIEW_BUFFER_OFFSET = 0;
    var ARRAYBUFFERVIEW_DATASTART_OFFSET = 4;
    var ARRAYBUFFERVIEW_DATALENGTH_OFFSET = 8;
    var ARRAYBUFFERVIEW_SIZE = 12;
    var ARRAY_LENGTH_OFFSET = 12;
    var ARRAY_SIZE = 16;
    var BIGINT = typeof BigUint64Array !== "undefined";
    var THIS = Symbol();
    var CHUNKSIZE = 1024;
    function getStringImpl(buffer2, ptr) {
      const U32 = new Uint32Array(buffer2);
      const U16 = new Uint16Array(buffer2);
      var length4 = U32[ptr + SIZE_OFFSET >>> 2] >>> 1;
      var offset = ptr >>> 1;
      if (length4 <= CHUNKSIZE)
        return String.fromCharCode.apply(String, U16.subarray(offset, offset + length4));
      const parts = [];
      do {
        const last2 = U16[offset + CHUNKSIZE - 1];
        const size = last2 >= 55296 && last2 < 56320 ? CHUNKSIZE - 1 : CHUNKSIZE;
        parts.push(String.fromCharCode.apply(String, U16.subarray(offset, offset += size)));
        length4 -= size;
      } while (length4 > CHUNKSIZE);
      return parts.join("") + String.fromCharCode.apply(String, U16.subarray(offset, offset + length4));
    }
    function preInstantiate(imports) {
      const baseModule = {};
      function getString(memory, ptr) {
        if (!memory)
          return "<yet unknown>";
        return getStringImpl(memory.buffer, ptr);
      }
      const env = imports.env = imports.env || {};
      env.abort = env.abort || function abort(mesg, file, line, colm) {
        const memory = baseModule.memory || env.memory;
        throw Error("abort: " + getString(memory, mesg) + " at " + getString(memory, file) + ":" + line + ":" + colm);
      };
      env.trace = env.trace || function trace(mesg, n) {
        const memory = baseModule.memory || env.memory;
        console.log("trace: " + getString(memory, mesg) + (n ? " " : "") + Array.prototype.slice.call(arguments, 2, 2 + n).join(", "));
      };
      imports.Math = imports.Math || Math;
      imports.Date = imports.Date || Date;
      return baseModule;
    }
    function postInstantiate(baseModule, instance) {
      const rawExports = instance.exports;
      const memory = rawExports.memory;
      const table = rawExports.table;
      const alloc4 = rawExports["__alloc"];
      const retain = rawExports["__retain"];
      const rttiBase = rawExports["__rtti_base"] || ~0;
      function getInfo(id) {
        const U32 = new Uint32Array(memory.buffer);
        const count = U32[rttiBase >>> 2];
        if ((id >>>= 0) >= count)
          throw Error("invalid id: " + id);
        return U32[(rttiBase + 4 >>> 2) + id * 2];
      }
      function getBase(id) {
        const U32 = new Uint32Array(memory.buffer);
        const count = U32[rttiBase >>> 2];
        if ((id >>>= 0) >= count)
          throw Error("invalid id: " + id);
        return U32[(rttiBase + 4 >>> 2) + id * 2 + 1];
      }
      function getValueAlign(info) {
        return 31 - Math.clz32(info >>> VAL_ALIGN_OFFSET & 31);
      }
      function getKeyAlign(info) {
        return 31 - Math.clz32(info >>> KEY_ALIGN_OFFSET & 31);
      }
      function __allocString(str) {
        const length4 = str.length;
        const ptr = alloc4(length4 << 1, STRING_ID);
        const U16 = new Uint16Array(memory.buffer);
        for (var i = 0, p = ptr >>> 1; i < length4; ++i)
          U16[p + i] = str.charCodeAt(i);
        return ptr;
      }
      baseModule.__allocString = __allocString;
      function __getString(ptr) {
        const buffer2 = memory.buffer;
        const id = new Uint32Array(buffer2)[ptr + ID_OFFSET >>> 2];
        if (id !== STRING_ID)
          throw Error("not a string: " + ptr);
        return getStringImpl(buffer2, ptr);
      }
      baseModule.__getString = __getString;
      function getView(alignLog2, signed, float) {
        const buffer2 = memory.buffer;
        if (float) {
          switch (alignLog2) {
            case 2:
              return new Float32Array(buffer2);
            case 3:
              return new Float64Array(buffer2);
          }
        } else {
          switch (alignLog2) {
            case 0:
              return new (signed ? Int8Array : Uint8Array)(buffer2);
            case 1:
              return new (signed ? Int16Array : Uint16Array)(buffer2);
            case 2:
              return new (signed ? Int32Array : Uint32Array)(buffer2);
            case 3:
              return new (signed ? BigInt64Array : BigUint64Array)(buffer2);
          }
        }
        throw Error("unsupported align: " + alignLog2);
      }
      function __allocArray(id, values) {
        const info = getInfo(id);
        if (!(info & (ARRAYBUFFERVIEW | ARRAY)))
          throw Error("not an array: " + id + " @ " + info);
        const align = getValueAlign(info);
        const length4 = values.length;
        const buf2 = alloc4(length4 << align, ARRAYBUFFER_ID);
        const arr = alloc4(info & ARRAY ? ARRAY_SIZE : ARRAYBUFFERVIEW_SIZE, id);
        const U32 = new Uint32Array(memory.buffer);
        U32[arr + ARRAYBUFFERVIEW_BUFFER_OFFSET >>> 2] = retain(buf2);
        U32[arr + ARRAYBUFFERVIEW_DATASTART_OFFSET >>> 2] = buf2;
        U32[arr + ARRAYBUFFERVIEW_DATALENGTH_OFFSET >>> 2] = length4 << align;
        if (info & ARRAY)
          U32[arr + ARRAY_LENGTH_OFFSET >>> 2] = length4;
        const view = getView(align, info & VAL_SIGNED, info & VAL_FLOAT);
        if (info & VAL_MANAGED) {
          for (let i = 0; i < length4; ++i)
            view[(buf2 >>> align) + i] = retain(values[i]);
        } else {
          view.set(values, buf2 >>> align);
        }
        return arr;
      }
      baseModule.__allocArray = __allocArray;
      function __getArrayView(arr) {
        const U32 = new Uint32Array(memory.buffer);
        const id = U32[arr + ID_OFFSET >>> 2];
        const info = getInfo(id);
        if (!(info & ARRAYBUFFERVIEW))
          throw Error("not an array: " + id);
        const align = getValueAlign(info);
        var buf2 = U32[arr + ARRAYBUFFERVIEW_DATASTART_OFFSET >>> 2];
        const length4 = info & ARRAY ? U32[arr + ARRAY_LENGTH_OFFSET >>> 2] : U32[buf2 + SIZE_OFFSET >>> 2] >>> align;
        return getView(align, info & VAL_SIGNED, info & VAL_FLOAT).subarray(buf2 >>>= align, buf2 + length4);
      }
      baseModule.__getArrayView = __getArrayView;
      function __getArray(arr) {
        const input = __getArrayView(arr);
        const len = input.length;
        const out = new Array(len);
        for (let i = 0; i < len; i++)
          out[i] = input[i];
        return out;
      }
      baseModule.__getArray = __getArray;
      function __getArrayBuffer(ptr) {
        const buffer2 = memory.buffer;
        const length4 = new Uint32Array(buffer2)[ptr + SIZE_OFFSET >>> 2];
        return buffer2.slice(ptr, ptr + length4);
      }
      baseModule.__getArrayBuffer = __getArrayBuffer;
      function getTypedArray(Type2, alignLog2, ptr) {
        return new Type2(getTypedArrayView(Type2, alignLog2, ptr));
      }
      function getTypedArrayView(Type2, alignLog2, ptr) {
        const buffer2 = memory.buffer;
        const U32 = new Uint32Array(buffer2);
        const bufPtr = U32[ptr + ARRAYBUFFERVIEW_DATASTART_OFFSET >>> 2];
        return new Type2(buffer2, bufPtr, U32[bufPtr + SIZE_OFFSET >>> 2] >>> alignLog2);
      }
      baseModule.__getInt8Array = getTypedArray.bind(null, Int8Array, 0);
      baseModule.__getInt8ArrayView = getTypedArrayView.bind(null, Int8Array, 0);
      baseModule.__getUint8Array = getTypedArray.bind(null, Uint8Array, 0);
      baseModule.__getUint8ArrayView = getTypedArrayView.bind(null, Uint8Array, 0);
      baseModule.__getUint8ClampedArray = getTypedArray.bind(null, Uint8ClampedArray, 0);
      baseModule.__getUint8ClampedArrayView = getTypedArrayView.bind(null, Uint8ClampedArray, 0);
      baseModule.__getInt16Array = getTypedArray.bind(null, Int16Array, 1);
      baseModule.__getInt16ArrayView = getTypedArrayView.bind(null, Int16Array, 1);
      baseModule.__getUint16Array = getTypedArray.bind(null, Uint16Array, 1);
      baseModule.__getUint16ArrayView = getTypedArrayView.bind(null, Uint16Array, 1);
      baseModule.__getInt32Array = getTypedArray.bind(null, Int32Array, 2);
      baseModule.__getInt32ArrayView = getTypedArrayView.bind(null, Int32Array, 2);
      baseModule.__getUint32Array = getTypedArray.bind(null, Uint32Array, 2);
      baseModule.__getUint32ArrayView = getTypedArrayView.bind(null, Uint32Array, 2);
      if (BIGINT) {
        baseModule.__getInt64Array = getTypedArray.bind(null, BigInt64Array, 3);
        baseModule.__getInt64ArrayView = getTypedArrayView.bind(null, BigInt64Array, 3);
        baseModule.__getUint64Array = getTypedArray.bind(null, BigUint64Array, 3);
        baseModule.__getUint64ArrayView = getTypedArrayView.bind(null, BigUint64Array, 3);
      }
      baseModule.__getFloat32Array = getTypedArray.bind(null, Float32Array, 2);
      baseModule.__getFloat32ArrayView = getTypedArrayView.bind(null, Float32Array, 2);
      baseModule.__getFloat64Array = getTypedArray.bind(null, Float64Array, 3);
      baseModule.__getFloat64ArrayView = getTypedArrayView.bind(null, Float64Array, 3);
      function __instanceof(ptr, baseId) {
        const U32 = new Uint32Array(memory.buffer);
        var id = U32[ptr + ID_OFFSET >>> 2];
        if (id <= U32[rttiBase >>> 2]) {
          do
            if (id == baseId)
              return true;
          while (id = getBase(id));
        }
        return false;
      }
      baseModule.__instanceof = __instanceof;
      baseModule.memory = baseModule.memory || memory;
      baseModule.table = baseModule.table || table;
      return demangle(rawExports, baseModule);
    }
    function isResponse(o) {
      return typeof Response !== "undefined" && o instanceof Response;
    }
    async function instantiate(source, imports) {
      if (isResponse(source = await source))
        return instantiateStreaming(source, imports);
      return postInstantiate(
        preInstantiate(imports || (imports = {})),
        await WebAssembly.instantiate(
          source instanceof WebAssembly.Module ? source : await WebAssembly.compile(source),
          imports
        )
      );
    }
    exports.instantiate = instantiate;
    function instantiateSync(source, imports) {
      return postInstantiate(
        preInstantiate(imports || (imports = {})),
        new WebAssembly.Instance(
          source instanceof WebAssembly.Module ? source : new WebAssembly.Module(source),
          imports
        )
      );
    }
    exports.instantiateSync = instantiateSync;
    async function instantiateStreaming(source, imports) {
      if (!WebAssembly.instantiateStreaming) {
        return instantiate(
          isResponse(source = await source) ? source.arrayBuffer() : source,
          imports
        );
      }
      return postInstantiate(
        preInstantiate(imports || (imports = {})),
        (await WebAssembly.instantiateStreaming(source, imports)).instance
      );
    }
    exports.instantiateStreaming = instantiateStreaming;
    function demangle(exports2, baseModule) {
      var module2 = baseModule ? Object.create(baseModule) : {};
      var setArgumentsLength = exports2["__argumentsLength"] ? function(length4) {
        exports2["__argumentsLength"].value = length4;
      } : exports2["__setArgumentsLength"] || exports2["__setargc"] || function() {
      };
      for (let internalName in exports2) {
        if (!Object.prototype.hasOwnProperty.call(exports2, internalName))
          continue;
        const elem = exports2[internalName];
        let parts = internalName.split(".");
        let curr = module2;
        while (parts.length > 1) {
          let part = parts.shift();
          if (!Object.prototype.hasOwnProperty.call(curr, part))
            curr[part] = {};
          curr = curr[part];
        }
        let name4 = parts[0];
        let hash = name4.indexOf("#");
        if (hash >= 0) {
          let className = name4.substring(0, hash);
          let classElem = curr[className];
          if (typeof classElem === "undefined" || !classElem.prototype) {
            let ctor = function(...args) {
              return ctor.wrap(ctor.prototype.constructor(0, ...args));
            };
            ctor.prototype = {
              valueOf: function valueOf() {
                return this[THIS];
              }
            };
            ctor.wrap = function(thisValue) {
              return Object.create(ctor.prototype, { [THIS]: { value: thisValue, writable: false } });
            };
            if (classElem)
              Object.getOwnPropertyNames(classElem).forEach(
                (name5) => Object.defineProperty(ctor, name5, Object.getOwnPropertyDescriptor(classElem, name5))
              );
            curr[className] = ctor;
          }
          name4 = name4.substring(hash + 1);
          curr = curr[className].prototype;
          if (/^(get|set):/.test(name4)) {
            if (!Object.prototype.hasOwnProperty.call(curr, name4 = name4.substring(4))) {
              let getter = exports2[internalName.replace("set:", "get:")];
              let setter = exports2[internalName.replace("get:", "set:")];
              Object.defineProperty(curr, name4, {
                get: function() {
                  return getter(this[THIS]);
                },
                set: function(value) {
                  setter(this[THIS], value);
                },
                enumerable: true
              });
            }
          } else {
            if (name4 === "constructor") {
              (curr[name4] = (...args) => {
                setArgumentsLength(args.length);
                return elem(...args);
              }).original = elem;
            } else {
              (curr[name4] = function(...args) {
                setArgumentsLength(args.length);
                return elem(this[THIS], ...args);
              }).original = elem;
            }
          }
        } else {
          if (/^(get|set):/.test(name4)) {
            if (!Object.prototype.hasOwnProperty.call(curr, name4 = name4.substring(4))) {
              Object.defineProperty(curr, name4, {
                get: exports2[internalName.replace("set:", "get:")],
                set: exports2[internalName.replace("get:", "set:")],
                enumerable: true
              });
            }
          } else if (typeof elem === "function" && elem !== setArgumentsLength) {
            (curr[name4] = (...args) => {
              setArgumentsLength(args.length);
              return elem(...args);
            }).original = elem;
          } else {
            curr[name4] = elem;
          }
        }
      }
      return module2;
    }
    exports.demangle = demangle;
  }
});

// node_modules/rabin-wasm/dist/rabin-wasm.node.js
var require_rabin_wasm_node = __commonJS({
  "node_modules/rabin-wasm/dist/rabin-wasm.node.js"(exports, module) {
    var { instantiateSync } = require_loader();
    var fs6 = __require("fs");
    loadWebAssembly.supported = typeof WebAssembly !== "undefined";
    async function loadWebAssembly(imp = {}) {
      if (!loadWebAssembly.supported)
        return null;
      return instantiateSync(fs6.readFileSync(__dirname + "/../dist/rabin.wasm"), imp);
    }
    module.exports = loadWebAssembly;
  }
});

// node_modules/rabin-wasm/src/index.js
var require_src = __commonJS({
  "node_modules/rabin-wasm/src/index.js"(exports, module) {
    var Rabin = require_rabin();
    var getRabin = require_rabin_wasm_node();
    var create5 = async (avg, min, max, windowSize, polynomial) => {
      const compiled = await getRabin();
      return new Rabin(compiled, avg, min, max, windowSize, polynomial);
    };
    module.exports = {
      Rabin,
      create: create5
    };
  }
});

// node_modules/is-plain-obj/index.js
var require_is_plain_obj = __commonJS({
  "node_modules/is-plain-obj/index.js"(exports, module) {
    "use strict";
    module.exports = (value) => {
      if (Object.prototype.toString.call(value) !== "[object Object]") {
        return false;
      }
      const prototype = Object.getPrototypeOf(value);
      return prototype === null || prototype === Object.prototype;
    };
  }
});

// node_modules/merge-options/index.js
var require_merge_options = __commonJS({
  "node_modules/merge-options/index.js"(exports, module) {
    "use strict";
    var isOptionObject = require_is_plain_obj();
    var { hasOwnProperty } = Object.prototype;
    var { propertyIsEnumerable } = Object;
    var defineProperty = (object, name4, value) => Object.defineProperty(object, name4, {
      value,
      writable: true,
      enumerable: true,
      configurable: true
    });
    var globalThis2 = exports;
    var defaultMergeOptions = {
      concatArrays: false,
      ignoreUndefined: false
    };
    var getEnumerableOwnPropertyKeys = (value) => {
      const keys = [];
      for (const key in value) {
        if (hasOwnProperty.call(value, key)) {
          keys.push(key);
        }
      }
      if (Object.getOwnPropertySymbols) {
        const symbols = Object.getOwnPropertySymbols(value);
        for (const symbol2 of symbols) {
          if (propertyIsEnumerable.call(value, symbol2)) {
            keys.push(symbol2);
          }
        }
      }
      return keys;
    };
    function clone(value) {
      if (Array.isArray(value)) {
        return cloneArray(value);
      }
      if (isOptionObject(value)) {
        return cloneOptionObject(value);
      }
      return value;
    }
    function cloneArray(array) {
      const result = array.slice(0, 0);
      getEnumerableOwnPropertyKeys(array).forEach((key) => {
        defineProperty(result, key, clone(array[key]));
      });
      return result;
    }
    function cloneOptionObject(object) {
      const result = Object.getPrototypeOf(object) === null ? /* @__PURE__ */ Object.create(null) : {};
      getEnumerableOwnPropertyKeys(object).forEach((key) => {
        defineProperty(result, key, clone(object[key]));
      });
      return result;
    }
    var mergeKeys = (merged, source, keys, config) => {
      keys.forEach((key) => {
        if (typeof source[key] === "undefined" && config.ignoreUndefined) {
          return;
        }
        if (key in merged && merged[key] !== Object.getPrototypeOf(merged)) {
          defineProperty(merged, key, merge2(merged[key], source[key], config));
        } else {
          defineProperty(merged, key, clone(source[key]));
        }
      });
      return merged;
    };
    var concatArrays = (merged, source, config) => {
      let result = merged.slice(0, 0);
      let resultIndex = 0;
      [merged, source].forEach((array) => {
        const indices = [];
        for (let k = 0; k < array.length; k++) {
          if (!hasOwnProperty.call(array, k)) {
            continue;
          }
          indices.push(String(k));
          if (array === merged) {
            defineProperty(result, resultIndex++, array[k]);
          } else {
            defineProperty(result, resultIndex++, clone(array[k]));
          }
        }
        result = mergeKeys(result, array, getEnumerableOwnPropertyKeys(array).filter((key) => !indices.includes(key)), config);
      });
      return result;
    };
    function merge2(merged, source, config) {
      if (config.concatArrays && Array.isArray(merged) && Array.isArray(source)) {
        return concatArrays(merged, source, config);
      }
      if (!isOptionObject(source) || !isOptionObject(merged)) {
        return clone(source);
      }
      return mergeKeys(merged, source, getEnumerableOwnPropertyKeys(source), config);
    }
    module.exports = function(...options) {
      const config = merge2(clone(defaultMergeOptions), this !== globalThis2 && this || {}, defaultMergeOptions);
      let merged = { _: {} };
      for (const option of options) {
        if (option === void 0) {
          continue;
        }
        if (!isOptionObject(option)) {
          throw new TypeError("`" + option + "` is not an Option Object");
        }
        merged = merge2(merged, { _: option }, config);
      }
      return merged._;
    };
  }
});

// node_modules/ms/index.js
var require_ms = __commonJS({
  "node_modules/ms/index.js"(exports, module) {
    var s = 1e3;
    var m = s * 60;
    var h = m * 60;
    var d = h * 24;
    var w = d * 7;
    var y = d * 365.25;
    module.exports = function(val, options) {
      options = options || {};
      var type = typeof val;
      if (type === "string" && val.length > 0) {
        return parse(val);
      } else if (type === "number" && isFinite(val)) {
        return options.long ? fmtLong(val) : fmtShort(val);
      }
      throw new Error(
        "val is not a non-empty string or a valid number. val=" + JSON.stringify(val)
      );
    };
    function parse(str) {
      str = String(str);
      if (str.length > 100) {
        return;
      }
      var match2 = /^(-?(?:\d+)?\.?\d+) *(milliseconds?|msecs?|ms|seconds?|secs?|s|minutes?|mins?|m|hours?|hrs?|h|days?|d|weeks?|w|years?|yrs?|y)?$/i.exec(
        str
      );
      if (!match2) {
        return;
      }
      var n = parseFloat(match2[1]);
      var type = (match2[2] || "ms").toLowerCase();
      switch (type) {
        case "years":
        case "year":
        case "yrs":
        case "yr":
        case "y":
          return n * y;
        case "weeks":
        case "week":
        case "w":
          return n * w;
        case "days":
        case "day":
        case "d":
          return n * d;
        case "hours":
        case "hour":
        case "hrs":
        case "hr":
        case "h":
          return n * h;
        case "minutes":
        case "minute":
        case "mins":
        case "min":
        case "m":
          return n * m;
        case "seconds":
        case "second":
        case "secs":
        case "sec":
        case "s":
          return n * s;
        case "milliseconds":
        case "millisecond":
        case "msecs":
        case "msec":
        case "ms":
          return n;
        default:
          return void 0;
      }
    }
    function fmtShort(ms) {
      var msAbs = Math.abs(ms);
      if (msAbs >= d) {
        return Math.round(ms / d) + "d";
      }
      if (msAbs >= h) {
        return Math.round(ms / h) + "h";
      }
      if (msAbs >= m) {
        return Math.round(ms / m) + "m";
      }
      if (msAbs >= s) {
        return Math.round(ms / s) + "s";
      }
      return ms + "ms";
    }
    function fmtLong(ms) {
      var msAbs = Math.abs(ms);
      if (msAbs >= d) {
        return plural(ms, msAbs, d, "day");
      }
      if (msAbs >= h) {
        return plural(ms, msAbs, h, "hour");
      }
      if (msAbs >= m) {
        return plural(ms, msAbs, m, "minute");
      }
      if (msAbs >= s) {
        return plural(ms, msAbs, s, "second");
      }
      return ms + " ms";
    }
    function plural(ms, msAbs, n, name4) {
      var isPlural = msAbs >= n * 1.5;
      return Math.round(ms / n) + " " + name4 + (isPlural ? "s" : "");
    }
  }
});

// node_modules/debug/src/common.js
var require_common = __commonJS({
  "node_modules/debug/src/common.js"(exports, module) {
    function setup(env) {
      createDebug.debug = createDebug;
      createDebug.default = createDebug;
      createDebug.coerce = coerce3;
      createDebug.disable = disable;
      createDebug.enable = enable;
      createDebug.enabled = enabled;
      createDebug.humanize = require_ms();
      createDebug.destroy = destroy;
      Object.keys(env).forEach((key) => {
        createDebug[key] = env[key];
      });
      createDebug.names = [];
      createDebug.skips = [];
      createDebug.formatters = {};
      function selectColor(namespace) {
        let hash = 0;
        for (let i = 0; i < namespace.length; i++) {
          hash = (hash << 5) - hash + namespace.charCodeAt(i);
          hash |= 0;
        }
        return createDebug.colors[Math.abs(hash) % createDebug.colors.length];
      }
      createDebug.selectColor = selectColor;
      function createDebug(namespace) {
        let prevTime;
        let enableOverride = null;
        let namespacesCache;
        let enabledCache;
        function debug3(...args) {
          if (!debug3.enabled) {
            return;
          }
          const self = debug3;
          const curr = Number(/* @__PURE__ */ new Date());
          const ms = curr - (prevTime || curr);
          self.diff = ms;
          self.prev = prevTime;
          self.curr = curr;
          prevTime = curr;
          args[0] = createDebug.coerce(args[0]);
          if (typeof args[0] !== "string") {
            args.unshift("%O");
          }
          let index = 0;
          args[0] = args[0].replace(/%([a-zA-Z%])/g, (match2, format3) => {
            if (match2 === "%%") {
              return "%";
            }
            index++;
            const formatter = createDebug.formatters[format3];
            if (typeof formatter === "function") {
              const val = args[index];
              match2 = formatter.call(self, val);
              args.splice(index, 1);
              index--;
            }
            return match2;
          });
          createDebug.formatArgs.call(self, args);
          const logFn = self.log || createDebug.log;
          logFn.apply(self, args);
        }
        debug3.namespace = namespace;
        debug3.useColors = createDebug.useColors();
        debug3.color = createDebug.selectColor(namespace);
        debug3.extend = extend;
        debug3.destroy = createDebug.destroy;
        Object.defineProperty(debug3, "enabled", {
          enumerable: true,
          configurable: false,
          get: () => {
            if (enableOverride !== null) {
              return enableOverride;
            }
            if (namespacesCache !== createDebug.namespaces) {
              namespacesCache = createDebug.namespaces;
              enabledCache = createDebug.enabled(namespace);
            }
            return enabledCache;
          },
          set: (v) => {
            enableOverride = v;
          }
        });
        if (typeof createDebug.init === "function") {
          createDebug.init(debug3);
        }
        return debug3;
      }
      function extend(namespace, delimiter) {
        const newDebug = createDebug(this.namespace + (typeof delimiter === "undefined" ? ":" : delimiter) + namespace);
        newDebug.log = this.log;
        return newDebug;
      }
      function enable(namespaces) {
        createDebug.save(namespaces);
        createDebug.namespaces = namespaces;
        createDebug.names = [];
        createDebug.skips = [];
        let i;
        const split = (typeof namespaces === "string" ? namespaces : "").split(/[\s,]+/);
        const len = split.length;
        for (i = 0; i < len; i++) {
          if (!split[i]) {
            continue;
          }
          namespaces = split[i].replace(/\*/g, ".*?");
          if (namespaces[0] === "-") {
            createDebug.skips.push(new RegExp("^" + namespaces.slice(1) + "$"));
          } else {
            createDebug.names.push(new RegExp("^" + namespaces + "$"));
          }
        }
      }
      function disable() {
        const namespaces = [
          ...createDebug.names.map(toNamespace),
          ...createDebug.skips.map(toNamespace).map((namespace) => "-" + namespace)
        ].join(",");
        createDebug.enable("");
        return namespaces;
      }
      function enabled(name4) {
        if (name4[name4.length - 1] === "*") {
          return true;
        }
        let i;
        let len;
        for (i = 0, len = createDebug.skips.length; i < len; i++) {
          if (createDebug.skips[i].test(name4)) {
            return false;
          }
        }
        for (i = 0, len = createDebug.names.length; i < len; i++) {
          if (createDebug.names[i].test(name4)) {
            return true;
          }
        }
        return false;
      }
      function toNamespace(regexp) {
        return regexp.toString().substring(2, regexp.toString().length - 2).replace(/\.\*\?$/, "*");
      }
      function coerce3(val) {
        if (val instanceof Error) {
          return val.stack || val.message;
        }
        return val;
      }
      function destroy() {
        console.warn("Instance method `debug.destroy()` is deprecated and no longer does anything. It will be removed in the next major version of `debug`.");
      }
      createDebug.enable(createDebug.load());
      return createDebug;
    }
    module.exports = setup;
  }
});

// node_modules/debug/src/browser.js
var require_browser = __commonJS({
  "node_modules/debug/src/browser.js"(exports, module) {
    exports.formatArgs = formatArgs;
    exports.save = save;
    exports.load = load;
    exports.useColors = useColors;
    exports.storage = localstorage();
    exports.destroy = /* @__PURE__ */ (() => {
      let warned = false;
      return () => {
        if (!warned) {
          warned = true;
          console.warn("Instance method `debug.destroy()` is deprecated and no longer does anything. It will be removed in the next major version of `debug`.");
        }
      };
    })();
    exports.colors = [
      "#0000CC",
      "#0000FF",
      "#0033CC",
      "#0033FF",
      "#0066CC",
      "#0066FF",
      "#0099CC",
      "#0099FF",
      "#00CC00",
      "#00CC33",
      "#00CC66",
      "#00CC99",
      "#00CCCC",
      "#00CCFF",
      "#3300CC",
      "#3300FF",
      "#3333CC",
      "#3333FF",
      "#3366CC",
      "#3366FF",
      "#3399CC",
      "#3399FF",
      "#33CC00",
      "#33CC33",
      "#33CC66",
      "#33CC99",
      "#33CCCC",
      "#33CCFF",
      "#6600CC",
      "#6600FF",
      "#6633CC",
      "#6633FF",
      "#66CC00",
      "#66CC33",
      "#9900CC",
      "#9900FF",
      "#9933CC",
      "#9933FF",
      "#99CC00",
      "#99CC33",
      "#CC0000",
      "#CC0033",
      "#CC0066",
      "#CC0099",
      "#CC00CC",
      "#CC00FF",
      "#CC3300",
      "#CC3333",
      "#CC3366",
      "#CC3399",
      "#CC33CC",
      "#CC33FF",
      "#CC6600",
      "#CC6633",
      "#CC9900",
      "#CC9933",
      "#CCCC00",
      "#CCCC33",
      "#FF0000",
      "#FF0033",
      "#FF0066",
      "#FF0099",
      "#FF00CC",
      "#FF00FF",
      "#FF3300",
      "#FF3333",
      "#FF3366",
      "#FF3399",
      "#FF33CC",
      "#FF33FF",
      "#FF6600",
      "#FF6633",
      "#FF9900",
      "#FF9933",
      "#FFCC00",
      "#FFCC33"
    ];
    function useColors() {
      if (typeof window !== "undefined" && window.process && (window.process.type === "renderer" || window.process.__nwjs)) {
        return true;
      }
      if (typeof navigator !== "undefined" && navigator.userAgent && navigator.userAgent.toLowerCase().match(/(edge|trident)\/(\d+)/)) {
        return false;
      }
      return typeof document !== "undefined" && document.documentElement && document.documentElement.style && document.documentElement.style.WebkitAppearance || // Is firebug? http://stackoverflow.com/a/398120/376773
      typeof window !== "undefined" && window.console && (window.console.firebug || window.console.exception && window.console.table) || // Is firefox >= v31?
      // https://developer.mozilla.org/en-US/docs/Tools/Web_Console#Styling_messages
      typeof navigator !== "undefined" && navigator.userAgent && navigator.userAgent.toLowerCase().match(/firefox\/(\d+)/) && parseInt(RegExp.$1, 10) >= 31 || // Double check webkit in userAgent just in case we are in a worker
      typeof navigator !== "undefined" && navigator.userAgent && navigator.userAgent.toLowerCase().match(/applewebkit\/(\d+)/);
    }
    function formatArgs(args) {
      args[0] = (this.useColors ? "%c" : "") + this.namespace + (this.useColors ? " %c" : " ") + args[0] + (this.useColors ? "%c " : " ") + "+" + module.exports.humanize(this.diff);
      if (!this.useColors) {
        return;
      }
      const c = "color: " + this.color;
      args.splice(1, 0, c, "color: inherit");
      let index = 0;
      let lastC = 0;
      args[0].replace(/%[a-zA-Z%]/g, (match2) => {
        if (match2 === "%%") {
          return;
        }
        index++;
        if (match2 === "%c") {
          lastC = index;
        }
      });
      args.splice(lastC, 0, c);
    }
    exports.log = console.debug || console.log || (() => {
    });
    function save(namespaces) {
      try {
        if (namespaces) {
          exports.storage.setItem("debug", namespaces);
        } else {
          exports.storage.removeItem("debug");
        }
      } catch (error) {
      }
    }
    function load() {
      let r;
      try {
        r = exports.storage.getItem("debug");
      } catch (error) {
      }
      if (!r && typeof process !== "undefined" && "env" in process) {
        r = process.env.DEBUG;
      }
      return r;
    }
    function localstorage() {
      try {
        return localStorage;
      } catch (error) {
      }
    }
    module.exports = require_common()(exports);
    var { formatters } = module.exports;
    formatters.j = function(v) {
      try {
        return JSON.stringify(v);
      } catch (error) {
        return "[UnexpectedJSONParseError]: " + error.message;
      }
    };
  }
});

// node_modules/debug/src/node.js
var require_node = __commonJS({
  "node_modules/debug/src/node.js"(exports, module) {
    var tty = __require("tty");
    var util = __require("util");
    exports.init = init;
    exports.log = log12;
    exports.formatArgs = formatArgs;
    exports.save = save;
    exports.load = load;
    exports.useColors = useColors;
    exports.destroy = util.deprecate(
      () => {
      },
      "Instance method `debug.destroy()` is deprecated and no longer does anything. It will be removed in the next major version of `debug`."
    );
    exports.colors = [6, 2, 3, 4, 5, 1];
    try {
      const supportsColor = __require("supports-color");
      if (supportsColor && (supportsColor.stderr || supportsColor).level >= 2) {
        exports.colors = [
          20,
          21,
          26,
          27,
          32,
          33,
          38,
          39,
          40,
          41,
          42,
          43,
          44,
          45,
          56,
          57,
          62,
          63,
          68,
          69,
          74,
          75,
          76,
          77,
          78,
          79,
          80,
          81,
          92,
          93,
          98,
          99,
          112,
          113,
          128,
          129,
          134,
          135,
          148,
          149,
          160,
          161,
          162,
          163,
          164,
          165,
          166,
          167,
          168,
          169,
          170,
          171,
          172,
          173,
          178,
          179,
          184,
          185,
          196,
          197,
          198,
          199,
          200,
          201,
          202,
          203,
          204,
          205,
          206,
          207,
          208,
          209,
          214,
          215,
          220,
          221
        ];
      }
    } catch (error) {
    }
    exports.inspectOpts = Object.keys(process.env).filter((key) => {
      return /^debug_/i.test(key);
    }).reduce((obj, key) => {
      const prop = key.substring(6).toLowerCase().replace(/_([a-z])/g, (_, k) => {
        return k.toUpperCase();
      });
      let val = process.env[key];
      if (/^(yes|on|true|enabled)$/i.test(val)) {
        val = true;
      } else if (/^(no|off|false|disabled)$/i.test(val)) {
        val = false;
      } else if (val === "null") {
        val = null;
      } else {
        val = Number(val);
      }
      obj[prop] = val;
      return obj;
    }, {});
    function useColors() {
      return "colors" in exports.inspectOpts ? Boolean(exports.inspectOpts.colors) : tty.isatty(process.stderr.fd);
    }
    function formatArgs(args) {
      const { namespace: name4, useColors: useColors2 } = this;
      if (useColors2) {
        const c = this.color;
        const colorCode = "\x1B[3" + (c < 8 ? c : "8;5;" + c);
        const prefix = `  ${colorCode};1m${name4} \x1B[0m`;
        args[0] = prefix + args[0].split("\n").join("\n" + prefix);
        args.push(colorCode + "m+" + module.exports.humanize(this.diff) + "\x1B[0m");
      } else {
        args[0] = getDate() + name4 + " " + args[0];
      }
    }
    function getDate() {
      if (exports.inspectOpts.hideDate) {
        return "";
      }
      return (/* @__PURE__ */ new Date()).toISOString() + " ";
    }
    function log12(...args) {
      return process.stderr.write(util.format(...args) + "\n");
    }
    function save(namespaces) {
      if (namespaces) {
        process.env.DEBUG = namespaces;
      } else {
        delete process.env.DEBUG;
      }
    }
    function load() {
      return process.env.DEBUG;
    }
    function init(debug3) {
      debug3.inspectOpts = {};
      const keys = Object.keys(exports.inspectOpts);
      for (let i = 0; i < keys.length; i++) {
        debug3.inspectOpts[keys[i]] = exports.inspectOpts[keys[i]];
      }
    }
    module.exports = require_common()(exports);
    var { formatters } = module.exports;
    formatters.o = function(v) {
      this.inspectOpts.colors = this.useColors;
      return util.inspect(v, this.inspectOpts).split("\n").map((str) => str.trim()).join(" ");
    };
    formatters.O = function(v) {
      this.inspectOpts.colors = this.useColors;
      return util.inspect(v, this.inspectOpts);
    };
  }
});

// node_modules/debug/src/index.js
var require_src2 = __commonJS({
  "node_modules/debug/src/index.js"(exports, module) {
    if (typeof process === "undefined" || process.type === "renderer" || process.browser === true || process.__nwjs) {
      module.exports = require_browser();
    } else {
      module.exports = require_node();
    }
  }
});

// node_modules/balanced-match/index.js
var require_balanced_match = __commonJS({
  "node_modules/balanced-match/index.js"(exports, module) {
    "use strict";
    module.exports = balanced2;
    function balanced2(a, b, str) {
      if (a instanceof RegExp)
        a = maybeMatch(a, str);
      if (b instanceof RegExp)
        b = maybeMatch(b, str);
      var r = range(a, b, str);
      return r && {
        start: r[0],
        end: r[1],
        pre: str.slice(0, r[0]),
        body: str.slice(r[0] + a.length, r[1]),
        post: str.slice(r[1] + b.length)
      };
    }
    function maybeMatch(reg, str) {
      var m = str.match(reg);
      return m ? m[0] : null;
    }
    balanced2.range = range;
    function range(a, b, str) {
      var begs, beg, left, right, result;
      var ai = str.indexOf(a);
      var bi = str.indexOf(b, ai + 1);
      var i = ai;
      if (ai >= 0 && bi > 0) {
        if (a === b) {
          return [ai, bi];
        }
        begs = [];
        left = str.length;
        while (i >= 0 && !result) {
          if (i == ai) {
            begs.push(i);
            ai = str.indexOf(a, i + 1);
          } else if (begs.length == 1) {
            result = [begs.pop(), bi];
          } else {
            beg = begs.pop();
            if (beg < left) {
              left = beg;
              right = bi;
            }
            bi = str.indexOf(b, i + 1);
          }
          i = ai < bi && ai >= 0 ? ai : bi;
        }
        if (begs.length) {
          result = [left, right];
        }
      }
      return result;
    }
  }
});

// node_modules/brace-expansion/index.js
var require_brace_expansion = __commonJS({
  "node_modules/brace-expansion/index.js"(exports, module) {
    var balanced2 = require_balanced_match();
    module.exports = expandTop;
    var escSlash = "\0SLASH" + Math.random() + "\0";
    var escOpen = "\0OPEN" + Math.random() + "\0";
    var escClose = "\0CLOSE" + Math.random() + "\0";
    var escComma = "\0COMMA" + Math.random() + "\0";
    var escPeriod = "\0PERIOD" + Math.random() + "\0";
    function numeric(str) {
      return parseInt(str, 10) == str ? parseInt(str, 10) : str.charCodeAt(0);
    }
    function escapeBraces(str) {
      return str.split("\\\\").join(escSlash).split("\\{").join(escOpen).split("\\}").join(escClose).split("\\,").join(escComma).split("\\.").join(escPeriod);
    }
    function unescapeBraces(str) {
      return str.split(escSlash).join("\\").split(escOpen).join("{").split(escClose).join("}").split(escComma).join(",").split(escPeriod).join(".");
    }
    function parseCommaParts(str) {
      if (!str)
        return [""];
      var parts = [];
      var m = balanced2("{", "}", str);
      if (!m)
        return str.split(",");
      var pre = m.pre;
      var body = m.body;
      var post = m.post;
      var p = pre.split(",");
      p[p.length - 1] += "{" + body + "}";
      var postParts = parseCommaParts(post);
      if (post.length) {
        p[p.length - 1] += postParts.shift();
        p.push.apply(p, postParts);
      }
      parts.push.apply(parts, p);
      return parts;
    }
    function expandTop(str) {
      if (!str)
        return [];
      if (str.substr(0, 2) === "{}") {
        str = "\\{\\}" + str.substr(2);
      }
      return expand2(escapeBraces(str), true).map(unescapeBraces);
    }
    function embrace(str) {
      return "{" + str + "}";
    }
    function isPadded(el) {
      return /^-?0\d/.test(el);
    }
    function lte(i, y) {
      return i <= y;
    }
    function gte(i, y) {
      return i >= y;
    }
    function expand2(str, isTop) {
      var expansions = [];
      var m = balanced2("{", "}", str);
      if (!m)
        return [str];
      var pre = m.pre;
      var post = m.post.length ? expand2(m.post, false) : [""];
      if (/\$$/.test(m.pre)) {
        for (var k = 0; k < post.length; k++) {
          var expansion = pre + "{" + m.body + "}" + post[k];
          expansions.push(expansion);
        }
      } else {
        var isNumericSequence = /^-?\d+\.\.-?\d+(?:\.\.-?\d+)?$/.test(m.body);
        var isAlphaSequence = /^[a-zA-Z]\.\.[a-zA-Z](?:\.\.-?\d+)?$/.test(m.body);
        var isSequence = isNumericSequence || isAlphaSequence;
        var isOptions = m.body.indexOf(",") >= 0;
        if (!isSequence && !isOptions) {
          if (m.post.match(/,.*\}/)) {
            str = m.pre + "{" + m.body + escClose + m.post;
            return expand2(str);
          }
          return [str];
        }
        var n;
        if (isSequence) {
          n = m.body.split(/\.\./);
        } else {
          n = parseCommaParts(m.body);
          if (n.length === 1) {
            n = expand2(n[0], false).map(embrace);
            if (n.length === 1) {
              return post.map(function(p) {
                return m.pre + n[0] + p;
              });
            }
          }
        }
        var N;
        if (isSequence) {
          var x = numeric(n[0]);
          var y = numeric(n[1]);
          var width = Math.max(n[0].length, n[1].length);
          var incr = n.length == 3 ? Math.abs(numeric(n[2])) : 1;
          var test = lte;
          var reverse = y < x;
          if (reverse) {
            incr *= -1;
            test = gte;
          }
          var pad = n.some(isPadded);
          N = [];
          for (var i = x; test(i, y); i += incr) {
            var c;
            if (isAlphaSequence) {
              c = String.fromCharCode(i);
              if (c === "\\")
                c = "";
            } else {
              c = String(i);
              if (pad) {
                var need = width - c.length;
                if (need > 0) {
                  var z = new Array(need + 1).join("0");
                  if (i < 0)
                    c = "-" + z + c.slice(1);
                  else
                    c = z + c;
                }
              }
            }
            N.push(c);
          }
        } else {
          N = [];
          for (var j = 0; j < n.length; j++) {
            N.push.apply(N, expand2(n[j], false));
          }
        }
        for (var j = 0; j < N.length; j++) {
          for (var k = 0; k < post.length; k++) {
            var expansion = pre + N[j] + post[k];
            if (!isTop || isSequence || expansion)
              expansions.push(expansion);
          }
        }
      }
      return expansions;
    }
  }
});

// node_modules/fast-write-atomic/index.js
var require_fast_write_atomic = __commonJS({
  "node_modules/fast-write-atomic/index.js"(exports, module) {
    "use strict";
    var { open, write: write2, close, rename, fsync, unlink } = __require("fs");
    var { join, dirname } = __require("path");
    var counter = 0;
    function cleanup(dest, err, cb) {
      unlink(dest, function() {
        cb(err);
      });
    }
    function closeAndCleanup(fd, dest, err, cb) {
      close(fd, cleanup.bind(null, dest, err, cb));
    }
    function writeLoop(fd, content, contentLength, offset, cb) {
      write2(fd, content, offset, function(err, bytesWritten) {
        if (err) {
          cb(err);
          return;
        }
        return bytesWritten < contentLength - offset ? writeLoop(fd, content, contentLength, offset + bytesWritten, cb) : cb(null);
      });
    }
    function openLoop(dest, cb) {
      open(dest, "w", function(err, fd) {
        if (err) {
          return err.code === "EMFILE" ? openLoop(dest, cb) : cb(err);
        }
        cb(null, fd);
      });
    }
    function writeAtomic2(path6, content, cb) {
      const tmp = join(dirname(path6), "." + process.pid + "." + counter++);
      openLoop(tmp, function(err, fd) {
        if (err) {
          cb(err);
          return;
        }
        const contentLength = Buffer.byteLength(content);
        writeLoop(fd, content, contentLength, 0, function(err2) {
          if (err2) {
            closeAndCleanup(fd, tmp, err2, cb);
            return;
          }
          fsync(fd, function(err3) {
            if (err3) {
              closeAndCleanup(fd, tmp, err3, cb);
              return;
            }
            close(fd, function(err4) {
              if (err4) {
                cleanup(tmp, err4, cb);
                return;
              }
              rename(tmp, path6, (err5) => {
                if (err5) {
                  cleanup(tmp, err5, cb);
                  return;
                }
                cb(null);
              });
            });
          });
        });
        content = null;
      });
    }
    module.exports = writeAtomic2;
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
  async create(name4) {
    const command = new CreateBucketCommand({
      Bucket: name4
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
  async delete(name4) {
    const command = new DeleteBucketCommand({
      Bucket: name4
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
  async setPrivacy(name4, targetState) {
    const command = new PutBucketAclCommand({
      Bucket: name4,
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
  async getPrivacy(name4) {
    const command = new GetBucketAclCommand({
      Bucket: name4
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
  async create(name4, options = {}) {
    try {
      let createOptions = {
        name: name4
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
  async delete(name4) {
    try {
      await this.#client.request({
        method: "DELETE",
        url: `/${name4}`,
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
  async get(name4) {
    try {
      const getResponse = await this.#client.request({
        method: "GET",
        url: `/${name4}`,
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
  async update(name4, options) {
    try {
      const updateOptions = {
        name: name4
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
        url: `/${name4}`,
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
  async toggle(name4, targetState) {
    try {
      await this.#client.request({
        method: "PUT",
        url: `/${name4}`,
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
  constructor(major, name4, terminal) {
    this.major = major;
    this.majorEncoded = major << 5;
    this.name = name4;
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
  (string2) => {
    return string2.length > 64 ? (
      // eslint-disable-line operator-linebreak
      // @ts-ignore
      globalThis.Buffer.from(string2)
    ) : utf8ToBytes(string2);
  }
) : (
  // eslint-disable-line operator-linebreak
  /**
   * @param {string} string
   */
  (string2) => {
    return string2.length > 64 ? textEncoder.encode(string2) : utf8ToBytes(string2);
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
  (chunks, length4) => {
    chunks = chunks.map((c) => c instanceof Uint8Array ? c : (
      // eslint-disable-line operator-linebreak
      // @ts-ignore
      globalThis.Buffer.from(c)
    ));
    return asU8A(globalThis.Buffer.concat(chunks, length4));
  }
) : (
  // eslint-disable-line operator-linebreak
  /**
   * @param {Uint8Array[]} chunks
   * @param {number} length
   * @returns {Uint8Array}
   */
  (chunks, length4) => {
    const out = new Uint8Array(length4);
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
function toToken(data, pos, prefix, length4) {
  assertEnoughData(data, pos, prefix + length4);
  const buf2 = slice(data, pos + prefix, pos + prefix + length4);
  return new Token(Type.bytes, buf2, prefix + length4);
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
function toToken2(data, pos, prefix, length4, options) {
  const totLength = prefix + length4;
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
function toToken3(_data, _pos, prefix, length4) {
  return new Token(Type.array, length4, prefix);
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
function toToken4(_data, _pos, prefix, length4) {
  return new Token(Type.map, length4, prefix);
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
    const length4 = isMap ? obj.size : keys.length;
    if (!length4) {
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
      return [new Token(Type.map, length4), entries, new Token(Type.break)];
    }
    return [new Token(Type.map, length4), entries];
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
function base(ALPHABET, name4) {
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
  function encode12(source) {
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
    var length4 = 0;
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
      for (var it1 = size - 1; (carry !== 0 || i2 < length4) && it1 !== -1; it1--, i2++) {
        carry += 256 * b58[it1] >>> 0;
        b58[it1] = carry % BASE >>> 0;
        carry = carry / BASE >>> 0;
      }
      if (carry !== 0) {
        throw new Error("Non-zero carry");
      }
      length4 = i2;
      pbegin++;
    }
    var it2 = size - length4;
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
    var length4 = 0;
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
      for (var it3 = size - 1; (carry !== 0 || i2 < length4) && it3 !== -1; it3--, i2++) {
        carry += BASE * b256[it3] >>> 0;
        b256[it3] = carry % 256 >>> 0;
        carry = carry / 256 >>> 0;
      }
      if (carry !== 0) {
        throw new Error("Non-zero carry");
      }
      length4 = i2;
      psz++;
    }
    if (source[psz] === " ") {
      return;
    }
    var it4 = size - length4;
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
  function decode15(string2) {
    var buffer2 = decodeUnsafe(string2);
    if (buffer2) {
      return buffer2;
    }
    throw new Error(`Non-${name4} character`);
  }
  return {
    encode: encode12,
    decodeUnsafe,
    decode: decode15
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
  constructor(name4, prefix, baseEncode) {
    this.name = name4;
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
  constructor(name4, prefix, baseDecode) {
    this.name = name4;
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
  constructor(name4, prefix, baseEncode, baseDecode) {
    this.name = name4;
    this.prefix = prefix;
    this.baseEncode = baseEncode;
    this.baseDecode = baseDecode;
    this.encoder = new Encoder(name4, prefix, baseEncode);
    this.decoder = new Decoder(name4, prefix, baseDecode);
  }
  encode(input) {
    return this.encoder.encode(input);
  }
  decode(input) {
    return this.decoder.decode(input);
  }
};
function from({ name: name4, prefix, encode: encode12, decode: decode15 }) {
  return new Codec(name4, prefix, encode12, decode15);
}
function baseX({ name: name4, prefix, alphabet: alphabet2 }) {
  const { encode: encode12, decode: decode15 } = base_x_default(alphabet2, name4);
  return from({
    prefix,
    name: name4,
    encode: encode12,
    decode: (text) => coerce(decode15(text))
  });
}
function decode2(string2, alphabet2, bitsPerChar, name4) {
  const codes = {};
  for (let i = 0; i < alphabet2.length; ++i) {
    codes[alphabet2[i]] = i;
  }
  let end = string2.length;
  while (string2[end - 1] === "=") {
    --end;
  }
  const out = new Uint8Array(end * bitsPerChar / 8 | 0);
  let bits = 0;
  let buffer2 = 0;
  let written = 0;
  for (let i = 0; i < end; ++i) {
    const value = codes[string2[i]];
    if (value === void 0) {
      throw new SyntaxError(`Non-${name4} character`);
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
function encode2(data, alphabet2, bitsPerChar) {
  const pad = alphabet2[alphabet2.length - 1] === "=";
  const mask = (1 << bitsPerChar) - 1;
  let out = "";
  let bits = 0;
  let buffer2 = 0;
  for (let i = 0; i < data.length; ++i) {
    buffer2 = buffer2 << 8 | data[i];
    bits += 8;
    while (bits > bitsPerChar) {
      bits -= bitsPerChar;
      out += alphabet2[mask & buffer2 >> bits];
    }
  }
  if (bits !== 0) {
    out += alphabet2[mask & buffer2 << bitsPerChar - bits];
  }
  if (pad) {
    while ((out.length * bitsPerChar & 7) !== 0) {
      out += "=";
    }
  }
  return out;
}
function rfc4648({ name: name4, prefix, bitsPerChar, alphabet: alphabet2 }) {
  return from({
    prefix,
    name: name4,
    encode(input) {
      return encode2(input, alphabet2, bitsPerChar);
    },
    decode(input) {
      return decode2(input, alphabet2, bitsPerChar, name4);
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
  const code5 = varint_default.decode(data, offset);
  return [code5, varint_default.decode.bytes];
}
function encodeTo(int, target, offset = 0) {
  varint_default.encode(int, target, offset);
  return target;
}
function encodingLength(int) {
  return varint_default.encodingLength(int);
}

// node_modules/@ipld/dag-cbor/node_modules/multiformats/dist/src/hashes/digest.js
function create(code5, digest2) {
  const size = digest2.byteLength;
  const sizeOffset = encodingLength(code5);
  const digestOffset = sizeOffset + encodingLength(size);
  const bytes = new Uint8Array(digestOffset + size);
  encodeTo(code5, bytes, 0);
  encodeTo(size, bytes, sizeOffset);
  bytes.set(digest2, digestOffset);
  return new Digest(code5, size, digest2, bytes);
}
function decode5(multihash) {
  const bytes = coerce(multihash);
  const [code5, sizeOffset] = decode4(bytes);
  const [size, digestOffset] = decode4(bytes.subarray(sizeOffset));
  const digest2 = bytes.subarray(sizeOffset + digestOffset);
  if (digest2.byteLength !== size) {
    throw new Error("Incorrect length");
  }
  return new Digest(code5, size, digest2, bytes);
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
  constructor(code5, size, digest2, bytes) {
    this.code = code5;
    this.size = size;
    this.digest = digest2;
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
  constructor(version, code5, multihash, bytes) {
    this.code = code5;
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
        const { code: code5, multihash } = this;
        if (code5 !== DAG_PB_CODE) {
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
        const { code: code5, digest: digest2 } = this.multihash;
        const multihash = create(code5, digest2);
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
      const { version, code: code5, multihash, bytes } = value;
      return new _CID(version, code5, multihash, bytes ?? encodeCID(version, code5, multihash.bytes));
    } else if (value[cidSymbol] === true) {
      const { version, multihash, code: code5 } = value;
      const digest2 = decode5(multihash);
      return _CID.create(version, code5, digest2);
    } else {
      return null;
    }
  }
  /**
   * @param version - Version of the CID
   * @param code - Code of the codec content is encoded in, see https://github.com/multiformats/multicodec/blob/master/table.csv
   * @param digest - (Multi)hash of the of the content.
   */
  static create(version, code5, digest2) {
    if (typeof code5 !== "number") {
      throw new Error("String codecs are no longer supported");
    }
    if (!(digest2.bytes instanceof Uint8Array)) {
      throw new Error("Invalid digest");
    }
    switch (version) {
      case 0: {
        if (code5 !== DAG_PB_CODE) {
          throw new Error(`Version 0 CID must use dag-pb (code: ${DAG_PB_CODE}) block encoding`);
        } else {
          return new _CID(version, code5, digest2, digest2.bytes);
        }
      }
      case 1: {
        const bytes = encodeCID(version, code5, digest2.bytes);
        return new _CID(version, code5, digest2, bytes);
      }
      default: {
        throw new Error("Invalid version");
      }
    }
  }
  /**
   * Simplified version of `create` for CIDv0.
   */
  static createV0(digest2) {
    return _CID.create(0, DAG_PB_CODE, digest2);
  }
  /**
   * Simplified version of `create` for CIDv1.
   *
   * @param code - Content encoding format code.
   * @param digest - Multihash of the content.
   */
  static createV1(code5, digest2) {
    return _CID.create(1, code5, digest2);
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
    const digest2 = new Digest(specs.multihashCode, specs.digestSize, digestBytes, multihashBytes);
    const cid = specs.version === 0 ? _CID.createV0(digest2) : _CID.createV1(specs.codec, digest2);
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
      const [i, length4] = decode4(initialBytes.subarray(offset));
      offset += length4;
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
function encodeCID(version, code5, multihash) {
  const codeOffset = encodingLength(version);
  const hashOffset = codeOffset + encodingLength(code5);
  const bytes = new Uint8Array(hashOffset + multihash.byteLength);
  encodeTo(version, bytes, 0);
  encodeTo(code5, bytes, codeOffset);
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
var code = 113;
var encode4 = (node) => encode(node, _encodeOptions);
var decode6 = (data) => decode(data, _decodeOptions);

// node_modules/multiformats/src/bases/base32.js
var base32_exports = {};
__export(base32_exports, {
  base32: () => base322,
  base32hex: () => base32hex2,
  base32hexpad: () => base32hexpad2,
  base32hexpadupper: () => base32hexpadupper2,
  base32hexupper: () => base32hexupper2,
  base32pad: () => base32pad2,
  base32padupper: () => base32padupper2,
  base32upper: () => base32upper2,
  base32z: () => base32z2
});

// node_modules/multiformats/vendor/base-x.js
function base2(ALPHABET, name4) {
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
  function encode12(source) {
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
    var length4 = 0;
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
      for (var it1 = size - 1; (carry !== 0 || i2 < length4) && it1 !== -1; it1--, i2++) {
        carry += 256 * b58[it1] >>> 0;
        b58[it1] = carry % BASE >>> 0;
        carry = carry / BASE >>> 0;
      }
      if (carry !== 0) {
        throw new Error("Non-zero carry");
      }
      length4 = i2;
      pbegin++;
    }
    var it2 = size - length4;
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
    var length4 = 0;
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
      for (var it3 = size - 1; (carry !== 0 || i2 < length4) && it3 !== -1; it3--, i2++) {
        carry += BASE * b256[it3] >>> 0;
        b256[it3] = carry % 256 >>> 0;
        carry = carry / 256 >>> 0;
      }
      if (carry !== 0) {
        throw new Error("Non-zero carry");
      }
      length4 = i2;
      psz++;
    }
    if (source[psz] === " ") {
      return;
    }
    var it4 = size - length4;
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
  function decode15(string2) {
    var buffer2 = decodeUnsafe(string2);
    if (buffer2) {
      return buffer2;
    }
    throw new Error(`Non-${name4} character`);
  }
  return {
    encode: encode12,
    decodeUnsafe,
    decode: decode15
  };
}
var src2 = base2;
var _brrp__multiformats_scope_baseX2 = src2;
var base_x_default2 = _brrp__multiformats_scope_baseX2;

// node_modules/multiformats/src/bytes.js
var bytes_exports2 = {};
__export(bytes_exports2, {
  coerce: () => coerce2,
  empty: () => empty2,
  equals: () => equals3,
  fromHex: () => fromHex,
  fromString: () => fromString2,
  isBinary: () => isBinary,
  toHex: () => toHex,
  toString: () => toString2
});
var empty2 = new Uint8Array(0);
var toHex = (d) => d.reduce((hex, byte) => hex + byte.toString(16).padStart(2, "0"), "");
var fromHex = (hex) => {
  const hexes = hex.match(/../g);
  return hexes ? new Uint8Array(hexes.map((b) => parseInt(b, 16))) : empty2;
};
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
var isBinary = (o) => o instanceof ArrayBuffer || ArrayBuffer.isView(o);
var fromString2 = (str) => new TextEncoder().encode(str);
var toString2 = (b) => new TextDecoder().decode(b);

// node_modules/multiformats/src/bases/base.js
var Encoder2 = class {
  /**
   * @param {Base} name
   * @param {Prefix} prefix
   * @param {(bytes:Uint8Array) => string} baseEncode
   */
  constructor(name4, prefix, baseEncode) {
    this.name = name4;
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
  constructor(name4, prefix, baseDecode) {
    this.name = name4;
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
  constructor(name4, prefix, baseEncode, baseDecode) {
    this.name = name4;
    this.prefix = prefix;
    this.baseEncode = baseEncode;
    this.baseDecode = baseDecode;
    this.encoder = new Encoder2(name4, prefix, baseEncode);
    this.decoder = new Decoder2(name4, prefix, baseDecode);
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
var from2 = ({ name: name4, prefix, encode: encode12, decode: decode15 }) => new Codec2(name4, prefix, encode12, decode15);
var baseX2 = ({ prefix, name: name4, alphabet: alphabet2 }) => {
  const { encode: encode12, decode: decode15 } = base_x_default2(alphabet2, name4);
  return from2({
    prefix,
    name: name4,
    encode: encode12,
    /**
     * @param {string} text
     */
    decode: (text) => coerce2(decode15(text))
  });
};
var decode7 = (string2, alphabet2, bitsPerChar, name4) => {
  const codes = {};
  for (let i = 0; i < alphabet2.length; ++i) {
    codes[alphabet2[i]] = i;
  }
  let end = string2.length;
  while (string2[end - 1] === "=") {
    --end;
  }
  const out = new Uint8Array(end * bitsPerChar / 8 | 0);
  let bits = 0;
  let buffer2 = 0;
  let written = 0;
  for (let i = 0; i < end; ++i) {
    const value = codes[string2[i]];
    if (value === void 0) {
      throw new SyntaxError(`Non-${name4} character`);
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
var encode5 = (data, alphabet2, bitsPerChar) => {
  const pad = alphabet2[alphabet2.length - 1] === "=";
  const mask = (1 << bitsPerChar) - 1;
  let out = "";
  let bits = 0;
  let buffer2 = 0;
  for (let i = 0; i < data.length; ++i) {
    buffer2 = buffer2 << 8 | data[i];
    bits += 8;
    while (bits > bitsPerChar) {
      bits -= bitsPerChar;
      out += alphabet2[mask & buffer2 >> bits];
    }
  }
  if (bits) {
    out += alphabet2[mask & buffer2 << bitsPerChar - bits];
  }
  if (pad) {
    while (out.length * bitsPerChar & 7) {
      out += "=";
    }
  }
  return out;
};
var rfc46482 = ({ name: name4, prefix, bitsPerChar, alphabet: alphabet2 }) => {
  return from2({
    prefix,
    name: name4,
    encode(input) {
      return encode5(input, alphabet2, bitsPerChar);
    },
    decode(input) {
      return decode7(input, alphabet2, bitsPerChar, name4);
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
var base58_exports = {};
__export(base58_exports, {
  base58btc: () => base58btc2,
  base58flickr: () => base58flickr2
});
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
  const code5 = varint_default2.decode(data, offset);
  return [code5, varint_default2.decode.bytes];
};
var encodeTo2 = (int, target, offset = 0) => {
  varint_default2.encode(int, target, offset);
  return target;
};
var encodingLength2 = (int) => {
  return varint_default2.encodingLength(int);
};

// node_modules/multiformats/src/hashes/digest.js
var create2 = (code5, digest2) => {
  const size = digest2.byteLength;
  const sizeOffset = encodingLength2(code5);
  const digestOffset = sizeOffset + encodingLength2(size);
  const bytes = new Uint8Array(digestOffset + size);
  encodeTo2(code5, bytes, 0);
  encodeTo2(size, bytes, sizeOffset);
  bytes.set(digest2, digestOffset);
  return new Digest2(code5, size, digest2, bytes);
};
var decode10 = (multihash) => {
  const bytes = coerce2(multihash);
  const [code5, sizeOffset] = decode9(bytes);
  const [size, digestOffset] = decode9(bytes.subarray(sizeOffset));
  const digest2 = bytes.subarray(sizeOffset + digestOffset);
  if (digest2.byteLength !== size) {
    throw new Error("Incorrect length");
  }
  return new Digest2(code5, size, digest2, bytes);
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
  constructor(code5, size, digest2, bytes) {
    this.code = code5;
    this.size = size;
    this.digest = digest2;
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
  constructor(version, code5, multihash, bytes) {
    this.code = code5;
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
        const { code: code5, multihash } = this;
        if (code5 !== DAG_PB_CODE2) {
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
        const { code: code5, digest: digest2 } = this.multihash;
        const multihash = create2(code5, digest2);
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
      const { version, code: code5, multihash, bytes } = value;
      return new _CID(
        version,
        code5,
        /** @type {API.MultihashDigest<Alg>} */
        multihash,
        bytes || encodeCID2(version, code5, multihash.bytes)
      );
    } else if (value[cidSymbol2] === true) {
      const { version, multihash, code: code5 } = value;
      const digest2 = (
        /** @type {API.MultihashDigest<Alg>} */
        decode10(multihash)
      );
      return _CID.create(version, code5, digest2);
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
  static create(version, code5, digest2) {
    if (typeof code5 !== "number") {
      throw new Error("String codecs are no longer supported");
    }
    if (!(digest2.bytes instanceof Uint8Array)) {
      throw new Error("Invalid digest");
    }
    switch (version) {
      case 0: {
        if (code5 !== DAG_PB_CODE2) {
          throw new Error(
            `Version 0 CID must use dag-pb (code: ${DAG_PB_CODE2}) block encoding`
          );
        } else {
          return new _CID(version, code5, digest2, digest2.bytes);
        }
      }
      case 1: {
        const bytes = encodeCID2(version, code5, digest2.bytes);
        return new _CID(version, code5, digest2, bytes);
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
  static createV0(digest2) {
    return _CID.create(0, DAG_PB_CODE2, digest2);
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
  static createV1(code5, digest2) {
    return _CID.create(1, code5, digest2);
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
    const digest2 = new Digest2(
      specs.multihashCode,
      specs.digestSize,
      digestBytes,
      multihashBytes
    );
    const cid = specs.version === 0 ? _CID.createV0(
      /** @type {API.MultihashDigest<API.SHA_256>} */
      digest2
    ) : _CID.createV1(specs.codec, digest2);
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
      const [i, length4] = decode9(initialBytes.subarray(offset));
      offset += length4;
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
var encodeCID2 = (version, code5, multihash) => {
  const codeOffset = encodingLength2(version);
  const hashOffset = codeOffset + encodingLength2(code5);
  const bytes = new Uint8Array(hashOffset + multihash.byteLength);
  encodeTo2(version, bytes, 0);
  encodeTo2(code5, bytes, codeOffset);
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
  const length4 = decodeVarint(await reader.upTo(8), reader);
  if (length4 === 0) {
    throw new Error("Invalid CAR header (zero length)");
  }
  const header = await reader.exactly(length4, true);
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
    async upTo(length4) {
      const out = bytes.subarray(pos, pos + Math.min(length4, bytes.length - pos));
      return out;
    },
    async exactly(length4, seek = false) {
      if (length4 > bytes.length - pos) {
        throw new Error("Unexpected end of data");
      }
      const out = bytes.subarray(pos, pos + length4);
      if (seek) {
        pos += length4;
      }
      return out;
    },
    seek(length4) {
      pos += length4;
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
  const read4 = async (length4) => {
    have = currentChunk.length - offset;
    const bufa = [currentChunk.subarray(offset)];
    while (have < length4) {
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
    async upTo(length4) {
      if (currentChunk.length - offset < length4) {
        await read4(length4);
      }
      return currentChunk.subarray(offset, offset + Math.min(currentChunk.length - offset, length4));
    },
    async exactly(length4, seek = false) {
      if (currentChunk.length - offset < length4) {
        await read4(length4);
      }
      if (currentChunk.length - offset < length4) {
        throw new Error("Unexpected end of data");
      }
      const out = currentChunk.subarray(offset, offset + length4);
      if (seek) {
        pos += length4;
        offset += length4;
      }
      return out;
    },
    seek(length4) {
      pos += length4;
      offset += length4;
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
      drainer = new Promise((resolve6) => {
        drainerResolver = () => {
          drainer = null;
          drainerResolver = noop;
          resolve6();
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
        outWait = new Promise((resolve6) => {
          outWaitResolver = () => {
            outWait = null;
            outWaitResolver = noop;
            return resolve6(iterator.next());
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
      const read4 = await readChunk();
      offset += read4;
      return read4 < chunkSize ? bytes.subarray(0, read4) : bytes;
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
  const [iterator, symbol2] = iterable[Symbol.asyncIterator] != null ? [iterable[Symbol.asyncIterator](), Symbol.asyncIterator] : [iterable[Symbol.iterator](), Symbol.iterator];
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
    [symbol2]() {
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
  deferred.promise = new Promise((resolve6, reject) => {
    deferred.resolve = resolve6;
    deferred.reject = reject;
  });
  return deferred;
}

// node_modules/eventemitter3/index.mjs
var import_index = __toESM(require_eventemitter3(), 1);

// node_modules/p-timeout/index.js
var TimeoutError = class extends Error {
  constructor(message2) {
    super(message2);
    this.name = "TimeoutError";
  }
};
var AbortError = class extends Error {
  constructor(message2) {
    super();
    this.name = "AbortError";
    this.message = message2;
  }
};
var getDOMException = (errorMessage) => globalThis.DOMException === void 0 ? new AbortError(errorMessage) : new DOMException(errorMessage);
var getAbortedReason = (signal) => {
  const reason = signal.reason === void 0 ? getDOMException("This operation was aborted.") : signal.reason;
  return reason instanceof Error ? reason : getDOMException(reason);
};
function pTimeout(promise, milliseconds, fallback, options) {
  let timer;
  const cancelablePromise = new Promise((resolve6, reject) => {
    if (typeof milliseconds !== "number" || Math.sign(milliseconds) !== 1) {
      throw new TypeError(`Expected \`milliseconds\` to be a positive number, got \`${milliseconds}\``);
    }
    if (milliseconds === Number.POSITIVE_INFINITY) {
      resolve6(promise);
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
          resolve6(fallback());
        } catch (error) {
          reject(error);
        }
        return;
      }
      const message2 = typeof fallback === "string" ? fallback : `Promise timed out after ${milliseconds} milliseconds`;
      const timeoutError = fallback instanceof Error ? fallback : new TimeoutError(message2);
      if (typeof promise.cancel === "function") {
        promise.cancel();
      }
      reject(timeoutError);
    }, milliseconds);
    (async () => {
      try {
        resolve6(await promise);
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
  let first2 = 0;
  let count = array.length;
  while (count > 0) {
    const step = Math.trunc(count / 2);
    let it = first2 + step;
    if (comparator(array[it], value) <= 0) {
      first2 = ++it;
      count -= step + 1;
    } else {
      count = step;
    }
  }
  return first2;
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
    return new Promise((resolve6, reject) => {
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
          resolve6(result);
          this.emit("completed", result);
        } catch (error) {
          if (error instanceof TimeoutError && !options.throwOnTimeout) {
            resolve6();
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
}, _PQueue_onEvent = async function _PQueue_onEvent2(event, filter3) {
  return new Promise((resolve6) => {
    const listener = () => {
      if (filter3 && !filter3()) {
        return;
      }
      this.off(event, listener);
      resolve6();
    };
    this.on(event, listener);
  });
};
var dist_default = PQueue;

// node_modules/@ipld/dag-pb/src/index.js
var src_exports2 = {};
__export(src_exports2, {
  code: () => code2,
  createLink: () => createLink,
  createNode: () => createNode,
  decode: () => decode11,
  encode: () => encode7,
  name: () => name,
  prepare: () => prepare,
  validate: () => validate
});

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
function encodeLink(link, bytes) {
  let i = bytes.length;
  if (typeof link.Tsize === "number") {
    if (link.Tsize < 0) {
      throw new Error("Tsize cannot be negative");
    }
    if (!Number.isSafeInteger(link.Tsize)) {
      throw new Error("Tsize too large for encoding");
    }
    i = encodeVarint(bytes, i, link.Tsize) - 1;
    bytes[i] = 24;
  }
  if (typeof link.Name === "string") {
    const nameBytes = textEncoder2.encode(link.Name);
    i -= nameBytes.length;
    bytes.set(nameBytes, i);
    i = encodeVarint(bytes, i, nameBytes.length) - 1;
    bytes[i] = 18;
  }
  if (link.Hash) {
    i -= link.Hash.length;
    bytes.set(link.Hash, i);
    i = encodeVarint(bytes, i, link.Hash.length) - 1;
    bytes[i] = 10;
  }
  return bytes.length - i;
}
function encodeNode(node) {
  const size = sizeNode(node);
  const bytes = new Uint8Array(size);
  let i = size;
  if (node.Data) {
    i -= node.Data.length;
    bytes.set(node.Data, i);
    i = encodeVarint(bytes, i, node.Data.length) - 1;
    bytes[i] = 10;
  }
  if (node.Links) {
    for (let index = node.Links.length - 1; index >= 0; index--) {
      const size2 = encodeLink(node.Links[index], bytes.subarray(0, i));
      i -= size2;
      i = encodeVarint(bytes, i, size2) - 1;
      bytes[i] = 18;
    }
  }
  return bytes;
}
function sizeLink(link) {
  let n = 0;
  if (link.Hash) {
    const l = link.Hash.length;
    n += 1 + l + sov(l);
  }
  if (typeof link.Name === "string") {
    const l = textEncoder2.encode(link.Name).length;
    n += 1 + l + sov(l);
  }
  if (typeof link.Tsize === "number") {
    n += 1 + sov(link.Tsize);
  }
  return n;
}
function sizeNode(node) {
  let n = 0;
  if (node.Data) {
    const l = node.Data.length;
    n += 1 + l + sov(l);
  }
  if (node.Links) {
    for (const link of node.Links) {
      const l = sizeLink(link);
      n += 1 + l + sov(l);
    }
  }
  return n;
}
function encodeVarint(bytes, offset, v) {
  offset -= sov(v);
  const base3 = offset;
  while (v >= maxUInt32) {
    bytes[offset++] = v & 127 | 128;
    v /= 128;
  }
  while (v >= 128) {
    bytes[offset++] = v & 127 | 128;
    v >>>= 7;
  }
  bytes[offset] = v;
  return base3;
}
function sov(x) {
  if (x % 2 === 0) {
    x++;
  }
  return Math.floor((len64(x) + 6) / 7);
}
function len64(x) {
  let n = 0;
  if (x >= maxInt32) {
    x = Math.floor(x / maxInt32);
    n = 32;
  }
  if (x >= 1 << 16) {
    x >>>= 16;
    n += 16;
  }
  if (x >= 1 << 8) {
    x >>>= 8;
    n += 8;
  }
  return n + len8tab[x];
}
var len8tab = [
  0,
  1,
  2,
  2,
  3,
  3,
  3,
  3,
  4,
  4,
  4,
  4,
  4,
  4,
  4,
  4,
  5,
  5,
  5,
  5,
  5,
  5,
  5,
  5,
  5,
  5,
  5,
  5,
  5,
  5,
  5,
  5,
  6,
  6,
  6,
  6,
  6,
  6,
  6,
  6,
  6,
  6,
  6,
  6,
  6,
  6,
  6,
  6,
  6,
  6,
  6,
  6,
  6,
  6,
  6,
  6,
  6,
  6,
  6,
  6,
  6,
  6,
  6,
  6,
  7,
  7,
  7,
  7,
  7,
  7,
  7,
  7,
  7,
  7,
  7,
  7,
  7,
  7,
  7,
  7,
  7,
  7,
  7,
  7,
  7,
  7,
  7,
  7,
  7,
  7,
  7,
  7,
  7,
  7,
  7,
  7,
  7,
  7,
  7,
  7,
  7,
  7,
  7,
  7,
  7,
  7,
  7,
  7,
  7,
  7,
  7,
  7,
  7,
  7,
  7,
  7,
  7,
  7,
  7,
  7,
  7,
  7,
  7,
  7,
  7,
  7,
  7,
  7,
  8,
  8,
  8,
  8,
  8,
  8,
  8,
  8,
  8,
  8,
  8,
  8,
  8,
  8,
  8,
  8,
  8,
  8,
  8,
  8,
  8,
  8,
  8,
  8,
  8,
  8,
  8,
  8,
  8,
  8,
  8,
  8,
  8,
  8,
  8,
  8,
  8,
  8,
  8,
  8,
  8,
  8,
  8,
  8,
  8,
  8,
  8,
  8,
  8,
  8,
  8,
  8,
  8,
  8,
  8,
  8,
  8,
  8,
  8,
  8,
  8,
  8,
  8,
  8,
  8,
  8,
  8,
  8,
  8,
  8,
  8,
  8,
  8,
  8,
  8,
  8,
  8,
  8,
  8,
  8,
  8,
  8,
  8,
  8,
  8,
  8,
  8,
  8,
  8,
  8,
  8,
  8,
  8,
  8,
  8,
  8,
  8,
  8,
  8,
  8,
  8,
  8,
  8,
  8,
  8,
  8,
  8,
  8,
  8,
  8,
  8,
  8,
  8,
  8,
  8,
  8,
  8,
  8,
  8,
  8,
  8,
  8,
  8,
  8,
  8,
  8,
  8,
  8
];

// node_modules/@ipld/dag-pb/src/util.js
var pbNodeProperties = ["Data", "Links"];
var pbLinkProperties = ["Hash", "Name", "Tsize"];
var textEncoder3 = new TextEncoder();
function linkComparator(a, b) {
  if (a === b) {
    return 0;
  }
  const abuf = a.Name ? textEncoder3.encode(a.Name) : [];
  const bbuf = b.Name ? textEncoder3.encode(b.Name) : [];
  let x = abuf.length;
  let y = bbuf.length;
  for (let i = 0, len = Math.min(x, y); i < len; ++i) {
    if (abuf[i] !== bbuf[i]) {
      x = abuf[i];
      y = bbuf[i];
      break;
    }
  }
  return x < y ? -1 : y < x ? 1 : 0;
}
function hasOnlyProperties(node, properties) {
  return !Object.keys(node).some((p) => !properties.includes(p));
}
function asLink(link) {
  if (typeof link.asCID === "object") {
    const Hash = CID2.asCID(link);
    if (!Hash) {
      throw new TypeError("Invalid DAG-PB form");
    }
    return { Hash };
  }
  if (typeof link !== "object" || Array.isArray(link)) {
    throw new TypeError("Invalid DAG-PB form");
  }
  const pbl = {};
  if (link.Hash) {
    let cid = CID2.asCID(link.Hash);
    try {
      if (!cid) {
        if (typeof link.Hash === "string") {
          cid = CID2.parse(link.Hash);
        } else if (link.Hash instanceof Uint8Array) {
          cid = CID2.decode(link.Hash);
        }
      }
    } catch (e) {
      throw new TypeError(`Invalid DAG-PB form: ${e.message}`);
    }
    if (cid) {
      pbl.Hash = cid;
    }
  }
  if (!pbl.Hash) {
    throw new TypeError("Invalid DAG-PB form");
  }
  if (typeof link.Name === "string") {
    pbl.Name = link.Name;
  }
  if (typeof link.Tsize === "number") {
    pbl.Tsize = link.Tsize;
  }
  return pbl;
}
function prepare(node) {
  if (node instanceof Uint8Array || typeof node === "string") {
    node = { Data: node };
  }
  if (typeof node !== "object" || Array.isArray(node)) {
    throw new TypeError("Invalid DAG-PB form");
  }
  const pbn = {};
  if (node.Data !== void 0) {
    if (typeof node.Data === "string") {
      pbn.Data = textEncoder3.encode(node.Data);
    } else if (node.Data instanceof Uint8Array) {
      pbn.Data = node.Data;
    } else {
      throw new TypeError("Invalid DAG-PB form");
    }
  }
  if (node.Links !== void 0) {
    if (Array.isArray(node.Links)) {
      pbn.Links = node.Links.map(asLink);
      pbn.Links.sort(linkComparator);
    } else {
      throw new TypeError("Invalid DAG-PB form");
    }
  } else {
    pbn.Links = [];
  }
  return pbn;
}
function validate(node) {
  if (!node || typeof node !== "object" || Array.isArray(node) || node instanceof Uint8Array || node["/"] && node["/"] === node.bytes) {
    throw new TypeError("Invalid DAG-PB form");
  }
  if (!hasOnlyProperties(node, pbNodeProperties)) {
    throw new TypeError("Invalid DAG-PB form (extraneous properties)");
  }
  if (node.Data !== void 0 && !(node.Data instanceof Uint8Array)) {
    throw new TypeError("Invalid DAG-PB form (Data must be bytes)");
  }
  if (!Array.isArray(node.Links)) {
    throw new TypeError("Invalid DAG-PB form (Links must be a list)");
  }
  for (let i = 0; i < node.Links.length; i++) {
    const link = node.Links[i];
    if (!link || typeof link !== "object" || Array.isArray(link) || link instanceof Uint8Array || link["/"] && link["/"] === link.bytes) {
      throw new TypeError("Invalid DAG-PB form (bad link)");
    }
    if (!hasOnlyProperties(link, pbLinkProperties)) {
      throw new TypeError("Invalid DAG-PB form (extraneous properties on link)");
    }
    if (link.Hash === void 0) {
      throw new TypeError("Invalid DAG-PB form (link must have a Hash)");
    }
    if (link.Hash == null || !link.Hash["/"] || link.Hash["/"] !== link.Hash.bytes) {
      throw new TypeError("Invalid DAG-PB form (link Hash must be a CID)");
    }
    if (link.Name !== void 0 && typeof link.Name !== "string") {
      throw new TypeError("Invalid DAG-PB form (link Name must be a string)");
    }
    if (link.Tsize !== void 0) {
      if (typeof link.Tsize !== "number" || link.Tsize % 1 !== 0) {
        throw new TypeError("Invalid DAG-PB form (link Tsize must be an integer)");
      }
      if (link.Tsize < 0) {
        throw new TypeError("Invalid DAG-PB form (link Tsize cannot be negative)");
      }
    }
    if (i > 0 && linkComparator(link, node.Links[i - 1]) === -1) {
      throw new TypeError("Invalid DAG-PB form (links must be sorted by Name bytes)");
    }
  }
}
function createNode(data, links = []) {
  return prepare({ Data: data, Links: links });
}
function createLink(name4, size, cid) {
  return asLink({ Hash: cid, Name: name4, Tsize: size });
}

// node_modules/@ipld/dag-pb/src/index.js
var name = "dag-pb";
var code2 = 112;
function encode7(node) {
  validate(node);
  const pbn = {};
  if (node.Links) {
    pbn.Links = node.Links.map((l) => {
      const link = {};
      if (l.Hash) {
        link.Hash = l.Hash.bytes;
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
  if (node.Data) {
    pbn.Data = node.Data;
  }
  return encodeNode(pbn);
}
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
var base64_exports = {};
__export(base64_exports, {
  base64: () => base64,
  base64pad: () => base64pad,
  base64url: () => base64url,
  base64urlpad: () => base64urlpad
});
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
var raw_exports = {};
__export(raw_exports, {
  code: () => code3,
  decode: () => decode13,
  encode: () => encode9,
  name: () => name2
});
var name2 = "raw";
var code3 = 85;
var encode9 = (node) => coerce2(node);
var decode13 = (data) => coerce2(data);

// node_modules/@helia/car/dist/src/utils/dag-walkers.js
var dagPbWalker = {
  codec: code2,
  async *walk(block) {
    const node = decode11(block);
    yield* node.Links.map((l) => l.Hash);
  }
};
var rawWalker = {
  codec: code3,
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
    tags[CID_TAG2] = (string2) => {
      const cid = CID2.parse(string2);
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

// node_modules/ipfs-unixfs-importer/dist/src/index.js
var import_err_code4 = __toESM(require_err_code(), 1);

// node_modules/it-first/dist/src/index.js
function isAsyncIterable3(thing) {
  return thing[Symbol.asyncIterator] != null;
}
function first(source) {
  if (isAsyncIterable3(source)) {
    return (async () => {
      for await (const entry of source) {
        return entry;
      }
      return void 0;
    })();
  }
  for (const entry of source) {
    return entry;
  }
  return void 0;
}
var src_default4 = first;

// node_modules/it-batch/dist/src/index.js
function isAsyncIterable4(thing) {
  return thing[Symbol.asyncIterator] != null;
}
function batch(source, size = 1) {
  size = Number(size);
  if (isAsyncIterable4(source)) {
    return async function* () {
      let things = [];
      if (size < 1) {
        size = 1;
      }
      if (size !== Math.round(size)) {
        throw new Error("Batch size must be an integer");
      }
      for await (const thing of source) {
        things.push(thing);
        while (things.length >= size) {
          yield things.slice(0, size);
          things = things.slice(size);
        }
      }
      while (things.length > 0) {
        yield things.slice(0, size);
        things = things.slice(size);
      }
    }();
  }
  return function* () {
    let things = [];
    if (size < 1) {
      size = 1;
    }
    if (size !== Math.round(size)) {
      throw new Error("Batch size must be an integer");
    }
    for (const thing of source) {
      things.push(thing);
      while (things.length >= size) {
        yield things.slice(0, size);
        things = things.slice(size);
      }
    }
    while (things.length > 0) {
      yield things.slice(0, size);
      things = things.slice(size);
    }
  }();
}
var src_default5 = batch;

// node_modules/it-parallel-batch/dist/src/index.js
async function* parallelBatch(source, size = 1) {
  for await (const tasks of src_default5(source, size)) {
    const things = tasks.map(async (p) => {
      return p().then((value) => ({ ok: true, value }), (err) => ({ ok: false, err }));
    });
    for (let i = 0; i < things.length; i++) {
      const result = await things[i];
      if (result.ok) {
        yield result.value;
      } else {
        throw result.err;
      }
    }
  }
}

// node_modules/uint8arrays/dist/src/util/as-uint8array.js
function asUint8Array(buf2) {
  if (globalThis.Buffer != null) {
    return new Uint8Array(buf2.buffer, buf2.byteOffset, buf2.byteLength);
  }
  return buf2;
}

// node_modules/uint8arrays/dist/src/alloc.js
function alloc2(size = 0) {
  var _a;
  if (((_a = globalThis.Buffer) == null ? void 0 : _a.alloc) != null) {
    return asUint8Array(globalThis.Buffer.alloc(size));
  }
  return new Uint8Array(size);
}
function allocUnsafe(size = 0) {
  var _a;
  if (((_a = globalThis.Buffer) == null ? void 0 : _a.allocUnsafe) != null) {
    return asUint8Array(globalThis.Buffer.allocUnsafe(size));
  }
  return new Uint8Array(size);
}

// node_modules/uint8arrays/dist/src/concat.js
function concat2(arrays, length4) {
  if (length4 == null) {
    length4 = arrays.reduce((acc, curr) => acc + curr.length, 0);
  }
  const output = allocUnsafe(length4);
  let offset = 0;
  for (const arr of arrays) {
    output.set(arr, offset);
    offset += arr.length;
  }
  return asUint8Array(output);
}

// node_modules/uint8arrays/dist/src/equals.js
function equals5(a, b) {
  if (a === b) {
    return true;
  }
  if (a.byteLength !== b.byteLength) {
    return false;
  }
  for (let i = 0; i < a.byteLength; i++) {
    if (a[i] !== b[i]) {
      return false;
    }
  }
  return true;
}

// node_modules/uint8arraylist/dist/src/index.js
var symbol = Symbol.for("@achingbrain/uint8arraylist");
function findBufAndOffset(bufs, index) {
  if (index == null || index < 0) {
    throw new RangeError("index is out of bounds");
  }
  let offset = 0;
  for (const buf2 of bufs) {
    const bufEnd = offset + buf2.byteLength;
    if (index < bufEnd) {
      return {
        buf: buf2,
        index: index - offset
      };
    }
    offset = bufEnd;
  }
  throw new RangeError("index is out of bounds");
}
function isUint8ArrayList(value) {
  return Boolean(value == null ? void 0 : value[symbol]);
}
var Uint8ArrayList = class _Uint8ArrayList {
  bufs;
  length;
  [symbol] = true;
  constructor(...data) {
    this.bufs = [];
    this.length = 0;
    if (data.length > 0) {
      this.appendAll(data);
    }
  }
  *[Symbol.iterator]() {
    yield* this.bufs;
  }
  get byteLength() {
    return this.length;
  }
  /**
   * Add one or more `bufs` to the end of this Uint8ArrayList
   */
  append(...bufs) {
    this.appendAll(bufs);
  }
  /**
   * Add all `bufs` to the end of this Uint8ArrayList
   */
  appendAll(bufs) {
    let length4 = 0;
    for (const buf2 of bufs) {
      if (buf2 instanceof Uint8Array) {
        length4 += buf2.byteLength;
        this.bufs.push(buf2);
      } else if (isUint8ArrayList(buf2)) {
        length4 += buf2.byteLength;
        this.bufs.push(...buf2.bufs);
      } else {
        throw new Error("Could not append value, must be an Uint8Array or a Uint8ArrayList");
      }
    }
    this.length += length4;
  }
  /**
   * Add one or more `bufs` to the start of this Uint8ArrayList
   */
  prepend(...bufs) {
    this.prependAll(bufs);
  }
  /**
   * Add all `bufs` to the start of this Uint8ArrayList
   */
  prependAll(bufs) {
    let length4 = 0;
    for (const buf2 of bufs.reverse()) {
      if (buf2 instanceof Uint8Array) {
        length4 += buf2.byteLength;
        this.bufs.unshift(buf2);
      } else if (isUint8ArrayList(buf2)) {
        length4 += buf2.byteLength;
        this.bufs.unshift(...buf2.bufs);
      } else {
        throw new Error("Could not prepend value, must be an Uint8Array or a Uint8ArrayList");
      }
    }
    this.length += length4;
  }
  /**
   * Read the value at `index`
   */
  get(index) {
    const res = findBufAndOffset(this.bufs, index);
    return res.buf[res.index];
  }
  /**
   * Set the value at `index` to `value`
   */
  set(index, value) {
    const res = findBufAndOffset(this.bufs, index);
    res.buf[res.index] = value;
  }
  /**
   * Copy bytes from `buf` to the index specified by `offset`
   */
  write(buf2, offset = 0) {
    if (buf2 instanceof Uint8Array) {
      for (let i = 0; i < buf2.length; i++) {
        this.set(offset + i, buf2[i]);
      }
    } else if (isUint8ArrayList(buf2)) {
      for (let i = 0; i < buf2.length; i++) {
        this.set(offset + i, buf2.get(i));
      }
    } else {
      throw new Error("Could not write value, must be an Uint8Array or a Uint8ArrayList");
    }
  }
  /**
   * Remove bytes from the front of the pool
   */
  consume(bytes) {
    bytes = Math.trunc(bytes);
    if (Number.isNaN(bytes) || bytes <= 0) {
      return;
    }
    if (bytes === this.byteLength) {
      this.bufs = [];
      this.length = 0;
      return;
    }
    while (this.bufs.length > 0) {
      if (bytes >= this.bufs[0].byteLength) {
        bytes -= this.bufs[0].byteLength;
        this.length -= this.bufs[0].byteLength;
        this.bufs.shift();
      } else {
        this.bufs[0] = this.bufs[0].subarray(bytes);
        this.length -= bytes;
        break;
      }
    }
  }
  /**
   * Extracts a section of an array and returns a new array.
   *
   * This is a copy operation as it is with Uint8Arrays and Arrays
   * - note this is different to the behaviour of Node Buffers.
   */
  slice(beginInclusive, endExclusive) {
    const { bufs, length: length4 } = this._subList(beginInclusive, endExclusive);
    return concat2(bufs, length4);
  }
  /**
   * Returns a alloc from the given start and end element index.
   *
   * In the best case where the data extracted comes from a single Uint8Array
   * internally this is a no-copy operation otherwise it is a copy operation.
   */
  subarray(beginInclusive, endExclusive) {
    const { bufs, length: length4 } = this._subList(beginInclusive, endExclusive);
    if (bufs.length === 1) {
      return bufs[0];
    }
    return concat2(bufs, length4);
  }
  /**
   * Returns a allocList from the given start and end element index.
   *
   * This is a no-copy operation.
   */
  sublist(beginInclusive, endExclusive) {
    const { bufs, length: length4 } = this._subList(beginInclusive, endExclusive);
    const list = new _Uint8ArrayList();
    list.length = length4;
    list.bufs = [...bufs];
    return list;
  }
  _subList(beginInclusive, endExclusive) {
    beginInclusive = beginInclusive ?? 0;
    endExclusive = endExclusive ?? this.length;
    if (beginInclusive < 0) {
      beginInclusive = this.length + beginInclusive;
    }
    if (endExclusive < 0) {
      endExclusive = this.length + endExclusive;
    }
    if (beginInclusive < 0 || endExclusive > this.length) {
      throw new RangeError("index is out of bounds");
    }
    if (beginInclusive === endExclusive) {
      return { bufs: [], length: 0 };
    }
    if (beginInclusive === 0 && endExclusive === this.length) {
      return { bufs: this.bufs, length: this.length };
    }
    const bufs = [];
    let offset = 0;
    for (let i = 0; i < this.bufs.length; i++) {
      const buf2 = this.bufs[i];
      const bufStart = offset;
      const bufEnd = bufStart + buf2.byteLength;
      offset = bufEnd;
      if (beginInclusive >= bufEnd) {
        continue;
      }
      const sliceStartInBuf = beginInclusive >= bufStart && beginInclusive < bufEnd;
      const sliceEndsInBuf = endExclusive > bufStart && endExclusive <= bufEnd;
      if (sliceStartInBuf && sliceEndsInBuf) {
        if (beginInclusive === bufStart && endExclusive === bufEnd) {
          bufs.push(buf2);
          break;
        }
        const start = beginInclusive - bufStart;
        bufs.push(buf2.subarray(start, start + (endExclusive - beginInclusive)));
        break;
      }
      if (sliceStartInBuf) {
        if (beginInclusive === 0) {
          bufs.push(buf2);
          continue;
        }
        bufs.push(buf2.subarray(beginInclusive - bufStart));
        continue;
      }
      if (sliceEndsInBuf) {
        if (endExclusive === bufEnd) {
          bufs.push(buf2);
          break;
        }
        bufs.push(buf2.subarray(0, endExclusive - bufStart));
        break;
      }
      bufs.push(buf2);
    }
    return { bufs, length: endExclusive - beginInclusive };
  }
  indexOf(search, offset = 0) {
    if (!isUint8ArrayList(search) && !(search instanceof Uint8Array)) {
      throw new TypeError('The "value" argument must be a Uint8ArrayList or Uint8Array');
    }
    const needle = search instanceof Uint8Array ? search : search.subarray();
    offset = Number(offset ?? 0);
    if (isNaN(offset)) {
      offset = 0;
    }
    if (offset < 0) {
      offset = this.length + offset;
    }
    if (offset < 0) {
      offset = 0;
    }
    if (search.length === 0) {
      return offset > this.length ? this.length : offset;
    }
    const M = needle.byteLength;
    if (M === 0) {
      throw new TypeError("search must be at least 1 byte long");
    }
    const radix = 256;
    const rightmostPositions = new Int32Array(radix);
    for (let c = 0; c < radix; c++) {
      rightmostPositions[c] = -1;
    }
    for (let j = 0; j < M; j++) {
      rightmostPositions[needle[j]] = j;
    }
    const right = rightmostPositions;
    const lastIndex = this.byteLength - needle.byteLength;
    const lastPatIndex = needle.byteLength - 1;
    let skip;
    for (let i = offset; i <= lastIndex; i += skip) {
      skip = 0;
      for (let j = lastPatIndex; j >= 0; j--) {
        const char = this.get(i + j);
        if (needle[j] !== char) {
          skip = Math.max(1, j - right[char]);
          break;
        }
      }
      if (skip === 0) {
        return i;
      }
    }
    return -1;
  }
  getInt8(byteOffset) {
    const buf2 = this.subarray(byteOffset, byteOffset + 1);
    const view = new DataView(buf2.buffer, buf2.byteOffset, buf2.byteLength);
    return view.getInt8(0);
  }
  setInt8(byteOffset, value) {
    const buf2 = allocUnsafe(1);
    const view = new DataView(buf2.buffer, buf2.byteOffset, buf2.byteLength);
    view.setInt8(0, value);
    this.write(buf2, byteOffset);
  }
  getInt16(byteOffset, littleEndian) {
    const buf2 = this.subarray(byteOffset, byteOffset + 2);
    const view = new DataView(buf2.buffer, buf2.byteOffset, buf2.byteLength);
    return view.getInt16(0, littleEndian);
  }
  setInt16(byteOffset, value, littleEndian) {
    const buf2 = alloc2(2);
    const view = new DataView(buf2.buffer, buf2.byteOffset, buf2.byteLength);
    view.setInt16(0, value, littleEndian);
    this.write(buf2, byteOffset);
  }
  getInt32(byteOffset, littleEndian) {
    const buf2 = this.subarray(byteOffset, byteOffset + 4);
    const view = new DataView(buf2.buffer, buf2.byteOffset, buf2.byteLength);
    return view.getInt32(0, littleEndian);
  }
  setInt32(byteOffset, value, littleEndian) {
    const buf2 = alloc2(4);
    const view = new DataView(buf2.buffer, buf2.byteOffset, buf2.byteLength);
    view.setInt32(0, value, littleEndian);
    this.write(buf2, byteOffset);
  }
  getBigInt64(byteOffset, littleEndian) {
    const buf2 = this.subarray(byteOffset, byteOffset + 8);
    const view = new DataView(buf2.buffer, buf2.byteOffset, buf2.byteLength);
    return view.getBigInt64(0, littleEndian);
  }
  setBigInt64(byteOffset, value, littleEndian) {
    const buf2 = alloc2(8);
    const view = new DataView(buf2.buffer, buf2.byteOffset, buf2.byteLength);
    view.setBigInt64(0, value, littleEndian);
    this.write(buf2, byteOffset);
  }
  getUint8(byteOffset) {
    const buf2 = this.subarray(byteOffset, byteOffset + 1);
    const view = new DataView(buf2.buffer, buf2.byteOffset, buf2.byteLength);
    return view.getUint8(0);
  }
  setUint8(byteOffset, value) {
    const buf2 = allocUnsafe(1);
    const view = new DataView(buf2.buffer, buf2.byteOffset, buf2.byteLength);
    view.setUint8(0, value);
    this.write(buf2, byteOffset);
  }
  getUint16(byteOffset, littleEndian) {
    const buf2 = this.subarray(byteOffset, byteOffset + 2);
    const view = new DataView(buf2.buffer, buf2.byteOffset, buf2.byteLength);
    return view.getUint16(0, littleEndian);
  }
  setUint16(byteOffset, value, littleEndian) {
    const buf2 = alloc2(2);
    const view = new DataView(buf2.buffer, buf2.byteOffset, buf2.byteLength);
    view.setUint16(0, value, littleEndian);
    this.write(buf2, byteOffset);
  }
  getUint32(byteOffset, littleEndian) {
    const buf2 = this.subarray(byteOffset, byteOffset + 4);
    const view = new DataView(buf2.buffer, buf2.byteOffset, buf2.byteLength);
    return view.getUint32(0, littleEndian);
  }
  setUint32(byteOffset, value, littleEndian) {
    const buf2 = alloc2(4);
    const view = new DataView(buf2.buffer, buf2.byteOffset, buf2.byteLength);
    view.setUint32(0, value, littleEndian);
    this.write(buf2, byteOffset);
  }
  getBigUint64(byteOffset, littleEndian) {
    const buf2 = this.subarray(byteOffset, byteOffset + 8);
    const view = new DataView(buf2.buffer, buf2.byteOffset, buf2.byteLength);
    return view.getBigUint64(0, littleEndian);
  }
  setBigUint64(byteOffset, value, littleEndian) {
    const buf2 = alloc2(8);
    const view = new DataView(buf2.buffer, buf2.byteOffset, buf2.byteLength);
    view.setBigUint64(0, value, littleEndian);
    this.write(buf2, byteOffset);
  }
  getFloat32(byteOffset, littleEndian) {
    const buf2 = this.subarray(byteOffset, byteOffset + 4);
    const view = new DataView(buf2.buffer, buf2.byteOffset, buf2.byteLength);
    return view.getFloat32(0, littleEndian);
  }
  setFloat32(byteOffset, value, littleEndian) {
    const buf2 = alloc2(4);
    const view = new DataView(buf2.buffer, buf2.byteOffset, buf2.byteLength);
    view.setFloat32(0, value, littleEndian);
    this.write(buf2, byteOffset);
  }
  getFloat64(byteOffset, littleEndian) {
    const buf2 = this.subarray(byteOffset, byteOffset + 8);
    const view = new DataView(buf2.buffer, buf2.byteOffset, buf2.byteLength);
    return view.getFloat64(0, littleEndian);
  }
  setFloat64(byteOffset, value, littleEndian) {
    const buf2 = alloc2(8);
    const view = new DataView(buf2.buffer, buf2.byteOffset, buf2.byteLength);
    view.setFloat64(0, value, littleEndian);
    this.write(buf2, byteOffset);
  }
  equals(other) {
    if (other == null) {
      return false;
    }
    if (!(other instanceof _Uint8ArrayList)) {
      return false;
    }
    if (other.bufs.length !== this.bufs.length) {
      return false;
    }
    for (let i = 0; i < this.bufs.length; i++) {
      if (!equals5(this.bufs[i], other.bufs[i])) {
        return false;
      }
    }
    return true;
  }
  /**
   * Create a Uint8ArrayList from a pre-existing list of Uint8Arrays.  Use this
   * method if you know the total size of all the Uint8Arrays ahead of time.
   */
  static fromUint8Arrays(bufs, length4) {
    const list = new _Uint8ArrayList();
    list.bufs = bufs;
    if (length4 == null) {
      length4 = bufs.reduce((acc, curr) => acc + curr.byteLength, 0);
    }
    list.length = length4;
    return list;
  }
};

// node_modules/ipfs-unixfs-importer/dist/src/chunker/fixed-size.js
var DEFAULT_CHUNK_SIZE = 262144;
var fixedSize = (options = {}) => {
  const chunkSize = options.chunkSize ?? DEFAULT_CHUNK_SIZE;
  return async function* fixedSizeChunker(source) {
    let list = new Uint8ArrayList();
    let currentLength = 0;
    let emitted = false;
    for await (const buffer2 of source) {
      list.append(buffer2);
      currentLength += buffer2.length;
      while (currentLength >= chunkSize) {
        yield list.slice(0, chunkSize);
        emitted = true;
        if (chunkSize === list.length) {
          list = new Uint8ArrayList();
          currentLength = 0;
        } else {
          const newBl = new Uint8ArrayList();
          newBl.append(list.sublist(chunkSize));
          list = newBl;
          currentLength -= chunkSize;
        }
      }
    }
    if (!emitted || currentLength > 0) {
      yield list.subarray(0, currentLength);
    }
  };
};

// node_modules/ipfs-unixfs/dist/src/index.js
var import_err_code = __toESM(require_err_code(), 1);

// node_modules/protons-runtime/dist/src/utils/float.js
var f32 = new Float32Array([-0]);
var f8b = new Uint8Array(f32.buffer);
function writeFloatLE(val, buf2, pos) {
  f32[0] = val;
  buf2[pos] = f8b[0];
  buf2[pos + 1] = f8b[1];
  buf2[pos + 2] = f8b[2];
  buf2[pos + 3] = f8b[3];
}
function readFloatLE(buf2, pos) {
  f8b[0] = buf2[pos];
  f8b[1] = buf2[pos + 1];
  f8b[2] = buf2[pos + 2];
  f8b[3] = buf2[pos + 3];
  return f32[0];
}
var f64 = new Float64Array([-0]);
var d8b = new Uint8Array(f64.buffer);
function writeDoubleLE(val, buf2, pos) {
  f64[0] = val;
  buf2[pos] = d8b[0];
  buf2[pos + 1] = d8b[1];
  buf2[pos + 2] = d8b[2];
  buf2[pos + 3] = d8b[3];
  buf2[pos + 4] = d8b[4];
  buf2[pos + 5] = d8b[5];
  buf2[pos + 6] = d8b[6];
  buf2[pos + 7] = d8b[7];
}
function readDoubleLE(buf2, pos) {
  d8b[0] = buf2[pos];
  d8b[1] = buf2[pos + 1];
  d8b[2] = buf2[pos + 2];
  d8b[3] = buf2[pos + 3];
  d8b[4] = buf2[pos + 4];
  d8b[5] = buf2[pos + 5];
  d8b[6] = buf2[pos + 6];
  d8b[7] = buf2[pos + 7];
  return f64[0];
}

// node_modules/protons-runtime/dist/src/utils/longbits.js
var MAX_SAFE_NUMBER_INTEGER = BigInt(Number.MAX_SAFE_INTEGER);
var MIN_SAFE_NUMBER_INTEGER = BigInt(Number.MIN_SAFE_INTEGER);
var LongBits = class _LongBits {
  lo;
  hi;
  constructor(lo, hi) {
    this.lo = lo | 0;
    this.hi = hi | 0;
  }
  /**
   * Converts this long bits to a possibly unsafe JavaScript number
   */
  toNumber(unsigned = false) {
    if (!unsigned && this.hi >>> 31 > 0) {
      const lo = ~this.lo + 1 >>> 0;
      let hi = ~this.hi >>> 0;
      if (lo === 0) {
        hi = hi + 1 >>> 0;
      }
      return -(lo + hi * 4294967296);
    }
    return this.lo + this.hi * 4294967296;
  }
  /**
   * Converts this long bits to a bigint
   */
  toBigInt(unsigned = false) {
    if (unsigned) {
      return BigInt(this.lo >>> 0) + (BigInt(this.hi >>> 0) << 32n);
    }
    if (this.hi >>> 31 !== 0) {
      const lo = ~this.lo + 1 >>> 0;
      let hi = ~this.hi >>> 0;
      if (lo === 0) {
        hi = hi + 1 >>> 0;
      }
      return -(BigInt(lo) + (BigInt(hi) << 32n));
    }
    return BigInt(this.lo >>> 0) + (BigInt(this.hi >>> 0) << 32n);
  }
  /**
   * Converts this long bits to a string
   */
  toString(unsigned = false) {
    return this.toBigInt(unsigned).toString();
  }
  /**
   * Zig-zag encodes this long bits
   */
  zzEncode() {
    const mask = this.hi >> 31;
    this.hi = ((this.hi << 1 | this.lo >>> 31) ^ mask) >>> 0;
    this.lo = (this.lo << 1 ^ mask) >>> 0;
    return this;
  }
  /**
   * Zig-zag decodes this long bits
   */
  zzDecode() {
    const mask = -(this.lo & 1);
    this.lo = ((this.lo >>> 1 | this.hi << 31) ^ mask) >>> 0;
    this.hi = (this.hi >>> 1 ^ mask) >>> 0;
    return this;
  }
  /**
   * Calculates the length of this longbits when encoded as a varint.
   */
  length() {
    const part0 = this.lo;
    const part1 = (this.lo >>> 28 | this.hi << 4) >>> 0;
    const part2 = this.hi >>> 24;
    return part2 === 0 ? part1 === 0 ? part0 < 16384 ? part0 < 128 ? 1 : 2 : part0 < 2097152 ? 3 : 4 : part1 < 16384 ? part1 < 128 ? 5 : 6 : part1 < 2097152 ? 7 : 8 : part2 < 128 ? 9 : 10;
  }
  /**
   * Constructs new long bits from the specified number
   */
  static fromBigInt(value) {
    if (value === 0n) {
      return zero;
    }
    if (value < MAX_SAFE_NUMBER_INTEGER && value > MIN_SAFE_NUMBER_INTEGER) {
      return this.fromNumber(Number(value));
    }
    const negative = value < 0n;
    if (negative) {
      value = -value;
    }
    let hi = value >> 32n;
    let lo = value - (hi << 32n);
    if (negative) {
      hi = ~hi | 0n;
      lo = ~lo | 0n;
      if (++lo > TWO_32) {
        lo = 0n;
        if (++hi > TWO_32) {
          hi = 0n;
        }
      }
    }
    return new _LongBits(Number(lo), Number(hi));
  }
  /**
   * Constructs new long bits from the specified number
   */
  static fromNumber(value) {
    if (value === 0) {
      return zero;
    }
    const sign = value < 0;
    if (sign) {
      value = -value;
    }
    let lo = value >>> 0;
    let hi = (value - lo) / 4294967296 >>> 0;
    if (sign) {
      hi = ~hi >>> 0;
      lo = ~lo >>> 0;
      if (++lo > 4294967295) {
        lo = 0;
        if (++hi > 4294967295) {
          hi = 0;
        }
      }
    }
    return new _LongBits(lo, hi);
  }
  /**
   * Constructs new long bits from a number, long or string
   */
  static from(value) {
    if (typeof value === "number") {
      return _LongBits.fromNumber(value);
    }
    if (typeof value === "bigint") {
      return _LongBits.fromBigInt(value);
    }
    if (typeof value === "string") {
      return _LongBits.fromBigInt(BigInt(value));
    }
    return value.low != null || value.high != null ? new _LongBits(value.low >>> 0, value.high >>> 0) : zero;
  }
};
var zero = new LongBits(0, 0);
zero.toBigInt = function() {
  return 0n;
};
zero.zzEncode = zero.zzDecode = function() {
  return this;
};
zero.length = function() {
  return 1;
};
var TWO_32 = 4294967296n;

// node_modules/protons-runtime/dist/src/utils/utf8.js
function length3(string2) {
  let len = 0;
  let c = 0;
  for (let i = 0; i < string2.length; ++i) {
    c = string2.charCodeAt(i);
    if (c < 128) {
      len += 1;
    } else if (c < 2048) {
      len += 2;
    } else if ((c & 64512) === 55296 && (string2.charCodeAt(i + 1) & 64512) === 56320) {
      ++i;
      len += 4;
    } else {
      len += 3;
    }
  }
  return len;
}
function read3(buffer2, start, end) {
  const len = end - start;
  if (len < 1) {
    return "";
  }
  let parts;
  const chunk = [];
  let i = 0;
  let t;
  while (start < end) {
    t = buffer2[start++];
    if (t < 128) {
      chunk[i++] = t;
    } else if (t > 191 && t < 224) {
      chunk[i++] = (t & 31) << 6 | buffer2[start++] & 63;
    } else if (t > 239 && t < 365) {
      t = ((t & 7) << 18 | (buffer2[start++] & 63) << 12 | (buffer2[start++] & 63) << 6 | buffer2[start++] & 63) - 65536;
      chunk[i++] = 55296 + (t >> 10);
      chunk[i++] = 56320 + (t & 1023);
    } else {
      chunk[i++] = (t & 15) << 12 | (buffer2[start++] & 63) << 6 | buffer2[start++] & 63;
    }
    if (i > 8191) {
      (parts ?? (parts = [])).push(String.fromCharCode.apply(String, chunk));
      i = 0;
    }
  }
  if (parts != null) {
    if (i > 0) {
      parts.push(String.fromCharCode.apply(String, chunk.slice(0, i)));
    }
    return parts.join("");
  }
  return String.fromCharCode.apply(String, chunk.slice(0, i));
}
function write(string2, buffer2, offset) {
  const start = offset;
  let c1;
  let c2;
  for (let i = 0; i < string2.length; ++i) {
    c1 = string2.charCodeAt(i);
    if (c1 < 128) {
      buffer2[offset++] = c1;
    } else if (c1 < 2048) {
      buffer2[offset++] = c1 >> 6 | 192;
      buffer2[offset++] = c1 & 63 | 128;
    } else if ((c1 & 64512) === 55296 && ((c2 = string2.charCodeAt(i + 1)) & 64512) === 56320) {
      c1 = 65536 + ((c1 & 1023) << 10) + (c2 & 1023);
      ++i;
      buffer2[offset++] = c1 >> 18 | 240;
      buffer2[offset++] = c1 >> 12 & 63 | 128;
      buffer2[offset++] = c1 >> 6 & 63 | 128;
      buffer2[offset++] = c1 & 63 | 128;
    } else {
      buffer2[offset++] = c1 >> 12 | 224;
      buffer2[offset++] = c1 >> 6 & 63 | 128;
      buffer2[offset++] = c1 & 63 | 128;
    }
  }
  return offset - start;
}

// node_modules/protons-runtime/dist/src/utils/reader.js
function indexOutOfRange(reader, writeLength) {
  return RangeError(`index out of range: ${reader.pos} + ${writeLength ?? 1} > ${reader.len}`);
}
function readFixed32End(buf2, end) {
  return (buf2[end - 4] | buf2[end - 3] << 8 | buf2[end - 2] << 16 | buf2[end - 1] << 24) >>> 0;
}
var Uint8ArrayReader = class {
  buf;
  pos;
  len;
  _slice = Uint8Array.prototype.subarray;
  constructor(buffer2) {
    this.buf = buffer2;
    this.pos = 0;
    this.len = buffer2.length;
  }
  /**
   * Reads a varint as an unsigned 32 bit value
   */
  uint32() {
    let value = 4294967295;
    value = (this.buf[this.pos] & 127) >>> 0;
    if (this.buf[this.pos++] < 128)
      return value;
    value = (value | (this.buf[this.pos] & 127) << 7) >>> 0;
    if (this.buf[this.pos++] < 128)
      return value;
    value = (value | (this.buf[this.pos] & 127) << 14) >>> 0;
    if (this.buf[this.pos++] < 128)
      return value;
    value = (value | (this.buf[this.pos] & 127) << 21) >>> 0;
    if (this.buf[this.pos++] < 128)
      return value;
    value = (value | (this.buf[this.pos] & 15) << 28) >>> 0;
    if (this.buf[this.pos++] < 128)
      return value;
    if ((this.pos += 5) > this.len) {
      this.pos = this.len;
      throw indexOutOfRange(this, 10);
    }
    return value;
  }
  /**
   * Reads a varint as a signed 32 bit value
   */
  int32() {
    return this.uint32() | 0;
  }
  /**
   * Reads a zig-zag encoded varint as a signed 32 bit value
   */
  sint32() {
    const value = this.uint32();
    return value >>> 1 ^ -(value & 1) | 0;
  }
  /**
   * Reads a varint as a boolean
   */
  bool() {
    return this.uint32() !== 0;
  }
  /**
   * Reads fixed 32 bits as an unsigned 32 bit integer
   */
  fixed32() {
    if (this.pos + 4 > this.len) {
      throw indexOutOfRange(this, 4);
    }
    const res = readFixed32End(this.buf, this.pos += 4);
    return res;
  }
  /**
   * Reads fixed 32 bits as a signed 32 bit integer
   */
  sfixed32() {
    if (this.pos + 4 > this.len) {
      throw indexOutOfRange(this, 4);
    }
    const res = readFixed32End(this.buf, this.pos += 4) | 0;
    return res;
  }
  /**
   * Reads a float (32 bit) as a number
   */
  float() {
    if (this.pos + 4 > this.len) {
      throw indexOutOfRange(this, 4);
    }
    const value = readFloatLE(this.buf, this.pos);
    this.pos += 4;
    return value;
  }
  /**
   * Reads a double (64 bit float) as a number
   */
  double() {
    if (this.pos + 8 > this.len) {
      throw indexOutOfRange(this, 4);
    }
    const value = readDoubleLE(this.buf, this.pos);
    this.pos += 8;
    return value;
  }
  /**
   * Reads a sequence of bytes preceded by its length as a varint
   */
  bytes() {
    const length4 = this.uint32();
    const start = this.pos;
    const end = this.pos + length4;
    if (end > this.len) {
      throw indexOutOfRange(this, length4);
    }
    this.pos += length4;
    return start === end ? new Uint8Array(0) : this.buf.subarray(start, end);
  }
  /**
   * Reads a string preceded by its byte length as a varint
   */
  string() {
    const bytes = this.bytes();
    return read3(bytes, 0, bytes.length);
  }
  /**
   * Skips the specified number of bytes if specified, otherwise skips a varint
   */
  skip(length4) {
    if (typeof length4 === "number") {
      if (this.pos + length4 > this.len) {
        throw indexOutOfRange(this, length4);
      }
      this.pos += length4;
    } else {
      do {
        if (this.pos >= this.len) {
          throw indexOutOfRange(this);
        }
      } while ((this.buf[this.pos++] & 128) !== 0);
    }
    return this;
  }
  /**
   * Skips the next element of the specified wire type
   */
  skipType(wireType) {
    switch (wireType) {
      case 0:
        this.skip();
        break;
      case 1:
        this.skip(8);
        break;
      case 2:
        this.skip(this.uint32());
        break;
      case 3:
        while ((wireType = this.uint32() & 7) !== 4) {
          this.skipType(wireType);
        }
        break;
      case 5:
        this.skip(4);
        break;
      default:
        throw Error(`invalid wire type ${wireType} at offset ${this.pos}`);
    }
    return this;
  }
  readLongVarint() {
    const bits = new LongBits(0, 0);
    let i = 0;
    if (this.len - this.pos > 4) {
      for (; i < 4; ++i) {
        bits.lo = (bits.lo | (this.buf[this.pos] & 127) << i * 7) >>> 0;
        if (this.buf[this.pos++] < 128) {
          return bits;
        }
      }
      bits.lo = (bits.lo | (this.buf[this.pos] & 127) << 28) >>> 0;
      bits.hi = (bits.hi | (this.buf[this.pos] & 127) >> 4) >>> 0;
      if (this.buf[this.pos++] < 128) {
        return bits;
      }
      i = 0;
    } else {
      for (; i < 3; ++i) {
        if (this.pos >= this.len) {
          throw indexOutOfRange(this);
        }
        bits.lo = (bits.lo | (this.buf[this.pos] & 127) << i * 7) >>> 0;
        if (this.buf[this.pos++] < 128) {
          return bits;
        }
      }
      bits.lo = (bits.lo | (this.buf[this.pos++] & 127) << i * 7) >>> 0;
      return bits;
    }
    if (this.len - this.pos > 4) {
      for (; i < 5; ++i) {
        bits.hi = (bits.hi | (this.buf[this.pos] & 127) << i * 7 + 3) >>> 0;
        if (this.buf[this.pos++] < 128) {
          return bits;
        }
      }
    } else {
      for (; i < 5; ++i) {
        if (this.pos >= this.len) {
          throw indexOutOfRange(this);
        }
        bits.hi = (bits.hi | (this.buf[this.pos] & 127) << i * 7 + 3) >>> 0;
        if (this.buf[this.pos++] < 128) {
          return bits;
        }
      }
    }
    throw Error("invalid varint encoding");
  }
  readFixed64() {
    if (this.pos + 8 > this.len) {
      throw indexOutOfRange(this, 8);
    }
    const lo = readFixed32End(this.buf, this.pos += 4);
    const hi = readFixed32End(this.buf, this.pos += 4);
    return new LongBits(lo, hi);
  }
  /**
   * Reads a varint as a signed 64 bit value
   */
  int64() {
    return this.readLongVarint().toBigInt();
  }
  /**
   * Reads a varint as a signed 64 bit value returned as a possibly unsafe
   * JavaScript number
   */
  int64Number() {
    return this.readLongVarint().toNumber();
  }
  /**
   * Reads a varint as a signed 64 bit value returned as a string
   */
  int64String() {
    return this.readLongVarint().toString();
  }
  /**
   * Reads a varint as an unsigned 64 bit value
   */
  uint64() {
    return this.readLongVarint().toBigInt(true);
  }
  /**
   * Reads a varint as an unsigned 64 bit value returned as a possibly unsafe
   * JavaScript number
   */
  uint64Number() {
    return this.readLongVarint().toNumber(true);
  }
  /**
   * Reads a varint as an unsigned 64 bit value returned as a string
   */
  uint64String() {
    return this.readLongVarint().toString(true);
  }
  /**
   * Reads a zig-zag encoded varint as a signed 64 bit value
   */
  sint64() {
    return this.readLongVarint().zzDecode().toBigInt();
  }
  /**
   * Reads a zig-zag encoded varint as a signed 64 bit value returned as a
   * possibly unsafe JavaScript number
   */
  sint64Number() {
    return this.readLongVarint().zzDecode().toNumber();
  }
  /**
   * Reads a zig-zag encoded varint as a signed 64 bit value returned as a
   * string
   */
  sint64String() {
    return this.readLongVarint().zzDecode().toString();
  }
  /**
   * Reads fixed 64 bits
   */
  fixed64() {
    return this.readFixed64().toBigInt();
  }
  /**
   * Reads fixed 64 bits returned as a possibly unsafe JavaScript number
   */
  fixed64Number() {
    return this.readFixed64().toNumber();
  }
  /**
   * Reads fixed 64 bits returned as a string
   */
  fixed64String() {
    return this.readFixed64().toString();
  }
  /**
   * Reads zig-zag encoded fixed 64 bits
   */
  sfixed64() {
    return this.readFixed64().toBigInt();
  }
  /**
   * Reads zig-zag encoded fixed 64 bits returned as a possibly unsafe
   * JavaScript number
   */
  sfixed64Number() {
    return this.readFixed64().toNumber();
  }
  /**
   * Reads zig-zag encoded fixed 64 bits returned as a string
   */
  sfixed64String() {
    return this.readFixed64().toString();
  }
};
function createReader(buf2) {
  return new Uint8ArrayReader(buf2 instanceof Uint8Array ? buf2 : buf2.subarray());
}

// node_modules/protons-runtime/dist/src/decode.js
function decodeMessage(buf2, codec) {
  const reader = createReader(buf2);
  return codec.decode(reader);
}

// node_modules/multiformats/src/bases/base10.js
var base10_exports = {};
__export(base10_exports, {
  base10: () => base10
});
var base10 = baseX2({
  prefix: "9",
  name: "base10",
  alphabet: "0123456789"
});

// node_modules/multiformats/src/bases/base16.js
var base16_exports = {};
__export(base16_exports, {
  base16: () => base16,
  base16upper: () => base16upper
});
var base16 = rfc46482({
  prefix: "f",
  name: "base16",
  alphabet: "0123456789abcdef",
  bitsPerChar: 4
});
var base16upper = rfc46482({
  prefix: "F",
  name: "base16upper",
  alphabet: "0123456789ABCDEF",
  bitsPerChar: 4
});

// node_modules/multiformats/src/bases/base2.js
var base2_exports = {};
__export(base2_exports, {
  base2: () => base22
});
var base22 = rfc46482({
  prefix: "0",
  name: "base2",
  alphabet: "01",
  bitsPerChar: 1
});

// node_modules/multiformats/src/bases/base256emoji.js
var base256emoji_exports = {};
__export(base256emoji_exports, {
  base256emoji: () => base256emoji
});
var alphabet = Array.from("\u{1F680}\u{1FA90}\u2604\u{1F6F0}\u{1F30C}\u{1F311}\u{1F312}\u{1F313}\u{1F314}\u{1F315}\u{1F316}\u{1F317}\u{1F318}\u{1F30D}\u{1F30F}\u{1F30E}\u{1F409}\u2600\u{1F4BB}\u{1F5A5}\u{1F4BE}\u{1F4BF}\u{1F602}\u2764\u{1F60D}\u{1F923}\u{1F60A}\u{1F64F}\u{1F495}\u{1F62D}\u{1F618}\u{1F44D}\u{1F605}\u{1F44F}\u{1F601}\u{1F525}\u{1F970}\u{1F494}\u{1F496}\u{1F499}\u{1F622}\u{1F914}\u{1F606}\u{1F644}\u{1F4AA}\u{1F609}\u263A\u{1F44C}\u{1F917}\u{1F49C}\u{1F614}\u{1F60E}\u{1F607}\u{1F339}\u{1F926}\u{1F389}\u{1F49E}\u270C\u2728\u{1F937}\u{1F631}\u{1F60C}\u{1F338}\u{1F64C}\u{1F60B}\u{1F497}\u{1F49A}\u{1F60F}\u{1F49B}\u{1F642}\u{1F493}\u{1F929}\u{1F604}\u{1F600}\u{1F5A4}\u{1F603}\u{1F4AF}\u{1F648}\u{1F447}\u{1F3B6}\u{1F612}\u{1F92D}\u2763\u{1F61C}\u{1F48B}\u{1F440}\u{1F62A}\u{1F611}\u{1F4A5}\u{1F64B}\u{1F61E}\u{1F629}\u{1F621}\u{1F92A}\u{1F44A}\u{1F973}\u{1F625}\u{1F924}\u{1F449}\u{1F483}\u{1F633}\u270B\u{1F61A}\u{1F61D}\u{1F634}\u{1F31F}\u{1F62C}\u{1F643}\u{1F340}\u{1F337}\u{1F63B}\u{1F613}\u2B50\u2705\u{1F97A}\u{1F308}\u{1F608}\u{1F918}\u{1F4A6}\u2714\u{1F623}\u{1F3C3}\u{1F490}\u2639\u{1F38A}\u{1F498}\u{1F620}\u261D\u{1F615}\u{1F33A}\u{1F382}\u{1F33B}\u{1F610}\u{1F595}\u{1F49D}\u{1F64A}\u{1F639}\u{1F5E3}\u{1F4AB}\u{1F480}\u{1F451}\u{1F3B5}\u{1F91E}\u{1F61B}\u{1F534}\u{1F624}\u{1F33C}\u{1F62B}\u26BD\u{1F919}\u2615\u{1F3C6}\u{1F92B}\u{1F448}\u{1F62E}\u{1F646}\u{1F37B}\u{1F343}\u{1F436}\u{1F481}\u{1F632}\u{1F33F}\u{1F9E1}\u{1F381}\u26A1\u{1F31E}\u{1F388}\u274C\u270A\u{1F44B}\u{1F630}\u{1F928}\u{1F636}\u{1F91D}\u{1F6B6}\u{1F4B0}\u{1F353}\u{1F4A2}\u{1F91F}\u{1F641}\u{1F6A8}\u{1F4A8}\u{1F92C}\u2708\u{1F380}\u{1F37A}\u{1F913}\u{1F619}\u{1F49F}\u{1F331}\u{1F616}\u{1F476}\u{1F974}\u25B6\u27A1\u2753\u{1F48E}\u{1F4B8}\u2B07\u{1F628}\u{1F31A}\u{1F98B}\u{1F637}\u{1F57A}\u26A0\u{1F645}\u{1F61F}\u{1F635}\u{1F44E}\u{1F932}\u{1F920}\u{1F927}\u{1F4CC}\u{1F535}\u{1F485}\u{1F9D0}\u{1F43E}\u{1F352}\u{1F617}\u{1F911}\u{1F30A}\u{1F92F}\u{1F437}\u260E\u{1F4A7}\u{1F62F}\u{1F486}\u{1F446}\u{1F3A4}\u{1F647}\u{1F351}\u2744\u{1F334}\u{1F4A3}\u{1F438}\u{1F48C}\u{1F4CD}\u{1F940}\u{1F922}\u{1F445}\u{1F4A1}\u{1F4A9}\u{1F450}\u{1F4F8}\u{1F47B}\u{1F910}\u{1F92E}\u{1F3BC}\u{1F975}\u{1F6A9}\u{1F34E}\u{1F34A}\u{1F47C}\u{1F48D}\u{1F4E3}\u{1F942}");
var alphabetBytesToChars = (
  /** @type {string[]} */
  alphabet.reduce(
    (p, c, i) => {
      p[i] = c;
      return p;
    },
    /** @type {string[]} */
    []
  )
);
var alphabetCharsToBytes = (
  /** @type {number[]} */
  alphabet.reduce(
    (p, c, i) => {
      p[
        /** @type {number} */
        c.codePointAt(0)
      ] = i;
      return p;
    },
    /** @type {number[]} */
    []
  )
);
function encode10(data) {
  return data.reduce((p, c) => {
    p += alphabetBytesToChars[c];
    return p;
  }, "");
}
function decode14(str) {
  const byts = [];
  for (const char of str) {
    const byt = alphabetCharsToBytes[
      /** @type {number} */
      char.codePointAt(0)
    ];
    if (byt === void 0) {
      throw new Error(`Non-base256emoji character: ${char}`);
    }
    byts.push(byt);
  }
  return new Uint8Array(byts);
}
var base256emoji = from2({
  prefix: "\u{1F680}",
  name: "base256emoji",
  encode: encode10,
  decode: decode14
});

// node_modules/multiformats/src/bases/base36.js
var base36_exports = {};
__export(base36_exports, {
  base36: () => base36,
  base36upper: () => base36upper
});
var base36 = baseX2({
  prefix: "k",
  name: "base36",
  alphabet: "0123456789abcdefghijklmnopqrstuvwxyz"
});
var base36upper = baseX2({
  prefix: "K",
  name: "base36upper",
  alphabet: "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ"
});

// node_modules/multiformats/src/bases/base8.js
var base8_exports = {};
__export(base8_exports, {
  base8: () => base8
});
var base8 = rfc46482({
  prefix: "7",
  name: "base8",
  alphabet: "01234567",
  bitsPerChar: 3
});

// node_modules/multiformats/src/bases/identity.js
var identity_exports = {};
__export(identity_exports, {
  identity: () => identity
});
var identity = from2({
  prefix: "\0",
  name: "identity",
  encode: (buf2) => toString2(buf2),
  decode: (str) => fromString2(str)
});

// node_modules/multiformats/src/codecs/json.js
var textEncoder4 = new TextEncoder();
var textDecoder3 = new TextDecoder();

// node_modules/multiformats/src/hashes/identity.js
var identity_exports2 = {};
__export(identity_exports2, {
  identity: () => identity2
});
var code4 = 0;
var name3 = "identity";
var encode11 = coerce2;
var digest = (input) => create2(code4, encode11(input));
var identity2 = { code: code4, name: name3, encode: encode11, digest };

// node_modules/multiformats/src/hashes/sha2.js
var sha2_exports = {};
__export(sha2_exports, {
  sha256: () => sha256,
  sha512: () => sha512
});
import crypto from "crypto";

// node_modules/multiformats/src/hashes/hasher.js
var from3 = ({ name: name4, code: code5, encode: encode12 }) => new Hasher(name4, code5, encode12);
var Hasher = class {
  /**
   *
   * @param {Name} name
   * @param {Code} code
   * @param {(input: Uint8Array) => Await<Uint8Array>} encode
   */
  constructor(name4, code5, encode12) {
    this.name = name4;
    this.code = code5;
    this.encode = encode12;
  }
  /**
   * @param {Uint8Array} input
   * @returns {Await<Digest.Digest<Code, number>>}
   */
  digest(input) {
    if (input instanceof Uint8Array) {
      const result = this.encode(input);
      return result instanceof Uint8Array ? create2(this.code, result) : result.then((digest2) => create2(this.code, digest2));
    } else {
      throw Error("Unknown type, must be binary type");
    }
  }
};

// node_modules/multiformats/src/hashes/sha2.js
var sha256 = from3({
  name: "sha2-256",
  code: 18,
  encode: (input) => coerce2(crypto.createHash("sha256").update(input).digest())
});
var sha512 = from3({
  name: "sha2-512",
  code: 19,
  encode: (input) => coerce2(crypto.createHash("sha512").update(input).digest())
});

// node_modules/multiformats/src/basics.js
var bases = { ...identity_exports, ...base2_exports, ...base8_exports, ...base10_exports, ...base16_exports, ...base32_exports, ...base36_exports, ...base58_exports, ...base64_exports, ...base256emoji_exports };
var hashes = { ...sha2_exports, ...identity_exports2 };

// node_modules/uint8arrays/dist/src/util/bases.js
function createCodec(name4, prefix, encode12, decode15) {
  return {
    name: name4,
    prefix,
    encoder: {
      name: name4,
      prefix,
      encode: encode12
    },
    decoder: {
      decode: decode15
    }
  };
}
var string = createCodec("utf8", "u", (buf2) => {
  const decoder = new TextDecoder("utf8");
  return "u" + decoder.decode(buf2);
}, (str) => {
  const encoder = new TextEncoder();
  return encoder.encode(str.substring(1));
});
var ascii = createCodec("ascii", "a", (buf2) => {
  let string2 = "a";
  for (let i = 0; i < buf2.length; i++) {
    string2 += String.fromCharCode(buf2[i]);
  }
  return string2;
}, (str) => {
  str = str.substring(1);
  const buf2 = allocUnsafe(str.length);
  for (let i = 0; i < str.length; i++) {
    buf2[i] = str.charCodeAt(i);
  }
  return buf2;
});
var BASES = {
  utf8: string,
  "utf-8": string,
  hex: bases.base16,
  latin1: ascii,
  ascii,
  binary: ascii,
  ...bases
};
var bases_default = BASES;

// node_modules/uint8arrays/dist/src/from-string.js
function fromString3(string2, encoding = "utf8") {
  const base3 = bases_default[encoding];
  if (base3 == null) {
    throw new Error(`Unsupported encoding "${encoding}"`);
  }
  if ((encoding === "utf8" || encoding === "utf-8") && globalThis.Buffer != null && globalThis.Buffer.from != null) {
    return asUint8Array(globalThis.Buffer.from(string2, "utf-8"));
  }
  return base3.decoder.decode(`${base3.prefix}${string2}`);
}

// node_modules/protons-runtime/dist/src/utils/pool.js
function pool(size) {
  const SIZE = size ?? 8192;
  const MAX = SIZE >>> 1;
  let slab;
  let offset = SIZE;
  return function poolAlloc(size2) {
    if (size2 < 1 || size2 > MAX) {
      return allocUnsafe(size2);
    }
    if (offset + size2 > SIZE) {
      slab = allocUnsafe(SIZE);
      offset = 0;
    }
    const buf2 = slab.subarray(offset, offset += size2);
    if ((offset & 7) !== 0) {
      offset = (offset | 7) + 1;
    }
    return buf2;
  };
}

// node_modules/protons-runtime/dist/src/utils/writer.js
var Op = class {
  /**
   * Function to call
   */
  fn;
  /**
   * Value byte length
   */
  len;
  /**
   * Next operation
   */
  next;
  /**
   * Value to write
   */
  val;
  constructor(fn, len, val) {
    this.fn = fn;
    this.len = len;
    this.next = void 0;
    this.val = val;
  }
};
function noop2() {
}
var State = class {
  /**
   * Current head
   */
  head;
  /**
   * Current tail
   */
  tail;
  /**
   * Current buffer length
   */
  len;
  /**
   * Next state
   */
  next;
  constructor(writer) {
    this.head = writer.head;
    this.tail = writer.tail;
    this.len = writer.len;
    this.next = writer.states;
  }
};
var bufferPool = pool();
function alloc3(size) {
  if (globalThis.Buffer != null) {
    return allocUnsafe(size);
  }
  return bufferPool(size);
}
var Uint8ArrayWriter = class {
  /**
   * Current length
   */
  len;
  /**
   * Operations head
   */
  head;
  /**
   * Operations tail
   */
  tail;
  /**
   * Linked forked states
   */
  states;
  constructor() {
    this.len = 0;
    this.head = new Op(noop2, 0, 0);
    this.tail = this.head;
    this.states = null;
  }
  /**
   * Pushes a new operation to the queue
   */
  _push(fn, len, val) {
    this.tail = this.tail.next = new Op(fn, len, val);
    this.len += len;
    return this;
  }
  /**
   * Writes an unsigned 32 bit value as a varint
   */
  uint32(value) {
    this.len += (this.tail = this.tail.next = new VarintOp((value = value >>> 0) < 128 ? 1 : value < 16384 ? 2 : value < 2097152 ? 3 : value < 268435456 ? 4 : 5, value)).len;
    return this;
  }
  /**
   * Writes a signed 32 bit value as a varint`
   */
  int32(value) {
    return value < 0 ? this._push(writeVarint64, 10, LongBits.fromNumber(value)) : this.uint32(value);
  }
  /**
   * Writes a 32 bit value as a varint, zig-zag encoded
   */
  sint32(value) {
    return this.uint32((value << 1 ^ value >> 31) >>> 0);
  }
  /**
   * Writes an unsigned 64 bit value as a varint
   */
  uint64(value) {
    const bits = LongBits.fromBigInt(value);
    return this._push(writeVarint64, bits.length(), bits);
  }
  /**
   * Writes an unsigned 64 bit value as a varint
   */
  uint64Number(value) {
    const bits = LongBits.fromNumber(value);
    return this._push(writeVarint64, bits.length(), bits);
  }
  /**
   * Writes an unsigned 64 bit value as a varint
   */
  uint64String(value) {
    return this.uint64(BigInt(value));
  }
  /**
   * Writes a signed 64 bit value as a varint
   */
  int64(value) {
    return this.uint64(value);
  }
  /**
   * Writes a signed 64 bit value as a varint
   */
  int64Number(value) {
    return this.uint64Number(value);
  }
  /**
   * Writes a signed 64 bit value as a varint
   */
  int64String(value) {
    return this.uint64String(value);
  }
  /**
   * Writes a signed 64 bit value as a varint, zig-zag encoded
   */
  sint64(value) {
    const bits = LongBits.fromBigInt(value).zzEncode();
    return this._push(writeVarint64, bits.length(), bits);
  }
  /**
   * Writes a signed 64 bit value as a varint, zig-zag encoded
   */
  sint64Number(value) {
    const bits = LongBits.fromNumber(value).zzEncode();
    return this._push(writeVarint64, bits.length(), bits);
  }
  /**
   * Writes a signed 64 bit value as a varint, zig-zag encoded
   */
  sint64String(value) {
    return this.sint64(BigInt(value));
  }
  /**
   * Writes a boolish value as a varint
   */
  bool(value) {
    return this._push(writeByte, 1, value ? 1 : 0);
  }
  /**
   * Writes an unsigned 32 bit value as fixed 32 bits
   */
  fixed32(value) {
    return this._push(writeFixed32, 4, value >>> 0);
  }
  /**
   * Writes a signed 32 bit value as fixed 32 bits
   */
  sfixed32(value) {
    return this.fixed32(value);
  }
  /**
   * Writes an unsigned 64 bit value as fixed 64 bits
   */
  fixed64(value) {
    const bits = LongBits.fromBigInt(value);
    return this._push(writeFixed32, 4, bits.lo)._push(writeFixed32, 4, bits.hi);
  }
  /**
   * Writes an unsigned 64 bit value as fixed 64 bits
   */
  fixed64Number(value) {
    const bits = LongBits.fromNumber(value);
    return this._push(writeFixed32, 4, bits.lo)._push(writeFixed32, 4, bits.hi);
  }
  /**
   * Writes an unsigned 64 bit value as fixed 64 bits
   */
  fixed64String(value) {
    return this.fixed64(BigInt(value));
  }
  /**
   * Writes a signed 64 bit value as fixed 64 bits
   */
  sfixed64(value) {
    return this.fixed64(value);
  }
  /**
   * Writes a signed 64 bit value as fixed 64 bits
   */
  sfixed64Number(value) {
    return this.fixed64Number(value);
  }
  /**
   * Writes a signed 64 bit value as fixed 64 bits
   */
  sfixed64String(value) {
    return this.fixed64String(value);
  }
  /**
   * Writes a float (32 bit)
   */
  float(value) {
    return this._push(writeFloatLE, 4, value);
  }
  /**
   * Writes a double (64 bit float).
   *
   * @function
   * @param {number} value - Value to write
   * @returns {Writer} `this`
   */
  double(value) {
    return this._push(writeDoubleLE, 8, value);
  }
  /**
   * Writes a sequence of bytes
   */
  bytes(value) {
    const len = value.length >>> 0;
    if (len === 0) {
      return this._push(writeByte, 1, 0);
    }
    return this.uint32(len)._push(writeBytes, len, value);
  }
  /**
   * Writes a string
   */
  string(value) {
    const len = length3(value);
    return len !== 0 ? this.uint32(len)._push(write, len, value) : this._push(writeByte, 1, 0);
  }
  /**
   * Forks this writer's state by pushing it to a stack.
   * Calling {@link Writer#reset|reset} or {@link Writer#ldelim|ldelim} resets the writer to the previous state.
   */
  fork() {
    this.states = new State(this);
    this.head = this.tail = new Op(noop2, 0, 0);
    this.len = 0;
    return this;
  }
  /**
   * Resets this instance to the last state
   */
  reset() {
    if (this.states != null) {
      this.head = this.states.head;
      this.tail = this.states.tail;
      this.len = this.states.len;
      this.states = this.states.next;
    } else {
      this.head = this.tail = new Op(noop2, 0, 0);
      this.len = 0;
    }
    return this;
  }
  /**
   * Resets to the last state and appends the fork state's current write length as a varint followed by its operations.
   */
  ldelim() {
    const head = this.head;
    const tail = this.tail;
    const len = this.len;
    this.reset().uint32(len);
    if (len !== 0) {
      this.tail.next = head.next;
      this.tail = tail;
      this.len += len;
    }
    return this;
  }
  /**
   * Finishes the write operation
   */
  finish() {
    let head = this.head.next;
    const buf2 = alloc3(this.len);
    let pos = 0;
    while (head != null) {
      head.fn(head.val, buf2, pos);
      pos += head.len;
      head = head.next;
    }
    return buf2;
  }
};
function writeByte(val, buf2, pos) {
  buf2[pos] = val & 255;
}
function writeVarint32(val, buf2, pos) {
  while (val > 127) {
    buf2[pos++] = val & 127 | 128;
    val >>>= 7;
  }
  buf2[pos] = val;
}
var VarintOp = class extends Op {
  next;
  constructor(len, val) {
    super(writeVarint32, len, val);
    this.next = void 0;
  }
};
function writeVarint64(val, buf2, pos) {
  while (val.hi !== 0) {
    buf2[pos++] = val.lo & 127 | 128;
    val.lo = (val.lo >>> 7 | val.hi << 25) >>> 0;
    val.hi >>>= 7;
  }
  while (val.lo > 127) {
    buf2[pos++] = val.lo & 127 | 128;
    val.lo = val.lo >>> 7;
  }
  buf2[pos++] = val.lo;
}
function writeFixed32(val, buf2, pos) {
  buf2[pos] = val & 255;
  buf2[pos + 1] = val >>> 8 & 255;
  buf2[pos + 2] = val >>> 16 & 255;
  buf2[pos + 3] = val >>> 24;
}
function writeBytes(val, buf2, pos) {
  buf2.set(val, pos);
}
if (globalThis.Buffer != null) {
  Uint8ArrayWriter.prototype.bytes = function(value) {
    const len = value.length >>> 0;
    this.uint32(len);
    if (len > 0) {
      this._push(writeBytesBuffer, len, value);
    }
    return this;
  };
  Uint8ArrayWriter.prototype.string = function(value) {
    const len = globalThis.Buffer.byteLength(value);
    this.uint32(len);
    if (len > 0) {
      this._push(writeStringBuffer, len, value);
    }
    return this;
  };
}
function writeBytesBuffer(val, buf2, pos) {
  buf2.set(val, pos);
}
function writeStringBuffer(val, buf2, pos) {
  if (val.length < 40) {
    write(val, buf2, pos);
  } else if (buf2.utf8Write != null) {
    buf2.utf8Write(val, pos);
  } else {
    buf2.set(fromString3(val), pos);
  }
}
function createWriter() {
  return new Uint8ArrayWriter();
}

// node_modules/protons-runtime/dist/src/encode.js
function encodeMessage(message2, codec) {
  const w = createWriter();
  codec.encode(message2, w, {
    lengthDelimited: false
  });
  return w.finish();
}

// node_modules/protons-runtime/dist/src/codec.js
var CODEC_TYPES;
(function(CODEC_TYPES2) {
  CODEC_TYPES2[CODEC_TYPES2["VARINT"] = 0] = "VARINT";
  CODEC_TYPES2[CODEC_TYPES2["BIT64"] = 1] = "BIT64";
  CODEC_TYPES2[CODEC_TYPES2["LENGTH_DELIMITED"] = 2] = "LENGTH_DELIMITED";
  CODEC_TYPES2[CODEC_TYPES2["START_GROUP"] = 3] = "START_GROUP";
  CODEC_TYPES2[CODEC_TYPES2["END_GROUP"] = 4] = "END_GROUP";
  CODEC_TYPES2[CODEC_TYPES2["BIT32"] = 5] = "BIT32";
})(CODEC_TYPES || (CODEC_TYPES = {}));
function createCodec2(name4, type, encode12, decode15) {
  return {
    name: name4,
    type,
    encode: encode12,
    decode: decode15
  };
}

// node_modules/protons-runtime/dist/src/codecs/enum.js
function enumeration(v) {
  function findValue(val) {
    if (v[val.toString()] == null) {
      throw new Error("Invalid enum value");
    }
    return v[val];
  }
  const encode12 = function enumEncode(val, writer) {
    const enumValue = findValue(val);
    writer.int32(enumValue);
  };
  const decode15 = function enumDecode(reader) {
    const val = reader.int32();
    return findValue(val);
  };
  return createCodec2("enum", CODEC_TYPES.VARINT, encode12, decode15);
}

// node_modules/protons-runtime/dist/src/codecs/message.js
function message(encode12, decode15) {
  return createCodec2("message", CODEC_TYPES.LENGTH_DELIMITED, encode12, decode15);
}

// node_modules/ipfs-unixfs/dist/src/unixfs.js
var Data;
(function(Data2) {
  let DataType;
  (function(DataType2) {
    DataType2["Raw"] = "Raw";
    DataType2["Directory"] = "Directory";
    DataType2["File"] = "File";
    DataType2["Metadata"] = "Metadata";
    DataType2["Symlink"] = "Symlink";
    DataType2["HAMTShard"] = "HAMTShard";
  })(DataType = Data2.DataType || (Data2.DataType = {}));
  let __DataTypeValues;
  (function(__DataTypeValues2) {
    __DataTypeValues2[__DataTypeValues2["Raw"] = 0] = "Raw";
    __DataTypeValues2[__DataTypeValues2["Directory"] = 1] = "Directory";
    __DataTypeValues2[__DataTypeValues2["File"] = 2] = "File";
    __DataTypeValues2[__DataTypeValues2["Metadata"] = 3] = "Metadata";
    __DataTypeValues2[__DataTypeValues2["Symlink"] = 4] = "Symlink";
    __DataTypeValues2[__DataTypeValues2["HAMTShard"] = 5] = "HAMTShard";
  })(__DataTypeValues || (__DataTypeValues = {}));
  (function(DataType2) {
    DataType2.codec = () => {
      return enumeration(__DataTypeValues);
    };
  })(DataType = Data2.DataType || (Data2.DataType = {}));
  let _codec;
  Data2.codec = () => {
    if (_codec == null) {
      _codec = message((obj, w, opts = {}) => {
        if (opts.lengthDelimited !== false) {
          w.fork();
        }
        if (obj.Type != null) {
          w.uint32(8);
          Data2.DataType.codec().encode(obj.Type, w);
        }
        if (obj.Data != null) {
          w.uint32(18);
          w.bytes(obj.Data);
        }
        if (obj.filesize != null) {
          w.uint32(24);
          w.uint64(obj.filesize);
        }
        if (obj.blocksizes != null) {
          for (const value of obj.blocksizes) {
            w.uint32(32);
            w.uint64(value);
          }
        }
        if (obj.hashType != null) {
          w.uint32(40);
          w.uint64(obj.hashType);
        }
        if (obj.fanout != null) {
          w.uint32(48);
          w.uint64(obj.fanout);
        }
        if (obj.mode != null) {
          w.uint32(56);
          w.uint32(obj.mode);
        }
        if (obj.mtime != null) {
          w.uint32(66);
          UnixTime.codec().encode(obj.mtime, w);
        }
        if (opts.lengthDelimited !== false) {
          w.ldelim();
        }
      }, (reader, length4) => {
        const obj = {
          blocksizes: []
        };
        const end = length4 == null ? reader.len : reader.pos + length4;
        while (reader.pos < end) {
          const tag = reader.uint32();
          switch (tag >>> 3) {
            case 1:
              obj.Type = Data2.DataType.codec().decode(reader);
              break;
            case 2:
              obj.Data = reader.bytes();
              break;
            case 3:
              obj.filesize = reader.uint64();
              break;
            case 4:
              obj.blocksizes.push(reader.uint64());
              break;
            case 5:
              obj.hashType = reader.uint64();
              break;
            case 6:
              obj.fanout = reader.uint64();
              break;
            case 7:
              obj.mode = reader.uint32();
              break;
            case 8:
              obj.mtime = UnixTime.codec().decode(reader, reader.uint32());
              break;
            default:
              reader.skipType(tag & 7);
              break;
          }
        }
        return obj;
      });
    }
    return _codec;
  };
  Data2.encode = (obj) => {
    return encodeMessage(obj, Data2.codec());
  };
  Data2.decode = (buf2) => {
    return decodeMessage(buf2, Data2.codec());
  };
})(Data || (Data = {}));
var UnixTime;
(function(UnixTime2) {
  let _codec;
  UnixTime2.codec = () => {
    if (_codec == null) {
      _codec = message((obj, w, opts = {}) => {
        if (opts.lengthDelimited !== false) {
          w.fork();
        }
        if (obj.Seconds != null) {
          w.uint32(8);
          w.int64(obj.Seconds);
        }
        if (obj.FractionalNanoseconds != null) {
          w.uint32(21);
          w.fixed32(obj.FractionalNanoseconds);
        }
        if (opts.lengthDelimited !== false) {
          w.ldelim();
        }
      }, (reader, length4) => {
        const obj = {};
        const end = length4 == null ? reader.len : reader.pos + length4;
        while (reader.pos < end) {
          const tag = reader.uint32();
          switch (tag >>> 3) {
            case 1:
              obj.Seconds = reader.int64();
              break;
            case 2:
              obj.FractionalNanoseconds = reader.fixed32();
              break;
            default:
              reader.skipType(tag & 7);
              break;
          }
        }
        return obj;
      });
    }
    return _codec;
  };
  UnixTime2.encode = (obj) => {
    return encodeMessage(obj, UnixTime2.codec());
  };
  UnixTime2.decode = (buf2) => {
    return decodeMessage(buf2, UnixTime2.codec());
  };
})(UnixTime || (UnixTime = {}));
var Metadata;
(function(Metadata2) {
  let _codec;
  Metadata2.codec = () => {
    if (_codec == null) {
      _codec = message((obj, w, opts = {}) => {
        if (opts.lengthDelimited !== false) {
          w.fork();
        }
        if (obj.MimeType != null) {
          w.uint32(10);
          w.string(obj.MimeType);
        }
        if (opts.lengthDelimited !== false) {
          w.ldelim();
        }
      }, (reader, length4) => {
        const obj = {};
        const end = length4 == null ? reader.len : reader.pos + length4;
        while (reader.pos < end) {
          const tag = reader.uint32();
          switch (tag >>> 3) {
            case 1:
              obj.MimeType = reader.string();
              break;
            default:
              reader.skipType(tag & 7);
              break;
          }
        }
        return obj;
      });
    }
    return _codec;
  };
  Metadata2.encode = (obj) => {
    return encodeMessage(obj, Metadata2.codec());
  };
  Metadata2.decode = (buf2) => {
    return decodeMessage(buf2, Metadata2.codec());
  };
})(Metadata || (Metadata = {}));

// node_modules/ipfs-unixfs/dist/src/index.js
var types = {
  Raw: "raw",
  Directory: "directory",
  File: "file",
  Metadata: "metadata",
  Symlink: "symlink",
  HAMTShard: "hamt-sharded-directory"
};
var dirTypes = [
  "directory",
  "hamt-sharded-directory"
];
var DEFAULT_FILE_MODE = parseInt("0644", 8);
var DEFAULT_DIRECTORY_MODE = parseInt("0755", 8);
var UnixFS = class _UnixFS {
  /**
   * Decode from protobuf https://github.com/ipfs/specs/blob/master/UNIXFS.md
   */
  static unmarshal(marshaled) {
    const message2 = Data.decode(marshaled);
    const data = new _UnixFS({
      type: types[message2.Type != null ? message2.Type.toString() : "File"],
      data: message2.Data,
      blockSizes: message2.blocksizes,
      mode: message2.mode,
      mtime: message2.mtime != null ? {
        secs: message2.mtime.Seconds ?? 0n,
        nsecs: message2.mtime.FractionalNanoseconds
      } : void 0,
      fanout: message2.fanout
    });
    data._originalMode = message2.mode ?? 0;
    return data;
  }
  type;
  data;
  blockSizes;
  hashType;
  fanout;
  mtime;
  _mode;
  _originalMode;
  constructor(options = {
    type: "file"
  }) {
    const { type, data, blockSizes, hashType, fanout, mtime, mode } = options;
    if (type != null && !Object.values(types).includes(type)) {
      throw (0, import_err_code.default)(new Error("Type: " + type + " is not valid"), "ERR_INVALID_TYPE");
    }
    this.type = type ?? "file";
    this.data = data;
    this.hashType = hashType;
    this.fanout = fanout;
    this.blockSizes = blockSizes ?? [];
    this._originalMode = 0;
    this.mode = mode;
    this.mtime = mtime;
  }
  set mode(mode) {
    if (mode == null) {
      this._mode = this.isDirectory() ? DEFAULT_DIRECTORY_MODE : DEFAULT_FILE_MODE;
    } else {
      this._mode = mode & 4095;
    }
  }
  get mode() {
    return this._mode;
  }
  isDirectory() {
    return dirTypes.includes(this.type);
  }
  addBlockSize(size) {
    this.blockSizes.push(size);
  }
  removeBlockSize(index) {
    this.blockSizes.splice(index, 1);
  }
  /**
   * Returns `0n` for directories or `data.length + sum(blockSizes)` for everything else
   */
  fileSize() {
    if (this.isDirectory()) {
      return 0n;
    }
    let sum = 0n;
    this.blockSizes.forEach((size) => {
      sum += size;
    });
    if (this.data != null) {
      sum += BigInt(this.data.length);
    }
    return sum;
  }
  /**
   * encode to protobuf Uint8Array
   */
  marshal() {
    let type;
    switch (this.type) {
      case "raw":
        type = Data.DataType.Raw;
        break;
      case "directory":
        type = Data.DataType.Directory;
        break;
      case "file":
        type = Data.DataType.File;
        break;
      case "metadata":
        type = Data.DataType.Metadata;
        break;
      case "symlink":
        type = Data.DataType.Symlink;
        break;
      case "hamt-sharded-directory":
        type = Data.DataType.HAMTShard;
        break;
      default:
        throw (0, import_err_code.default)(new Error(`Type: ${type} is not valid`), "ERR_INVALID_TYPE");
    }
    let data = this.data;
    if (this.data == null || this.data.length === 0) {
      data = void 0;
    }
    let mode;
    if (this.mode != null) {
      mode = this._originalMode & 4294963200 | (this.mode ?? 0);
      if (mode === DEFAULT_FILE_MODE && !this.isDirectory()) {
        mode = void 0;
      }
      if (mode === DEFAULT_DIRECTORY_MODE && this.isDirectory()) {
        mode = void 0;
      }
    }
    let mtime;
    if (this.mtime != null) {
      mtime = {
        Seconds: this.mtime.secs,
        FractionalNanoseconds: this.mtime.nsecs
      };
    }
    return Data.encode({
      Type: type,
      Data: data,
      filesize: this.isDirectory() ? void 0 : this.fileSize(),
      blocksizes: this.blockSizes,
      hashType: this.hashType,
      fanout: this.fanout,
      mode,
      mtime
    });
  }
};

// node_modules/progress-events/dist/src/index.js
var CustomProgressEvent = class extends Event {
  constructor(type, detail) {
    super(type);
    this.detail = detail;
  }
};

// node_modules/ipfs-unixfs-importer/dist/src/utils/persist.js
var persist = async (buffer2, blockstore, options) => {
  if (options.codec == null) {
    options.codec = src_exports2;
  }
  const multihash = await sha256.digest(buffer2);
  const cid = CID2.create(options.cidVersion, options.codec.code, multihash);
  await blockstore.put(cid, buffer2, options);
  return cid;
};

// node_modules/ipfs-unixfs-importer/dist/src/dag-builder/buffer-importer.js
function defaultBufferImporter(options) {
  return async function* bufferImporter(file, blockstore) {
    let bytesWritten = 0n;
    for await (let block of file.content) {
      yield async () => {
        var _a;
        let unixfs2;
        const opts = {
          codec: src_exports2,
          cidVersion: options.cidVersion,
          onProgress: options.onProgress
        };
        if (options.rawLeaves) {
          opts.codec = raw_exports;
          opts.cidVersion = 1;
        } else {
          unixfs2 = new UnixFS({
            type: options.leafType,
            data: block
          });
          block = encode7({
            Data: unixfs2.marshal(),
            Links: []
          });
        }
        const cid = await persist(block, blockstore, opts);
        bytesWritten += BigInt(block.byteLength);
        (_a = options.onProgress) == null ? void 0 : _a.call(options, new CustomProgressEvent("unixfs:importer:progress:file:write", {
          bytesWritten,
          cid,
          path: file.path
        }));
        return {
          cid,
          unixfs: unixfs2,
          size: BigInt(block.length),
          block
        };
      };
    }
  };
}

// node_modules/ipfs-unixfs-importer/dist/src/dag-builder/index.js
var import_err_code2 = __toESM(require_err_code(), 1);

// node_modules/ipfs-unixfs-importer/dist/src/dag-builder/dir.js
var dirBuilder = async (dir, blockstore, options) => {
  const unixfs2 = new UnixFS({
    type: "directory",
    mtime: dir.mtime,
    mode: dir.mode
  });
  const block = encode7(prepare({ Data: unixfs2.marshal() }));
  const cid = await persist(block, blockstore, options);
  const path6 = dir.path;
  return {
    cid,
    path: path6,
    unixfs: unixfs2,
    size: BigInt(block.length),
    originalPath: dir.originalPath,
    block
  };
};

// node_modules/ipfs-unixfs-importer/dist/src/dag-builder/file.js
async function* buildFileBatch(file, blockstore, options) {
  let count = -1;
  let previous;
  for await (const entry of parallelBatch(options.bufferImporter(file, blockstore), options.blockWriteConcurrency)) {
    count++;
    if (count === 0) {
      previous = {
        ...entry,
        single: true
      };
      continue;
    } else if (count === 1 && previous != null) {
      yield {
        ...previous,
        block: void 0,
        single: void 0
      };
      previous = void 0;
    }
    yield {
      ...entry,
      block: void 0
    };
  }
  if (previous != null) {
    yield previous;
  }
}
function isSingleBlockImport(result) {
  return result.single === true;
}
var reduce = (file, blockstore, options) => {
  const reducer = async function(leaves) {
    var _a, _b;
    if (leaves.length === 1 && isSingleBlockImport(leaves[0]) && options.reduceSingleLeafToSelf) {
      const leaf = leaves[0];
      let node2 = leaf.block;
      if (isSingleBlockImport(leaf) && (file.mtime !== void 0 || file.mode !== void 0)) {
        leaf.unixfs = new UnixFS({
          type: "file",
          mtime: file.mtime,
          mode: file.mode,
          data: leaf.block
        });
        node2 = { Data: leaf.unixfs.marshal(), Links: [] };
        leaf.block = encode7(prepare(node2));
        leaf.cid = await persist(leaf.block, blockstore, {
          ...options,
          cidVersion: options.cidVersion
        });
        leaf.size = BigInt(leaf.block.length);
      }
      (_a = options.onProgress) == null ? void 0 : _a.call(options, new CustomProgressEvent("unixfs:importer:progress:file:layout", {
        cid: leaf.cid,
        path: leaf.originalPath
      }));
      return {
        cid: leaf.cid,
        path: file.path,
        unixfs: leaf.unixfs,
        size: leaf.size,
        originalPath: leaf.originalPath
      };
    }
    const f = new UnixFS({
      type: "file",
      mtime: file.mtime,
      mode: file.mode
    });
    const links = leaves.filter((leaf) => {
      var _a2, _b2;
      if (leaf.cid.code === code3 && leaf.size > 0) {
        return true;
      }
      if (leaf.unixfs != null && leaf.unixfs.data == null && leaf.unixfs.fileSize() > 0n) {
        return true;
      }
      return Boolean((_b2 = (_a2 = leaf.unixfs) == null ? void 0 : _a2.data) == null ? void 0 : _b2.length);
    }).map((leaf) => {
      var _a2;
      if (leaf.cid.code === code3) {
        f.addBlockSize(leaf.size);
        return {
          Name: "",
          Tsize: Number(leaf.size),
          Hash: leaf.cid
        };
      }
      if (leaf.unixfs == null || leaf.unixfs.data == null) {
        f.addBlockSize(((_a2 = leaf.unixfs) == null ? void 0 : _a2.fileSize()) ?? 0n);
      } else {
        f.addBlockSize(BigInt(leaf.unixfs.data.length));
      }
      return {
        Name: "",
        Tsize: Number(leaf.size),
        Hash: leaf.cid
      };
    });
    const node = {
      Data: f.marshal(),
      Links: links
    };
    const block = encode7(prepare(node));
    const cid = await persist(block, blockstore, options);
    (_b = options.onProgress) == null ? void 0 : _b.call(options, new CustomProgressEvent("unixfs:importer:progress:file:layout", {
      cid,
      path: file.originalPath
    }));
    return {
      cid,
      path: file.path,
      unixfs: f,
      size: BigInt(block.length + node.Links.reduce((acc, curr) => acc + (curr.Tsize ?? 0), 0)),
      originalPath: file.originalPath,
      block
    };
  };
  return reducer;
};
var fileBuilder = async (file, block, options) => {
  return options.layout(buildFileBatch(file, block, options), reduce(file, block, options));
};

// node_modules/ipfs-unixfs-importer/dist/src/dag-builder/index.js
function isIterable(thing) {
  return Symbol.iterator in thing;
}
function isAsyncIterable5(thing) {
  return Symbol.asyncIterator in thing;
}
function contentAsAsyncIterable(content) {
  try {
    if (content instanceof Uint8Array) {
      return async function* () {
        yield content;
      }();
    } else if (isIterable(content)) {
      return async function* () {
        yield* content;
      }();
    } else if (isAsyncIterable5(content)) {
      return content;
    }
  } catch {
    throw (0, import_err_code2.default)(new Error("Content was invalid"), "ERR_INVALID_CONTENT");
  }
  throw (0, import_err_code2.default)(new Error("Content was invalid"), "ERR_INVALID_CONTENT");
}
function defaultDagBuilder(options) {
  return async function* dagBuilder(source, blockstore) {
    for await (const entry of source) {
      let originalPath;
      if (entry.path != null) {
        originalPath = entry.path;
        entry.path = entry.path.split("/").filter((path6) => path6 != null && path6 !== ".").join("/");
      }
      if (isFileCandidate(entry)) {
        const file = {
          path: entry.path,
          mtime: entry.mtime,
          mode: entry.mode,
          content: async function* () {
            var _a;
            let bytesRead = 0n;
            for await (const chunk of options.chunker(options.chunkValidator(contentAsAsyncIterable(entry.content)))) {
              const currentChunkSize = BigInt(chunk.byteLength);
              bytesRead += currentChunkSize;
              (_a = options.onProgress) == null ? void 0 : _a.call(options, new CustomProgressEvent("unixfs:importer:progress:file:read", {
                bytesRead,
                chunkSize: currentChunkSize,
                path: entry.path
              }));
              yield chunk;
            }
          }(),
          originalPath
        };
        yield async () => fileBuilder(file, blockstore, options);
      } else if (entry.path != null) {
        const dir = {
          path: entry.path,
          mtime: entry.mtime,
          mode: entry.mode,
          originalPath
        };
        yield async () => dirBuilder(dir, blockstore, options);
      } else {
        throw new Error("Import candidate must have content or path or both");
      }
    }
  };
}
function isFileCandidate(entry) {
  return entry.content != null;
}

// node_modules/ipfs-unixfs-importer/dist/src/dag-builder/validate-chunks.js
var import_err_code3 = __toESM(require_err_code(), 1);
var defaultChunkValidator = () => {
  return async function* validateChunks(source) {
    for await (const content of source) {
      if (content.length === void 0) {
        throw (0, import_err_code3.default)(new Error("Content was invalid"), "ERR_INVALID_CONTENT");
      }
      if (typeof content === "string" || content instanceof String) {
        yield fromString3(content.toString());
      } else if (Array.isArray(content)) {
        yield Uint8Array.from(content);
      } else if (content instanceof Uint8Array) {
        yield content;
      } else {
        throw (0, import_err_code3.default)(new Error("Content was invalid"), "ERR_INVALID_CONTENT");
      }
    }
  };
};

// node_modules/ipfs-unixfs-importer/dist/src/layout/balanced.js
var DEFAULT_MAX_CHILDREN_PER_NODE = 174;
function balanced(options) {
  const maxChildrenPerNode = (options == null ? void 0 : options.maxChildrenPerNode) ?? DEFAULT_MAX_CHILDREN_PER_NODE;
  return async function balancedLayout(source, reduce2) {
    const roots = [];
    for await (const chunked of src_default5(source, maxChildrenPerNode)) {
      roots.push(await reduce2(chunked));
    }
    if (roots.length > 1) {
      return balancedLayout(roots, reduce2);
    }
    return roots[0];
  };
}

// node_modules/ipfs-unixfs-importer/dist/src/dir.js
var Dir = class {
  options;
  root;
  dir;
  path;
  dirty;
  flat;
  parent;
  parentKey;
  unixfs;
  mode;
  mtime;
  cid;
  size;
  nodeSize;
  constructor(props, options) {
    this.options = options ?? {};
    this.root = props.root;
    this.dir = props.dir;
    this.path = props.path;
    this.dirty = props.dirty;
    this.flat = props.flat;
    this.parent = props.parent;
    this.parentKey = props.parentKey;
    this.unixfs = props.unixfs;
    this.mode = props.mode;
    this.mtime = props.mtime;
  }
};
var CID_V0 = CID2.parse("QmUNLLsPACCz1vLxQVkXqqLX5R1X345qqfHbsf67hvA3Nn");
var CID_V1 = CID2.parse("zdj7WbTaiJT1fgatdet9Ei9iDB5hdCxkbVyhyh8YTUnXMiwYi");

// node_modules/ipfs-unixfs-importer/dist/src/dir-flat.js
var DirFlat = class extends Dir {
  _children;
  constructor(props, options) {
    super(props, options);
    this._children = /* @__PURE__ */ new Map();
  }
  async put(name4, value) {
    this.cid = void 0;
    this.size = void 0;
    this.nodeSize = void 0;
    this._children.set(name4, value);
  }
  async get(name4) {
    return Promise.resolve(this._children.get(name4));
  }
  childCount() {
    return this._children.size;
  }
  directChildrenCount() {
    return this.childCount();
  }
  onlyChild() {
    return this._children.values().next().value;
  }
  async *eachChildSeries() {
    for (const [key, child] of this._children.entries()) {
      yield {
        key,
        child
      };
    }
  }
  estimateNodeSize() {
    if (this.nodeSize !== void 0) {
      return this.nodeSize;
    }
    this.nodeSize = 0;
    for (const [name4, child] of this._children.entries()) {
      if (child.size != null && child.cid != null) {
        this.nodeSize += name4.length + (this.options.cidVersion === 1 ? CID_V1.bytes.byteLength : CID_V0.bytes.byteLength);
      }
    }
    return this.nodeSize;
  }
  async *flush(block) {
    const links = [];
    for (const [name4, child] of this._children.entries()) {
      let result = child;
      if (child instanceof Dir) {
        for await (const entry of child.flush(block)) {
          result = entry;
          yield entry;
        }
      }
      if (result.size != null && result.cid != null) {
        links.push({
          Name: name4,
          Tsize: Number(result.size),
          Hash: result.cid
        });
      }
    }
    const unixfs2 = new UnixFS({
      type: "directory",
      mtime: this.mtime,
      mode: this.mode
    });
    const node = { Data: unixfs2.marshal(), Links: links };
    const buffer2 = encode7(prepare(node));
    const cid = await persist(buffer2, block, this.options);
    const size = buffer2.length + node.Links.reduce(
      /**
       * @param {number} acc
       * @param {PBLink} curr
       */
      (acc, curr) => acc + (curr.Tsize == null ? 0 : curr.Tsize),
      0
    );
    this.cid = cid;
    this.size = size;
    yield {
      cid,
      unixfs: unixfs2,
      path: this.path,
      size: BigInt(size)
    };
  }
};

// node_modules/@multiformats/murmur3/src/index.js
var import_murmurhash3js_revisited = __toESM(require_murmurhash3js_revisited(), 1);
function fromNumberTo32BitBuf(number) {
  const bytes = new Array(4);
  for (let i = 0; i < 4; i++) {
    bytes[i] = number & 255;
    number = number >> 8;
  }
  return new Uint8Array(bytes);
}
var murmur332 = from3({
  name: "murmur3-32",
  code: 35,
  encode: (input) => fromNumberTo32BitBuf(import_murmurhash3js_revisited.default.x86.hash32(input))
});
var murmur3128 = from3({
  name: "murmur3-128",
  code: 34,
  encode: (input) => bytes_exports2.fromHex(import_murmurhash3js_revisited.default.x64.hash128(input))
});
var murmur364 = from3({
  name: "murmur3-x64-64",
  code: 34,
  encode: (input) => bytes_exports2.fromHex(import_murmurhash3js_revisited.default.x64.hash128(input)).subarray(0, 8)
});

// node_modules/hamt-sharding/dist/src/bucket.js
var import_sparse_array = __toESM(require_sparse_array(), 1);
var Bucket = class _Bucket {
  constructor(options, parent, posAtParent = 0) {
    this._options = options;
    this._popCount = 0;
    this._parent = parent;
    this._posAtParent = posAtParent;
    this._children = new import_sparse_array.default();
    this.key = null;
  }
  async put(key, value) {
    const place = await this._findNewBucketAndPos(key);
    await place.bucket._putAt(place, key, value);
  }
  async get(key) {
    const child = await this._findChild(key);
    if (child != null) {
      return child.value;
    }
  }
  async del(key) {
    const place = await this._findPlace(key);
    const child = place.bucket._at(place.pos);
    if (child != null && child.key === key) {
      place.bucket._delAt(place.pos);
    }
  }
  leafCount() {
    const children = this._children.compactArray();
    return children.reduce((acc, child) => {
      if (child instanceof _Bucket) {
        return acc + child.leafCount();
      }
      return acc + 1;
    }, 0);
  }
  childrenCount() {
    return this._children.length;
  }
  onlyChild() {
    return this._children.get(0);
  }
  *eachLeafSeries() {
    const children = this._children.compactArray();
    for (const child of children) {
      if (child instanceof _Bucket) {
        yield* child.eachLeafSeries();
      } else {
        yield child;
      }
    }
  }
  serialize(map2, reduce2) {
    const acc = [];
    return reduce2(this._children.reduce((acc2, child, index) => {
      if (child != null) {
        if (child instanceof _Bucket) {
          acc2.push(child.serialize(map2, reduce2));
        } else {
          acc2.push(map2(child, index));
        }
      }
      return acc2;
    }, acc));
  }
  async asyncTransform(asyncMap, asyncReduce) {
    return await asyncTransformBucket(this, asyncMap, asyncReduce);
  }
  toJSON() {
    return this.serialize(mapNode, reduceNodes);
  }
  prettyPrint() {
    return JSON.stringify(this.toJSON(), null, "  ");
  }
  tableSize() {
    return Math.pow(2, this._options.bits);
  }
  async _findChild(key) {
    const result = await this._findPlace(key);
    const child = result.bucket._at(result.pos);
    if (child instanceof _Bucket) {
      return void 0;
    }
    if (child != null && child.key === key) {
      return child;
    }
  }
  async _findPlace(key) {
    const hashValue = this._options.hash(typeof key === "string" ? fromString3(key) : key);
    const index = await hashValue.take(this._options.bits);
    const child = this._children.get(index);
    if (child instanceof _Bucket) {
      return await child._findPlace(hashValue);
    }
    return {
      bucket: this,
      pos: index,
      hash: hashValue,
      existingChild: child
    };
  }
  async _findNewBucketAndPos(key) {
    const place = await this._findPlace(key);
    if (place.existingChild != null && place.existingChild.key !== key) {
      const bucket = new _Bucket(this._options, place.bucket, place.pos);
      place.bucket._putObjectAt(place.pos, bucket);
      const newPlace = await bucket._findPlace(place.existingChild.hash);
      newPlace.bucket._putAt(newPlace, place.existingChild.key, place.existingChild.value);
      return await bucket._findNewBucketAndPos(place.hash);
    }
    return place;
  }
  _putAt(place, key, value) {
    this._putObjectAt(place.pos, {
      key,
      value,
      hash: place.hash
    });
  }
  _putObjectAt(pos, object) {
    if (this._children.get(pos) == null) {
      this._popCount++;
    }
    this._children.set(pos, object);
  }
  _delAt(pos) {
    if (pos === -1) {
      throw new Error("Invalid position");
    }
    if (this._children.get(pos) != null) {
      this._popCount--;
    }
    this._children.unset(pos);
    this._level();
  }
  _level() {
    if (this._parent != null && this._popCount <= 1) {
      if (this._popCount === 1) {
        const onlyChild = this._children.find(exists);
        if (onlyChild != null && !(onlyChild instanceof _Bucket)) {
          const hash = onlyChild.hash;
          hash.untake(this._options.bits);
          const place = {
            pos: this._posAtParent,
            hash,
            bucket: this._parent
          };
          this._parent._putAt(place, onlyChild.key, onlyChild.value);
        }
      } else {
        this._parent._delAt(this._posAtParent);
      }
    }
  }
  _at(index) {
    return this._children.get(index);
  }
};
function exists(o) {
  return Boolean(o);
}
function mapNode(node, _) {
  return node.key;
}
function reduceNodes(nodes) {
  return nodes;
}
async function asyncTransformBucket(bucket, asyncMap, asyncReduce) {
  const output = [];
  for (const child of bucket._children.compactArray()) {
    if (child instanceof Bucket) {
      await asyncTransformBucket(child, asyncMap, asyncReduce);
    } else {
      const mappedChildren = await asyncMap(child);
      output.push({
        bitField: bucket._children.bitField(),
        children: mappedChildren
      });
    }
  }
  return await asyncReduce(output);
}

// node_modules/hamt-sharding/dist/src/consumable-buffer.js
var START_MASKS = [
  255,
  254,
  252,
  248,
  240,
  224,
  192,
  128
];
var STOP_MASKS = [
  1,
  3,
  7,
  15,
  31,
  63,
  127,
  255
];
var ConsumableBuffer = class {
  constructor(value) {
    this._value = value;
    this._currentBytePos = value.length - 1;
    this._currentBitPos = 7;
  }
  availableBits() {
    return this._currentBitPos + 1 + this._currentBytePos * 8;
  }
  totalBits() {
    return this._value.length * 8;
  }
  take(bits) {
    let pendingBits = bits;
    let result = 0;
    while (pendingBits > 0 && this._haveBits()) {
      const byte = this._value[this._currentBytePos];
      const availableBits = this._currentBitPos + 1;
      const taking = Math.min(availableBits, pendingBits);
      const value = byteBitsToInt(byte, availableBits - taking, taking);
      result = (result << taking) + value;
      pendingBits -= taking;
      this._currentBitPos -= taking;
      if (this._currentBitPos < 0) {
        this._currentBitPos = 7;
        this._currentBytePos--;
      }
    }
    return result;
  }
  untake(bits) {
    this._currentBitPos += bits;
    while (this._currentBitPos > 7) {
      this._currentBitPos -= 8;
      this._currentBytePos += 1;
    }
  }
  _haveBits() {
    return this._currentBytePos >= 0;
  }
};
function byteBitsToInt(byte, start, length4) {
  const mask = maskFor(start, length4);
  return (byte & mask) >>> start;
}
function maskFor(start, length4) {
  return START_MASKS[start] & STOP_MASKS[Math.min(length4 + start - 1, 7)];
}

// node_modules/hamt-sharding/dist/src/consumable-hash.js
function wrapHash(hashFn2) {
  function hashing(value) {
    if (value instanceof InfiniteHash) {
      return value;
    } else {
      return new InfiniteHash(value, hashFn2);
    }
  }
  return hashing;
}
var InfiniteHash = class {
  constructor(value, hashFn2) {
    if (!(value instanceof Uint8Array)) {
      throw new Error("can only hash Uint8Arrays");
    }
    this._value = value;
    this._hashFn = hashFn2;
    this._depth = -1;
    this._availableBits = 0;
    this._currentBufferIndex = 0;
    this._buffers = [];
  }
  async take(bits) {
    let pendingBits = bits;
    while (this._availableBits < pendingBits) {
      await this._produceMoreBits();
    }
    let result = 0;
    while (pendingBits > 0) {
      const hash = this._buffers[this._currentBufferIndex];
      const available = Math.min(hash.availableBits(), pendingBits);
      const took = hash.take(available);
      result = (result << available) + took;
      pendingBits -= available;
      this._availableBits -= available;
      if (hash.availableBits() === 0) {
        this._currentBufferIndex++;
      }
    }
    return result;
  }
  untake(bits) {
    let pendingBits = bits;
    while (pendingBits > 0) {
      const hash = this._buffers[this._currentBufferIndex];
      const availableForUntake = Math.min(hash.totalBits() - hash.availableBits(), pendingBits);
      hash.untake(availableForUntake);
      pendingBits -= availableForUntake;
      this._availableBits += availableForUntake;
      if (this._currentBufferIndex > 0 && hash.totalBits() === hash.availableBits()) {
        this._depth--;
        this._currentBufferIndex--;
      }
    }
  }
  async _produceMoreBits() {
    this._depth++;
    const value = this._depth > 0 ? concat2([this._value, Uint8Array.from([this._depth])]) : this._value;
    const hashValue = await this._hashFn(value);
    const buffer2 = new ConsumableBuffer(hashValue);
    this._buffers.push(buffer2);
    this._availableBits += buffer2.availableBits();
  }
};

// node_modules/hamt-sharding/dist/src/index.js
function createHAMT(options) {
  if (options == null || options.hashFn == null) {
    throw new Error("please define an options.hashFn");
  }
  const bucketOptions = {
    bits: options.bits ?? 8,
    hash: wrapHash(options.hashFn)
  };
  return new Bucket(bucketOptions);
}

// node_modules/ipfs-unixfs-importer/dist/src/dir-sharded.js
async function hamtHashFn(buf2) {
  return (await murmur3128.encode(buf2)).slice(0, 8).reverse();
}
var HAMT_HASH_CODE = BigInt(34);
var DEFAULT_FANOUT_BITS = 8;
var DirSharded = class extends Dir {
  _bucket;
  constructor(props, options) {
    super(props, options);
    this._bucket = createHAMT({
      hashFn: hamtHashFn,
      bits: options.shardFanoutBits ?? DEFAULT_FANOUT_BITS
    });
  }
  async put(name4, value) {
    this.cid = void 0;
    this.size = void 0;
    this.nodeSize = void 0;
    await this._bucket.put(name4, value);
  }
  async get(name4) {
    return this._bucket.get(name4);
  }
  childCount() {
    return this._bucket.leafCount();
  }
  directChildrenCount() {
    return this._bucket.childrenCount();
  }
  onlyChild() {
    return this._bucket.onlyChild();
  }
  async *eachChildSeries() {
    for await (const { key, value } of this._bucket.eachLeafSeries()) {
      yield {
        key,
        child: value
      };
    }
  }
  estimateNodeSize() {
    if (this.nodeSize !== void 0) {
      return this.nodeSize;
    }
    this.nodeSize = calculateSize(this._bucket, this, this.options);
    return this.nodeSize;
  }
  async *flush(blockstore) {
    for await (const entry of flush(this._bucket, blockstore, this, this.options)) {
      yield {
        ...entry,
        path: this.path
      };
    }
  }
};
var dir_sharded_default = DirSharded;
async function* flush(bucket, blockstore, shardRoot, options) {
  const children = bucket._children;
  const padLength = (bucket.tableSize() - 1).toString(16).length;
  const links = [];
  let childrenSize = 0n;
  for (let i = 0; i < children.length; i++) {
    const child = children.get(i);
    if (child == null) {
      continue;
    }
    const labelPrefix = i.toString(16).toUpperCase().padStart(padLength, "0");
    if (child instanceof Bucket) {
      let shard;
      for await (const subShard of flush(child, blockstore, null, options)) {
        shard = subShard;
      }
      if (shard == null) {
        throw new Error("Could not flush sharded directory, no subshard found");
      }
      links.push({
        Name: labelPrefix,
        Tsize: Number(shard.size),
        Hash: shard.cid
      });
      childrenSize += shard.size;
    } else if (isDir(child.value)) {
      const dir2 = child.value;
      let flushedDir;
      for await (const entry of dir2.flush(blockstore)) {
        flushedDir = entry;
        yield flushedDir;
      }
      if (flushedDir == null) {
        throw new Error("Did not flush dir");
      }
      const label = labelPrefix + child.key;
      links.push({
        Name: label,
        Tsize: Number(flushedDir.size),
        Hash: flushedDir.cid
      });
      childrenSize += flushedDir.size;
    } else {
      const value = child.value;
      if (value.cid == null) {
        continue;
      }
      const label = labelPrefix + child.key;
      const size2 = value.size;
      links.push({
        Name: label,
        Tsize: Number(size2),
        Hash: value.cid
      });
      childrenSize += BigInt(size2 ?? 0);
    }
  }
  const data = Uint8Array.from(children.bitField().reverse());
  const dir = new UnixFS({
    type: "hamt-sharded-directory",
    data,
    fanout: BigInt(bucket.tableSize()),
    hashType: HAMT_HASH_CODE,
    mtime: shardRoot == null ? void 0 : shardRoot.mtime,
    mode: shardRoot == null ? void 0 : shardRoot.mode
  });
  const node = {
    Data: dir.marshal(),
    Links: links
  };
  const buffer2 = encode7(prepare(node));
  const cid = await persist(buffer2, blockstore, options);
  const size = BigInt(buffer2.byteLength) + childrenSize;
  yield {
    cid,
    unixfs: dir,
    size
  };
}
function isDir(obj) {
  return typeof obj.flush === "function";
}
function calculateSize(bucket, shardRoot, options) {
  const children = bucket._children;
  const padLength = (bucket.tableSize() - 1).toString(16).length;
  const links = [];
  for (let i = 0; i < children.length; i++) {
    const child = children.get(i);
    if (child == null) {
      continue;
    }
    const labelPrefix = i.toString(16).toUpperCase().padStart(padLength, "0");
    if (child instanceof Bucket) {
      const size = calculateSize(child, null, options);
      links.push({
        Name: labelPrefix,
        Tsize: Number(size),
        Hash: options.cidVersion === 0 ? CID_V0 : CID_V1
      });
    } else if (typeof child.value.flush === "function") {
      const dir2 = child.value;
      const size = dir2.nodeSize();
      links.push({
        Name: labelPrefix + child.key,
        Tsize: Number(size),
        Hash: options.cidVersion === 0 ? CID_V0 : CID_V1
      });
    } else {
      const value = child.value;
      if (value.cid == null) {
        continue;
      }
      const label = labelPrefix + child.key;
      const size = value.size;
      links.push({
        Name: label,
        Tsize: Number(size),
        Hash: value.cid
      });
    }
  }
  const data = Uint8Array.from(children.bitField().reverse());
  const dir = new UnixFS({
    type: "hamt-sharded-directory",
    data,
    fanout: BigInt(bucket.tableSize()),
    hashType: HAMT_HASH_CODE,
    mtime: shardRoot == null ? void 0 : shardRoot.mtime,
    mode: shardRoot == null ? void 0 : shardRoot.mode
  });
  const buffer2 = encode7(prepare({
    Data: dir.marshal(),
    Links: links
  }));
  return buffer2.length;
}

// node_modules/ipfs-unixfs-importer/dist/src/flat-to-shard.js
async function flatToShard(child, dir, threshold, options) {
  let newDir = dir;
  if (dir instanceof DirFlat && dir.estimateNodeSize() > threshold) {
    newDir = await convertToShard(dir, options);
  }
  const parent = newDir.parent;
  if (parent != null) {
    if (newDir !== dir) {
      if (child != null) {
        child.parent = newDir;
      }
      if (newDir.parentKey == null) {
        throw new Error("No parent key found");
      }
      await parent.put(newDir.parentKey, newDir);
    }
    return flatToShard(newDir, parent, threshold, options);
  }
  return newDir;
}
async function convertToShard(oldDir, options) {
  const newDir = new dir_sharded_default({
    root: oldDir.root,
    dir: true,
    parent: oldDir.parent,
    parentKey: oldDir.parentKey,
    path: oldDir.path,
    dirty: oldDir.dirty,
    flat: false,
    mtime: oldDir.mtime,
    mode: oldDir.mode
  }, options);
  for await (const { key, child } of oldDir.eachChildSeries()) {
    await newDir.put(key, child);
  }
  return newDir;
}

// node_modules/ipfs-unixfs-importer/dist/src/utils/to-path-components.js
var toPathComponents = (path6 = "") => {
  return path6.split(/(?<!\\)\//).filter(Boolean);
};

// node_modules/ipfs-unixfs-importer/dist/src/tree-builder.js
async function addToTree(elem, tree, options) {
  var _a, _b;
  const pathElems = toPathComponents(elem.path ?? "");
  const lastIndex = pathElems.length - 1;
  let parent = tree;
  let currentPath = "";
  for (let i = 0; i < pathElems.length; i++) {
    const pathElem = pathElems[i];
    currentPath += `${currentPath !== "" ? "/" : ""}${pathElem}`;
    const last2 = i === lastIndex;
    parent.dirty = true;
    parent.cid = void 0;
    parent.size = void 0;
    if (last2) {
      await parent.put(pathElem, elem);
      tree = await flatToShard(null, parent, options.shardSplitThresholdBytes, options);
    } else {
      let dir = await parent.get(pathElem);
      if (dir == null || !(dir instanceof Dir)) {
        dir = new DirFlat({
          root: false,
          dir: true,
          parent,
          parentKey: pathElem,
          path: currentPath,
          dirty: true,
          flat: true,
          mtime: (_a = dir == null ? void 0 : dir.unixfs) == null ? void 0 : _a.mtime,
          mode: (_b = dir == null ? void 0 : dir.unixfs) == null ? void 0 : _b.mode
        }, options);
      }
      await parent.put(pathElem, dir);
      parent = dir;
    }
  }
  return tree;
}
async function* flushAndYield(tree, blockstore) {
  var _a;
  if (!(tree instanceof Dir)) {
    if (((_a = tree.unixfs) == null ? void 0 : _a.isDirectory()) === true) {
      yield tree;
    }
    return;
  }
  yield* tree.flush(blockstore);
}
function defaultTreeBuilder(options) {
  return async function* treeBuilder(source, block) {
    let tree = new DirFlat({
      root: true,
      dir: true,
      path: "",
      dirty: true,
      flat: true
    }, options);
    let rootDir;
    let singleRoot = false;
    for await (const entry of source) {
      if (entry == null) {
        continue;
      }
      const dir = `${entry.originalPath ?? ""}`.split("/")[0];
      if (dir != null && dir !== "") {
        if (rootDir == null) {
          rootDir = dir;
          singleRoot = true;
        } else if (rootDir !== dir) {
          singleRoot = false;
        }
      }
      tree = await addToTree(entry, tree, options);
      if (entry.unixfs == null || !entry.unixfs.isDirectory()) {
        yield entry;
      }
    }
    if (options.wrapWithDirectory || singleRoot && tree.childCount() > 1) {
      yield* flushAndYield(tree, block);
    } else {
      for await (const unwrapped of tree.eachChildSeries()) {
        if (unwrapped == null) {
          continue;
        }
        yield* flushAndYield(unwrapped.child, block);
      }
    }
  };
}

// node_modules/ipfs-unixfs-importer/dist/src/index.js
async function* importer(source, blockstore, options = {}) {
  let candidates;
  if (Symbol.asyncIterator in source || Symbol.iterator in source) {
    candidates = source;
  } else {
    candidates = [source];
  }
  const wrapWithDirectory = options.wrapWithDirectory ?? false;
  const shardSplitThresholdBytes = options.shardSplitThresholdBytes ?? 262144;
  const shardFanoutBits = options.shardFanoutBits ?? 8;
  const cidVersion = options.cidVersion ?? 1;
  const rawLeaves = options.rawLeaves ?? true;
  const leafType = options.leafType ?? "file";
  const fileImportConcurrency = options.fileImportConcurrency ?? 50;
  const blockWriteConcurrency = options.blockWriteConcurrency ?? 10;
  const reduceSingleLeafToSelf = options.reduceSingleLeafToSelf ?? true;
  const chunker = options.chunker ?? fixedSize();
  const chunkValidator = options.chunkValidator ?? defaultChunkValidator();
  const buildDag = options.dagBuilder ?? defaultDagBuilder({
    chunker,
    chunkValidator,
    wrapWithDirectory,
    layout: options.layout ?? balanced(),
    bufferImporter: options.bufferImporter ?? defaultBufferImporter({
      cidVersion,
      rawLeaves,
      leafType,
      onProgress: options.onProgress
    }),
    blockWriteConcurrency,
    reduceSingleLeafToSelf,
    cidVersion,
    onProgress: options.onProgress
  });
  const buildTree = options.treeBuilder ?? defaultTreeBuilder({
    wrapWithDirectory,
    shardSplitThresholdBytes,
    shardFanoutBits,
    cidVersion,
    onProgress: options.onProgress
  });
  for await (const entry of buildTree(parallelBatch(buildDag(candidates, blockstore), fileImportConcurrency), blockstore)) {
    yield {
      cid: entry.cid,
      path: entry.path,
      unixfs: entry.unixfs,
      size: entry.size
    };
  }
}
async function importFile(content, blockstore, options = {}) {
  const result = await src_default4(importer([content], blockstore, options));
  if (result == null) {
    throw (0, import_err_code4.default)(new Error("Nothing imported"), "ERR_INVALID_PARAMS");
  }
  return result;
}
async function importDirectory(content, blockstore, options = {}) {
  const result = await src_default4(importer([content], blockstore, options));
  if (result == null) {
    throw (0, import_err_code4.default)(new Error("Nothing imported"), "ERR_INVALID_PARAMS");
  }
  return result;
}
async function importBytes(buf2, blockstore, options = {}) {
  return importFile({
    content: buf2
  }, blockstore, options);
}
async function importByteStream(bufs, blockstore, options = {}) {
  return importFile({
    content: bufs
  }, blockstore, options);
}

// node_modules/ipfs-unixfs-importer/dist/src/chunker/rabin.js
var import_err_code5 = __toESM(require_err_code(), 1);
var import_rabin_wasm = __toESM(require_src(), 1);

// node_modules/@helia/unixfs/dist/src/commands/add.js
var defaultImporterSettings = {
  cidVersion: 1,
  rawLeaves: true,
  layout: balanced({
    maxChildrenPerNode: 1024
  }),
  chunker: fixedSize({
    chunkSize: 1048576
  })
};
async function* addAll(source, blockstore, options = {}) {
  yield* importer(source, blockstore, {
    ...defaultImporterSettings,
    ...options
  });
}
async function addBytes(bytes, blockstore, options = {}) {
  const { cid } = await importBytes(bytes, blockstore, {
    ...defaultImporterSettings,
    ...options
  });
  return cid;
}
async function addByteStream(bytes, blockstore, options = {}) {
  const { cid } = await importByteStream(bytes, blockstore, {
    ...defaultImporterSettings,
    ...options
  });
  return cid;
}
async function addFile(file, blockstore, options = {}) {
  const { cid } = await importFile(file, blockstore, {
    ...defaultImporterSettings,
    ...options
  });
  return cid;
}
async function addDirectory(dir, blockstore, options = {}) {
  const { cid } = await importDirectory({
    ...dir,
    path: dir.path ?? "-"
  }, blockstore, {
    ...defaultImporterSettings,
    ...options
  });
  return cid;
}

// node_modules/ipfs-unixfs-exporter/dist/src/index.js
var import_err_code15 = __toESM(require_err_code(), 1);

// node_modules/it-last/dist/src/index.js
function isAsyncIterable6(thing) {
  return thing[Symbol.asyncIterator] != null;
}
function last(source) {
  if (isAsyncIterable6(source)) {
    return (async () => {
      let res2;
      for await (const entry of source) {
        res2 = entry;
      }
      return res2;
    })();
  }
  let res;
  for (const entry of source) {
    res = entry;
  }
  return res;
}
var src_default7 = last;

// node_modules/ipfs-unixfs-exporter/dist/src/resolvers/index.js
var import_err_code14 = __toESM(require_err_code(), 1);

// node_modules/ipfs-unixfs-exporter/dist/src/resolvers/dag-cbor.js
var import_err_code6 = __toESM(require_err_code(), 1);
var resolve = async (cid, name4, path6, toResolve, resolve6, depth, blockstore, options) => {
  const block = await blockstore.get(cid, options);
  const object = decode6(block);
  let subObject = object;
  let subPath = path6;
  while (toResolve.length > 0) {
    const prop = toResolve[0];
    if (prop in subObject) {
      toResolve.shift();
      subPath = `${subPath}/${prop}`;
      const subObjectCid = CID2.asCID(subObject[prop]);
      if (subObjectCid != null) {
        return {
          entry: {
            type: "object",
            name: name4,
            path: path6,
            cid,
            node: block,
            depth,
            size: BigInt(block.length),
            content: async function* () {
              yield object;
            }
          },
          next: {
            cid: subObjectCid,
            name: prop,
            path: subPath,
            toResolve
          }
        };
      }
      subObject = subObject[prop];
    } else {
      throw (0, import_err_code6.default)(new Error(`No property named ${prop} found in cbor node ${cid}`), "ERR_NO_PROP");
    }
  }
  return {
    entry: {
      type: "object",
      name: name4,
      path: path6,
      cid,
      node: block,
      depth,
      size: BigInt(block.length),
      content: async function* () {
        yield object;
      }
    }
  };
};
var dag_cbor_default = resolve;

// node_modules/ipfs-unixfs-exporter/dist/src/resolvers/identity.js
var import_err_code8 = __toESM(require_err_code(), 1);

// node_modules/ipfs-unixfs-exporter/dist/src/utils/extract-data-from-block.js
function extractDataFromBlock(block, blockStart, requestedStart, requestedEnd) {
  const blockLength = BigInt(block.length);
  const blockEnd = BigInt(blockStart + blockLength);
  if (requestedStart >= blockEnd || requestedEnd < blockStart) {
    return new Uint8Array(0);
  }
  if (requestedEnd >= blockStart && requestedEnd < blockEnd) {
    block = block.subarray(0, Number(requestedEnd - blockStart));
  }
  if (requestedStart >= blockStart && requestedStart < blockEnd) {
    block = block.subarray(Number(requestedStart - blockStart));
  }
  return block;
}
var extract_data_from_block_default = extractDataFromBlock;

// node_modules/ipfs-unixfs-exporter/dist/src/utils/validate-offset-and-length.js
var import_err_code7 = __toESM(require_err_code(), 1);
var validateOffsetAndLength = (size, offset = 0, length4 = size) => {
  const fileSize = BigInt(size);
  const start = BigInt(offset ?? 0);
  let end = BigInt(length4);
  if (end !== fileSize) {
    end = start + end;
  }
  if (end > fileSize) {
    end = fileSize;
  }
  if (start < 0n) {
    throw (0, import_err_code7.default)(new Error("Offset must be greater than or equal to 0"), "ERR_INVALID_PARAMS");
  }
  if (start > fileSize) {
    throw (0, import_err_code7.default)(new Error("Offset must be less than the file size"), "ERR_INVALID_PARAMS");
  }
  if (end < 0n) {
    throw (0, import_err_code7.default)(new Error("Length must be greater than or equal to 0"), "ERR_INVALID_PARAMS");
  }
  if (end > fileSize) {
    throw (0, import_err_code7.default)(new Error("Length must be less than the file size"), "ERR_INVALID_PARAMS");
  }
  return {
    start,
    end
  };
};
var validate_offset_and_length_default = validateOffsetAndLength;

// node_modules/ipfs-unixfs-exporter/dist/src/resolvers/identity.js
var rawContent = (node) => {
  async function* contentGenerator(options = {}) {
    var _a;
    const { start, end } = validate_offset_and_length_default(node.length, options.offset, options.length);
    const buf2 = extract_data_from_block_default(node, 0n, start, end);
    (_a = options.onProgress) == null ? void 0 : _a.call(options, new CustomProgressEvent("unixfs:exporter:progress:identity", {
      bytesRead: BigInt(buf2.byteLength),
      totalBytes: end - start,
      fileSize: BigInt(node.byteLength)
    }));
    yield buf2;
  }
  return contentGenerator;
};
var resolve2 = async (cid, name4, path6, toResolve, resolve6, depth, blockstore, options) => {
  if (toResolve.length > 0) {
    throw (0, import_err_code8.default)(new Error(`No link named ${path6} found in raw node ${cid}`), "ERR_NOT_FOUND");
  }
  const buf2 = decode10(cid.multihash.bytes);
  return {
    entry: {
      type: "identity",
      name: name4,
      path: path6,
      cid,
      content: rawContent(buf2.digest),
      depth,
      size: BigInt(buf2.digest.length),
      node: buf2.digest
    }
  };
};
var identity_default = resolve2;

// node_modules/ipfs-unixfs-exporter/dist/src/resolvers/raw.js
var import_err_code9 = __toESM(require_err_code(), 1);
var rawContent2 = (node) => {
  async function* contentGenerator(options = {}) {
    var _a;
    const { start, end } = validate_offset_and_length_default(node.length, options.offset, options.length);
    const buf2 = extract_data_from_block_default(node, 0n, start, end);
    (_a = options.onProgress) == null ? void 0 : _a.call(options, new CustomProgressEvent("unixfs:exporter:progress:raw", {
      bytesRead: BigInt(buf2.byteLength),
      totalBytes: end - start,
      fileSize: BigInt(node.byteLength)
    }));
    yield buf2;
  }
  return contentGenerator;
};
var resolve3 = async (cid, name4, path6, toResolve, resolve6, depth, blockstore, options) => {
  if (toResolve.length > 0) {
    throw (0, import_err_code9.default)(new Error(`No link named ${path6} found in raw node ${cid}`), "ERR_NOT_FOUND");
  }
  const block = await blockstore.get(cid, options);
  return {
    entry: {
      type: "raw",
      name: name4,
      path: path6,
      cid,
      content: rawContent2(block),
      depth,
      size: BigInt(block.length),
      node: block
    }
  };
};
var raw_default = resolve3;

// node_modules/ipfs-unixfs-exporter/dist/src/resolvers/unixfs-v1/index.js
var import_err_code13 = __toESM(require_err_code(), 1);

// node_modules/ipfs-unixfs-exporter/dist/src/utils/find-cid-in-shard.js
var import_err_code10 = __toESM(require_err_code(), 1);
var hashFn = async function(buf2) {
  return (await murmur3128.encode(buf2)).slice(0, 8).reverse();
};
var addLinksToHamtBucket = async (links, bucket, rootBucket) => {
  const padLength = (bucket.tableSize() - 1).toString(16).length;
  await Promise.all(links.map(async (link) => {
    if (link.Name == null) {
      throw new Error("Unexpected Link without a Name");
    }
    if (link.Name.length === padLength) {
      const pos = parseInt(link.Name, 16);
      bucket._putObjectAt(pos, new Bucket({
        hash: rootBucket._options.hash,
        bits: rootBucket._options.bits
      }, bucket, pos));
      return;
    }
    await rootBucket.put(link.Name.substring(2), true);
  }));
};
var toPrefix = (position, padLength) => {
  return position.toString(16).toUpperCase().padStart(padLength, "0").substring(0, padLength);
};
var toBucketPath = (position) => {
  let bucket = position.bucket;
  const path6 = [];
  while (bucket._parent != null) {
    path6.push(bucket);
    bucket = bucket._parent;
  }
  path6.push(bucket);
  return path6.reverse();
};
var findShardCid = async (node, name4, blockstore, context, options) => {
  if (context == null) {
    if (node.Data == null) {
      throw (0, import_err_code10.default)(new Error("no data in PBNode"), "ERR_NOT_UNIXFS");
    }
    let dir;
    try {
      dir = UnixFS.unmarshal(node.Data);
    } catch (err) {
      throw (0, import_err_code10.default)(err, "ERR_NOT_UNIXFS");
    }
    if (dir.type !== "hamt-sharded-directory") {
      throw (0, import_err_code10.default)(new Error("not a HAMT"), "ERR_NOT_UNIXFS");
    }
    if (dir.fanout == null) {
      throw (0, import_err_code10.default)(new Error("missing fanout"), "ERR_NOT_UNIXFS");
    }
    const rootBucket = createHAMT({
      hashFn,
      bits: Math.log2(Number(dir.fanout))
    });
    context = {
      rootBucket,
      hamtDepth: 1,
      lastBucket: rootBucket
    };
  }
  const padLength = (context.lastBucket.tableSize() - 1).toString(16).length;
  await addLinksToHamtBucket(node.Links, context.lastBucket, context.rootBucket);
  const position = await context.rootBucket._findNewBucketAndPos(name4);
  let prefix = toPrefix(position.pos, padLength);
  const bucketPath = toBucketPath(position);
  if (bucketPath.length > context.hamtDepth) {
    context.lastBucket = bucketPath[context.hamtDepth];
    prefix = toPrefix(context.lastBucket._posAtParent, padLength);
  }
  const link = node.Links.find((link2) => {
    if (link2.Name == null) {
      return false;
    }
    const entryPrefix = link2.Name.substring(0, padLength);
    const entryName = link2.Name.substring(padLength);
    if (entryPrefix !== prefix) {
      return false;
    }
    if (entryName !== "" && entryName !== name4) {
      return false;
    }
    return true;
  });
  if (link == null) {
    return;
  }
  if (link.Name != null && link.Name.substring(padLength) === name4) {
    return link.Hash;
  }
  context.hamtDepth++;
  const block = await blockstore.get(link.Hash, options);
  node = decode11(block);
  return findShardCid(node, name4, blockstore, context, options);
};
var find_cid_in_shard_default = findShardCid;

// node_modules/it-filter/dist/src/index.js
function isAsyncIterable7(thing) {
  return thing[Symbol.asyncIterator] != null;
}
function filter(source, fn) {
  if (isAsyncIterable7(source)) {
    return async function* () {
      for await (const entry of source) {
        if (await fn(entry)) {
          yield entry;
        }
      }
    }();
  }
  const peekable2 = src_default2(source);
  const { value, done } = peekable2.next();
  if (done === true) {
    return function* () {
    }();
  }
  const res = fn(value);
  if (typeof res.then === "function") {
    return async function* () {
      if (await res) {
        yield value;
      }
      for await (const entry of peekable2) {
        if (await fn(entry)) {
          yield entry;
        }
      }
    }();
  }
  const func = fn;
  return function* () {
    if (res === true) {
      yield value;
    }
    for (const entry of peekable2) {
      if (func(entry)) {
        yield entry;
      }
    }
  }();
}
var src_default8 = filter;

// node_modules/it-parallel/dist/src/index.js
var CustomEvent = globalThis.CustomEvent ?? Event;
async function* parallel(source, options = {}) {
  let concurrency = options.concurrency ?? Infinity;
  if (concurrency < 1) {
    concurrency = Infinity;
  }
  const ordered = options.ordered == null ? false : options.ordered;
  const emitter = new EventTarget();
  const ops = [];
  let slotAvailable = pDefer();
  let resultAvailable = pDefer();
  let sourceFinished = false;
  let sourceErr;
  let opErred = false;
  emitter.addEventListener("task-complete", () => {
    resultAvailable.resolve();
  });
  void Promise.resolve().then(async () => {
    try {
      for await (const task of source) {
        if (ops.length === concurrency) {
          slotAvailable = pDefer();
          await slotAvailable.promise;
        }
        if (opErred) {
          break;
        }
        const op = {
          done: false
        };
        ops.push(op);
        task().then((result) => {
          op.done = true;
          op.ok = true;
          op.value = result;
          emitter.dispatchEvent(new CustomEvent("task-complete"));
        }, (err) => {
          op.done = true;
          op.err = err;
          emitter.dispatchEvent(new CustomEvent("task-complete"));
        });
      }
      sourceFinished = true;
      emitter.dispatchEvent(new CustomEvent("task-complete"));
    } catch (err) {
      sourceErr = err;
      emitter.dispatchEvent(new CustomEvent("task-complete"));
    }
  });
  function valuesAvailable() {
    var _a;
    if (ordered) {
      return (_a = ops[0]) == null ? void 0 : _a.done;
    }
    return Boolean(ops.find((op) => op.done));
  }
  function* yieldOrderedValues() {
    while (ops.length > 0 && ops[0].done) {
      const op = ops[0];
      ops.shift();
      if (op.ok) {
        yield op.value;
      } else {
        opErred = true;
        slotAvailable.resolve();
        throw op.err;
      }
      slotAvailable.resolve();
    }
  }
  function* yieldUnOrderedValues() {
    while (valuesAvailable()) {
      for (let i = 0; i < ops.length; i++) {
        if (ops[i].done) {
          const op = ops[i];
          ops.splice(i, 1);
          i--;
          if (op.ok) {
            yield op.value;
          } else {
            opErred = true;
            slotAvailable.resolve();
            throw op.err;
          }
          slotAvailable.resolve();
        }
      }
    }
  }
  while (true) {
    if (!valuesAvailable()) {
      resultAvailable = pDefer();
      await resultAvailable.promise;
    }
    if (sourceErr != null) {
      throw sourceErr;
    }
    if (ordered) {
      yield* yieldOrderedValues();
    } else {
      yield* yieldUnOrderedValues();
    }
    if (sourceFinished && ops.length === 0) {
      break;
    }
  }
}

// node_modules/it-pushable/dist/src/fifo.js
var FixedFIFO = class {
  buffer;
  mask;
  top;
  btm;
  next;
  constructor(hwm) {
    if (!(hwm > 0) || (hwm - 1 & hwm) !== 0) {
      throw new Error("Max size for a FixedFIFO should be a power of two");
    }
    this.buffer = new Array(hwm);
    this.mask = hwm - 1;
    this.top = 0;
    this.btm = 0;
    this.next = null;
  }
  push(data) {
    if (this.buffer[this.top] !== void 0) {
      return false;
    }
    this.buffer[this.top] = data;
    this.top = this.top + 1 & this.mask;
    return true;
  }
  shift() {
    const last2 = this.buffer[this.btm];
    if (last2 === void 0) {
      return void 0;
    }
    this.buffer[this.btm] = void 0;
    this.btm = this.btm + 1 & this.mask;
    return last2;
  }
  isEmpty() {
    return this.buffer[this.btm] === void 0;
  }
};
var FIFO = class {
  size;
  hwm;
  head;
  tail;
  constructor(options = {}) {
    this.hwm = options.splitLimit ?? 16;
    this.head = new FixedFIFO(this.hwm);
    this.tail = this.head;
    this.size = 0;
  }
  calculateSize(obj) {
    if ((obj == null ? void 0 : obj.byteLength) != null) {
      return obj.byteLength;
    }
    return 1;
  }
  push(val) {
    if ((val == null ? void 0 : val.value) != null) {
      this.size += this.calculateSize(val.value);
    }
    if (!this.head.push(val)) {
      const prev = this.head;
      this.head = prev.next = new FixedFIFO(2 * this.head.buffer.length);
      this.head.push(val);
    }
  }
  shift() {
    let val = this.tail.shift();
    if (val === void 0 && this.tail.next != null) {
      const next = this.tail.next;
      this.tail.next = null;
      this.tail = next;
      val = this.tail.shift();
    }
    if ((val == null ? void 0 : val.value) != null) {
      this.size -= this.calculateSize(val.value);
    }
    return val;
  }
  isEmpty() {
    return this.head.isEmpty();
  }
};

// node_modules/it-pushable/dist/src/index.js
var AbortError3 = class extends Error {
  type;
  code;
  constructor(message2, code5) {
    super(message2 ?? "The operation was aborted");
    this.type = "aborted";
    this.code = code5 ?? "ABORT_ERR";
  }
};
function pushable(options = {}) {
  const getNext = (buffer2) => {
    const next = buffer2.shift();
    if (next == null) {
      return { done: true };
    }
    if (next.error != null) {
      throw next.error;
    }
    return {
      done: next.done === true,
      // @ts-expect-error if done is false, value will be present
      value: next.value
    };
  };
  return _pushable(getNext, options);
}
function _pushable(getNext, options) {
  options = options ?? {};
  let onEnd = options.onEnd;
  let buffer2 = new FIFO();
  let pushable2;
  let onNext;
  let ended;
  let drain2 = pDefer();
  const waitNext = async () => {
    try {
      if (!buffer2.isEmpty()) {
        return getNext(buffer2);
      }
      if (ended) {
        return { done: true };
      }
      return await new Promise((resolve6, reject) => {
        onNext = (next) => {
          onNext = null;
          buffer2.push(next);
          try {
            resolve6(getNext(buffer2));
          } catch (err) {
            reject(err);
          }
          return pushable2;
        };
      });
    } finally {
      if (buffer2.isEmpty()) {
        queueMicrotask(() => {
          drain2.resolve();
          drain2 = pDefer();
        });
      }
    }
  };
  const bufferNext = (next) => {
    if (onNext != null) {
      return onNext(next);
    }
    buffer2.push(next);
    return pushable2;
  };
  const bufferError = (err) => {
    buffer2 = new FIFO();
    if (onNext != null) {
      return onNext({ error: err });
    }
    buffer2.push({ error: err });
    return pushable2;
  };
  const push = (value) => {
    if (ended) {
      return pushable2;
    }
    if ((options == null ? void 0 : options.objectMode) !== true && (value == null ? void 0 : value.byteLength) == null) {
      throw new Error("objectMode was not true but tried to push non-Uint8Array value");
    }
    return bufferNext({ done: false, value });
  };
  const end = (err) => {
    if (ended)
      return pushable2;
    ended = true;
    return err != null ? bufferError(err) : bufferNext({ done: true });
  };
  const _return = () => {
    buffer2 = new FIFO();
    end();
    return { done: true };
  };
  const _throw = (err) => {
    end(err);
    return { done: true };
  };
  pushable2 = {
    [Symbol.asyncIterator]() {
      return this;
    },
    next: waitNext,
    return: _return,
    throw: _throw,
    push,
    end,
    get readableLength() {
      return buffer2.size;
    },
    onEmpty: async (options2) => {
      const signal = options2 == null ? void 0 : options2.signal;
      signal == null ? void 0 : signal.throwIfAborted();
      if (buffer2.isEmpty()) {
        return;
      }
      let cancel;
      let listener;
      if (signal != null) {
        cancel = new Promise((resolve6, reject) => {
          listener = () => {
            reject(new AbortError3());
          };
          signal.addEventListener("abort", listener);
        });
      }
      try {
        await Promise.race([
          drain2.promise,
          cancel
        ]);
      } finally {
        if (listener != null && signal != null) {
          signal == null ? void 0 : signal.removeEventListener("abort", listener);
        }
      }
    }
  };
  if (onEnd == null) {
    return pushable2;
  }
  const _pushable2 = pushable2;
  pushable2 = {
    [Symbol.asyncIterator]() {
      return this;
    },
    next() {
      return _pushable2.next();
    },
    throw(err) {
      _pushable2.throw(err);
      if (onEnd != null) {
        onEnd(err);
        onEnd = void 0;
      }
      return { done: true };
    },
    return() {
      _pushable2.return();
      if (onEnd != null) {
        onEnd();
        onEnd = void 0;
      }
      return { done: true };
    },
    push,
    end(err) {
      _pushable2.end(err);
      if (onEnd != null) {
        onEnd(err);
        onEnd = void 0;
      }
      return pushable2;
    },
    get readableLength() {
      return _pushable2.readableLength;
    },
    onEmpty: (opts) => {
      return _pushable2.onEmpty(opts);
    }
  };
  return pushable2;
}

// node_modules/it-merge/dist/src/index.js
function isAsyncIterable8(thing) {
  return thing[Symbol.asyncIterator] != null;
}
function merge(...sources) {
  const syncSources = [];
  for (const source of sources) {
    if (!isAsyncIterable8(source)) {
      syncSources.push(source);
    }
  }
  if (syncSources.length === sources.length) {
    return function* () {
      for (const source of syncSources) {
        yield* source;
      }
    }();
  }
  return async function* () {
    const output = pushable({
      objectMode: true
    });
    void Promise.resolve().then(async () => {
      try {
        await Promise.all(sources.map(async (source) => {
          for await (const item of source) {
            output.push(item);
          }
        }));
        output.end();
      } catch (err) {
        output.end(err);
      }
    });
    yield* output;
  }();
}
var src_default9 = merge;

// node_modules/it-pipe/dist/src/index.js
function pipe(first2, ...rest) {
  if (first2 == null) {
    throw new Error("Empty pipeline");
  }
  if (isDuplex(first2)) {
    const duplex = first2;
    first2 = () => duplex.source;
  } else if (isIterable2(first2) || isAsyncIterable9(first2)) {
    const source = first2;
    first2 = () => source;
  }
  const fns = [first2, ...rest];
  if (fns.length > 1) {
    if (isDuplex(fns[fns.length - 1])) {
      fns[fns.length - 1] = fns[fns.length - 1].sink;
    }
  }
  if (fns.length > 2) {
    for (let i = 1; i < fns.length - 1; i++) {
      if (isDuplex(fns[i])) {
        fns[i] = duplexPipelineFn(fns[i]);
      }
    }
  }
  return rawPipe(...fns);
}
var rawPipe = (...fns) => {
  let res;
  while (fns.length > 0) {
    res = fns.shift()(res);
  }
  return res;
};
var isAsyncIterable9 = (obj) => {
  return (obj == null ? void 0 : obj[Symbol.asyncIterator]) != null;
};
var isIterable2 = (obj) => {
  return (obj == null ? void 0 : obj[Symbol.iterator]) != null;
};
var isDuplex = (obj) => {
  if (obj == null) {
    return false;
  }
  return obj.sink != null && obj.source != null;
};
var duplexPipelineFn = (duplex) => {
  return (source) => {
    const p = duplex.sink(source);
    if ((p == null ? void 0 : p.then) != null) {
      const stream = pushable({
        objectMode: true
      });
      p.then(() => {
        stream.end();
      }, (err) => {
        stream.end(err);
      });
      let sourceWrap;
      const source2 = duplex.source;
      if (isAsyncIterable9(source2)) {
        sourceWrap = async function* () {
          yield* source2;
          stream.end();
        };
      } else if (isIterable2(source2)) {
        sourceWrap = function* () {
          yield* source2;
          stream.end();
        };
      } else {
        throw new Error("Unknown duplex source type - must be Iterable or AsyncIterable");
      }
      return src_default9(stream, sourceWrap());
    }
    return duplex.source;
  };
};

// node_modules/ipfs-unixfs-exporter/dist/src/resolvers/unixfs-v1/content/directory.js
var directoryContent = (cid, node, unixfs2, path6, resolve6, depth, blockstore) => {
  async function* yieldDirectoryContent(options = {}) {
    var _a;
    const offset = options.offset ?? 0;
    const length4 = options.length ?? node.Links.length;
    const links = node.Links.slice(offset, length4);
    (_a = options.onProgress) == null ? void 0 : _a.call(options, new CustomProgressEvent("unixfs:exporter:walk:directory", {
      cid
    }));
    yield* pipe(links, (source) => src_default3(source, (link) => {
      return async () => {
        const linkName = link.Name ?? "";
        const linkPath = `${path6}/${linkName}`;
        const result = await resolve6(link.Hash, linkName, linkPath, [], depth + 1, blockstore, options);
        return result.entry;
      };
    }), (source) => parallel(source, { ordered: true }), (source) => src_default8(source, (entry) => entry != null));
  }
  return yieldDirectoryContent;
};
var directory_default = directoryContent;

// node_modules/ipfs-unixfs-exporter/dist/src/resolvers/unixfs-v1/content/file.js
var import_err_code11 = __toESM(require_err_code(), 1);
async function walkDAG(blockstore, node, queue, streamPosition, start, end, options) {
  if (node instanceof Uint8Array) {
    const buf2 = extract_data_from_block_default(node, streamPosition, start, end);
    queue.push(buf2);
    return;
  }
  if (node.Data == null) {
    throw (0, import_err_code11.default)(new Error("no data in PBNode"), "ERR_NOT_UNIXFS");
  }
  let file;
  try {
    file = UnixFS.unmarshal(node.Data);
  } catch (err) {
    throw (0, import_err_code11.default)(err, "ERR_NOT_UNIXFS");
  }
  if (file.data != null) {
    const data = file.data;
    const buf2 = extract_data_from_block_default(data, streamPosition, start, end);
    queue.push(buf2);
    streamPosition += BigInt(buf2.byteLength);
  }
  const childOps = [];
  if (node.Links.length !== file.blockSizes.length) {
    throw (0, import_err_code11.default)(new Error("Inconsistent block sizes and dag links"), "ERR_NOT_UNIXFS");
  }
  for (let i = 0; i < node.Links.length; i++) {
    const childLink = node.Links[i];
    const childStart = streamPosition;
    const childEnd = childStart + file.blockSizes[i];
    if (start >= childStart && start < childEnd || // child has offset byte
    end >= childStart && end <= childEnd || // child has end byte
    start < childStart && end > childEnd) {
      childOps.push({
        link: childLink,
        blockStart: streamPosition
      });
    }
    streamPosition = childEnd;
    if (streamPosition > end) {
      break;
    }
  }
  await pipe(childOps, (source) => src_default3(source, (op) => {
    return async () => {
      const block = await blockstore.get(op.link.Hash, options);
      return {
        ...op,
        block
      };
    };
  }), (source) => parallel(source, {
    ordered: true
  }), async (source) => {
    for await (const { link, block, blockStart } of source) {
      let child;
      switch (link.Hash.code) {
        case code2:
          child = decode11(block);
          break;
        case code3:
          child = block;
          break;
        default:
          queue.end((0, import_err_code11.default)(new Error(`Unsupported codec: ${link.Hash.code}`), "ERR_NOT_UNIXFS"));
          return;
      }
      const childQueue = new dist_default({
        concurrency: 1
      });
      childQueue.on("error", (error) => {
        queue.end(error);
      });
      void childQueue.add(async () => {
        var _a;
        (_a = options.onProgress) == null ? void 0 : _a.call(options, new CustomProgressEvent("unixfs:exporter:walk:file", {
          cid: link.Hash
        }));
        await walkDAG(blockstore, child, queue, blockStart, start, end, options);
      });
      await childQueue.onIdle();
    }
  });
  if (streamPosition >= end) {
    queue.end();
  }
}
var fileContent = (cid, node, unixfs2, path6, resolve6, depth, blockstore) => {
  async function* yieldFileContent(options = {}) {
    var _a, _b;
    const fileSize = unixfs2.fileSize();
    if (fileSize === void 0) {
      throw new Error("File was a directory");
    }
    const { start, end } = validate_offset_and_length_default(fileSize, options.offset, options.length);
    if (end === 0n) {
      return;
    }
    let read4 = 0n;
    const wanted = end - start;
    const queue = pushable();
    (_a = options.onProgress) == null ? void 0 : _a.call(options, new CustomProgressEvent("unixfs:exporter:walk:file", {
      cid
    }));
    void walkDAG(blockstore, node, queue, 0n, start, end, options).catch((err) => {
      queue.end(err);
    });
    for await (const buf2 of queue) {
      if (buf2 == null) {
        continue;
      }
      read4 += BigInt(buf2.byteLength);
      if (read4 > wanted) {
        queue.end();
        throw (0, import_err_code11.default)(new Error("Read too many bytes - the file size reported by the UnixFS data in the root node may be incorrect"), "ERR_OVER_READ");
      }
      if (read4 === wanted) {
        queue.end();
      }
      (_b = options.onProgress) == null ? void 0 : _b.call(options, new CustomProgressEvent("unixfs:exporter:progress:unixfs:file", {
        bytesRead: read4,
        totalBytes: wanted,
        fileSize
      }));
      yield buf2;
    }
    if (read4 < wanted) {
      throw (0, import_err_code11.default)(new Error("Traversed entire DAG but did not read enough bytes"), "ERR_UNDER_READ");
    }
  }
  return yieldFileContent;
};
var file_default = fileContent;

// node_modules/ipfs-unixfs-exporter/dist/src/resolvers/unixfs-v1/content/hamt-sharded-directory.js
var import_err_code12 = __toESM(require_err_code(), 1);
var hamtShardedDirectoryContent = (cid, node, unixfs2, path6, resolve6, depth, blockstore) => {
  function yieldHamtDirectoryContent(options = {}) {
    var _a;
    (_a = options.onProgress) == null ? void 0 : _a.call(options, new CustomProgressEvent("unixfs:exporter:walk:hamt-sharded-directory", {
      cid
    }));
    return listDirectory(node, path6, resolve6, depth, blockstore, options);
  }
  return yieldHamtDirectoryContent;
};
async function* listDirectory(node, path6, resolve6, depth, blockstore, options) {
  const links = node.Links;
  if (node.Data == null) {
    throw (0, import_err_code12.default)(new Error("no data in PBNode"), "ERR_NOT_UNIXFS");
  }
  let dir;
  try {
    dir = UnixFS.unmarshal(node.Data);
  } catch (err) {
    throw (0, import_err_code12.default)(err, "ERR_NOT_UNIXFS");
  }
  if (dir.fanout == null) {
    throw (0, import_err_code12.default)(new Error("missing fanout"), "ERR_NOT_UNIXFS");
  }
  const padLength = (dir.fanout - 1n).toString(16).length;
  const results = pipe(links, (source) => src_default3(source, (link) => {
    return async () => {
      var _a;
      const name4 = link.Name != null ? link.Name.substring(padLength) : null;
      if (name4 != null && name4 !== "") {
        const result = await resolve6(link.Hash, name4, `${path6}/${name4}`, [], depth + 1, blockstore, options);
        return { entries: result.entry == null ? [] : [result.entry] };
      } else {
        const block = await blockstore.get(link.Hash, options);
        node = decode11(block);
        (_a = options.onProgress) == null ? void 0 : _a.call(options, new CustomProgressEvent("unixfs:exporter:walk:hamt-sharded-directory", {
          cid: link.Hash
        }));
        return { entries: listDirectory(node, path6, resolve6, depth, blockstore, options) };
      }
    };
  }), (source) => parallel(source, { ordered: true }));
  for await (const { entries } of results) {
    yield* entries;
  }
}
var hamt_sharded_directory_default = hamtShardedDirectoryContent;

// node_modules/ipfs-unixfs-exporter/dist/src/resolvers/unixfs-v1/index.js
var findLinkCid = (node, name4) => {
  const link = node.Links.find((link2) => link2.Name === name4);
  return link == null ? void 0 : link.Hash;
};
var contentExporters = {
  raw: file_default,
  file: file_default,
  directory: directory_default,
  "hamt-sharded-directory": hamt_sharded_directory_default,
  metadata: (cid, node, unixfs2, path6, resolve6, depth, blockstore) => {
    return () => [];
  },
  symlink: (cid, node, unixfs2, path6, resolve6, depth, blockstore) => {
    return () => [];
  }
};
var unixFsResolver = async (cid, name4, path6, toResolve, resolve6, depth, blockstore, options) => {
  const block = await blockstore.get(cid, options);
  const node = decode11(block);
  let unixfs2;
  let next;
  if (name4 == null) {
    name4 = cid.toString();
  }
  if (node.Data == null) {
    throw (0, import_err_code13.default)(new Error("no data in PBNode"), "ERR_NOT_UNIXFS");
  }
  try {
    unixfs2 = UnixFS.unmarshal(node.Data);
  } catch (err) {
    throw (0, import_err_code13.default)(err, "ERR_NOT_UNIXFS");
  }
  if (path6 == null) {
    path6 = name4;
  }
  if (toResolve.length > 0) {
    let linkCid;
    if ((unixfs2 == null ? void 0 : unixfs2.type) === "hamt-sharded-directory") {
      linkCid = await find_cid_in_shard_default(node, toResolve[0], blockstore);
    } else {
      linkCid = findLinkCid(node, toResolve[0]);
    }
    if (linkCid == null) {
      throw (0, import_err_code13.default)(new Error("file does not exist"), "ERR_NOT_FOUND");
    }
    const nextName = toResolve.shift();
    const nextPath = `${path6}/${nextName}`;
    next = {
      cid: linkCid,
      toResolve,
      name: nextName ?? "",
      path: nextPath
    };
  }
  const content = contentExporters[unixfs2.type](cid, node, unixfs2, path6, resolve6, depth, blockstore);
  if (content == null) {
    throw (0, import_err_code13.default)(new Error("could not find content exporter"), "ERR_NOT_FOUND");
  }
  if (unixfs2.isDirectory()) {
    return {
      entry: {
        type: "directory",
        name: name4,
        path: path6,
        cid,
        content,
        unixfs: unixfs2,
        depth,
        node,
        size: unixfs2.fileSize()
      },
      next
    };
  }
  return {
    entry: {
      type: "file",
      name: name4,
      path: path6,
      cid,
      content,
      unixfs: unixfs2,
      depth,
      node,
      size: unixfs2.fileSize()
    },
    next
  };
};
var unixfs_v1_default = unixFsResolver;

// node_modules/ipfs-unixfs-exporter/dist/src/resolvers/index.js
var resolvers = {
  [code2]: unixfs_v1_default,
  [code3]: raw_default,
  [code]: dag_cbor_default,
  [identity2.code]: identity_default
};
var resolve4 = async (cid, name4, path6, toResolve, depth, blockstore, options) => {
  const resolver = resolvers[cid.code];
  if (resolver == null) {
    throw (0, import_err_code14.default)(new Error(`No resolver for code ${cid.code}`), "ERR_NO_RESOLVER");
  }
  return resolver(cid, name4, path6, toResolve, resolve4, depth, blockstore, options);
};
var resolvers_default = resolve4;

// node_modules/ipfs-unixfs-exporter/dist/src/index.js
var toPathComponents2 = (path6 = "") => {
  return (path6.trim().match(/([^\\^/]|\\\/)+/g) ?? []).filter(Boolean);
};
var cidAndRest = (path6) => {
  if (path6 instanceof Uint8Array) {
    return {
      cid: CID2.decode(path6),
      toResolve: []
    };
  }
  const cid = CID2.asCID(path6);
  if (cid != null) {
    return {
      cid,
      toResolve: []
    };
  }
  if (typeof path6 === "string") {
    if (path6.indexOf("/ipfs/") === 0) {
      path6 = path6.substring(6);
    }
    const output = toPathComponents2(path6);
    return {
      cid: CID2.parse(output[0]),
      toResolve: output.slice(1)
    };
  }
  throw (0, import_err_code15.default)(new Error(`Unknown path type ${path6}`), "ERR_BAD_PATH");
};
async function* walkPath(path6, blockstore, options = {}) {
  let { cid, toResolve } = cidAndRest(path6);
  let name4 = cid.toString();
  let entryPath = name4;
  const startingDepth = toResolve.length;
  while (true) {
    const result = await resolvers_default(cid, name4, entryPath, toResolve, startingDepth, blockstore, options);
    if (result.entry == null && result.next == null) {
      throw (0, import_err_code15.default)(new Error(`Could not resolve ${path6}`), "ERR_NOT_FOUND");
    }
    if (result.entry != null) {
      yield result.entry;
    }
    if (result.next == null) {
      return;
    }
    toResolve = result.next.toResolve;
    cid = result.next.cid;
    name4 = result.next.name;
    entryPath = result.next.path;
  }
}
async function exporter(path6, blockstore, options = {}) {
  const result = await src_default7(walkPath(path6, blockstore, options));
  if (result == null) {
    throw (0, import_err_code15.default)(new Error(`Could not resolve ${path6}`), "ERR_NOT_FOUND");
  }
  return result;
}
async function* recursive(path6, blockstore, options = {}) {
  const node = await exporter(path6, blockstore, options);
  if (node == null) {
    return;
  }
  yield node;
  if (node.type === "directory") {
    for await (const child of recurse(node, options)) {
      yield child;
    }
  }
  async function* recurse(node2, options2) {
    for await (const file of node2.content(options2)) {
      yield file;
      if (file instanceof Uint8Array) {
        continue;
      }
      if (file.type === "directory") {
        yield* recurse(file, options2);
      }
    }
  }
}

// node_modules/merge-options/index.mjs
var import_index3 = __toESM(require_merge_options(), 1);
var merge_options_default = import_index3.default;

// node_modules/@helia/unixfs/dist/src/errors.js
var UnixFSError = class extends Error {
  name;
  code;
  constructor(message2, name4, code5) {
    super(message2);
    this.name = name4;
    this.code = code5;
  }
};
var NotUnixFSError = class extends UnixFSError {
  constructor(message2 = "not a Unixfs node") {
    super(message2, "NotUnixFSError", "ERR_NOT_UNIXFS");
  }
};
var InvalidPBNodeError = class extends UnixFSError {
  constructor(message2 = "invalid PBNode") {
    super(message2, "InvalidPBNodeError", "ERR_INVALID_PBNODE");
  }
};
var UnknownError = class extends UnixFSError {
  constructor(message2 = "unknown error") {
    super(message2, "InvalidPBNodeError", "ERR_UNKNOWN_ERROR");
  }
};
var AlreadyExistsError = class extends UnixFSError {
  constructor(message2 = "path already exists") {
    super(message2, "AlreadyExistsError", "ERR_ALREADY_EXISTS");
  }
};
var DoesNotExistError = class extends UnixFSError {
  constructor(message2 = "path does not exist") {
    super(message2, "DoesNotExistError", "ERR_DOES_NOT_EXIST");
  }
};
var NoContentError = class extends UnixFSError {
  constructor(message2 = "no content") {
    super(message2, "NoContentError", "ERR_NO_CONTENT");
  }
};
var NotAFileError = class extends UnixFSError {
  constructor(message2 = "not a file") {
    super(message2, "NotAFileError", "ERR_NOT_A_FILE");
  }
};
var NotADirectoryError = class extends UnixFSError {
  constructor(message2 = "not a directory") {
    super(message2, "NotADirectoryError", "ERR_NOT_A_DIRECTORY");
  }
};
var InvalidParametersError = class extends UnixFSError {
  constructor(message2 = "invalid parameters") {
    super(message2, "InvalidParametersError", "ERR_INVALID_PARAMETERS");
  }
};

// node_modules/@libp2p/logger/dist/src/index.js
var import_debug = __toESM(require_src2(), 1);
import_debug.default.formatters.b = (v) => {
  return v == null ? "undefined" : base58btc2.baseEncode(v);
};
import_debug.default.formatters.t = (v) => {
  return v == null ? "undefined" : base322.baseEncode(v);
};
import_debug.default.formatters.m = (v) => {
  return v == null ? "undefined" : base64.baseEncode(v);
};
import_debug.default.formatters.p = (v) => {
  return v == null ? "undefined" : v.toString();
};
import_debug.default.formatters.c = (v) => {
  return v == null ? "undefined" : v.toString();
};
import_debug.default.formatters.k = (v) => {
  return v == null ? "undefined" : v.toString();
};
import_debug.default.formatters.a = (v) => {
  return v == null ? "undefined" : v.toString();
};
function createDisabledLogger(namespace) {
  const logger3 = () => {
  };
  logger3.enabled = false;
  logger3.color = "";
  logger3.diff = 0;
  logger3.log = () => {
  };
  logger3.namespace = namespace;
  logger3.destroy = () => true;
  logger3.extend = () => logger3;
  return logger3;
}
function logger(name4) {
  let trace = createDisabledLogger(`${name4}:trace`);
  if (import_debug.default.enabled(`${name4}:trace`) && import_debug.default.names.map((r) => r.toString()).find((n) => n.includes(":trace")) != null) {
    trace = (0, import_debug.default)(`${name4}:trace`);
  }
  return Object.assign((0, import_debug.default)(name4), {
    error: (0, import_debug.default)(`${name4}:error`),
    trace
  });
}

// node_modules/@helia/unixfs/dist/src/commands/utils/add-link.js
var import_sparse_array3 = __toESM(require_sparse_array(), 1);

// node_modules/@helia/unixfs/dist/src/commands/utils/consumable-hash.js
function wrapHash2(hashFn2) {
  function hashing(value) {
    if (value instanceof InfiniteHash2) {
      return value;
    } else {
      return new InfiniteHash2(value, hashFn2);
    }
  }
  return hashing;
}
var InfiniteHash2 = class {
  _value;
  _hashFn;
  _depth;
  _availableBits;
  _currentBufferIndex;
  _buffers;
  constructor(value, hashFn2) {
    if (!(value instanceof Uint8Array)) {
      throw new Error("can only hash Uint8Arrays");
    }
    this._value = value;
    this._hashFn = hashFn2;
    this._depth = -1;
    this._availableBits = 0;
    this._currentBufferIndex = 0;
    this._buffers = [];
  }
  async take(bits) {
    let pendingBits = bits;
    while (this._availableBits < pendingBits) {
      await this._produceMoreBits();
    }
    let result = 0;
    while (pendingBits > 0) {
      const hash = this._buffers[this._currentBufferIndex];
      const available = Math.min(hash.availableBits(), pendingBits);
      const took = hash.take(available);
      result = (result << available) + took;
      pendingBits -= available;
      this._availableBits -= available;
      if (hash.availableBits() === 0) {
        this._currentBufferIndex++;
      }
    }
    return result;
  }
  untake(bits) {
    let pendingBits = bits;
    while (pendingBits > 0) {
      const hash = this._buffers[this._currentBufferIndex];
      const availableForUntake = Math.min(hash.totalBits() - hash.availableBits(), pendingBits);
      hash.untake(availableForUntake);
      pendingBits -= availableForUntake;
      this._availableBits += availableForUntake;
      if (this._currentBufferIndex > 0 && hash.totalBits() === hash.availableBits()) {
        this._depth--;
        this._currentBufferIndex--;
      }
    }
  }
  async _produceMoreBits() {
    this._depth++;
    const value = this._depth > 0 ? concat2([this._value, Uint8Array.from([this._depth])]) : this._value;
    const hashValue = await this._hashFn(value);
    const buffer2 = new ConsumableBuffer2(hashValue);
    this._buffers.push(buffer2);
    this._availableBits += buffer2.availableBits();
  }
};
var START_MASKS2 = [
  255,
  254,
  252,
  248,
  240,
  224,
  192,
  128
];
var STOP_MASKS2 = [
  1,
  3,
  7,
  15,
  31,
  63,
  127,
  255
];
var ConsumableBuffer2 = class {
  _value;
  _currentBytePos;
  _currentBitPos;
  constructor(value) {
    this._value = value;
    this._currentBytePos = value.length - 1;
    this._currentBitPos = 7;
  }
  availableBits() {
    return this._currentBitPos + 1 + this._currentBytePos * 8;
  }
  totalBits() {
    return this._value.length * 8;
  }
  take(bits) {
    let pendingBits = bits;
    let result = 0;
    while (pendingBits > 0 && this._haveBits()) {
      const byte = this._value[this._currentBytePos];
      const availableBits = this._currentBitPos + 1;
      const taking = Math.min(availableBits, pendingBits);
      const value = byteBitsToInt2(byte, availableBits - taking, taking);
      result = (result << taking) + value;
      pendingBits -= taking;
      this._currentBitPos -= taking;
      if (this._currentBitPos < 0) {
        this._currentBitPos = 7;
        this._currentBytePos--;
      }
    }
    return result;
  }
  untake(bits) {
    this._currentBitPos += bits;
    while (this._currentBitPos > 7) {
      this._currentBitPos -= 8;
      this._currentBytePos += 1;
    }
  }
  _haveBits() {
    return this._currentBytePos >= 0;
  }
};
function byteBitsToInt2(byte, start, length4) {
  const mask = maskFor2(start, length4);
  return (byte & mask) >>> start;
}
function maskFor2(start, length4) {
  return START_MASKS2[start] & STOP_MASKS2[Math.min(length4 + start - 1, 7)];
}

// node_modules/@helia/unixfs/dist/src/commands/utils/hamt-constants.js
var hamtHashCode = BigInt(murmur3128.code);
var hamtBucketBits = 8;
async function hamtHashFn2(buf2) {
  return (await murmur3128.encode(buf2)).subarray(0, 8).reverse();
}

// node_modules/@helia/unixfs/dist/src/commands/utils/hamt-utils.js
var import_sparse_array2 = __toESM(require_sparse_array(), 1);

// node_modules/@helia/unixfs/dist/src/commands/utils/persist.js
var persist2 = async (buffer2, blockstore, options) => {
  if (options.codec == null) {
    options.codec = src_exports2;
  }
  const multihash = await sha256.digest(buffer2);
  const cid = CID2.create(options.cidVersion, options.codec.code, multihash);
  await blockstore.put(cid, buffer2, {
    ...options,
    signal: options.signal
  });
  return cid;
};

// node_modules/@helia/unixfs/dist/src/commands/utils/dir-sharded.js
var Dir2 = class {
  options;
  root;
  dir;
  path;
  dirty;
  flat;
  parent;
  parentKey;
  unixfs;
  mode;
  mtime;
  cid;
  size;
  nodeSize;
  constructor(props, options) {
    this.options = options ?? {};
    this.root = props.root;
    this.dir = props.dir;
    this.path = props.path;
    this.dirty = props.dirty;
    this.flat = props.flat;
    this.parent = props.parent;
    this.parentKey = props.parentKey;
    this.unixfs = props.unixfs;
    this.mode = props.mode;
    this.mtime = props.mtime;
  }
};
var DirSharded2 = class extends Dir2 {
  _bucket;
  constructor(props, options) {
    super(props, options);
    this._bucket = createHAMT({
      hashFn: hamtHashFn2,
      bits: 8
    });
  }
  async put(name4, value) {
    this.cid = void 0;
    this.size = void 0;
    this.nodeSize = void 0;
    await this._bucket.put(name4, value);
  }
  async get(name4) {
    return this._bucket.get(name4);
  }
  childCount() {
    return this._bucket.leafCount();
  }
  directChildrenCount() {
    return this._bucket.childrenCount();
  }
  onlyChild() {
    return this._bucket.onlyChild();
  }
  async *eachChildSeries() {
    for await (const { key, value } of this._bucket.eachLeafSeries()) {
      yield {
        key,
        child: value
      };
    }
  }
  estimateNodeSize() {
    if (this.nodeSize !== void 0) {
      return this.nodeSize;
    }
    this.nodeSize = calculateSize2(this._bucket, this, this.options);
    return this.nodeSize;
  }
  async *flush(blockstore) {
    for await (const entry of flush2(this._bucket, blockstore, this, this.options)) {
      yield {
        ...entry,
        path: this.path
      };
    }
  }
};
async function* flush2(bucket, blockstore, shardRoot, options) {
  const children = bucket._children;
  const links = [];
  let childrenSize = 0n;
  for (let i = 0; i < children.length; i++) {
    const child = children.get(i);
    if (child == null) {
      continue;
    }
    const labelPrefix = i.toString(16).toUpperCase().padStart(2, "0");
    if (child instanceof Bucket) {
      let shard;
      for await (const subShard of flush2(child, blockstore, null, options)) {
        shard = subShard;
      }
      if (shard == null) {
        throw new Error("Could not flush sharded directory, no subshard found");
      }
      links.push({
        Name: labelPrefix,
        Tsize: Number(shard.size),
        Hash: shard.cid
      });
      childrenSize += shard.size;
    } else if (isDir2(child.value)) {
      const dir2 = child.value;
      let flushedDir;
      for await (const entry of dir2.flush(blockstore)) {
        flushedDir = entry;
        yield flushedDir;
      }
      if (flushedDir == null) {
        throw new Error("Did not flush dir");
      }
      const label = labelPrefix + child.key;
      links.push({
        Name: label,
        Tsize: Number(flushedDir.size),
        Hash: flushedDir.cid
      });
      childrenSize += flushedDir.size;
    } else {
      const value = child.value;
      if (value.cid == null) {
        continue;
      }
      const label = labelPrefix + child.key;
      const size2 = value.size;
      links.push({
        Name: label,
        Tsize: Number(size2),
        Hash: value.cid
      });
      childrenSize += BigInt(size2 ?? 0);
    }
  }
  const data = Uint8Array.from(children.bitField().reverse());
  const dir = new UnixFS({
    type: "hamt-sharded-directory",
    data,
    fanout: BigInt(bucket.tableSize()),
    hashType: hamtHashCode,
    mtime: shardRoot == null ? void 0 : shardRoot.mtime,
    mode: shardRoot == null ? void 0 : shardRoot.mode
  });
  const node = {
    Data: dir.marshal(),
    Links: links
  };
  const buffer2 = encode7(prepare(node));
  const cid = await persist2(buffer2, blockstore, options);
  const size = BigInt(buffer2.byteLength) + childrenSize;
  yield {
    cid,
    unixfs: dir,
    size
  };
}
function isDir2(obj) {
  return typeof obj.flush === "function";
}
function calculateSize2(bucket, shardRoot, options) {
  const children = bucket._children;
  const links = [];
  for (let i = 0; i < children.length; i++) {
    const child = children.get(i);
    if (child == null) {
      continue;
    }
    const labelPrefix = i.toString(16).toUpperCase().padStart(2, "0");
    if (child instanceof Bucket) {
      const size = calculateSize2(child, null, options);
      links.push({
        Name: labelPrefix,
        Tsize: Number(size),
        Hash: options.cidVersion === 0 ? CID_V02 : CID_V12
      });
    } else if (typeof child.value.flush === "function") {
      const dir2 = child.value;
      const size = dir2.nodeSize();
      links.push({
        Name: labelPrefix + child.key,
        Tsize: Number(size),
        Hash: options.cidVersion === 0 ? CID_V02 : CID_V12
      });
    } else {
      const value = child.value;
      if (value.cid == null) {
        continue;
      }
      const label = labelPrefix + child.key;
      const size = value.size;
      links.push({
        Name: label,
        Tsize: Number(size),
        Hash: value.cid
      });
    }
  }
  const data = Uint8Array.from(children.bitField().reverse());
  const dir = new UnixFS({
    type: "hamt-sharded-directory",
    data,
    fanout: BigInt(bucket.tableSize()),
    hashType: hamtHashCode,
    mtime: shardRoot == null ? void 0 : shardRoot.mtime,
    mode: shardRoot == null ? void 0 : shardRoot.mode
  });
  const buffer2 = encode7(prepare({
    Data: dir.marshal(),
    Links: links
  }));
  return buffer2.length;
}
var CID_V02 = CID2.parse("QmUNLLsPACCz1vLxQVkXqqLX5R1X345qqfHbsf67hvA3Nn");
var CID_V12 = CID2.parse("zdj7WbTaiJT1fgatdet9Ei9iDB5hdCxkbVyhyh8YTUnXMiwYi");

// node_modules/@helia/unixfs/dist/src/commands/utils/hamt-utils.js
var log = logger("helia:unixfs:commands:utils:hamt-utils");
var toPrefix2 = (position) => {
  return position.toString(16).toUpperCase().padStart(2, "0").substring(0, 2);
};
var createShard = async (blockstore, contents, options) => {
  const shard = new DirSharded2({
    root: true,
    dir: true,
    parent: void 0,
    parentKey: void 0,
    path: "",
    dirty: true,
    flat: false,
    mtime: options.mtime,
    mode: options.mode
  }, options);
  for (let i = 0; i < contents.length; i++) {
    await shard._bucket.put(contents[i].name, {
      size: contents[i].size,
      cid: contents[i].cid
    });
  }
  const res = await src_default7(shard.flush(blockstore));
  if (res == null) {
    throw new Error("Flushing shard yielded no result");
  }
  return res;
};
var updateShardedDirectory = async (path6, blockstore, options) => {
  const shardRoot = UnixFS.unmarshal(path6[0].node.Data ?? new Uint8Array(0));
  const fanout = BigInt(Math.pow(2, hamtBucketBits));
  path6.reverse();
  let cid;
  let node;
  for (let i = 0; i < path6.length; i++) {
    const isRoot = i === path6.length - 1;
    const segment = path6[i];
    const data = Uint8Array.from(segment.children.bitField().reverse());
    const dir = new UnixFS({
      type: "hamt-sharded-directory",
      data,
      fanout,
      hashType: hamtHashCode
    });
    if (isRoot) {
      dir.mtime = shardRoot.mtime;
      dir.mode = shardRoot.mode;
    }
    node = {
      Data: dir.marshal(),
      Links: segment.node.Links
    };
    const block = encode7(prepare(node));
    cid = await persist2(block, blockstore, options);
    if (!isRoot) {
      const nextSegment = path6[i + 1];
      if (nextSegment == null) {
        throw new Error("Was not operating on shard root but also had no parent?");
      }
      log("updating link in parent sub-shard with prefix %s", nextSegment.prefix);
      nextSegment.node.Links = nextSegment.node.Links.filter((l) => l.Name !== nextSegment.prefix);
      nextSegment.node.Links.push({
        Name: nextSegment.prefix,
        Hash: cid,
        Tsize: segment.node.Links.reduce((acc, curr) => acc + (curr.Tsize ?? 0), block.byteLength)
      });
    }
  }
  if (cid == null || node == null) {
    throw new Error("Noting persisted");
  }
  return { cid, node };
};
var recreateShardedDirectory = async (cid, fileName, blockstore, options) => {
  const wrapped = wrapHash2(hamtHashFn2);
  const hash = wrapped(fromString3(fileName));
  const path6 = [];
  while (true) {
    const block = await blockstore.get(cid, options);
    const node = decode11(block);
    const children = new import_sparse_array2.default();
    const index = await hash.take(hamtBucketBits);
    const prefix = toPrefix2(index);
    path6.push({
      prefix,
      children,
      node
    });
    let childLink;
    for (const link of node.Links) {
      const linkName2 = link.Name ?? "";
      if (linkName2.length < 2) {
        throw new Error("Invalid HAMT - link name was too short");
      }
      const position = parseInt(linkName2.substring(0, 2), 16);
      children.set(position, true);
      if (linkName2.startsWith(prefix)) {
        childLink = link;
      }
    }
    if (childLink == null) {
      log("no link found with prefix %s for %s", prefix, fileName);
      break;
    }
    const linkName = childLink.Name ?? "";
    if (linkName.length < 2) {
      throw new Error("Invalid HAMT - link name was too short");
    }
    if (linkName.length === 2) {
      cid = childLink.Hash;
      log("descend into sub-shard with prefix %s", linkName);
      continue;
    }
    break;
  }
  return { path: path6, hash };
};

// node_modules/@helia/unixfs/dist/src/commands/utils/is-over-shard-threshold.js
async function isOverShardThreshold(node, blockstore, threshold, options) {
  if (node.Data == null) {
    throw new Error("DagPB node had no data");
  }
  const unixfs2 = UnixFS.unmarshal(node.Data);
  let size;
  if (unixfs2.type === "directory") {
    size = estimateNodeSize(node);
  } else if (unixfs2.type === "hamt-sharded-directory") {
    size = await estimateShardSize(node, 0, threshold, blockstore, options);
  } else {
    throw new Error("Can only estimate the size of directories or shards");
  }
  return size > threshold;
}
function estimateNodeSize(node) {
  let size = 0;
  for (const link of node.Links) {
    size += (link.Name ?? "").length;
    size += link.Hash.version === 1 ? CID_V12.bytes.byteLength : CID_V02.bytes.byteLength;
  }
  return size;
}
async function estimateShardSize(node, current, max, blockstore, options) {
  if (current > max) {
    return max;
  }
  if (node.Data == null) {
    return current;
  }
  const unixfs2 = UnixFS.unmarshal(node.Data);
  if (!unixfs2.isDirectory()) {
    return current;
  }
  for (const link of node.Links) {
    let name4 = link.Name ?? "";
    name4 = name4.substring(2);
    current += name4.length;
    current += link.Hash.bytes.byteLength;
    if (link.Hash.code === code2) {
      const block = await blockstore.get(link.Hash, options);
      const node2 = decode11(block);
      current += await estimateShardSize(node2, current, max, blockstore, options);
    }
  }
  return current;
}

// node_modules/@helia/unixfs/dist/src/commands/utils/add-link.js
var log2 = logger("helia:unixfs:components:utils:add-link");
async function addLink(parent, child, blockstore, options) {
  if (parent.node.Data == null) {
    throw new InvalidParametersError("Invalid parent passed to addLink");
  }
  const meta = UnixFS.unmarshal(parent.node.Data);
  if (meta.type === "hamt-sharded-directory") {
    log2("adding link to sharded directory");
    return addToShardedDirectory(parent, child, blockstore, options);
  }
  log2(`adding ${child.Name} (${child.Hash}) to regular directory`);
  const result = await addToDirectory(parent, child, blockstore, options);
  if (await isOverShardThreshold(result.node, blockstore, options.shardSplitThresholdBytes, options)) {
    log2("converting directory to sharded directory");
    const converted = await convertToShardedDirectory(result, blockstore);
    result.cid = converted.cid;
    result.node = decode11(await blockstore.get(converted.cid, options));
  }
  return result;
}
var convertToShardedDirectory = async (parent, blockstore) => {
  if (parent.node.Data == null) {
    throw new InvalidParametersError("Invalid parent passed to convertToShardedDirectory");
  }
  const unixfs2 = UnixFS.unmarshal(parent.node.Data);
  const result = await createShard(blockstore, parent.node.Links.map((link) => ({
    name: link.Name ?? "",
    size: BigInt(link.Tsize ?? 0),
    cid: link.Hash
  })), {
    mode: unixfs2.mode,
    mtime: unixfs2.mtime,
    cidVersion: parent.cid.version
  });
  log2(`converted directory to sharded directory ${result.cid}`);
  return result;
};
var addToDirectory = async (parent, child, blockstore, options) => {
  const parentLinks = parent.node.Links.filter((link) => {
    const matches = link.Name === child.Name;
    if (matches && !options.allowOverwriting) {
      throw new AlreadyExistsError();
    }
    return !matches;
  });
  parentLinks.push(child);
  if (parent.node.Data == null) {
    throw new InvalidPBNodeError("Parent node with no data passed to addToDirectory");
  }
  const node = UnixFS.unmarshal(parent.node.Data);
  let data;
  if (node.mtime != null) {
    const ms = Date.now();
    const secs = Math.floor(ms / 1e3);
    node.mtime = {
      secs: BigInt(secs),
      nsecs: (ms - secs * 1e3) * 1e3
    };
    data = node.marshal();
  } else {
    data = parent.node.Data;
  }
  parent.node = prepare({
    Data: data,
    Links: parentLinks
  });
  const buf2 = encode7(parent.node);
  const hash = await sha256.digest(buf2);
  const cid = CID2.create(parent.cid.version, code2, hash);
  await blockstore.put(cid, buf2);
  return {
    node: parent.node,
    cid
  };
};
var addToShardedDirectory = async (parent, child, blockstore, options) => {
  var _a;
  const { path: path6, hash } = await recreateShardedDirectory(parent.cid, child.Name, blockstore, options);
  const finalSegment = path6[path6.length - 1];
  if (finalSegment == null) {
    throw new Error("Invalid HAMT, could not generate path");
  }
  const prefix = finalSegment.prefix;
  const index = parseInt(prefix, 16);
  log2("next prefix for %s is %s", child.Name, prefix);
  const linkName = `${prefix}${child.Name}`;
  const existingLink = finalSegment.node.Links.find((l) => (l.Name ?? "").startsWith(prefix));
  if (existingLink != null) {
    log2("link %s was present in shard", linkName);
    if (existingLink.Name === linkName) {
      if (!options.allowOverwriting) {
        throw new AlreadyExistsError();
      }
      log2("overwriting %s in subshard", child.Name);
      finalSegment.node.Links = finalSegment.node.Links.filter((l) => l.Name !== linkName);
      finalSegment.node.Links.push({
        Name: linkName,
        Hash: child.Hash,
        Tsize: child.Tsize
      });
    } else if (((_a = existingLink.Name) == null ? void 0 : _a.length) === 2) {
      throw new Error("Existing link was subshard?!");
    } else {
      log2("prefix %s already exists, creating new subshard", prefix);
      const index2 = finalSegment.node.Links.findIndex((l) => {
        var _a2;
        return (_a2 = l.Name) == null ? void 0 : _a2.startsWith(prefix);
      });
      const sibling = finalSegment.node.Links.splice(index2, 1)[0];
      const siblingName = (sibling.Name ?? "").substring(2);
      const wrapped = wrapHash2(hamtHashFn2);
      const siblingHash = wrapped(fromString3(siblingName));
      for (let i = 0; i < path6.length; i++) {
        await siblingHash.take(hamtBucketBits);
      }
      while (true) {
        const siblingIndex = await siblingHash.take(hamtBucketBits);
        const siblingPrefix = toPrefix2(siblingIndex);
        sibling.Name = `${siblingPrefix}${siblingName}`;
        const newIndex = await hash.take(hamtBucketBits);
        const newPrefix = toPrefix2(newIndex);
        if (siblingPrefix === newPrefix) {
          const children2 = new import_sparse_array3.default();
          children2.set(newIndex, true);
          path6.push({
            prefix: newPrefix,
            children: children2,
            node: {
              Links: []
            }
          });
          continue;
        }
        const children = new import_sparse_array3.default();
        children.set(newIndex, true);
        children.set(siblingIndex, true);
        path6.push({
          prefix,
          children,
          node: {
            Links: [
              sibling,
              {
                Name: `${newPrefix}${child.Name}`,
                Hash: child.Hash,
                Tsize: child.Tsize
              }
            ]
          }
        });
        break;
      }
    }
  } else {
    log2("link %s was not present in sub-shard", linkName);
    child.Name = linkName;
    finalSegment.node.Links.push(child);
    finalSegment.children.set(index, true);
    log2("adding %s to existing sub-shard", linkName);
  }
  return updateShardedDirectory(path6, blockstore, options);
};

// node_modules/@helia/unixfs/dist/src/commands/utils/cid-to-directory.js
async function cidToDirectory(cid, blockstore, options = {}) {
  const entry = await exporter(cid, blockstore, options);
  if (entry.type !== "directory") {
    throw new NotADirectoryError(`${cid.toString()} was not a UnixFS directory`);
  }
  return {
    cid,
    node: entry.node
  };
}

// node_modules/@helia/unixfs/dist/src/commands/utils/cid-to-pblink.js
async function cidToPBLink(cid, name4, blockstore, options) {
  const sourceEntry = await exporter(cid, blockstore, options);
  if (sourceEntry.type !== "directory" && sourceEntry.type !== "file" && sourceEntry.type !== "raw") {
    throw new NotUnixFSError(`${cid.toString()} was not a UnixFS node`);
  }
  return {
    Name: name4,
    Tsize: sourceEntry.node instanceof Uint8Array ? sourceEntry.node.byteLength : dagNodeTsize(sourceEntry.node),
    Hash: cid
  };
}
function dagNodeTsize(node) {
  const linkSizes = node.Links.reduce((acc, curr) => acc + (curr.Tsize ?? 0), 0);
  return encode7(node).byteLength + linkSizes;
}

// node_modules/@helia/unixfs/dist/src/commands/utils/resolve.js
var log3 = logger("helia:unixfs:components:utils:resolve");
async function resolve5(cid, path6, blockstore, options) {
  if (path6 == null || path6 === "") {
    return { cid };
  }
  log3('resolve "%s" under %c', path6, cid);
  const parts = path6.split("/").filter(Boolean);
  const segments = [{
    name: "",
    cid,
    size: 0n
  }];
  for (let i = 0; i < parts.length; i++) {
    const part = parts[i];
    const result = await exporter(cid, blockstore, options);
    log3('resolving "%s"', part, result);
    if (result.type === "file") {
      if (i < parts.length - 1) {
        throw new InvalidParametersError("Path was invalid");
      }
      cid = result.cid;
    } else if (result.type === "directory") {
      let dirCid;
      for await (const entry of result.content()) {
        if (entry.name === part) {
          dirCid = entry.cid;
          break;
        }
      }
      if (dirCid == null) {
        throw new DoesNotExistError("Could not find path in directory");
      }
      cid = dirCid;
      segments.push({
        name: part,
        cid,
        size: result.size
      });
    } else {
      throw new InvalidParametersError("Could not resolve path");
    }
  }
  log3("resolved %s to %c", path6, cid);
  return {
    cid,
    path: path6,
    segments
  };
}
async function updatePathCids(cid, result, blockstore, options) {
  if (result.segments == null || result.segments.length === 0) {
    return cid;
  }
  let child = result.segments.pop();
  if (child == null) {
    throw new Error("Insufficient segments");
  }
  child.cid = cid;
  result.segments.reverse();
  for (const parent of result.segments) {
    const [directory, pblink] = await Promise.all([
      cidToDirectory(parent.cid, blockstore, options),
      cidToPBLink(child.cid, child.name, blockstore, options)
    ]);
    const result2 = await addLink(directory, pblink, blockstore, {
      ...options,
      allowOverwriting: true,
      cidVersion: cid.version
    });
    cid = result2.cid;
    parent.cid = cid;
    child = parent;
  }
  return cid;
}

// node_modules/@helia/unixfs/dist/src/commands/cat.js
var mergeOptions2 = merge_options_default.bind({ ignoreUndefined: true });
var defaultOptions = {};
async function* cat(cid, blockstore, options = {}) {
  const opts = mergeOptions2(defaultOptions, options);
  const resolved = await resolve5(cid, opts.path, blockstore, opts);
  const result = await exporter(resolved.cid, blockstore, opts);
  if (result.type !== "file" && result.type !== "raw") {
    throw new NotAFileError();
  }
  if (result.content == null) {
    throw new NoContentError();
  }
  yield* result.content(opts);
}

// node_modules/@helia/unixfs/dist/src/commands/utils/constants.js
var SHARD_SPLIT_THRESHOLD_BYTES = 262144;

// node_modules/@helia/unixfs/dist/src/commands/chmod.js
var mergeOptions3 = merge_options_default.bind({ ignoreUndefined: true });
var log4 = logger("helia:unixfs:chmod");
var defaultOptions2 = {
  recursive: false,
  shardSplitThresholdBytes: SHARD_SPLIT_THRESHOLD_BYTES
};
async function chmod(cid, mode, blockstore, options = {}) {
  const opts = mergeOptions3(defaultOptions2, options);
  const resolved = await resolve5(cid, opts.path, blockstore, options);
  log4("chmod %c %d", resolved.cid, mode);
  if (opts.recursive) {
    const root = await pipe(
      async function* () {
        for await (const entry of recursive(resolved.cid, blockstore, options)) {
          let metadata2;
          let links2 = [];
          if (entry.type === "raw") {
            metadata2 = new UnixFS({ type: "file", data: entry.node });
          } else if (entry.type === "file" || entry.type === "directory") {
            metadata2 = entry.unixfs;
            links2 = entry.node.Links;
          } else {
            throw new NotUnixFSError();
          }
          metadata2.mode = mode;
          const node = {
            Data: metadata2.marshal(),
            Links: links2
          };
          yield {
            path: entry.path,
            content: node
          };
        }
      },
      // @ts-expect-error cannot combine progress types
      (source) => importer(source, blockstore, {
        ...opts,
        dagBuilder: async function* (source2, block2) {
          for await (const entry of source2) {
            yield async function() {
              const node = entry.content;
              const buf2 = encode7(node);
              const updatedCid2 = await persist2(buf2, block2, {
                ...opts,
                cidVersion: cid.version
              });
              if (node.Data == null) {
                throw new InvalidPBNodeError(`${updatedCid2} had no data`);
              }
              const unixfs2 = UnixFS.unmarshal(node.Data);
              return {
                cid: updatedCid2,
                size: BigInt(buf2.length),
                path: entry.path,
                unixfs: unixfs2
              };
            };
          }
        }
      }),
      async (nodes) => src_default7(nodes)
    );
    if (root == null) {
      throw new UnknownError(`Could not chmod ${resolved.cid.toString()}`);
    }
    return updatePathCids(root.cid, resolved, blockstore, opts);
  }
  const block = await blockstore.get(resolved.cid, options);
  let metadata;
  let links = [];
  if (resolved.cid.code === code3) {
    metadata = new UnixFS({ type: "file", data: block });
  } else {
    const node = decode11(block);
    if (node.Data == null) {
      throw new InvalidPBNodeError(`${resolved.cid.toString()} had no data`);
    }
    links = node.Links;
    metadata = UnixFS.unmarshal(node.Data);
  }
  metadata.mode = mode;
  const updatedBlock = encode7({
    Data: metadata.marshal(),
    Links: links
  });
  const hash = await sha256.digest(updatedBlock);
  const updatedCid = CID2.create(resolved.cid.version, code2, hash);
  await blockstore.put(updatedCid, updatedBlock);
  return updatePathCids(updatedCid, resolved, blockstore, opts);
}

// node_modules/@helia/unixfs/dist/src/commands/cp.js
var mergeOptions4 = merge_options_default.bind({ ignoreUndefined: true });
var log5 = logger("helia:unixfs:cp");
var defaultOptions3 = {
  force: false,
  shardSplitThresholdBytes: SHARD_SPLIT_THRESHOLD_BYTES
};
async function cp(source, target, name4, blockstore, options = {}) {
  const opts = mergeOptions4(defaultOptions3, options);
  if (name4.includes("/")) {
    throw new InvalidParametersError("Name must not have slashes");
  }
  const [directory, pblink] = await Promise.all([
    cidToDirectory(target, blockstore, opts),
    cidToPBLink(source, name4, blockstore, opts)
  ]);
  log5('Adding %c as "%s" to %c', source, name4, target);
  const result = await addLink(directory, pblink, blockstore, {
    allowOverwriting: opts.force,
    cidVersion: target.version,
    ...opts
  });
  return result.cid;
}

// node_modules/@helia/unixfs/dist/src/commands/ls.js
var mergeOptions5 = merge_options_default.bind({ ignoreUndefined: true });
var defaultOptions4 = {};
async function* ls(cid, blockstore, options = {}) {
  const opts = mergeOptions5(defaultOptions4, options);
  const resolved = await resolve5(cid, opts.path, blockstore, opts);
  const result = await exporter(resolved.cid, blockstore);
  if (result.type === "file" || result.type === "raw") {
    yield result;
    return;
  }
  if (result.content == null) {
    throw new NoContentError();
  }
  if (result.type !== "directory") {
    throw new NotADirectoryError();
  }
  yield* result.content({
    offset: options.offset,
    length: options.length
  });
}

// node_modules/@helia/unixfs/dist/src/commands/mkdir.js
var mergeOptions6 = merge_options_default.bind({ ignoreUndefined: true });
var log6 = logger("helia:unixfs:mkdir");
var defaultOptions5 = {
  cidVersion: 1,
  force: false,
  shardSplitThresholdBytes: SHARD_SPLIT_THRESHOLD_BYTES
};
async function mkdir(parentCid, dirname, blockstore, options = {}) {
  const opts = mergeOptions6(defaultOptions5, options);
  if (dirname.includes("/")) {
    throw new InvalidParametersError("Path must not have slashes");
  }
  const entry = await exporter(parentCid, blockstore, options);
  if (entry.type !== "directory") {
    throw new NotADirectoryError(`${parentCid.toString()} was not a UnixFS directory`);
  }
  log6("creating %s", dirname);
  const metadata = new UnixFS({
    type: "directory",
    mode: opts.mode,
    mtime: opts.mtime
  });
  const node = {
    Data: metadata.marshal(),
    Links: []
  };
  const buf2 = encode7(node);
  const hash = await sha256.digest(buf2);
  const emptyDirCid = CID2.create(opts.cidVersion, code2, hash);
  await blockstore.put(emptyDirCid, buf2);
  const [directory, pblink] = await Promise.all([
    cidToDirectory(parentCid, blockstore, opts),
    cidToPBLink(emptyDirCid, dirname, blockstore, opts)
  ]);
  log6("adding empty dir called %s to %c", dirname, parentCid);
  const result = await addLink(directory, pblink, blockstore, {
    ...opts,
    allowOverwriting: opts.force
  });
  return result.cid;
}

// node_modules/@helia/unixfs/dist/src/commands/utils/remove-link.js
var log7 = logger("helia:unixfs:utils:remove-link");
async function removeLink(parent, name4, blockstore, options) {
  if (parent.node.Data == null) {
    throw new InvalidPBNodeError("Parent node had no data");
  }
  const meta = UnixFS.unmarshal(parent.node.Data);
  if (meta.type === "hamt-sharded-directory") {
    log7(`removing ${name4} from sharded directory`);
    const result = await removeFromShardedDirectory(parent, name4, blockstore, options);
    if (!await isOverShardThreshold(result.node, blockstore, options.shardSplitThresholdBytes, options)) {
      log7("converting shard to flat directory %c", parent.cid);
      return convertToFlatDirectory(result, blockstore, options);
    }
    return result;
  }
  log7(`removing link ${name4} regular directory`);
  return removeFromDirectory(parent, name4, blockstore, options);
}
var removeFromDirectory = async (parent, name4, blockstore, options) => {
  parent.node.Links = parent.node.Links.filter((link) => {
    return link.Name !== name4;
  });
  const parentBlock = encode7(parent.node);
  const parentCid = await persist2(parentBlock, blockstore, {
    ...options,
    cidVersion: parent.cid.version
  });
  log7(`Updated regular directory ${parentCid}`);
  return {
    node: parent.node,
    cid: parentCid
  };
};
var removeFromShardedDirectory = async (parent, name4, blockstore, options) => {
  const { path: path6 } = await recreateShardedDirectory(parent.cid, name4, blockstore, options);
  const finalSegment = path6[path6.length - 1];
  if (finalSegment == null) {
    throw new Error("Invalid HAMT, could not generate path");
  }
  const linkName = finalSegment.node.Links.filter((l) => (l.Name ?? "").substring(2) === name4).map((l) => l.Name).pop();
  if (linkName == null) {
    throw new Error("File not found");
  }
  const prefix = linkName.substring(0, 2);
  const index = parseInt(prefix, 16);
  finalSegment.node.Links = finalSegment.node.Links.filter((link) => link.Name !== linkName);
  finalSegment.children.unset(index);
  if (finalSegment.node.Links.length === 1) {
    while (true) {
      if (path6.length === 1) {
        break;
      }
      const segment = path6[path6.length - 1];
      if (segment == null || segment.node.Links.length > 1) {
        break;
      }
      path6.pop();
      const nextSegment = path6[path6.length - 1];
      if (nextSegment == null) {
        break;
      }
      const link = segment.node.Links[0];
      nextSegment.node.Links = nextSegment.node.Links.filter((l) => !(l.Name ?? "").startsWith(nextSegment.prefix));
      nextSegment.node.Links.push({
        Hash: link.Hash,
        Name: `${nextSegment.prefix}${(link.Name ?? "").substring(2)}`,
        Tsize: link.Tsize
      });
    }
  }
  return updateShardedDirectory(path6, blockstore, options);
};
var convertToFlatDirectory = async (parent, blockstore, options) => {
  if (parent.node.Data == null) {
    throw new InvalidParametersError("Invalid parent passed to convertToFlatDirectory");
  }
  const rootNode = {
    Links: []
  };
  const dir = await exporter(parent.cid, blockstore);
  if (dir.type !== "directory") {
    throw new Error("Unexpected node type");
  }
  for await (const entry of dir.content()) {
    let tsize = 0;
    if (entry.node instanceof Uint8Array) {
      tsize = entry.node.byteLength;
    } else {
      tsize = encode7(entry.node).length;
    }
    rootNode.Links.push({
      Hash: entry.cid,
      Name: entry.name,
      Tsize: tsize
    });
  }
  const oldUnixfs = UnixFS.unmarshal(parent.node.Data);
  rootNode.Data = new UnixFS({ type: "directory", mode: oldUnixfs.mode, mtime: oldUnixfs.mtime }).marshal();
  const block = encode7(prepare(rootNode));
  const cid = await persist2(block, blockstore, {
    codec: src_exports2,
    cidVersion: parent.cid.version,
    signal: options.signal
  });
  return {
    cid,
    node: rootNode
  };
};

// node_modules/@helia/unixfs/dist/src/commands/rm.js
var mergeOptions7 = merge_options_default.bind({ ignoreUndefined: true });
var log8 = logger("helia:unixfs:rm");
var defaultOptions6 = {
  shardSplitThresholdBytes: SHARD_SPLIT_THRESHOLD_BYTES
};
async function rm(target, name4, blockstore, options = {}) {
  const opts = mergeOptions7(defaultOptions6, options);
  if (name4.includes("/")) {
    throw new InvalidParametersError("Name must not have slashes");
  }
  const directory = await cidToDirectory(target, blockstore, opts);
  log8("Removing %s from %c", name4, target);
  const result = await removeLink(directory, name4, blockstore, {
    ...opts,
    cidVersion: target.version
  });
  return result.cid;
}

// node_modules/@helia/unixfs/dist/src/commands/stat.js
var mergeOptions8 = merge_options_default.bind({ ignoreUndefined: true });
var log9 = logger("helia:unixfs:stat");
var defaultOptions7 = {};
async function stat(cid, blockstore, options = {}) {
  var _a;
  const opts = mergeOptions8(defaultOptions7, options);
  const resolved = await resolve5(cid, options.path, blockstore, opts);
  log9("stat %c", resolved.cid);
  const result = await exporter(resolved.cid, blockstore, opts);
  if (result.type !== "file" && result.type !== "directory" && result.type !== "raw") {
    throw new NotUnixFSError();
  }
  let fileSize = 0n;
  let dagSize = 0n;
  let localFileSize = 0n;
  let localDagSize = 0n;
  let blocks = 0;
  let mode;
  let mtime;
  const type = result.type;
  let unixfs2;
  if (result.type === "raw") {
    fileSize = BigInt(result.node.byteLength);
    dagSize = BigInt(result.node.byteLength);
    localFileSize = BigInt(result.node.byteLength);
    localDagSize = BigInt(result.node.byteLength);
    blocks = 1;
  }
  if (result.type === "directory") {
    fileSize = 0n;
    dagSize = BigInt(result.unixfs.marshal().byteLength);
    localFileSize = 0n;
    localDagSize = dagSize;
    blocks = 1;
    mode = result.unixfs.mode;
    mtime = result.unixfs.mtime;
    unixfs2 = result.unixfs;
  }
  if (result.type === "file") {
    const results = await inspectDag(resolved.cid, blockstore, opts);
    fileSize = result.unixfs.fileSize();
    dagSize = BigInt((((_a = result.node.Data) == null ? void 0 : _a.byteLength) ?? 0) + result.node.Links.reduce((acc, curr) => acc + (curr.Tsize ?? 0), 0));
    localFileSize = BigInt(results.localFileSize);
    localDagSize = BigInt(results.localDagSize);
    blocks = results.blocks;
    mode = result.unixfs.mode;
    mtime = result.unixfs.mtime;
    unixfs2 = result.unixfs;
  }
  return {
    cid: resolved.cid,
    mode,
    mtime,
    fileSize,
    dagSize,
    localFileSize,
    localDagSize,
    blocks,
    type,
    unixfs: unixfs2
  };
}
async function inspectDag(cid, blockstore, options) {
  const results = {
    localFileSize: 0,
    localDagSize: 0,
    blocks: 0
  };
  if (await blockstore.has(cid, options)) {
    const block = await blockstore.get(cid, options);
    results.blocks++;
    results.localDagSize += block.byteLength;
    if (cid.code === code3) {
      results.localFileSize += block.byteLength;
    } else if (cid.code === code2) {
      const pbNode = decode11(block);
      if (pbNode.Links.length > 0) {
        for (const link of pbNode.Links) {
          const linkResult = await inspectDag(link.Hash, blockstore, options);
          results.localFileSize += linkResult.localFileSize;
          results.localDagSize += linkResult.localDagSize;
          results.blocks += linkResult.blocks;
        }
      } else {
        if (pbNode.Data == null) {
          throw new InvalidPBNodeError(`PBNode ${cid.toString()} had no data`);
        }
        const unixfs2 = UnixFS.unmarshal(pbNode.Data);
        if (unixfs2.data == null) {
          throw new InvalidPBNodeError(`UnixFS node ${cid.toString()} had no data`);
        }
        results.localFileSize += unixfs2.data.byteLength ?? 0;
      }
    } else {
      throw new UnknownError(`${cid.toString()} was neither DAG_PB nor RAW`);
    }
  }
  return results;
}

// node_modules/@helia/unixfs/dist/src/commands/touch.js
var mergeOptions9 = merge_options_default.bind({ ignoreUndefined: true });
var log10 = logger("helia:unixfs:touch");
var defaultOptions8 = {
  recursive: false,
  shardSplitThresholdBytes: SHARD_SPLIT_THRESHOLD_BYTES
};
async function touch(cid, blockstore, options = {}) {
  const opts = mergeOptions9(defaultOptions8, options);
  const resolved = await resolve5(cid, opts.path, blockstore, opts);
  const mtime = opts.mtime ?? {
    secs: BigInt(Math.round(Date.now() / 1e3)),
    nsecs: 0
  };
  log10("touch %c %o", resolved.cid, mtime);
  if (opts.recursive) {
    const root = await pipe(
      async function* () {
        for await (const entry of recursive(resolved.cid, blockstore)) {
          let metadata2;
          let links2;
          if (entry.type === "raw") {
            metadata2 = new UnixFS({ data: entry.node });
            links2 = [];
          } else if (entry.type === "file" || entry.type === "directory") {
            metadata2 = entry.unixfs;
            links2 = entry.node.Links;
          } else {
            throw new NotUnixFSError();
          }
          metadata2.mtime = mtime;
          const node = {
            Data: metadata2.marshal(),
            Links: links2
          };
          yield {
            path: entry.path,
            content: node
          };
        }
      },
      // @ts-expect-error blockstore types are incompatible
      (source) => importer(source, blockstore, {
        ...opts,
        dagBuilder: async function* (source2, block2) {
          for await (const entry of source2) {
            yield async function() {
              const node = entry.content;
              const buf2 = encode7(node);
              const updatedCid2 = await persist2(buf2, block2, {
                ...opts,
                cidVersion: cid.version
              });
              if (node.Data == null) {
                throw new InvalidPBNodeError(`${updatedCid2} had no data`);
              }
              const unixfs2 = UnixFS.unmarshal(node.Data);
              return {
                cid: updatedCid2,
                size: BigInt(buf2.length),
                path: entry.path,
                unixfs: unixfs2
              };
            };
          }
        }
      }),
      async (nodes) => src_default7(nodes)
    );
    if (root == null) {
      throw new UnknownError(`Could not chmod ${resolved.cid.toString()}`);
    }
    return updatePathCids(root.cid, resolved, blockstore, opts);
  }
  const block = await blockstore.get(resolved.cid, options);
  let metadata;
  let links = [];
  if (resolved.cid.code === code3) {
    metadata = new UnixFS({ data: block });
  } else {
    const node = decode11(block);
    links = node.Links;
    if (node.Data == null) {
      throw new InvalidPBNodeError(`${resolved.cid.toString()} had no data`);
    }
    metadata = UnixFS.unmarshal(node.Data);
  }
  metadata.mtime = mtime;
  const updatedBlock = encode7({
    Data: metadata.marshal(),
    Links: links
  });
  const hash = await sha256.digest(updatedBlock);
  const updatedCid = CID2.create(resolved.cid.version, code2, hash);
  await blockstore.put(updatedCid, updatedBlock);
  return updatePathCids(updatedCid, resolved, blockstore, opts);
}

// node_modules/it-glob/dist/src/index.js
import fs4 from "fs/promises";
import path2 from "path";

// node_modules/minimatch/dist/mjs/index.js
var import_brace_expansion = __toESM(require_brace_expansion(), 1);

// node_modules/minimatch/dist/mjs/assert-valid-pattern.js
var MAX_PATTERN_LENGTH = 1024 * 64;
var assertValidPattern = (pattern) => {
  if (typeof pattern !== "string") {
    throw new TypeError("invalid pattern");
  }
  if (pattern.length > MAX_PATTERN_LENGTH) {
    throw new TypeError("pattern is too long");
  }
};

// node_modules/minimatch/dist/mjs/brace-expressions.js
var posixClasses = {
  "[:alnum:]": ["\\p{L}\\p{Nl}\\p{Nd}", true],
  "[:alpha:]": ["\\p{L}\\p{Nl}", true],
  "[:ascii:]": ["\\x00-\\x7f", false],
  "[:blank:]": ["\\p{Zs}\\t", true],
  "[:cntrl:]": ["\\p{Cc}", true],
  "[:digit:]": ["\\p{Nd}", true],
  "[:graph:]": ["\\p{Z}\\p{C}", true, true],
  "[:lower:]": ["\\p{Ll}", true],
  "[:print:]": ["\\p{C}", true],
  "[:punct:]": ["\\p{P}", true],
  "[:space:]": ["\\p{Z}\\t\\r\\n\\v\\f", true],
  "[:upper:]": ["\\p{Lu}", true],
  "[:word:]": ["\\p{L}\\p{Nl}\\p{Nd}\\p{Pc}", true],
  "[:xdigit:]": ["A-Fa-f0-9", false]
};
var braceEscape = (s) => s.replace(/[[\]\\-]/g, "\\$&");
var regexpEscape = (s) => s.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");
var rangesToString = (ranges) => ranges.join("");
var parseClass = (glob2, position) => {
  const pos = position;
  if (glob2.charAt(pos) !== "[") {
    throw new Error("not in a brace expression");
  }
  const ranges = [];
  const negs = [];
  let i = pos + 1;
  let sawStart = false;
  let uflag = false;
  let escaping = false;
  let negate = false;
  let endPos = pos;
  let rangeStart = "";
  WHILE:
    while (i < glob2.length) {
      const c = glob2.charAt(i);
      if ((c === "!" || c === "^") && i === pos + 1) {
        negate = true;
        i++;
        continue;
      }
      if (c === "]" && sawStart && !escaping) {
        endPos = i + 1;
        break;
      }
      sawStart = true;
      if (c === "\\") {
        if (!escaping) {
          escaping = true;
          i++;
          continue;
        }
      }
      if (c === "[" && !escaping) {
        for (const [cls, [unip, u, neg]] of Object.entries(posixClasses)) {
          if (glob2.startsWith(cls, i)) {
            if (rangeStart) {
              return ["$.", false, glob2.length - pos, true];
            }
            i += cls.length;
            if (neg)
              negs.push(unip);
            else
              ranges.push(unip);
            uflag = uflag || u;
            continue WHILE;
          }
        }
      }
      escaping = false;
      if (rangeStart) {
        if (c > rangeStart) {
          ranges.push(braceEscape(rangeStart) + "-" + braceEscape(c));
        } else if (c === rangeStart) {
          ranges.push(braceEscape(c));
        }
        rangeStart = "";
        i++;
        continue;
      }
      if (glob2.startsWith("-]", i + 1)) {
        ranges.push(braceEscape(c + "-"));
        i += 2;
        continue;
      }
      if (glob2.startsWith("-", i + 1)) {
        rangeStart = c;
        i += 2;
        continue;
      }
      ranges.push(braceEscape(c));
      i++;
    }
  if (endPos < i) {
    return ["", false, 0, false];
  }
  if (!ranges.length && !negs.length) {
    return ["$.", false, glob2.length - pos, true];
  }
  if (negs.length === 0 && ranges.length === 1 && /^\\?.$/.test(ranges[0]) && !negate) {
    const r = ranges[0].length === 2 ? ranges[0].slice(-1) : ranges[0];
    return [regexpEscape(r), false, endPos - pos, false];
  }
  const sranges = "[" + (negate ? "^" : "") + rangesToString(ranges) + "]";
  const snegs = "[" + (negate ? "" : "^") + rangesToString(negs) + "]";
  const comb = ranges.length && negs.length ? "(" + sranges + "|" + snegs + ")" : ranges.length ? sranges : snegs;
  return [comb, uflag, endPos - pos, true];
};

// node_modules/minimatch/dist/mjs/unescape.js
var unescape = (s, { windowsPathsNoEscape = false } = {}) => {
  return windowsPathsNoEscape ? s.replace(/\[([^\/\\])\]/g, "$1") : s.replace(/((?!\\).|^)\[([^\/\\])\]/g, "$1$2").replace(/\\([^\/])/g, "$1");
};

// node_modules/minimatch/dist/mjs/ast.js
var types2 = /* @__PURE__ */ new Set(["!", "?", "+", "*", "@"]);
var isExtglobType = (c) => types2.has(c);
var startNoTraversal = "(?!(?:^|/)\\.\\.?(?:$|/))";
var startNoDot = "(?!\\.)";
var addPatternStart = /* @__PURE__ */ new Set(["[", "."]);
var justDots = /* @__PURE__ */ new Set(["..", "."]);
var reSpecials = new Set("().*{}+?[]^$\\!");
var regExpEscape = (s) => s.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");
var qmark = "[^/]";
var star = qmark + "*?";
var starNoEmpty = qmark + "+?";
var AST = class _AST {
  type;
  #root;
  #hasMagic;
  #uflag = false;
  #parts = [];
  #parent;
  #parentIndex;
  #negs;
  #filledNegs = false;
  #options;
  #toString;
  // set to true if it's an extglob with no children
  // (which really means one child of '')
  #emptyExt = false;
  constructor(type, parent, options = {}) {
    this.type = type;
    if (type)
      this.#hasMagic = true;
    this.#parent = parent;
    this.#root = this.#parent ? this.#parent.#root : this;
    this.#options = this.#root === this ? options : this.#root.#options;
    this.#negs = this.#root === this ? [] : this.#root.#negs;
    if (type === "!" && !this.#root.#filledNegs)
      this.#negs.push(this);
    this.#parentIndex = this.#parent ? this.#parent.#parts.length : 0;
  }
  get hasMagic() {
    if (this.#hasMagic !== void 0)
      return this.#hasMagic;
    for (const p of this.#parts) {
      if (typeof p === "string")
        continue;
      if (p.type || p.hasMagic)
        return this.#hasMagic = true;
    }
    return this.#hasMagic;
  }
  // reconstructs the pattern
  toString() {
    if (this.#toString !== void 0)
      return this.#toString;
    if (!this.type) {
      return this.#toString = this.#parts.map((p) => String(p)).join("");
    } else {
      return this.#toString = this.type + "(" + this.#parts.map((p) => String(p)).join("|") + ")";
    }
  }
  #fillNegs() {
    if (this !== this.#root)
      throw new Error("should only call on root");
    if (this.#filledNegs)
      return this;
    this.toString();
    this.#filledNegs = true;
    let n;
    while (n = this.#negs.pop()) {
      if (n.type !== "!")
        continue;
      let p = n;
      let pp = p.#parent;
      while (pp) {
        for (let i = p.#parentIndex + 1; !pp.type && i < pp.#parts.length; i++) {
          for (const part of n.#parts) {
            if (typeof part === "string") {
              throw new Error("string part in extglob AST??");
            }
            part.copyIn(pp.#parts[i]);
          }
        }
        p = pp;
        pp = p.#parent;
      }
    }
    return this;
  }
  push(...parts) {
    for (const p of parts) {
      if (p === "")
        continue;
      if (typeof p !== "string" && !(p instanceof _AST && p.#parent === this)) {
        throw new Error("invalid part: " + p);
      }
      this.#parts.push(p);
    }
  }
  toJSON() {
    var _a;
    const ret = this.type === null ? this.#parts.slice().map((p) => typeof p === "string" ? p : p.toJSON()) : [this.type, ...this.#parts.map((p) => p.toJSON())];
    if (this.isStart() && !this.type)
      ret.unshift([]);
    if (this.isEnd() && (this === this.#root || this.#root.#filledNegs && ((_a = this.#parent) == null ? void 0 : _a.type) === "!")) {
      ret.push({});
    }
    return ret;
  }
  isStart() {
    var _a;
    if (this.#root === this)
      return true;
    if (!((_a = this.#parent) == null ? void 0 : _a.isStart()))
      return false;
    if (this.#parentIndex === 0)
      return true;
    const p = this.#parent;
    for (let i = 0; i < this.#parentIndex; i++) {
      const pp = p.#parts[i];
      if (!(pp instanceof _AST && pp.type === "!")) {
        return false;
      }
    }
    return true;
  }
  isEnd() {
    var _a, _b, _c;
    if (this.#root === this)
      return true;
    if (((_a = this.#parent) == null ? void 0 : _a.type) === "!")
      return true;
    if (!((_b = this.#parent) == null ? void 0 : _b.isEnd()))
      return false;
    if (!this.type)
      return (_c = this.#parent) == null ? void 0 : _c.isEnd();
    const pl = this.#parent ? this.#parent.#parts.length : 0;
    return this.#parentIndex === pl - 1;
  }
  copyIn(part) {
    if (typeof part === "string")
      this.push(part);
    else
      this.push(part.clone(this));
  }
  clone(parent) {
    const c = new _AST(this.type, parent);
    for (const p of this.#parts) {
      c.copyIn(p);
    }
    return c;
  }
  static #parseAST(str, ast, pos, opt) {
    let escaping = false;
    let inBrace = false;
    let braceStart = -1;
    let braceNeg = false;
    if (ast.type === null) {
      let i2 = pos;
      let acc2 = "";
      while (i2 < str.length) {
        const c = str.charAt(i2++);
        if (escaping || c === "\\") {
          escaping = !escaping;
          acc2 += c;
          continue;
        }
        if (inBrace) {
          if (i2 === braceStart + 1) {
            if (c === "^" || c === "!") {
              braceNeg = true;
            }
          } else if (c === "]" && !(i2 === braceStart + 2 && braceNeg)) {
            inBrace = false;
          }
          acc2 += c;
          continue;
        } else if (c === "[") {
          inBrace = true;
          braceStart = i2;
          braceNeg = false;
          acc2 += c;
          continue;
        }
        if (!opt.noext && isExtglobType(c) && str.charAt(i2) === "(") {
          ast.push(acc2);
          acc2 = "";
          const ext2 = new _AST(c, ast);
          i2 = _AST.#parseAST(str, ext2, i2, opt);
          ast.push(ext2);
          continue;
        }
        acc2 += c;
      }
      ast.push(acc2);
      return i2;
    }
    let i = pos + 1;
    let part = new _AST(null, ast);
    const parts = [];
    let acc = "";
    while (i < str.length) {
      const c = str.charAt(i++);
      if (escaping || c === "\\") {
        escaping = !escaping;
        acc += c;
        continue;
      }
      if (inBrace) {
        if (i === braceStart + 1) {
          if (c === "^" || c === "!") {
            braceNeg = true;
          }
        } else if (c === "]" && !(i === braceStart + 2 && braceNeg)) {
          inBrace = false;
        }
        acc += c;
        continue;
      } else if (c === "[") {
        inBrace = true;
        braceStart = i;
        braceNeg = false;
        acc += c;
        continue;
      }
      if (isExtglobType(c) && str.charAt(i) === "(") {
        part.push(acc);
        acc = "";
        const ext2 = new _AST(c, part);
        part.push(ext2);
        i = _AST.#parseAST(str, ext2, i, opt);
        continue;
      }
      if (c === "|") {
        part.push(acc);
        acc = "";
        parts.push(part);
        part = new _AST(null, ast);
        continue;
      }
      if (c === ")") {
        if (acc === "" && ast.#parts.length === 0) {
          ast.#emptyExt = true;
        }
        part.push(acc);
        acc = "";
        ast.push(...parts, part);
        return i;
      }
      acc += c;
    }
    ast.type = null;
    ast.#hasMagic = void 0;
    ast.#parts = [str.substring(pos - 1)];
    return i;
  }
  static fromGlob(pattern, options = {}) {
    const ast = new _AST(null, void 0, options);
    _AST.#parseAST(pattern, ast, 0, options);
    return ast;
  }
  // returns the regular expression if there's magic, or the unescaped
  // string if not.
  toMMPattern() {
    if (this !== this.#root)
      return this.#root.toMMPattern();
    const glob2 = this.toString();
    const [re, body, hasMagic, uflag] = this.toRegExpSource();
    const anyMagic = hasMagic || this.#hasMagic || this.#options.nocase && !this.#options.nocaseMagicOnly && glob2.toUpperCase() !== glob2.toLowerCase();
    if (!anyMagic) {
      return body;
    }
    const flags = (this.#options.nocase ? "i" : "") + (uflag ? "u" : "");
    return Object.assign(new RegExp(`^${re}$`, flags), {
      _src: re,
      _glob: glob2
    });
  }
  // returns the string match, the regexp source, whether there's magic
  // in the regexp (so a regular expression is required) and whether or
  // not the uflag is needed for the regular expression (for posix classes)
  // TODO: instead of injecting the start/end at this point, just return
  // the BODY of the regexp, along with the start/end portions suitable
  // for binding the start/end in either a joined full-path makeRe context
  // (where we bind to (^|/), or a standalone matchPart context (where
  // we bind to ^, and not /).  Otherwise slashes get duped!
  //
  // In part-matching mode, the start is:
  // - if not isStart: nothing
  // - if traversal possible, but not allowed: ^(?!\.\.?$)
  // - if dots allowed or not possible: ^
  // - if dots possible and not allowed: ^(?!\.)
  // end is:
  // - if not isEnd(): nothing
  // - else: $
  //
  // In full-path matching mode, we put the slash at the START of the
  // pattern, so start is:
  // - if first pattern: same as part-matching mode
  // - if not isStart(): nothing
  // - if traversal possible, but not allowed: /(?!\.\.?(?:$|/))
  // - if dots allowed or not possible: /
  // - if dots possible and not allowed: /(?!\.)
  // end is:
  // - if last pattern, same as part-matching mode
  // - else nothing
  //
  // Always put the (?:$|/) on negated tails, though, because that has to be
  // there to bind the end of the negated pattern portion, and it's easier to
  // just stick it in now rather than try to inject it later in the middle of
  // the pattern.
  //
  // We can just always return the same end, and leave it up to the caller
  // to know whether it's going to be used joined or in parts.
  // And, if the start is adjusted slightly, can do the same there:
  // - if not isStart: nothing
  // - if traversal possible, but not allowed: (?:/|^)(?!\.\.?$)
  // - if dots allowed or not possible: (?:/|^)
  // - if dots possible and not allowed: (?:/|^)(?!\.)
  //
  // But it's better to have a simpler binding without a conditional, for
  // performance, so probably better to return both start options.
  //
  // Then the caller just ignores the end if it's not the first pattern,
  // and the start always gets applied.
  //
  // But that's always going to be $ if it's the ending pattern, or nothing,
  // so the caller can just attach $ at the end of the pattern when building.
  //
  // So the todo is:
  // - better detect what kind of start is needed
  // - return both flavors of starting pattern
  // - attach $ at the end of the pattern when creating the actual RegExp
  //
  // Ah, but wait, no, that all only applies to the root when the first pattern
  // is not an extglob. If the first pattern IS an extglob, then we need all
  // that dot prevention biz to live in the extglob portions, because eg
  // +(*|.x*) can match .xy but not .yx.
  //
  // So, return the two flavors if it's #root and the first child is not an
  // AST, otherwise leave it to the child AST to handle it, and there,
  // use the (?:^|/) style of start binding.
  //
  // Even simplified further:
  // - Since the start for a join is eg /(?!\.) and the start for a part
  // is ^(?!\.), we can just prepend (?!\.) to the pattern (either root
  // or start or whatever) and prepend ^ or / at the Regexp construction.
  toRegExpSource(allowDot) {
    var _a;
    const dot = allowDot ?? !!this.#options.dot;
    if (this.#root === this)
      this.#fillNegs();
    if (!this.type) {
      const noEmpty = this.isStart() && this.isEnd();
      const src3 = this.#parts.map((p) => {
        const [re, _, hasMagic, uflag] = typeof p === "string" ? _AST.#parseGlob(p, this.#hasMagic, noEmpty) : p.toRegExpSource(allowDot);
        this.#hasMagic = this.#hasMagic || hasMagic;
        this.#uflag = this.#uflag || uflag;
        return re;
      }).join("");
      let start2 = "";
      if (this.isStart()) {
        if (typeof this.#parts[0] === "string") {
          const dotTravAllowed = this.#parts.length === 1 && justDots.has(this.#parts[0]);
          if (!dotTravAllowed) {
            const aps = addPatternStart;
            const needNoTrav = (
              // dots are allowed, and the pattern starts with [ or .
              dot && aps.has(src3.charAt(0)) || // the pattern starts with \., and then [ or .
              src3.startsWith("\\.") && aps.has(src3.charAt(2)) || // the pattern starts with \.\., and then [ or .
              src3.startsWith("\\.\\.") && aps.has(src3.charAt(4))
            );
            const needNoDot = !dot && !allowDot && aps.has(src3.charAt(0));
            start2 = needNoTrav ? startNoTraversal : needNoDot ? startNoDot : "";
          }
        }
      }
      let end = "";
      if (this.isEnd() && this.#root.#filledNegs && ((_a = this.#parent) == null ? void 0 : _a.type) === "!") {
        end = "(?:$|\\/)";
      }
      const final2 = start2 + src3 + end;
      return [
        final2,
        unescape(src3),
        this.#hasMagic = !!this.#hasMagic,
        this.#uflag
      ];
    }
    const repeated = this.type === "*" || this.type === "+";
    const start = this.type === "!" ? "(?:(?!(?:" : "(?:";
    let body = this.#partsToRegExp(dot);
    if (this.isStart() && this.isEnd() && !body && this.type !== "!") {
      const s = this.toString();
      this.#parts = [s];
      this.type = null;
      this.#hasMagic = void 0;
      return [s, unescape(this.toString()), false, false];
    }
    let bodyDotAllowed = !repeated || allowDot || dot || !startNoDot ? "" : this.#partsToRegExp(true);
    if (bodyDotAllowed === body) {
      bodyDotAllowed = "";
    }
    if (bodyDotAllowed) {
      body = `(?:${body})(?:${bodyDotAllowed})*?`;
    }
    let final = "";
    if (this.type === "!" && this.#emptyExt) {
      final = (this.isStart() && !dot ? startNoDot : "") + starNoEmpty;
    } else {
      const close = this.type === "!" ? (
        // !() must match something,but !(x) can match ''
        "))" + (this.isStart() && !dot && !allowDot ? startNoDot : "") + star + ")"
      ) : this.type === "@" ? ")" : this.type === "?" ? ")?" : this.type === "+" && bodyDotAllowed ? ")" : this.type === "*" && bodyDotAllowed ? `)?` : `)${this.type}`;
      final = start + body + close;
    }
    return [
      final,
      unescape(body),
      this.#hasMagic = !!this.#hasMagic,
      this.#uflag
    ];
  }
  #partsToRegExp(dot) {
    return this.#parts.map((p) => {
      if (typeof p === "string") {
        throw new Error("string type in extglob ast??");
      }
      const [re, _, _hasMagic, uflag] = p.toRegExpSource(dot);
      this.#uflag = this.#uflag || uflag;
      return re;
    }).filter((p) => !(this.isStart() && this.isEnd()) || !!p).join("|");
  }
  static #parseGlob(glob2, hasMagic, noEmpty = false) {
    let escaping = false;
    let re = "";
    let uflag = false;
    for (let i = 0; i < glob2.length; i++) {
      const c = glob2.charAt(i);
      if (escaping) {
        escaping = false;
        re += (reSpecials.has(c) ? "\\" : "") + c;
        continue;
      }
      if (c === "\\") {
        if (i === glob2.length - 1) {
          re += "\\\\";
        } else {
          escaping = true;
        }
        continue;
      }
      if (c === "[") {
        const [src3, needUflag, consumed, magic] = parseClass(glob2, i);
        if (consumed) {
          re += src3;
          uflag = uflag || needUflag;
          i += consumed - 1;
          hasMagic = hasMagic || magic;
          continue;
        }
      }
      if (c === "*") {
        if (noEmpty && glob2 === "*")
          re += starNoEmpty;
        else
          re += star;
        hasMagic = true;
        continue;
      }
      if (c === "?") {
        re += qmark;
        hasMagic = true;
        continue;
      }
      re += regExpEscape(c);
    }
    return [re, unescape(glob2), !!hasMagic, uflag];
  }
};

// node_modules/minimatch/dist/mjs/escape.js
var escape = (s, { windowsPathsNoEscape = false } = {}) => {
  return windowsPathsNoEscape ? s.replace(/[?*()[\]]/g, "[$&]") : s.replace(/[?*()[\]\\]/g, "\\$&");
};

// node_modules/minimatch/dist/mjs/index.js
var minimatch = (p, pattern, options = {}) => {
  assertValidPattern(pattern);
  if (!options.nocomment && pattern.charAt(0) === "#") {
    return false;
  }
  return new Minimatch(pattern, options).match(p);
};
var starDotExtRE = /^\*+([^+@!?\*\[\(]*)$/;
var starDotExtTest = (ext2) => (f) => !f.startsWith(".") && f.endsWith(ext2);
var starDotExtTestDot = (ext2) => (f) => f.endsWith(ext2);
var starDotExtTestNocase = (ext2) => {
  ext2 = ext2.toLowerCase();
  return (f) => !f.startsWith(".") && f.toLowerCase().endsWith(ext2);
};
var starDotExtTestNocaseDot = (ext2) => {
  ext2 = ext2.toLowerCase();
  return (f) => f.toLowerCase().endsWith(ext2);
};
var starDotStarRE = /^\*+\.\*+$/;
var starDotStarTest = (f) => !f.startsWith(".") && f.includes(".");
var starDotStarTestDot = (f) => f !== "." && f !== ".." && f.includes(".");
var dotStarRE = /^\.\*+$/;
var dotStarTest = (f) => f !== "." && f !== ".." && f.startsWith(".");
var starRE = /^\*+$/;
var starTest = (f) => f.length !== 0 && !f.startsWith(".");
var starTestDot = (f) => f.length !== 0 && f !== "." && f !== "..";
var qmarksRE = /^\?+([^+@!?\*\[\(]*)?$/;
var qmarksTestNocase = ([$0, ext2 = ""]) => {
  const noext = qmarksTestNoExt([$0]);
  if (!ext2)
    return noext;
  ext2 = ext2.toLowerCase();
  return (f) => noext(f) && f.toLowerCase().endsWith(ext2);
};
var qmarksTestNocaseDot = ([$0, ext2 = ""]) => {
  const noext = qmarksTestNoExtDot([$0]);
  if (!ext2)
    return noext;
  ext2 = ext2.toLowerCase();
  return (f) => noext(f) && f.toLowerCase().endsWith(ext2);
};
var qmarksTestDot = ([$0, ext2 = ""]) => {
  const noext = qmarksTestNoExtDot([$0]);
  return !ext2 ? noext : (f) => noext(f) && f.endsWith(ext2);
};
var qmarksTest = ([$0, ext2 = ""]) => {
  const noext = qmarksTestNoExt([$0]);
  return !ext2 ? noext : (f) => noext(f) && f.endsWith(ext2);
};
var qmarksTestNoExt = ([$0]) => {
  const len = $0.length;
  return (f) => f.length === len && !f.startsWith(".");
};
var qmarksTestNoExtDot = ([$0]) => {
  const len = $0.length;
  return (f) => f.length === len && f !== "." && f !== "..";
};
var defaultPlatform = typeof process === "object" && process ? typeof process.env === "object" && process.env && process.env.__MINIMATCH_TESTING_PLATFORM__ || process.platform : "posix";
var path = {
  win32: { sep: "\\" },
  posix: { sep: "/" }
};
var sep = defaultPlatform === "win32" ? path.win32.sep : path.posix.sep;
minimatch.sep = sep;
var GLOBSTAR = Symbol("globstar **");
minimatch.GLOBSTAR = GLOBSTAR;
var qmark2 = "[^/]";
var star2 = qmark2 + "*?";
var twoStarDot = "(?:(?!(?:\\/|^)(?:\\.{1,2})($|\\/)).)*?";
var twoStarNoDot = "(?:(?!(?:\\/|^)\\.).)*?";
var filter2 = (pattern, options = {}) => (p) => minimatch(p, pattern, options);
minimatch.filter = filter2;
var ext = (a, b = {}) => Object.assign({}, a, b);
var defaults = (def) => {
  if (!def || typeof def !== "object" || !Object.keys(def).length) {
    return minimatch;
  }
  const orig = minimatch;
  const m = (p, pattern, options = {}) => orig(p, pattern, ext(def, options));
  return Object.assign(m, {
    Minimatch: class Minimatch extends orig.Minimatch {
      constructor(pattern, options = {}) {
        super(pattern, ext(def, options));
      }
      static defaults(options) {
        return orig.defaults(ext(def, options)).Minimatch;
      }
    },
    AST: class AST extends orig.AST {
      /* c8 ignore start */
      constructor(type, parent, options = {}) {
        super(type, parent, ext(def, options));
      }
      /* c8 ignore stop */
      static fromGlob(pattern, options = {}) {
        return orig.AST.fromGlob(pattern, ext(def, options));
      }
    },
    unescape: (s, options = {}) => orig.unescape(s, ext(def, options)),
    escape: (s, options = {}) => orig.escape(s, ext(def, options)),
    filter: (pattern, options = {}) => orig.filter(pattern, ext(def, options)),
    defaults: (options) => orig.defaults(ext(def, options)),
    makeRe: (pattern, options = {}) => orig.makeRe(pattern, ext(def, options)),
    braceExpand: (pattern, options = {}) => orig.braceExpand(pattern, ext(def, options)),
    match: (list, pattern, options = {}) => orig.match(list, pattern, ext(def, options)),
    sep: orig.sep,
    GLOBSTAR
  });
};
minimatch.defaults = defaults;
var braceExpand = (pattern, options = {}) => {
  assertValidPattern(pattern);
  if (options.nobrace || !/\{(?:(?!\{).)*\}/.test(pattern)) {
    return [pattern];
  }
  return (0, import_brace_expansion.default)(pattern);
};
minimatch.braceExpand = braceExpand;
var makeRe = (pattern, options = {}) => new Minimatch(pattern, options).makeRe();
minimatch.makeRe = makeRe;
var match = (list, pattern, options = {}) => {
  const mm = new Minimatch(pattern, options);
  list = list.filter((f) => mm.match(f));
  if (mm.options.nonull && !list.length) {
    list.push(pattern);
  }
  return list;
};
minimatch.match = match;
var globMagic = /[?*]|[+@!]\(.*?\)|\[|\]/;
var regExpEscape2 = (s) => s.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");
var Minimatch = class {
  options;
  set;
  pattern;
  windowsPathsNoEscape;
  nonegate;
  negate;
  comment;
  empty;
  preserveMultipleSlashes;
  partial;
  globSet;
  globParts;
  nocase;
  isWindows;
  platform;
  windowsNoMagicRoot;
  regexp;
  constructor(pattern, options = {}) {
    assertValidPattern(pattern);
    options = options || {};
    this.options = options;
    this.pattern = pattern;
    this.platform = options.platform || defaultPlatform;
    this.isWindows = this.platform === "win32";
    this.windowsPathsNoEscape = !!options.windowsPathsNoEscape || options.allowWindowsEscape === false;
    if (this.windowsPathsNoEscape) {
      this.pattern = this.pattern.replace(/\\/g, "/");
    }
    this.preserveMultipleSlashes = !!options.preserveMultipleSlashes;
    this.regexp = null;
    this.negate = false;
    this.nonegate = !!options.nonegate;
    this.comment = false;
    this.empty = false;
    this.partial = !!options.partial;
    this.nocase = !!this.options.nocase;
    this.windowsNoMagicRoot = options.windowsNoMagicRoot !== void 0 ? options.windowsNoMagicRoot : !!(this.isWindows && this.nocase);
    this.globSet = [];
    this.globParts = [];
    this.set = [];
    this.make();
  }
  hasMagic() {
    if (this.options.magicalBraces && this.set.length > 1) {
      return true;
    }
    for (const pattern of this.set) {
      for (const part of pattern) {
        if (typeof part !== "string")
          return true;
      }
    }
    return false;
  }
  debug(..._) {
  }
  make() {
    const pattern = this.pattern;
    const options = this.options;
    if (!options.nocomment && pattern.charAt(0) === "#") {
      this.comment = true;
      return;
    }
    if (!pattern) {
      this.empty = true;
      return;
    }
    this.parseNegate();
    this.globSet = [...new Set(this.braceExpand())];
    if (options.debug) {
      this.debug = (...args) => console.error(...args);
    }
    this.debug(this.pattern, this.globSet);
    const rawGlobParts = this.globSet.map((s) => this.slashSplit(s));
    this.globParts = this.preprocess(rawGlobParts);
    this.debug(this.pattern, this.globParts);
    let set = this.globParts.map((s, _, __) => {
      if (this.isWindows && this.windowsNoMagicRoot) {
        const isUNC = s[0] === "" && s[1] === "" && (s[2] === "?" || !globMagic.test(s[2])) && !globMagic.test(s[3]);
        const isDrive = /^[a-z]:/i.test(s[0]);
        if (isUNC) {
          return [...s.slice(0, 4), ...s.slice(4).map((ss) => this.parse(ss))];
        } else if (isDrive) {
          return [s[0], ...s.slice(1).map((ss) => this.parse(ss))];
        }
      }
      return s.map((ss) => this.parse(ss));
    });
    this.debug(this.pattern, set);
    this.set = set.filter((s) => s.indexOf(false) === -1);
    if (this.isWindows) {
      for (let i = 0; i < this.set.length; i++) {
        const p = this.set[i];
        if (p[0] === "" && p[1] === "" && this.globParts[i][2] === "?" && typeof p[3] === "string" && /^[a-z]:$/i.test(p[3])) {
          p[2] = "?";
        }
      }
    }
    this.debug(this.pattern, this.set);
  }
  // various transforms to equivalent pattern sets that are
  // faster to process in a filesystem walk.  The goal is to
  // eliminate what we can, and push all ** patterns as far
  // to the right as possible, even if it increases the number
  // of patterns that we have to process.
  preprocess(globParts) {
    if (this.options.noglobstar) {
      for (let i = 0; i < globParts.length; i++) {
        for (let j = 0; j < globParts[i].length; j++) {
          if (globParts[i][j] === "**") {
            globParts[i][j] = "*";
          }
        }
      }
    }
    const { optimizationLevel = 1 } = this.options;
    if (optimizationLevel >= 2) {
      globParts = this.firstPhasePreProcess(globParts);
      globParts = this.secondPhasePreProcess(globParts);
    } else if (optimizationLevel >= 1) {
      globParts = this.levelOneOptimize(globParts);
    } else {
      globParts = this.adjascentGlobstarOptimize(globParts);
    }
    return globParts;
  }
  // just get rid of adjascent ** portions
  adjascentGlobstarOptimize(globParts) {
    return globParts.map((parts) => {
      let gs = -1;
      while (-1 !== (gs = parts.indexOf("**", gs + 1))) {
        let i = gs;
        while (parts[i + 1] === "**") {
          i++;
        }
        if (i !== gs) {
          parts.splice(gs, i - gs);
        }
      }
      return parts;
    });
  }
  // get rid of adjascent ** and resolve .. portions
  levelOneOptimize(globParts) {
    return globParts.map((parts) => {
      parts = parts.reduce((set, part) => {
        const prev = set[set.length - 1];
        if (part === "**" && prev === "**") {
          return set;
        }
        if (part === "..") {
          if (prev && prev !== ".." && prev !== "." && prev !== "**") {
            set.pop();
            return set;
          }
        }
        set.push(part);
        return set;
      }, []);
      return parts.length === 0 ? [""] : parts;
    });
  }
  levelTwoFileOptimize(parts) {
    if (!Array.isArray(parts)) {
      parts = this.slashSplit(parts);
    }
    let didSomething = false;
    do {
      didSomething = false;
      if (!this.preserveMultipleSlashes) {
        for (let i = 1; i < parts.length - 1; i++) {
          const p = parts[i];
          if (i === 1 && p === "" && parts[0] === "")
            continue;
          if (p === "." || p === "") {
            didSomething = true;
            parts.splice(i, 1);
            i--;
          }
        }
        if (parts[0] === "." && parts.length === 2 && (parts[1] === "." || parts[1] === "")) {
          didSomething = true;
          parts.pop();
        }
      }
      let dd = 0;
      while (-1 !== (dd = parts.indexOf("..", dd + 1))) {
        const p = parts[dd - 1];
        if (p && p !== "." && p !== ".." && p !== "**") {
          didSomething = true;
          parts.splice(dd - 1, 2);
          dd -= 2;
        }
      }
    } while (didSomething);
    return parts.length === 0 ? [""] : parts;
  }
  // First phase: single-pattern processing
  // <pre> is 1 or more portions
  // <rest> is 1 or more portions
  // <p> is any portion other than ., .., '', or **
  // <e> is . or ''
  //
  // **/.. is *brutal* for filesystem walking performance, because
  // it effectively resets the recursive walk each time it occurs,
  // and ** cannot be reduced out by a .. pattern part like a regexp
  // or most strings (other than .., ., and '') can be.
  //
  // <pre>/**/../<p>/<p>/<rest> -> {<pre>/../<p>/<p>/<rest>,<pre>/**/<p>/<p>/<rest>}
  // <pre>/<e>/<rest> -> <pre>/<rest>
  // <pre>/<p>/../<rest> -> <pre>/<rest>
  // **/**/<rest> -> **/<rest>
  //
  // **/*/<rest> -> */**/<rest> <== not valid because ** doesn't follow
  // this WOULD be allowed if ** did follow symlinks, or * didn't
  firstPhasePreProcess(globParts) {
    let didSomething = false;
    do {
      didSomething = false;
      for (let parts of globParts) {
        let gs = -1;
        while (-1 !== (gs = parts.indexOf("**", gs + 1))) {
          let gss = gs;
          while (parts[gss + 1] === "**") {
            gss++;
          }
          if (gss > gs) {
            parts.splice(gs + 1, gss - gs);
          }
          let next = parts[gs + 1];
          const p = parts[gs + 2];
          const p2 = parts[gs + 3];
          if (next !== "..")
            continue;
          if (!p || p === "." || p === ".." || !p2 || p2 === "." || p2 === "..") {
            continue;
          }
          didSomething = true;
          parts.splice(gs, 1);
          const other = parts.slice(0);
          other[gs] = "**";
          globParts.push(other);
          gs--;
        }
        if (!this.preserveMultipleSlashes) {
          for (let i = 1; i < parts.length - 1; i++) {
            const p = parts[i];
            if (i === 1 && p === "" && parts[0] === "")
              continue;
            if (p === "." || p === "") {
              didSomething = true;
              parts.splice(i, 1);
              i--;
            }
          }
          if (parts[0] === "." && parts.length === 2 && (parts[1] === "." || parts[1] === "")) {
            didSomething = true;
            parts.pop();
          }
        }
        let dd = 0;
        while (-1 !== (dd = parts.indexOf("..", dd + 1))) {
          const p = parts[dd - 1];
          if (p && p !== "." && p !== ".." && p !== "**") {
            didSomething = true;
            const needDot = dd === 1 && parts[dd + 1] === "**";
            const splin = needDot ? ["."] : [];
            parts.splice(dd - 1, 2, ...splin);
            if (parts.length === 0)
              parts.push("");
            dd -= 2;
          }
        }
      }
    } while (didSomething);
    return globParts;
  }
  // second phase: multi-pattern dedupes
  // {<pre>/*/<rest>,<pre>/<p>/<rest>} -> <pre>/*/<rest>
  // {<pre>/<rest>,<pre>/<rest>} -> <pre>/<rest>
  // {<pre>/**/<rest>,<pre>/<rest>} -> <pre>/**/<rest>
  //
  // {<pre>/**/<rest>,<pre>/**/<p>/<rest>} -> <pre>/**/<rest>
  // ^-- not valid because ** doens't follow symlinks
  secondPhasePreProcess(globParts) {
    for (let i = 0; i < globParts.length - 1; i++) {
      for (let j = i + 1; j < globParts.length; j++) {
        const matched = this.partsMatch(globParts[i], globParts[j], !this.preserveMultipleSlashes);
        if (!matched)
          continue;
        globParts[i] = matched;
        globParts[j] = [];
      }
    }
    return globParts.filter((gs) => gs.length);
  }
  partsMatch(a, b, emptyGSMatch = false) {
    let ai = 0;
    let bi = 0;
    let result = [];
    let which = "";
    while (ai < a.length && bi < b.length) {
      if (a[ai] === b[bi]) {
        result.push(which === "b" ? b[bi] : a[ai]);
        ai++;
        bi++;
      } else if (emptyGSMatch && a[ai] === "**" && b[bi] === a[ai + 1]) {
        result.push(a[ai]);
        ai++;
      } else if (emptyGSMatch && b[bi] === "**" && a[ai] === b[bi + 1]) {
        result.push(b[bi]);
        bi++;
      } else if (a[ai] === "*" && b[bi] && (this.options.dot || !b[bi].startsWith(".")) && b[bi] !== "**") {
        if (which === "b")
          return false;
        which = "a";
        result.push(a[ai]);
        ai++;
        bi++;
      } else if (b[bi] === "*" && a[ai] && (this.options.dot || !a[ai].startsWith(".")) && a[ai] !== "**") {
        if (which === "a")
          return false;
        which = "b";
        result.push(b[bi]);
        ai++;
        bi++;
      } else {
        return false;
      }
    }
    return a.length === b.length && result;
  }
  parseNegate() {
    if (this.nonegate)
      return;
    const pattern = this.pattern;
    let negate = false;
    let negateOffset = 0;
    for (let i = 0; i < pattern.length && pattern.charAt(i) === "!"; i++) {
      negate = !negate;
      negateOffset++;
    }
    if (negateOffset)
      this.pattern = pattern.slice(negateOffset);
    this.negate = negate;
  }
  // set partial to true to test if, for example,
  // "/a/b" matches the start of "/*/b/*/d"
  // Partial means, if you run out of file before you run
  // out of pattern, then that's fine, as long as all
  // the parts match.
  matchOne(file, pattern, partial = false) {
    const options = this.options;
    if (this.isWindows) {
      const fileDrive = typeof file[0] === "string" && /^[a-z]:$/i.test(file[0]);
      const fileUNC = !fileDrive && file[0] === "" && file[1] === "" && file[2] === "?" && /^[a-z]:$/i.test(file[3]);
      const patternDrive = typeof pattern[0] === "string" && /^[a-z]:$/i.test(pattern[0]);
      const patternUNC = !patternDrive && pattern[0] === "" && pattern[1] === "" && pattern[2] === "?" && typeof pattern[3] === "string" && /^[a-z]:$/i.test(pattern[3]);
      const fdi = fileUNC ? 3 : fileDrive ? 0 : void 0;
      const pdi = patternUNC ? 3 : patternDrive ? 0 : void 0;
      if (typeof fdi === "number" && typeof pdi === "number") {
        const [fd, pd] = [file[fdi], pattern[pdi]];
        if (fd.toLowerCase() === pd.toLowerCase()) {
          pattern[pdi] = fd;
          if (pdi > fdi) {
            pattern = pattern.slice(pdi);
          } else if (fdi > pdi) {
            file = file.slice(fdi);
          }
        }
      }
    }
    const { optimizationLevel = 1 } = this.options;
    if (optimizationLevel >= 2) {
      file = this.levelTwoFileOptimize(file);
    }
    this.debug("matchOne", this, { file, pattern });
    this.debug("matchOne", file.length, pattern.length);
    for (var fi = 0, pi = 0, fl = file.length, pl = pattern.length; fi < fl && pi < pl; fi++, pi++) {
      this.debug("matchOne loop");
      var p = pattern[pi];
      var f = file[fi];
      this.debug(pattern, p, f);
      if (p === false) {
        return false;
      }
      if (p === GLOBSTAR) {
        this.debug("GLOBSTAR", [pattern, p, f]);
        var fr = fi;
        var pr = pi + 1;
        if (pr === pl) {
          this.debug("** at the end");
          for (; fi < fl; fi++) {
            if (file[fi] === "." || file[fi] === ".." || !options.dot && file[fi].charAt(0) === ".")
              return false;
          }
          return true;
        }
        while (fr < fl) {
          var swallowee = file[fr];
          this.debug("\nglobstar while", file, fr, pattern, pr, swallowee);
          if (this.matchOne(file.slice(fr), pattern.slice(pr), partial)) {
            this.debug("globstar found match!", fr, fl, swallowee);
            return true;
          } else {
            if (swallowee === "." || swallowee === ".." || !options.dot && swallowee.charAt(0) === ".") {
              this.debug("dot detected!", file, fr, pattern, pr);
              break;
            }
            this.debug("globstar swallow a segment, and continue");
            fr++;
          }
        }
        if (partial) {
          this.debug("\n>>> no match, partial?", file, fr, pattern, pr);
          if (fr === fl) {
            return true;
          }
        }
        return false;
      }
      let hit;
      if (typeof p === "string") {
        hit = f === p;
        this.debug("string match", p, f, hit);
      } else {
        hit = p.test(f);
        this.debug("pattern match", p, f, hit);
      }
      if (!hit)
        return false;
    }
    if (fi === fl && pi === pl) {
      return true;
    } else if (fi === fl) {
      return partial;
    } else if (pi === pl) {
      return fi === fl - 1 && file[fi] === "";
    } else {
      throw new Error("wtf?");
    }
  }
  braceExpand() {
    return braceExpand(this.pattern, this.options);
  }
  parse(pattern) {
    assertValidPattern(pattern);
    const options = this.options;
    if (pattern === "**")
      return GLOBSTAR;
    if (pattern === "")
      return "";
    let m;
    let fastTest = null;
    if (m = pattern.match(starRE)) {
      fastTest = options.dot ? starTestDot : starTest;
    } else if (m = pattern.match(starDotExtRE)) {
      fastTest = (options.nocase ? options.dot ? starDotExtTestNocaseDot : starDotExtTestNocase : options.dot ? starDotExtTestDot : starDotExtTest)(m[1]);
    } else if (m = pattern.match(qmarksRE)) {
      fastTest = (options.nocase ? options.dot ? qmarksTestNocaseDot : qmarksTestNocase : options.dot ? qmarksTestDot : qmarksTest)(m);
    } else if (m = pattern.match(starDotStarRE)) {
      fastTest = options.dot ? starDotStarTestDot : starDotStarTest;
    } else if (m = pattern.match(dotStarRE)) {
      fastTest = dotStarTest;
    }
    const re = AST.fromGlob(pattern, this.options).toMMPattern();
    return fastTest ? Object.assign(re, { test: fastTest }) : re;
  }
  makeRe() {
    if (this.regexp || this.regexp === false)
      return this.regexp;
    const set = this.set;
    if (!set.length) {
      this.regexp = false;
      return this.regexp;
    }
    const options = this.options;
    const twoStar = options.noglobstar ? star2 : options.dot ? twoStarDot : twoStarNoDot;
    const flags = new Set(options.nocase ? ["i"] : []);
    let re = set.map((pattern) => {
      const pp = pattern.map((p) => {
        if (p instanceof RegExp) {
          for (const f of p.flags.split(""))
            flags.add(f);
        }
        return typeof p === "string" ? regExpEscape2(p) : p === GLOBSTAR ? GLOBSTAR : p._src;
      });
      pp.forEach((p, i) => {
        const next = pp[i + 1];
        const prev = pp[i - 1];
        if (p !== GLOBSTAR || prev === GLOBSTAR) {
          return;
        }
        if (prev === void 0) {
          if (next !== void 0 && next !== GLOBSTAR) {
            pp[i + 1] = "(?:\\/|" + twoStar + "\\/)?" + next;
          } else {
            pp[i] = twoStar;
          }
        } else if (next === void 0) {
          pp[i - 1] = prev + "(?:\\/|" + twoStar + ")?";
        } else if (next !== GLOBSTAR) {
          pp[i - 1] = prev + "(?:\\/|\\/" + twoStar + "\\/)" + next;
          pp[i + 1] = GLOBSTAR;
        }
      });
      return pp.filter((p) => p !== GLOBSTAR).join("/");
    }).join("|");
    const [open, close] = set.length > 1 ? ["(?:", ")"] : ["", ""];
    re = "^" + open + re + close + "$";
    if (this.negate)
      re = "^(?!" + re + ").+$";
    try {
      this.regexp = new RegExp(re, [...flags].join(""));
    } catch (ex) {
      this.regexp = false;
    }
    return this.regexp;
  }
  slashSplit(p) {
    if (this.preserveMultipleSlashes) {
      return p.split("/");
    } else if (this.isWindows && /^\/\/[^\/]+/.test(p)) {
      return ["", ...p.split(/\/+/)];
    } else {
      return p.split(/\/+/);
    }
  }
  match(f, partial = this.partial) {
    this.debug("match", f, this.pattern);
    if (this.comment) {
      return false;
    }
    if (this.empty) {
      return f === "";
    }
    if (f === "/" && partial) {
      return true;
    }
    const options = this.options;
    if (this.isWindows) {
      f = f.split("\\").join("/");
    }
    const ff = this.slashSplit(f);
    this.debug(this.pattern, "split", ff);
    const set = this.set;
    this.debug(this.pattern, "set", set);
    let filename = ff[ff.length - 1];
    if (!filename) {
      for (let i = ff.length - 2; !filename && i >= 0; i--) {
        filename = ff[i];
      }
    }
    for (let i = 0; i < set.length; i++) {
      const pattern = set[i];
      let file = ff;
      if (options.matchBase && pattern.length === 1) {
        file = [filename];
      }
      const hit = this.matchOne(file, pattern, partial);
      if (hit) {
        if (options.flipNegate) {
          return true;
        }
        return !this.negate;
      }
    }
    if (options.flipNegate) {
      return false;
    }
    return this.negate;
  }
  static defaults(def) {
    return minimatch.defaults(def).Minimatch;
  }
};
minimatch.AST = AST;
minimatch.Minimatch = Minimatch;
minimatch.escape = escape;
minimatch.unescape = unescape;

// node_modules/it-glob/dist/src/index.js
async function* glob(dir, pattern, options = {}) {
  const absoluteDir = path2.resolve(dir);
  const relativeDir = path2.relative(options.cwd ?? process.cwd(), dir);
  const stats = await fs4.stat(absoluteDir);
  if (stats.isDirectory()) {
    for await (const entry of _glob(absoluteDir, "", pattern, options)) {
      yield entry;
    }
    return;
  }
  if (minimatch(relativeDir, pattern, options)) {
    yield options.absolute === true ? absoluteDir : relativeDir;
  }
}
async function* _glob(base3, dir, pattern, options) {
  for await (const entry of await fs4.opendir(path2.join(base3, dir))) {
    const relativeEntryPath = path2.join(dir, entry.name);
    const absoluteEntryPath = path2.join(base3, dir, entry.name);
    let match2 = minimatch(relativeEntryPath, pattern, options);
    const isDirectory = entry.isDirectory();
    if (isDirectory && options.nodir === true) {
      match2 = false;
    }
    if (match2) {
      yield options.absolute === true ? absoluteEntryPath : relativeEntryPath;
    }
    if (isDirectory) {
      yield* _glob(base3, relativeEntryPath, pattern, options);
    }
  }
}

// node_modules/@helia/unixfs/dist/src/index.js
var DefaultUnixFS = class {
  components;
  constructor(components) {
    this.components = components;
  }
  async *addAll(source, options = {}) {
    yield* addAll(source, this.components.blockstore, options);
  }
  async addBytes(bytes, options = {}) {
    return addBytes(bytes, this.components.blockstore, options);
  }
  async addByteStream(bytes, options = {}) {
    return addByteStream(bytes, this.components.blockstore, options);
  }
  async addFile(file, options = {}) {
    return addFile(file, this.components.blockstore, options);
  }
  async addDirectory(dir = {}, options = {}) {
    return addDirectory(dir, this.components.blockstore, options);
  }
  async *cat(cid, options = {}) {
    yield* cat(cid, this.components.blockstore, options);
  }
  async chmod(cid, mode, options = {}) {
    return chmod(cid, mode, this.components.blockstore, options);
  }
  async cp(source, target, name4, options = {}) {
    return cp(source, target, name4, this.components.blockstore, options);
  }
  async *ls(cid, options = {}) {
    yield* ls(cid, this.components.blockstore, options);
  }
  async mkdir(cid, dirname, options = {}) {
    return mkdir(cid, dirname, this.components.blockstore, options);
  }
  async rm(cid, path6, options = {}) {
    return rm(cid, path6, this.components.blockstore, options);
  }
  async stat(cid, options = {}) {
    return stat(cid, this.components.blockstore, options);
  }
  async touch(cid, options = {}) {
    return touch(cid, this.components.blockstore, options);
  }
};
function unixfs(helia) {
  return new DefaultUnixFS(helia);
}

// node_modules/blockstore-fs/dist/src/index.js
import fs5 from "node:fs/promises";
import path4 from "node:path";
import { promisify as promisify3 } from "node:util";

// node_modules/blockstore-core/dist/src/errors.js
var errors_exports = {};
__export(errors_exports, {
  abortedError: () => abortedError,
  closeFailedError: () => closeFailedError,
  deleteFailedError: () => deleteFailedError,
  getFailedError: () => getFailedError,
  hasFailedError: () => hasFailedError,
  notFoundError: () => notFoundError,
  openFailedError: () => openFailedError,
  putFailedError: () => putFailedError
});
var import_err_code16 = __toESM(require_err_code(), 1);
function openFailedError(err) {
  err = err ?? new Error("Open failed");
  return (0, import_err_code16.default)(err, "ERR_OPEN_FAILED");
}
function closeFailedError(err) {
  err = err ?? new Error("Close failed");
  return (0, import_err_code16.default)(err, "ERR_CLOSE_FAILED");
}
function putFailedError(err) {
  err = err ?? new Error("Put failed");
  return (0, import_err_code16.default)(err, "ERR_PUT_FAILED");
}
function getFailedError(err) {
  err = err ?? new Error("Get failed");
  return (0, import_err_code16.default)(err, "ERR_GET_FAILED");
}
function deleteFailedError(err) {
  err = err ?? new Error("Delete failed");
  return (0, import_err_code16.default)(err, "ERR_DELETE_FAILED");
}
function hasFailedError(err) {
  err = err ?? new Error("Has failed");
  return (0, import_err_code16.default)(err, "ERR_HAS_FAILED");
}
function notFoundError(err) {
  err = err ?? new Error("Not Found");
  return (0, import_err_code16.default)(err, "ERR_NOT_FOUND");
}
function abortedError(err) {
  err = err ?? new Error("Aborted");
  return (0, import_err_code16.default)(err, "ERR_ABORTED");
}

// node_modules/blockstore-core/node_modules/@libp2p/logger/dist/src/index.js
var import_debug2 = __toESM(require_src2(), 1);
import_debug2.default.formatters.b = (v) => {
  return v == null ? "undefined" : base58btc2.baseEncode(v);
};
import_debug2.default.formatters.t = (v) => {
  return v == null ? "undefined" : base322.baseEncode(v);
};
import_debug2.default.formatters.m = (v) => {
  return v == null ? "undefined" : base64.baseEncode(v);
};
import_debug2.default.formatters.p = (v) => {
  return v == null ? "undefined" : v.toString();
};
import_debug2.default.formatters.c = (v) => {
  return v == null ? "undefined" : v.toString();
};
import_debug2.default.formatters.k = (v) => {
  return v == null ? "undefined" : v.toString();
};
import_debug2.default.formatters.a = (v) => {
  return v == null ? "undefined" : v.toString();
};
function createDisabledLogger2(namespace) {
  const logger3 = () => {
  };
  logger3.enabled = false;
  logger3.color = "";
  logger3.diff = 0;
  logger3.log = () => {
  };
  logger3.namespace = namespace;
  logger3.destroy = () => true;
  logger3.extend = () => logger3;
  return logger3;
}
function logger2(name4) {
  let trace = createDisabledLogger2(`${name4}:trace`);
  if (import_debug2.default.enabled(`${name4}:trace`) && import_debug2.default.names.map((r) => r.toString()).find((n) => n.includes(":trace")) != null) {
    trace = (0, import_debug2.default)(`${name4}:trace`);
  }
  return Object.assign((0, import_debug2.default)(name4), {
    error: (0, import_debug2.default)(`${name4}:error`),
    trace
  });
}

// node_modules/blockstore-core/dist/src/tiered.js
var log11 = logger2("blockstore:core:tiered");

// node_modules/blockstore-core/dist/src/index.js
var Errors = {
  ...errors_exports
};

// node_modules/blockstore-fs/dist/src/index.js
var import_fast_write_atomic = __toESM(require_fast_write_atomic(), 1);

// node_modules/blockstore-fs/dist/src/sharding.js
import path3 from "node:path";
var NextToLast = class {
  extension;
  prefixLength;
  base;
  constructor(init = {}) {
    this.extension = init.extension ?? ".data";
    this.prefixLength = init.prefixLength ?? 2;
    this.base = init.base ?? base32upper2;
  }
  encode(cid) {
    const str = this.base.encoder.encode(cid.multihash.bytes);
    const prefix = str.substring(str.length - this.prefixLength);
    return {
      dir: prefix,
      file: `${str}${this.extension}`
    };
  }
  decode(str) {
    let fileName = path3.basename(str);
    if (fileName.endsWith(this.extension)) {
      fileName = fileName.substring(0, fileName.length - this.extension.length);
    }
    return CID2.decode(this.base.decoder.decode(fileName));
  }
};

// node_modules/blockstore-fs/dist/src/index.js
var writeAtomic = promisify3(import_fast_write_atomic.default);
async function writeFile(file, contents) {
  try {
    await writeAtomic(file, contents);
  } catch (err) {
    if (err.code === "EPERM" && err.syscall === "rename") {
      await fs5.access(file, fs5.constants.F_OK | fs5.constants.W_OK);
      return;
    }
    throw err;
  }
}
var FsBlockstore = class {
  path;
  createIfMissing;
  errorIfExists;
  putManyConcurrency;
  getManyConcurrency;
  deleteManyConcurrency;
  shardingStrategy;
  constructor(location, init = {}) {
    this.path = path4.resolve(location);
    this.createIfMissing = init.createIfMissing ?? true;
    this.errorIfExists = init.errorIfExists ?? false;
    this.deleteManyConcurrency = init.deleteManyConcurrency ?? 50;
    this.getManyConcurrency = init.getManyConcurrency ?? 50;
    this.putManyConcurrency = init.putManyConcurrency ?? 50;
    this.shardingStrategy = init.shardingStrategy ?? new NextToLast();
  }
  async open() {
    try {
      await fs5.access(this.path, fs5.constants.F_OK | fs5.constants.W_OK);
      if (this.errorIfExists) {
        throw Errors.openFailedError(new Error(`Blockstore directory: ${this.path} already exists`));
      }
    } catch (err) {
      if (err.code === "ENOENT") {
        if (this.createIfMissing) {
          await fs5.mkdir(this.path, { recursive: true });
          return;
        } else {
          throw Errors.openFailedError(new Error(`Blockstore directory: ${this.path} does not exist`));
        }
      }
      throw err;
    }
  }
  async close() {
    await Promise.resolve();
  }
  async put(key, val) {
    const { dir, file } = this.shardingStrategy.encode(key);
    try {
      if (dir != null && dir !== "") {
        await fs5.mkdir(path4.join(this.path, dir), {
          recursive: true
        });
      }
      await writeFile(path4.join(this.path, dir, file), val);
      return key;
    } catch (err) {
      throw Errors.putFailedError(err);
    }
  }
  async *putMany(source) {
    yield* parallelBatch(src_default3(source, ({ cid, block }) => {
      return async () => {
        await this.put(cid, block);
        return cid;
      };
    }), this.putManyConcurrency);
  }
  async get(key) {
    const { dir, file } = this.shardingStrategy.encode(key);
    try {
      return await fs5.readFile(path4.join(this.path, dir, file));
    } catch (err) {
      throw Errors.notFoundError(err);
    }
  }
  async *getMany(source) {
    yield* parallelBatch(src_default3(source, (key) => {
      return async () => {
        return {
          cid: key,
          block: await this.get(key)
        };
      };
    }), this.getManyConcurrency);
  }
  async delete(key) {
    const { dir, file } = this.shardingStrategy.encode(key);
    try {
      await fs5.unlink(path4.join(this.path, dir, file));
    } catch (err) {
      if (err.code === "ENOENT") {
        return;
      }
      throw Errors.deleteFailedError(err);
    }
  }
  async *deleteMany(source) {
    yield* parallelBatch(src_default3(source, (key) => {
      return async () => {
        await this.delete(key);
        return key;
      };
    }), this.deleteManyConcurrency);
  }
  /**
   * Check for the existence of the given key
   */
  async has(key) {
    const { dir, file } = this.shardingStrategy.encode(key);
    try {
      await fs5.access(path4.join(this.path, dir, file));
    } catch (err) {
      return false;
    }
    return true;
  }
  async *getAll() {
    const pattern = `**/*${this.shardingStrategy.extension}`.split(path4.sep).join("/");
    const files = glob(this.path, pattern, {
      absolute: true
    });
    for await (const file of files) {
      try {
        const buf2 = await fs5.readFile(file);
        const pair = {
          cid: this.shardingStrategy.decode(file),
          block: buf2
        };
        yield pair;
      } catch (err) {
        if (err.code !== "ENOENT") {
          throw err;
        }
      }
    }
  }
};

// src/objectManager.js
import { createReadStream, createWriteStream } from "node:fs";
import { mkdir as mkdir2, rm as rm2 } from "node:fs/promises";
import os from "node:os";
import path5 from "node:path";
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
        temporaryBlockstoreDir = path5.resolve(
          os.tmpdir(),
          "filebase-sdk",
          "uploads",
          uploadUUID
        );
        temporaryCarFilePath = `${temporaryBlockstoreDir}/main.car`;
        await mkdir2(temporaryBlockstoreDir, { recursive: true });
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
          await rm2(temporaryBlockstoreDir, { recursive: true, force: true });
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
