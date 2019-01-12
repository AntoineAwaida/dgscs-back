var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var UserModel = require('../models/user');

passport.use(new LocalStrategy({
  usernameField: 'email'
},
  function (username, password, done) {
    UserModel.findOne(
      { email: username }, "+password",
      function (err, user) {

        if (err) {
          return done(err);
        }

        // Return if user not found in database
        if (!user) {
          return done(null, false, 'email ou mot de passe incorrect');
        }

        // Return if password is wrong
        if (!user.validPassword(password)) {
          return done(null, false, 
            'email ou mot de passe incorrect'
          );
        }
        
        // If credentials are correct, return the user object
        return done(null, user);
      });
  }
));