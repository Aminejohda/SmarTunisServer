
var request = require('request');
var express = require('express');
var router = express.Router();

router.get('/:num/:message',function (req,res) {

    var numParam = req.params.num;
    var messageParam = req.params.message;

request('http://www.foudhaili.tn/apiSMS.php?num=216'+numParam+'&'+messageParam, function (error, response, body) {
    console.log('error:', error); // Print the error if one occurred
    console.log('statusCode:', response && response.statusCode); // Print the response status code if a response was received
    console.log('body:', body); // Print the HTML for the Google homepage.
});
});
module.exports = router;