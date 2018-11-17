var express = require('express');

var router = express.Router();

const GroupsController = require('../../../controllers/groups/groups.controller.js')


router.post('/creategroup', GroupsController.create);
router.get('/getgroups', GroupsController.getAll)

module.exports = router;