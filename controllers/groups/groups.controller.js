const GroupModel = require('../../models/group.js')
const UserModel = require('../../models/user.js')


exports.create = async function(req,res,err) {
    let group = new GroupModel(req.body);
    
    await group.save(function(err){
        if(err){
          return res.status(500).send(err);
        }
      })
      return res.status(200).json("Le groupe a bien été créé!");
}

exports.getAll = async function(req,res,err) {

  GroupModel.find((err,groups) => {
    if (err) return next(err);
    let users = [];
    groups.forEach(function(e){
      e.members.forEach(function(member){
        UserModel.findById(member,function(err,user){
          users.push(user);
        })
      })
      
    })
    console.log(users)
    res.json(groups);
  })

}