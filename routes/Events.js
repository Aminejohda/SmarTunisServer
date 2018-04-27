var express = require('express');
var router = express.Router();
var Event = require('../models/Event');
var multer  = require('multer');
const path = require('path');
const storage = multer.diskStorage({
    destination: './public/images/media/',
    filename: function(req, file, cb){
        cb(null,file.originalname + '-' + Date.now().toString() + path.extname(file.originalname));
    }
});
const fileFilter = (req, file, cb) => {
    // reject a file
    if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png') {
        cb(null, true);
    } else {
        cb(null, false);
    }
};
var upload = multer({
    storage: storage,
    limits: {
        fileSize: 1024 * 1024 * 5
    },
    fileFilter: fileFilter
});
router.post('/eventMedia/',upload.single('media'),function (req,res) {

    console.log(req.file);
    var event= new Event(req.body);
    event.media.path=req.file.filename;
    event.save().then((event)=>{
        console.log(event);
    res.send(event);


});
});

router.post('/',upload.single('media'), function (req, res) {

    var event = new Event(req.body/*{
        title: req.body.title ,
        description: req.body.description ,
        fee: req.body.fee ,
        capactiy: req.body.capacity ,
        startDate: req.body.startDate ,
        endDate: req.body.endDate ,
        typeEvent: req.body.typeEvent ,
        visibility: req.body.visibility ,
    }*/);
    //event.location.address="test";

    event.media=req.file.filename;


    event.save(function (err, result) {
        if (err) {
            res.send(err);
        }
    else {
        res.json({ message: "succesfully added event" })
    }
        })

});

router.get('/',function (req,res) {
    Event.find({},function (err,result) {
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

router.get('/myEvents/:id',function (req,res) {
    const id = req.params.id
    console.log(id)

    Event.find({'owner': id},function (err,result) {
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

router.get('/get/:id',function (req,res) {
    var id=req.params.id;

    Event.find({'_id' : id},function (err,result) {
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
router.put('/edit/:id',function (req,res) {
    var id=req.params.id;
    var newevent = new Event({
        title: req.body.title ,
        description: req.body.description ,
        fee: req.body.fee ,
        capactiy: req.body.capacity ,

    });

    Event.findOneAndUpdate({'/get/_id' : id},{$set:{'title':newevent.title}},function (err,result) {
        if(err){
            res.send(err);
        }

        //   res.json({message : "succesfully updated"})
        res.send(result);


    })

});
router.delete('/:id',function (req,res) {
    var id=req.params.id;
    Event.findOneAndRemove({'_id' : id},function (err,result) {
        if(err){
            res.send(err);
        }
        res.json({message : "succesfully deleted"})



    })

})
module.exports=router;
