let express = require("express");
let winston = require("winston");
let knex = require("knex")({
    client: "pg",
    connection: {
        host: process.env.DB_HOST,
        user: process.env.DB_USER,
        password: process.env.DB_PASS,
        database: process.env.DB_NAME
    }
});

let router = express.Router();

router.get("/", (req, res) => {
    knex("user").asCallback((err, rows)=>{
        if(err) return res.status(400).send(err);
        res.status(200).send(rows);
    });
});

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