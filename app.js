
/**
 * Module dependencies.
 */ 
var express = require('express')
  , http = require('http')
  , less = require('less-middleware')
  , path = require('path')
  , util = require("util")
  , flash = require('connect-flash')
  , passport = require("passport")
  , urlMappings = require("./urlMappings")
  , config = require("./config");

// connect to Mongo when the app initializes
var mongoose = require('mongoose')
mongoose.connect(config.MONGODB_CONNECTION_STR);
 
var app = express();

// all environments
app.set('port', config.SERVER_PORT);
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.bodyParser());
app.use(express.methodOverride());
app.use(express.cookieParser('your secret here'));
app.use(express.session());
app.use(flash());
app.use(passport.initialize());
app.use(passport.session());


app.use(function(req, res, next){  
  res.locals.appTitle = config.appTitle;
  next();
});

app.use(app.router);

// Bootstrap and less
var bootstrapPath = path.join(__dirname, 'node_modules', 'bootstrap');
app.use(less({
      src     : path.join(__dirname, 'assets', 'less')
    , paths   : [path.join(bootstrapPath, 'less')]
    , dest    : path.join(__dirname, 'public', 'stylesheets')
    , prefix  : '/stylesheets'
    , debug   : true
    , force   : true
  }));
app.use('/img', express['static'](path.join(bootstrapPath, 'img')));
app.use('/javascripts/lib', express['static'](path.join(bootstrapPath, '/docs/assets/js')));
app.use(express['static'](path.join(__dirname, 'public')));


// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}

// Routes
urlMappings.setup(app);

try{
  http.createServer(app).listen(app.get('port'), function(){
    console.log('Express server listening on port ' + app.get('port'));
  });
} catch (e){
  console.log(e);
}