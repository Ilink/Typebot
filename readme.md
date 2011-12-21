# Typebot
Typebot is a flexible Javascript typechecker. It is primarily designed to typecheck against Javascript primitive types.

## Usage
	var typebot = Typebot();
	var provided = {
	    arg1 : "im a string!",
	    arg2 : 2
	}

	var should_be = {
	    arg1 : {
	        type : ['string', 'number']
	    },
		arg2 : {
			type : ['number']
		}
	}

	typebot.check(provided, should_be);
	typebot.log_errors();

Typebot returns True if there are no errors. Therefore you can use an equality test and log errors if there are any.

	if(!typebot.check(check_me, should_be)){
		typebot.log_errors();
	}

Alternatively, you can specify that Typebot should automatically log errors as they appear.

	typebot.check(check_me, should_be, true);

## More Specialized Usage

Typebot allows the exclusion of certain types. For instance, let's say you want to make sure a variable is not a boolean.

	var typebot = Typebot();
	var check_me = {
		arg1 : false
	}

	var should_be = {
		arg1 : {
			type:['!boolean']
		}
	}

	typebot.check(check_me, should_be) // This will return an error because we specified that we do not want boolean values

Alternatively, you could specify many possible types for a variable:

	var should_be = {
		arg1 : {
			type:['boolean', 'string', 'number']
		}
	}

You can also specify a range of values:

	var should_be = {
		arg1 : {
			type:['number'],
			range:"0-2"
		}
	}

Note that the range property must be a string.

## Simplest Usage

I am working on a simpler version which will accept arguments like this:

	var provided = {
	    arg1 : "im a string!",
	    arg2 : 2
	}

	var should_be = {
	    arg1 : 'string',
		arg2 : 'number'
	}
	
Hopefully this will be ideal for simplest usage.