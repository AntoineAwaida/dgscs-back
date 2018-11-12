var express = require('express');

var router = express.Router();

var AuthController = require('../../../controllers/users/auth.controller');
var jwt = require('express-jwt');

var auth = jwt({
  secret: 'ARIE_SELINGER',
  userProperty: 'payload'
});

router.post('/register', AuthController.register);
router.post('/login', AuthController.login);

module.exports = router;