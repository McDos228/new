const Models = require('../models/index');
const chai = require('chai');
const bcrypt = require('bcrypt');
const chaiHttp = require('chai-http');
const server = require('../../../server');
chai.use(chaiHttp);
chai.should();

let salt = bcrypt.genSaltSync(10);
let user = {
    username: 'user',
    password: 'test'
};

describe('app tests', () => {

    let taskId = 0;
    let userId = 0;
    let token = 0;

    before(done=>{
        Models.user.create({
            username: user.username,
            password:  bcrypt.hashSync(user.password, salt)
        }).then(user=>{
            userId = user.dataValues.id;
            done();
        });
    });

    after(done=>{
        Models.sequelize.sync({ force: true}).then(()=>{
            done();
        });
    });

    describe('/register user', () => {
        it('it should register new user', (done) => {

            let user2 = {
                username: "test user",
                password: 'test'
            };

            chai.request(server)
                .post('/api/user/register')
                .send(user2)
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.a('object');
                    res.body.should.have.property('user');
                    res.body.should.have.property('message').eql('You are successful register');
                    done();
                });
        });

    });

    describe('/login user', () => {
        it('it should login user', (done) => {

            chai.request(server)
                .post('/api/user/login')
                .send(user)
                .end((err, res) => {
                    token = res.body.token;
                    res.should.have.status(200);
                    res.body.should.be.a('object');
                    res.body.should.have.property('message');
                    done();
                });
        });
    });

    describe('/POST task', () => {
        it('it should POST a task', (done) => {
            let task = {
                title: "Learn programming",
                status: false,
                userId: userId
            };
            chai.request(server)
                .post('/api/todos/tasks/')
                .set('authorization', token)
                .send(task)
                .end((err, res) => {
                    taskId = res.body.id;
                    res.should.have.status(200);
                    res.body.should.be.a('object');
                    res.body.should.have.property('title');
                    res.body.should.have.property('status');
                    done();
                });
        });

    });

    describe('/GET tasks', () => {
        it('it should GET all the tasks', (done) => {
            chai.request(server)
                .get('/api/todos/tasks/')
                .set('authorization', token)
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.a('array');
                    done();
                });
        });
    });

    describe('/GET/:id task', () => {
        it('it should GET a task by the given id', (done) => {
            chai.request(server)
                .get('/api/todos/tasks/' + taskId)
                .set('authorization', token)
                .end((err, res) => {
                    if(err) console.error(err);
                    res.should.have.status(200);
                    res.body.should.be.a('object');
                    res.body.should.have.property('title');
                    res.body.should.have.property('status');
                    res.body.should.have.property('id').eql(taskId);
                    done();
                });
        })
    });

    describe('/PUT/:id task', () => {
        it('it should UPDATE a task given the id', (done) => {

            chai.request(server)
                .put('/api/todos/tasks/' + taskId)
                .send({title: 'Make something', status:true})
                .set('authorization', token)
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.a('object');
                    res.body.should.have.property('title');
                    res.body.should.have.property('status');
                    done();
                });

        });
    });

    describe('/DELETE/:id task', () => {
        it('it should DELETE a task given the id', (done) => {
            chai.request(server)
                .delete('/api/todos/tasks/' + taskId)
                .set('authorization', token)
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.a('object');
                    res.body.should.have.property('message').eql('Task successfully deleted');
                    done();
                });
        });
    });

});
