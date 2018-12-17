const TaskModel = require('../../models/task');
const GroupModel = require('../../models/group');
const workPackageModel = require('../../models/workpackage');
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

  } catch (e) {
    return res.status(500).json("Impossible de créer la tâche");
  }
  return res.status(200).json("La tâche a bien été créé!");
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
          task = await TaskModel.findById(task._id).populate({ path: 'author', select: ['first_name', 'last_name'] });
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
            task = await TaskModel.findById(task._id).populate({ path: 'author', select: ['first_name', 'last_name'] });
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
