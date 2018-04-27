let User = require('../../models/User')
var fs = require("fs-extra");
var Nightmare = require('nightmare')
module.exports ={
index(req, res) {
User.find({Role :"User"},function (err,users) {
    if(err) {
      console.log(err)
    }else{
  res.send(users);
    }
  });
},
bannaccept(req,res){
let query= req.params.userid
User.findById(query, function (err, user) {
  if (err) return handleError(err);
  if(user.IsActive){
  	user.IsActive = false
  }else{
  	user.IsActive = true
  }
  user.save(function (err, updateduser) {
    if (err) return handleError(err);
    res.send(updateduser);
  });
});
},
linkii(req, res){
  const name =req.params.name
  const lastname =req.params.lastname
  const iduser =req.params.iduser
  var nightmare = Nightmare({
        show: true
    })
  console.log("lenna")
         nightmare.goto('https://www.linkedin.com/')
    .wait(3000).type('#login-email', 'Smartunis.noreply@gmail.com').type('#login-password', 'SmarTunis2018')
  .click('#login-submit').wait(25000)
     .evaluate((name, lastname) => {
        return "https://www.linkedin.com/search/results/index/?keywords="+name+" "+lastname+"&origin=GLOBAL_SEARCH_HEADER"
    
  }, name, lastname)

    
    .then(function(url){
      nightmare.goto(url).wait(20000)
      .evaluate(function(){
        var ids =[]
     
    var classit = document.getElementsByClassName("search-result__image-wrapper").length;
     for (var i = 0; i < classit; i++) {
     item = {}
         item["linkedinurl"] =  "https://www.linkedin.com"+document.getElementsByClassName("search-result__image-wrapper")[i].children[0].attributes[2].nodeValue  
         //item["linkedinimg"] =  document.querySelectorAll(".search-result__image > .lazy-image")[i].currentSrc  
      ids.push(item)
     }
        return ids
       })
      .then(function(result){
        console.log("result")
        console.log(result)
         nightmare.end();
        nightmare.proc.disconnect();
        nightmare.proc.kill();
        nightmare.ended = true;
        nightmare = null;
       User.findById(iduser, function (err, user) {
  if (err) return handleError(err);
  console.log("ttt")
  if(user.Linkedinaccount.length <1){
    for (var i = 0; i < result.length; i++) {
  console.log(result[i].linkedinurl)

      user.Linkedinaccount.push(result[i].linkedinurl)
    }
  //console.log("tttw")

    console.log(user.Linkedinaccount)
    }
  user.save(function (err, updateduser) {
    if (err) return handleError(err);
    res.send(updateduser);
  });
});
       })


    }).catch(function(err){
    console.log(err);
  });
 }
}
