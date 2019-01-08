var express = require('express');
var router = express.Router();
const auth = require('../auth-payload');

const AuthController = require('../../../controllers/users/auth.controller');
const UsersController = require('../../../controllers/users/users.controller');
const ProfilePictureController = require('../../../controllers/users/profilepicture.controller');
 

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

router.put('/modifypassword/:id', UsersController.modifyPassword);

router.put('/modifyfav/:id', UsersController.modifyFav);

router.get('/getfavs/:id', UsersController.getFavs);


// Routes avec permissions

router.get('/getusers', auth, UsersController.getUsers);

module.exports = router;