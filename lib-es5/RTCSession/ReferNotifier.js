"use strict";

function _typeof(obj) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (obj) { return typeof obj; } : function (obj) { return obj && "function" == typeof Symbol && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }, _typeof(obj); }
function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, _toPropertyKey(descriptor.key), descriptor); } }
function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); Object.defineProperty(Constructor, "prototype", { writable: false }); return Constructor; }
function _toPropertyKey(arg) { var key = _toPrimitive(arg, "string"); return _typeof(key) === "symbol" ? key : String(key); }
function _toPrimitive(input, hint) { if (_typeof(input) !== "object" || input === null) return input; var prim = input[Symbol.toPrimitive]; if (prim !== undefined) { var res = prim.call(input, hint || "default"); if (_typeof(res) !== "object") return res; throw new TypeError("@@toPrimitive must return a primitive value."); } return (hint === "string" ? String : Number)(input); }
var JsSIP_C = require('../Constants');
var debug = require('debug')('JsSIP:RTCSession:ReferNotifier');
var C = {
  event_type: 'refer',
  body_type: 'message/sipfrag;version=2.0',
  expires: 300
};
module.exports = /*#__PURE__*/function () {
  function ReferNotifier(session, id, expires) {
    _classCallCheck(this, ReferNotifier);
    this._session = session;
    this._id = id;
    this._expires = expires || C.expires;
    this._active = true;

    // The creation of a Notifier results in an immediate NOTIFY.
    this.notify(100);
  }
  _createClass(ReferNotifier, [{
    key: "notify",
    value: function notify(code, reason) {
      debug('notify()');
      if (this._active === false) {
        return;
      }
      reason = reason || JsSIP_C.REASON_PHRASE[code] || '';
      var state;
      if (code >= 200) {
        state = 'terminated;reason=noresource';
      } else {
        state = "active;expires=".concat(this._expires);
      }

      // Put this in a try/catch block.
      this._session.sendRequest(JsSIP_C.NOTIFY, {
        extraHeaders: ["Event: ".concat(C.event_type, ";id=").concat(this._id), "Subscription-State: ".concat(state), "Content-Type: ".concat(C.body_type)],
        body: "SIP/2.0 ".concat(code, " ").concat(reason),
        eventHandlers: {
          // If a negative response is received, subscription is canceled.
          onErrorResponse: function onErrorResponse() {
            this._active = false;
          }
        }
      });
    }
  }]);
  return ReferNotifier;
}();