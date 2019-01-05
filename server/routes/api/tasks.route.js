var express = require('express');
var router = express.Router();
var TasksController = require('../../../controllers/tasks/tasks.controller');
var FileController = require('../../../controllers/files/files.controller');


router.post('/createtask/', TasksController.create);

router.get('/gettasks/:userID', TasksController.getTasksFromUser);
router.post('/gettask/:userID', TasksController.getTaskFromUser);

router.put('/edittaskstatus/:userID', TasksController.editStatus);
router.put('/edittask/:userID', TasksController.editTask);

router.post('/file', FileController.uploadTaskFile);
router.get('/file/:fileID', FileController.getFile);


module.exports = router;