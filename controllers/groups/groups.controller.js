const GroupModel = require('../../models/group.js')


exports.create = async function(req,res,err) {
    let group = new GroupModel(req.body);
    
    await group.save(function(err){
        if(err){
          return res.status(500).send(err);
        }
      })
      return res.status(200).send("Le groupe a bien été créé!");
}

exports.getAll = async function(req,res,err) {

  GroupModel.find((err,groups) => {
    if (err) return next(err);
    res.json(groups);
  })

}