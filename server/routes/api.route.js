var express = require('express');
var router = express.Router();

var users = require('./api/users.route');
var groups = require('./api/groups.route')
//var boxes = require('./api/boxes.route');
// var posts = require('./api/posts.route');

router.use('/users', users);
router.use('/groups',groups);
//router.use('/boxes', boxes);
// router.use('/posts', posts);


module.exports = router;