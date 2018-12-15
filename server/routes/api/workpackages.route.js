var express = require('express');

var router = express.Router();

const WorkPackagesController = require('../../../controllers/workpackages/workpackages.controller')

const ChatwpController = require('../../../controllers/workpackages/chatwp.controller')

const FileController = require('../../../controllers/files/files.controller')


router.post('/createwp', WorkPackagesController.create);
router.get('/getwp', WorkPackagesController.getAll);
router.get('/getwp/:id', WorkPackagesController.getOne);

router.put('/editwp/:id', WorkPackagesController.edit)

router.get('/activate/:id',WorkPackagesController.activate)
router.get('/deactivate/:id',WorkPackagesController.deactivate)
router.get('/readonly/:id',WorkPackagesController.readonly)


router.post('/savechat', ChatwpController.save);
router.get('/getchat/:id',ChatwpController.getChat)



router.post('/savefile',FileController.uploadWPFile)
/*
router.get('/getfile/:filename',FileController.getWPFile)
*/

module.exports = router;