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
let CultureSchema = mongoose.Schema({
	Title:{
		type:String
	},	
	Description:{
		type:String
	},	
	Image:{
		type:String
	},	
	Theme:{
		type:String
	},	
	Publisher:{
		type: mongoose.Schema.Types.ObjectId, ref: 'User'
	},	
	Location:{
		type : AddressSchema
	},	
	MoreInformation:{
		type:String
	},
	isAccepted:{
		type : Boolean
	},
	ViewsNumber:{
		type : Number, default : 0
	}
});
const Culture = module.exports =  mongoose.model('Culture',CultureSchema)