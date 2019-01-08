var express = require('express');
var router = express.Router();

var FileController = require('../../../controllers/files/files.controller');
var UserController = require('../../../controllers/users/users.controller');

var jwt = require('express-jwt');

var auth = jwt({
  secret: 'ARIE_SELINGER',
  userProperty: 'payload'
});



router.get('/:fileID', auth, FileController.getFile);
router.get('/user/:userID', auth,  UserController.getFiles);

module.exports = router;