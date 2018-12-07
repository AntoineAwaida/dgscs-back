const WorkPackageModel = require('../../models/workpackage')
const GroupModel = require('../../models/group')


exports.create = async function (req, res, err) {
    let wp = new WorkPackageModel(req.body);

    req.body.groups.forEach((group) => {
      GroupModel.findById(group._id, async function(err, group_db){
      
        if (err) {
          console.log(err); 
          return res.status(500).send(err);
        } 

        group_db.workpackages.push(wp);
        await group_db.save(function(err) {
          if(err){ 
            console.log(err)
            return res.status(500).send(err);
          }
          
        })
      })
    })
  
    await wp.save(function (err) {
      if (err) {
        return res.status(500).send(err);
      }
    })
    return res.status(200).json("Le workpackage a bien été créé!");
  }

exports.getAll = async function (req, res, err) {

  WorkPackageModel.find().populate('groups').exec(function(err,wp){

    if(err) return res.status(500).send(err);

    return res.status(200).json(wp);

  })

}

exports.activate = async function (req, res, err) {

  WorkPackageModel.findByIdAndUpdate(req.params.id,{status:'active'}, function(err){

    if (err) return res.status(500).send(err);

    return res.status(200).json("Le WorkPackage a bien été activé.")

  })

}

exports.deactivate = async function (req, res, err) {

  WorkPackageModel.findByIdAndUpdate(req.params.id,{status:'inactive'}, function(err){

    if (err) return res.status(500).send(err);

    return res.status(200).json("Le WorkPackage a bien été désactivé.")

  })

}

exports.readonly = async function (req, res, err) {

  WorkPackageModel.findByIdAndUpdate(req.params.id,{status:'readonly'}, function(err){

    if (err) return res.status(500).send(err);

    return res.status(200).json("Le WorkPackage a bien été mis en lecture seule.")

  })

}

