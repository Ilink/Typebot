var check_me = {
    arg1 : "arg1",
    arg2 : 2
}

var should_be = {
    arg1 : "string",
    arg2 : "object"
}

var should_be_complex = {
    arg1 : {
//        type : ['string', 'number'],
        type : 'string',
        error_message : "optional error message"
    },
    arg2 : {
        type : ['string', 'number'],
        range : '1-2',
        error_message : "optional error message"
    }
}

var checker = Typebot();
var test = checker.check(check_me, should_be_complex, 'Everything is ruined forever.');
console.log(test);
checker.log_errors();