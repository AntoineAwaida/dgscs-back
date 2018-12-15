const fs = require('fs')

const multer = require('multer')
const {encryptor} = require('./encrypt')

const key = 'test'


const storage = multer.diskStorage({
    destination:function(req,file,cb){
      cb(null,'./static/assets/files/wp');
    },
    filename: function(req,file,cb) {
      cb(null, file.originalname + '.' + file.mimetype.split('/')[1]);
    }
  });

const upload = multer({
storage: storage,
onFileUploadComplete: function(file) {

    console.log("coucou")
    console.log(file)
    encryptor({file:file, password:'test'})


}
});

exports.uploadWPFile = async function (req, res, err) {
    

    const fileUpload = upload.single('file')

    fileUpload(req, res, function(err) {

        if (err) console.log(err);

        res.status(200).json("ok")

    })


}