var express = require('express');
var router = express.Router();
var Product=require('../models/Product');
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
router.post('/create',upload.single('Image'),function (req,res) {
    console.log(req.file);
    var product= new Product(req.body);
    //product.Image=req.file.filename;
    product.save().then((product)=>{
        console.log(product);
        res.send(product);
    },
        (e)=>{res.send(e);}
    )});

router.get('/',function (req,res) {
    Product.find({},function (err,result) {
        if(err){
            res.send(err);
        }
        if(!result){
            res.status(404).send();

        }else{
            res.json(result);
            res.send(result);
        }

    });

})
module.exports=router;