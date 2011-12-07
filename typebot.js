/*~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
Typebot is a simple typechecker. It can be used to easily typecheck a list of arguments.
Currently, it does not check anything beyond primitive types (string, int, etc). That
functionality may or may not be added in the future. EG: it could check if an object is
part of the prototype chain of another.


Simple Usage:

var provided = {
    arg1 : "arg1",
    arg1 : 2
}

var should_be = {
    arg1 : "string",
    arg2 : "object"
}

More Complex Usage:

var provided = {
    arg1 : "arg1",
    arg1 : 2
}

var should_be = {
    arg1 : {
        type : ['string', 'number'],
        error_message : "optional error message"
    }
}

This would throw an error for arg2 because it is the wrong type
 ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/

var Typebot = function(){
    if(this instanceof Typebot){
        // Private
        var checker;

        var complex_checker = function(check_me, should_be, extra_error_message){
            var correct = true;
            var errors = [];
            var should_be_value;
            $.each(check_me, function(key, value) {
                var current_should_be = should_be[key];
                var check_me_type = typeof value;

                $.each(current_should_be.type, function(should_be_type_key, should_be_type_value){
                    if(should_be_type_value !== check_me_type){
                        correct = false;
                        should_be_value = should_be_type_value;
                    } else {
                        correct = true;
                    }
                    console.log(correct);
                });

                if(!correct){
                    var error = key + ' is a(n) ' + check_me_type + ' when it should be a(n) ' + should_be_value;
                    error = error + '. ' + current_should_be.error_message;
                    error = error + '. ' + extra_error_message;
                    errors.push(error);
                }

            });
            return errors;
        }

        var simple_checker = function(check_me, should_be, extra_error_message){
            var errors = [];
            $.each(check_me, function(key, value) {
                if(typeof value !== should_be[key]){
                    var should_be_val = should_be[key];
                    var error = key + ' is a(n) ' + typeof value + ' when it should be a(n) ' + should_be_val;
                    error = error + '. ' + extra_error_message;
                    errors.push(error);
                }
            });
            return errors;
        }

        checker = simple_checker;

        var checker_strategy = function(should_be_property){
            if(typeof should_be_property === 'object'){
                if(typeof should_be_property.type !== 'undefined'){
                    // check if this could just be:  typeof should_be_property.type !== 'undefined'
                    checker = complex_checker;
                }
            }
            else {
                checker = simple_checker;
            }
        }

        // Public
        this.check = function(check_me, should_be, extra_error_message){
            var errors = [];
            $.each(check_me, function(key, value) {
                if(typeof value !== should_be[key]){
                    var should_be_val = should_be[key];

                    var error = key + ' is a(n) ' + typeof value + ' when it should be a(n) ' + should_be_val;
                    error = error + '. ' + extra_error_message;
                    errors.push(error);
                }
            });
            return errors;
        }

        this.log_errors = function(errors){
            if(typeof console !== 'undefined' && typeof errors !== 'undefined'){
                $.each(errors, function(key, value){
                   console.log(value);
                });
            }
        }
    }
    else return new Typebot()
}