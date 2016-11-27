let express = require("express");
let knex = require("knex")({
    client: "pg",
    connection: {
        host: process.env.DB_HOST,
        user: process.env.DB_USER,
        password: process.env.DB_PASS,
        database: process.env.DB_DB
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