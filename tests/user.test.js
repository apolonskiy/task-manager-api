const request = require('supertest');
const app = require('../src/app');
const User = require('../src/models/user');
const {
    userId,
    userOne,
    setupDb
} = require('./fixtures/db');
jest.setTimeout(10000);

describe('Test /users endpoints', () => {
    const userOneUpdatevalid = {
        name: 'AAAA',
        email: 'tesAAAAt@example.com',
        password: 'QQQQ#$%^&',
    }

    beforeEach(setupDb);

    it('Should signup user', async () => {
        const resp = await request(app)
            .post('/users')
            .send({
                name: "Andrii Test",
                email: "andriy.polonskiy5@gmail.com",
                password: "TTT!@#$%^&qqq"
            })
            .expect(201)

        const user = await User.findById(resp.body.user._id);
        expect(user._id).toBeDefined();
    });

    it('Should not signup user with invalid email', async () => {
        const resp = await request(app)
            .post('/users')
            .send({
                name: "Andrii Test",
                email: "anp@@@@gmail.com",
                password: "TTT!@#$%^&qqq"
            })
            .expect(400)
    });

    it('Should not signup user with invalid password', async () => {
        const resp = await request(app)
            .post('/users')
            .send({
                name: "Andrii Test",
                email: "anp@gmail.com",
                password: "test"
            })
            .expect(400)
    });

    it('Should not signup user with invalid name', async () => {
        const resp = await request(app)
            .post('/users')
            .send({
                name: "",
                email: "anp@gmail.com",
                password: "#$%^&*("
            })
            .expect(400)
    });

    it('Should login existing user', async () => {
        await request(app).post('/users/login').send({
            email: userOne.email,
            password: userOne.password
        }).expect(200)
    });

    it('Should not login nonexistent user', async () => {
        await request(app).post('/users/login').send({
            email: 'nonexisting@email.com',
            password: userOne.password
        }).expect(400)
    })

    it('Should get my profile', async () => {
        await request(app).get('/users/me')
            .set('Authorization', 'Bearer ' + userOne.tokens[0].token)
            .expect(200)
    })

    it('Should not get my profile if not authenticated', async () => {
        await request(app).get('/users/me')
            .expect(401)
    })

    it('Should delete my profile', async () => {
        await request(app).delete('/users/me')
            .set('Authorization', 'Bearer ' + userOne.tokens[0].token)
            .expect(200)

        const user = await User.findById(userId);
        expect(user).toBeNull();

    })

    it('Should not delete my profile if not authenticated', async () => {
        await request(app).delete('/users/me')
            .expect(401)
    })

    it('Should upload avatar image', async () => {
        await request(app).post('/users/me/avatar')
            .set('Authorization', 'Bearer ' + userOne.tokens[0].token)
            .attach('avatar', 'tests/fixtures/profile-pic.jpg')
            .expect(200);

        const user = await User.findById(userId);
        expect(user.avatar).toEqual(expect.any(Buffer))
    })

    it('Should update user', async () => {
        await request(app).patch('/users/me')
            .set('Authorization', 'Bearer ' + userOne.tokens[0].token)
            .send(userOneUpdatevalid)
            .expect(200);

        const user = await User.findById(userId);
        expect(user.email).toEqual(userOneUpdatevalid.email.toLowerCase());
    })

    it('Should not update user with wrong payload', async () => {
        await request(app).patch('/users/me')
            .set('Authorization', 'Bearer ' + userOne.tokens[0].token)
            .send({
                location: 'invalid'
            })
            .expect(400);
    })

    it('Should not update user if not auth', async () => {
        await request(app).patch('/users/me')
            .send({
                name: 'Invalid Auth'
            })
            .expect(401);
    })

    it('Should not update user with invalid name', async () => {
        const resp = await request(app)
            .patch('/users/me')
            .set('Authorization', 'Bearer ' + userOne.tokens[0].token)
            .send({
                name: "",

            })
            .expect(400)
    });

    it('Should not signup user with invalid email', async () => {
        const resp = await request(app)
            .patch('/users/me')
            .set('Authorization', 'Bearer ' + userOne.tokens[0].token)
            .send({
                email: "anp@@@@gmail.com",
            })
            .expect(400)
    });

    it('Should not signup user with invalid password', async () => {
        const resp = await request(app)
            .patch('/users/me')
            .set('Authorization', 'Bearer ' + userOne.tokens[0].token)
            .send({
                password: "test"
            })
            .expect(400)
    });

})