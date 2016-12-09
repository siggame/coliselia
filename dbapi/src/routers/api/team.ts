import * as express from 'express';
import * as Knex from 'knex';
import * as _ from 'lodash';
import * as winston from 'winston';
import { Validator } from 'jsonschema';
import { team as schemas } from '../../schemas';

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
 * @apiName GetTeams
 * @api {get} /api/v2/team/
 * @apiGroup Team
 * @apiDescription Get teams given by query params
 */
router.get('/', (req, res) => {
    // query validation
    let result = v.validate(req.query, schemas.getTeamsQuery);
    if(result.errors.length > 0) {
        return res.status(400).send({error: result.errors[0]});
    }

    //TODO: apply query params to SQL query

    knex('team').asCallback((err, rows) => {
        if(err) return res.status(400).send(err);
        res.status(200).send(rows);
    });
});

/**
 * @apiName GetTeamById
 * @api {get} /api/v2/team/:id
 * @apiGroup Team
 * @apiDescription Get team given by team id
 */
router.get('/:id', (req, res) => {
    // params validation
    let result = v.validate(req.params, schemas.getTeamParams);
    if(result.errors.length > 0) {
        return res.status(400).send({error: result.errors[0]});
    }

    knex('team').where('id', req.params['id']).asCallback((err, rows) => {
        if(err) return res.status(400).send(err);
        if(rows.length !== 1) return res.status(404).send({error: `Team with id ${req.params['id']} not found`});
        res.status(200).send(rows[0]);
    });
});

/**
 * @apiName CreateTeam
 * @api {post} /api/v2/team/
 * @apiGroup Team
 * @apiDescription Create team from request body
 */
router.post('/', (req, res) => {
    // body validation
    let result = v.validate(req.body, schemas.createTeamBody);
    if(result.errors.length > 0) {
        return res.status(400).send({error: result.errors[0]});
    }

    knex('team').insert(req.body, '*').asCallback((err, users) => {
        if(err) return res.status(400).send(err);
        if(users.length !== 1) return res.status(404).send( new Error('New user not returned') );
        res.status(200).send(users[0]);
    });
});

/**
 * @apiName UpdateTeamById
 * @api {post} /api/v2/team/:id
 * @apiGroup Team
 * @apiDescription Update team, given by team id, with request body
 */
router.post('/:id', (req, res) => {
    // params validation
    let result = v.validate(req.params, schemas.updateTeamParams);
    if(result.errors.length > 0) {
        return res.status(400).send({error: result.errors[0]});
    }
    // body validation
    result = v.validate(req.body, schemas.updateTeamBody);
    if(result.errors.length > 0) {
        return res.status(400).send({error: result.errors[0]});
    }

    req.body['modified_time'] = 'now()';

    knex('team').where('id', req.params['id']).update(req.body, '*').asCallback((err, rows) => {
        if(err) return res.status(400).send(err);
        if(rows.length !== 1) return res.status(404).send({error: `User with id ${req.params['id']} not found`});
        res.status(200).send(rows[0]);
    });
});

export { router as team };
