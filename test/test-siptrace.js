require('./include/common');
const JsSIP = require('../');
const RTCSession = require('../lib-es5/RTCSession');
const testUA = require('./include/testUA');

const C = RTCSession.C;

function createUA() {
  const config = Object.assign({}, testUA.UA_CONFIGURATION);

  config.sockets = new JsSIP.WebSocketInterface(testUA.SOCKET_DESCRIPTION.url);

  return new JsSIP.UA(config);
}

module.exports = {

  '_trace is zero-cost with no siptrace listener': function(test) {
    const ua = createUA();

    ua.emit = function() {
      test.ok(false, 'emit must not be called when no siptrace listener is attached');
    };

    const fakeSession = {
      _ua: ua,
      _request: { call_id: 'abc-123' },
      _direction: 'incoming',
      _status: C.STATUS_WAITING_FOR_ANSWER
    };

    RTCSession.prototype._trace.call(fakeSession, 'tx_180');

    test.ok(true, 'no emit happened');
    test.done();
  },

  '_trace emits compact payload when a listener is attached': function(test) {
    const ua = createUA();
    const events = [];

    ua.on('siptrace', (e) => events.push(e));

    const fakeSession = {
      _ua: ua,
      _request: { call_id: 'abc-123' },
      _direction: 'incoming',
      _status: C.STATUS_WAITING_FOR_ANSWER
    };

    RTCSession.prototype._trace.call(fakeSession, 'cancel_rx', { processed: false });

    test.strictEqual(events.length, 1);
    test.strictEqual(events[0].type, 'cancel_rx');
    test.strictEqual(events[0].call_id, 'abc-123');
    test.strictEqual(events[0].direction, 'incoming');
    test.strictEqual(events[0].status, C.STATUS_WAITING_FOR_ANSWER);
    test.strictEqual(events[0].processed, false);
    test.strictEqual(typeof events[0].time, 'number');
    test.done();
  },

  '_trace never throws when a listener throws': function(test) {
    const ua = createUA();

    ua.on('siptrace', () => {
      throw new Error('listener boom');
    });

    const fakeSession = {
      _ua: ua,
      _request: { call_id: 'abc-123' },
      _direction: 'incoming',
      _status: C.STATUS_CONFIRMED
    };

    test.doesNotThrow(() => {
      RTCSession.prototype._trace.call(fakeSession, 'bye_rx');
    });
    test.done();
  },

  'answer() transmits a stored preAnswer reply while still answerable': function(test) {
    const ua = createUA();
    const events = [];
    const replyCalls = [];

    ua.on('siptrace', (e) => events.push(e.type));

    const session = new RTCSession(ua);

    session._direction = 'incoming';
    session._status = C.STATUS_ANSWERED;
    session.preAnsweredCall = true;
    session._request = { call_id: 'call-1' };
    session.replyObject = {
      code: 200,
      extraHeaders: [],
      desc: 'v=0',
      request: {
        call_id: 'call-1',
        reply: function(code, reason, extraHeaders, body) {
          // Success/failure callbacks deliberately not invoked: this test
          // asserts the transmit decision, not the post-send state machine.
          replyCalls.push({ code, body });
        }
      }
    };

    session.answer();

    test.strictEqual(replyCalls.length, 1, 'stored 200 OK must be transmitted');
    test.strictEqual(replyCalls[0].code, 200);
    test.strictEqual(session.replyObject, undefined, 'stored reply must be consumed');
    test.ok(events.indexOf('answer_stored_reply') !== -1);
    test.ok(events.indexOf('tx_2xx_attempt') !== -1);
    test.done();
  },

  'answer() refuses a stored preAnswer reply on a dead session': function(test) {
    const ua = createUA();
    const events = [];
    const replyCalls = [];

    ua.on('siptrace', (e) => events.push(e));

    const session = new RTCSession(ua);

    session._direction = 'incoming';
    // A CANCEL processed while ringing leaves the session TERMINATED
    // (STATUS_CANCELED is transient; _close() runs during _failed()).
    session._status = C.STATUS_TERMINATED;
    session.preAnsweredCall = true;
    session._request = { call_id: 'call-2' };
    session.replyObject = {
      code: 200,
      extraHeaders: [],
      desc: 'v=0',
      request: {
        call_id: 'call-2',
        reply: function() {
          replyCalls.push(true);
        }
      }
    };

    let thrown = null;

    try {
      session.answer();
    }
    catch (error) {
      thrown = error;
    }

    test.ok(thrown, 'answer() must throw on a dead preAnswered session');
    test.strictEqual(thrown.name, 'INVALID_STATE_ERROR');
    test.strictEqual(replyCalls.length, 0, '200 OK must NOT be transmitted');
    test.strictEqual(session.replyObject, undefined, 'stale reply must be dropped');

    const stale = events.filter((e) => e.type === 'answer_stale_reply');

    test.strictEqual(stale.length, 1);
    test.strictEqual(stale[0].stale_status, C.STATUS_TERMINATED);
    test.done();
  },

  'CANCEL on a post-answer session is traced as ignored': function(test) {
    const ua = createUA();
    const events = [];

    ua.on('siptrace', (e) => events.push(e));

    const session = new RTCSession(ua);

    session._direction = 'incoming';
    session._status = C.STATUS_CONFIRMED;
    session._request = { call_id: 'call-3' };

    session.receiveRequest({ method: JsSIP.C.CANCEL });

    const cancels = events.filter((e) => e.type === 'cancel_rx');

    test.strictEqual(cancels.length, 1, 'ignored CANCEL must still be traced');
    test.strictEqual(cancels[0].processed, false);
    test.strictEqual(session._status, C.STATUS_CONFIRMED, 'session must stay confirmed');
    test.done();
  },

  'UA._traceUnmatched emits for unmatched requests': function(test) {
    const ua = createUA();
    const events = [];

    ua.on('siptrace', (e) => events.push(e));

    ua._traceUnmatched('cancel_rx_unmatched', { call_id: 'zombie-1', method: 'CANCEL' });

    test.strictEqual(events.length, 1);
    test.strictEqual(events[0].type, 'cancel_rx_unmatched');
    test.strictEqual(events[0].call_id, 'zombie-1');
    test.strictEqual(events[0].method, 'CANCEL');
    test.done();
  }
};
