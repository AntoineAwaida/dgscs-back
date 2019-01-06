const UserModel = require('../../models/user.js');

const GroupModel = require('../../models/group')

const WorkPackageModel = require('../../models/workpackage')








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

exports.getPendingUsers = async function(req,res) {
    UserModel.find({status:'pending'}).select({ 'password': false, '__v': false }).exec((err,users) => {
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

exports.modifyWPFav = async function(req, ress, err){

    UserService.findByIdAndUpdate(req.params.id, {favWorkPackages: req.body.favwp }, function(err){

        if (err) return res.status(500).send(err);

        return res.status(200).json("Modif des favoris ok!")

    })

}

exports.getGroupsForUser = async function (req, res, err) {

    GroupModel.find({ members: req.params.id}, function (err, groups){
  
      if (err) return res.status(500).send(err);
  
      return res.status(200).json(groups);
  
    })
  
}
  

exports.getWPForUser = async function (req, res, err) {

    GroupModel.find({ members: req.params.id}, async function (err, groups){

        if (err) return res.status(500).send(err);

        let wp = [];


        groups.forEach( (group) => {
        group.workpackages.forEach((workpackage) => wp.push(workpackage));
        })

        WorkPackageModel.find({'_id': { $in: wp}}, function (err, wp){
           
            if (err) return res.status(500).send(err);

            return res.status(200).json(wp);

        })

    })
  
}

exports.modifyPassword = async function (req, res, err) {


    UserModel.findById(req.params.id,async function(err,user){

        if (err) return res.status(500).send(err);

        user.password = req.body.password;


        try {

          
            user.save();

            return res.status(200).json("ok");

        }

        catch(e) {

            return res.status(500).send(e);

        }

    })

}
