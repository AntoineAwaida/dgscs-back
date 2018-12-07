var express = require('express');

var router = express.Router();

const WorkPackagesController = require('../../../controllers/workpackages/workpackages.controller')


router.post('/createwp', WorkPackagesController.create);
router.get('/getwp', WorkPackagesController.getAll);

module.exports = router;