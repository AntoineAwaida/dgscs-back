const jwt = require('express-jwt');
const secret = require('../../config/globals').token_password;

const auth = jwt({
  secret: secret,
  userProperty: 'payload'
});

module.exports = auth;