import * as express from "express";
import * as Knex from "knex";

let knex = Knex({
    client: "pg",
    connection: {
        host: process.env.DB_HOST,
        user: process.env.DB_USER,
        password: process.env.DB_PASS,
        database: process.env.DB_NAME,
    },
});

let router = express.Router();

router.get("/", (req, res) => {
});

router.get("/:id", (req, res) => {
});


router.post("/", (req, res) => {
});


export { router as UserApiRouter };