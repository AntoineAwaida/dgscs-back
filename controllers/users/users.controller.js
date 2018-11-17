const UserModel = require('../../models/user');


exports.getUsers = async function(req,res) {
    UserModel.find((err,users) => {
        if(err) return next(err);
        res.json(users);
      })
}

exports.getUser = async function(req,res,err){
    if(err) return next(err);

    console.log("coucou")

    UserModel.findById(req.payload._id, function(err,user){

        if(err) return next(err);

        res.json(user);

    })
}