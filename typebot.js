/*~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

Typebot is a simple typechecker. It can be used to easily typecheck a list of arguments.
Currently, it does not check anything beyond primitive types (string, int, etc). That
functionality may or may not be added in the future. EG: it could check if an object is
part of the prototype chain of another.

I recommend using this as a Singleton, but do as you will!

= = = = Usage: = = = =

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

		var generic_checker = function(to_check, type){
			if (typeof type === 'string'){
				type = (type.substring(0,1).toUpperCase() +''+ type.slice(1, type.length));
				var acceptable = {
					"Array" : true,
					"RegExp" : true,
					"Object" : true,
					"String" : true
				}
				if (acceptable[type]) { 
					return Object.prototype.toString.call(to_check) === '[object '+ type +']' 
				}
				console.log(type + ' is not a valid type. Valid types include: ');
				console.log(acceptable);
				return false
			}
			return false
		}

        var array_checker = function(arr){
            return Object.prototype.toString.call(arr) === '[object Array]'; // return true if argument is an array
        }

		var regex_checker = function(regex) {
			return Object.prototype.toString.call(regex) === '[object RegExp]' // return true if argument is regexp object
		}

        var object_checker = function(obj){
            return Object.prototype.toString.call(arr) === '[object Object]'; // return true if argument is an object
        }

        var single_type_checker = function(check_me, should_be){
            if (typeof check_me !== should_be) {
//                console.log('single type checker error: wrong type!');
                var error = new_error('single type checker error: wrong type!', check_me);
                return error;
            } else {
                return true;
            }
        }

        var check_in_range = function(check_me, should_be_array){
            var found = false;
            $.each(should_be_array, function(index, value){
               if(value.substring(0,1) === '!'){
                   var _value = value.substring(1, value.length);
//                   console.log(_value);
                   if(_value === typeof check_me){
                       found = false;
                       return found;
                   }
                   else found = true
               }

               else if(value === typeof check_me) {
                   found = true;
                   return found;
               }
            });

            if (found === false){
                var error = new_error('provided argument is not of type within specified set', check_me);
//                console.log('provided argument is not of type within specified set');
                return error;
            }
            return found;
        }

        var check_in_value_range = function(check_me, should_be_value_range){
            var found = false;
            var range = parse_numerical_range(should_be_value_range);
            for(var i = range[0]; i<=range[1]; i++){
                if(check_me === i) found = true;
            }
            if(!found) {
//                console.log('provided argument is not of type within specified set');
                var error = new_error('provided argument is not of type within specified set', check_me);
                return error;
            }
            return found;
        }

        var add_error = function(errors, error){
            if(error !== true){
                errors.push(error); // this may seem odd: either the checker returns True, meaning no error or it returns an error
            }
        }

        var new_error = function(because, where){
            var new_message = {
                "because" : because,
                "where" : where
            }
            return new_message;
        }

        var complex_checker = function(check_me, should_be){
            var correct = true,
                errors = [],
                should_be_value,
                error;

            $.each(should_be, function(key, value) {
                var current_check_me = check_me[key];

                if (typeof value.type !== 'undefined'){
                    if(typeof value.type === 'object' && generic_checker(value.type, 'Array')){
                       console.log('type is an array of type values');
                        error = check_in_range(current_check_me, value.type);
                        add_error(errors, error);
                        // OR \ NOT parsing
                    }
                    if (typeof value.type === 'string'){
//                        console.log('type is a single type');
//                        console.log(current_check_me + ' ' + value.type);
                        error = single_type_checker(current_check_me, value.type);
                        add_error(errors, error);
                    }
                    if (typeof value.range === 'string') {
//                        console.log('range specified');
                        error = check_in_value_range(current_check_me, value.range);
                        add_error(errors, error);
                    }
                } else throw 'Type must be defined';

            });

            if(errors.length < 1) return true; // no errors present
            else return errors;
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
                    return complex_checker;
                }
            }
            else {
                return simple_checker;
            }
            console.log(checker);
        }

        // = = = = Public = = = = //

        this.check = function(check_me, should_be, extra_error_message, options){
            var checker_output = complex_checker(check_me, should_be);
           	if(options.automatic_logging && !checker_output){
                console.log(checker_output);
           	}
            return checker_output;
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