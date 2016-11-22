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



router.get("/:id", (req, res) => {
    res.status(400).send("UNIMPLEMENTED");
});

router.post("/api/v2/match/", function(req, res){
    res.status(400).send("UNIMPLEMENTED");
});

module.exports = router;