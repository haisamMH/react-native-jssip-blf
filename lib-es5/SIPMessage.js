"use strict";

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); Object.defineProperty(subClass, "prototype", { writable: false }); if (superClass) _setPrototypeOf(subClass, superClass); }
function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf ? Object.setPrototypeOf.bind() : function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }
function _createSuper(Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct(); return function _createSuperInternal() { var Super = _getPrototypeOf(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = _getPrototypeOf(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return _possibleConstructorReturn(this, result); }; }
function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } else if (call !== void 0) { throw new TypeError("Derived constructors may only return object or undefined"); } return _assertThisInitialized(self); }
function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }
function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {})); return true; } catch (e) { return false; } }
function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf.bind() : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }
function _typeof(obj) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (obj) { return typeof obj; } : function (obj) { return obj && "function" == typeof Symbol && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }, _typeof(obj); }
function _createForOfIteratorHelper(o, allowArrayLike) { var it = typeof Symbol !== "undefined" && o[Symbol.iterator] || o["@@iterator"]; if (!it) { if (Array.isArray(o) || (it = _unsupportedIterableToArray(o)) || allowArrayLike && o && typeof o.length === "number") { if (it) o = it; var i = 0; var F = function F() {}; return { s: F, n: function n() { if (i >= o.length) return { done: true }; return { done: false, value: o[i++] }; }, e: function e(_e) { throw _e; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var normalCompletion = true, didErr = false, err; return { s: function s() { it = it.call(o); }, n: function n() { var step = it.next(); normalCompletion = step.done; return step; }, e: function e(_e2) { didErr = true; err = _e2; }, f: function f() { try { if (!normalCompletion && it["return"] != null) it["return"](); } finally { if (didErr) throw err; } } }; }
function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }
function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) arr2[i] = arr[i]; return arr2; }
function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, _toPropertyKey(descriptor.key), descriptor); } }
function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); Object.defineProperty(Constructor, "prototype", { writable: false }); return Constructor; }
function _toPropertyKey(arg) { var key = _toPrimitive(arg, "string"); return _typeof(key) === "symbol" ? key : String(key); }
function _toPrimitive(input, hint) { if (_typeof(input) !== "object" || input === null) return input; var prim = input[Symbol.toPrimitive]; if (prim !== undefined) { var res = prim.call(input, hint || "default"); if (_typeof(res) !== "object") return res; throw new TypeError("@@toPrimitive must return a primitive value."); } return (hint === "string" ? String : Number)(input); }
var sdp_transform = require('sdp-transform');
var JsSIP_C = require('./Constants');
var Utils = require('./Utils');
var NameAddrHeader = require('./NameAddrHeader');
var Grammar = require('./Grammar');
var debug = require('debug')('JsSIP:SIPMessage');

/**
 * -param {String} method request method
 * -param {String} ruri request uri
 * -param {UA} ua
 * -param {Object} params parameters that will have priority over ua.configuration parameters:
 * <br>
 *  - cseq, call_id, from_tag, from_uri, from_display_name, to_uri, to_tag, route_set
 * -param {Object} [headers] extra headers
 * -param {String} [body]
 */
