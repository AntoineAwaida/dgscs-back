var express = require('express');
var router = express.Router();
var TasksController = require('../../../controllers/tasks/tasks.controller');


router.post('/createtask/', TasksController.create);

router.get('/gettasks/:userID', TasksController.getTasksFromUser);
router.post('/gettask/:userID', TasksController.getTaskFromUser);

router.put('/edittask/:userID', TasksController.editStatus);


module.exports = router;