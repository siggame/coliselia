import * as chai from 'chai';
import * as Knex from 'knex';
import * as config from 'config';
let chaiHttp = require('chai-http');
let should: any = require('should');

chai.use(chaiHttp);

const server = `http://localhost:${config['port']}`;

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

// save any newly created teams so they can be used for tests later
let createdTeamIds = [];

describe('Team API', function () {

    before('Clean up', function (done) {
        knex('team').del()
            .then((row) => {
                done();
            })
            .catch((err) => {
                should(err).not.be.ok();
                done();
            });
    });

    describe('GET /api/v2/team/', function () {
        let teams = [
            {
                name: 'testA',
                gitlab_id: 0,
                members: [1],
                prog_lang: 'cpp',
                is_paid: true,
                embargo_reason: ':doot:'
            },
            {
                name: 'testB',
                gitlab_id: 1,
                members: [2, 3],
                prog_lang: 'python',
                is_paid: true,
                is_embargoed: true,
                embargo_reason: 'ayy'
            },
            {
                name: 'testC',
            }];

        let results = {};

        for (let team of teams) {
            results[team.name] = chai.request(server)
                .post('/api/v2/team/')
                .send(team)
                .then((res) => {
                    return res.body;
                });
        }

        it('should get all teams', function (done) {
            chai.request(server)
                .get('/api/v2/team/')
                .end((err, res) => {
                    should(err).not.be.ok();
                    should(res.status).equal(200);
                    for (let team of res.body) {
                        should(results[team.name]).eventually.deepEqual(team);
                    }
                    done();
                });
        });

        it('should fail with invalid field', function (done) {
            chai.request(server)
                .get('/api/v2/team/?noob=420')
                .end((err, res) => {
                    should(err).be.ok();
                    should(res.status).equal(400);
                    done();
                });
        });

        it('should fail with negative limit', function (done) {
            chai.request(server)
                .get('/api/v2/team/?limit=-1')
                .end((err, res) => {
                    should(err).be.ok();
                    should(res.status).equal(400);
                    done();
                });
        });

        it('should apply all query parameters', function (done) {
            chai.request(server)
                .get('/api/v2/team/')
                .query({
                    id: [0, 1, 4],
                    name: ['testA', 'testC'],
                    gitlab_id: [0, 1, 9],
                    prog_lang: 'cpp',
                    is_paid: true,
                    min_paid_time: '-infinity',
                    max_paid_time: 'infinity',
                    is_eligible: false,
                    is_embargoed: false,
                    min_last_embargoed_time: '-infinity',
                    max_last_embargoed_time: 'now()',
                    min_created_time: '-infinity',
                    max_created_time: 'now()',
                    min_modified_time: '-infinity',
                    max_modified_time: 'infinity',
                    offset: 1,
                    limit: 2
                })
                .end((err, res) => {
                    should(err).not.be.ok();
                    should(res.status).equal(200);
                    done();
                });
        });
    });

    describe('POST /api/v2/team/', function () {
        const team = {
            name: 'test1',
            gitlab_id: 0,
            members: [322],
            prog_lang: 'cpp',
            is_paid: true,
            is_eligible: false,
            is_embargoed: false
        };

        it('should create a team', function (done) {
            chai.request(server)
                .post('/api/v2/team/')
                .send(team)
                .end((err, res) => {
                    should(err).not.be.ok();
                    should(res.status).equal(201);
                    should(res.body['name']).equal('test1');
                    should(res.body['is_paid']).equal(true);
                    createdTeamIds.push(res.body['id']);
                    done();
                });
        });

        it('should fail to create a team when given id', function (done) {
            const team = {
                id: 3,
                name: 'test2',
            };
            chai.request(server)
                .post('/api/v2/team/')
                .send(team)
                .end((err, res) => {
                    should(err).be.ok();
                    should(res.status).equal(400);
                    done();
                });
        });

        it('should fail to create a team when given created_time', function (done) {
            const team = {
                name: 'test2',
                created_time: '2001-12-23 14:39:53.662522-05'
            };
            chai.request(server)
                .post('/api/v2/team/')
                .send(team)
                .end((err, res) => {
                    should(err).be.ok();
                    should(res.status).equal(400);
                    done();
                });
        });

        it('should fail to create a team when given modified_time', function (done) {
            const team = {
                name: 'test2',
                modified_time: '2001-12-23 14:39:53.662522-05',
            };
            chai.request(server)
                .post('/api/v2/team/')
                .send(team)
                .end((err, res) => {
                    should(err).be.ok();
                    should(res.status).equal(400);
                    done();
                });
        });

        it('should fail to create a team when given invalid programming language choice', function (done) {
            const team = {
                name: 'test2',
                prog_lang: 'php',
            };
            chai.request(server)
                .post('/api/v2/team/')
                .send(team)
                .end((err, res) => {
                    should(err).be.ok();
                    should(res.status).equal(400);
                    done();
                });
        });
    });

    describe('GET /api/v2/team/:id', function () {
        it('should get a team by id', function (done) {
            chai.request(server)
                .get(`/api/v2/team/${createdTeamIds[0]}`)
                .end((err, res) => {
                    should(err).not.be.ok();
                    should(res.status).equal(200);
                    should(res.body['id']).equal(createdTeamIds[0]);
                    done();
                });
        });

        it('should fail to get a team if id is bad', function (done) {
            chai.request(server)
                .get(`/api/v2/team/abvdef90234234s78zy89732`)
                .end((err, res) => {
                    should(err).be.ok();
                    should(res.status).equal(400);
                    done();
                });
        });

        it('should fail to get a team if it does not exist', function (done) {
            chai.request(server)
                .get(`/api/v2/team/${createdTeamIds[0] + 100}`)
                .end((err, res) => {
                    should(err).be.ok();
                    should(res.status).equal(404);
                    done();
                });
        });

    });

    describe('POST /api/v2/team/:id', function () {
        const fields = {
            gitlab_id: 1738,
            members: [420, 69],
            prog_lang: 'python',
            is_paid: false,
            is_eligible: true,
            is_embargoed: false
        };

        const bad_fields = {
            doot: "ayy",
            lmao: 420
        };

        it('should update an existing team', function (done) {
            chai.request(server)
                .post(`/api/v2/team/${createdTeamIds[0]}`)
                .send(fields)
                .end((err, res) => {
                    should(err).not.be.ok();
                    should(res.status).equal(200);
                    should(res.body['id']).equal(createdTeamIds[0]);
                    should(res.body['name']).equal('test1');
                    should(res.body['gitlab_id']).equal(1738);
                    should(res.body['members']).deepEqual([420, 69]);
                    should(res.body['is_paid']).equal(false);
                    should(res.body['is_eligible']).equal(true);
                    should(res.body['is_embargoed']).equal(false);
                    should(res.body['prog_lang']).equal('python');
                    done();
                });
        });

        it('should fail to update team with invalid field', function (done) {
            chai.request(server)
                .post(`/api/v2/team/${createdTeamIds[0]}`)
                .send(bad_fields)
                .end((err, res) => {
                    should(err).be.ok();
                    should(res.status).equal(400);
                    done();
                });
        });
    });

    describe('POST /api/v2/team/:id/delete', function () {
        it('should delete team with given id', function (done) {
            chai.request(server)
                .post(`/api/v2/team/${createdTeamIds[0]}/delete`)
                .end((err, res) => {
                    should(err).not.be.ok();
                    should(res.status).equal(200);
                    should(res.body[0]).equal(createdTeamIds[0]);
                    done();
                });
        });

        it('should fail to delete a team if id is bad', function (done) {
            chai.request(server)
                .post('/api/v2/team/as20df/delete')
                .end((err, res) => {
                    should(err).be.ok();
                    should(res.status).equal(400);
                    done();
                });
        });

        it('should fail to delete a team if it does not exist', function (done) {
            chai.request(server)
                .post(`/api/v2/team/313375/delete`)
                .end((err, res) => {
                    should(err).be.ok();
                    should(res.status).equal(404);
                    done();
                });
        });
    });

    after('Clean up after self', function (done) {
        knex('team').del()
            .then((rows) => {
                done();
            })
            .catch((err) => {
                should(err).not.be.ok();
                done();
            });
    });

});
