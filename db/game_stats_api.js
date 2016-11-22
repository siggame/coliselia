let express = require("express");
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
    res.status(400).send("UNIMPLEMENTED");
});

module.exports = router;