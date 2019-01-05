var express = require('express');
var router = express.Router();
var TasksController = require('../../../controllers/tasks/tasks.controller');

var ChattaskController = require('../../../controllers/tasks/chattask.controller')


router.post('/createtask/', TasksController.create);

router.get('/gettasks/:userID', TasksController.getTasksFromUser);
router.post('/gettask/:userID', TasksController.getTaskFromUser);

router.put('/edittaskstatus/:userID', TasksController.editStatus);
router.put('/edittask/:userID', TasksController.editTask);


router.post('/savechat', ChattaskController.save);
router.get('/getchat/:id',ChattaskController.getChat)



module.exports = router;