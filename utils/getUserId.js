'use strict';

const jwtDecode = require('jwt-decode');

function getUserId(request) {
  const authToken = request.headers.authorization.split(' ')[1];
  const userId = jwtDecode(authToken).user.id;
  return userId;
}


module.exports = { getUserId };