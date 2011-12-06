var check_me = {
    arg1 : "arg1",
    arg1 : 2
}

var should_be = {
    arg1 : "string",
    arg2 : "object"
}

var checker = Typebot();
checker.check(check_me, should_be, 'Everything is ruined forever.');
checker.log_errors();