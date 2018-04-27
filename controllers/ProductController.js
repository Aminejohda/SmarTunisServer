let User = require('../models/User')
let Product = require('../models/Product')
var fs = require("fs-extra");
module.exports ={
create(req, res) {
	let category = req.body.Category
	let description = req.body.Description
	let nameimg = Date.now() + 'image.png';
	let price = req.body.Price
	let iduser = req.body.iduser
	console.log(iduser)
	let base64Image = req.body.img.split(';base64,').pop();
    var regex = /^data:.+\/(.+);base64,(.*)$/;
    var matches = req.body.img.match(regex);
    var data = matches[2];
var buffer = new Buffer(data, 'base64');
    fs.writeFile('public/images/media' + nameimg, base64Image, {
    	   encoding: 'base64'
    }, function(err) {
    
    User.findById(iduser, function(err, user) {
        if (err) {
            throw err
        } else {
        	let newUser = new User(user)
		let newProduct = new Product({
			Publisher : newUser,
		category:Category,
		Image:'http://localhost:3000/images/media/'+nameimg,
		Price:price,
		Description:description,
		isAccepted:false
	})
	newProduct.save(function (err) {
	if(err){
console.log(err)
return;
	}else{
		res.send({
		message : ` ${category} ${price}! ${description} `
				})
		}
		})

}
})


})

},
index(req, res) {
Product.find({ 'isAccepted': true },function (err,products) {
		if(err) {
			console.log(err)
		}else{
	res.send(products);
		}
	});
},


}
