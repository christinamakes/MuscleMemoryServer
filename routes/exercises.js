'use strict';

const express = require('express');
const router = express.Router();
const Muscle = require('../models/muscles'); // MUST require for model to load
const Exercise = require('../models/exercise');
const passport = require('passport');



const jwtAuth = passport.authenticate('jwt', { session: false });


// A protected endpoint which needs a valid JWT to access it
router.post('/exercise', jwtAuth,(req, res) => {
  const {exerciseName, musclesWorked} = req.body;
  Exercise
    .create({exerciseName, musclesWorked})
    .then(results => {
      return res.status(200).json(results);
    });
  
});


router.get('/exercise', (req, res) => {
  Exercise
    .find()
    .populate('musclesWorked')
    .sort({datefield: -1})
    .then(results => {
      return res.status(200).json(results);
    });
  
});

module.exports = router;