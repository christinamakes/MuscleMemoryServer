'use strict';

const mongoose = require('mongoose');

const User = require('../models/user');
const Workout = require('../models/workout');
const Exercise = require('../models/exercise');
const Muscle = require('../models/muscles');

// const seedUser = require('./user.json');
// const seedWorkout = require('./workout.json');
const seedMuscles = require('./muscle.json');
// const seedExercises = require('./exercise.json');

const { DATABASE_URL } = require('../config');

// const userPromise = User.create(seedUser);
const musclePromise = Muscle.insertMany(seedMuscles);
// const exercisePromise = Exercise.insertMany(seedExercises);
// const workoutPromise = Workout.insertMany(seedWorkout);

mongoose.connect(DATABASE_URL)
  // .then(() => mongoose.connection.db.dropDatabase())
  .then(() => {
    return Promise.all([musclePromise])
  .then(() => {
    mongoose.disconnect();
    console.log('ok');
  })
  .catch(err => {
    console.log(`ERROR: ${err.message}`);
    console.log(err);
    });
  });