var OutgoingRequest = /*#__PURE__*/function () {
  function OutgoingRequest(method, ruri, ua, params, extraHeaders, body) {
    _classCallCheck(this, OutgoingRequest);
    // Mandatory parameters check.
    if (!method || !ruri || !ua) {
      return null;
    }
    params = params || {};
    this.ua = ua;
    this.headers = {};
    this.method = method;
    this.ruri = ruri;
    this.body = body;
    this.extraHeaders = Utils.cloneArray(extraHeaders);

    // Fill the Common SIP Request Headers.

    // Route.
    if (params.route_set) {
      this.setHeader('route', params.route_set);
    } else if (ua.configuration.use_preloaded_route) {
      this.setHeader('route', "<".concat(ua.transport.sip_uri, ";lr>"));
    }

    // Via.
    // Empty Via header. Will be filled by the client transaction.
    this.setHeader('via', '');

    // Max-Forwards.
    this.setHeader('max-forwards', JsSIP_C.MAX_FORWARDS);

    // To
    var to_uri = params.to_uri || ruri;
    var to_params = params.to_tag ? {
      tag: params.to_tag
    } : null;
    var to_display_name = typeof params.to_display_name !== 'undefined' ? params.to_display_name : null;
    this.to = new NameAddrHeader(to_uri, to_display_name, to_params);
    this.setHeader('to', this.to.toString());

    // From.
    var from_uri = params.from_uri || ua.configuration.uri;
    var from_params = {
      tag: params.from_tag || Utils.newTag()
    };
    var display_name;
    if (typeof params.from_display_name !== 'undefined') {
      display_name = params.from_display_name;
    } else if (ua.configuration.display_name) {
      display_name = ua.configuration.display_name;
    } else {
      display_name = null;
    }
    this.from = new NameAddrHeader(from_uri, display_name, from_params);
    this.setHeader('from', this.from.toString());

    // Call-ID.
    var call_id = params.call_id || ua.configuration.jssip_id + Utils.createRandomToken(15);
    this.call_id = call_id;
    this.setHeader('call-id', call_id);

    // CSeq.
    var cseq = params.cseq || Math.floor(Math.random() * 10000);
    this.cseq = cseq;
    this.setHeader('cseq', "".concat(cseq, " ").concat(method));
  }

  /**
   * Replace the the given header by the given value.
   * -param {String} name header name
   * -param {String | Array} value header value
   */
  _createClass(OutgoingRequest, [{
    key: "setHeader",
    value: function setHeader(name, value) {
      // Remove the header from extraHeaders if present.
      var regexp = new RegExp("^\\s*".concat(name, "\\s*:"), 'i');
      for (var idx = 0; idx < this.extraHeaders.length; idx++) {
        if (regexp.test(this.extraHeaders[idx])) {
          this.extraHeaders.splice(idx, 1);
        }
      }
      this.headers[Utils.headerize(name)] = Array.isArray(value) ? value : [value];
    }

    /**
     * Get the value of the given header name at the given position.
     * -param {String} name header name
     * -returns {String|undefined} Returns the specified header, null if header doesn't exist.
     */
  }, {
    key: "getHeader",
    value: function getHeader(name) {
      var headers = this.headers[Utils.headerize(name)];
      if (headers) {
        if (headers[0]) {
          return headers[0];
        }
      } else {
        var regexp = new RegExp("^\\s*".concat(name, "\\s*:"), 'i');
        var _iterator = _createForOfIteratorHelper(this.extraHeaders),
          _step;
        try {
          for (_iterator.s(); !(_step = _iterator.n()).done;) {
            var header = _step.value;
            if (regexp.test(header)) {
              return header.substring(header.indexOf(':') + 1).trim();
            }
          }
        } catch (err) {
          _iterator.e(err);
        } finally {
          _iterator.f();
        }
      }
      return;
    }

    /**
     * Get the header/s of the given name.
     * -param {String} name header name
     * -returns {Array} Array with all the headers of the specified name.
     */
  }, {
    key: "getHeaders",
    value: function getHeaders(name) {
      var headers = this.headers[Utils.headerize(name)];
      var result = [];
      if (headers) {
        var _iterator2 = _createForOfIteratorHelper(headers),
          _step2;
        try {
          for (_iterator2.s(); !(_step2 = _iterator2.n()).done;) {
            var header = _step2.value;
            result.push(header);
          }
        } catch (err) {
          _iterator2.e(err);
        } finally {
          _iterator2.f();
        }
        return result;
      } else {
        var regexp = new RegExp("^\\s*".concat(name, "\\s*:"), 'i');
        var _iterator3 = _createForOfIteratorHelper(this.extraHeaders),
          _step3;
        try {
          for (_iterator3.s(); !(_step3 = _iterator3.n()).done;) {
            var _header = _step3.value;
            if (regexp.test(_header)) {
              result.push(_header.substring(_header.indexOf(':') + 1).trim());
            }
          }
        } catch (err) {
          _iterator3.e(err);
        } finally {
          _iterator3.f();
        }
        return result;
      }
    }

    /**
     * Verify the existence of the given header.
     * -param {String} name header name
     * -returns {boolean} true if header with given name exists, false otherwise
     */
  }, {
    key: "hasHeader",
    value: function hasHeader(name) {
      if (this.headers[Utils.headerize(name)]) {
        return true;
      } else {
        var regexp = new RegExp("^\\s*".concat(name, "\\s*:"), 'i');
        var _iterator4 = _createForOfIteratorHelper(this.extraHeaders),
          _step4;
        try {
          for (_iterator4.s(); !(_step4 = _iterator4.n()).done;) {
            var header = _step4.value;
            if (regexp.test(header)) {
              return true;
            }
          }
        } catch (err) {
          _iterator4.e(err);
        } finally {
          _iterator4.f();
        }
      }
      return false;
    }

    /**
     * Parse the current body as a SDP and store the resulting object
     * into this.sdp.
     * -param {Boolean} force: Parse even if this.sdp already exists.
     *
     * Returns this.sdp.
     */
  }, {
    key: "parseSDP",
    value: function parseSDP(force) {
      if (!force && this.sdp) {
        return this.sdp;
      } else {
        this.sdp = sdp_transform.parse(this.body || '');
        return this.sdp;
      }
    }
  }, {
    key: "toString",
    value: function toString() {
      var msg = "".concat(this.method, " ").concat(this.ruri, " SIP/2.0\r\n");
      for (var headerName in this.headers) {
        if (Object.prototype.hasOwnProperty.call(this.headers, headerName)) {
          var _iterator5 = _createForOfIteratorHelper(this.headers[headerName]),
            _step5;
          try {
            for (_iterator5.s(); !(_step5 = _iterator5.n()).done;) {
              var headerValue = _step5.value;
              msg += "".concat(headerName, ": ").concat(headerValue, "\r\n");
            }
          } catch (err) {
            _iterator5.e(err);
          } finally {
            _iterator5.f();
          }
        }
      }
      var _iterator6 = _createForOfIteratorHelper(this.extraHeaders),
        _step6;
      try {
        for (_iterator6.s(); !(_step6 = _iterator6.n()).done;) {
          var header = _step6.value;
          msg += "".concat(header.trim(), "\r\n");
        }

        // Supported.
      } catch (err) {
        _iterator6.e(err);
      } finally {
        _iterator6.f();
      }
      var supported = [];
      switch (this.method) {
        case JsSIP_C.REGISTER:
          supported.push('path', 'gruu');
          break;
        case JsSIP_C.INVITE:
          if (this.ua.configuration.session_timers) {
            supported.push('timer');
          }
          if (this.ua.contact.pub_gruu || this.ua.contact.temp_gruu) {
            supported.push('gruu');
          }
          supported.push('ice', 'replaces');
          break;
        case JsSIP_C.UPDATE:
          if (this.ua.configuration.session_timers) {
            supported.push('timer');
          }
          supported.push('ice');
          break;
      }
      supported.push('outbound');
      var userAgent = this.ua.configuration.user_agent || JsSIP_C.USER_AGENT;

      // Allow.
      msg += "Allow: ".concat(JsSIP_C.ALLOWED_METHODS, "\r\n");
      msg += "Supported: ".concat(supported, "\r\n");
      msg += "User-Agent: ".concat(userAgent, "\r\n");
      if (this.body) {
        var length = Utils.str_utf8_length(this.body);
        msg += "Content-Length: ".concat(length, "\r\n\r\n");
        msg += this.body;
      } else {
        msg += 'Content-Length: 0\r\n\r\n';
      }
      return msg;
    }
  }, {
    key: "clone",
    value: function clone() {
      var request = new OutgoingRequest(this.method, this.ruri, this.ua);
      Object.keys(this.headers).forEach(function (name) {
        request.headers[name] = this.headers[name].slice();
      }, this);
      request.body = this.body;
      request.extraHeaders = Utils.cloneArray(this.extraHeaders);
      request.to = this.to;
      request.from = this.from;
      request.call_id = this.call_id;
      request.cseq = this.cseq;
      return request;
    }
  }]);
  return OutgoingRequest;
}();
var InitialOutgoingInviteRequest = /*#__PURE__*/function (_OutgoingRequest) {
  _inherits(InitialOutgoingInviteRequest, _OutgoingRequest);
  var _super = _createSuper(InitialOutgoingInviteRequest);
  function InitialOutgoingInviteRequest(ruri, ua, params, extraHeaders, body) {
    var _this;
    _classCallCheck(this, InitialOutgoingInviteRequest);
    _this = _super.call(this, JsSIP_C.INVITE, ruri, ua, params, extraHeaders, body);
    _this.transaction = null;
    return _this;
  }
  _createClass(InitialOutgoingInviteRequest, [{
    key: "cancel",
    value: function cancel(reason) {
      this.transaction.cancel(reason);
    }
  }, {
    key: "clone",
    value: function clone() {
      var request = new InitialOutgoingInviteRequest(this.ruri, this.ua);
      Object.keys(this.headers).forEach(function (name) {
        request.headers[name] = this.headers[name].slice();
      }, this);
      request.body = this.body;
      request.extraHeaders = Utils.cloneArray(this.extraHeaders);
      request.to = this.to;
      request.from = this.from;
      request.call_id = this.call_id;
      request.cseq = this.cseq;
      request.transaction = this.transaction;
      return request;
    }
  }]);
  return InitialOutgoingInviteRequest;
}(OutgoingRequest);
var IncomingMessage = /*#__PURE__*/function () {
  function IncomingMessage() {
    _classCallCheck(this, IncomingMessage);
    this.data = null;
    this.headers = null;
    this.method = null;
    this.via = null;
    this.via_branch = null;
    this.call_id = null;
    this.cseq = null;
    this.from = null;
    this.from_tag = null;
    this.to = null;
    this.to_tag = null;
    this.body = null;
    this.sdp = null;
  }

  /**
  * Insert a header of the given name and value into the last position of the
  * header array.
  */
  _createClass(IncomingMessage, [{
    key: "addHeader",
    value: function addHeader(name, value) {
      var header = {
        raw: value
      };
      name = Utils.headerize(name);
      if (this.headers[name]) {
        this.headers[name].push(header);
      } else {
        this.headers[name] = [header];
      }
    }

    /**
     * Get the value of the given header name at the given position.
     */
  }, {
    key: "getHeader",
    value: function getHeader(name) {
      var header = this.headers[Utils.headerize(name)];
      if (header) {
        if (header[0]) {
          return header[0].raw;
        }
      } else {
        return;
      }
    }

    /**
     * Get the header/s of the given name.
     */
  }, {
    key: "getHeaders",
    value: function getHeaders(name) {
      var headers = this.headers[Utils.headerize(name)];
      var result = [];
      if (!headers) {
        return [];
      }
      var _iterator7 = _createForOfIteratorHelper(headers),
        _step7;
      try {
        for (_iterator7.s(); !(_step7 = _iterator7.n()).done;) {
          var header = _step7.value;
          result.push(header.raw);
        }
      } catch (err) {
        _iterator7.e(err);
      } finally {
        _iterator7.f();
      }
      return result;
    }

    /**
     * Verify the existence of the given header.
     */
  }, {
    key: "hasHeader",
    value: function hasHeader(name) {
      return this.headers[Utils.headerize(name)] ? true : false;
    }

    /**
    * Parse the given header on the given index.
    * -param {String} name header name
    * -param {Number} [idx=0] header index
    * -returns {Object|undefined} Parsed header object, undefined if the header
    *  is not present or in case of a parsing error.
    */
  }, {
    key: "parseHeader",
    value: function parseHeader(name) {
      var idx = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;
      name = Utils.headerize(name);
      if (!this.headers[name]) {
        debug("header \"".concat(name, "\" not present"));
        return;
      } else if (idx >= this.headers[name].length) {
        debug("not so many \"".concat(name, "\" headers present"));
        return;
      }
      var header = this.headers[name][idx];
      var value = header.raw;
      if (header.parsed) {
        return header.parsed;
      }

      // Substitute '-' by '_' for grammar rule matching.
      var parsed = Grammar.parse(value, name.replace(/-/g, '_'));
      if (parsed === -1) {
        this.headers[name].splice(idx, 1); // delete from headers
        debug("error parsing \"".concat(name, "\" header field with value \"").concat(value, "\""));
        return;
      } else {
        header.parsed = parsed;
        return parsed;
      }
    }

    /**
     * Message Header attribute selector. Alias of parseHeader.
     * -param {String} name header name
     * -param {Number} [idx=0] header index
     * -returns {Object|undefined} Parsed header object, undefined if the header
     *  is not present or in case of a parsing error.
     *
     * -example
     * message.s('via',3).port
     */
  }, {
    key: "s",
    value: function s(name, idx) {
      return this.parseHeader(name, idx);
    }

    /**
    * Replace the value of the given header by the value.
    * -param {String} name header name
    * -param {String} value header value
    */
  }, {
    key: "setHeader",
    value: function setHeader(name, value) {
      var header = {
        raw: value
      };
      this.headers[Utils.headerize(name)] = [header];
    }

    /**
     * Parse the current body as a SDP and store the resulting object
     * into this.sdp.
     * -param {Boolean} force: Parse even if this.sdp already exists.
     *
     * Returns this.sdp.
     */
  }, {
    key: "parseSDP",
    value: function parseSDP(force) {
      if (!force && this.sdp) {
        return this.sdp;
      } else {
        this.sdp = sdp_transform.parse(this.body || '');
        return this.sdp;
      }
    }
  }, {
    key: "toString",
    value: function toString() {
      return this.data;
    }
  }]);
  return IncomingMessage;
}();
var IncomingRequest = /*#__PURE__*/function (_IncomingMessage) {
  _inherits(IncomingRequest, _IncomingMessage);
  var _super2 = _createSuper(IncomingRequest);
  function IncomingRequest(ua) {
    var _this2;
    _classCallCheck(this, IncomingRequest);
    _this2 = _super2.call(this);
    _this2.ua = ua;
    _this2.headers = {};
    _this2.ruri = null;
    _this2.transport = null;
    _this2.server_transaction = null;
    return _this2;
  }

  /**
  * Stateful reply.
  * -param {Number} code status code
  * -param {String} reason reason phrase
  * -param {Object} headers extra headers
  * -param {String} body body
  * -param {Function} [onSuccess] onSuccess callback
  * -param {Function} [onFailure] onFailure callback
  */
  _createClass(IncomingRequest, [{
    key: "reply",
    value: function reply(code, reason, extraHeaders, body, onSuccess, onFailure) {
      var supported = [];
      var to = this.getHeader('To');
      code = code || null;
      reason = reason || null;

      // Validate code and reason values.
      if (!code || code < 100 || code > 699) {
        throw new TypeError("Invalid status_code: ".concat(code));
      } else if (reason && typeof reason !== 'string' && !(reason instanceof String)) {
        throw new TypeError("Invalid reason_phrase: ".concat(reason));
      }
      reason = reason || JsSIP_C.REASON_PHRASE[code] || '';
      extraHeaders = Utils.cloneArray(extraHeaders);
      var response = "SIP/2.0 ".concat(code, " ").concat(reason, "\r\n");
      if (this.method === JsSIP_C.INVITE && code > 100 && code <= 200) {
        var headers = this.getHeaders('record-route');
        var _iterator8 = _createForOfIteratorHelper(headers),
          _step8;
        try {
          for (_iterator8.s(); !(_step8 = _iterator8.n()).done;) {
            var header = _step8.value;
            response += "Record-Route: ".concat(header, "\r\n");
          }
        } catch (err) {
          _iterator8.e(err);
        } finally {
          _iterator8.f();
        }
      }
      var vias = this.getHeaders('via');
      var _iterator9 = _createForOfIteratorHelper(vias),
        _step9;
      try {
        for (_iterator9.s(); !(_step9 = _iterator9.n()).done;) {
          var via = _step9.value;
          response += "Via: ".concat(via, "\r\n");
        }
      } catch (err) {
        _iterator9.e(err);
      } finally {
        _iterator9.f();
      }
      if (!this.to_tag && code > 100) {
        to += ";tag=".concat(Utils.newTag());
      } else if (this.to_tag && !this.s('to').hasParam('tag')) {
        to += ";tag=".concat(this.to_tag);
      }
      response += "To: ".concat(to, "\r\n");
      response += "From: ".concat(this.getHeader('From'), "\r\n");
      response += "Call-ID: ".concat(this.call_id, "\r\n");
      response += "CSeq: ".concat(this.cseq, " ").concat(this.method, "\r\n");
      var _iterator10 = _createForOfIteratorHelper(extraHeaders),
        _step10;
      try {
        for (_iterator10.s(); !(_step10 = _iterator10.n()).done;) {
          var _header2 = _step10.value;
          response += "".concat(_header2.trim(), "\r\n");
        }

        // Supported.
      } catch (err) {
        _iterator10.e(err);
      } finally {
        _iterator10.f();
      }
      switch (this.method) {
        case JsSIP_C.INVITE:
          if (this.ua.configuration.session_timers) {
            supported.push('timer');
          }
          if (this.ua.contact.pub_gruu || this.ua.contact.temp_gruu) {
            supported.push('gruu');
          }
          supported.push('ice', 'replaces');
          break;
        case JsSIP_C.UPDATE:
          if (this.ua.configuration.session_timers) {
            supported.push('timer');
          }
          if (body) {
            supported.push('ice');
          }
          supported.push('replaces');
      }
      supported.push('outbound');

      // Allow and Accept.
      if (this.method === JsSIP_C.OPTIONS) {
        response += "Allow: ".concat(JsSIP_C.ALLOWED_METHODS, "\r\n");
        response += "Accept: ".concat(JsSIP_C.ACCEPTED_BODY_TYPES, "\r\n");
      } else if (code === 405) {
        response += "Allow: ".concat(JsSIP_C.ALLOWED_METHODS, "\r\n");
      } else if (code === 415) {
        response += "Accept: ".concat(JsSIP_C.ACCEPTED_BODY_TYPES, "\r\n");
      }
      response += "Supported: ".concat(supported, "\r\n");
      if (body) {
        var length = Utils.str_utf8_length(body);
        response += 'Content-Type: application/sdp\r\n';
        response += "Content-Length: ".concat(length, "\r\n\r\n");
        response += body;
      } else {
        response += "Content-Length: ".concat(0, "\r\n\r\n");
      }
      this.server_transaction.receiveResponse(code, response, onSuccess, onFailure);
    }

    /**
    * Stateless reply.
    * -param {Number} code status code
    * -param {String} reason reason phrase
    */
  }, {
    key: "reply_sl",
    value: function reply_sl() {
      var code = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : null;
      var reason = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;
      var vias = this.getHeaders('via');

      // Validate code and reason values.
      if (!code || code < 100 || code > 699) {
        throw new TypeError("Invalid status_code: ".concat(code));
      } else if (reason && typeof reason !== 'string' && !(reason instanceof String)) {
        throw new TypeError("Invalid reason_phrase: ".concat(reason));
      }
      reason = reason || JsSIP_C.REASON_PHRASE[code] || '';
      var response = "SIP/2.0 ".concat(code, " ").concat(reason, "\r\n");
      var _iterator11 = _createForOfIteratorHelper(vias),
        _step11;
      try {
        for (_iterator11.s(); !(_step11 = _iterator11.n()).done;) {
          var via = _step11.value;
          response += "Via: ".concat(via, "\r\n");
        }
      } catch (err) {
        _iterator11.e(err);
      } finally {
        _iterator11.f();
      }
      var to = this.getHeader('To');
      if (!this.to_tag && code > 100) {
        to += ";tag=".concat(Utils.newTag());
      } else if (this.to_tag && !this.s('to').hasParam('tag')) {
        to += ";tag=".concat(this.to_tag);
      }
      response += "To: ".concat(to, "\r\n");
      response += "From: ".concat(this.getHeader('From'), "\r\n");
      response += "Call-ID: ".concat(this.call_id, "\r\n");
      response += "CSeq: ".concat(this.cseq, " ").concat(this.method, "\r\n");
      response += "Content-Length: ".concat(0, "\r\n\r\n");
      this.transport.send(response);
    }
  }]);
  return IncomingRequest;
}(IncomingMessage);
var IncomingResponse = /*#__PURE__*/function (_IncomingMessage2) {
  _inherits(IncomingResponse, _IncomingMessage2);
  var _super3 = _createSuper(IncomingResponse);
  function IncomingResponse() {
    var _this3;
    _classCallCheck(this, IncomingResponse);
    _this3 = _super3.call(this);
    _this3.headers = {};
    _this3.status_code = null;
    _this3.reason_phrase = null;
    return _this3;
  }
  return _createClass(IncomingResponse);
}(IncomingMessage);
module.exports = {
  OutgoingRequest: OutgoingRequest,
  InitialOutgoingInviteRequest: InitialOutgoingInviteRequest,
  IncomingRequest: IncomingRequest,
  IncomingResponse: IncomingResponse
};