var express = require('express');

var router = express.Router();

const GroupsController = require('../../../controllers/groups/groups.controller.js')


router.post('/creategroup', GroupsController.create);
router.get('/getgroups', GroupsController.getAll)
router.get('/getgroup/:id', GroupsController.getOne)
router.delete('/deletegroup/:id', GroupsController.delete)
router.put('/editgroup/:id', GroupsController.edit)



module.exports = router;