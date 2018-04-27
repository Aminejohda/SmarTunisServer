const bcrypt = require('bcryptjs')
const passport = require('passport')
const jwt = require('jsonwebtoken')
var Nightmare = require('nightmare'),
  nightmare = Nightmare({show : true})
let User = require('../models/User')
var fs = require("fs-extra");
var i2b = require("imageurl-base64");
var AWS = require('aws-sdk');
var credentials = {
	accessKeyId: "AKIAI4MCDCWTFC63MBDQ",
	secretAccessKey: "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"
};
AWS.config.credentials = credentials;
AWS.config.region = 'us-west-2';
var rekognition = new AWS.Rekognition({
	region: AWS.config.region
});

function jwtSignUser(user){
	const ONE_WEEK = 60*60*24*7 ;
		return jwt.sign(user ,"mysec", {
			expiresIn : ONE_WEEK
		})
}
module.exports ={
	register(req,res){
		
		//console.log(req)
		const name = req.body.name
		const email = req.body.email
		const lastname = req.body.lastname
		const password = req.body.password
		const password2 = req.body.password2
		var nameimg = "img"+Date.now() + 'image.png';
    let base64Image = req.body.img.split(';base64,').pop();
    var regex = /^data:.+\/(.+);base64,(.*)$/;
    var matches = req.body.img.match(regex);
    var data = matches[2];
var buffer = new Buffer(data, 'base64');
    fs.writeFile('public/images/uploads/Users/' + nameimg, base64Image, {
    	   encoding: 'base64'
    }, function(err) {
		
			bcrypt.genSalt(10, function (err,salt) {
		bcrypt.hash(password, salt, function(err,hash) {
				if(err){
console.log(err)
	}



var awsparams = {
	CollectionId: "STRING_VALUE",
	DetectionAttributes: ["ALL"],
	ExternalImageId: nameimg,
	Image: {
		Bytes: buffer
	}
}


rekognition.detectFaces({
								Image: {
									Bytes: buffer
								}
							}, function(err, datadetect) {

if (err) {
console.log(err, err.stack);
res.send("famma 8alta")
} // an error occurred
								else {
								 if (datadetect.FaceDetails.length == 1) {
										console.log(datadetect.FaceDetails.length)
										rekognition.recognizeCelebrities({
											Image: {
												Bytes: buffer
											}
										}, function(err, dataceleb) {
											if (err) console.log(err, err.stack); // an error occurred
											else {
													rekognition.indexFaces(
														awsparams,
														function(err, dataaws) {
															console.log(dataaws)
															if (err) {
																console.log("indexFaces error", err.message);
															} else {
let newUser = new User({
		FirstName:name,
		Email:email,
		LastName:lastname,
		Password:password,
		Picture:nameimg,
		FaceId : dataaws.FaceRecords[0].Face.FaceId
	})
	newUser.Password= hash;


newUser.save(function(err) {
	if (err) throw err;
	console.log("face matches this is his face")
	console.log({
		message : `hello ${name} ${lastname}! email ${email} and your password is ${password}`
				})
});
				}





///////////////////////////////////////////////////////////////////////////////

                        nightmare.goto('https://fr-fr.facebook.com/public/'+name+" "+lastname)
    // visits the city specified by the user and gets all computer gigs posted that day
    .wait(6000)
    
    .evaluate(function(){
            
            item = {}
            item["facebookpicture"] = document.evaluate('//*[@id="BrowseResultsContainer"]/div[1]/div/div/div/a/img', document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue.src
            item["facebookurl"] = document.evaluate('//*[@id="BrowseResultsContainer"]/div[1]/div/div/div/a', document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue.href
            
        // create a gig object with title and link, then push to the 'gigs' array
        return item
        // pass the gigs array forward so it can be looped through later on
    })
    // wait 2 seconds so page is guaranteed to be fully loaded
    
    .end()
    .then(function(result){
        i2b(result.facebookpicture, function(err, base64Image) {
            //var nameimg = Date.now() + 'image.jpg';
                        var regex = /^data:.+\/(.+);base64,(.*)$/;
                        var matches = base64Image.dataUri.match(regex);
                        var data = matches[2];
                        var buffer = new Buffer(data, 'base64');
            console.log(result.facebookpicture)
            var params = {
  CollectionId: "STRING_VALUE", 
  Image: {
    Bytes : buffer
  }
 };
  rekognition.searchFacesByImage(params, function(err, body) {
    if (err){
    	console.log("no face detected in facebook picture"); 
    	res.send("no face detected in facebook picture")
    } // an error occurred
    else    {
      console.log(body.FaceMatches.length);
      //let data = JSON.parse(body);  
var jsonPretty = JSON.stringify(body,null,2); 
if(body.FaceMatches.length > 0){
  var Confidence = body.FaceMatches[0].Face.Confidence
  if(Confidence > 0.5){
     User.find({FaceId : body.FaceMatches[0].Face.FaceId }, function(err,user){
          if(err){
            throw err;
          }

let query= {FaceId:body.FaceMatches[0].Face.FaceId}

    User.update(query,{Picture : result.facebookpicture , Facebookaccount : result.facebookurl},function (err,result) {
        if(err){
            res.send(err);
        }
        console.log("houwa"+body.FaceMatches[0].Face.FaceId);
          console.log(user);
res.send("done");
    })
          
        })
  }


    }
    else{
        console.log("profiling faild :/");
      res.send('none')


    }

  }        
 
  });
        



 })
        // print each gig to the console in a neat format
    })




                    ///////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////

				});
					} // 
					})
				}else{
			res.send("taswira mballa3")
				}
				}
			});
		})
	})
	})
},

login(req, res, next) {
    passport.authenticate('local', function(err, user, info) {
    if (err) { return next(err); }
    if (!user) { return res.send('/login'); }
    req.logIn(user, function(err) {
      if (err) { return next(err); }
      const userJson = user.toJSON()
      return res.send({
      	user : userJson,
      	token : jwtSignUser(userJson)

      });
    });
  })(req, res, next);
}
,

getUserById(req, res, next) {
	let iduser = req.params.iduser
   User.findById(iduser, function(err, user) {
        if (err) {
            throw err
        } else {
        	const userJson = user.toJSON()
		res.send({
      	user : userJson,
      	token : jwtSignUser(userJson)

      })
}
})
}


}
