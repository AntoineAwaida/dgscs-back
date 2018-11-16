const UserModel = require('../../models/user');


exports.getUsers = async function(req,res) {
    UserModel.find((err,users) => {
        if(err) return next(err);
        res.json(users);
      })
}