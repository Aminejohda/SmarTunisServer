var fs = require('fs');
var express = require('express');
var router = express.Router();

// read file from current directory
router.get('/twitterInterests/:id',function (req,res) {
    var idUser = req.params.id;

    var file = "./data/TwitterData/"+idUser+".json";
    var categories=require("../categories.json");

// read file from current directory
fs.readFile(file, 'utf8', function (err, data) {

    if (err) throw err;


    var wordsArray = splitByWords(data);
    var wordsMap = createWordMap(wordsArray);
    var finalWordsArray = sortByCount(wordsMap);

    console.log(finalWordsArray);

    //console.log('The interest ' + finalWordsArray[0].name + ' appears the most in the file ' +
     //   finalWordsArray[0].total + ' times');

    /*
      output:
      [ { name: 'he', total: 10 },
        { name: 'again', total: 7 },
        { name: 'away', total: 7 },
        ... ]
      The word "he" appears the most in the file 10 times
    */

});


function splitByWords (text) {
    // split string by spaces (including spaces, tabs, and newlines)
    var wordsArray = JSON.stringify(text);


    return wordsArray;
}

function getCountWord(chaineDeCaractere,motRecherche) {
    var count = 0;
    var pos = chaineDeCaractere.indexOf(motRecherche);
    while(pos > -1){
        ++count;
        pos = chaineDeCaractere.indexOf(motRecherche, ++pos);
    }
    return count;
}

function createWordMap (wordsArray) {

    // create map for word counts
    var wordsMap = {};
    /*
      wordsMap = {
        'Oh': 2,
        'Feelin': 1,
        ...
      }
    */
    //console.log(categories);

/*
    wordsArray.forEach(function (key) {

        if (categories.informatique.indexOf(key) !== -1){
            console.log(key);

            if (wordsMap.hasOwnProperty(key)) {
                wordsMap[key]++;
            } else {
                wordsMap[key] = 1;
            }

        }
        else
            wordsMap[key] = 0;
    });
*/
    var objList=[];
    var obj = {};
    Object.keys(categories).forEach(function(key) {
        var countCategorie=0;
        categories[key].forEach(el=>{
            countCategorie+=getCountWord(wordsArray,el);

    })
        //console.log(key);
        obj[key] = countCategorie;


    })

    objList.push(obj);
    //console.log(obj);
    console.log(objList);
    res.json(objList);


    return wordsMap;

}


function sortByCount (wordsMap) {

    // sort by count in descending order
    var finalWordsArray = [];
    finalWordsArray = Object.keys(wordsMap).map(function(key) {
        return {
            name: key,
            total: wordsMap[key]
        };
    });

    finalWordsArray.sort(function(a, b) {
        return b.total - a.total;
    });

    return finalWordsArray;

}
});
module.exports = router;