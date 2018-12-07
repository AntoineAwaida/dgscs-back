var express = require('express');

var router = express.Router();

const WorkPackagesController = require('../../../controllers/workpackages/workpackages.controller')


router.post('/createwp', WorkPackagesController.create);
router.get('/getwp', WorkPackagesController.getAll);

router.get('/activate/:id',WorkPackagesController.activate)
router.get('/deactivate/:id',WorkPackagesController.deactivate)
router.get('/readonly/:id',WorkPackagesController.readonly)

module.exports = router;