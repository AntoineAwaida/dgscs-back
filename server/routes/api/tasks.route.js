var express = require('express');
var router = express.Router();
var TasksController = require('../../../controllers/tasks/tasks.controller');


router.post('/createtask/', TasksController.create);


module.exports = router;