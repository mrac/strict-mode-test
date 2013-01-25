//#
test("context of strict mode function", function() {

	var returnContext = function() {
		"use strict";
		return this;
	};
	String.prototype.returnContext = function() {
		"use strict";
		return this;
	};
	
	//#
	ok(typeof returnContext() == 'undefined', "when calling strict mode function not as a method, the context should stay undefined, and not be converted to global object");
	//#
	ok(typeof returnContext.call(undefined) == 'undefined', "when calling strict mode function injecting context of undefined, the context should stay undefined, and not be converted to global object");
	//#
	ok(returnContext.call(null) === null, "when calling strict mode function injecting context of null, the context should stay null, and not be converted to global object");
	//#
	ok(!("text".returnContext() instanceof String), "when calling strict mode function as a method of a primitive value, the context should stay primitive value, and not be coerced to its object wrapper");
	//#
	ok(!(returnContext.call("text") instanceof String), "when calling strict mode function injecting context of a primitive value, the context should stay primitive value, and not be coerced to its object wrapper");

	delete String.prototype.returnContext;

});



//#
test("assignment to undeclared variable", function() {

	var err;
	
	(function(){
		"use strict";
		try {
			not_declared_yet = 1;
		} catch (error) {
			err = error;
		}
	})();
	
	//#
	ok(err, err || "assignment to undeclared variable should throw ReferenceError");
	
});





//#
test("assignment to property", function() {

	var err1, err2, err3;
	var supported1, supported2;

	var obj = {};
	
	if(typeof Object.defineProperty == 'function') {
		supported1 = true;
		try {
			Object.defineProperty(obj, "prop", {
				value: "oldvalue",
				writable: false
			});
		} catch(error) {
			supported1 = false;
		}
	}
	
	if(typeof Object.defineProperty == 'function') {
		supported2 = true;
		try {
			Object.defineProperty(obj, "access", {
				get: function() {
					return 1;
				}
			});
		} catch(error) {
			supported2 = false;
		}
	}
	
	(function(){
		"use strict";
		try {
			"string".length = 2;			
		} catch (error) {
			err1 = error;
		}
	})();
	
	(function(){
		"use strict";
		try {
			obj.prop = "newvalue";
		} catch (error) {
			err2 = error;
		}
	})();
	
	(function(){
		"use strict";
		try {
			obj.access = "newvalue";
		} catch (error) {
			err3 = error;
		}
	})();
	
	//#
	ok(err1, err1 || "assignment to non-writable property should throw TypeError");
	//#
	if(supported1) ok(err2, err2 || "assignment to non-writable property should throw TypeError");
	//#
	if(supported2) ok(err3, err3 || "assignment to property that has only a getter defined should throw TypeError");
		
});


//#
test("adding properties to non-extensible objects", function() {

	var err1, err2;
	var supported1, supported2;

	var obj = {};
	var other = {};
	
	if(Object.preventExtensions) {
		supported1 = true;
		Object.preventExtensions(obj);
	}
		
	(function(){
		"use strict";
		try {
			obj.prop = "";			
		} catch (error) {
			err1 = error;
		}
	})();
	
	if(Object.defineProperty) {
		supported2 = true;
		try {
			Object.defineProperty(other, "other", {
				value: 10
			});
		} catch(error) {
			supported2 = false;
		}
	}
	
	(function() {
		"use strict";
		try {
			Object.defineProperty(obj, "prop", {
				value: 10
			});
		} catch(error) {
			err2 = error;
		}
	})();
	
	//#
	ok(supported1, "Object.preventExtensions should be supported");
	//#
	ok(err1, err1 || "adding a property by assignment to non-extensible object should throw TypeError");
	//#
	ok(supported2 && err2, err2 || "adding a property by Object.defineProperty to non-extensible object should throw TypeError");
		
});




//#
test("deletion", function() {

	var err;
	
	(function(){
		"use strict";
		try {
			delete Array.prototype.length;			
		} catch (error) {
			err = error;
		}
	})();
	
	
	//#
	ok(syntaxErrors.deleteNonProperty, "deleting without specifying a property should throw Syntax Error: Applying the 'delete' operator to an unqualified name is deprecated");
	//#
	ok(err, err || "deleting non-configurable property should throw TypeError");
		
});



//#
test("with statement", function() {

	//#
	ok(syntaxErrors.withStatement, "strict mode code may not contain 'with' statements");
		
});



//#
test("defining a property more than once in an object literal", function() {

	//#
	ok(syntaxErrors.doubleProperty, "should throw Syntax Error: Property name appears more than once in object literal");
		
});


