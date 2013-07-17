var db = require("../models/db")
    ,url = require("url")
    ,passport = require("passport")
    ,crypto = require("crypto")
    ,nodemailer = require("nodemailer")
    ,ejs = require("ejs")
    ,path = require("path")
    ,fs = require("fs")
    ,config = require("../config")
    ,mongoose = require('mongoose');

var nodeMailerTransport = nodemailer.createTransport("Sendmail", "/usr/sbin/sendmail");


function loadTemplate(template){
    var templatePath = path.resolve(__dirname,"../views/auth/"+template+".ejs");
    var html = fs.readFileSync(templatePath,'utf8');
    return html;
}

function createLink(req, path){
    var port = req.app.settings.port,
        host = req.host;
    if (port != 80){
        host+=":" + port;
    }

    return req.protocol + "://" + host + path;
}

/* Login */
exports.loginForm = function(req, res){   
    var locals = { template: 'loginForm' };
    var error = req.flash("error");
    if (error && error != ""){
        locals.formError = {"email":error};
        locals.formAttributes = {"email":req.flash("email")};
    }
    res.render('auth/auth', locals);
};
exports.logout = function(req, res) {
  req.logout();
  res.redirect('/');
};

/* User registration */
exports.registerForm = function(req, res){    
    res.render('auth/auth', { template: 'registerForm' });
};

exports.register = function(req, res){ // POST
    console.log("register " + req.params);

    new db.User({
         email:req.param("email")
        ,password: req.param("password")
        ,status:"created"
        ,registerToken: crypto.randomBytes(16).toString("hex")
    }).save(function(err, user){
        if (err){            
            var errorMessage = "Internal server error."
            if (err.code == 11000){
                errorMessage = "User already exists. Forgot your password?"
            } else {
                console.error(err);
            }
            res.render('auth/auth', { template: 'registerForm', 
                formAttributes:{email:req.param("email")}, 
                formError:{"email":errorMessage} });  
        }

        // send email with activation token
        var emailLocals = {
            appTitle:config.appTitle, email:user.email, 
            activationLink:createLink(req, "/activate/" + user.registerToken)
        };
        
        var mailOptions = {
            from: config.emailDefaultFrom
            ,to: user.email
            ,subject: 'Activate your ' + config.appTitle + ' user'
            ,text: ejs.render(loadTemplate("_registerEmail"), emailLocals)
        };

        console.info("Sending activation email, link: "+emailLocals.activationLink);

        nodeMailerTransport.sendMail(mailOptions, function(err, response){
            if(err){
                console.error(err);
            }else{
                console.log("Message sent: " + response.message);
            }
        });

        res.render("auth/auth", {
            template:"message", 
            error:{
                title:"Account created!",
                message:"Your account must be activated before you can login. Check your email and click in the activation link."
            }
        });
    });
}


exports.activate = function(req, res){
    console.log("activate " + req.param("token"));
    var token = req.param("token");
    db.User.findOneAndUpdate(
         {registerToken:token,status:"created"} // query
        ,{$set:{status:"active",registerToken:null}}
        ,function(err, user){            
            if(err){
                console.error(err);
                res.render("auth/auth", {
                    template:"message", 
                    error:{
                        title:"Activation error",
                        message:"Activation url is no longer valid."
                    }
                });
            } else {
                // login and redirect to home
                req.logIn(user, function(loginError){
                    if(loginError){
                        console.error(loginError);
                        res.redirect("/login");
                    } else {
                        req.session.firstlogin = true;
                        res.redirect("/");
                    }
                });
            }
        }
    );
}


/* Recover password */
exports.recoverForm = function(req, res){    
    res.render('auth/auth', { template: 'recoverForm'});
};

exports.recover = function(req, res){
    // check if user exists
    db.User.findOne({email:req.param("email")}, function(err){
        if (err){
            // we should not tell the user that the email is invalid
            console.error(err);
        }


    });
}



exports.sendemailtest = function(req, res){

    
    console.log();

/*
    var message = {
        from: config.emailDefaultFrom
        ,to: req.param("email")
        ,subject: 'Activate your ' + config.appTitle + ' user'
        ,html: ""
    }
    */
    res.json(200, {ok:true});
}
