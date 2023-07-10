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
function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); Object.defineProperty(subClass, "prototype", { writable: false }); if (superClass) _setPrototypeOf(subClass, superClass); }
function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf ? Object.setPrototypeOf.bind() : function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }
function _createSuper(Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct(); return function _createSuperInternal() { var Super = _getPrototypeOf(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = _getPrototypeOf(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return _possibleConstructorReturn(this, result); }; }
function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } else if (call !== void 0) { throw new TypeError("Derived constructors may only return object or undefined"); } return _assertThisInitialized(self); }
function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }
function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {})); return true; } catch (e) { return false; } }
function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf.bind() : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }
var EventEmitter = require('events').EventEmitter;
var JsSIP_C = require('./Constants');
var Utils = require('./Utils');
var Grammar = require('./Grammar');
var SIPMessage = require('./SIPMessage');
var RequestSender = require('./RequestSender');
var Dialog = require('./Dialog');
var debug = require('debug')('JsSIP:RTCSession');
var debugerror = require('debug')('JsSIP:ERROR:RTCSession');

/**
 * Termination codes.
 */
var C = {
  // Termination codes.
  SUBSCRIBE_RESPONSE_TIMEOUT: 0,
  SUBSCRIBE_TRANSPORT_ERROR: 1,
  SUBSCRIBE_NON_OK_RESPONSE: 2,
  SUBSCRIBE_BAD_OK_RESPONSE: 3,
  SUBSCRIBE_FAILED_AUTHENTICATION: 4,
  UNSUBSCRIBE_TIMEOUT: 5,
  RECEIVE_FINAL_NOTIFY: 6,
  RECEIVE_BAD_NOTIFY: 7,
  // Subscriber states.
  STATE_PENDING: 0,
  STATE_ACTIVE: 1,
  STATE_TERMINATED: 2,
  STATE_INIT: 3,
  STATE_NOTIFY_WAIT: 4
};

/**
 * RFC 6665 Subscriber implementation.
 */
