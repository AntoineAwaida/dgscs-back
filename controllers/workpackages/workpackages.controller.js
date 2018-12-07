const WorkPackageModel = require('../../models/workpackage')


exports.create = async function (req, res, err) {
    let wp = new WorkPackageModel(req.body);
  
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