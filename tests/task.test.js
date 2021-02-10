const request = require('supertest');
const Task = require('../src/models/task');
const app = require('../src/app');
const {
    userOne,
    userTwo,
    taskOne,
    taskTwo,
    setupDb
} = require('./fixtures/db');

describe('/tasks endpoints test', () => {
    beforeEach(setupDb);


    test('Should create task for user', async () => {
        const resp = await request(app)
            .post('/tasks')
            .set('Authorization', 'Bearer ' + userOne.tokens[0].token)
            .send({
                description: 'TestMy Task test'
            })
            .expect(201);
        
        const task = await Task.findById(resp.body._id);
        expect(task).toBeDefined();
        expect(task.completed).toBe(false)
    })

    test('Should not create task with invalid desc', async () => {
        const resp = await request(app)
            .post('/tasks')
            .set('Authorization', 'Bearer ' + userOne.tokens[0].token)
            .send({
                description: ''
            })
            .expect(400);
    })

    test('Should not create task with invalid completed', async () => {
        const resp = await request(app)
            .post('/tasks')
            .set('Authorization', 'Bearer ' + userOne.tokens[0].token)
            .send({
                description: 'test',
                completed: 'test'
            })
            .expect(400);
    })

    test('Should not update task with invalid desc', async () => {
        const resp = await request(app)
            .patch(`/tasks/${taskOne._id}`)
            .set('Authorization', 'Bearer ' + userOne.tokens[0].token)
            .send({
                description: ''
            })
            .expect(400);
    })

    test('Should not update task with invalid completed', async () => {
        const resp = await request(app)
            .patch(`/tasks/${taskOne._id}`)
            .set('Authorization', 'Bearer ' + userOne.tokens[0].token)
            .send({
                description: 'test',
                completed: 'test'
            })
            .expect(400);
    })

    test('Should get 2 tasks for userOne only', async () => {
        const resp = await request(app)
            .get('/tasks')
            .set('Authorization', 'Bearer ' + userOne.tokens[0].token)
            .expect(200);
        
        expect(resp.body).toHaveLength(2);
    })

    test('Should get task for userTwo only', async () => {
        const resp = await request(app)
            .get('/tasks')
            .set('Authorization', 'Bearer ' + userTwo.tokens[0].token)
            .expect(200);
        
        expect(resp.body).toHaveLength(1);
    })

    test('Should not let userTwo delete not his task', async () => {
        const resp = await request(app)
            .delete(`/tasks/${taskOne._id}`)
            .set('Authorization', 'Bearer ' + userTwo.tokens[0].token)
            .expect(404);

        const task = await Task.findById(taskOne._id);
        expect(task).toBeDefined();
        
    })

    test('Should not let userTwo update not his task', async () => {
        const resp = await request(app)
            .patch(`/tasks/${taskOne._id}`)
            .set('Authorization', 'Bearer ' + userTwo.tokens[0].token)
            .expect(404);

        const task = await Task.findById(taskOne._id);
        expect(task).toBeDefined();
        
    })

    test('Should delete task for userOne', async () => {
        const resp = await request(app)
            .delete(`/tasks/${taskOne._id}`)
            .set('Authorization', 'Bearer ' + userOne.tokens[0].token)
            .expect(200);

        const task = await Task.findById(taskOne._id);
        expect(task).toBeNull();
        
    })

    test('Should not delete task for unauthorised request', async () => {
        const resp = await request(app)
            .delete(`/tasks/${taskOne._id}`)
            .expect(401);

        const task = await Task.findById(taskOne._id);
        expect(task).toBeDefined();
        
    })

    test('Should get task by ID for owner', async () => {
        const resp = await request(app)
            .get(`/tasks/${taskOne._id}`)
            .set('Authorization', 'Bearer ' + userOne.tokens[0].token)
            .expect(200);

        const task = await Task.findById(taskOne._id);
        expect(task.description).toBe(resp.body.description);
    })

    test('Should not get task by ID for unauthorised', async () => {
        const resp = await request(app)
            .get(`/tasks/${taskOne._id}`)
            .expect(401);
    })

    test('Should not get task by ID for non-owner', async () => {
        const resp = await request(app)
            .get(`/tasks/${taskOne._id}`)
            .set('Authorization', 'Bearer ' + userTwo.tokens[0].token)
            .expect(404);
    })

    test('Should get completed tasks only', async () => {
        const resp = await request(app)
            .get(`/tasks?completed=true`)
            .set('Authorization', 'Bearer ' + userOne.tokens[0].token)
            .expect(200);

        expect(resp.body).toHaveLength(1);
    })

    test('Should get incompleed tasks only', async () => {
        const resp = await request(app)
            .get(`/tasks?completed=false`)
            .set('Authorization', 'Bearer ' + userOne.tokens[0].token)
            .expect(200);

        expect(resp.body).toHaveLength(1);
    })

    test('Should get tasks sorted by description asc only', async () => {
        const resp = await request(app)
            .get(`/tasks?sortBy=description:asc`)
            .set('Authorization', 'Bearer ' + userOne.tokens[0].token)
            .expect(200);

        expect(resp.body[0].description).toBe(taskOne.description);
        expect(resp.body[1].description).toBe(taskTwo.description);
    })

    test('Should get tasks sorted by description desc only', async () => {
        const resp = await request(app)
            .get(`/tasks?sortBy=description:desc`)
            .set('Authorization', 'Bearer ' + userOne.tokens[0].token)
            .expect(200);

        expect(resp.body[1].description).toBe(taskOne.description);
        expect(resp.body[0].description).toBe(taskTwo.description);
    })

    test('Should get tasks sorted by createdAt asc only', async () => {
        const resp = await request(app)
            .get(`/tasks?sortBy=createdAt:asc`)
            .set('Authorization', 'Bearer ' + userOne.tokens[0].token)
            .expect(200);

        expect(resp.body[1].createdAt).toBeGreaterThan(resp.body[0].createdAt);
        
    })

    test('Should get tasks sorted by createdAt desc only', async () => {
        const resp = await request(app)
            .get(`/tasks?sortBy=createdAt:desc`)
            .set('Authorization', 'Bearer ' + userOne.tokens[0].token)
            .expect(200);

            expect(resp.body[0].createdAt).toBeGreaterThan(resp.body[1].createdAt);

    })
})