const express = require('express'),
app = express()
var server = require('http').createServer(app)
var io = require('socket.io')(server);
server.listen(4000);

const bcrypt = require('bcryptjs')
const passport = require('passport')
const jwt = require('jsonwebtoken')
var Nightmare = require('nightmare')
        var xx=[]
        var itemxx ={}
let User = require('../models/User')
var fs = require("fs-extra");
var i2b = require("imageurl-base64");
var request = require("request");
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

function jwtSignUser(user) {
    const ONE_WEEK = 60 * 60 * 24 * 7;
    return jwt.sign(user, "mysec", {
        expiresIn: ONE_WEEK
    })
}
module.exports = {
    register(req, res) {
      if(req.body.role === "Company"){
        let name = req.body.name
        let adr= req.body.adr
        let fax = req.body.fax
        let tel = req.body.tel
        var nameimg = "img" + Date.now() + 'image.png';
        let base64Image = req.body.img.split(';base64,').pop();
        let password = req.body.password
        let email = req.body.email
 let newUser = new User({
               CompanyName: name,
               Email: email,
               Password: password,
               Picture: nameimg,
               Role :"Company",
               Phone :tel,
               Fax : fax,
               Address :adr
           })
 fs.writeFile('public/images/uploads/Company/' + nameimg, base64Image, {
            encoding: 'base64'
        },function(err) {
 bcrypt.genSalt(10, function(err, salt) {
                bcrypt.hash(password, salt, function(err, hash) {
               newUser.Password = hash;
               newUser.save(function(err) {
                   if (err) throw err;
                   console.log("c bon")
                   res.send("done")
               });
               });
               });
                })

      }else {
        


      var nightmare = Nightmare({
        show: true
    })
        const name = req.body.name
        const email = req.body.email
        const lastname = req.body.lastname
        const password = req.body.password
        const password2 = req.body.password2
        var nameimg = "img" + Date.now() + 'image.png';
        let base64Image = req.body.img.split(';base64,').pop();
        var regex = /^data:.+\/(.+);base64,(.*)$/;
        var matches = req.body.img.match(regex);
        var data = matches[2];
        var buffer = new Buffer(data, 'base64');
        fs.writeFile('public/images/uploads/Users/' + nameimg, base64Image, {
            encoding: 'base64'
        }, function(err) {
            bcrypt.genSalt(10, function(err, salt) {
                bcrypt.hash(password, salt, function(err, hash) {
                    if (err) {
                        console.log(err)
                        res.send("err")
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
                            res.send("err")
                        } 
                        else {
                            if (datadetect.FaceDetails.length == 1) {
                                console.log(datadetect.FaceDetails.length)
                                        rekognition.indexFaces(
                                            awsparams,
                                            function(err, dataaws) {
                                                console.log(dataaws)
                                                if (err) {
                                                    console.log("indexFaces error", err.message);
                                                } else {
                                                    let newUser = new User({
                                                        FirstName: name,
                                                        Email: email,
                                                        LastName: lastname,
                                                        Password: password,
                                                        Picture: nameimg,
                                                        Role :"User",
                                                        FaceId: dataaws.FaceRecords[0].Face.FaceId
                                                    })
                                                    newUser.Password = hash;


                                                    newUser.save(function(err) {
                                                        if (err) throw err;
                                                        console.log("c bon")
                                                        res.send("done")
                                                    });
                                               }
                                           })
                                    }else{
                                            res.send("barcha wjouh fel taswira")
                                        }
                                    }
                                })
                })
            })
        })




console.log("lenna")
            nightmare.goto('https://www.facebook.com/')
    .wait(3000).type('#email', 'h@hotmail.fr').type('#pass', 's6')
  .click('.uiButtonConfirm input').wait(5000)
 .evaluate(function(name,lastname){
    console.log(name)
    console.log("eazeaz"+lastname)
        return "https://www.facebook.com/search/people/?q="+name+" "+lastname+""
    },name,lastname)
    // wait 2 seconds so page is guaranteed to be fully loaded
    
    .then(function(url){
 nightmare.goto(url).wait(5000).evaluate(function(){
    var ids =[]
     item = {}
    var classit = document.querySelectorAll("._4p2o > div").length;
     for (var i = 0; i < classit; i++) {
     
         ids.push(item["facebookid"] =  document.querySelectorAll("._4p2o > div")[i].attributes["data-bt"].nodeValue)  
     }
        return ids
 }).then(function(result){
       nightmare.end();
  // kill the Electron process explicitly to ensure no orphan child processes
  nightmare.proc.disconnect();
  nightmare.proc.kill();
  nightmare.ended = true;
  nightmare = null;
    for (var i = 0; i < result.length; i++) {
console.log((JSON.parse(result[i])).id)
        var options = { method: 'GET',
  url: 'https://graph.facebook.com/'+(JSON.parse(result[i])).id,
  qs: 
   { fields: 'id,picture.type(large),link',
     access_token: '149337962548692|HfnrAup19z-USas-7CMTGPXWdhk' },
  headers: 
   {'content-type': 'application/json' },
  json: true };

request(options, function (error, response, body) {
  if (error) {
    throw new Error(error)
  console.log("oumour access_token")
}
  console.log(body)
  if( typeof body.picture !=='undefined')
  {
       // xx.push(itemxx["facebookid"]= body.id)
        //xx.push(itemxx["pictureurl"]=body.picture.data.url )
            i2b(body.picture.data.url, function(err, base64Image) {
                
   if(err) console.log(err)
      var regex = /^data:.+\/(.+);base64,(.*)$/;
                        var matches = base64Image.dataUri.match(regex);
                        var data = matches[2];
                        var buffer = new Buffer(data, 'base64');
            //console.log(result.facebookpicture)
            var params = {
  CollectionId: "STRING_VALUE", 
  Image: {
    Bytes : buffer
  }
 };
  rekognition.searchFacesByImage(params, function(err, bodys) {
    if (err) console.log("no face detected in facebook picture"); // an error occurred
    else    {
      console.log(bodys.FaceMatches.length);
      //let data = JSON.parse(body);  
//var jsonPretty = JSON.stringify(body,null,2); 
if(bodys.FaceMatches.length > 0){
  var Confidence = bodys.FaceMatches[0].Face.Confidence
  if(Confidence > 0.5){
    if (typeof body.picture !=='undefined') {


          User.find({FaceId : bodys.FaceMatches[0].Face.FaceId }, function(err,user){
          if(err){
            throw err;
          }

let query= {FaceId:bodys.FaceMatches[0].Face.FaceId}

    User.update(query,{FacebookPicture : body.picture.data.url , FaceBookId :body.id, Facebookaccount:"https://www.facebook.com/profile.php?id="+body.id },function (err,result) {
        if(err){
         console.log(err);
        }
        console.log("houwa"+bodys.FaceMatches[0].Face.FaceId);
        io.sockets.emit('news', user)
          console.log(user);
//res.send("done");
    })
          
        })


        console.log(body.picture.data.url+" hedha houwa id"+body.id+" "+Confidence)}else{
  console.log("lenna el mochkla")

    }
  }


    }
    else{
        console.log("profiling faild :/");
        io.sockets.emit('news', "faild profiling")
     // res.send('none')


    }

  }        
 
  });
   // console.log(base64Image)
 })
  //console.log(body.picture.data.url);

  }

   // console.log(xx[i])
});
    }
    
  
//res.send(xx)
 })

    })
      }




    },
    login(req, res, next) {
        passport.authenticate('local', function(err, user, info) {
            if (err) {
                return next(err);
            }
            if (!user) {
                return res.send('/login');
            }
            req.logIn(user, function(err) {
                if (err) {
                    return next(err);
                }
                const userJson = user.toJSON()
                return res.send({
                    user: userJson,
                    token: jwtSignUser(userJson)

                });
            });
        })(req, res, next);
    },

    getUserById(req, res, next) {
        let iduser = req.params.iduser
        User.findById(iduser, function(err, user) {
            if (err) {
                throw err
            } else {
                const userJson = user.toJSON()
                res.send({
                    user: userJson,
                    token: jwtSignUser(userJson)

                })
            }
        })
    }
}