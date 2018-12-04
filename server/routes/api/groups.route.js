var express = require('express');

var router = express.Router();

const GroupsController = require('../../../controllers/groups/groups.controller.js')


router.post('/creategroup', GroupsController.create);
router.get('/getgroups', GroupsController.getAll)
router.delete('/deletegroup/:id', GroupsController.delete)

module.exports = router;