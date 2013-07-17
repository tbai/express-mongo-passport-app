var routes = require('./routes/routes'),
    db = require("./models/db");

// setup passport for simple login
var passport = require('passport')
  , LocalStrategy = require('passport-local').Strategy;

passport.use(new LocalStrategy( {
    usernameField: 'email',
    passwordField: 'password'
}, function(username, password, done) {
    db.User.findOne({ email: username }, function(err, user) {
        if (err) { return done(err); }
        if (!user || !user.verifyPassword(password)) {
            return done(null, false, {message:'Invalid username or password.',email:username});
        } else if (user.status == "created"){
            return done(null, false, {message:'User is not activated, check your email and click in the verification link.',email:username});
        }
        return done(null, user);
    });
}));

passport.serializeUser(function(user, done) {
  done(null, user._id);
});

passport.deserializeUser(function(id, done) {
  db.User.findById(id, function (err, user) {
    done(err, user);
  });
});

function isAuth(req, res, next) {
    var activateAuth = false;
    if (activateAuth){
        if (req.isAuthenticated()) { return next(); }
        req.session.requestedUrl = req.url;
        res.redirect('/login');
    } else {
        return next();
    }
}


exports.setup = function(app){    
 
    // pages
    app.get('/',                          isAuth, routes.public.index);
    app.get('/home',                      isAuth, routes.home.index);

    setupAuthRoutes(app);
}

function setupAuthRoutes(app){
    // ----------------------------------------------
    // security / authentication
    // ----------------------------------------------
    app.get('/login', routes.auth.loginForm);
    app.get('/logout', routes.auth.logout);

    app.post('/login', function(req, res, next) {
        passport.authenticate('local', function(err, user, info) {
            if (err) { return next(err) }
            if (!user) {
                req.flash('error', info.message);
                req.flash('email', info.email);
                return res.redirect('/login')
            }
            req.logIn(user, function(err) {
                if (err) { return next(err); }
                var url = req.session.requestedUrl ? req.session.requestedUrl : "/";
                req.session.requestedUrl = null;
                return res.redirect(url);
            });
        })(req, res, next);
    });

    // register new user
    app.get('/register', routes.auth.registerForm);
    app.post('/register', routes.auth.register);
    app.get('/activate/:token', routes.auth.activate);

    // recover password
    app.get('/recover', routes.auth.recoverForm);
    app.post('/recover', routes.auth.recover);
}