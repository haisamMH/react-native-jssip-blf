"use strict";

function _typeof(obj) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (obj) { return typeof obj; } : function (obj) { return obj && "function" == typeof Symbol && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }, _typeof(obj); }
function _createForOfIteratorHelper(o, allowArrayLike) { var it = typeof Symbol !== "undefined" && o[Symbol.iterator] || o["@@iterator"]; if (!it) { if (Array.isArray(o) || (it = _unsupportedIterableToArray(o)) || allowArrayLike && o && typeof o.length === "number") { if (it) o = it; var i = 0; var F = function F() {}; return { s: F, n: function n() { if (i >= o.length) return { done: true }; return { done: false, value: o[i++] }; }, e: function e(_e) { throw _e; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var normalCompletion = true, didErr = false, err; return { s: function s() { it = it.call(o); }, n: function n() { var step = it.next(); normalCompletion = step.done; return step; }, e: function e(_e2) { didErr = true; err = _e2; }, f: function f() { try { if (!normalCompletion && it["return"] != null) it["return"](); } finally { if (didErr) throw err; } } }; }
function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }
function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) arr2[i] = arr[i]; return arr2; }
function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, _toPropertyKey(descriptor.key), descriptor); } }
function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); Object.defineProperty(Constructor, "prototype", { writable: false }); return Constructor; }
function _toPropertyKey(arg) { var key = _toPrimitive(arg, "string"); return _typeof(key) === "symbol" ? key : String(key); }
function _toPrimitive(input, hint) { if (_typeof(input) !== "object" || input === null) return input; var prim = input[Symbol.toPrimitive]; if (prim !== undefined) { var res = prim.call(input, hint || "default"); if (_typeof(res) !== "object") return res; throw new TypeError("@@toPrimitive must return a primitive value."); } return (hint === "string" ? String : Number)(input); }
var JsSIP_C = require('./Constants');
var Utils = require('./Utils');
var Grammar = require('./Grammar');

/**
 * -param {String} [scheme]
 * -param {String} [user]
 * -param {String} host
 * -param {String} [port]
 * -param {Object} [parameters]
 * -param {Object} [headers]
 *
 */
module.exports = /*#__PURE__*/function () {
  function URI(scheme, user, host, port) {
    var parameters = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : {};
    var headers = arguments.length > 5 && arguments[5] !== undefined ? arguments[5] : {};
    _classCallCheck(this, URI);
    // Checks.
    if (!host) {
      throw new TypeError('missing or invalid "host" parameter');
    }

    // Initialize parameters.
    this._parameters = {};
    this._headers = {};
    this._scheme = scheme || JsSIP_C.SIP;
    this._user = user;
    this._host = host;
    this._port = port;
    for (var param in parameters) {
      if (Object.prototype.hasOwnProperty.call(parameters, param)) {
        this.setParam(param, parameters[param]);
      }
    }
    for (var header in headers) {
      if (Object.prototype.hasOwnProperty.call(headers, header)) {
        this.setHeader(header, headers[header]);
      }
    }
  }
  _createClass(URI, [{
    key: "scheme",
    get: function get() {
      return this._scheme;
    },
    set: function set(value) {
      this._scheme = value.toLowerCase();
    }
  }, {
    key: "user",
    get: function get() {
      return this._user;
    },
    set: function set(value) {
      this._user = value;
    }
  }, {
    key: "host",
    get: function get() {
      return this._host;
    },
    set: function set(value) {
      this._host = value.toLowerCase();
    }
  }, {
    key: "port",
    get: function get() {
      return this._port;
    },
    set: function set(value) {
      this._port = value === 0 ? value : parseInt(value, 10) || null;
    }
  }, {
    key: "setParam",
    value: function setParam(key, value) {
      if (key) {
        this._parameters[key.toLowerCase()] = typeof value === 'undefined' || value === null ? null : value.toString();
      }
    }
  }, {
    key: "getParam",
    value: function getParam(key) {
      if (key) {
        return this._parameters[key.toLowerCase()];
      }
    }
  }, {
    key: "hasParam",
    value: function hasParam(key) {
      if (key) {
        return this._parameters.hasOwnProperty(key.toLowerCase()) && true || false;
      }
    }
  }, {
    key: "deleteParam",
    value: function deleteParam(parameter) {
      parameter = parameter.toLowerCase();
      if (this._parameters.hasOwnProperty(parameter)) {
        var value = this._parameters[parameter];
        delete this._parameters[parameter];
        return value;
      }
    }
  }, {
    key: "clearParams",
    value: function clearParams() {
      this._parameters = {};
    }
  }, {
    key: "setHeader",
    value: function setHeader(name, value) {
      this._headers[Utils.headerize(name)] = Array.isArray(value) ? value : [value];
    }
  }, {
    key: "getHeader",
    value: function getHeader(name) {
      if (name) {
        return this._headers[Utils.headerize(name)];
      }
    }
  }, {
    key: "hasHeader",
    value: function hasHeader(name) {
      if (name) {
        return this._headers.hasOwnProperty(Utils.headerize(name)) && true || false;
      }
    }
  }, {
    key: "deleteHeader",
    value: function deleteHeader(header) {
      header = Utils.headerize(header);
      if (this._headers.hasOwnProperty(header)) {
        var value = this._headers[header];
        delete this._headers[header];
        return value;
      }
    }
  }, {
    key: "clearHeaders",
    value: function clearHeaders() {
      this._headers = {};
    }
  }, {
    key: "clone",
    value: function clone() {
      return new URI(this._scheme, this._user, this._host, this._port, JSON.parse(JSON.stringify(this._parameters)), JSON.parse(JSON.stringify(this._headers)));
    }
  }, {
    key: "toString",
    value: function toString() {
      var headers = [];
      var uri = "".concat(this._scheme, ":");
      if (this._user) {
        uri += "".concat(Utils.escapeUser(this._user), "@");
      }
      uri += this._host;
      if (this._port || this._port === 0) {
        uri += ":".concat(this._port);
      }
      for (var parameter in this._parameters) {
        if (Object.prototype.hasOwnProperty.call(this._parameters, parameter)) {
          uri += ";".concat(parameter);
          if (this._parameters[parameter] !== null) {
            uri += "=".concat(this._parameters[parameter]);
          }
        }
      }
      for (var header in this._headers) {
        if (Object.prototype.hasOwnProperty.call(this._headers, header)) {
          var _iterator = _createForOfIteratorHelper(this._headers[header]),
            _step;
          try {
            for (_iterator.s(); !(_step = _iterator.n()).done;) {
              var item = _step.value;
              headers.push("".concat(header, "=").concat(item));
            }
          } catch (err) {
            _iterator.e(err);
          } finally {
            _iterator.f();
          }
        }
      }
      if (headers.length > 0) {
        uri += "?".concat(headers.join('&'));
      }
      return uri;
    }
  }, {
    key: "toAor",
    value: function toAor(show_port) {
      var aor = "".concat(this._scheme, ":");
      if (this._user) {
        aor += "".concat(Utils.escapeUser(this._user), "@");
      }
      aor += this._host;
      if (show_port && (this._port || this._port === 0)) {
        aor += ":".concat(this._port);
      }
      return aor;
    }
  }], [{
    key: "parse",
    value:
    /**
      * Parse the given string and returns a JsSIP.URI instance or undefined if
      * it is an invalid URI.
      */
    function parse(uri) {
      uri = Grammar.parse(uri, 'SIP_URI');
      if (uri !== -1) {
        return uri;
      } else {
        return undefined;
      }
    }
  }]);
  return URI;
}();