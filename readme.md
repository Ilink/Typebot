## Typebot
Typebot is a simple Javascript typechecker. It is primarily designed to typecheck against Javascript primitive types.

### Usage
	var typebot = Typebot();
	var provided = {
	    arg1 : "arg1",
	    arg1 : 2
	}

	var should_be = {
	    arg1 : "string",
	    arg2 : "object"
	}
	
	// Note that the third parameter is an optional message to include
	typebot.check(provided, should_be, "Everything is ruined forever");
	typebot.log_errors();

