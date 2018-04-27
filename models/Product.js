const mongoose = require('mongoose');

let ProductSchema = mongoose.Schema({
	Category:{
		type:String
	},
	Description:{
		type:String
	},	
	Image:{
		type:String
	},
	Price:{
		type:String
	},	
	Publisher:{
		type: mongoose.Schema.Types.ObjectId, ref: 'User'
	},
	isAccepted:{
		type : Boolean
	}
});
const Product = module.exports =  mongoose.model('Product',ProductSchema)