var express = require('express');
var router = express.Router();

var FileController = require('../../../controllers/files/files.controller');
var UserController = require('../../../controllers/users/users.controller');

router.get('/:fileID', FileController.getFile);
router.get('/user/:userID', UserController.getFiles);

module.exports = router;