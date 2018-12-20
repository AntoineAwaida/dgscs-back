var passport = require('passport');
var UserModel = require('../../models/user')
exports.register = async function (req, res) {
    var user = new UserModel();
    try {

        if (!req.body.first_name || !req.body.last_name || !req.body.email || !req.body.password) {
            return res.status(500).json({ "status": 500, "token": null, "message": "first_name, last_name, email or password is missing" });
        }

        try {
            var email = (await UserModel.findOne({ email: req.body.email })).email;
            return res.status(500).json({ "status": 500, "token": null, "message": "user is already in there" });

        } catch (e) {

            console.log(user.first_name);
            user.first_name = req.body.first_name;
            user.last_name = req.body.last_name;
            user.email = req.body.email;
            user.password = req.body.password;
            user.friendsID = [];
            user.friend_requestsID = [];
            user.boxes = [];
            timeline = [];

            try {
                var createdUser = await user.save();
            } catch (e) {
                throw Error("User unsuccessfully created !")
            }

            var token = createdUser.generateJwt();

            return res.status(200).json({ "status": 200, "token": token, "message": "Successfully registered" });
        }
    }
    catch (e) {
        return res.status(500).json({ "status": 500, "token": null, "message": "Unable to register" });
    }
}

exports.login = function (req, res) {


    passport.authenticate('local', function (err, user, info) {

        var token;

        // If Passport throws/catches an error
        if (err) {
            return res.status(500).json({ "status": 500, "token": null, "message": err });
        }

        // If a user is found
        if (user) {


            var token = user.generateJwt();
            return res.status(200).json({ "status": 200, "token": token, "message": "Successfully connected" });

        }
        else {
            // If user is not found
            return res.status(500).json({ "status": 500, "token": null, "message": info });
            console.log("Bien connecté");
        }
    })(req, res);
};