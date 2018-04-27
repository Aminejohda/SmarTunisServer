var mongoose=require('mongoose');
mongoose.Promise=global.Promise;
var User=require('../models/User');
var addressSchema=mongoose.Schema({
    latitude:{type: String},
    longitude:{type: String},
    Street : {type: String}

})
var ProjectSchema = mongoose.Schema({
    title: String,
    description: String,
    projectImage: { type: String, required: true },
    state : {type:String , default :"waiting"},
    location:addressSchema,
    theme: String,	
	Publisher:{
		type: mongoose.Schema.Types.ObjectId, ref: 'User'
    },
    publishDate:{type: Date,default:Date.now()},
    facebook: String,
    twitter: String,
    linkedin: String,
    website: String,
    fase: String,
	Views:{
		type : Number, default : 0
	}


});

module.exports=mongoose.model("Project",ProjectSchema);