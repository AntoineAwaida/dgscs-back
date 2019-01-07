const multer = require('multer')
const mkdirp = require('mkdirp')
const fs = require('fs');

const globals = require('../../config/globals')

const WorkPackageModel = require('../../models/workpackage');
const FileModel = require('../../models/file');
const TaskModel = require('../../models/task');

const store = multer.diskStorage({
  destination: function (req, file, cb) {
    mkdirp('./static/assets/files/', function (err) {
      if (err) console.log("Unable to create folder.")
      cb(null, './static/assets/files');
    })

  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + "_" + file.originalname);
  }
});

const upload = multer({ storage: store }).single('file');



exports.uploadTaskFile = async function (req, res, err) {

  try{

  // 1. On upload le fichier
  upload(req, res, function (err) {
    if (err) {
      return res.status(500).send(err);
    }
    else {


      // Le fichier vient d'être uploadé
      // Il reste maintenant à créer l'objet File dans la BDD

      // Il faut supprimer le fichier si il n'a pas d'auteur
      if (!req.body.author) {

        fs.unlink('./static/assets/files/' + req.file.filename, function (err) {
          if (err) return console.log(err);
          console.log('file deleted successfully');
        });

        return res.status(500).json({error : "Il manque l'attribut 'author' "});
      }

      // 2. Création de l'objet File dans la BDD

      let file = new FileModel({
        name : req.body.name ? req.body.name : req.file.filename,
        author : req.body.author,
        description : req.body.description ? req.body.description : null,
        fileURL  : req.file.filename,
        date : new Date()
      });

      file.save(function (err, newFile) {
        if(err)
          {
            fs.unlink('./static/assets/files/' + req.file.filename, function (err2) {
              if (err2) return console.log(err2);
              console.log('file deleted successfully');
            });
            return res.status(500).json({ status : "Impossible d'enregistrer le fichier dans la BDD", error : err.message});
          }
        else {

      // 3. On enregistre le fichier dans la tâche

      const taskID = req.params.taskID;
      TaskModel.findById(taskID, function(err, task){

        if (err) return console.log(err)

        task.files.push(file._id);
  
        TaskModel.findOneAndUpdate({_id: taskID}, {$push: {files: file._id}},function(err, newTask){

          if (err) return console.log(err)
          console.log(newTask);
  
          return res.status(200).json({ file : file, task : newTask });

        });
      

      });


        }
      });

    }
    
  })

  }catch(e){
    return res.status(500).json({ error : e.message });
  }

}


exports.uploadTaskFileAsync = async function(req, res, err){
  try{

    // 1. On upload le fichier
    await upload(req, res);
    
    console.log(req.file);
    console.log(req.body);

    // 2. On vérifie qu'il y a bien un auteur
    if (!req.body.author) {
      throw new Error("Il manque l'attribut 'author'");
    }

    // 3. Création de l'objet File dans la BDD

    let file = new FileModel({
      name : req.body.name ? req.body.name : req.file.filename,
      author : req.body.author,
      description : req.body.description ? req.body.description : null,
      fileURL  : req.file.filename,
      date : new Date()
    });

    await file.save()

    // 4. On enregistre le fichier dans la tâche

    const newTask = await TaskModel.findOneAndUpdate({_id: req.params.taskID}, {$push: {files: file._id}}, { new: true });
    return res.status(200).json({ file : file, task : newTask });


  }
  catch(e){

    // S'il y a un problème, on supprime le fichier de la BDD

    fs.unlink('./static/assets/files/' + req.file.filename, function (err) {
      if (err) return console.log(err);
      console.log('File deleted successfully');
    });

    return res.status(500).json({ error : e.message });
  }
}


exports.getFile = async function (req, res, err) {
  const fileID = req.params.fileID;

  try {
    const file = await FileModel.findById(fileID);
    res.status(200).sendFile(file.fileURL, {root: './static/assets/files/'});
  }
  catch(e) {
    return res.status(500).json({error : e});
  }
}


exports.uploadWPFile = async function (req, res, err) {


  upload(req, res, function (err) {


    WorkPackageModel.findById(req.params.id, function (err, wp) {

      if (err) res.status(500).send(err);

      wp.files.push(globals.api + req.file.path)

      try {
        wp.save();
      }

      catch (e) {
        res.status(500).send(err);
      }


    })

    if (err) console.log(err);

    res.status(200).json("ok")

  })


}

