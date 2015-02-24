(function () { "use strict";
var Std = function() { };
Std.__name__ = ["Std"];
Std.string = function(s) {
	return js.Boot.__string_rec(s,"");
};
Std["int"] = function(x) {
	return x | 0;
};
var js = {};
js.Boot = function() { };
js.Boot.__name__ = ["js","Boot"];
js.Boot.__string_rec = function(o,s) {
	if(o == null) return "null";
	if(s.length >= 5) return "<...>";
	var t = typeof(o);
	if(t == "function" && (o.__name__ || o.__ename__)) t = "object";
	switch(t) {
	case "object":
		if(o instanceof Array) {
			if(o.__enum__) {
				if(o.length == 2) return o[0];
				var str = o[0] + "(";
				s += "\t";
				var _g1 = 2;
				var _g = o.length;
				while(_g1 < _g) {
					var i = _g1++;
					if(i != 2) str += "," + js.Boot.__string_rec(o[i],s); else str += js.Boot.__string_rec(o[i],s);
				}
				return str + ")";
			}
			var l = o.length;
			var i1;
			var str1 = "[";
			s += "\t";
			var _g2 = 0;
			while(_g2 < l) {
				var i2 = _g2++;
				str1 += (i2 > 0?",":"") + js.Boot.__string_rec(o[i2],s);
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
		if(tostr != null && tostr != Object.toString) {
			var s2 = o.toString();
			if(s2 != "[object Object]") return s2;
		}
		var k = null;
		var str2 = "{\n";
		s += "\t";
		var hasp = o.hasOwnProperty != null;
		for( var k in o ) {
		if(hasp && !o.hasOwnProperty(k)) {
			continue;
		}
		if(k == "prototype" || k == "__class__" || k == "__super__" || k == "__interfaces__" || k == "__properties__") {
			continue;
		}
		if(str2.length != 2) str2 += ", \n";
		str2 += s + k + " : " + js.Boot.__string_rec(o[k],s);
		}
		s = s.substring(1);
		str2 += "\n" + s + "}";
		return str2;
	case "function":
		return "<function>";
	case "string":
		return o;
	default:
		return String(o);
	}
};
var haxe = {};
haxe.Timer = function() { };
haxe.Timer.__name__ = ["haxe","Timer"];
haxe.Timer.stamp = function() {
	return new Date().getTime() / 1000;
};
Math.__name__ = ["Math"];
var IMap = function() { };
IMap.__name__ = ["IMap"];
IMap.prototype = {
	__class__: IMap
};
var OldStringMap = function() {
	this.h = { };
};
OldStringMap.__name__ = ["OldStringMap"];
OldStringMap.__interfaces__ = [IMap];
OldStringMap.prototype = {
	set: function(key,value) {
		this.h["$" + key] = value;
	}
	,get: function(key) {
		return this.h["$" + key];
	}
	,exists: function(key) {
		return this.h.hasOwnProperty("$" + key);
	}
	,remove: function(key) {
		key = "$" + key;
		if(!this.h.hasOwnProperty(key)) return false;
		delete(this.h[key]);
		return true;
	}
	,keys: function() {
		var a = [];
		for( var key in this.h ) {
		if(this.h.hasOwnProperty(key)) a.push(key.substr(1));
		}
		return HxOverrides.iter(a);
	}
	,iterator: function() {
		return { ref : this.h, it : this.keys(), hasNext : function() {
			return this.it.hasNext();
		}, next : function() {
			var i = this.it.next();
			return this.ref["$" + i];
		}};
	}
	,toString: function() {
		var s = new StringBuf();
		s.b += "{";
		var it = this.keys();
		while( it.hasNext() ) {
			var i = it.next();
			if(i == null) s.b += "null"; else s.b += "" + i;
			s.b += " => ";
			s.add(Std.string(this.get(i)));
			if(it.hasNext()) s.b += ", ";
		}
		s.b += "}";
		return s.b;
	}
	,__class__: OldStringMap
};
var NewStringMap = function() {
	this.h = { };
};
NewStringMap.__name__ = ["NewStringMap"];
NewStringMap.__interfaces__ = [IMap];
NewStringMap.prototype = {
	isReserved: function(key) {
		return __map_reserved[key] != null;
	}
	,set: function(key,value) {
		if(__map_reserved[key] != null) this.setReserved(key,value); else this.h[key] = value;
	}
	,get: function(key) {
		if(__map_reserved[key] != null) return this.getReserved(key);
		return this.h[key];
	}
	,exists: function(key) {
		if(__map_reserved[key] != null) return this.existsReserved(key);
		return this.h.hasOwnProperty(key);
	}
	,setReserved: function(key,value) {
		if(this.rh == null) this.rh = { };
		this.rh["$" + key] = value;
	}
	,getReserved: function(key) {
		if(this.rh == null) return null; else return this.rh["$" + key];
	}
	,existsReserved: function(key) {
		if(this.rh == null) return false;
		return this.rh.hasOwnProperty("$" + key);
	}
	,remove: function(key) {
		if(__map_reserved[key] != null) {
			key = "$" + key;
			if(this.rh == null || !this.rh.hasOwnProperty(key)) return false;
			delete(this.rh[key]);
			return true;
		} else {
			if(!this.h.hasOwnProperty(key)) return false;
			delete(this.h[key]);
			return true;
		}
	}
	,keys: function() {
		var _this = this.arrayKeys();
		return HxOverrides.iter(_this);
	}
	,arrayKeys: function() {
		var out = [];
		for( var key in this.h ) {
		if(this.h.hasOwnProperty(key)) out.push(key);
		}
		if(this.rh != null) {
			for( var key in this.rh ) {
			if(key.charCodeAt(0) == 36) out.push(key.substr(1));
			}
		}
		return out;
	}
	,iterator: function() {
		return new _NewStringMap.StringMapIterator(this,this.arrayKeys());
	}
	,toString: function() {
		var s = new StringBuf();
		s.b += "{";
		var keys = this.arrayKeys();
		var _g1 = 0;
		var _g = keys.length;
		while(_g1 < _g) {
			var i = _g1++;
			var k = keys[i];
			if(k == null) s.b += "null"; else s.b += "" + k;
			s.b += " => ";
			s.add(Std.string(__map_reserved[k] != null?this.getReserved(k):this.h[k]));
			if(i < keys.length) s.b += ", ";
		}
		s.b += "}";
		return s.b;
	}
	,__class__: NewStringMap
};
var org = {};
org.zamedev = {};
org.zamedev.lib = {};
org.zamedev.lib.FastIteratingStringMap = function() {
	this.data = { };
	this.head = null;
	this.tail = null;
};
org.zamedev.lib.FastIteratingStringMap.__name__ = ["org","zamedev","lib","FastIteratingStringMap"];
org.zamedev.lib.FastIteratingStringMap.__interfaces__ = [IMap];
org.zamedev.lib.FastIteratingStringMap.prototype = {
	set: function(key,value) {
		var _key;
		if(__z_map_reserved[key] == null) _key = key; else _key = "$" + key;
		if(this.data.hasOwnProperty(_key)) this.data[_key].value = value; else {
			this.data[_key] = { prev : this.tail, key : key, value : value, next : null};
			if(this.tail != null) this.data[this.tail].next = _key;
			this.tail = _key;
			if(this.head == null) this.head = _key;
		}
	}
	,get: function(key) {
		if(__z_map_reserved[key] != null) key = "$" + key;
		if(this.data.hasOwnProperty(key)) return this.data[key].value; else return null;
	}
	,exists: function(key) {
		if(__z_map_reserved[key] != null) key = "$" + key;
		return this.data.hasOwnProperty(key);
	}
	,remove: function(key) {
		if(__z_map_reserved[key] != null) key = "$" + key;
		if(!this.data.hasOwnProperty(key)) return false;
		var item = this.data[key];
		var prev = item.prev;
		var next = item.next;
		delete(this.data[key]);
		if(prev != null) this.data[prev].next = next;
		if(next != null) this.data[next].prev = prev;
		if(this.head == key) this.head = next;
		if(this.tail == key) this.tail = prev;
		item.prev = null;
		item.next = null;
		return true;
	}
	,keys: function() {
		if(this.head == null) return org.zamedev.lib.FastIteratingStringMap.emptyIterator;
		return { _data : this.data, _key : this.head, hasNext : function() {
			return this._key != null;
		}, next : function() {
			var item = this._data[this._key];
			this._key = item.next;
			return item.key;
		}};
	}
	,iterator: function() {
		if(this.head == null) return org.zamedev.lib.FastIteratingStringMap.emptyIterator;
		return { _data : this.data, _key : this.head, hasNext : function() {
			return this._key != null;
		}, next : function() {
			var item = this._data[this._key];
			this._key = item.next;
			return item.value;
		}};
	}
	,toString: function() {
		var s = new StringBuf();
		s.b += "{";
		var _key = this.head;
		while(_key != null) {
			var item = this.data[_key];
			s.b += Std.string(item.key);
			s.b += " => ";
			s.add(Std.string(item.value));
			_key = item.next;
			if(_key != null) s.b += ", ";
		}
		s.b += "}";
		return s.b;
	}
	,__class__: org.zamedev.lib.FastIteratingStringMap
};
var Benchmark = function() { };
Benchmark.__name__ = ["Benchmark"];
Benchmark.log = function(s) {
	window.document.getElementById("log").innerHTML += s.split("&").join("&amp;").split("<").join("&lt;").split(">").join("&gt;").split("\n").join("<br />");
	window.scrollTo(0,window.document.body.scrollHeight);
};
Benchmark.oldMapCreator = function() {
	return new OldStringMap();
};
Benchmark.newMapCreator = function() {
	return new NewStringMap();
};
Benchmark.fastIteratingMapCreator = function() {
	return new org.zamedev.lib.FastIteratingStringMap();
};
Benchmark.benchmarkIterateOnly = function(entryCount,createMapFunc) {
	var map = createMapFunc();
	var _g = 0;
	while(_g < entryCount) {
		var i = _g++;
		map.set(i == null?"null":"" + i,i);
	}
	var st = haxe.Timer.stamp();
	var t = 0;
	while(true) {
		var dummy = 0;
		var $it0 = map.keys();
		while( $it0.hasNext() ) {
			var key = $it0.next();
			dummy++;
		}
		var $it1 = map.iterator();
		while( $it1.hasNext() ) {
			var value = $it1.next();
			dummy++;
		}
		t = haxe.Timer.stamp() - st;
		if(t > 1) break;
	}
	st = haxe.Timer.stamp();
	t = 0;
	var count = 0;
	while(true) {
		var dummy1 = 0;
		var $it2 = map.keys();
		while( $it2.hasNext() ) {
			var key1 = $it2.next();
			dummy1++;
		}
		var $it3 = map.iterator();
		while( $it3.hasNext() ) {
			var value1 = $it3.next();
			dummy1++;
		}
		count++;
		t = haxe.Timer.stamp() - st;
		if(t > 4) break;
	}
	return { iterations : count, time : Std["int"](Math.round(t * 1000))};
};
Benchmark.benchmarkNoIterate = function(entryCount,createMapFunc) {
	var keys = new Array();
	var _g = 0;
	while(_g < entryCount) {
		var i = _g++;
		keys.push(i == null?"null":"" + i);
	}
	var st = haxe.Timer.stamp();
	var t = 0;
	while(true) {
		var map = createMapFunc();
		var _g1 = 0;
		while(_g1 < keys.length) {
			var key = keys[_g1];
			++_g1;
			map.set(key,1);
			map.set(key,map.exists(key)?map.get(key) + 1:0);
		}
		var _g2 = 0;
		while(_g2 < keys.length) {
			var key1 = keys[_g2];
			++_g2;
			map.remove(key1);
		}
		t = haxe.Timer.stamp() - st;
		if(t > 1) break;
	}
	st = haxe.Timer.stamp();
	t = 0;
	var count = 0;
	while(true) {
		var map1 = createMapFunc();
		var _g3 = 0;
		while(_g3 < keys.length) {
			var key2 = keys[_g3];
			++_g3;
			map1.set(key2,1);
			map1.set(key2,map1.exists(key2)?map1.get(key2) + 1:0);
		}
		var _g4 = 0;
		while(_g4 < keys.length) {
			var key3 = keys[_g4];
			++_g4;
			map1.remove(key3);
		}
		count++;
		t = haxe.Timer.stamp() - st;
		if(t > 4) break;
	}
	return { iterations : count, time : Std["int"](Math.round(t * 1000))};
};
Benchmark.benchmarkCombined = function(entryCount,createMapFunc) {
	var map = createMapFunc();
	var _g = 0;
	while(_g < entryCount) {
		var i = _g++;
		map.set(i == null?"null":"" + i,i);
	}
	var st = haxe.Timer.stamp();
	var t = 0;
	while(true) {
		var dummy = 0;
		var $it0 = map.keys();
		while( $it0.hasNext() ) {
			var key = $it0.next();
			if(map.exists(key)) dummy += map.get(key); else dummy += 0;
		}
		var $it1 = map.iterator();
		while( $it1.hasNext() ) {
			var value = $it1.next();
			dummy++;
		}
		t = haxe.Timer.stamp() - st;
		if(t > 1) break;
	}
	st = haxe.Timer.stamp();
	t = 0;
	var count = 0;
	while(true) {
		var dummy1 = 0;
		var $it2 = map.keys();
		while( $it2.hasNext() ) {
			var key1 = $it2.next();
			if(map.exists(key1)) dummy1 += map.get(key1); else dummy1 += 0;
		}
		var $it3 = map.iterator();
		while( $it3.hasNext() ) {
			var value1 = $it3.next();
			dummy1++;
		}
		count++;
		t = haxe.Timer.stamp() - st;
		if(t > 4) break;
	}
	return { iterations : count, time : Std["int"](Math.round(t * 1000))};
};
Benchmark.step = function() {
	if(Benchmark.benchmarkIndex < 0) {
		Benchmark.benchmarkIndex = 0;
		Benchmark.log("\n## " + Benchmark.benchmarkVariants[Benchmark.benchmarkIndex].name + "\n");
		var map = Benchmark.creatorVariants[Benchmark.creatorIndex]();
		Benchmark.log("\n### " + Type.getClassName(Type.getClass(map)) + "\n\n```\n");
		Benchmark.log("" + Benchmark.entryCountVariants[Benchmark.entryCountIndex] + " | ");
	} else {
		Benchmark.repeatNumber++;
		if(Benchmark.repeatNumber >= 5) {
			Benchmark.log(" | avg: " + Math.round(Benchmark.iterationsSum / 5) + " per " + Math.round(Benchmark.timeSum / 5) + "\n");
			Benchmark.iterationsSum = 0;
			Benchmark.timeSum = 0;
			Benchmark.repeatNumber = 0;
			Benchmark.entryCountIndex++;
			if(Benchmark.entryCountIndex >= Benchmark.entryCountVariants.length) {
				Benchmark.log("```\n");
				Benchmark.entryCountIndex = 0;
				Benchmark.creatorIndex++;
				if(Benchmark.creatorIndex >= Benchmark.creatorVariants.length) {
					Benchmark.creatorIndex = 0;
					Benchmark.benchmarkIndex++;
					if(Benchmark.benchmarkIndex >= Benchmark.benchmarkVariants.length) {
						Benchmark.log("\n# Done");
						return;
					}
					Benchmark.log("\n## " + Benchmark.benchmarkVariants[Benchmark.benchmarkIndex].name + "\n");
				}
				var map1 = Benchmark.creatorVariants[Benchmark.creatorIndex]();
				Benchmark.log("\n### " + Type.getClassName(Type.getClass(map1)) + "\n\n```\n");
			}
			Benchmark.log("" + Benchmark.entryCountVariants[Benchmark.entryCountIndex] + " | ");
		}
	}
	var result = Benchmark.benchmarkVariants[Benchmark.benchmarkIndex].func(Benchmark.entryCountVariants[Benchmark.entryCountIndex],Benchmark.creatorVariants[Benchmark.creatorIndex]);
	if(Benchmark.repeatNumber != 0) Benchmark.log(", ");
	Benchmark.log("" + result.iterations + " per " + result.time);
	Benchmark.iterationsSum += result.iterations;
	Benchmark.timeSum += result.time;
	window.setTimeout(Benchmark.step,1);
};
Benchmark.onstart = function(_) {
	window.document.getElementById("start").disabled = true;
	Benchmark.log("# " + window.navigator.userAgent + "\n");
	window.setTimeout(Benchmark.step,1);
};
Benchmark.init = function() {
	window.document.getElementById("start").onclick = Benchmark.onstart;
};
Benchmark.main = function() {
	window.setTimeout(Benchmark.init,1);
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
var _NewStringMap = {};
_NewStringMap.StringMapIterator = function(map,keys) {
	this.map = map;
	this.keys = keys;
	this.index = 0;
	this.count = keys.length;
};
_NewStringMap.StringMapIterator.__name__ = ["_NewStringMap","StringMapIterator"];
_NewStringMap.StringMapIterator.prototype = {
	hasNext: function() {
		return this.index < this.count;
	}
	,next: function() {
		return this.map.get(this.keys[this.index++]);
	}
	,__class__: _NewStringMap.StringMapIterator
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
var Type = function() { };
Type.__name__ = ["Type"];
Type.getClass = function(o) {
	if(o == null) return null;
	if((o instanceof Array) && o.__enum__ == null) return Array; else return o.__class__;
};
Type.getClassName = function(c) {
	var a = c.__name__;
	return a.join(".");
};
String.prototype.__class__ = String;
String.__name__ = ["String"];
Array.__name__ = ["Array"];
Date.prototype.__class__ = Date;
Date.__name__ = ["Date"];
Math.NaN = Number.NaN;
Math.NEGATIVE_INFINITY = Number.NEGATIVE_INFINITY;
Math.POSITIVE_INFINITY = Number.POSITIVE_INFINITY;
Math.isFinite = function(i) {
	return isFinite(i);
};
Math.isNaN = function(i1) {
	return isNaN(i1);
};
var __map_reserved = {}
var __z_map_reserved = {}
org.zamedev.lib.FastIteratingStringMap.emptyIterator = { hasNext : function() {
	return false;
}, next : function() {
	return null;
}};
Benchmark.WARMUP_SECONDS = 1;
Benchmark.COMPUTATION_SECONDS = 4;
Benchmark.REPEAT_COUNT = 5;
Benchmark.benchmarkVariants = [{ name : "Iteration only", func : Benchmark.benchmarkIterateOnly},{ name : "Without iteration", func : Benchmark.benchmarkNoIterate},{ name : "Combined", func : Benchmark.benchmarkCombined}];
Benchmark.creatorVariants = [Benchmark.oldMapCreator,Benchmark.newMapCreator,Benchmark.fastIteratingMapCreator];
Benchmark.entryCountVariants = [10,100,1000,10000,100000];
Benchmark.benchmarkIndex = -1;
Benchmark.creatorIndex = 0;
Benchmark.entryCountIndex = 0;
Benchmark.repeatNumber = 0;
Benchmark.iterationsSum = 0;
Benchmark.timeSum = 0;
Benchmark.main();
})();
