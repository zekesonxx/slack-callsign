const request = require('request');
var debug = require('debug')('scs:hamqth');
var parseString = require('xml2js').parseString;

const refreshParams = {
  u: process.env.SCS_HAMQTH_USERNAME,
  p: process.env.SCS_HAMQTH_PASSWORD
};

var sessionid = null;

function basicRequest(params, callback) {
  debug('sending request');
  request.get({
    url: 'https://www.hamqth.com/xml.php',
    qs: params
  }, function(err, res, body) {
    debug('got response back');
    if (err) { callback(err); return; }
    parseString(body, function(err, rawresult) {
      if (err) { callback(err); return; }
      var result = rawresult.HamQTH;
      if (result.session !== undefined && result.session[0].error !== undefined) {
        callback(new Error(result.session[0].error));
      } else {
        callback(null, result);
      }
    });
  });
}

function sessionIDRequest(params, callback) {
  params.id = sessionid;
  basicRequest(params, (err, result) => {
    if (err) {
      if (err.message.toString() === 'Session does not exist or expired') {
        debug('automatically refreshing session ID');
        basicRequest(refreshParams, (err, data) => {
          if (err) {
            callback(err);
          } else {
            sessionid = data.session[0].session_id;
            params.id = sessionid;
            basicRequest(params, callback);
          }
        });
      } else {
        callback(err);
      }
    } else {
      callback(null, result);
    }
  });
}

module.exports = {
  sessionIDRequest: sessionIDRequest,
  basicRequest: basicRequest
};
