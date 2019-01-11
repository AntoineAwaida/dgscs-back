const UserModel = require('../../models/user')
const globals = require('../../config/globals')
const multer = require('multer');
const util = require('util');

const tokenID = require('./users.controller').tokenID;
const getStatus = require('./users.controller').getStatus;

const fileFilter = (req, file, cb) => {
  //rejeter un fichier
  if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png') {
    cb(null, true);
  }
  else {
    cb(null, false);
  }
}

exports.setPicture = async function (req, res) {
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

    // 2. On uploader la photo de profil

    const storage = multer.diskStorage({
      destination: function (req, file, cb) {
        cb(null, './static/assets/img/avatars');
      },
      filename: function (req, file, cb) {
        // cb(null, id + '.' + file.mimetype.split('/')[1]);
        cb(null, id + '.png');
      }
    });

    const upload = multer({
      storage: storage,
      limits: {
        fileSize: 512 * 512 * 5
      },
      fileFilter: fileFilter
    });

    const avatarUpload = util.promisify(upload.single('profilepicture'));
    await avatarUpload(req, res);

    // 3. On enregistrer dans la BDD le l'url du fichier
    console.log(req.file);
    const photoURL = globals.api + req.file.path;
    await UserModel.findByIdAndUpdate(id, { photoURL: photoURL });

    return res.status(200).json({ message: "Photo de profil bien modifiée ", photoURL : photoURL });

  } catch (e) {
    return res.status(500).send({ message: e.message });
  }
}