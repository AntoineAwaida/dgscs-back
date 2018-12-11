const GroupModel = require('../../models/group.js')
const UserModel = require('../../models/user.js')
const WorkPackageModel = require('../../models/workpackage')


exports.create = async function (req, res, err) {
  let group = new GroupModel(req.body);

  await group.save(function (err) {
    if (err) {
      return res.status(500).send(err);
    }
  })
  return res.status(200).json("Le groupe a bien été créé!");
}

exports.edit = async function (req,res,err) {

  GroupModel.findById(req.params.id, function (err,group){
    if (err) return res.status(500).send(err);

    group.name = req.body.name;
    group.members = req.body.members;

    try{
      group.save();
      return res.status(200).json("Le groupe a bien été modifié!")
    }
    catch(e){
      return res.status(500).json(e)
    }

  })

}

exports.delete = async function (req,res,err){

  WorkPackageModel.find({ groups: req.params.id}, async function (err,wp){
    wp.forEach(async (workpackage)=> {
      const new_groups = workpackage.groups.filter((item)=> {
        return item != req.params.id
      })
      workpackage.groups = new_groups;

      await workpackage.save(function(err) {
        if(err){ 
          console.log(err)
          return res.status(500).send(err);
        }
      })

    })
  })
  

  
  GroupModel.findByIdAndDelete(req.params.id, function(err,data){
    if(err){
      return res.status(500).send(err);
    }

    return res.status(200).json("Le groupe a bien été supprimé!")

  })



}

exports.getOne = async function (req, res, err){

  await GroupModel.findById(req.params.id, function(err,group){
    if(err){
      return res.status(500).send(err);
    }

    return res.status(200).json(group);

  })


}


exports.getAll = async function (req, res, err) {

  try {

    let groups = await GroupModel.find();

    for (let i = 0; i < groups.length; i++) {

      let group = groups[i]
      let users = [];
      let members = group.members
      for (let j = 0; j < members.length; j++) {
        let member = members[j]
        let user = await UserModel.findById(member).select({ 'password': false, '__v': false })
        users.push(user)
      }
      group.members = users
    }

    return res.status(200).json(groups);

  } catch (e) {
    return res.status(500).json({ "status": 500, "data": null, "message": "Acces au groupes impossible" })
  }


}

