var express = require('express');
var router = express.Router();
var scrape =require('../data/facebookScraping/lib/mark');
var categories=require("../data/categories.json");
function getCountWord(chaineDeCaractere,motRecherche) {
    var count = 0;
    var pos = chaineDeCaractere.indexOf(motRecherche);
    while(pos > -1){
        ++count;
        pos = chaineDeCaractere.indexOf(motRecherche, ++pos);
    }
    return count;
}
router.get('/:fbAccount',function (req,res) {
    var fbAccount=req.params.fbAccount;
    scrape.facebook("https://facebook.com/"+fbAccount,function (data) {
        if(JSON.stringify(data)=="404"){
            /*res.status(404);
            res.json(404);*/
            //res.status(400).send('Something broke!');
            res.json({
                "Technology": 0,
                "Music": 0,
                "Education": 0,
                "Fashion": 0,
                "Sport": 0,
                "Energy": 0,
                "Living": 0
            })

        }else {
            var a =JSON.stringify(data);
            var existance =a.indexOf('Oxfield');
            var count = 0;
            var pos = a.indexOf("Education");
            while(pos > -1){
                ++count;
                pos = a.indexOf("Education", ++pos);
            }
            //res.json(getCountWord(a,"Education"));
            var objList=[];
            var obj = {};
            Object.keys(categories).forEach(function(key) {
                var countCategorie=0;
                // console.log('Key : ' + keyw + ', Value : ' + categories[keyw].length)
                categories[key].forEach(el=>{
                    countCategorie+=getCountWord(a,el);
                })
                console.log(key);
                obj[key] = countCategorie;
            })
            objList.push(obj);
            console.log(obj);
            res.json(obj);

        }

    })
})
module.exports=router;
