const multer = require('multer')

const mkdirp = require('mkdirp')

const globals = require('../../config/globals')

const WorkPackageModel = require('../../models/workpackage')


const storage = multer.diskStorage({
    destination:function(req,file,cb){
      mkdirp('./static/assets/files/wp/' + req.params.id, function(err){

        if (err) console.log("Unable to create folder.")
        cb(null,'./static/assets/files/wp/' + req.params.id);

      })
      
    },
    filename: function(req,file,cb) {
      cb(null, file.originalname);
    }
  });

const upload = multer({
storage: storage,
});

exports.uploadWPFile = async function (req, res, err) {
    

    const fileUpload = upload.single('file')

    fileUpload(req, res, function(err) {


      WorkPackageModel.findById(req.params.id, function(err,wp){

        if (err) res.status(500).send(err);

        wp.files.push(globals.api + req.file.path)

        try {
          wp.save();
        }

        catch(e){
          res.status(500).send(err);
        }


      })

        if (err) console.log(err);

        res.status(200).json("ok")

    })


}