var mongoose=require('mongoose');
mongoose.Promise=global.Promise;
var mediaSchema=mongoose.Schema({
    path:{type: String},
})
var locationSchema=mongoose.Schema({
    address:{type: String},
    city:{type: String},
    latitude:{type: String},
    longitude:{type: String},
})
var EventSchema = mongoose.Schema({
    title: String,
    description: String,
    fee: Number,
    capacity: Number,
    startDate: Date,
    endDate: Date,
    typeEvent: {type:String , default :"opening"},
    visibilityEvent: {type:String , default :"public"},
    media:String,
    location:locationSchema,
    owner:{
    type: mongoose.Schema.Types.ObjectId, ref: 'User'
    },
    isStreaming: String,
    isVerified: String,
    ThemeEvent: String,


});

module.exports=mongoose.model("Event",EventSchema);