var express = require('express');
var path = require('path');
var logger = require('morgan');
var bodyParser = require('body-parser');
var hamqth = require('./hamqth');

const VALIDATION_TOKEN = process.env.SCS_VALIDATION_TOKEN;

if (!process.env.SCS_VALIDATION_TOKEN) {
  throw new Error('setup your environment variables!');
}

var app = express();

app.use(logger('dev'));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

// The actual command
app.post('/slack', function(req, res, next) {
  if (typeof req.body !== 'object') {
    res.status(400).end('malformed request');
  }
  if (req.body.token != VALIDATION_TOKEN) {
    res.status(400).end('invalid token');
  }
  if (req.body.text === undefined || req.body.text.length < 2) {
    res.end('/callsign <callsign>: Looks up a callsign and displays the owner\'s info');
  }
  var reqestedcallsign = req.body.text.split(' ')[0].toUpperCase();
  hamqth.sessionIDRequest({
    callsign: reqestedcallsign,
    prg: 'slack-callsign'
  }, (err, data) => {
    if (err) {
      res.end('Failed to get callsign data.');
    } else {
      var search = data.search[0];
      var text = '*' + search.callsign[0].toUpperCase() + '*';
      text += ' ' + search.adr_name[0];
      text += ` [<https://www.hamqth.com/${search.callsign[0]}|HamQTH>, <https://www.qrz.com/db/?callsign=${search.callsign[0]}|QRZ>]`;
      text += '\n';
      text += 'country: ' + search.country[0];
      text += ', gridsquare: ' + search.grid[0].toUpperCase();
      res.json({
        text: text
      });
    }
  });
});

// catch 404 and forward to error handler
app.use(function(req, res) {
  res.status(404);
  res.end('404 not found');
});

// error handler
app.use(function(err, req, res, next) {
  console.log(err);
  res.status(500);
  res.end('somethin bad happened on the serverside');
});

module.exports = app;
