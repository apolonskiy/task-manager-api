const express = require('express');
require('./db/mongoose');
const usersRouter = require('./routers/users');
const tasksRouter = require('./routers/tasks');

const app = express();

app.use(express.json());
app.use(usersRouter);
app.use(tasksRouter);
app.use(require('cors')({ credentials: true, origin: true }));
app.all('*', (req, res, next) => {
    res.header("Access-Control-Allow-Origin", "https://localhost:3000");
    next();
});


module.exports = app;