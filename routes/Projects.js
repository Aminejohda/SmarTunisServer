var express = require('express');
var router = express.Router();
var Project=require('../models/Project');
var multer  = require('multer');
const path = require('path');
const storage = multer.diskStorage({
  destination: './public/images/project/',
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
router.post('/',upload.single('projectImage'),function (req,res) {
    console.log(req.file);
    var project= new Project(req.body);
    project.projectImage=req.file.filename;
    //project.location=req.body.location
    project.save().then((project)=>{
        console.log(project);
        res.send(project);
    },
        (e)=>{res.send(e);}
    )});
router.get('/',function (req,res) {
    Project.find({ }).sort({ publishDate: -1 }).
        then(function (err,result) {
            if(err){
                        res.send(err);
                    }
                    if(!result){
                        res.status(404).send();

                    }else{
                        res.json(result);
                    }
        });
    /*Project.find({},function (err,result) {
        if(err){
            res.send(err);
        }
        if(!result){
            res.status(404).send();

        }else{
            res.json(result);
        }

    });*/

})
router.delete('/:id',function (req,res) {
    var id=req.params.id;
    Project.findOneAndRemove({'_id' : id},function (err,result) {
        if(err){
            res.send(err);
        }
        res.json({message : "succesfully deleted"})



    })

})
router.put('/:id',function (req,res) {
    var id = req.params.id;
    var text = req.body.text;
    Project.findOneAndUpdate({'_id' : id},req.body,function (err,result) {
        if(err){
            res.send(err);
        }
        console.log(result);
       res.send(result);

    })

})
router.get('/:id',function (req,res) {
    var id=req.params.id;
        Project.find({'_id' : id}).populate('Publisher').exec(function (err,result) {
        //Project.find({'_id' : id},function (err,result) {
            if(err){
                res.send(err);
            }
            if(!result){
                res.status(404).send();

            }else{
                //console.log(result[0].title);
                Project.updateOne({'_id' : id},{ $inc: { Views: 1 } },function (err,result) {
                })
                res.json(result);
            }

        });
})
router.get('/myProjects/:Publisher',function (req,res) {
    var Publisher=req.params.Publisher;
        Project.find({'Publisher' : Publisher},function (err,result) {
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
router.get('/count/theme',function (req,res) {
         Project.aggregate([
        { $group: { _id:"$theme", nbr: { $sum: 1 }}},
        ]).
        then(function (err,result) {
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
router.get('/count/month',function (req,res) {
    /**
     * Project.aggregate([{$group:{_id:{theme :"$theme",
                    publishDate :"$year"}, nbr:{$sum:1}}}])

     */
         //Project.aggregate([{ $project:{ _id: 0, year:{$month:"$publishDate"}}}]).
                    Project.aggregate([
                { $group: {'_id': {
                               // 'theme':'$theme',
                                'year': { '$year': "$publishDate" },
                                'month': { '$month': "$publishDate" },
                                //'day': { '$dayOfMonth': "$publishDate" }
                            },
                             nbr: { $sum: 1 }}},
                
            ]).sort({  publishDate: -1 }).
        then(function (err,result) {
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
router.get('/lastProjects/byDate',function (req,res) {
    Project.find({ }).limit(2).  sort({ publishDate: -1 }).
        then(function (err,result) {
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
router.get('/projectsByTheme/:theme',function (req,res) {
    var theme=req.params.theme;
        Project.find({'theme' : theme},function (err,result) {
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
router.get('/ads/:theme',function (req,res) {
    var theme=req.params.theme;
    Project.find({'theme' : theme }).limit(1).  sort({ publishDate: -1 }).
        then(function (err,result) {
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
router.get('/top/mostViewed',function (req,res) {
    Project.find({ }).limit(3).  sort({ Views: -1 }).
        then(function (err,result) {
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

    
    
    
module.exports=router;
