const WorkPackageModel = require('../../models/workpackage')
const GroupModel = require('../../models/group')



exports.edit = async function (req, res, err) {

  WorkPackageModel.findById(req.params.id, function(err,wp){

    if(err) return res.status(500).send(err);

    const old_groups = wp.groups


    wp.name = req.body.name;
    wp.description = req.body.description;
    wp.tasks = req.body.tasks;
    wp.status = req.body.status;
    wp.groups = req.body.groups;


    old_groups.forEach((group) => {
      GroupModel.findById(group._id, async function(err, group_db){
      
        if (err) {
          console.log(err); 
          return res.status(500).send(err);
        } 


        if (!req.body.groups.some(g => g._id == group)){
          const new_list = group_db.workpackages.filter( function(item) {
            return item != req.params.id
          })
          group_db.workpackages = new_list
        }

        
  
        await group_db.save(function(err) {
          if(err){ 
            console.log(err)
            return res.status(500).send(err);
          }
          
        })
      })
    })


    req.body.groups.forEach((group) => {
      GroupModel.findById(group._id, async function(err, group_db){
      
        if (err) {
          console.log(err); 
          return res.status(500).send(err);
        } 


      

        if (old_groups.indexOf(group._id) == -1){

          group_db.workpackages.push(wp)

        }


  
        await group_db.save(function(err) {
          if(err){ 
            console.log(err)
            return res.status(500).send(err);
          }
          
        })
      })
    })


    try {

      wp.save();
      return res.status(200).json("Le workpackage a bien été modifié!")

    }

    catch(e){
      return res.status(500).json(e)
    }


  })

}

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

  WorkPackageModel.find().populate('groups').populate('tasks').exec(function(err,wp){

    if(err) return res.status(500).send(err);

    return res.status(200).json(wp);

  })

}

exports.getOne = async function (req, res, err) {

  WorkPackageModel.findById(req.params.id).populate('groups').populate('tasks').exec(function(err,wp) {
    
    if (err) return res.status(500).send(err);

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

exports.getTasks = async function (req, res, err) {

  WorkPackageModel.findById(req.params.id, function (err, wp){

    if (err) return res.status(500).send(err);

    return res.status(200).json(wp.tasks)

  })

}

exports.addTasks = async function (req, res, err) {


  WorkPackageModel.findById(req.params.id, function(err, wp) {

  

    if (err) return res.status(500).send(err);

    req.body.tasks.forEach((e) => wp.tasks.push(e))


    try {

      wp.save();

      return res.status(200).json("ok");

    }

    catch(e){

      return res.status(500).send(e);

    }

    

  })

}

exports.deleteLinkTask = async function (req, res, err) {

  WorkPackageModel.findById(req.params.id, function(err, wp){

    if (err) return res.status(500).send(err);

    wp.tasks = wp.tasks.filter(function(ele){
      return ele != req.body.task
    });

    try {

      wp.save();

      return res.status(200).json("ok")

    }

    catch(e){
      
      return res.status(500).send(e)

    }
    

  })

}