//#
test("defining identically-named function parameters", function() {
	
	//#
	ok(syntaxErrors.doubleParameter, "function declaration with two or more identical parameter names should throw Syntax Error: Duplicate format argument param");
	//#
	ok(syntaxErrors.doubleParameter1, "function expression with two or more identical parameter names should throw Syntax Error: Duplicate format argument param");
	//#
	ok(syntaxErrors.doubleParameter2, "function constructor with two or more identical parameter names should throw Syntax Error: Duplicate format argument param");

});



//#
test("arguments object should not dynamically share its values with formal parameters", function() {

	var x,y;

	function func1(a) {
		"use strict";
		a = 10;
		return (arguments[0] !== 10); 
	}

	function func2(a) {
		"use strict";
		arguments[0] = 10;
		return (a !== 10); 
	}

	x = func1(5);
	y = func2(5);
	
	//#
	ok(x, "the arguments element doesn't change when the corresponding parameter variable changes inside function");
	//#
	ok(y, "the parameter doesn't change when the corresponding arguments element changes inside function");
	
});




//#
test("using 'arguments' identifier", function() {

	//#
	ok(syntaxErrors.assignToArguments, "assigning to arguments should throw Syntax Error: Assignment to arguments is deprecated");
	//#
	ok(syntaxErrors.variableArguments, "declaring a variable 'arguments' (var) should throw Syntax Error: redefining arguments is deprecated");
	//#
	ok(syntaxErrors.variableArguments2, "declaring a variable 'arguments' (in for..in loop) should throw Syntax Error: redefining arguments is deprecated");
	//#
	ok(syntaxErrors.variableArguments3, "declaration a strict mode function named 'arguments' should throw Syntax Error: redefining arguments is deprecated");
	//#
	ok(syntaxErrors.variableArguments4, "expression of strict mode function named 'arguments' (function expression) should throw Syntax Error: redefining arguments is deprecated");
	//#
	ok(syntaxErrors.variableArguments5, "parameter of strict mode function named 'arguments' should throw Syntax Error: redefining arguments is deprecated");
	//#
	ok(syntaxErrors.variableArguments6, "strict mode function constructor with 'arguments' variable or parameter should throw Syntax Error: redefining arguments is deprecated");
	//#
	ok(syntaxErrors.variableArguments7, "using 'arguments' as catch identifier name should throw Syntax Error: redefining arguments is deprecated");
	//#
	ok(syntaxErrors.variableArguments8, "using 'arguments' in postfix expression should throw Syntax Error: assignment to arguments is deprecated");
	//#
	ok(syntaxErrors.variableArguments9, "using 'arguments' in unary expression should throw Syntax Error: assignment to arguments is deprecated");
	//#
	ok(syntaxErrors.variableArguments10, "using 'arguments' as a parameter name of a setter should throw Syntax Error: redefining arguments is deprecated");
	//#
	ok(syntaxErrors.variableArguments11, "using 'arguments' as a parameter name of a strict mode setter should throw Syntax Error: redefining arguments is deprecated");
});


//#
test("using 'eval' identifier", function() {
		
	//#
	ok(syntaxErrors.assignToEval, "assigning to eval should throw Syntax Error: Assignment to eval is deprecated");
	//#
	ok(syntaxErrors.variableEval, "declaring a variable 'eval' (var) should throw Syntax Error: redefining eval is deprecated");
	//#
	ok(syntaxErrors.variableEval2, "declaring a variable 'eval' (in for..in loop) should throw Syntax Error: redefining eval is deprecated");
	//#
	ok(syntaxErrors.variableEval3, "declaration a strict mode function named 'eval' should throw Syntax Error: redefining eval is deprecated");
	//#
	ok(syntaxErrors.variableEval4, "expression of strict mode function named 'eval' (function expression) should throw Syntax Error: redefining eval is deprecated");
	//#
	ok(syntaxErrors.variableEval5, "parameter of strict mode function named 'eval' should throw Syntax Error: redefining eval is deprecated");
	//#
	ok(syntaxErrors.variableEval6, "strict mode function constructor with 'eval' variable or parameter should throw Syntax Error: redefining eval is deprecated");
	//#
	ok(syntaxErrors.variableEval7, "using 'eval' as catch identifier name should throw Syntax Error: redefining eval is deprecated");
	//#
	ok(syntaxErrors.variableEval8, "using 'eval' in postfix expression should throw Syntax Error: assignment to eval is deprecated");
	//#
	ok(syntaxErrors.variableEval9, "using 'eval' in unary expression should throw Syntax Error: assignment to eval is deprecated");
	//#
	ok(syntaxErrors.variableEval10, "using 'eval' as a parameter name of a setter should throw Syntax Error: redefining eval is deprecated");
	//#
	ok(syntaxErrors.variableEval11, "using 'eval' as a parameter name of a strict mode setter should throw Syntax Error: redefining eval is deprecated");
	
});



