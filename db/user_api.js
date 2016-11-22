let express = require("express");
let config = require("config");
let winston = require("winston");
let knex = require("knex")({
    client: "pg",
    connection: {
        host: config.database.host,
        user: config.database.user,
        password: config.database.pass,
        database: config.database.db
    }
});

let router = express.Router();

router.get("/:id", (req, res) => {
    try { req.params.id = parseInt(req.params.id) }
    catch(err) { return res.status(400).send(err); }

    knex("user").where("id", req.params.id).asCallback((err, rows)=>{
        if(err) return res.status(400).send(err);
        if(rows.length !== 1) return res.status(400).send("Not found.");

        res.status(200).send(rows[0]);
    });
});


router.post("/", (req, res) => {
    if(typeof req.body !== "object")                return res.status(400).send(`Cannot create with body type ${typeof req.body}`);
    if(req.body.hasOwnProperty("id"))               return res.status(400).send("Cannot create directly with id");
    if(req.body.hasOwnProperty("created_time"))     return res.status(400).send("Cannot create directly with created_time");
    if(req.body.hasOwnProperty("modified_time"))    return res.status(400).send("Cannot create directly with modified_time");

    knex("user").insert(req.body, '*').asCallback((err, rows)=>{
        if(err) return res.status(400).send(err);
        if(rows.length !== 1) return res.status(400).send("Not found.");

        res.status(200).send(rows[0]);
    });
});


module.exports = router;