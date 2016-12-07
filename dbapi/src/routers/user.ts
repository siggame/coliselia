import * as express from "express";
import * as winston from "winston";
import * as Knex from "knex";
import * as _ from "lodash";

let knex = Knex({
    client: "pg",
    connection: {
        host: process.env.DB_HOST,
        user: process.env.DB_USER,
        password: process.env.DB_PASS,
        database: process.env.DB_NAME,
        port: process.env.DB_PORT,
    },
});

let router = express.Router();

router.param('id', (req, res, next, id) => {
    next();
});

router.get("/", (req, res) => {

});

router.get()

/**
 * Get a user by id
 */
router.get('/:id', (req, res) => {
    let user_id: number = req.params.id;

    knex('user').where('id', user_id).asCallback((err, users) => {
        if(err) return res.status(400).send(err);
        if(users.length !== 1) return res.status(404).send( new Error('New user not returned') );
        res.status(200).send(users[0]);
    });
});

/**
 * Create a user
 */
router.post('/', (req, res) => {
    if(req.body.hasOwnProperty('id')) return res.status(400).send( new Error('Cannot create user with an id value') );
    if(req.body.hasOwnProperty('modified_time')) return res.status(400).send( new Error('Cannot create user with a modified_time value') );
    if(req.body.hasOwnProperty('created_time')) return res.status(400).send( new Error('Cannot create user with an created_time value') );

    knex('user').insert(req.body, '*').asCallback((err, users) => {
        if(err) return res.status(400).send(err);
        if(users.length !== 1) return res.status(404).send( new Error('New user not returned') );
        res.status(200).send(users[0]);
    });
});

/**
 * Update a user by id
 */
router.post('/:id/update', () => {

})


export { router as UserRouter };