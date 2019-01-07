var express = require('express');
var router = express.Router();

var users = require('./api/users.route');
var groups = require('./api/groups.route');
var workpackages = require('./api/workpackages.route');
var tasks = require('./api/tasks.route');
var announces = require('./api/announces.route');
var files = require('./api/file.route');

router.use('/users', users);
router.use('/groups',groups);
router.use('/workpackages',workpackages);
router.use('/tasks', tasks);
router.use('/announces',announces);
router.use('/files',files);

module.exports = router;