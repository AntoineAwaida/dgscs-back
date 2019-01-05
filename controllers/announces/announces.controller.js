const AnnounceModel = require('../../models/announce')


exports.getAll = async function (req, res, err) {

    AnnounceModel.find().populate('author').exec(function(err,announces){
  
      if(err) return res.status(500).send(err);
  
      return res.status(200).json(announces);
  
    })
  
  }