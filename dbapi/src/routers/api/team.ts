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
    // convert strings to booleans
    for (let boolProp of ['is_paid', 'is_eligible', 'is_embargoed']) {
        if (req.query.hasOwnProperty(boolProp)) {
            req.query[boolProp] = JSON.parse(req.query[boolProp]);
        }
    }

    // convert strings to numbers
    for (let numProp of ['id', 'gitlab_id', 'limit', 'offset']) {
        if (req.query.hasOwnProperty(numProp) &&
            /\d+/.test(req.query[numProp])) {
            if (_.isArray(req.query[numProp])) {
                req.query[numProp] = req.query[numProp].map(Number);
            }
            else {
                req.query[numProp] = Number(req.query[numProp]);
            }
        }
    }

    // query validation
    let result = v.validate(req.query, schemas.getTeamsQuery);
    if (result.errors.length > 0) {
        return res.status(400).send({ error: result.errors[0] });
    }
    let teams = knex('team')
        .offset(req.query['offset'] || 0)
        .limit(req.query['limit'] || Infinity);

    delete req.query['offset'];
    delete req.query['limit'];

    for (let field in req.query) {
        if (/^max_/.test(field)) {
            teams.where(field.substr(4), '<=', req.query[field] || 'infinity');
        }
        else if (/^min_/.test(field)) {
            teams.where(field.substr(4), '>=', req.query[field] || '-infinity');
        }
        else {
            if (_.isArray(req.query[field]))
                teams.whereIn(field, req.query[field]);
            else teams.where(field, req.query[field]);
        }
    }

    teams.then((rows) => {
        res.status(200).send(rows);
    }).catch((err) => {
        res.status(400).send(err);
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
    if (result.errors.length > 0) {
        return res.status(400).send({ error: result.errors[0] });
    }

    knex('team').where(req.params).then((team) => {
        if (team.length !== 1) return res.status(404).send({ error: `Team with id ${req.params.id} not found` });
        res.status(200).send(team[0]);
    }).catch((err) => {
        res.status(400).send(err);
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
    if (result.errors.length > 0) {
        return res.status(400).send({ error: result.errors[0] });
    }

    knex('team').insert(req.body, '*').then((team) => {
        if (team.length !== 1) return res.status(404).send({ error: 'New user not returned' });
        res.status(201).send(team[0]);
    }).catch((err) => {
        res.status(400).send(err);
    });
});

/**
 * @apiName UpdateTeamById
 * @api {post} /api/v2/team/:id
 * @apiGroup Team
 * @apiDescription Update team, given by team id, with request body
 */
router.post('/:id', (req, res) => {
    //convert string to number
    if (/\d+/.test(req.params.id)) {
        req.params.id = Number(req.params.id);
    }

    // params validation
    let result = v.validate(req.params, schemas.updateTeamParams);
    if (result.errors.length > 0) {
        return res.status(400).send({ error: result.errors[0] });
    }
    // body validation
    result = v.validate(req.body, schemas.updateTeamBody);
    if (result.errors.length > 0) {
        return res.status(400).send({ error: result.errors[0] });
    }

    req.body['modified_time'] = 'now()';

    knex('team').where(req.params).update(req.body, '*').then((team) => {
        if (team.length !== 1) return res.status(404).send({ error: `Team with id ${req.params.id} not found` });
        res.status(200).send(team[0]);
    }).catch((err) => {
        res.status(400).send(err);
    });
});

/**
 * @apiName DeleteTeamById
 * @api {post} /api/v2/team/:id/delete
 * @apiGroup Team
 * @apiDescription Delete team, given by team id
 */
router.post('/:id/delete', (req, res) => {
    //convert string to number
    if (/\d+/.test(req.params.id)) {
        req.params.id = Number(req.params.id);
    }

    let result = v.validate(req.params, schemas.updateTeamParams);
    if (result.errors.length > 0) {
        return res.status(400).send({ error: result.errors[0] });
    }

    knex('team').where(req.params).del('id')
        .then((id) => {
            if (id.length != 1) return res.status(404).send({ error: `Team with id ${req.params.id} not found` });
            res.status(200).send(id);
        })
        .catch((err) => {
            res.status(400).send(err);
        });
});

export { router as team };
