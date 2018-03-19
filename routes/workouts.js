'use strict';

const express = require('express');
const router = express.Router();
const Workout = require('../models/workout');
const passport = require('passport');
const countBy = require('lodash.countby');
const _ = require('lodash');



// const jwtAuth = passport.authenticate('jwt', { session: false });


// A protected endpoint which needs a valid JWT to access it
router.post('/workout', (req, res) => {
  const {userId, exercises, workoutName} = req.body;

  Workout
    .create({userId, exercises, workoutName})
    .then(results => {
      return res.status(200).json(results);
    });
  
});


router.get('/workout', (req, res) => {
  const {userId} = req.query;
  Workout
    .find()
    .where({userId: userId})
    .populate('exercises')
    .then(results => {
      return res.status(200).json(results);
    });
  
});

router.get('/muscles/workout', (req, res) => {
  const {userId} = req.query;
  Workout
    .find()
    .where({userId: userId})
    .populate({path: 'exercises', populate: {path: 'musclesWorked', model: 'Muscle'}})
    .then(workout => {
      // console.log(workout);

      // groups by workout ._id, [[823748237, [...exercises] ...]
      const groups = _.groupBy(workout, (workout) => workout._id);
      const entries = Object.entries(groups);


      const muscles = workout.map((exercise) => exercise.musclesWorked);
      const exercises = workout.map((exercise) => _.flatten(_.map(exercise, 'musclesWorked'))); 

      // // array reducer
      // .reduce((aggregate, exercise) => {
      //   return [aggregate, ...exercise.musclesWorked];
      // }, []);
      // // muscles =>
      const countedNames = exercises.map((exerciseGroup, index) => {
        // countBy(exercises, (muscle) => {
        // return muscle.name;
        return exerciseGroup;
      });
    // });
      // console.log(countedNames + ' COUNTED NAMMMMMMMMES');
      return res.status(200).json(entries);
      // return res.status(200).json(workout);
    });
});

router.get('/id/muscles', (req, res) => {
  const {userId, workoutId} = req.query;
  Workout
    .findById({_id: workoutId}) //or findById
    .where({userId: userId})
    .populate({path: 'exercises', populate: {path: 'musclesWorked', model: 'Muscle'}})
    .then(workout => {
      const muscles = workout.exercises // array of all exercises in workout, includes muscles
      // array reducer
      .reduce((aggregate, exercise) => {
        return [...aggregate, ...exercise.musclesWorked];
      }, []);

      const countedNames = countBy(muscles, (muscle) => {
        return muscle.name;
      });

      
      return res.status(200).json(countedNames);
    });
  
});

module.exports = router;

