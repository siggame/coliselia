let express = require("express");
let config = require("config");
let winston = require("winston");
let bodyParser = require("body-parser");

// individual apis
let matchApi = require("./match_api");
let gameStatsApi = require("./game_stats_api");

let app = express();

// use apis
app.use("/api/v2/match/", matchApi);
app.use("/api/v2/game_stats/", gameStatsApi);

app.use( bodyParser.json() );
app.use( bodyParser.urlencoded({ extended: true }) );
app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Methods", "GET,PUT,POST,DELETE,OPTIONS");
    res.header("Access-Control-Allow-Headers", "X-Requested-With, X-HTTP-Method-Override, Content-Type, Accept");
    next();
});

app.use((req, res, next) => {
    winston.info(`${req.method}\t${req.path}`);
    next();
});

app.listen(config.port, () => {
    winston.info(`Listening on port ${config.port}`);
});