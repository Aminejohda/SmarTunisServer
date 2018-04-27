var express = require('express');
var router = express.Router();
const UsersController = require('../../controllers/Admin/UsersController')
router.get('/',UsersController.index)
router.get('/bannaccept/:userid',UsersController.bannaccept)
router.get('/fetchlinkidin/:name/:lastname/:iduser',UsersController.linkii)

module.exports = router;