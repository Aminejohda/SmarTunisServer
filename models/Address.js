const mongoose = require('mongoose');
let AddressSchema = mongoose.Schema({
	
	Street:{
		type:String
	},
	City:{
		type:String
	},
	Region:{
		type:String
	},
	Country:{
		type:String
	},
	Lat:{
		type:String
	},
	Lng:{
		type:String
	},	
	PostalCode:{
		type:String
	}
});
const Address = module.exports =  mongoose.model('Address',AddressSchema)