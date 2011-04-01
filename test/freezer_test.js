

// ================== freezer.js test ==================

(function(global) {

	var strict = function() { return !this; };
	
	var natives = ['myCustomObject',
		'Number', 'String', 'Boolean', 'Object', 'Array', 'Function', 'RegExp', 'Date', 'Error', 'TypeError',
		'ReferenceError', 'URIError', 'SyntaxError', 'EvalError', 'RangeError',
		'Math', 'JSON', 'undefined', 'Infinity', 'NaN',
		'eval', 'parseInt','parseFloat', 'isFinite', 'isNaN', 'escape', 'unescape',
		'encodeURI', 'encodeURIComponent', 'decodeURI', 'decodeURIComponent'];
	
	
	var name, i = 1; // test only natives, and not the custom object
	while(name = natives[i++]) {
		if(name !== "NaN") {
			if(global[name] !== global.nativesCache[name]) {
				alert("Some native objects are overriden. Test failed!");
				break;
			}
		}
	}
	
	if(!Object.freeze || !Object.defineProperty) {
		
		// non-ES5 browser won't freeze it - it's ok (working in melted all-is-possible environment)
		
		test("ES5 not supported", function() {
			ok(true, "ECMAScript 5 is not supported (Object.freeze and Object.defineProperty)");
		});
		
	} else {

		// ES5 browsers should freeze it - for developers sanity only (code logic should not rely on it)
		
		
		
		test("Native - modify",function() {
			
			var err,
				e,
				name,
				i = 0,
				cache;
				
			window.myCustomObject = {key: 'value'};
					
			while(name = natives[i++]) {
							
				cache = global[name];
				global[name] = "something";
				if(name === 'myCustomObject') {
					strictEqual(global[name], "something", name+" should NOT be read-only");
				} else {
					notStrictEqual(global[name], "something", name+" should be readonly");
				}
				if(global[name] === "something") global[name] = cache;
			}
				
		});
		
		
		
		test("Native - delete",function() {
					
			var err,
				e,
				name,
				i = 0,
				cache;
				
			while(name = natives[i++]) {
				cache = global[name];
				delete global[name];
				if(name === 'myCustomObject') {
					ok(!(name in global), name+" should be deletable");
				} else {
					ok(name in global, name+" should NOT be deletable");
				}
				if(!(name in global)) global[name] = cache;
			}
		});

		
		
		test("Native - redefine",function() {
										
			var err,
				e,
				name,
				i = 0,
				cache;

			while(name = natives[i++]) {
				cache = Object.getOwnPropertyDescriptor(global, name).configurable;
				try {
					e = "";
					Object.defineProperty(global, name, { configurable: true, value: global[name] });
				} catch(errDef) {
					e = errDef;
				}
				if(name === 'myCustomObject') {
					ok(!e, name+" should be able to redefine");
				} else {
					ok(e || Object.getOwnPropertyDescriptor(global,name).configurable === cache, name+" should NOT be able to redefine");
				}
				if(Object.getOwnPropertyDescriptor(global,name).configurable !== cache) Object.defineProperty(global, name, { configurable: cache, value: global[name] });
			}
		});
				
				
					
		test("Property of native object - add new",function() {
					
			var err,
				e,
				name,
				i = 0,
				cache;
									
			while(name = natives[i++]) {
				
				if(global[name] instanceof Object) {

					try {
						e = "";
						global[name].newProp = 108;
					} catch(errDef) {
						e = errDef;
					}
					if(name === 'myCustomObject') {
						ok((!e && global[name].newProp === 108), name+" should be able to add new property");
					} else {
						ok((e || global[name].newProp !== 108), name+" should NOT be able to add new property");
					}
					if(global[name].newProp) delete global[name].newProp;

				}
			}
		});
			
			
					
		test("Property of native object - modify",function() {
					
			var err,
				e,
				name,
				i = 0,
				cache;
									
			while(name = natives[i++]) {

				if(global[name] instanceof Object) {

					(function() {
						var ownProps = Object.getOwnPropertyNames(global[name]);
						var prop, i = 0;
						var err;
						var modified = false;
						var error_props = [];
						while(prop = ownProps[i++]) {
							cache = global[name][prop];
							try {
								err = "";
								global[name][prop] = 108;
							} catch(error) {
								err = error;
							}
							if(prop !== "NaN") {
								if(name !== "RegExp" || (prop in {prototype:0, length:0, arity:0, name:0, arguments:0, caller:0})) {
									// don't test RegExp special accessors
									// they may change after any RegExp access (e.g. in Google Chrome)
									if(!err && global[name][prop] !== cache) {
										global[name][prop] = cache;
										modified = true;
										error_props.push(prop);
									}
								}
							} else {
								if(!isNaN(global[name][prop])) {
									global[name][prop] = cache;
									modified = true;
									error_props.push("NaN");
								}
							}
						}
						if(modified) error_props = ". But these properties are not: "+error_props.join(", "); else error_props = "";
						if(name !== 'myCustomObject') {
							ok(!modified, "All properties of "+name+" should be read-only"+error_props);
						} else {
							ok(modified, "Properties of "+name+" should NOT be read-only");
						}
					})();
				}
			}
		});
		
		
		
		test("Property of native object - delete",function() {
					
			var err,
				e,
				name,
				i = 0,
				cache;
						
			while(name = natives[i++]) {
				if(global[name] instanceof Object) {
					(function() {
						var ownProps = Object.getOwnPropertyNames(global[name]);
						var prop, i = 0;
						var err;
						var deleted = false;
						var error_props = [];
						while(prop = ownProps[i++]) {
							cache = global[name][prop];
							try {
								err = "";
								delete global[name][prop];
							} catch(error) {
								err = error;
							}
							if(prop !== "NaN") {
								if(!err && global[name][prop] !== cache) {
									global[name][prop] = cache;
									deleted = true;
									error_props.push(prop);
								}
							} else {
								if(!isNaN(global[name][prop])) {
									global[name][prop] = cache;
									deleted = true;
									error_props.push("NaN");
								}
							}
						}
						if(deleted) error_props = ". But these properties are not: "+error_props.join(", "); else error_props = "";
						if(name !== 'myCustomObject') {
							ok(!deleted, "All properties of "+name+" should NOT be deletable"+error_props);
						} else {
							ok(deleted, "Properties of "+name+" should be deletable");
						}
					})();
				}
			}
		});
		
		
		
		test("Property of native object - redefine",function() {
					
			var err,
				e,
				name,
				i = 0,
				cache;
						
			while(name = natives[i++]) {
		
				if(global[name] instanceof Object) {
					(function() {
						var ownProps = Object.getOwnPropertyNames(global[name]);
						var prop, i = 0;
						var err;
						var redefined = false;
						var error_props = [];
						while(prop = ownProps[i++]) {
							cache = Object.getOwnPropertyDescriptor(global[name], prop).configurable;
							try {
								err = "";
								Object.defineProperty(global[name], prop, { configurable: true, value: global[name][prop] });
							} catch(error) {
								err = error;
							}
							if(Object.getOwnPropertyDescriptor(global[name],prop).configurable !== cache) {
								Object.defineProperty(global[name], prop, { configurable: cache, value: global[name][prop] });
								redefined = true;
								error_props.push(prop);
							}
						}
						if(redefined) error_props = ". But these properties are not: "+error_props.join(", "); else error_props = "";
						if(name !== 'myCustomObject') {
							ok(e || !redefined, "All properties of "+name+" should NOT be able to redefine"+error_props);
						} else {
							ok(!e, "Properties of "+name+" should be able to redefine");
						}
					})();			
				}
			}
		});
				

		test("Property of native function prototype - add new",function() {
					
			var err,
				e,
				name,
				i = 0,
				cache;
						
			while(name = natives[i++]) {
				
				if(global[name] instanceof Function  &&  global[name].prototype) {

					try {
						e = "";
						global[name].prototype.newProp = 108;
					} catch(errDef) {
						e = errDef;
					}
					if(name === 'myCustomObject') {
						ok((!e && global[name].prototype.newProp === 108), name+" should be able to add new property to prototype");
					} else {
						ok((e || global[name].prototype.newProp !== 108), name+" should NOT be able to add new property to prototype");
					}
					if(global[name].prototype.newProp) delete global[name].prototype.newProp;
					
				}
			}
			
		});

		
		
		test("Property of native function prototype - modify",function() {
					
			var err,
				e,
				name,
				i = 0,
				cache;
						
			while(name = natives[i++]) {
				
				if(global[name] instanceof Function  &&  global[name].prototype) {
					
					(function() {
						var ownProps = Object.getOwnPropertyNames(global[name].prototype);
						var prop, i = 0;
						var err;
						var modified = false;
						var error_props = [];
						while(prop = ownProps[i++]) {
							cache = global[name].prototype[prop];
							try {
								err = "";
								global[name].prototype[prop] = 108;
							} catch(error) {
								err = error;
							}
							if(prop !== "NaN") {
								if(name !== "RegExp" || (prop in {prototype:0, length:0, arity:0, name:0, arguments:0, caller:0})) {
									// don't test RegExp special accessors
									// they may change after any RegExp access (e.g. in Google Chrome)
									if(!err && global[name].prototype[prop] !== cache) {
										global[name].prototype[prop] = cache;
										modified = true;
										error_props.push(prop);
									}
								}
							} else {
								if(!isNaN(global[name].prototype[prop])) {
									global[name].prototype[prop] = cache;
									modified = true;
									error_props.push("NaN");
								}
							}
						}
						if(modified) error_props = ". But these properties are not: "+error_props.join(", "); else error_props = "";
						if(name !== 'myCustomObject') {
							ok(!modified, "All properties of "+name+".prototype should be read-only"+error_props);
						} else {
							ok(modified, "Properties of "+name+".prototype should NOT be read-only");
						}
					})();					
				}
			}
		});




		test("Property of native function prototype - delete",function() {
					
			var err,
				e,
				name,
				i = 0,
				cache;
						
			while(name = natives[i++]) {
				
				if(global[name] instanceof Function  &&  global[name].prototype) {
					
					(function() {
						var ownProps = Object.getOwnPropertyNames(global[name].prototype);
						var prop, i = 0;
						var err;
						var deleted = false;
						var error_props = [];
						while(prop = ownProps[i++]) {
							cache = global[name].prototype[prop];
							try {
								err = "";
								delete global[name].prototype[prop];
							} catch(error) {
								err = error;
							}
							if(prop !== "NaN") {
								if(!err && global[name].prototype[prop] !== cache) {
									global[name].prototype[prop] = cache;
									deleted = true;
									error_props.push(prop);
								}
							} else {
								if(!isNaN(global[name].prototype[prop])) {
									global[name].prototype[prop] = cache;
									deleted = true;
									error_props.push("NaN");
								}
							}
						}
						if(deleted) error_props = ". But these properties are not: "+error_props.join(", "); else error_props = "";
						if(name !== 'myCustomObject') {
							ok(!deleted, "All properties of "+name+".prototype should NOT be deletable"+error_props);
						} else {
							ok(deleted, "Properties of "+name+".prototype should be deletable");
						}
					})();
				}
			}
			
		});		
		



		test("Property of native function prototype - redefine",function() {
					
			var err,
				e,
				name,
				i = 0,
				cache;
						
			while(name = natives[i++]) {
				
				if(global[name] instanceof Function  &&  global[name].prototype) {
					
					(function() {
						var ownProps = Object.getOwnPropertyNames(global[name].prototype);
						var prop, i = 0;
						var err;
						var redefined = false;
						var error_props = [];
						while(prop = ownProps[i++]) {
							cache = Object.getOwnPropertyDescriptor(global[name].prototype, prop).configurable;
							try {
								err = "";
								Object.defineProperty(global[name].prototype, prop, { configurable: true, value: global[name].prototype[prop] });
							} catch(error) {
								err = error;
							}
							if(Object.getOwnPropertyDescriptor(global[name].prototype,prop).configurable !== cache) {
								Object.defineProperty(global[name].prototype, prop, { configurable: cache, value: global[name].prototype[prop] });
								redefined = true;
								error_props.push(prop);
							}
						}
						if(redefined) error_props = ". But these properties are not: "+error_props.join(", "); else error_props = "";
						if(name !== 'myCustomObject') {
							ok(e || !redefined, "All properties of "+name+" should NOT be able to redefine"+error_props);
						} else {
							ok(!e, "Properties of "+name+" should be able to redefine");
						}
					})();	
				}
			}
			
		});				
	}

})(this);

