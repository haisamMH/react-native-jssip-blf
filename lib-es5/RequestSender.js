"use strict";

function _typeof(obj) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (obj) { return typeof obj; } : function (obj) { return obj && "function" == typeof Symbol && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }, _typeof(obj); }
function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, _toPropertyKey(descriptor.key), descriptor); } }
function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); Object.defineProperty(Constructor, "prototype", { writable: false }); return Constructor; }
function _toPropertyKey(arg) { var key = _toPrimitive(arg, "string"); return _typeof(key) === "symbol" ? key : String(key); }
function _toPrimitive(input, hint) { if (_typeof(input) !== "object" || input === null) return input; var prim = input[Symbol.toPrimitive]; if (prim !== undefined) { var res = prim.call(input, hint || "default"); if (_typeof(res) !== "object") return res; throw new TypeError("@@toPrimitive must return a primitive value."); } return (hint === "string" ? String : Number)(input); }
var JsSIP_C = require('./Constants');
var DigestAuthentication = require('./DigestAuthentication');
var Transactions = require('./Transactions');
var debug = require('debug')('JsSIP:RequestSender');

// Default event handlers.
var EventHandlers = {
  onRequestTimeout: function onRequestTimeout() {},
  onTransportError: function onTransportError() {},
  onReceiveResponse: function onReceiveResponse() {},
  onAuthenticated: function onAuthenticated() {}
};
module.exports = /*#__PURE__*/function () {
  function RequestSender(ua, request, eventHandlers) {
    _classCallCheck(this, RequestSender);
    this._ua = ua;
    this._eventHandlers = eventHandlers;
    this._method = request.method;
    this._request = request;
    this._auth = null;
    this._challenged = false;
    this._staled = false;

    // Define the undefined handlers.
    for (var handler in EventHandlers) {
      if (Object.prototype.hasOwnProperty.call(EventHandlers, handler)) {
        if (!this._eventHandlers[handler]) {
          this._eventHandlers[handler] = EventHandlers[handler];
        }
      }
    }

    // If ua is in closing process or even closed just allow sending Bye and ACK.
    if (ua.status === ua.C.STATUS_USER_CLOSED && (this._method !== JsSIP_C.BYE || this._method !== JsSIP_C.ACK)) {
      this._eventHandlers.onTransportError();
    }
  }

  /**
  * Create the client transaction and send the message.
  */
  _createClass(RequestSender, [{
    key: "send",
    value: function send() {
      var _this = this;
      var eventHandlers = {
        onRequestTimeout: function onRequestTimeout() {
          _this._eventHandlers.onRequestTimeout();
        },
        onTransportError: function onTransportError() {
          _this._eventHandlers.onTransportError();
        },
        onReceiveResponse: function onReceiveResponse(response) {
          _this._receiveResponse(response);
        }
      };
      switch (this._method) {
        case 'INVITE':
          this.clientTransaction = new Transactions.InviteClientTransaction(this._ua, this._ua.transport, this._request, eventHandlers);
          break;
        case 'ACK':
          this.clientTransaction = new Transactions.AckClientTransaction(this._ua, this._ua.transport, this._request, eventHandlers);
          break;
        default:
          this.clientTransaction = new Transactions.NonInviteClientTransaction(this._ua, this._ua.transport, this._request, eventHandlers);
      }
      // If authorization JWT is present, use it.
      if (this._ua._configuration.authorization_jwt) {
        this._request.setHeader('Authorization', this._ua._configuration.authorization_jwt);
      }
      this.clientTransaction.send();
    }

    /**
    * Called from client transaction when receiving a correct response to the request.
    * Authenticate request if needed or pass the response back to the applicant.
    */
  }, {
    key: "_receiveResponse",
    value: function _receiveResponse(response) {
      var challenge;
      var authorization_header_name;
      var status_code = response.status_code;

      /*
      * Authentication
      * Authenticate once. _challenged_ flag used to avoid infinite authentications.
      */
      if ((status_code === 401 || status_code === 407) && (this._ua.configuration.password !== null || this._ua.configuration.ha1 !== null)) {
        // Get and parse the appropriate WWW-Authenticate or Proxy-Authenticate header.
        if (response.status_code === 401) {
          challenge = response.parseHeader('www-authenticate');
          authorization_header_name = 'authorization';
        } else {
          challenge = response.parseHeader('proxy-authenticate');
          authorization_header_name = 'proxy-authorization';
        }

        // Verify it seems a valid challenge.
        if (!challenge) {
          debug("".concat(response.status_code, " with wrong or missing challenge, cannot authenticate"));
          this._eventHandlers.onReceiveResponse(response);
          return;
        }
        if (!this._challenged || !this._staled && challenge.stale === true) {
          if (!this._auth) {
            this._auth = new DigestAuthentication({
              username: this._ua.configuration.authorization_user,
              password: this._ua.configuration.password,
              realm: this._ua.configuration.realm,
              ha1: this._ua.configuration.ha1
            });
          }

          // Verify that the challenge is really valid.
          if (!this._auth.authenticate(this._request, challenge)) {
            this._eventHandlers.onReceiveResponse(response);
            return;
          }
          this._challenged = true;

          // Update ha1 and realm in the UA.
          this._ua.set('realm', this._auth.get('realm'));
          this._ua.set('ha1', this._auth.get('ha1'));
          if (challenge.stale) {
            this._staled = true;
          }
          this._request = this._request.clone();
          this._request.cseq += 1;
          this._request.setHeader('cseq', "".concat(this._request.cseq, " ").concat(this._method));
          this._request.setHeader(authorization_header_name, this._auth.toString());
          this._eventHandlers.onAuthenticated(this._request);
          this.send();
        } else {
          this._eventHandlers.onReceiveResponse(response);
        }
      } else {
        this._eventHandlers.onReceiveResponse(response);
      }
    }
  }]);
  return RequestSender;
}();