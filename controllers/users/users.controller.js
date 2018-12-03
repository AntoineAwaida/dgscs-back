const UserModel = require('../../models/user.js');


exports.getUsers = async function(req,res) {
    UserModel.find((err,users) => {
        if(err) return next(err);
        res.json(users);
      })
}

exports.getUser = async function(req,res){
    UserModel.findById(req.params.id, function(err,user){

        console.log(user)
        
        res.json(user);

    })
}