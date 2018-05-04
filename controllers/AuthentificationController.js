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
                   
                    



var options = { method: 'POST',
  url: 'https://api.kairos.com/detect',
  headers: 
   { 
     app_key: '50de11940366c58fe8eef7fab5f140c2',
     app_id: 'fd8e76e3',
     'content-type': 'application/json' },
  body: { image: base64Image, selector: 'ROLL' },
  json: true };

request(options, function (error, response, body) {
console.log('response')
if (typeof body.images !== "undefined") {
  if(body.images[0].faces.length >  1){
console.log("many faces detected")
  res.send('many faces detected')
  }else {
    console.log(body.images[0].faces.length)
var optionss = { method: 'POST',
  url: 'https://api.kairos.com/enroll',
  headers: 
   { 
     app_key: '50de11940366c58fe8eef7fab5f140c2',
     app_id: 'fd8e76e3',
     'content-type': 'application/json' },
  body: 
   { image: base64Image,
     subject_id: nameimg,
     gallery_name: 'SmarTunis' },
  json: true };
  request(optionss, function (error, response, body) {
  if (error) throw new Error(error);
console.log(body.face_id)
let newUser = new User({
     FirstName: name,
     Email: email,
     LastName: lastname,
     Password: password,
     Picture: nameimg,
     Role :"User",
     FaceId: body.face_id
 })
 newUser.Password = hash;


 newUser.save(function(err) {
     if (err) throw err;
     console.log("c bon")
     res.send("done")
 });
});
  }
}
 if (typeof body.Errors !== "undefined"){
console.log("no face detected")
  res.send('no face detected')
}
});


                })
            })
        })













console.log("lenna")
            nightmare.goto('https://www.facebook.com/')
    .wait(3000).type('#email', 'hamma1925@hotmail.fr').type('#pass', 'slipknot666')
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
                
     
            //console.log(result.facebookpicture)

            var params = { method: 'POST',
  url: 'https://api.kairos.com/recognize',
  headers: 
   { 
     app_key: '50de11940366c58fe8eef7fab5f140c2',
     app_id: 'fd8e76e3',
     'content-type': 'application/json' },
  body: { image: body.picture.data.url, gallery_name: 'SmarTunis' },
  json: true };

  request(params, function (error, response, bodys) {
    if (error) console.log("no face detected in facebook picture"); // an error occurred
    else    {
     // console.log(bodys.images[0].message);
      //let data = JSON.parse(body);  
//var jsonPretty = JSON.stringify(body,null,2); 
if(typeof bodys.images !=='undefined'){
if(typeof bodys.images[0].candidates !=='undefined'){
  var Confidence = bodys.images[0].candidates[0].confidence
  if(Confidence > 0.5){

          User.find({FaceId : bodys.images[0].candidates[0].face_id }, function(err,user){
          if(err){
            throw err;
          }

let query= {FaceId:bodys.images[0].candidates[0].face_id}

    User.update(query,{FacebookPicture : body.picture.data.url , FaceBookId :body.id, Facebookaccount:"https://www.facebook.com/profile.php?id="+body.id },function (err,result) {
        if(err){
         console.log(err);
        }
        console.log("houwa"+bodys.images[0].candidates[0].face_id);
        io.sockets.emit('news', user)
          console.log(user);
//res.send("done");
    })
          
        })


        console.log(body.picture.data.url+" hedha houwa id"+body.id+" "+Confidence)

  }


    }
    else{
        console.log("profiling faild :/");
        io.sockets.emit('news', "faild profiling")
     // res.send('none')


    }
    }else{
      console.log('7keya fer8a')
    }

  }        
 
  });
   // console.log(base64Image)
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