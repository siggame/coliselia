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

// save any newly created clients so they can be used for tests later
let createdUserIds = [];

describe('User API', function() {

    before('Clean up', function(done){
        knex('user').del()
            .then((rows) => {
                done();
            })
            .catch((err) => {
                should(err).not.be.ok();
                done();
            });
    });

    describe('POST /api/v2/user/', function () {
        const user = {
            name: 'test1',
            full_name: 'test user',
            email: 'test1@test.com',
            is_dev: false,
            is_student: true,
            is_sponsor: false,
            is_prev_competitor: true,
            shirt_size: 's',
            pizza_choice: 'cheese',
        };
        it('should create a user', function (done) {
            chai.request(server)
                .post('/api/v2/user/')
                .send(user)
                .end((err, res) => {
                    should(err).not.be.ok();
                    should(res.status).equal(201);
                    should(res.body['is_student']).equal(true);
                    should(res.body['full_name']).equal('test user');
                    createdUserIds.push(res.body['id']);
                    done();
                });
        });

        it('should fail to create a user when given id', function (done) {
            const user = {
                id: 3,
                name: 'test2',
                email: 'test2@test.com'
            };
            chai.request(server)
                .post('/api/v2/user/')
                .send(user)
                .end((err, res) => {
                    should(err).be.ok();
                    should(res.status).equal(400);
                    done();
                });
        });
        it('should fail to create a user when given created_time', function (done) {
            const user = {
                name: 'test2',
                email: 'test2@test.com',
                created_time: '2001-12-23 14:39:53.662522-05'
            };
            chai.request(server)
                .post('/api/v2/user/')
                .send(user)
                .end((err, res) => {
                    should(err).be.ok();
                    should(res.status).equal(400);
                    done();
                });
        });
        it('should fail to create a user when given modified_time', function (done) {
            const user = {
                name: 'test2',
                email: 'test2@test.com',
                modified_time: '2001-12-23 14:39:53.662522-05',
            };
            chai.request(server)
                .post('/api/v2/user/')
                .send(user)
                .end((err, res) => {
                    should(err).be.ok();
                    should(res.status).equal(400);
                    done();
                });
        });
        it('should fail to create a user when given invalid shirt size', function (done) {
            const user = {
                name: 'test2',
                email: 'test2@test.com',
                shirt_size: 'wumbo',
            };
            chai.request(server)
                .post('/api/v2/user/')
                .send(user)
                .end((err, res) => {
                    should(err).be.ok();
                    should(res.status).equal(400);
                    done();
                });
        });
        it('should fail to create a user when given invalid pizza choice', function (done) {
            const user = {
                name: 'test2',
                email: 'test2@test.com',
                pizza_choice: 'bleach',
            };
            chai.request(server)
                .post('/api/v2/user/')
                .send(user)
                .end((err, res) => {
                    should(err).be.ok();
                    should(res.status).equal(400);
                    done();
                });
        });
    });

    describe('GET /api/v2/user/:id', function(){
        it('should get a client by id', function(done) {
            chai.request(server)
                .get(`/api/v2/user/${createdUserIds[0]}`)
                .end((err, res) => {
                    should(err).not.be.ok();
                    should(res.status).equal(200);
                    should(res.body['id']).equal(createdUserIds[0]);
                    should(res.body['shirt_size']).equal('s');
                    done();
                });
        });
        it('should fail to get a client if id is bad', function(done) {
            chai.request(server)
                .get(`/api/v2/user/abvdef90234234s78zy89732`)
                .end((err, res) => {
                    should(err).be.ok();
                    should(res.status).equal(400);
                    done();
                });
        });
        it('should fail to get a client if it does not exist', function(done) {
            chai.request(server)
                .get(`/api/v2/user/${createdUserIds[0]+100}`)
                .end((err, res) => {
                    should(err).be.ok();
                    should(res.status).equal(404);
                    done();
                });
        });

    });

    describe('POST /api/v2/user/:id/', function () {
        const fields = {
            name: 'test1a',
            full_name: 'test user a',
            email: 'test1a@test.com',
            is_dev: true,
            is_student: false,
            is_sponsor: true,
            is_prev_competitor: false,
            shirt_size: 'm',
            pizza_choice: 'pepperoni',
        };
        it('should update an existing user', function (done) {
            chai.request(server)
                .post(`/api/v2/user/${createdUserIds[0]}`)
                .send(fields)
                .end((err, res) => {
                    should(err).not.be.ok();
                    should(res.status).equal(200);
                    should(res.body['id']).equal(createdUserIds[0]);
                    should(res.body['full_name']).equal('test user a');
                    should(res.body['is_student']).equal(false);
                    should(res.body['is_dev']).equal(true);
                    should(res.body['pizza_choice']).equal('pepperoni');
                    done();
                });
        });
    });

    after('Clean up after self', function(done){
        knex('user').del()
            .then((rows) => {
                done();
            })
            .catch((err) => {
                should(err).not.be.ok();
                done();
            });
    });

});