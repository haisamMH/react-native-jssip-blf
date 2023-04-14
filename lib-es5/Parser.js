"use strict";

function _createForOfIteratorHelper(o, allowArrayLike) { var it = typeof Symbol !== "undefined" && o[Symbol.iterator] || o["@@iterator"]; if (!it) { if (Array.isArray(o) || (it = _unsupportedIterableToArray(o)) || allowArrayLike && o && typeof o.length === "number") { if (it) o = it; var i = 0; var F = function F() {}; return { s: F, n: function n() { if (i >= o.length) return { done: true }; return { done: false, value: o[i++] }; }, e: function e(_e) { throw _e; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var normalCompletion = true, didErr = false, err; return { s: function s() { it = it.call(o); }, n: function n() { var step = it.next(); normalCompletion = step.done; return step; }, e: function e(_e2) { didErr = true; err = _e2; }, f: function f() { try { if (!normalCompletion && it["return"] != null) it["return"](); } finally { if (didErr) throw err; } } }; }
function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }
function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) arr2[i] = arr[i]; return arr2; }
var Grammar = require('./Grammar');
var SIPMessage = require('./SIPMessage');
var debugerror = require('debug')('JsSIP:ERROR:Parser');
debugerror.log = console.warn.bind(console);

/**
 * Parse SIP Message
 */
exports.parseMessage = function (data, ua) {
  var message;
  var bodyStart;
  var headerEnd = data.indexOf('\r\n');
  if (headerEnd === -1) {
    debugerror('parseMessage() | no CRLF found, not a SIP message');
    return;
  }

  // Parse first line. Check if it is a Request or a Reply.
  var firstLine = data.substring(0, headerEnd);
  var parsed = Grammar.parse(firstLine, 'Request_Response');
  if (parsed === -1) {
    debugerror("parseMessage() | error parsing first line of SIP message: \"".concat(firstLine, "\""));
    return;
  } else if (!parsed.status_code) {
    message = new SIPMessage.IncomingRequest(ua);
    message.method = parsed.method;
    message.ruri = parsed.uri;
  } else {
    message = new SIPMessage.IncomingResponse();
    message.status_code = parsed.status_code;
    message.reason_phrase = parsed.reason_phrase;
  }
  message.data = data;
  var headerStart = headerEnd + 2;

  /* Loop over every line in data. Detect the end of each header and parse
  * it or simply add to the headers collection.
  */
  while (true) {
    headerEnd = getHeader(data, headerStart);

    // The SIP message has normally finished.
    if (headerEnd === -2) {
      bodyStart = headerStart + 2;
      break;
    }
    // Data.indexOf returned -1 due to a malformed message.
    else if (headerEnd === -1) {
      debugerror('parseMessage() | malformed message');
      return;
    }
    parsed = parseHeader(message, data, headerStart, headerEnd);
    if (parsed !== true) {
      debugerror('parseMessage() |', parsed.error);
      return;
    }
    headerStart = headerEnd + 2;
  }

  /* RFC3261 18.3.
   * If there are additional bytes in the transport packet
   * beyond the end of the body, they MUST be discarded.
   */
  if (message.hasHeader('content-length')) {
    var contentLength = message.getHeader('content-length');
    message.body = data.substr(bodyStart, contentLength);
  } else {
    message.body = data.substring(bodyStart);
  }
  return message;
};

/**
 * Extract and parse every header of a SIP message.
 */
function getHeader(data, headerStart) {
  // 'start' position of the header.
  var start = headerStart;
  // 'end' position of the header.
  var end = 0;
  // 'partial end' position of the header.
  var partialEnd = 0;

  // End of message.
  if (data.substring(start, start + 2).match(/(^\r\n)/)) {
    return -2;
  }
  while (end === 0) {
    // Partial End of Header.
    partialEnd = data.indexOf('\r\n', start);

    // 'indexOf' returns -1 if the value to be found never occurs.
    if (partialEnd === -1) {
      return partialEnd;
    }
    if (!data.substring(partialEnd + 2, partialEnd + 4).match(/(^\r\n)/) && data.charAt(partialEnd + 2).match(/(^\s+)/)) {
      // Not the end of the message. Continue from the next position.
      start = partialEnd + 2;
    } else {
      end = partialEnd;
    }
  }
  return end;
}
function parseHeader(message, data, headerStart, headerEnd) {
  var parsed;
  var hcolonIndex = data.indexOf(':', headerStart);
  var headerName = data.substring(headerStart, hcolonIndex).trim();
  var headerValue = data.substring(hcolonIndex + 1, headerEnd).trim();

  // If header-field is well-known, parse it.
  switch (headerName.toLowerCase()) {
    case 'via':
    case 'v':
      message.addHeader('via', headerValue);
      if (message.getHeaders('via').length === 1) {
        parsed = message.parseHeader('Via');
        if (parsed) {
          message.via = parsed;
          message.via_branch = parsed.branch;
        }
      } else {
        parsed = 0;
      }
      break;
    case 'from':
    case 'f':
      message.setHeader('from', headerValue);
      parsed = message.parseHeader('from');
      if (parsed) {
        message.from = parsed;
        message.from_tag = parsed.getParam('tag');
      }
      break;
    case 'to':
    case 't':
      message.setHeader('to', headerValue);
      parsed = message.parseHeader('to');
      if (parsed) {
        message.to = parsed;
        message.to_tag = parsed.getParam('tag');
      }
      break;
    case 'record-route':
      parsed = Grammar.parse(headerValue, 'Record_Route');
      if (parsed === -1) {
        parsed = undefined;
      } else {
        var _iterator = _createForOfIteratorHelper(parsed),
          _step;
        try {
          for (_iterator.s(); !(_step = _iterator.n()).done;) {
            var header = _step.value;
            message.addHeader('record-route', headerValue.substring(header.possition, header.offset));
            message.headers['Record-Route'][message.getHeaders('record-route').length - 1].parsed = header.parsed;
          }
        } catch (err) {
          _iterator.e(err);
        } finally {
          _iterator.f();
        }
      }
      break;
    case 'call-id':
    case 'i':
      message.setHeader('call-id', headerValue);
      parsed = message.parseHeader('call-id');
      if (parsed) {
        message.call_id = headerValue;
      }
      break;
    case 'contact':
    case 'm':
      parsed = Grammar.parse(headerValue, 'Contact');
      if (parsed === -1) {
        parsed = undefined;
      } else {
        var _iterator2 = _createForOfIteratorHelper(parsed),
          _step2;
        try {
          for (_iterator2.s(); !(_step2 = _iterator2.n()).done;) {
            var _header = _step2.value;
            message.addHeader('contact', headerValue.substring(_header.possition, _header.offset));
            message.headers.Contact[message.getHeaders('contact').length - 1].parsed = _header.parsed;
          }
        } catch (err) {
          _iterator2.e(err);
        } finally {
          _iterator2.f();
        }
      }
      break;
    case 'content-length':
    case 'l':
      message.setHeader('content-length', headerValue);
      parsed = message.parseHeader('content-length');
      break;
    case 'content-type':
    case 'c':
      message.setHeader('content-type', headerValue);
      parsed = message.parseHeader('content-type');
      break;
    case 'cseq':
      message.setHeader('cseq', headerValue);
      parsed = message.parseHeader('cseq');
      if (parsed) {
        message.cseq = parsed.value;
      }
      if (message instanceof SIPMessage.IncomingResponse) {
        message.method = parsed.method;
      }
      break;
    case 'max-forwards':
      message.setHeader('max-forwards', headerValue);
      parsed = message.parseHeader('max-forwards');
      break;
    case 'www-authenticate':
      message.setHeader('www-authenticate', headerValue);
      parsed = message.parseHeader('www-authenticate');
      break;
    case 'proxy-authenticate':
      message.setHeader('proxy-authenticate', headerValue);
      parsed = message.parseHeader('proxy-authenticate');
      break;
    case 'session-expires':
    case 'x':
      message.setHeader('session-expires', headerValue);
      parsed = message.parseHeader('session-expires');
      if (parsed) {
        message.session_expires = parsed.expires;
        message.session_expires_refresher = parsed.refresher;
      }
      break;
    case 'refer-to':
    case 'r':
      message.setHeader('refer-to', headerValue);
      parsed = message.parseHeader('refer-to');
      if (parsed) {
        message.refer_to = parsed;
      }
      break;
    case 'replaces':
      message.setHeader('replaces', headerValue);
      parsed = message.parseHeader('replaces');
      if (parsed) {
        message.replaces = parsed;
      }
      break;
    case 'event':
    case 'o':
      message.setHeader('event', headerValue);
      parsed = message.parseHeader('event');
      if (parsed) {
        message.event = parsed;
      }
      break;
    default:
      // Do not parse this header.
      message.addHeader(headerName, headerValue);
      parsed = 0;
  }
  if (parsed === undefined) {
    return {
      error: "error parsing header \"".concat(headerName, "\"")
    };
  } else {
    return true;
  }
}