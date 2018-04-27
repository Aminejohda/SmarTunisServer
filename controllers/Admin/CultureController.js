let User = require('../../models/User')
let Culture = require('../../models/Culture')
var fs = require("fs-extra");
module.exports ={
edit(req,res){
let query= req.params.spotId
Culture.findById(query, function (err, culture) {
  if (err) return handleError(err);

  culture.isAccepted = true;
  culture.save(function (err, updatedculture) {
    if (err) return handleError(err);
    res.send(updatedculture);
  });
});
},

index(req, res) {
	Culture.
  find({}).
  populate('Publisher').
  exec(function (err, story) {
    if (err) return handleError(err);
    console.log('The author is %s', story);
    res.send(story)
    // prints "The author is Ian Fleming"
  });
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

}
