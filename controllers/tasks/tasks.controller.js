const TaskModel = require('../../models/task');
const GroupModel = require('../../models/group');
const WorkPackageModel = require('../../models/workpackage');

const tokenID = require('../users/users.controller').tokenID;
const getStatus = require('../users/users.controller').getStatus;

// ANCIENNES FONCTIONS



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
            .populate({ path: 'groups', select: 'name' });
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
              .populate({ path: 'groups', select: 'name' })
              .populate('tasks')
              .populate({ path: 'files', populate: { path: 'author', select: ['first_name', 'last_name'] } });
            return res.status(200).send(task);
          }
        }
      }
      return res.status(500).json("Ce user ne peut pas accéder à cette tâche");
    }
  } catch (e) {
    return res.status(500).json("Impossible de récupérer les tâches du user : " + e.message);
  }

}


exports.editStatus = async function (req, res, err) {

  try {
    if (!req.body.taskID) {
      return res.status(500).json("Il manque le paramètre 'taskID'");
    }
    else if ((!req.body.status) || ((req.body.status != 'pending') && (req.body.status != 'ongoing') && (req.body.status != 'done'))) {
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

            await TaskModel.findByIdAndUpdate(taskID, { status: status });
            return res.status(200).json("Le user a bien été modifié")
          }
        }
      }
      return res.status(500).json("Ce user ne peut pas accéder à cette tâche");
    }
  } catch (e) {
    return res.status(500).json("Impossible de récupérer les tâches du user : " + e.message);
  }

}

exports.deleteLinkTask = async function (req, res, err) {


  TaskModel.find({ $or: [{ _id: req.body.task1 }, { _id: req.body.task2 }] }).exec(function (err, db_tasks) {

    if (db_tasks.length != 2) {

      return res.status(500).json("Erreur, on n'a pas exactement 2 taches correspondant à ces 2 id...")

    }

    db_tasks[0].tasks = db_tasks[0].tasks.filter((e) => e.toString() != db_tasks[1]._id.toString());
    db_tasks[1].tasks = db_tasks[1].tasks.filter((e) => e.toString() != db_tasks[0]._id.toString());



    try {

      db_tasks[0].save();
      db_tasks[1].save();

    }

    catch (error) {
      return res.status(500).send(error);
    }

  })

  return res.status(200).json("ok")

}

exports.addLinkTask = async function (req, res, err) {

  TaskModel.find({ $or: [{ _id: req.body.task1 }, { _id: req.body.task2 }] }).exec(function (err, db_tasks) {

    if (db_tasks.length != 2) {

      return res.status(500).json("Erreur, on n'a pas exactement 2 taches correspondant à ces 2 id...")

    }

    db_tasks[0].tasks.push(db_tasks[1]._id);
    db_tasks[1].tasks.push(db_tasks[0]._id);

    try {

      db_tasks[0].save();
      db_tasks[1].save();

    }

    catch (error) {
      return res.status(500).send(error);
    }

  })

  return res.status(200).json("ok")


}

exports.getWP = async function (req, res, err) {

  WorkPackageModel.find({ tasks: req.params.id }).select(['_id', 'name']).exec(function (err, wp) {

    if (err) return res.status(500).send(err);

    return res.status(200).json(wp);

  })


}

// Nouvelles fonctions

// 1. Fonctions pour un User 'active' ou 'admin'

// POST 

exports.create = async function (req, res) {
  try {

    const id = tokenID(req);

    // 1. On vérifie qu'il est bien 'actif' ou 'admin'
    try {
      const status = await getStatus(id);
      if (!((status == "active") || (status == "admin"))) {
        throw new Error("the user is not 'active' or 'admin'");
      }
    } catch (e) {
      return res.status(401).send({ error: e.message })
    }

    // 2. On vérifie que tous les champs requis sont présents

    if (!req.body.name || !req.body.description || !req.body.startingDate || !req.body.endingDate || !req.body.groups) {
      throw new Error("name, description, startingDate, endingDate or groups is missing");
    }

    // 3. On créée la tâche et on la sauvegarde
    let task = {
      name: req.body.name,
      description: req.body.description,
      startingDate: req.body.startingDate,
      endingDate: req.body.endingDate,
      groups: req.body.groups,
      status: 'pending',
      author: id
    }

    let createdTask = new TaskModel(task);
    await createdTask.save()

    // 4. Ajout de la tâche à chaque groupe.

    let groups = (await TaskModel.findById(createdTask._id).select('groups').populate('groups')).groups

    for (let group of groups) {
      await GroupModel.findByIdAndUpdate(group._id, { $push: { tasks: createdTask._id } });
    }
    return res.status(200).send({ message: "La tâche a bien été créée !", task: createdTask });

  } catch (e) {
    return res.status(500).send({ error: e.message })
  }
}

