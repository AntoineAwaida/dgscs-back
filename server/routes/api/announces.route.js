var express = require('express');

var router = express.Router();

const AnnounceController = require('../../../controllers/announces/announces.controller.js')


router.post('/createannounce', AnnounceController.create);
router.get('/getannounces', AnnounceController.getAll)
router.get('/getannounce/:id', AnnounceController.getOne)
router.delete('/deleteannounce/:id', AnnounceController.delete)
router.put('/editannounce/:id', AnnounceController.edit)

