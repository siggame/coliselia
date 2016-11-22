let express         = require("express");
let config          = require("config");
let winston         = require("winston");
let bodyParser      = require("body-parser");

// individual apis
let matchApi        = require("./match_api");
let gameStatsApi    = require("./game_stats_api");
let userApi         = require("./user_api");

let app = express();

app.use( bodyParser.urlencoded({ extended: true }) );
app.use( bodyParser.json() );
app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Methods", "GET,PUT,POST,DELETE,OPTIONS");
    res.header("Access-Control-Allow-Headers", "X-Requested-With, X-HTTP-Method-Override, Content-Type, Accept");
    next();
});

app.use((req, res, next) => {
    winston.info(`${req.method}\t${req.path}\t${JSON.stringify(req.body)}`);
    next();
});

// use apis
app.use("/", matchApi);
app.use("/", gameStatsApi);
app.use("/api/v2/user/", userApi);

app.listen(config.port, () => {
    winston.info(`Listening on port ${config.port}`);
});