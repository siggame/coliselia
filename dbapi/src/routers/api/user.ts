import * as express from "express";
import { Validator } from "jsonschema";
import * as Knex from "knex";
import * as _ from "lodash";
import * as winston from "winston";
import { user as schemas } from "../../schemas";

let knex = Knex({
    client: "pg",
    connection: {
        database: process.env.DB_NAME,
        host: process.env.DB_HOST,
        password: process.env.DB_PASS,
        port: process.env.DB_PORT,
        user: process.env.DB_USER,
    },
});

let v: Validator = new Validator();

let router = express.Router();

router.param("id", (req, res, next, id) => {
    next();
});

/**
 * @apiName GetUsers
 * @api {get} /api/v2/user/
 * @apiGroup User
 * @apiDescription Get users given by query params
 */
router.get("/", (req, res) => {
    // query validation
    let result = v.validate(req.query, schemas.getUsersQuery);
    if (result.errors.length > 0) {
        return res.status(400).send({ error: result.errors[0] });
    }

    let sql = knex("user");

    for(let key of ["id", "name", "full_name", "email"]) {
        if(req.query.hasOwnProperty(key)) {
            if(_.isArray(req.query[key])) sql = sql.whereIn(key, req.query[key]);
            else sql = sql.where(key, req.query[key]);
        }
    }

    for(let key of ["is_dev", "is_student", "is_sponsor", "is_prev_competitor"]) {
        sql = sql.where(key, req.query[key]);
    }

    // created & modified times
    if(req.query.hasOwnProperty("min_created_time")) {
        sql = sql.where("created_time", ">=", req.query["min_created_time"]);
    }
    if(req.query.hasOwnProperty("max_created_time")) {
        sql = sql.where("created_time", "<=", req.query["max_created_time"]);
    }
    if(req.query.hasOwnProperty("min_modified_time")) {
        sql = sql.where("modified_time", ">=", req.query["min_modified_time"]);
    }
    if(req.query.hasOwnProperty("max_modified_time")) {
        sql = sql.where("modified_time", "<=", req.query["max_modified_time"]);
    }

    // limit & offset
    if(req.query.hasOwnProperty("limit"))   sql = sql.limit(req.query["limit"]);
    if(req.query.hasOwnProperty("offset"))  sql = sql.offset(req.query["offset"]);

    sql.then((rows) => {
        res.status(200).send(rows);
    })
    .catch((err) => {
        res.status(400).send(err);
    });
});

/**
 * @apiName GetUser
 * @api {get} /api/v2/user/:id
 * @apiGroup User
 * @apiDescription Get user given by user id
 */
router.get("/:id", (req, res) => {
    // params validation
    let result = v.validate(req.params, schemas.getUserParams);
    if (result.errors.length > 0) {
        return res.status(400).send({ error: result.errors[0] });
    }

    knex("user").where(req.params).then((user) => {
        if (user.length !== 1) return res.status(404).send({ error: `User with id  ${req.params.id} not found` });
        res.status(200).send(user[0]);
    }).catch((err) => {
        res.status(400).send(err);
    });
});

/**
 * @apiName CreateUser
 * @api {post} /api/v2/user
 * @apiGroup User
 * @apiDescription Create user from request body
 */
router.post("/", (req, res) => {
    // body validation
    let result = v.validate(req.body, schemas.createUserBody);
    if (result.errors.length > 0) {
        return res.status(400).send({ error: result.errors[0] });
    }

    //TODO: create user on gitlab

    knex("user").insert(req.body, "*").then((user) => {
        if (user.length !== 1) return res.status(404).send({ error: "User was not created" });
        res.status(201).send(user[0]);
    }).catch((err) => {
        res.status(400).send(err);
    });
});

/**
 * @apiName UpdateUser
 * @api {post} /api/v2/user/:id
 * @apiGroup User
 * @apiDescription Update user, by given user id, from body
 */
router.post("/:id", (req, res) => {
    // params validation
    let result = v.validate(req.params, schemas.updateUserParams);
    if (result.errors.length > 0) {
        return res.status(400).send({ error: result.errors[0] });
    }
    // body validation
    result = v.validate(req.body, schemas.updateUserBody);
    if (result.errors.length > 0) {
        return res.status(400).send({ error: result.errors[0] });
    }

    //TODO: update gitlab if needed

    req.body["modified_time"] = "now()";

    knex("user").where(req.params).update(req.body, "*").then((user) => {
        if (user.length !== 1) return res.status(404).send({ error: `User with id ${req.params.id} not found` });
        res.status(200).send(user[0]);
    }).catch((err) => {
        res.status(400).send(err);
    });
});

//TODO: Add user deletion

export { router as user };
