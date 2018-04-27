let User = require('../models/User')
let Culture = require('../models/Culture')
let Product = require('../models/Product')
var fs = require("fs-extra");
var i2b = require("imageurl-base64");
var request = require("request");
 	var xx=[]

var Nightmare = require('nightmare')
   
module.exports ={
create(req, res) {
	let title = req.body.title
	console.log("nejazk "+title);
		let description = req.body.description
		let nameimg = Date.now() + 'image.png';
		let theme = req.body.theme
		let location = req.body.location
		console.log(location)
		let iduser = req.body.iduser
		let moreinfo = req.body.moreinfo
		console.log(iduser)
		let base64Image = req.body.img.split(';base64,').pop();
    var regex = /^data:.+\/(.+);base64,(.*)$/;
    var matches = req.body.img.match(regex);
    var data = matches[2];
var buffer = new Buffer(data, 'base64');
    fs.writeFile('public/images/uploads/Cultureimg/' + nameimg, base64Image, {
    	   encoding: 'base64'
    }, function(err) {
    
    User.findById(iduser, function(err, user) {
        if (err) {
            throw err
        } else {
        	let newUser = new User(user)
		let newCulture = new Culture({
			Publisher : newUser,
		Title:title,
		Image:'http://localhost:3000/images/uploads/Cultureimg/'+nameimg,
		Theme:theme,
		Location:location,
		MoreInformation:moreinfo,
		Description:description,
		isAccepted:false
	})
	newCulture.save(function (err) {
	if(err){
console.log(err)
return;
	}else{
		res.send({
		message : `hello ${title} ${nameimg}! email ${description} and your password is ${location}`
				})
		}
		})

}
})


})

},
edit(req,res){
let query= {_id:req.body.spotId}

 let title = req.body.title
	console.log("nejazk "+title);
		let description = req.body.description
		let nameimg = Date.now() + 'image.png';
		let theme = req.body.theme
		let location = req.body.location
		console.log(location)
		let iduser = req.body.iduser
		let moreinfo = req.body.moreinfo
		console.log(iduser)
		let base64Image = req.body.img.split(';base64,').pop();
    var regex = /^data:.+\/(.+);base64,(.*)$/;
    var matches = req.body.img.match(regex);
    var data = matches[2];
var buffer = new Buffer(data, 'base64');
    fs.writeFile('public/images/uploads/Cultureimg/' + nameimg, base64Image, {
    	   encoding: 'base64'
    }, function(err) {


let newCulture ={
		Title:title,
		Image:'http://localhost:3000/images/uploads/Cultureimg/'+nameimg,
		Theme:theme,
		Location:location,
		MoreInformation:moreinfo,
		Description:description,
		isAccepted:false
	}



Culture.update(query,newCulture,function (err) {
	if(err){
console.log(err)
	}else{
		res.send({
		message : `hello ${title} ${nameimg}! email ${description} and your password is ${location}`
				})
	}
	// body...
})
})
//console.log(req.body.title)	// body...
},

index(req, res) {
Culture.find({ 'isAccepted': true },function (err,cultures) {
		if(err) {
			console.log(err)
		}else{
	res.send(cultures);
		}
	});
},
myspaces(req, res) {
const iduser = req.params.iduser
console.log(iduser)
Culture.find({ 'Publisher': iduser },function (err,cultures) {
		if(err) {
			console.log(err)
		}else{
	res.send(cultures);
		}
	});
},
show(req, res) {
const spaceId = req.params.spaceId
const userId = req.params.userId
console.log(spaceId)
var viewsnbr
var theme= null
Culture.findById(spaceId,function (err,cultures) {
		if(err) {
			console.log(err)
		}else{
				viewsnbr = parseInt(cultures.ViewsNumber) + 1
				theme = cultures.Theme
			let newCulture ={
		ViewsNumber:viewsnbr
	}
			Culture.update({_id:spaceId},newCulture,function (err) {
	if(err){
console.log(err)
	}else{
		console.log(theme)
		console.log(userId)
		User.find({ Interests : theme , _id : userId},function (err,users) {
			if (err) console.log(err)
				if(users.length > 0){
					console.log(users)
					console.log('mawjoud')
					res.send(cultures);
				}
				if(users.length == 0){
					console.log('mahouch mawjoud')

						User.update({_id:userId},{ $push: { Interests: theme } },function(err){
			if (err) console.log(err)
			res.send(cultures);
		})
				}
		})
	

		
	}
})
	
		}
	});
},
delete(req,res) {
	// body...
let query= {_id:req.params.spaceId}
Culture.remove(query, function (err) {
	if(err){
console.log(err)
	}
	res.send('Success')
	// body...
})
},
mostviewd(req,res){
Culture.find({ 'isAccepted': true }, null, { skip:0,
    limit:5,
    sort: {ViewsNumber: -1}}, function(err, docs) { res.send(docs)});
},
countcategories(req,res){
Culture.aggregate([
        {
            $group: {
                _id: '$Theme',  
                count: {$sum: 1}
            }
        }
    ], function (err, result) {
        if (err) {
            next(err);
        } else {
            res.json(result);
        }
    });
},
showByCategorie(req ,res){
const categorie = req.params.categorie
console.log(categorie)
Culture.find({ 'Theme': categorie },function (err,cultures) {
		if(err) {
			console.log(err)
		}else{
	res.send(cultures);
		}
	});
},
linkii(req, res){
	const name =req.body.name
	const lastname =req.body.lastname
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
     item = {}
    var classit = document.getElementsByClassName("search-result__image-wrapper").length;
     for (var i = 0; i < classit; i++) {
     
         ids.push(item["linkedinurl"] =  "https://www.linkedin.com"+document.getElementsByClassName("search-result__image-wrapper")[i].children[0].attributes[2].nodeValue)  
     }
        return ids
			 })
    	.then(function(result){
			 	 nightmare.end();
			  // kill the Electron process explicitly to ensure no orphan child processes
			  nightmare.proc.disconnect();
			  nightmare.proc.kill();
			  nightmare.ended = true;
			  nightmare = null;
			  for (var i = 0; i < result.length; i++) {
console.log(result[i])
			  }
			res.send(result)
			 })


    }).catch(function(err){
    console.log(err);
  });
 }
  //res.send("lenna")
        // print each gig to the console in a neat format
