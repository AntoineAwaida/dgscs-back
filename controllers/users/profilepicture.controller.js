//upload des photos de profil
const multer = require('multer');

const fs = require('fs');

const storage = multer.diskStorage({
  destination:function(req,file,cb){
    cb(null,'./static/assets/img/avatars');
  },
  filename: function(req,file,cb) {
    cb(null, req.params.id + '.' + file.mimetype.split('/')[1]);
  }
});


const globals = require('../../config/globals')

const UserModel = require('../../models/user')

const fileFilter = (req,file,cb) => {


  //rejeter un fichier
  if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png') {
    cb(null,true);
  }
  else {
    cb(null,false);
  }
}

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 512 * 512 * 5
  },
  fileFilter: fileFilter
});




exports.setPicture = async function (req, res, err) {
    


    const avatarUpload = upload.single('profilepicture');




      avatarUpload(req, res, function(err) {
        if (err) {
            return res.status(500).send("Erreur au cours de l'envoi de l'image. L'image ne doit pas excéder 512x512 px, et être au format jpeg ou png.");
        }

        UserModel.findByIdAndUpdate(req.params.id, {photoURL : globals.api + req.file.path}, function(err){
            
            if (err) return res.status(500).send(err);

            return res.status(200).send('Profil bien modifié!');
        })
      });




}