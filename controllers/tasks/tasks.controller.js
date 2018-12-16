const TaskModel = require('../../models/task');
const GroupModel = require('../../models/group');


exports.create = async function (req, res, err) {
  try{
 // Créer la tâche
  let task = req.body;
  task.status = 'pending';
  let createdTask = new TaskModel(task);

  // Sauvegarder la tâche
  await createdTask.save()

  // Ajout de la tâche à chaque groupe.

    let taskWithGroups = await TaskModel.findById(createdTask._id).populate('groups');
    let groups = taskWithGroups.groups;
    for(let i=0; i<groups.length; i++){
      let group = groups[i];
      group.tasks.push(createdTask._id);
      await GroupModel.findByIdAndUpdate(group._id, {tasks : group.tasks});
    }
  
  }catch(e){
    return res.status(500).json("Impossible de créer la tâche");
  }
  return res.status(200).json("La tâche a bien été créé!");
}

exports.getWorkPackageTasks = async function(req, res, err){
  
}