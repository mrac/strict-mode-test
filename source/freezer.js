/*
---
name: freezer.js
description: If ECMAScript 5 is supported, the script freezes all ES native objects.
license: MIT-style license.
requires: ---
*/

(function(global) {
	
	function freezeObj (propname, object) {
		// object is the global object by default
		if(typeof object === 'undefined') object = global;

		// set non-writable, non-configurable
		try {
			// Object.defineProperty(object, propname, {writable:false,configurable:false}); // this should work, but not in FF4.0
			Object.defineProperty(object, propname, {writable:false, configurable:false, value:object[propname]});
		} catch(error) {
		}
		
		// if object -> freeze
		try {
			Object.freeze(object[propname]);
		} catch(error) {
		}

		// if function -> freeze prototype
		if(typeof object[propname] === 'function') {
			try {
				Object.freeze(object[propname].prototype);
			} catch(error) {
			}
		}
	}
	
	var name,i=0;
	var natives = ['Number', 'String', 'Boolean', 'Object', 'Array', 'Function', 'RegExp', 'Date', 'Error', 'TypeError',
					'ReferenceError', 'URIError', 'SyntaxError', 'EvalError', 'RangeError',
					'Math', 'JSON', 'undefined', 'Infinity', 'NaN',
					'eval', 'parseInt','parseFloat', 'isFinite', 'isNaN', 'escape', 'unescape',
					'encodeURI', 'encodeURIComponent', 'decodeURI', 'decodeURIComponent'];

	while(name = natives[i++]) freezeObj(name);
	
})(this);

