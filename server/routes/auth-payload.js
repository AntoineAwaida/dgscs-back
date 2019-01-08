var jwt = require('express-jwt');

var auth = jwt({
  secret: 'ARIE_SELINGER',
  userProperty: 'payload'
});

module.exports = auth;