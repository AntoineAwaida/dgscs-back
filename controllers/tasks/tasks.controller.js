const TaskModel = require('../../models/task');
const GroupModel = require('../../models/group');
const WorkPackageModel = require('../../models/workpackage');
const UserModel = require('../../models/user');


exports.create = async function (req, res, err) {
  try {
    // Créer la tâche
    let task = req.body;
    task.status = 'pending';
    let createdTask = new TaskModel(task);

    // Sauvegarder la tâche
    await createdTask.save()

    // Ajout de la tâche à chaque groupe.

    let taskWithGroups = await TaskModel.findById(createdTask._id).populate('groups');
    let groups = taskWithGroups.groups;
    for (let i = 0; i < groups.length; i++) {
      let group = groups[i];
      group.tasks.push(createdTask._id);
      await GroupModel.findByIdAndUpdate(group._id, { tasks: group.tasks });
    }
    return res.status(200).json("La tâche a bien été créée!");

  } catch (e) {
    return res.status(500).json("Impossible de créer la tâche");
  }
}

exports.getTasksFromUser = async function (req, res, err) {

  try {
    const userID = req.params.userID;
    let groups = await GroupModel.find({ members: { $in: userID } }).populate('tasks').populate('author'); // Les groupes du User
    let tasks = [];
    //console.log(groups);
    for (let i = 0; i < groups.length; i++) {
      let group = groups[i];
      for (let j = 0; j < group.tasks.length; j++) {
        let task = group.tasks[j];

        //Avant d'ajouter la tâche on vérifie qu'elle n'est pas dedans
        let isAlready = false;
        for (var k = 0; k < tasks.length; k++) {
          let task2 = tasks[k];
          if (task2._id.equals(task._id)) {
            isAlready = true;
          }
        }
        if (!isAlready) {
          task = await TaskModel.findById(task._id)
                .populate({ path: 'author', select: ['first_name', 'last_name'] })
                .populate({ path : 'groups', select:'name' });
          tasks.push(task);
        }

      }
    }

    //On va maintenant trier le tableau par date de début

    // tasks.sort( (task1, task2) => {
    //   return(task1.startingDate.compare(task2.startingDate))
    // });

    console.log(tasks);

    //console.log("********\n");
    //console.log(tasks);
    //console.log("********\n");
    return res.status(200).send(tasks);
  } catch (e) {
    return res.status(500).json("Impossible de récupérer les tâches du user");
  }

}

exports.getTaskFromUser = async function (req, res, err) {

  try {
    if (!req.body.taskID) {
      return res.status(500).json("Il manque le paramètre 'taskID'");
    }
    else {
      const taskID = req.body.taskID;
      const userID = req.params.userID;

      let groups = await GroupModel.find({ members: { $in: userID } }).populate('tasks').populate('author'); // Les groupes du User
      for (let i = 0; i < groups.length; i++) {
        let group = groups[i];
        for (let j = 0; j < group.tasks.length; j++) {
          let task = group.tasks[j];
          if (task._id.equals(taskID)) {
            task = await TaskModel.findById(task._id)
                .populate({ path: 'author', select: ['first_name', 'last_name'] })
                .populate({ path : 'groups', select:'name' })
                .populate('tasks')
                .populate({ path : 'files', populate : { path: 'author', select: ['first_name', 'last_name'] } });
            return res.status(200).send(task);
          }
        }
      }
      return res.status(500).json("Ce user ne peut pas accéder à cette tâche");
    }
  } catch (e) {
    return res.status(500).json("Impossible de récupérer les tâches du user : "+e.message);
  }

}


