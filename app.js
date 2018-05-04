var express = require('express'); 
var path = require('path'); 
var favicon = require('serve-favicon'); 
var logger = require('morgan'); 
var cookieParser = require('cookie-parser'); 
var bodyParser = require('body-parser'); 
var cors = require('cors') 
var index = require('./routes/index'); 
var users = require('./routes/users'); 
var project= require('./routes/Projects'); 
var culture= require('./routes/Cultures'); 
var ACulture= require('./routes/Admin/Cultures'); 
var Ausers= require('./routes/Admin/users'); 
var event= require('./routes/Events'); 
var opencv= require('./routes/users');
var facebookScraping = require('./routes/FacebookScraping'); 
var passport  = require('passport') 
var Authentification = require('./routes/Authentification'); 
var mongoose = require('mongoose'); 
const config = require('./config/database') 
var twitterScrapper = require('./data/twitterScraping/examples/oauth-app');
var scraper = require('./data/twitterCategorisation/scraper');
var Sms = require('./data/SMS/curlSMS');
var mailer = require('./data/Mailer/index'); 
mongoose.connect(config.database); 
const db = mongoose.connection; 
var app = express(); 
app.set('views', path.join(__dirname, 'views')); 
app.set('view engine', 'twig'); 
// view engine setup 
// uncomment after placing your favicon in /public 
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico'))); 
app.use(logger('dev')); 
app.use(bodyParser.json({limit: '50mb'})); 
app.use(bodyParser.urlencoded({limit: "50mb", extended: true, parameterLimit:50000})); 
 
app.use(cors()) 
app.use(cookieParser()); 
app.use(express.static(path.join(__dirname, 'public'))); 
app.use(passport.initialize()); 
app.use(passport.session()); 
require('./config/passport')(passport); 
 
app.use('/', index); 
app.use('/users', users); 
app.use('/Auth', Authentification); 
app.use('/project',project); 
app.use('/culture',culture); 
app.use('/event',event); 
app.use('/scraping',facebookScraping); 
app.use('/admin/culture',ACulture); 
app.use('/admin/users',Ausers); 
app.use('/apis',twitterScrapper);
app.use('/scrape',scraper);
app.use('/mailer',mailer);
app.use('/sms',Sms);
app.use('/opencv',opencv);
// catch 404 and forward to error handler
app.use(function(req, res, next) { 
  var err = new Error('Not Found'); 
  err.status = 404; 
  next(err); 
}); 
//database 
db.once('open', function() { 
    console.log('connected to db'); 
}) 
db.on('error', function(err) { 
    console.log(err); 
}) 
app.use(function(err, req, res, next) { 
  // set locals, only providing error in development 
  res.locals.message = err.message; 
  res.locals.error = req.app.get('env') === 'development' ? err : {}; 
 
  // render the error page 
  res.status(err.status || 500); 
  res.render('error'); 
}); 
 
module.exports = app; 