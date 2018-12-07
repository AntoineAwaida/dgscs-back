var express = require('express');
var router = express.Router();

var users = require('./api/users.route');
var groups = require('./api/groups.route');
var workpackages = require('./api/workpackages.route')

router.use('/users', users);
router.use('/groups',groups);
router.use('/workpackages',workpackages);



module.exports = router;