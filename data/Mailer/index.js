var nodemailer = require('nodemailer');
process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";
var express = require('express');
var router = express.Router();
router.get('/:mail/:message',function (req,res) {

    var mailParam = req.params.mail;
    var messageParam = req.params.message;

    var transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'citysmart45@gmail.com',
    pass: 'smartcitizen'
  }
});

var mailOptions = {
  from: 'rhouma10foudhaili@gmail.com',
  to: mailParam,
  subject: 'Sending Email From SmartCity Platform',
  text: messageParam,
};

transporter.sendMail(mailOptions, function(error, info){
  if (error) {
    console.log(error);
  } else {
    console.log('Email sent: ' + info.response);
  }
});
});
module.exports = router;