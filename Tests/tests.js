// = = = = Setup = = = = //
var typebot = Typebot();

var string_check_me = {
    arg1 : "test string"
}

var number_check_me = {
    arg1 : 2
}

var multiple_args_check_me = {
    arg1 : 2,
    arg2 : 'test',
    arg3 : false
}

// = = = = Tests = = = = //
module("Checker Strategies");

test("check if value is in range of type values (only using OR logic)", function() {
    var should_be = {
        arg1 : {
            type : ['string', 'number']
        }
    }

    equal(typebot.check(string_check_me, should_be), true, "Should return false when there are no errors");
});

test("check if value is in range of type values (using NOT logic)", function(){
    var should_be = {
        arg1:{
            type: ['!boolean', 'string']
        }
    }
    equal(typebot.check(string_check_me, should_be), true, "Should be able to exclude a type ( !boolean )");
});

test("only use not logic", function(){
    var should_be = {
        arg1:{
            type: ['!boolean']
        }
    }
    equal(typebot.check(string_check_me, should_be), true, "Should be able to use any type but boolean");
});

test("test single-type checker", function(){
   var should_be = {
       arg1 : {
           type : 'string'
       }
   }

   equal(typebot.check(string_check_me, should_be), true, "Should be able to check with a single type value")
});

test("check in value range (EG: 1-10)", function(){
   var should_be = {
        arg1 : {
            type : 'number',
            range: '0-2'
        }
   }

   equal(typebot.check(number_check_me, should_be), true, "should be able to check if value is within a range like 1-2");
//   ok(typebot.check(number_check_me, should_be), "should be able to check if value is within a range like 1-2");
});

test("make sure it can handle multiple failures", function(){
   var should_be = {
        arg1 : {
            type : 'string',
            range: '0-1'
        }
   }

   notEqual(typebot.check(number_check_me, should_be, { automatic_logging : true }), true, "should be able to handle multiple errors");
   typebot.log_errors();
});

test("determine if regex finds any matches within value", function(){
	var regex_arg = {
		arg1 : 'abc-----'
	}
	
	var should_be = {
		arg1 : {
			type : 'string',
			regex : /abc/
		}
	}
	equal(typebot.check(regex_arg, should_be), true, "should handle regex");
});

//test("Testing automatic logging", function(){
//   var should_be = {
//        arg1 : {
//            type : 'string',
//            range: '0-1'
//        }
//   }
//
//   notEqual(typebot.check(number_check_me, should_be, true), true, "should be able to handle multiple errors");
//   typebot.log_errors();
//});