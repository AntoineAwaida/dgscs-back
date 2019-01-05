var express = require('express');

var router = express.Router();

const AnnounceController = require('../../../controllers/announces/announces.controller');

router.post('/createannounce', AnnounceController.create);
router.get('/getannounces', AnnounceController.getAll)
router.get('/getannounce/:id', AnnounceController.getOne)
router.delete('/deleteannounce/:id', AnnounceController.delete)
router.put('/editannounce/:id', AnnounceController.edit)
router.get('/getlastannounce', AnnounceController.getLast)

module.exports = router