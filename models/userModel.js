/**
 *
 * Password hash: https://github.com/davidwood/node-password-hash
 * to verify password: passwordHash.verify('password123', hashedPassword)
 */
 
var mongoose = require('mongoose')
   ,Schema = mongoose.Schema
   ,ObjectId = Schema.ObjectId;


var passwordHash = require('password-hash');
var setPass = function(pass){
    return passwordHash.generate(pass);
}
 
var userStatus = [
    'created' // created but not activated
    ,'active' // active
    ,'blocked' // user was blocked by the system
];
var userSchema = new Schema({
     email: {type:String, lowercase:true, index:{unique:true}}
    ,password: {type:String, set:setPass}
    ,registerToken:String
    ,recoverToken:String
    ,status:{type:String,enum:userStatus, default:"created"}
});

userSchema.pre("validate",function(next, done) {
    var self = this;
    mongoose.models["User"].findOne({email : self.email},function(err, user) {
        if(err) {
            done(err);
        } else if(user) {
            console.log("user=" + user);
            self.invalidate("email","email must be unique");
            done(new Error("email must be unique"));
        } else {
            done();
        }
    });
    next();
});
 
userSchema.methods.verifyPassword = function(pass){
    return passwordHash.verify(pass, this.password);
}

module.exports = mongoose.model('User', userSchema);