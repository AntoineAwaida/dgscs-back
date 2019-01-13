var express = require('express');

var router = express.Router();

const FileController = require('../../../controllers/files/files.controller');

router.post('/file/:reportID', FileController.uploadReportFile);

router.get('/getreports', FileController.getReports);

module.exports = router