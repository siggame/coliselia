let express = require("express");
let knex = require("knex")({
    client: "pg",
    connection: {
        host: process.env.DB_HOST,
        port: process.env.DB_PORT,
        user: process.env.DB_USER,
        password: process.env.DB_PASS,
        database: process.env.DB_DB,
    }
});

let router = express.Router();

router.get("/", (req, res) => {
    res.status(400).send("UNIMPLEMENTED");
});

module.exports = router;