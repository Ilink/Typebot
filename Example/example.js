var check_me = {
    arg1 : "arg1",
    arg1 : 2
}

var should_be = {
    arg1 : "string",
    arg2 : "object"
}

var should_be_complex = {
    arg1 : {
        type : ['string', 'number'],
        error_message : "optional error message"
    },
    arg2 : {
        type : ['string', 'number'],
        error_message : "optional error message"
    }
}

var checker = Typebot();
checker.check(check_me, should_be_complex, 'Everything is ruined forever.');
checker.log_errors();