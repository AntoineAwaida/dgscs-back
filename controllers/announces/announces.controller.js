const AnnounceModel = require('../../models/announce')


exports.getAll = async function (req, res, err) {


    AnnounceModel.find().populate('author').exec(function(err,announces){
  
      if(err) return res.status(500).send(err);
  
      return res.status(200).json(announces);
  
    })
  
}

exports.getOne = async function (req, res, err) {


    AnnounceModel.findById(req.params.id).populate('author').exec(function(err,announce){

        if(err) return res.status(500).send(err);
  
        return res.status(200).json(announce);


    })


}

exports.create = async function (req, res, err) {

    let announce = new AnnounceModel(req.body);

    announce.save(function(err){
        if(err) {
            console.log(err);
            return res.status(500).send(err);
        }

        return res.status(200).send();
    })

}

exports.delete = async function(req, res, err){

    AnnounceModel.findByIdAndDelete(req.params.id, function(err){

        if(err){
            return res.status(500).send(err);
          }
      
          return res.status(200).json("L'annonce a bien été supprimée!")
      
        })

}

exports.edit = async function (req,res,err) {

    AnnounceModel.findById(req.params.id, function (err,group){
      if (err) return res.status(500).send(err);
  
      announce.title = req.body.title
      announce.content = req.body.content
      announce.author = req.body.author
  
      try{
        group.save();
        return res.status(200).json("L'annonce a bien été modifiée!")
      }
      catch(e){
        return res.status(500).json(e)
      }
  
    })
  
  }
