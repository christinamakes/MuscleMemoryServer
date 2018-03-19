'use strict';

const express = require('express');
const router = express.Router();
const User = require('../models/user');
const bodyParser = require('body-parser');
const passport = require('passport');

const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const config = require('../config');

// generate JWT with user credentials
const createAuthToken = function(user) {
  return jwt.sign({user}, config.JWT_SECRET, {
    subject: user.username,
    expiresIn: config.JWT_EXPIRY,
    algorithm: 'HS256'
  });
};
// LOGIN USER

const localAuth = passport.authenticate('local', {session: false});
  router.use(bodyParser.json());
// CREATE AND SEND NEW JWT
  router.post('/login', localAuth, (req, res) => {
    const authToken = createAuthToken(req.user.toObject());
    res.json({authToken});
});


const jwtAuth = passport.authenticate('jwt', {session: false});
// REFRESH EXISTING JWT FOR AUTHENTICATED USER
router.post('/refresh', jwtAuth, (req, res) => {
  const authToken = createAuthToken(req.user);
  res.json({authToken});
});



module.exports = router;