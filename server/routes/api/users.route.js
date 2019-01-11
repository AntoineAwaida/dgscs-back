var express = require('express');
var router = express.Router();
const auth = require('../auth-payload');

const AuthController = require('../../../controllers/users/auth.controller');
const UsersController = require('../../../controllers/users/users.controller');
const ProfilePictureController = require('../../../controllers/users/profilepicture.controller');
 

router.get('/deactivateuser/:id', UsersController.deactivateUser);

router.get('/activateuser/:id', UsersController.activateUser);

router.post('/setpicture/:id', ProfilePictureController.setPicture);


// router.put('/modifyfav/:id', UsersController.modifyFav);
 

// Routes avec permissions

// Endpoints pour s'inscrire et se connecter 

router.post('/register', AuthController.register);
router.post('/login', AuthController.login);

// Endpoints pour récupérer les users en tout genre (admin)

router.get('/getusers', auth, UsersController.getUsers); // ok
router.get('/getactiveusers', auth, UsersController.getActiveUsers); // ok
router.get('/getpendingusers', auth, UsersController.getPendingUsers); // ok

// Endpoints pour récupérer ses propres infos

router.get('/mygroups', auth, UsersController.getMyGroups); // ok
router.get('/myworkpackages', auth, UsersController.getMyWorkpackages); // ok
router.get('/mytasks', auth, UsersController.getMyTasks); // ok 
router.get('/myfavs', auth, UsersController.getMyFavs); // ok
router.get('/myfiles', auth, UsersController.getMyFiles);  // ok


// Endpoints pour modifier ses données

router.put('/editmypassword', auth, UsersController.editMyPassword);
router.put('/editmyfavs', auth, UsersController.editMyFavs);


module.exports = router; 