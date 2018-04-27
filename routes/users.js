var express = require('express');
var router = express.Router();

app = express()
var server = require('http').createServer(app)
var io = require('socket.io')(server);
server.listen(4400);
var User = require('../models/User')
let Product = require('../models/Product')
let Culture = require('../models/Culture')
var AWS = require('aws-sdk');
var interrsttable = []
  var credentials = { accessKeyId:"AKIAI4MCDCWTFC63MBDQ",
                      secretAccessKey : "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"};
    AWS.config.credentials = credentials;
    AWS.config.region = 'us-west-2';
    var rekognition = new AWS.Rekognition({region: AWS.config.region});
router.get('/:id',function (req,res) {
    var id=req.params.id;
        User.find({'_id' : id},function (err,result) {
            if(err){
                res.send(err);
            }
            if(!result){
                res.status(404).send();

            }else{
                res.json(result);
            }

        });
})
router.put('/:id',function (req,res) {
    var id = req.params.id;
    User.findOneAndUpdate({'_id' : id},req.body,function (err,result) {
        if(err){
            res.send(err);
        }
        console.log(result);
       res.send(result);

    })

})

/* GET users listing. */
router.post('/', function(req, res) {
    var base64Data = req.body.img.replace(/^data:image\/png;base64,/, "");
    var nameimg = Date.now()+'image.png';
var buffer = Buffer.from(base64Data, 'base64');
require("fs").writeFile('public/images/uploads/billboard/'+nameimg, base64Data, 'base64', function(err) {
    if (err) {
        console.log(err)
        res.send(err)
    }
    var params = {
  CollectionId: "STRING_VALUE", 
  Image: {
    Bytes : buffer
  }
 };
 rekognition.searchFacesByImage(params, function(err, body) {
    if (err) {
        console.log(err, err.stack);
        res.send(err) 
    }
    // an error occurred
      console.log(body.FaceMatches.length);
      //let data = JSON.parse(body);  

if(body.FaceMatches.length > 0){
  var Confidence = body.FaceMatches[0].Face.Confidence
  if(Confidence > 0.5){
     User.find({FaceId : body.FaceMatches[0].Face.FaceId }, function(err,user){
          if(err){
            throw err;
          }
          console.log(user[0].Interests)
          console.log("houwa"+body.FaceMatches[0].Face.FaceId);
            //onsole.log(user.Interests)
            Product.find({ Category: { "$in" : user[0].Interests} }).
  populate('Publisher').
  exec(function (err,products) {
    Culture.find({ Theme: { "$in" : user[0].Interests} }).
  populate('Publisher').
  exec(function (err,culture) {
    for (var i = 0; i < culture.length; i++) {
      products.push(culture[i])
    }
                console.log(products)
                io.sockets.emit('news', products)
                res.send(products);
                })
                })
          //console.log(user);
          //res.send(user);
        })
  }


    }
    else{
      res.send('none')


    }

 
  });
 
});

});

module.exports = router;