,facii(req, res){
	 var nightmare = Nightmare({
        show: false
    })
	console.log("lenna")
	        nightmare.goto('https://www.facebook.com/')
    .wait(8000).type('#email', '25@hotmail.fr').type('#pass', 's#####6')
  .click('.uiButtonConfirm input').wait(8000)
 .evaluate(function(){
        return "https://www.facebook.com/search/people/?q="+"mohamed amine"+" "+"mhiri"
    })
    // wait 2 seconds so page is guaranteed to be fully loaded
    
    .then(function(url){
 nightmare.goto(url).wait(8000).evaluate(function(){
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
 
 	}
 	
 
res.send(result)
 })

    })
 
},
getproductinterrest(req, res){
User.findOne({ '_id': '5ad8b4d88f02ca1cf0900679' },function (err,users) {
		if(err) {
			console.log(err)
			res.send(err)
		}else{
			console.log(users.Interests)
			Product.find({ Category: { "$in" : users.Interests} },function (err,products) {
				console.log(products)
				res.send(products);
				})
		}
	});
},
saveproduct(req,res){
	
var newProduct = new Product({
		Category:"none",
	Description:"Nike chaussette",
	Price:	158
 
});
	newProduct.save(function (err) {
	if(err){
console.log(err)
	}else{
		res.send(newProduct)
		}
		})
},
 guezguez(req, res) {
      var nightmare = Nightmare({
        show: true
    })
    nightmare.goto('https://www.voyagespirates.fr/sejours')
    .wait(3000)
    .evaluate(function(){

    var ids =[]
    var nbrarticle = document.querySelectorAll(".post-preview--default").length;
     for (var i = 0; i < nbrarticle; i++) {
     item = {}

          item["articleTitle"] =    document.querySelectorAll(".REFCSS  .post-preview.post-preview--default h2 a")[i].innerText
         // item["articleImage"] =    
          item["articleDescription"] =    document.querySelectorAll(".REFCSS .post-preview.post-preview--default>p")[i].innerText
          item["articleLink"] =    document.querySelectorAll(".REFCSS  .post-preview.post-preview--default h2 a")[i].href
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
        res.json(result)
    })

}
}