module.exports = /*#__PURE__*/function (_EventEmitter) {
  _inherits(Subscriber, _EventEmitter);
  var _super = _createSuper(Subscriber);
  /**
   * @param {UA} ua - reference to JsSIP.UA
   * @param {string} target
   * @param {string} eventName - Event header value. May end with optional ;id=xxx
   * @param {string} accept - Accept header value.
   * 
   * @param {SubscriberOption} options - optional parameters.
   *   @param {number} expires - Expires header value. Default is 900.
   *   @param {string} contentType - Content-Type header value. Used for SUBSCRIBE with body
   *   @param {string} allowEvents - Allow-Events header value.
   *   @param {RequestParams} params - Will have priority over ua.configuration. 
   *      If set please define: to_uri, to_display_name, from_uri, from_display_name
   *   @param {Array<string>} extraHeaders - Additional SIP headers.
   */
  function Subscriber(ua, target, eventName, accept, _ref) {
    var _this;
    var expires = _ref.expires,
      contentType = _ref.contentType,
      allowEvents = _ref.allowEvents,
      params = _ref.params,
      extraHeaders = _ref.extraHeaders;
    _classCallCheck(this, Subscriber);
    debug('new');
    _this = _super.call(this);

    // Check that arguments are defined
    if (!target) {
      throw new TypeError('target is undefined');
    }
    if (!eventName) {
      throw new TypeError('eventName is undefined');
    }
    if (!accept) {
      throw new TypeError('accept is undefined');
    }
    _this._ua = ua;
    _this._target = target;
    if (expires !== 0 && !expires) {
      expires = 900;
    }
    _this._expires = expires;

    // Used to subscribe with body.
    _this._content_type = contentType;

    // Set initial subscribe parameters.
    _this._params = Utils.cloneObject(params);
    if (!_this._params.from_uri) {
      _this._params.from_uri = _this._ua.configuration.uri;
    }
    _this._params.from_tag = Utils.newTag();
    _this._params.to_tag = null;
    _this._params.call_id = Utils.createRandomToken(20);

    // Create subscribe cseq if not defined custom cseq.
    if (_this._params.cseq === undefined) {
      _this._params.cseq = Math.floor(Math.random() * 10000 + 1);
    }

    // Subscriber state.
    _this._state = C.STATE_INIT;

    // Dialog
    _this._dialog = null;

    // To refresh subscription.
    _this._expires_timer = null;
    _this._expires_timestamp = null;

    // To prevent duplicate terminated call.
    _this._terminated = false;

    // After send un-subscribe wait final notify limited time.
    _this._unsubscribe_timeout_timer = null;

    // Custom session empty object for high level use.    
    _this.data = {};
    var parsed = Grammar.parse(eventName, 'Event');
    if (parsed === -1) {
      throw new TypeError('eventName - wrong format');
    }
    _this._event_name = parsed.event;
    _this._event_id = parsed.params && parsed.params.id;
    var eventValue = _this._event_name;
    if (_this._event_id) {
      eventValue += ";id=".concat(_this._event_id);
    }
    _this._headers = Utils.cloneArray(extraHeaders);
    _this._headers = _this._headers.concat(["Event: ".concat(eventValue), "Expires: ".concat(_this._expires), "Accept: ".concat(accept)]);
    if (!_this._headers.find(function (header) {
      return header.startsWith('Contact');
    })) {
      var contact = "Contact: ".concat(_this._ua._contact.toString());
      _this._headers.push(contact);
    }
    if (allowEvents) {
      _this._headers.push("Allow-Events: ".concat(allowEvents));
    }

    // To enqueue subscribes created before receive initial subscribe OK.
    _this._queue = [];
    return _this;
  }
  _createClass(Subscriber, [{
    key: "C",
    get: function get() {
      return C;
    }
  }, {
    key: "onRequestTimeout",
    value: function onRequestTimeout() {
      this._dialogTerminated(C.SUBSCRIBE_RESPONSE_TIMEOUT);
    }
  }, {
    key: "onTransportError",
    value: function onTransportError() {
      this._dialogTerminated(C.SUBSCRIBE_TRANSPORT_ERROR);
    }

    /**
     * Dialog callback.
     */
  }, {
    key: "receiveRequest",
    value: function receiveRequest(request) {
      if (request.method !== JsSIP_C.NOTIFY) {
        debugerror('received non-NOTIFY request');
        request.reply(405);
        return;
      }

      // RFC 6665 8.2.1. Check if event header matches.
      var event_header = request.parseHeader('Event');
      if (!event_header) {
        debugerror('missed Event header');
        request.reply(400);
        this._dialogTerminated(C.RECEIVE_BAD_NOTIFY);
        return;
      }
      var event_name = event_header.event;
      var event_id = event_header.params && event_header.params.id;
      if (event_name !== this._event_name || event_id !== this._event_id) {
        debugerror('Event header does not match SUBSCRIBE');
        request.reply(489);
        this._dialogTerminated(C.RECEIVE_BAD_NOTIFY);
        return;
      }

      // Process Subscription-State header.
      var subs_state = request.parseHeader('subscription-state');
      if (!subs_state) {
        debugerror('missed Subscription-State header');
        request.reply(400);
        this._dialogTerminated(C.RECEIVE_BAD_NOTIFY);
        return;
      }
      request.reply(200);
      var new_state = this._stateStringToNumber(subs_state.state);
      var prev_state = this._state;
      if (prev_state !== C.STATE_TERMINATED && new_state !== C.STATE_TERMINATED) {
        this._state = new_state;
        if (subs_state.expires !== undefined) {
          var expires = subs_state.expires;
          var expires_timestamp = new Date().getTime() + expires * 1000;
          var max_time_deviation = 2000;

          // Expiration time is shorter and the difference is not too small.
          if (this._expires_timestamp - expires_timestamp > max_time_deviation) {
            debug('update sending re-SUBSCRIBE time');
            this._scheduleSubscribe(expires);
          }
        }
      }
      if (prev_state !== C.STATE_PENDING && new_state === C.STATE_PENDING) {
        debug('emit "pending"');
        this.emit('pending');
      } else if (prev_state !== C.STATE_ACTIVE && new_state === C.STATE_ACTIVE) {
        debug('emit "active"');
        this.emit('active');
      }
      var body = request.body;

      // Check if the notify is final.
      var is_final = new_state === C.STATE_TERMINATED;

      // Notify event fired only for notify with body.
      if (body) {
        var content_type = request.getHeader('content-type');
        debug('emit "notify"');
        this.emit('notify', is_final, request, body, content_type);
      }
      if (is_final) {
        var reason = subs_state.reason;
        var retry_after = undefined;
        if (subs_state.params && subs_state.params['retry-after'] !== undefined) {
          retry_after = parseInt(subs_state.params['retry-after']);
        }
        this._dialogTerminated(C.RECEIVE_FINAL_NOTIFY, reason, retry_after);
      }
    }

    /**
     * User API
     */

    /** 
     * Send the initial (non-fetch)  and subsequent subscribe.
     * @param {string} body - subscribe request body.
     */
  }, {
    key: "subscribe",
    value: function subscribe() {
      var body = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : null;
      debug('subscribe()');
      if (this._state === C.STATE_INIT) {
        this._sendInitialSubscribe(body, this._headers);
      } else {
        this._sendSubsequentSubscribe(body, this._headers);
      }
    }

    /** 
     * terminate. 
     * Send un-subscribe or fetch-subscribe (with Expires: 0).
     * @param {string} body - un-subscribe request body
     */
  }, {
    key: "terminate",
    value: function terminate() {
      var _this2 = this;
      var body = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : null;
      debug('terminate()');

      // Prevent duplication un-subscribe sending.
      if (this._terminated) {
        return;
      }
      this._terminated = true;

      // Set header Expires: 0.
      var headers = this._headers.map(function (header) {
        return header.startsWith('Expires') ? 'Expires: 0' : header;
      });
      if (this._state === C.STATE_INIT) {
        // fetch-subscribe - initial subscribe with Expires: 0.
        this._sendInitialSubscribe(body, headers);
      } else {
        this._sendSubsequentSubscribe(body, headers);
      }

      // Waiting for the final notify for a while.
      var final_notify_timeout = 30000;
      this._unsubscribe_timeout_timer = setTimeout(function () {
        _this2._dialogTerminated(C.UNSUBSCRIBE_TIMEOUT);
      }, final_notify_timeout);
    }

    /**
     * Get dialog state.
     */
  }, {
    key: "state",
    get: function get() {
      return this._state;
    }

    /**
     * Get dialog id.
     */
  }, {
    key: "id",
    get: function get() {
      return this._dialog ? this._dialog.id : null;
    }

    /**
     * Private API.
     */
  }, {
    key: "_sendInitialSubscribe",
    value: function _sendInitialSubscribe(body, headers) {
      var _this3 = this;
      if (body) {
        if (!this._content_type) {
          throw new TypeError('content_type is undefined');
        }
        headers = headers.slice();
        headers.push("Content-Type: ".concat(this._content_type));
      }
      this._state = C.STATE_NOTIFY_WAIT;
      var request = new SIPMessage.OutgoingRequest(JsSIP_C.SUBSCRIBE, this._ua.normalizeTarget(this._target), this._ua, this._params, headers, body);
      var request_sender = new RequestSender(this._ua, request, {
        onRequestTimeout: function onRequestTimeout() {
          _this3.onRequestTimeout();
        },
        onTransportError: function onTransportError() {
          _this3.onTransportError();
        },
        onReceiveResponse: function onReceiveResponse(response) {
          _this3._receiveSubscribeResponse(response);
        }
      });
      request_sender.send();
    }
  }, {
    key: "_receiveSubscribeResponse",
    value: function _receiveSubscribeResponse(response) {
      if (response.status_code >= 200 && response.status_code < 300) {
        // Create dialog
        if (this._dialog === null) {
          var dialog = new Dialog(this, response, 'UAC');
          if (dialog.error) {
            // OK response without Contact 
            debugerror(dialog.error);
            this._dialogTerminated(C.SUBSCRIBE_BAD_OK_RESPONSE);
            return;
          }
          this._dialog = dialog;
          debug('emit "accepted"');
          this.emit('accepted');

          // Subsequent subscribes saved in the queue until dialog created.
          var _iterator = _createForOfIteratorHelper(this._queue),
            _step;
          try {
            for (_iterator.s(); !(_step = _iterator.n()).done;) {
              var subscribe = _step.value;
              debug('dequeue subscribe');
              this._sendSubsequentSubscribe(subscribe.body, subscribe.headers);
            }
          } catch (err) {
            _iterator.e(err);
          } finally {
            _iterator.f();
          }
        }

        // Check expires value.
        var expires_value = response.getHeader('expires');
        if (expires_value !== 0 && !expires_value) {
          debugerror('response without Expires header');

          // RFC 6665 3.1.1 subscribe OK response must contain Expires header.
          // Use workaround expires value.
          expires_value = '900';
        }
        var expires = parseInt(expires_value);
        if (expires > 0) {
          this._scheduleSubscribe(expires);
        }
      } else if (response.status_code === 401 || response.status_code === 407) {
        this._dialogTerminated(C.SUBSCRIBE_FAILED_AUTHENTICATION);
      } else if (response.status_code >= 300) {
        this._dialogTerminated(C.SUBSCRIBE_NON_OK_RESPONSE);
      }
    }
  }, {
    key: "_sendSubsequentSubscribe",
    value: function _sendSubsequentSubscribe(body, headers) {
      var _this4 = this;
      if (this._state === C.STATE_TERMINATED) {
        return;
      }
      if (!this._dialog) {
        debug('enqueue subscribe');
        this._queue.push({
          body: body,
          headers: headers.slice()
        });
        return;
      }
      if (body) {
        if (!this._content_type) {
          throw new TypeError('content_type is undefined');
        }
        headers = headers.slice();
        headers.push("Content-Type: ".concat(this._content_type));
      }
      this._dialog.sendRequest(JsSIP_C.SUBSCRIBE, {
        body: body,
        extraHeaders: headers,
        eventHandlers: {
          onRequestTimeout: function onRequestTimeout() {
            _this4.onRequestTimeout();
          },
          onTransportError: function onTransportError() {
            _this4.onTransportError();
          },
          onSuccessResponse: function onSuccessResponse(response) {
            _this4._receiveSubscribeResponse(response);
          },
          onErrorResponse: function onErrorResponse(response) {
            _this4._receiveSubscribeResponse(response);
          },
          onDialogError: function onDialogError(response) {
            _this4._receiveSubscribeResponse(response);
          }
        }
      });
    }
  }, {
    key: "_dialogTerminated",
    value: function _dialogTerminated(terminationCode) {
      var reason = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : undefined;
      var retryAfter = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : undefined;
      // To prevent duplicate emit terminated event.
      if (this._state === C.STATE_TERMINATED) {
        return;
      }
      this._state = C.STATE_TERMINATED;

      // Clear timers.
      clearTimeout(this._expires_timer);
      clearTimeout(this._unsubscribe_timeout_timer);
      if (this._dialog) {
        this._dialog.terminate();
        this._dialog = null;
      }
      debug("emit \"terminated\" code=".concat(terminationCode));
      this.emit('terminated', terminationCode, reason, retryAfter);
    }
  }, {
    key: "_scheduleSubscribe",
    value: function _scheduleSubscribe(expires) {
      var _this5 = this;
      /*
        If the expires time is less than 140 seconds we do not support Chrome intensive timer throttling mode. 
        In this case, the re-subcribe is sent 5 seconds before the subscription expiration.
         When Chrome is in intensive timer throttling mode, in the worst case, 
      the timer will be 60 seconds late.
        We give the server 10 seconds to make sure it will execute the command even if it is heavily loaded. 
        As a result, we order the time no later than 70 seconds before the subscription expiration.
        Resulting time calculated as half time interval + (half interval - 70) * random.
         E.g. expires is 140, re-subscribe will be ordered to send in 70 seconds.
          expires is 600, re-subscribe will be ordered to send in 300 + (0 .. 230) seconds.
      */

      var timeout = expires >= 140 ? expires * 1000 / 2 + Math.floor((expires / 2 - 70) * 1000 * Math.random()) : expires * 1000 - 5000;
      this._expires_timestamp = new Date().getTime() + expires * 1000;
      debug("next SUBSCRIBE will be sent in ".concat(Math.floor(timeout / 1000), " sec"));
      clearTimeout(this._expires_timer);
      this._expires_timer = setTimeout(function () {
        _this5._expires_timer = null;
        _this5._sendSubsequentSubscribe(null, _this5._headers);
      }, timeout);
    }
  }, {
    key: "_stateStringToNumber",
    value: function _stateStringToNumber(strState) {
      switch (strState) {
        case 'pending':
          return C.STATE_PENDING;
        case 'active':
          return C.STATE_ACTIVE;
        case 'terminated':
          return C.STATE_TERMINATED;
        case 'init':
          return C.STATE_INIT;
        case 'notify_wait':
          return C.STATE_NOTIFY_WAIT;
        default:
          throw new TypeError('wrong state value');
      }
    }
  }], [{
    key: "C",
    get:
    /**
     * Expose C object.
     */
    function get() {
      return C;
    }
  }]);
  return Subscriber;
}(EventEmitter);