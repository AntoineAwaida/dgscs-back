const TaskModel = require('../../models/task');


exports.create = async function (req, res, err) {

  let task = req.body;
  task.status = 'pending';
  let createdTask = new TaskModel(task);

  console.log(createdTask);

  await createdTask.save(function (err) {
    if (err) {
      return res.status(500).send(err);
    }
  })

  // ATTENTION, NE PAS OUBLIER D'AJOUTER LA TACHE AUX GROUPES
  return res.status(200).json("La tâche a bien été créé!");
}

