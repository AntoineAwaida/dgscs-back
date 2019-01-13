var express = require('express');
var router = express.Router(); 
const auth = require('../auth-payload'); 

var TasksController = require('../../../controllers/tasks/tasks.controller');
var FileController = require('../../../controllers/files/files.controller');
var ChattaskController = require('../../../controllers/tasks/chattask.controller')

router.post('/gettask/:userID', TasksController.getTaskFromUser);

router.post('/file/:taskID', FileController.uploadTaskFile);

router.post('/savechat', ChattaskController.save);
router.get('/getchat/:id',ChattaskController.getChat)

router.put('/deletelinktask', TasksController.deleteLinkTask)

router.put('/addlinktask', TasksController.addLinkTask)

router.get('/getwp/:id', TasksController.getWP) 


// Endpoint créer une tâche

router.post('/createtask', auth, TasksController.create); // ok
 
// Endpoints pour modifier une tâche dont on est l'auteur

router.put('/edittask/', auth, TasksController.editTask); // ok

// Endpoints concernant les tâches auquelles on est associé

router.put('/edittaskstatus/', auth, TasksController.editStatus); //ok


module.exports = router;