//#
test("direct eval call", function() {

	var x;
	var err;
	var ret;

	(function(){
		"use strict";
		eval("var newVar=4;");
		try {
			x = newVar;
		} catch(error) {
			err = error;
		}
	})();

	(function(){
		"use strict";
		eval("ret = this;");
	})();

	
	//#
	ok(err, "variables declared in direct eval code, should not be visible outside (direct eval introduces its own inner scope)");
	//#
	ok(typeof ret == 'undefined', "context of direct eval code should be undefined, and not the global object context");
	
});


/*
test("indirect eval call", function() {

	var ret;
	
	(function(){
		"use strict";
		
		window.checkVisibleScope = 111;
		var checkVisibleScope = 222;
		
		("indirect", eval)("window.scope = checkVisibleScope; window.context = this;");
		ret = (window.scope === 111 && window.context === window);
		
	})();

	ok(ret, "indirect eval code will use the global scope (the same as the context referenced by 'this')");
	
});
*/



//#
test("access to arguments.callee, arguments.caller of strict mode functions", function() {

	var err1 = "",
		err2 = "",
		err3 = "",
		err4 = "",
		err5 = "",
		err6 = "";
	
	(function(){
		"use strict";
		try {
			var x = arguments.callee;	
		} catch (error) {
			err1 = error;
		}
	})();
	
	(function(){
		"use strict";
		try {
			var x = arguments.caller;	
		} catch (error) {
			err2 = error;
		}
	})();
	
	(function(){
		"use strict";
		try {
			arguments.callee = function() {};	
		} catch (error) {
			err3 = error;
		}
	})();
	
	(function(){
		"use strict";
		try {
			arguments.caller = function() {};	
		} catch (error) {
			err4 = error;
		}
	})();
	
	(function(){
		"use strict";
		try {
			delete arguments.callee;	
		} catch (error) {
			err5 = error;
		}
	})();
	
	(function(){
		"use strict";
		try {
			delete arguments.caller;	
		} catch (error) {
			err6 = error;
		}
	})();
	
	err1 = err1 ? " : "+err1 : err1;
	err2 = err2 ? " : "+err2 : err2;
	err3 = err3 ? " : "+err3 : err3;
	err4 = err4 ? " : "+err4 : err4;
	err5 = err5 ? " : "+err5 : err5;
	err6 = err6 ? " : "+err6 : err6;
	
	//#
	ok(err1, "reading arguments.callee should throw error "+err1);
	//#
	ok(err2, "reading arguments.caller should throw error "+err2);
	//#
	ok(err3, "assignment to arguments.callee should throw error "+err3);
	//#
	ok(err4, "assignment to arguments.caller should throw error "+err4);
	//#
	ok(err5, "deleting arguments.callee should throw error "+err5);
	//#
	ok(err6, "deleting arguments.caller should throw error "+err6);

});



//#
test("access to strict mode function properties 'arguments' and 'caller'", function() {

	var err1 = "",
		err2 = "",
		err3 = "",
		err4 = "",
		err5 = "",
		err6 = "";
	
	try {
		var x = (function() {
			"use strict";
		}).arguments;
	} catch (error) {
		err1 = error;
	}
	
	try {
		var x = (function() {
			"use strict";
		}).caller;
	} catch (error) {
		err2 = error;
	}

	try {
		(function() {
			"use strict";
		}).arguments = [""];	
	} catch (error) {
		err3 = error;
	}
	
	try {
		(function() {
			"use strict";
		}).caller = function() {};	
	} catch (error) {
		err4 = error;
	}
	
	(function() {
		"use strict";
		var func = function() {	};
		try {
			delete func.arguments;
		} catch (error) {
			err5 = error;
		}
	})();
	
	(function() {
		"use strict";
		var func = function() {	};
		try {
			delete func.caller;	
		} catch (error) {
			err6 = error;
		}
	})();

	err1 = err1 ? " : "+err1 : err1;
	err2 = err2 ? " : "+err2 : err2;
	err3 = err3 ? " : "+err3 : err3;
	err4 = err4 ? " : "+err4 : err4;
	err5 = err5 ? " : "+err5 : err5;
	err6 = err6 ? " : "+err6 : err6;
	
	//#
	ok(err1, "reading strict mode function property 'arguments' should throw error "+err1);
	//#
	ok(err2, "reading strict mode function property 'caller' should throw error "+err2);
	//#
	ok(err3, "assignment to strict mode function property 'arguments' should throw error "+err3);
	//#
	ok(err4, "assignment to strict mode function property 'caller' should throw error "+err4);
	//#
	ok(err5, "strict mode function property 'arguments' should be non-configurable");
	//#
	ok(err6, "strict mode function property 'caller' should be non-configurable");

});


