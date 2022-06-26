"use strict";

function _typeof(obj) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (obj) { return typeof obj; } : function (obj) { return obj && "function" == typeof Symbol && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }, _typeof(obj); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); Object.defineProperty(Constructor, "prototype", { writable: false }); return Constructor; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); Object.defineProperty(subClass, "prototype", { writable: false }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

function _createSuper(Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct(); return function _createSuperInternal() { var Super = _getPrototypeOf(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = _getPrototypeOf(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return _possibleConstructorReturn(this, result); }; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } else if (call !== void 0) { throw new TypeError("Derived constructors may only return object or undefined"); } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {})); return true; } catch (e) { return false; } }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

var EventEmitter = require('events').EventEmitter;

var debugerror = require('debug')('JsSIP:ERROR:RTCSession:Info');

debugerror.log = console.warn.bind(console);

var JsSIP_C = require('../Constants');

var Exceptions = require('../Exceptions');

var Utils = require('../Utils');

module.exports = /*#__PURE__*/function (_EventEmitter) {
  _inherits(Info, _EventEmitter);

  var _super = _createSuper(Info);

  function Info(session) {
    var _this;

    _classCallCheck(this, Info);

    _this = _super.call(this);
    _this._session = session;
    _this._direction = null;
    _this._contentType = null;
    _this._body = null;
    return _this;
  }

  _createClass(Info, [{
    key: "contentType",
    get: function get() {
      return this._contentType;
    }
  }, {
    key: "body",
    get: function get() {
      return this._body;
    }
  }, {
    key: "send",
    value: function send(contentType, body) {
      var _this2 = this;

      var options = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
      this._direction = 'outgoing';

      if (contentType === undefined) {
        throw new TypeError('Not enough arguments');
      } // Check RTCSession Status.


      if (this._session.status !== this._session.C.STATUS_CONFIRMED && this._session.status !== this._session.C.STATUS_WAITING_FOR_ACK) {
        throw new Exceptions.InvalidStateError(this._session.status);
      }

      this._contentType = contentType;
      this._body = body;
      var extraHeaders = Utils.cloneArray(options.extraHeaders);
      extraHeaders.push("Content-Type: ".concat(contentType));

      this._session.newInfo({
        originator: 'local',
        info: this,
        request: this.request
      });

      this._session.sendRequest(JsSIP_C.INFO, {
        extraHeaders: extraHeaders,
        eventHandlers: {
          onSuccessResponse: function onSuccessResponse(response) {
            _this2.emit('succeeded', {
              originator: 'remote',
              response: response
            });
          },
          onErrorResponse: function onErrorResponse(response) {
            _this2.emit('failed', {
              originator: 'remote',
              response: response
            });
          },
          onTransportError: function onTransportError() {
            _this2._session.onTransportError();
          },
          onRequestTimeout: function onRequestTimeout() {
            _this2._session.onRequestTimeout();
          },
          onDialogError: function onDialogError() {
            _this2._session.onDialogError();
          }
        },
        body: body
      });
    }
  }, {
    key: "init_incoming",
    value: function init_incoming(request) {
      this._direction = 'incoming';
      this.request = request;
      request.reply(200);
      this._contentType = request.hasHeader('Content-Type') ? request.getHeader('Content-Type').toLowerCase() : undefined;
      this._body = request.body;

      this._session.newInfo({
        originator: 'remote',
        info: this,
        request: request
      });
    }
  }]);

  return Info;
}(EventEmitter);