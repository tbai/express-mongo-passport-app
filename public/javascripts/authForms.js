requirejs([
     "jquery"
], 
function($){ 
$(document).ready( function(){

var passwordValidationRegex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,30}$/;
var emailValidationRegex = /^[_a-z0-9-]+(\.[_a-z0-9-]+)*@[a-z0-9-]+(\.[a-z0-9-]+)*(\.[a-z]{2,4})$/;
var passwordInstructions = "Password must include at least one upper case letter, one lower case letter, and one numeric digit."

var $form = $("form.auth");

// Events
$form.on("submit", function(ev){
    var datalist = $(this).serializeArray();
    var formData = {};
    for (var i=0; i<datalist.length; i++){
        formData[datalist[i].name] = datalist[i].value;
    }
    return validate[this.name](this, formData);
});

// init
// show server errors
if (window._formError){
    var field, message;
    for (key in window._formError){
        field = key;
        message = window._formError[key];
        if ( $form.find('[name='+field+']').length ){
            validationError($form[0], field, message);
            break;
        }
    }
}

var validate = {
    login:function(form, data){
        if (!data.email){
            validationError(form, "email", "Type your email.");
        } else if ( !emailValidationRegex.test(data.email) ){
            validationError(form, "email", "Invalid email.");
        } else if (!data.password){
            validationError(form, "password", "Type your password.");
        } else {
            return true;
        }
        return false;
    },

    register: function(form, data){
        if ( !emailValidationRegex.test(data.email) ){
            validationError(form, "email", "Invalid email address.");
        } else if ( !passwordValidationRegex.test(data.password) ){
            validationError(form, "password", passwordInstructions);
        } else if (data.password != data.verifypassword){
            validationError(form, "verifypassword", "Must match typed password.")
        } else {
            return true;
        }
        return false;
    },

    recover:function(form, data){
        if (!data.email){
            validationError(form, "email", "Type your email.");
        } else if ( !emailValidationRegex.test(data.email) ){
            validationError(form, "email", "Invalid email.");
        } else {
            return true;
        }
        return false;
    }
};

function validationError(form, field, message){
    var errorEl = $(form).find("div.alert");
    if (errorEl.length == 0){
        errorEl = $(document.createElement("div"));
        errorEl.addClass("alert alert-error");
        $(form).prepend(errorEl);
    }
    errorEl.html(message);
    // clear field highlight
    $(form).find(".control-group").removeClass("error");
    // highlight field with error
    var fieldEl = $(form).find("[name="+field+"]").parent(".control-group");
    fieldEl.addClass("error");
}

}); // $.ready 
}); // require