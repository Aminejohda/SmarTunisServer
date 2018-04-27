var express = require('express');
var router = express.Router();
const CultureController = require('../../controllers/Admin/CultureController')
router.get('/',CultureController.index)
router.get('/accept/:spotId',CultureController.edit)
router.get('/countcategories',CultureController.countcategories)

module.exports = router;