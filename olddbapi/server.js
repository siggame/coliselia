var express = require("express");
var winston = require("winston");
var bodyParser = require("body-parser");
var config = require("config");
var knex = require("knex")({
    client: "pg",
    connection: {
        host: process.env.DB_HOST,
        user: process.env.DB_USER,
        password: process.env.DB_PASS,
        database: process.env.DB_NAME,
    }
});
// individual apis
var matchApi = require("./match_api");
var gameStatsApi = require("./game_stats_api");
var userApi = require("./user_api");
var app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Methods", "GET,PUT,POST,DELETE,OPTIONS");
    res.header("Access-Control-Allow-Headers", "X-Requested-With, X-HTTP-Method-Override, Content-Type, Accept");
    next();
});
app.use(function (req, res, next) {
    winston.info(req.method + "\t" + req.path + "\t" + JSON.stringify(req.body));
    next();
});
// use apis
app.use("/api/v2/match/", matchApi);
app.use("/api/v2/game_stats/", gameStatsApi);
app.use("/api/v2/user/", userApi);
app.listen(config.port, function () {
    winston.info("Listening on port " + config.port);
});
