import * as express from 'express';
import * as Knex from 'knex';
import * as _ from 'lodash';
import * as winston from 'winston';
import { Validator } from 'jsonschema';
import { user as schemas } from '../../schemas';

let knex = Knex({
    client: 'pg',
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

router.param('id', (req, res, next, id) => {
    next();
});

/**
 * @apiName GetUsers
 * @api {get} /api/v2/user/
 * @apiGroup User
 * @apiDescription Get users given by query params
 */
router.get('/', (req, res) => {
    // query validation
    let result = v.validate(req.query, schemas.getUsersQuery);
    if(result.errors.length > 0) {
        return res.status(400).send({error: result.errors[0]});
    }

    //TODO: apply query params to SQL query

    knex('user').asCallback((err, rows) => {
        if(err) return res.status(400).send(err);
        res.status(200).send(rows);
    });
});

/**
 * @apiName GetUser
 * @api {get} /api/v2/user/:id
 * @apiGroup User
 * @apiDescription Get user given by user id
 */
router.get('/:id', (req, res) => {
    // params validation
    let result = v.validate(req.params, schemas.getUserParams);
    if(result.errors.length > 0) {
        return res.status(400).send({error: result.errors[0]});
    }

    knex('user').where('id', req.params['id']).asCallback((err, rows) => {
        if(err) return res.status(400).send(err);
        if(rows.length !== 1) return res.status(404).send({error: `User with id ${req.params['id']} not found`});
        res.status(200).send(rows[0]);
    });
});

/**
 * @apiName CreateUser
 * @api {post} /api/v2/user
 * @apiGroup User
 * @apiDescription Create user from request body
 */
router.post('/', (req, res) => {
    // body validation
    let result = v.validate(req.body, schemas.createUserBody);
    if(result.errors.length > 0) {
        return res.status(400).send({error: result.errors[0]});
    }

    knex('user').insert(req.body, '*').asCallback((err, users) => {
        if(err) return res.status(400).send(err);
        if(users.length !== 1) return res.status(404).send({error: 'User was not created'});
        res.status(200).send(users[0]);
    });
});

/**
 * @apiName UpdateUser
 * @api {post} /api/v2/user/:id
 * @apiGroup User
 * @apiDescription Update user, by given user id, from body
 */
router.post('/:id', (req, res) => {
    // params validation
    let result = v.validate(req.params, schemas.updateUserParams);
    if(result.errors.length > 0) {
        return res.status(400).send({error: result.errors[0]});
    }
    // body validation
    result = v.validate(req.body, schemas.updateUserBody);
    if(result.errors.length > 0) {
        return res.status(400).send({error: result.errors[0]});
    }

    req.body['modified_time'] = 'now()';

    knex('user').where('id', req.params['id']).update(req.body, '*').asCallback((err, rows) => {
        if(err) return res.status(400).send(err);
        if(rows.length !== 1) return res.status(404).send({error: `User with id ${req.params['id']} not found`});
        res.status(200).send(rows[0]);
    });
});

export { router as user };
