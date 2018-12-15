var express = require('express');

var router = express.Router();

var AuthController = require('../../../controllers/users/auth.controller');
const UsersController = require('../../../controllers/users/users.controller')

const GroupsController = require('../../../controllers/groups/groups.controller')

const ProfilePictureController = require('../../../controllers/users/profilepicture.controller')

var jwt = require('express-jwt');

var auth = jwt({
  secret: 'ARIE_SELINGER',
  userProperty: 'payload'
});


router.get('/getusers', auth, UsersController.getUsers);

router.get('/getactiveusers', auth, UsersController.getActiveUsers);
router.get('/getpendingusers', auth, UsersController.getPendingUsers);

router.get('/getuser/:id', UsersController.getUser)


router.post('/register', AuthController.register);
router.post('/login', AuthController.login);

router.get('/deactivateuser/:id', UsersController.deactivateUser);

router.get('/activateuser/:id', UsersController.activateUser);

router.get('/mywp/:id', UsersController.getWPForUser);


router.get('/mygroups/:id', UsersController.getGroupsForUser);

router.post('/setpicture/:id', ProfilePictureController.setPicture);

module.exports = router;