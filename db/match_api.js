let express = require("express");
let config = require("config");
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

router.get("/", (req, res) => {

});

router.get("/:id", (req, res) => {
    knex("match").where("id", req.params.id)
        .then((rows) => {
            if(rows.length !== 1) throw new Error("Didnt get thing");
            return rows;
        })
        .then((rows) => {
            res.status(200).send(rows[0]);
        })
        .catch((err) => {
            res.status(404).send(err);
        })
});

router.post("/:id/update/", (req, res) => {

});

router.post("/api/v2/match/", function(req, res){

    //knex("match").insert(req.body);
});

module.exports = router;