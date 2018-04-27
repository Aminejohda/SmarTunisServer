var express = require('express');
var router = express.Router();
const CultureController = require('../controllers/CultureController')

router.post('/create',CultureController.create)
router.post('/update',CultureController.edit)
router.get('/',CultureController.index)
router.get('/myspaces/:iduser',CultureController.myspaces)
router.get('/show/:spaceId/:userId',CultureController.show)
router.delete('/delete/:spaceId',CultureController.delete)
router.get('/mostviewd',CultureController.mostviewd)
router.get('/countcategories',CultureController.countcategories)
router.get('/:categorie',CultureController.showByCategorie)
router.post('/go/go',CultureController.linkii)
router.get('/die/die',CultureController.getproductinterrest)
router.get('/go/gogo',CultureController.facii)
router.get('/guezguez/go',CultureController.guezguez)
router.post('/go/product',CultureController.saveproduct)


module.exports = router;