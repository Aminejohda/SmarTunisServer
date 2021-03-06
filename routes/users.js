var express = require('express');
var router = express.Router();
var request = require("request");
app = express()
var server = require('http').createServer(app)
var io = require('socket.io')(server);
server.listen(4400);
var User = require('../models/User')
let Product = require('../models/Product')
let Culture = require('../models/Culture')
var interrsttable = []
  

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
      var params = { method: 'POST',
  url: 'https://api.kairos.com/recognize',
  headers: 
   { 
     app_key: '50de11940366c58fe8eef7fab5f140c2',
     app_id: 'fd8e76e3',
     'content-type': 'application/json' },
  body: { image: base64Data, gallery_name: 'SmarTunis' },
  json: true };
   request(params, function (err, response, body) {
    if (err) {
        console.log(err, err.stack);
        res.send(err) 
    }
    // an error occurred
      //let data = JSON.parse(body);  

if(typeof body.images !=="undefined" && typeof body.images[0].candidates !=="undefined" && body.images[0].candidates.length > 0){
  console.log('d5al  '+body.images[0].candidates[0].face_id)
  var Confidence = body.images[0].candidates[0].confidence
  if(Confidence > 0.5){
     User.find({FaceId : body.images[0].candidates[0].face_id }, function(err,user){
          if(err){
            throw err;
          }
          console.log(user)
          if ( user.length > 0) {
          console.log(user[0].Interests)
          console.log("houwa "+body.images[0].candidates[0].face_id);
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
}else {
  console.log('no interrest')
      res.send('none')

}
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
