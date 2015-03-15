(function (console) { "use strict";
var haxe_IMap = function() { };
haxe_IMap.__name__ = ["haxe","IMap"];
haxe_IMap.prototype = {
	__class__: haxe_IMap
};
var CachingKeysStringMap = function() {
	this.data = { };
	this.cachedKeys = [];
};
CachingKeysStringMap.__name__ = ["CachingKeysStringMap"];
CachingKeysStringMap.__interfaces__ = [haxe_IMap];
CachingKeysStringMap.prototype = {
	set: function(key,value) {
		if(__z_map_reserved[key] != null) {
			if(this.dataReserved == null) this.dataReserved = { };
			var _key = "$" + key;
			if(!this.dataReserved.hasOwnProperty(_key)) this.cachedKeys.push(key);
			this.dataReserved[_key] = value;
		} else {
			if(!this.data.hasOwnProperty(key)) this.cachedKeys.push(key);
			this.data[key] = value;
		}
	}
	,get: function(key) {
		if(__z_map_reserved[key] != null) if(this.dataReserved == null) return null; else return this.dataReserved["$" + key];
		return this.data[key];
	}
	,exists: function(key) {
		if(__z_map_reserved[key] != null) if(this.dataReserved == null) return false; else return this.dataReserved.hasOwnProperty("$" + key);
		return this.data.hasOwnProperty(key);
	}
	,remove: function(key) {
		if(__z_map_reserved[key] != null) {
			if(this.dataReserved == null) return false;
			var _key = "$" + key;
			if(!this.dataReserved.hasOwnProperty(_key)) return false;
			delete(this.dataReserved[_key]);
			this.cachedKeys.splice(__z_map_indexOf.call(this.cachedKeys, key),1);
			return true;
		}
		if(!this.data.hasOwnProperty(key)) return false;
		delete(this.data[key]);
		this.cachedKeys.splice(__z_map_indexOf.call(this.cachedKeys, key),1);
		return true;
	}
	,keys: function() {
		if(this.cachedKeys.length == 0) return CachingKeysStringMap.emptyIterator;
		return HxOverrides.iter(this.cachedKeys);
	}
	,__class__: CachingKeysStringMap
};
var HxOverrides = function() { };
HxOverrides.__name__ = ["HxOverrides"];
HxOverrides.iter = function(a) {
	return { cur : 0, arr : a, hasNext : function() {
		return this.cur < this.arr.length;
	}, next : function() {
		return this.arr[this.cur++];
	}};
};
Math.__name__ = ["Math"];
var Reflect = function() { };
Reflect.__name__ = ["Reflect"];
Reflect.compare = function(a,b) {
	if(a == b) return 0; else if(a > b) return 1; else return -1;
};
var Std = function() { };
Std.__name__ = ["Std"];
Std.string = function(s) {
	return js_Boot.__string_rec(s,"");
};
var StringBuf = function() {
	this.b = "";
};
StringBuf.__name__ = ["StringBuf"];
StringBuf.prototype = {
	add: function(x) {
		this.b += Std.string(x);
	}
	,__class__: StringBuf
};
var Test = function() { };
Test.__name__ = ["Test"];
Test.log = function(s) {
	window.document.getElementById("log").innerHTML += s.split("&").join("&amp;").split("<").join("&lt;").split(">").join("&gt;").split(" ").join("&nbsp;").split("\n").join("<br />");
	window.scrollTo(0,window.document.body.scrollHeight);
};
Test.stringRepresentation = function(map) {
	var keys = org_zamedev_lib_LabmdaExt.array(map.keys());
	keys.sort(Reflect.compare);
	var sb = new StringBuf();
	var sep = false;
	var _g = 0;
	while(_g < keys.length) {
		var key = keys[_g];
		++_g;
		if(sep) sb.b += ";";
		if(key == null) sb.b += "null"; else sb.b += "" + key;
		sb.b += "=";
		sb.add(Std.string(map.get(key)));
		sep = true;
	}
	return sb.b;
};
Test.compare = function(name,actual,expected) {
	if(actual != expected) {
		Test.log("" + name + " - FAILED\n");
		Test.log("EXPECTED - \"" + expected + "\"\n");
		Test.log("ACTUAL - \"" + actual + "\"\n");
		return false;
	}
	Test.log("" + name + " - PASSED\n");
	return true;
};
Test.test = function(map) {
	var passed = true;
	Test.log("[ " + Type.getClassName(map == null?null:js_Boot.getClass(map)) + " ]\n\n");
	if(!Test.compare("Initial",Test.stringRepresentation(map),"")) passed = false;
	if(!Test.compare("Exists non-existing non-reserved #1",Std.string(map.exists("k1")),"false")) passed = false;
	if(!Test.compare("Get non-existing non-reserved #1",Std.string(map.get("k1")),"null")) passed = false;
	if(!Test.compare("Exists non-existing reserved #1",Std.string(map.exists("__proto__")),"false")) passed = false;
	if(!Test.compare("Get non-existing reserved #1",Std.string(map.get("__proto__")),"null")) passed = false;
	map.set("k1",1);
	map.set("k3",3);
	if(!Test.compare("Set first and last non-reserved",Test.stringRepresentation(map),"k1=1;k3=3")) passed = false;
	if(!Test.compare("Exists non-existing non-reserved #2",Std.string(map.exists("k2")),"false")) passed = false;
	map.set("__proto__",101);
	if(!Test.compare("Set first reserved",Test.stringRepresentation(map),"__proto__=101;k1=1;k3=3")) passed = false;
	map.set("k2",2);
	map.set("toString",102);
	map.set("valueOf",103);
	if(!Test.compare("Set more #1",Test.stringRepresentation(map),"__proto__=101;k1=1;k2=2;k3=3;toString=102;valueOf=103")) passed = false;
	map.set("k3",3);
	if(!Test.compare("Set existing to the same value",Test.stringRepresentation(map),"__proto__=101;k1=1;k2=2;k3=3;toString=102;valueOf=103")) passed = false;
	map.set("hasOwnProperty",104);
	map.set("toSource",105);
	if(!Test.compare("Set more #2",Test.stringRepresentation(map),"__proto__=101;hasOwnProperty=104;k1=1;k2=2;k3=3;toSource=105;toString=102;valueOf=103")) passed = false;
	map.set("k3",4);
	if(!Test.compare("Set existing to the different value",Test.stringRepresentation(map),"__proto__=101;hasOwnProperty=104;k1=1;k2=2;k3=4;toSource=105;toString=102;valueOf=103")) passed = false;
	map.set("isPrototypeOf",106);
	map.set("toLocaleString",107);
	if(!Test.compare("Set more #3",Test.stringRepresentation(map),"__proto__=101;hasOwnProperty=104;isPrototypeOf=106;k1=1;k2=2;k3=4;toLocaleString=107;toSource=105;toString=102;valueOf=103")) passed = false;
	if(!Test.compare("Exists existing non-reserved #1",Std.string(map.exists("k2")),"true")) passed = false;
	if(!Test.compare("Get existing non-reserved #1",Std.string(map.get("k3")),"4")) passed = false;
	if(!Test.compare("Exists existing reserved #1",Std.string(map.exists("toString")),"true")) passed = false;
	if(!Test.compare("Get existing reserved #1",Std.string(map.get("hasOwnProperty")),"104")) passed = false;
	map.remove("k1");
	if(!Test.compare("Remove non-reserved #1",Test.stringRepresentation(map),"__proto__=101;hasOwnProperty=104;isPrototypeOf=106;k2=2;k3=4;toLocaleString=107;toSource=105;toString=102;valueOf=103")) passed = false;
	map.remove("__proto__");
	if(!Test.compare("Remove first reserved #1",Test.stringRepresentation(map),"hasOwnProperty=104;isPrototypeOf=106;k2=2;k3=4;toLocaleString=107;toSource=105;toString=102;valueOf=103")) passed = false;
	map.remove("valueOf");
	if(!Test.compare("Remove last reserved #1",Test.stringRepresentation(map),"hasOwnProperty=104;isPrototypeOf=106;k2=2;k3=4;toLocaleString=107;toSource=105;toString=102")) passed = false;
	map.remove("hasOwnProperty");
	if(!Test.compare("Remove first reserved #2",Test.stringRepresentation(map),"isPrototypeOf=106;k2=2;k3=4;toLocaleString=107;toSource=105;toString=102")) passed = false;
	map.remove("toString");
	if(!Test.compare("Remove last reserved #2",Test.stringRepresentation(map),"isPrototypeOf=106;k2=2;k3=4;toLocaleString=107;toSource=105")) passed = false;
	map.set("a1",11);
	if(!Test.compare("Set first non-reserved",Test.stringRepresentation(map),"a1=11;isPrototypeOf=106;k2=2;k3=4;toLocaleString=107;toSource=105")) passed = false;
	map.set("a2",12);
	if(!Test.compare("Set non-reserved",Test.stringRepresentation(map),"a1=11;a2=12;isPrototypeOf=106;k2=2;k3=4;toLocaleString=107;toSource=105")) passed = false;
	map.set("z2",14);
	if(!Test.compare("Set last non-reserved",Test.stringRepresentation(map),"a1=11;a2=12;isPrototypeOf=106;k2=2;k3=4;toLocaleString=107;toSource=105;z2=14")) passed = false;
	map.set("z1",13);
	if(!Test.compare("Set non-reserved",Test.stringRepresentation(map),"a1=11;a2=12;isPrototypeOf=106;k2=2;k3=4;toLocaleString=107;toSource=105;z1=13;z2=14")) passed = false;
	map.remove("toLocaleString");
	if(!Test.compare("Remove reserved #1",Test.stringRepresentation(map),"a1=11;a2=12;isPrototypeOf=106;k2=2;k3=4;toSource=105;z1=13;z2=14")) passed = false;
	map.remove("isPrototypeOf");
	if(!Test.compare("Remove reserved #2",Test.stringRepresentation(map),"a1=11;a2=12;k2=2;k3=4;toSource=105;z1=13;z2=14")) passed = false;
	map.remove("k2");
	if(!Test.compare("Remove non-reserved #2",Test.stringRepresentation(map),"a1=11;a2=12;k3=4;toSource=105;z1=13;z2=14")) passed = false;
	map.remove("k3");
	if(!Test.compare("Remove non-reserved #3",Test.stringRepresentation(map),"a1=11;a2=12;toSource=105;z1=13;z2=14")) passed = false;
	map.remove("toSource");
	if(!Test.compare("Remove reserved #3",Test.stringRepresentation(map),"a1=11;a2=12;z1=13;z2=14")) passed = false;
	map.remove("a2");
	if(!Test.compare("Remove non-reserved #4",Test.stringRepresentation(map),"a1=11;z1=13;z2=14")) passed = false;
	map.remove("a1");
	if(!Test.compare("Remove first non-reserved",Test.stringRepresentation(map),"z1=13;z2=14")) passed = false;
	map.remove("z2");
	if(!Test.compare("Remove last non-reserved",Test.stringRepresentation(map),"z1=13")) passed = false;
	map.remove("z1");
	if(!Test.compare("Remove the last one non-reserved",Test.stringRepresentation(map),"")) passed = false;
	if(passed) Test.log("\nSummary - PASSED\n\n"); else Test.log("\nSummary - FAILED\n\n");
};
Test.init = function() {
	Test.test(new CachingKeysStringMap());
	Test.test(new org_zamedev_lib_FastIteratingStringMap());
};
Test.main = function() {
	window.setTimeout(Test.init,1);
};
var Type = function() { };
Type.__name__ = ["Type"];
Type.getClassName = function(c) {
	var a = c.__name__;
	if(a == null) return null;
	return a.join(".");
};
var js_Boot = function() { };
js_Boot.__name__ = ["js","Boot"];
js_Boot.getClass = function(o) {
	if((o instanceof Array) && o.__enum__ == null) return Array; else {
		var cl = o.__class__;
		if(cl != null) return cl;
		var name = js_Boot.__nativeClassName(o);
		if(name != null) return js_Boot.__resolveNativeClass(name);
		return null;
	}
};
js_Boot.__string_rec = function(o,s) {
	if(o == null) return "null";
	if(s.length >= 5) return "<...>";
	var t = typeof(o);
	if(t == "function" && (o.__name__ || o.__ename__)) t = "object";
	switch(t) {
	case "object":
		if(o instanceof Array) {
			if(o.__enum__) {
				if(o.length == 2) return o[0];
				var str2 = o[0] + "(";
				s += "\t";
				var _g1 = 2;
				var _g = o.length;
				while(_g1 < _g) {
					var i1 = _g1++;
					if(i1 != 2) str2 += "," + js_Boot.__string_rec(o[i1],s); else str2 += js_Boot.__string_rec(o[i1],s);
				}
				return str2 + ")";
			}
			var l = o.length;
			var i;
			var str1 = "[";
			s += "\t";
			var _g2 = 0;
			while(_g2 < l) {
				var i2 = _g2++;
				str1 += (i2 > 0?",":"") + js_Boot.__string_rec(o[i2],s);
			}
			str1 += "]";
			return str1;
		}
		var tostr;
		try {
			tostr = o.toString;
		} catch( e ) {
			return "???";
		}
		if(tostr != null && tostr != Object.toString && typeof(tostr) == "function") {
			var s2 = o.toString();
			if(s2 != "[object Object]") return s2;
		}
		var k = null;
		var str = "{\n";
		s += "\t";
		var hasp = o.hasOwnProperty != null;
		for( var k in o ) {
		if(hasp && !o.hasOwnProperty(k)) {
			continue;
		}
		if(k == "prototype" || k == "__class__" || k == "__super__" || k == "__interfaces__" || k == "__properties__") {
			continue;
		}
		if(str.length != 2) str += ", \n";
		str += s + k + " : " + js_Boot.__string_rec(o[k],s);
		}
		s = s.substring(1);
		str += "\n" + s + "}";
		return str;
	case "function":
		return "<function>";
	case "string":
		return o;
	default:
		return String(o);
	}
};
js_Boot.__nativeClassName = function(o) {
	var name = js_Boot.__toStr.call(o).slice(8,-1);
	if(name == "Object" || name == "Function" || name == "Math" || name == "JSON") return null;
	return name;
};
js_Boot.__resolveNativeClass = function(name) {
	if(typeof window != "undefined") return window[name]; else return global[name];
};
var org_zamedev_lib_FastIteratingStringMap = function() {
	this.data = { };
	this.dataReserved = { };
	this.head = null;
	this.tail = null;
};
org_zamedev_lib_FastIteratingStringMap.__name__ = ["org","zamedev","lib","FastIteratingStringMap"];
org_zamedev_lib_FastIteratingStringMap.__interfaces__ = [haxe_IMap];
org_zamedev_lib_FastIteratingStringMap.prototype = {
	set: function(key,value) {
		if(__z_map_reserved[key] != null) {
			var _key = "$" + key;
			if(this.dataReserved.hasOwnProperty(_key)) this.dataReserved[_key].value = value; else {
				var item = { prev : this.tail, key : key, value : value, next : null};
				this.dataReserved[_key] = item;
				if(this.tail != null) this.tail.next = item;
				this.tail = item;
				if(this.head == null) this.head = item;
			}
		} else if(this.data.hasOwnProperty(key)) this.data[key].value = value; else {
			var item1 = { prev : this.tail, key : key, value : value, next : null};
			this.data[key] = item1;
			if(this.tail != null) this.tail.next = item1;
			this.tail = item1;
			if(this.head == null) this.head = item1;
		}
	}
	,get: function(key) {
		if(__z_map_reserved[key] != null) {
			key = "$" + key;
			if(this.dataReserved.hasOwnProperty(key)) return this.dataReserved[key].value; else return null;
		} else if(this.data.hasOwnProperty(key)) return this.data[key].value; else return null;
	}
	,exists: function(key) {
		if(__z_map_reserved[key] != null) return this.dataReserved.hasOwnProperty("$" + key); else return this.data.hasOwnProperty(key);
	}
	,remove: function(key) {
		if(__z_map_reserved[key] != null) {
			key = "$" + key;
			if(!this.dataReserved.hasOwnProperty(key)) return false;
			var item = this.dataReserved[key];
			var prev = item.prev;
			var next = item.next;
			delete(this.dataReserved[key]);
			if(prev != null) prev.next = next;
			if(next != null) next.prev = prev;
			if(this.head == item) this.head = next;
			if(this.tail == item) this.tail = prev;
			item.prev = null;
			item.next = null;
			return true;
		} else {
			if(!this.data.hasOwnProperty(key)) return false;
			var item1 = this.data[key];
			var prev1 = item1.prev;
			var next1 = item1.next;
			delete(this.data[key]);
			if(prev1 != null) prev1.next = next1;
			if(next1 != null) next1.prev = prev1;
			if(this.head == item1) this.head = next1;
			if(this.tail == item1) this.tail = prev1;
			item1.prev = null;
			item1.next = null;
			return true;
		}
	}
	,keys: function() {
		if(this.head == null) return org_zamedev_lib_FastIteratingStringMap.emptyIterator;
		return { _item : this.head, hasNext : function() {
			return this._item != null;
		}, next : function() {
			var result = this._item.key;
			this._item = this._item.next;
			return result;
		}};
	}
	,__class__: org_zamedev_lib_FastIteratingStringMap
};
var org_zamedev_lib_LabmdaExt = function() { };
org_zamedev_lib_LabmdaExt.__name__ = ["org","zamedev","lib","LabmdaExt"];
org_zamedev_lib_LabmdaExt.array = function(it) {
	var a = [];
	while( it.hasNext() ) {
		var i = it.next();
		a.push(i);
	}
	return a;
};

			var __z_map_reserved = {};

			var __z_map_indexOf = Array.prototype.indexOf || function(v) {
				for (var i = 0, l = this.length; i < l; i++) {
					if (this[i] == v) {
						return i;
					}
				}

				return -1;
			};
		;
String.prototype.__class__ = String;
String.__name__ = ["String"];
Array.__name__ = ["Array"];
var __z_map_reserved = {}
CachingKeysStringMap.emptyIterator = { hasNext : function() {
	return false;
}, next : function() {
	return null;
}};
js_Boot.__toStr = {}.toString;
org_zamedev_lib_FastIteratingStringMap.emptyIterator = { hasNext : function() {
	return false;
}, next : function() {
	return null;
}};
Test.main();
})(typeof console != "undefined" ? console : {log:function(){}});