exports.editTask = async function (req, res, err) {

  try {
    if (!req.body._id) {
      return res.status(500).json("Il manque le paramètre '_id'");
    }
    else {
    
      let taskID = req.body._id;
      let userID = req.params.userID;

      let task = await TaskModel.findById(taskID);
      let authorID = task.author;

      if(!authorID.equals(userID)){
        return res.status(500).json("Vous n'êtes pas l'auteur de la tâche");
      }
      else {
        let taskUpdate = {};

        if(req.body.description){
          taskUpdate.description = req.body.description;
        }

        if(req.body.name){
          taskUpdate.name = req.body.name;
        }

        if(req.body.startingDate){
          taskUpdate.startingDate = req.body.startingDate;
        }

        if(req.body.endingDate){
          taskUpdate.endingDate = req.body.endingDate;
        }

        if( (req.body.status) && ( (req.body.status=='pending') || (req.body.status=='ongoing') || (req.body.status=='done') )){
          taskUpdate.status = req.body.status;
        }

        if(req.body.groups){
          taskUpdate.groups = req.body.groups;
        }


        console.log(taskUpdate);
        await TaskModel.findByIdAndUpdate(taskID, taskUpdate); 
        return res.status(200).json("User bien modifié");
        
      }
    }
  } catch (e) {
    return res.status(500).json("Impossible d'accéder à cette tâche' : "+e.message);
  }

}

exports.editStatus = async function (req, res, err) {

  try {
    if (!req.body.taskID) {
      return res.status(500).json("Il manque le paramètre 'taskID'");
    }
    else if( (!req.body.status) || ( (req.body.status!='pending') && (req.body.status!='ongoing') && (req.body.status!='done') )) {
      return res.status(500).json("le paramètre status est manquant ou est différent de 'pending', 'done' et 'ongoing'");
    }
    else {
    
      const taskID = req.body.taskID;
      const userID = req.params.userID;
      const status = req.body.status;

      let groups = await GroupModel.find({ members: { $in: userID } }).populate('tasks'); // Les groupes du User
      for (let i = 0; i < groups.length; i++) {
        let group = groups[i];
        for (let j = 0; j < group.tasks.length; j++) {
          let task = group.tasks[j];
          if (task._id.equals(taskID)) {
            
            await TaskModel.findByIdAndUpdate(taskID, {status : status});
            return res.status(200).json("Le user a bien été modifié")
          }
        }
      }
      return res.status(500).json("Ce user ne peut pas accéder à cette tâche");
    }
  } catch (e) {
    return res.status(500).json("Impossible de récupérer les tâches du user : "+e.message);
  }

}

exports.deleteLinkTask = async function(req, res,err){


  TaskModel.find({$or: [{ _id: req.body.task1 }, { _id: req.body.task2 }]}).exec(function(err, db_tasks){

    if(db_tasks.length != 2){
      
      return res.status(500).json("Erreur, on n'a pas exactement 2 taches correspondant à ces 2 id...")

    }

    db_tasks[0].tasks = db_tasks[0].tasks.filter((e) => e.toString() != db_tasks[1]._id.toString());
    db_tasks[1].tasks = db_tasks[1].tasks.filter((e) => e.toString() != db_tasks[0]._id.toString());



    try {

      db_tasks[0].save();
      db_tasks[1].save();

    }
    
    catch(error){
      return res.status(500).send(error);
    }

  })

  return res.status(200).json("ok")

}

exports.addLinkTask = async function(req, res, err){

  TaskModel.find({$or: [{ _id: req.body.task1 }, { _id: req.body.task2 }]}).exec(function(err, db_tasks){

    if(db_tasks.length != 2){
      
      return res.status(500).json("Erreur, on n'a pas exactement 2 taches correspondant à ces 2 id...")

    }

    db_tasks[0].tasks.push(db_tasks[1]._id);
    db_tasks[1].tasks.push(db_tasks[0]._id);

    try {

      db_tasks[0].save();
      db_tasks[1].save();

    }
    
    catch(error){
      return res.status(500).send(error);
    }

  })

  return res.status(200).json("ok")
  

}

exports.getWP = async function (req, res, err){

  WorkPackageModel.find({tasks: req.params.id}).select(['_id','name']).exec(function(err,wp){

    if (err) return res.status(500).send(err);

    return res.status(200).json(wp);

  })


}