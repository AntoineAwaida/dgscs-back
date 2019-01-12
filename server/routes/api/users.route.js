var express = require('express');
var router = express.Router();
const auth = require('../auth-payload');

const AuthController = require('../../../controllers/users/auth.controller');
const UsersController = require('../../../controllers/users/users.controller');
const ProfilePictureController = require('../../../controllers/users/profilepicture.controller');
  

// Endpoints pour s'inscrire et se connecter 

router.post('/register', AuthController.register); // ok
router.post('/login', AuthController.login); // ok

// Endpoints pour récupérer les users en tout genre (admin)

router.get('/getusers', auth, UsersController.getUsers); // ok
router.get('/getactiveusers', auth, UsersController.getActiveUsers); // ok
router.get('/getpendingusers', auth, UsersController.getPendingUsers); // ok

// Endpoints pour gérer le statut d'un user (admin)

router.put('/desactivateuser/:id', auth, UsersController.desactivateUser); // ok
router.put('/activateuser/:id', auth, UsersController.activateUser); // ok

// Endpoints pour récupérer ses propres infos

router.get('/mygroups', auth, UsersController.getMyGroups); // ok
router.get('/myworkpackages', auth, UsersController.getMyWorkpackages); // ok
router.get('/mytasks', auth, UsersController.getMyTasks); // ok 
router.get('/myfavs', auth, UsersController.getMyFavs); // ok
router.get('/myfiles', auth, UsersController.getMyFiles);  // ok


// Endpoints pour modifier ses données

router.put('/editmypassword', auth, UsersController.editMyPassword); // ok
router.put('/editmyfavs', auth, UsersController.editMyFavs); // ok
router.post('/setpicture', auth, ProfilePictureController.setPicture); // ok

// Endpoints publics

router.get('/getuser/:userID', auth, UsersController.getUser); // ok 


module.exports = router; 