'use strict'; 

require('dotenv').config();
const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const mongoose = require('mongoose');
const passport = require('passport');

const {PORT, CLIENT_ORIGIN, DATABASE_URL} = require('./config');
// const {dbConnect} = require('./db-mongoose');

const userRouter = require('./routes/users');
const loginRouter = require('./routes/login');
const exerciseRouter = require('./routes/exercises');
const workoutRouter = require('./routes/workouts.js');

const localStrategy = require('./strats/local');
const jwtStrategy = require('./strats/jwt');

const app = express();

app.use(
    morgan(process.env.NODE_ENV === 'production' ? 'common' : 'dev', {
        skip: (req, res) => process.env.NODE_ENV === 'test'
    })
);

app.use(
    cors({
        origin: CLIENT_ORIGIN
    })
);
console.log(CLIENT_ORIGIN);

// Parse request body
app.use(express.json());

// Strategies
passport.use(localStrategy);
passport.use(jwtStrategy);

// Routers
app.use('/workout', userRouter);
app.use('/workout', loginRouter);
app.use('/workout', exerciseRouter);
app.use('/workout', workoutRouter);

// Catch-all 404
app.use(function (req, res, next) {
    const err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// Catch-all Error handler
app.use(function (err, req, res, next) {
    res.status(err.status || 500);
    res.json({
        message: err.message,
        error: app.get('env') === 'development' ? err : {}
    });
});

function runServer(port = PORT) {
    const server = app
        .listen(port, () => {
            console.info(`App listening on port ${server.address().port}`);
        })
        .on('error', err => {
            console.error('Express failed to start');
            console.error(err);
        });
}

if (require.main === module) {
    mongoose.connect(DATABASE_URL)
    .then(instance => {
        const conn = instance.connections[0];
        console.info(`Connected to: mongodb://${conn.host}:${conn.port}/${conn.name}`);
    })
    .catch(err => {
        console.error(`ERROR: ${err.message}`);
        console.error('\n === Did you remember to start `mongod`? === \n');
        console.error(err);
    });

    app.listen(PORT, function () {
    console.info(`Server listening on ${this.address().port}`);
    }).on('error', err => {
    console.error(err);
    });
}

module.exports = app; // Export for testing