test("anonymous function name variable is read-only", function() {
	
	var err;
	var newValue = function() {};
	var returnFunc;
	(function func() {
		"use strict";
		try {
			returnFunc = func;
			func = newValue;
			returnFunc = func;
		} catch(error) {
			err = error;
		}
	})();
	ok(returnFunc !== newValue, "a variable referencing an anonymous function should be read-only");
	ok(err, err || "assignment to a variable referencing an anonymous function should throw TypeError");
	
});


//#
test("octal integers", function() {
	
	//#
	ok(syntaxErrors.octalIntegerLiteral, "octal integer literal should not be valid numeral literal");
	//#
	ok(syntaxErrors.octalEscapeSequence, "octal escape sequence should not be valid escape sequence");
	
});



/*

ECMAScript 5 exceptions - changing properties of non-configurable, #adding properties of non-extensible

# numeralLiteral not include octalIntegerLiteral
# escapeSequence not include octalEscapeSequence
# assigning to undeclared variable
# assigning to non-writable
# assigning to accessor without setter
# assigning to non-existant property of unextensible object
# assignment to eval
# assignment to arguments
# postfix expression eval
# postfix expression arguments
# unary expression eval
# unary expression arguments
# delete arguments.caller
# delete arguments.callee
# read arguments.caller
# read arguments.callee
# write to arguments.caller
# write to arguments.callee
# arguments object do not dynamically share their values with formal parameters of function (REFERENCE)
# object literal with double properties
# It is a SyntaxError if the Identifier "eval" or the Identifier "arguments" occurs as the Identifier in a PropertySetParameterList of a PropertyAssignment that is contained in strict code or if its FunctionBody is strict code (11.1.5).
# Strict mode eval code cannot instantiate variables or functions in the variable environment of the caller to eval. Instead, a new variable environment is created and that environment is used for declaration binding instantiation for the eval code
# context of null or undefined is not converted to global object
# context of primitive value is not converted to wrapper object
# If this is evaluated within strict mode code, then the this value is not coerced to an object.
# The this value passed via a function call (including calls made using Function.prototype.apply and Function.prototype.call) do not coerce the passed this value to an object
# delete - variable, function parameter, or function name
# delete non-configurable
# variable eval (variable or VariableDeclarationNoIn)
# variable arguments (variable or VariableDeclarationNoIn)
# with statement
# catch identifier - eval
# catch identifier - arguments
# parameter eval of strict mode function (declaration and expression)
# parameter arguments of strict mode function (declaration and expression)
# two or more functions parameters with the same name (declaration, expression or function constructor)
# strict mode functions cannot have property arguments modified or created
# strict mode functions cannot have property caller modified or created
# eval cannot be variable, function declaration, function expression or parameter name (or creating such function by constructor)
# arguments cannot be variable, function declaration, function expression or parameter name (or creating such function by constructor)



#eval('"\010"') is a SyntaxErrorYes
# eval('010') is a SyntaxErrorYes
#__i_dont_exist = 1; is a ReferenceErrorYes
#eval = 1; is a SyntaxErrorYes
#arguments = 1; is a SyntaxErrorYes
#eval++; is a SyntaxErrorYes
#arguments++; is a SyntaxErrorYes
#arguments.caller; is a TypeErrorYes
#arguments.callee; is a TypeErrorYes
#(function(x){ x = 2; return arguments[0] === 1; })(1);Yes
#(function(x){ arguments[0] = 2; return x === 1; })(1);Yes
#({ x: 1, x: 1 }); is a SyntaxErrorYes
#({ set x(eval){ } }); is a SyntaxErrorYes
#({ set x(arguments){ } }); is a SyntaxErrorYes
#eval('var x'); x; is a ReferenceErrorYes
#(function(){ return this === undefined; })();Yes
#(function(){ return this === undefined; }).call();Yes
#var x; delete x; is a SyntaxErrorYes
#delete (function(){}).length; is a TypeErrorYes
#(function f() { f = 123; })() is a TypeErrorYes
#Object.defineProperty({ }, "x", { writable: false }).x = 1 is a TypeErrorYes
#({ get x(){ } }).x = 1; is a TypeErrorYes
#var eval; is a SyntaxErrorYes
#var arguments; is a SyntaxErrorYes
#with({}){ } is a SyntaxErrorYes
#try { } catch (eval) { } is a SyntaxErrorYes
#try { } catch (arguments) { } is a SyntaxErrorYes
#function f(eval) { } is a SyntaxErrorYes
#function f(arguments) { } is a SyntaxErrorYes
#function f(x, x) { } is a SyntaxErrorYes
#(function(){}).caller; is a TypeErrorYes
#(function(){}).arguments; is a TypeErrorYes
#function eval(){ } is a SyntaxErrorYes
#function arguments(){ } is a SyntaxError


*/