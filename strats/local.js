'use strict';


const { Strategy: LocalStrategy } = require('passport-local');

const User = require('../models/user');

const localStrategy = new LocalStrategy((username, password, callback) => {
  let user;
  // search db for username
  User.findOne({ 'username': username })
    .then(_user => {
      user = _user;
      // if no user is found reject with login error
      if (!user) {
        return Promise.reject({
          reason: 'LoginError',
          message: 'Incorrect username or password'
        });
      }
      return user.validatePassword(password);
    })
    .then(isValid => {
      // if user is found but password is not valid reject with login error
      if (!isValid) {
        return Promise.reject({
          reason: 'LoginError',
          message: 'Incorrect username or password'
        });
      }
      // if user is found and password is correct return user
      return callback(null, user);
    })
    .catch(err => {
      if (err.reason === 'LoginError') {
        return callback(null, false, err);
      }
      return callback(err, false);
    });
});

module.exports = localStrategy;