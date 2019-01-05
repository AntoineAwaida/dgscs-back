const multer = require('multer')
const mkdirp = require('mkdirp')
const fs = require('fs');

const globals = require('../../config/globals')

const WorkPackageModel = require('../../models/workpackage')
const FileModel = require('../../models/file')

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

  // 1. On upload le fichier
  upload(req, res, function (err) {
    if (err) {
      return res.status(500).send(err);
    }
    else {
      // Le fichier vient d'être uploadé
      // Il reste maintenant à créer l'objet File dans la BDD

      // Il faut supprimer le fichier si il n'a pas de nom ou d'auteur
      if (!req.body.name || !req.body.author) {

        fs.unlink('./static/assets/files/' + req.file.filename, function (err) {
          if (err) return console.log(err);
          console.log('file deleted successfully');
        });

        return res.status(500).send("Il manque l'attribut 'name' ou 'author' ");
      }

      // 2. Création de l'objet File dans la BDD

      let file = new FileModel({
        name : req.body.name,
        author : req.body.author,
        description : req.body.description ? req.body.description : null,
        fileURL  : req.file.filename,
        date : new Date()
      });

      file.save(function (err, newFile) {
        if(err)
          {
            return res.status(500).json({ status : "Impossible d'enregistrer le fichier dans la BDD", error : err.message});
          }
        else {

      // 3. On enregistre le fichier dans la tâche

      // A Faire...

      

        return res.status(200).json({ file : file });

        }
      });


    }
  })
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