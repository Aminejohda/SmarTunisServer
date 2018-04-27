var express = require('express');
var router = express.Router();
var passport  = require('passport')
const AuthentificationController = require('../controllers/AuthentificationController')

router.post('/register',AuthentificationController.register)
router.post('/login',AuthentificationController.login)
router.get('/getUserById/:iduser',AuthentificationController.getUserById)
router.get('/facebook', passport.authenticate('facebook', {scope : ['email']}));
router.get('/facebook/callback',
  passport.authenticate('facebook', { failureRedirect: '/' }),function(req,res){
  	res.redirect('http://localhost:8080/#/redirect/'+token)
  });
/*
  passport.authenticate('facebook', { successRedirect: '',
                                      failureRedirect: '/' }));*/
module.exports = router;
