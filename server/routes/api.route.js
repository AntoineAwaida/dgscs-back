var express = require('express');
var router = express.Router();

var users = require('./api/users.route');
var groups = require('./api/groups.route');
var workpackages = require('./api/workpackages.route');
var tasks = require('./api/tasks.route');

router.use('/users', users);
router.use('/groups',groups);
router.use('/workpackages',workpackages);
router.use('/tasks', tasks);

module.exports = router;