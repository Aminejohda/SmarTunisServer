const LocalStrategy = require('passport-local').Strategy;
const FacebookStrategy = require('passport-facebook').Strategy;
configAuth = require('./auth')
const bcrypt = require('bcryptjs')
let User = require('../models/User')
 var  fs = require('fs');
 var notcorrect=""
var request = require("request");

var Nightmare = require('nightmare'),
    nightmare = Nightmare({
        show: true
    })

module.exports = function(passport){
passport.use(new LocalStrategy(
	 {
   usernameField: 'username',
   passwordField: 'password',
   passReqToCallback: true

 },function(req, username, password, done){
 	console.log("this is"+password)
if (password==="STRING_VALUESmarTunis") {
	  var nameimg = Date.now()+'image.png';
    let base64Image = req.body.img.split(';base64,').pop();
   // console.log(base64Image);
var regex = /^data:.+\/(.+);base64,(.*)$/;
var matches = req.body.img.match(regex);
var data = matches[2];
var buffer = new Buffer(data, 'base64');
      fs.writeFile('public/images/uploads/Users/'+nameimg, base64Image, {encoding: 'base64'}, function(err) {
var params = { method: 'POST',
  url: 'https://api.kairos.com/recognize',
  headers: 
   { 
     app_key: '50de11940366c58fe8eef7fab5f140c2',
     app_id: 'fd8e76e3',
     'content-type': 'application/json' },
  body: { image: base64Image, gallery_name: 'SmarTunis' },
  json: true };
   request(params, function (err, response, body) {
    if (err) console.log(err, err.stack); // an error occurred
    else    {
if(typeof body.images !=='undefined'){
if(typeof body.images[0].candidates !=='undefined'){
  var Confidence = body.images[0].candidates[0].confidence
  if(Confidence > 0.5){
   	User.findOne({FaceId : body.images[0].candidates[0].face_id ,Email:username ,IsActive : true}, function(err, user){
		if(err) throw err;
		if (!user) {
			return done(null, false, {message: 'No user found'});
		}
    		console.log("c bon")

		return done(null, user)
	
	})
  }


    }
    else{
     console.log("no face detected")
				return done(null, false, {message:'wrong password'})


    }
    }
    else{
     console.log("no face detected")
    	
				return done(null, false, {message:'wrong password'})


    }

  }        
 
  });
});
  }else{
  	
    	User.findOne({Email:username ,IsActive : true}, function(err, user){
    		console.log("d5all")
		if(err) throw err;
		if (!user) {
			return done(null, false, {message: 'No user found'});
		}
		bcrypt.compare(password, user.Password, function(err, isMatch){
			if (err) {throw err}
			if (isMatch) {
				console.log("jawek behi")
				return done(null, user)
			}else{
				console.log("wrong password")
				return done(null, false, {message:'wrong password'})

			}
		})
	})
  }
	  




}))


		passport.serializeUser(function(user, done) {
			token = user.id
		  done(null, user.id);
		});

		passport.deserializeUser(function(id, done) {
		  User.findById(id, function(err, user) {
		    done(err, user);
		  });
		});
		passport.use(new FacebookStrategy({
			clientID: configAuth.facebookAuth.clientID,
			clientSecret: configAuth.facebookAuth.clientSecret,
			callbackURL: configAuth.facebookAuth.callbackURL,
			profileFields: configAuth.facebookAuth.profileFields
		},
		function(accessToken, refreshToken, profile, done) {
			console.log('dqsdqs')
			console.log(profile)
			let query = {
				FaceBookId: profile.id
			}
			User.findOne(query, function(err, user) {
				if (err) throw err;
				if (user) {
					return done(null, user);
				} else {
										var newUser = new User();
										if (profile._json.middle_name === undefined) {
											//console.log('true')
											newUser.FirstName = profile._json.first_name + " " + profile._json.middle_name
										} else {
											newUser.FirstName = profile._json.first_name
										}
										notcorrect = profile._json.link;
	console.log("lenna1")

											console.log(notcorrect)
	console.log("lenna2")
	       nightmare.goto('https://www.facebook.com/')
    .wait(6000).type('#email', 'h5@hotmail.fr').type('#pass', 's6')
  .click('.uiButtonConfirm input').wait(10000)
 .evaluate(function(){
        
        return "notcorrect";
    })
    // wait 2 seconds so page is guaranteed to be fully loaded
    

    
    
    .then(function(url){
    	console.log(notcorrect)
 nightmare.goto(notcorrect).wait(6000).evaluate(function(){
 	 var item =  window.location.toString()
        return item
 }).end().then(function(result){
 	console.log("ahawa ya ta7foun")
 	console.log(result)
 })

    })




										newUser.LastName = profile._json.last_name
										newUser.FaceBookId = profile.id
										newUser.Email = profile._json.email
										newUser.Facebookaccount = profile._json.link
										newUser.Picture = profile._json.picture.data.url
										newUser.save(function(err) {
											if (err) throw err;
											return done(null, newUser)
										});
				}
			})
		}
	));



}


