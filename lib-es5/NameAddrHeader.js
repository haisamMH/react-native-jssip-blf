"use strict";

function _typeof(obj) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (obj) { return typeof obj; } : function (obj) { return obj && "function" == typeof Symbol && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }, _typeof(obj); }
function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, _toPropertyKey(descriptor.key), descriptor); } }
function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); Object.defineProperty(Constructor, "prototype", { writable: false }); return Constructor; }
function _toPropertyKey(arg) { var key = _toPrimitive(arg, "string"); return _typeof(key) === "symbol" ? key : String(key); }
function _toPrimitive(input, hint) { if (_typeof(input) !== "object" || input === null) return input; var prim = input[Symbol.toPrimitive]; if (prim !== undefined) { var res = prim.call(input, hint || "default"); if (_typeof(res) !== "object") return res; throw new TypeError("@@toPrimitive must return a primitive value."); } return (hint === "string" ? String : Number)(input); }
var URI = require('./URI');
var Grammar = require('./Grammar');
module.exports = /*#__PURE__*/function () {
  function NameAddrHeader(uri, display_name, parameters) {
    _classCallCheck(this, NameAddrHeader);
    // Checks.
    if (!uri || !(uri instanceof URI)) {
      throw new TypeError('missing or invalid "uri" parameter');
    }

    // Initialize parameters.
    this._uri = uri;
    this._parameters = {};
    this.display_name = display_name;
    for (var param in parameters) {
      if (Object.prototype.hasOwnProperty.call(parameters, param)) {
        this.setParam(param, parameters[param]);
      }
    }
  }
  _createClass(NameAddrHeader, [{
    key: "uri",
    get: function get() {
      return this._uri;
    }
  }, {
    key: "display_name",
    get: function get() {
      return this._display_name;
    },
    set: function set(value) {
      this._display_name = value === 0 ? '0' : value;
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
    key: "clone",
    value: function clone() {
      return new NameAddrHeader(this._uri.clone(), this._display_name, JSON.parse(JSON.stringify(this._parameters)));
    }
  }, {
    key: "_quote",
    value: function _quote(str) {
      return str.replace(/\\/g, '\\\\').replace(/"/g, '\\"');
    }
  }, {
    key: "toString",
    value: function toString() {
      var body = this._display_name ? "\"".concat(this._quote(this._display_name), "\" ") : '';
      body += "<".concat(this._uri.toString(), ">");
      for (var parameter in this._parameters) {
        if (Object.prototype.hasOwnProperty.call(this._parameters, parameter)) {
          body += ";".concat(parameter);
          if (this._parameters[parameter] !== null) {
            body += "=".concat(this._parameters[parameter]);
          }
        }
      }
      return body;
    }
  }], [{
    key: "parse",
    value:
    /**
     * Parse the given string and returns a NameAddrHeader instance or undefined if
     * it is an invalid NameAddrHeader.
     */
    function parse(name_addr_header) {
      name_addr_header = Grammar.parse(name_addr_header, 'Name_Addr_Header');
      if (name_addr_header !== -1) {
        return name_addr_header;
      } else {
        return undefined;
      }
    }
  }]);
  return NameAddrHeader;
}();