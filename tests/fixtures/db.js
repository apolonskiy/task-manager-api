const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const User = require('../../src/models/user');
const Task = require('../../src/models/task');

const userId =  new mongoose.Types.ObjectId();
const userOne = {
    _id: userId,
    name: 'test',
    email: 'test@example.com',
    password: '!@#$%^&*()',
    tokens: [{
        token: jwt.sign({ _id: userId }, process.env.JWT_SECRET)
    }
    ]
}

const userIdTwo =  new mongoose.Types.ObjectId();
const userTwo = {
    _id: userIdTwo,
    name: 'Andrew',
    email: 'Andrew@example.com',
    password: 'MyHouse99!!',
    tokens: [{
        token: jwt.sign({ _id: userIdTwo }, process.env.JWT_SECRET)
    }
    ]
}

const taskOne = {
    _id:  new mongoose.Types.ObjectId(),
    description: 'Task one desc',
    completed: true,
    owner: userId
}

const taskTwo = {
    _id:  new mongoose.Types.ObjectId(),
    description: 'Task two desc',
    completed: false,
    owner: userId
}

const taskThree = {
    _id: new mongoose.Types.ObjectId(),
    description: 'Task three desc',
    completed: false,
    owner: userIdTwo
}

const setupDb = async () => {
    await User.deleteMany();
    await Task.deleteMany();
    await new User(userOne).save();
    await new User(userTwo).save();
    await new Task(taskOne).save();
    await new Task(taskTwo).save();
    await new Task(taskThree).save();
}

module.exports = {
    userId,
    userOne,
    userTwo,
    taskOne,
    taskTwo,
    setupDb
}