/*~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
Typebot is a simple typechecker. It can be used to easily typecheck a list of arguments.
Currently, it does not check anything beyond primitive types (string, int, etc). That
functionality may or may not be added in the future. EG: it could check if an object is
part of the prototype chain of another.

I recommend using this as a Singleton, but do as you will!


= = = = Simple Usage: = = = =

var provided = {
    arg1 : "arg1",
    arg1 : 2
}

var should_be = {
    arg1 : "string",
    arg2 : "object"
}

= = = = More Complex Usage: = = = =

var provided = {
    arg1 : "arg1",
    arg1 : 2
}

var should_be = {
    arg1 : {
        type : ['string', 'number'],
        error_message : "optional error message"
    },
    arg2 : {
        type : 'regex'
    },
    arg2 : {
        type : 'number',
        range : '1-2'
}

This would throw an error for arg2 because it is the wrong type
 ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/

var Typebot = function(){
    if(this instanceof Typebot){
        // = = = = Private = = = = //
        var checker;

        var parse_numerical_range = function(_range){
            var range;
            range = _range.replace(/ /g,'').split('-'); // strip spaces and break on dash delimeter
            return range;
        }

        var array_checker = function(arr){
            if(typeof arr !== 'undefined' && typeof arr.push === 'function' && typeof arr === 'object') return true
            else return false
        }

        var object_checker = function(obj){
            if(typeof obj !== 'undefined' && typeof obj.push !== 'function' && typeof obj === 'object') return true
            else return false
        }

        var single_type_checker = function(check_me, should_be){
            if (typeof check_me !== should_be) {
                console.log('single type checker error: wrong type!');
                return 'single type checker error: wrong type' // need a system for combining error messages into one big JSON error message
            } else {
                return true;
            }
        }

        var check_in_range = function(check_me, should_be_array){
            var found = false;
            $.each(should_be_array, function(index, value){
               if(value === typeof check_me) {
                   found = true;
                   return true;
               }
            });
            if (found === false){
                console.log('provided argument is not of type within specified set');
            }
            return found;
        }

        var check_in_value_range = function(check_me, should_be_value_range){
            var found = false;
            var range = parse_numerical_range(should_be_value_range);
            for(var i = range[0]; i<=range[1]; i++){
                if(check_me === i) found = true;
            }
            if(!found) console.log('value not in range');
            return found;
        }

        var complex_checker = function(check_me, should_be, extra_error_message){
            var correct = true,
                errors = [],
                should_be_value;

            $.each(should_be, function(key, value) {
                var current_check_me = check_me[key];

                if (typeof value.type !== 'undefined'){
                    if(typeof value.type === 'object' && array_checker(value.type)){
                        console.log('type is an array of type values');
                        check_in_range(current_check_me, value.type);
                        // OR parsing
                    }
                    else if (typeof value.type === 'string'){
                        console.log('type is a single type');
//                        console.log(current_check_me + ' ' + value.type);
                        single_type_checker(current_check_me, value.type);
                    }
                    if (typeof value.range === 'string') {
                        console.log('range specified');
                        check_in_value_range(current_check_me, value.range);
                    }
                } else throw 'Type must be defined';


//                $.each(current_should_be.type, function(should_be_type_key, should_be_type_value){
//                    if(should_be_type_value !== check_me_type){
//                        correct = false;
//                        should_be_value = should_be_type_value;
//                    } else {
//                        correct = true;
//                    }
//                    console.log(correct);
                });

//                if(!correct){
//                    var error = key + ' is a(n) ' + check_me_type + ' when it should be a(n) ' + should_be_value;
//                    error = error + '. ' + current_should_be.error_message;
//                    error = error + '. ' + extra_error_message;
//                    errors.push(error);
//                }

//            });
            return errors;
        }

//        var complex_checker = function(check_me, should_be, extra_error_message){
//            var correct = true,
//                errors = [],
//                should_be_value;
//
//            $.each(check_me, function(key, value) {
//                var current_should_be = should_be[key],
//                    check_me_type = typeof value;
//
//                $.each(current_should_be.type, function(should_be_type_key, should_be_type_value){
//                    if(should_be_type_value !== check_me_type){
//                        correct = false;
//                        should_be_value = should_be_type_value;
//                    } else {
//                        correct = true;
//                    }
//                    console.log(correct);
//                });
//
//                if(!correct){
//                    var error = key + ' is a(n) ' + check_me_type + ' when it should be a(n) ' + should_be_value;
//                    error = error + '. ' + current_should_be.error_message;
//                    error = error + '. ' + extra_error_message;
//                    errors.push(error);
//                }
//
//            });
//            return errors;
//        }

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
                    return complex_checker;
                }
            }
            else {
                return simple_checker;
            }
            console.log(checker);
        }

        // = = = = Public = = = = //

        this.check = function(check_me, should_be, extra_error_message){
            complex_checker(check_me, should_be, extra_error_message);
        }

//        this.check = function(check_me, should_be, extra_error_message){
//            var errors = [];
//            $.each(check_me, function(key, value) {
//                if(typeof value !== should_be[key]){
//                    var should_be_val = should_be[key];
//
//                    var error = key + ' is a(n) ' + typeof value + ' when it should be a(n) ' + should_be_val;
//                    error = error + '. ' + extra_error_message;
//                    errors.push(error);
//                }
//            });
//            return errors;
//        }

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