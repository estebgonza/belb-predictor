require('dotenv').config();

var async = require('async');
var express = require('express');
var bodyParser = require('body-parser');
var r = require('rethinkdb');

var config = require(__dirname + '/modules/config.js');
var probability = require(__dirname + '/modules/probability.js');
var matches = require(__dirname + '/modules/matches.js');

var app = express();

app.use(bodyParser.json());

// Probability
app.route('/probability/:teamHomeId/:teamAwayId').get(probability.getProbability);

/*
 * Store the db connection and start listening on a port.
 */
function startExpress(connection) {
  app._rdbConn = connection;
  app.listen(config.express.port);
}

/*
 * Connect to rethinkdb
 * Able to create Tables/Database if we want here and not in the scrapper :)
 */
async.waterfall([
  function connect(callback) {
    r.connect(config.rethinkdb, callback);
  },
  function loadMatches(connection, callback) {
    r.table(process.env.RDB_TABLE_MATCHES).run(connection, (err, cursor) => {
      // Retrieve all users in an array.
      cursor.toArray(function (err, result) {
        matches.setMatches(result)
        console.log(`Loaded ${result.length} matches from database.`)
      });
      callback(err, connection);
    });
  }
], function (err, connection) {
  if (err) {
    console.error(err);
    process.exit(1);
    return;
  }
  startExpress(connection);
  console.log(`Predictor ready on ${process.env.HTTP_HOST}:${process.env.HTTP_PORT}`)
});