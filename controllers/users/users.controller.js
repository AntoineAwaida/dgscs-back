const UserModel = require('../../models/user.js');


exports.getUsers = async function(req,res) {
    UserModel.find().select({ 'password': false, '__v': false }).exec((err,users) => {
        if (err) return res.status(500).send(err);

        res.json(users);
      });
}

exports.getActiveUsers = async function(req,res) {
    UserModel.find({$or:[{status:'admin'},{status:'active'}]}).select({ 'password': false, '__v': false }).exec((err,users) => {
        if (err) return res.status(500).send(err);

        res.json(users);
      });
}

exports.getUser = async function(req,res){
    UserModel.findById(req.params.id, function(err,user){

        if (err) return res.status(500).send(err);
        
        res.json(user);

    })
}

exports.deactivateUser = async function(req,res){

    UserModel.findByIdAndUpdate(req.params.id, {status: 'inactive'}, function(err){
    
        if (err) return res.status(500).send(err);

        return res.status(200).json("L'utilisateur a bien été désactivé.")
    })

}


exports.activateUser = async function(req,res){

    UserModel.findByIdAndUpdate(req.params.id, {status: 'active'}, function(err){
    
        if (err) return res.status(500).send(err);

        return res.status(200).json("L'utilisateur a bien été activé.")

    })

}