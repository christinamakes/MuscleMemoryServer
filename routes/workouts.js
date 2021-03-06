'use strict';

const express = require('express');
const router = express.Router();
const Workout = require('../models/workout');
const passport = require('passport');
const countBy = require('lodash.countby');
const { getUserId } = require('../utils/getUserId');
const _ = require('lodash');



// const jwtAuth = passport.authenticate('jwt', { session: false });

const jwtAuth = passport.authenticate('jwt', { session: false });
// A protected endpoint which needs a valid JWT to access it
router.post('/workout', (req, res) => {
  const { exercises, workoutName } = req.body;
  const userId = getUserId(req);

  Workout
    .create({ userId, exercises, workoutName })
    .then(results => {
      return res.status(200).json(results);
    });

});


router.get('/workout', jwtAuth, (req, res) => {
  const userId = getUserId(req);
  Workout
    .find()
    .where({ userId: userId })
    .sort({ datefield: -1 })
    .then(results => {
      return res.status(200).json(results);
    });
});


// under construction
// router.get('/muscles/workout', (req, res) => {
//   const {userId} = req.query;
//   Workout
//     .find()
//     .where({userId: userId})
//     .populate({path: 'exercises', populate: {path: 'musclesWorked', model: 'Muscle'}})
//     .then(workout => {
//       // console.log(workout);

//       // groups by workout ._id, [[823748237, [...exercises] ...]
//       const groups = _.groupBy(workout, (workout) => workout._id);
//       const entries = Object.entries(groups);


//       const muscles = workout.map((exercise) => exercise.musclesWorked);
//       const exercises = workout.map((exercise) => _.flatten(_.map(exercise, 'musclesWorked'))); 

//       // // array reducer
//       // .reduce((aggregate, exercise) => {
//       //   return [aggregate, ...exercise.musclesWorked];
//       // }, []);
//       // // muscles =>
//       const countedNames = exercises.map((exerciseGroup, index) => {
//         // countBy(exercises, (muscle) => {
//         // return muscle.name;
//         return exerciseGroup;
//       });
//     // });
//       // console.log(countedNames + ' COUNTED NAMMMMMMMMES');
//       return res.status(200).json(entries);
//       // return res.status(200).json(workout);
//     });
// });

router.get('/id/exercises', jwtAuth, (req, res) => {
  const { workoutId } = req.query;
  Workout
    .findById(workoutId)
    .populate('exercises')
    .then(workout => {
      const names = workout.exercises.map(exercise => exercise.exerciseName);
      res.json(names);
    });
});

router.get('/id/muscles', jwtAuth, (req, res) => {
  const { workoutId } = req.query;
  Workout
    .findById(workoutId) //or findById
    // .where({userId: '5ab55cb0ecc3af36537a20d8'}) // PROBLEM CHILD!!
    .populate({ path: 'exercises', populate: { path: 'musclesWorked', model: 'Muscle' } })
    .then(workout => {
      const muscles = workout.exercises // array of all exercises in workout, includes muscles
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

