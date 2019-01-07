var express = require('express');
var router = express.Router();
var FileController = require('../../../controllers/files/files.controller');

router.get('/:fileID', FileController.getFile);

module.exports = router;