// 2. Fonctions pour un user 'author' de la tâche ou 'admin'

// PUT

exports.editTask2 = async function (req, res) {

  try {
    if (!req.body._id) {
      return res.status(500).json("Il manque le paramètre '_id'");
    }
    else {

      let taskID = req.body._id;
      let userID = req.params.userID;

      let task = await TaskModel.findById(taskID);
      let authorID = task.author;

      if (!authorID.equals(userID)) {
        return res.status(500).json("Vous n'êtes pas l'auteur de la tâche");
      }
      else {
        let taskUpdate = {};

        if (req.body.description) {
          taskUpdate.description = req.body.description;
        }

        if (req.body.name) {
          taskUpdate.name = req.body.name;
        }

        if (req.body.startingDate) {
          taskUpdate.startingDate = req.body.startingDate;
        }

        if (req.body.endingDate) {
          taskUpdate.endingDate = req.body.endingDate;
        }

        if ((req.body.status) && ((req.body.status == 'pending') || (req.body.status == 'ongoing') || (req.body.status == 'done'))) {
          taskUpdate.status = req.body.status;
        }

        if (req.body.groups) {
          taskUpdate.groups = req.body.groups;
        }


        console.log(taskUpdate);
        await TaskModel.findByIdAndUpdate(taskID, taskUpdate);
        return res.status(200).json("User bien modifié");

      }
    }
  } catch (e) {
    return res.status(500).json("Impossible d'accéder à cette tâche' : " + e.message);
  }

}

exports.editTask = async function (req, res) {

  try {

    if (!req.body._id) {
      throw new Error("L'attribut '_id' est manquant");
    }

    const id = tokenID(req);
    const taskID = req.body._id;

    // 1. Permissions : On vérifie qu'il est bien ('actif' et auteur) ou 'admin'
    try {

      // a. On récupère l'auteur de la tâche

      const author = (await TaskModel.findById(taskID).select('author'))._id;

      // b. On vérifie qu'il est bien ('actif' et auteur) ou 'admin'
      const status = await getStatus(id);
      if (status != "admin") {
        if (status != 'active') {
          throw new Error("the user is not 'active' or 'admin'");
        }
        else {
          // c. Si il est actif mais pas admin, on vérifie que c'est bien l'auteur de la tâche
          if (author != id) {
            throw new Error("The user is not the author of the task");
          }
        }

      }
    } catch (e) {
      return res.status(401).send({ error: e.message })
    }

    // 2. On modifie la tâche

    let taskUpdate = {};
    if (req.body.description) {
      taskUpdate.description = req.body.description;
    }
    if (req.body.name) {
      taskUpdate.name = req.body.name;
    }
    if (req.body.startingDate) {
      taskUpdate.startingDate = req.body.startingDate;
    }
    if (req.body.endingDate) {
      taskUpdate.endingDate = req.body.endingDate;
    }
    if ((req.body.status) && ((req.body.status == 'pending') || (req.body.status == 'ongoing') || (req.body.status == 'done'))) {
      taskUpdate.status = req.body.status;
    }
    if (req.body.groups) {
      taskUpdate.groups = req.body.groups;
    } 

    await TaskModel.findByIdAndUpdate(taskID, taskUpdate);
    return res.status(200).send({message : "Tâche bien modifiée"});

  }
  catch (e) {
    return res.status(500).send({ error: e.message })
  }

}

 