import * as bodyParser from "body-parser";
import * as config from "config";
import * as express from "express";
import * as winston from "winston";

// individual apis
import { GameStatsApiRouter } from "./game_stats_api";
import { MatchApiRouter } from "./match_api";
import { UserApiRouter } from "./user_api";

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
app.use("/api/v2/match/", MatchApiRouter);
app.use("/api/v2/game_stats/", GameStatsApiRouter);
app.use("/api/v2/user/", UserApiRouter);

const config_port = config.get("port");

app.listen(config_port, () => {
    winston.info(`Listening on port ${config.get("port")}`);
});