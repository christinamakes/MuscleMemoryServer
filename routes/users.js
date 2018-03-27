'use strict';

const express = require('express');
const router = express.Router();
const Workout = require('../models/workout');
const User = require('../models/user');
const bodyParser = require('body-parser');

const mongoose = require('mongoose');


// GET USERS -- REMOVE BEFORE PRODUCTION!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
// router.get('/users', (req, res, next) => {
//   User
//     .find()
//     .populate('recentWorkout')
//     .then(result => {
//       res.json(result);
//     })
//     .catch(err => console.log(err));
// });

// POST USERS
router.post('/users', bodyParser.json(), (req, res, next) => {
  const requiredFields = ['username', 'password'];
  const missingField = requiredFields.find(field => !(field in req.body));

  if (missingField) {
    return res.status(422).json({
      code: 422,
      reason: 'ValidationError',
      message: 'Missing field',
      location: missingField
    });
  }

  const stringFields = ['username', 'password', 'firstName', 'lastName'];
  const nonStringField = stringFields.find(
    field => field in req.body && typeof req.body[field] !== 'string'
  );

  if (nonStringField) {
    return res.status(422).json({
      code: 422,
      reason: 'ValidationError',
      message: 'Incorrect field type: expected string',
      location: nonStringField
    });
  }

  const explicityTrimmedFields = ['username', 'password'];
  const nonTrimmedField = explicityTrimmedFields.find(
    field => req.body[field].trim() !== req.body[field]
  );

  if (nonTrimmedField) {
    return res.status(422).json({
      code: 422,
      reason: 'ValidationError',
      message: 'Cannot start or end with whitespace',
      location: nonTrimmedField
    });
  }

  const sizedFields = {
    username: {
      min: 1
    },
    password: {
      min: 10,
      max: 72
    }
  };
  const tooSmallField = Object.keys(sizedFields).find(
    field =>
      'min' in sizedFields[field] &&
            req.body[field].trim().length < sizedFields[field].min
  );
  const tooLargeField = Object.keys(sizedFields).find(
    field =>
      'max' in sizedFields[field] &&
            req.body[field].trim().length > sizedFields[field].max
  );

  if (tooSmallField || tooLargeField) {
    return res.status(422).json({
      code: 422,
      reason: 'ValidationError',
      message: tooSmallField
        ? `Must be at least ${sizedFields[tooSmallField]
          .min} characters long`
        : `Must be at most ${sizedFields[tooLargeField]
          .max} characters long`,
      location: tooSmallField || tooLargeField
    });
  }

  let {username, password, firstName = '', lastName = ''} = req.body;
  firstName = firstName.trim();
  lastName = lastName.trim();

  let recentWorkoutDate;
  const hashPassword = User.hashPassword(password)
    .then(hash => {
      User
        .create({
          firstName,
          lastName, 
          username,
          password: hash,
          recentWorkoutDate
      })
      .then(user => {
        return res.status(201).json(user.toObject());
      }).catch(err => {
        // console.log(err);
        if (err.reason === 'ValidationError') {
          return res.status(err.code).json(err);
        }
        res.status(500).json({code: 500, message: 'Internal server error'});
      });
    });  
});

router.put('/users', bodyParser.json(), (req, res, next) => {
  const {recentWorkout} = req.body;
  const {userId} = req.params;
  User
    .findOneAndUpdate({userId: userId}, {recentWorkout: recentWorkout}, {new: true})
    // .update({
    //   // $push: {recentWorkout}
    //   recentWorkout
    //   })
      .then(user => {
        return res.status(201).json(user);
      }).catch(err => {
        // console.log(err);
        if (err.reason === 'ValidationError') {
          return res.status(err.code).json(err);
        }
        res.status(500).json({code: 500, message: 'Internal server error'});
    });
});  


module.exports = router;