(function (console) { "use strict";
var Std = function() { };
Std.__name__ = ["Std"];
Std["int"] = function(x) {
	return x | 0;
};
var js = {};
js.Boot = function() { };
js.Boot.__name__ = ["js","Boot"];
js.Boot.getClass = function(o) {
	if((o instanceof Array) && o.__enum__ == null) return Array; else {
		var cl = o.__class__;
		if(cl != null) return cl;
		var name = js.Boot.__nativeClassName(o);
		if(name != null) return js.Boot.__resolveNativeClass(name);
		return null;
	}
};
js.Boot.__nativeClassName = function(o) {
	var name = js.Boot.__toStr.call(o).slice(8,-1);
	if(name == "Object" || name == "Function" || name == "Math" || name == "JSON") return null;
	return name;
};
js.Boot.__resolveNativeClass = function(name) {
	if(typeof window != "undefined") return window[name]; else return global[name];
};
var haxe = {};
haxe.Timer = function() { };
haxe.Timer.__name__ = ["haxe","Timer"];
haxe.Timer.stamp = function() {
	return new Date().getTime() / 1000;
};
Math.__name__ = ["Math"];
haxe.IMap = function() { };
haxe.IMap.__name__ = ["haxe","IMap"];
haxe.IMap.prototype = {
	__class__: haxe.IMap
};
var OldStringMap = function() {
	this.h = { };
};
OldStringMap.__name__ = ["OldStringMap"];
OldStringMap.__interfaces__ = [haxe.IMap];
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
	,__class__: OldStringMap
};
var NewStringMap = function() {
	this.h = { };
};
NewStringMap.__name__ = ["NewStringMap"];
NewStringMap.__interfaces__ = [haxe.IMap];
NewStringMap.prototype = {
	set: function(key,value) {
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
	,__class__: NewStringMap
};
var CachingKeysStringMap = function() {
	this.data = { };
	this.cachedKeys = [];
};
CachingKeysStringMap.__name__ = ["CachingKeysStringMap"];
CachingKeysStringMap.__interfaces__ = [haxe.IMap];
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
			key = "$" + key;
			if(this.dataReserved == null || !this.dataReserved.hasOwnProperty(key)) return false;
			delete(this.dataReserved[key]);
			this.cachedKeys.splice(HxOverrides.indexOf(this.cachedKeys,key,0),1);
			return true;
		}
		if(!this.data.hasOwnProperty(key)) return false;
		delete(this.data[key]);
		this.cachedKeys.splice(HxOverrides.indexOf(this.cachedKeys,key,0),1);
		return true;
	}
	,keys: function() {
		if(this.cachedKeys.length == 0) return CachingKeysStringMap.emptyIterator;
		return HxOverrides.iter(this.cachedKeys);
	}
	,iterator: function() {
		if(this.cachedKeys.length == 0) return CachingKeysStringMap.emptyIterator;
		return new _CachingKeysStringMap.CachingKeysStringMapIterator(this,this.cachedKeys);
	}
	,__class__: CachingKeysStringMap
};
var org = {};
org.zamedev = {};
org.zamedev.lib = {};
org.zamedev.lib.FastIteratingStringMap = function() {
	this.data = { };
	this.dataReserved = { };
	this.head = null;
	this.tail = null;
};
org.zamedev.lib.FastIteratingStringMap.__name__ = ["org","zamedev","lib","FastIteratingStringMap"];
org.zamedev.lib.FastIteratingStringMap.__interfaces__ = [haxe.IMap];
org.zamedev.lib.FastIteratingStringMap.prototype = {
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
			this.data[_key] = item1;
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
		if(this.head == null) return org.zamedev.lib.FastIteratingStringMap.emptyIterator;
		return { _item : this.head, hasNext : function() {
			return this._item != null;
		}, next : function() {
			var result = this._item.key;
			this._item = this._item.next;
			return result;
		}};
	}
	,iterator: function() {
		if(this.head == null) return org.zamedev.lib.FastIteratingStringMap.emptyIterator;
		return { _item : this.head, hasNext : function() {
			return this._item != null;
		}, next : function() {
			var result = this._item.value;
			this._item = this._item.next;
			return result;
		}};
	}
	,__class__: org.zamedev.lib.FastIteratingStringMap
};
var Benchmark = function() { };
Benchmark.__name__ = ["Benchmark"];
Benchmark.log = function(s) {
	window.document.getElementById("log").innerHTML += s.split("&").join("&amp;").split("<").join("&lt;").split(">").join("&gt;").split(" ").join("&nbsp;").split("\n").join("<br />");
	window.scrollTo(0,window.document.body.scrollHeight);
};
Benchmark.oldMapCreator = function() {
	return new OldStringMap();
};
Benchmark.newMapCreator = function() {
	return new NewStringMap();
};
Benchmark.cachingKeysMapCreator = function() {
	return new CachingKeysStringMap();
};
Benchmark.fastIteratingMapCreator = function() {
	return new org.zamedev.lib.FastIteratingStringMap();
};
Benchmark.benchmarkAll = function(entryCount,createMapFunc) {
	var keys = [];
	var halfKeys1 = [];
	var halfKeys2 = [];
	var mid = entryCount / 2 | 0;
	var _g = 0;
	while(_g < entryCount) {
		var i = _g++;
		var key;
		if(i == null) key = "null"; else key = "" + i;
		keys.push(key);
		if(i < mid) halfKeys1.push(key); else halfKeys2.push(key);
	}
	var st = haxe.Timer.stamp();
	var t = 0;
	while(true) {
		var map = createMapFunc();
		var dummy = 0;
		var _g1 = 0;
		while(_g1 < keys.length) {
			var key1 = keys[_g1];
			++_g1;
			map.set(key1,1);
		}
		var idx = 0;
		var $it0 = map.keys();
		while( $it0.hasNext() ) {
			var key2 = $it0.next();
			if(map.exists(key2)) dummy += map.get(key2); else dummy += 0;
			idx++;
			if(idx >= mid) break;
		}
		idx = 0;
		var $it1 = map.iterator();
		while( $it1.hasNext() ) {
			var value = $it1.next();
			dummy++;
			idx++;
			if(idx >= mid) break;
		}
		var _g2 = 0;
		while(_g2 < halfKeys1.length) {
			var key3 = halfKeys1[_g2];
			++_g2;
			map.remove(key3);
		}
		var $it2 = map.keys();
		while( $it2.hasNext() ) {
			var key4 = $it2.next();
			if(map.exists(key4)) dummy += map.get(key4); else dummy += 0;
		}
		var $it3 = map.iterator();
		while( $it3.hasNext() ) {
			var value1 = $it3.next();
			dummy++;
		}
		var _g3 = 0;
		while(_g3 < halfKeys2.length) {
			var key5 = halfKeys2[_g3];
			++_g3;
			map.remove(key5);
		}
		t = haxe.Timer.stamp() - st;
		if(t > 1) break;
	}
	st = haxe.Timer.stamp();
	t = 0;
	var count = 0;
	while(true) {
		var map1 = createMapFunc();
		var dummy1 = 0;
		var _g4 = 0;
		while(_g4 < keys.length) {
			var key6 = keys[_g4];
			++_g4;
			map1.set(key6,1);
		}
		var idx1 = 0;
		var $it4 = map1.keys();
		while( $it4.hasNext() ) {
			var key7 = $it4.next();
			if(map1.exists(key7)) dummy1 += map1.get(key7); else dummy1 += 0;
			idx1++;
			if(idx1 >= mid) break;
		}
		idx1 = 0;
		var $it5 = map1.iterator();
		while( $it5.hasNext() ) {
			var value2 = $it5.next();
			dummy1++;
			idx1++;
			if(idx1 >= mid) break;
		}
		var _g5 = 0;
		while(_g5 < halfKeys1.length) {
			var key8 = halfKeys1[_g5];
			++_g5;
			map1.remove(key8);
		}
		var $it6 = map1.keys();
		while( $it6.hasNext() ) {
			var key9 = $it6.next();
			if(map1.exists(key9)) dummy1 += map1.get(key9); else dummy1 += 0;
		}
		var $it7 = map1.iterator();
		while( $it7.hasNext() ) {
			var value3 = $it7.next();
			dummy1++;
		}
		var _g6 = 0;
		while(_g6 < halfKeys2.length) {
			var key10 = halfKeys2[_g6];
			++_g6;
			map1.remove(key10);
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
		var map = Benchmark.creatorVariants[Benchmark.creatorIndex].func();
		Benchmark.log("\n### " + Type.getClassName(map == null?null:js.Boot.getClass(map)) + "\n\n```\n");
		Benchmark.log("" + Benchmark.entryCountVariants[Benchmark.entryCountIndex] + " | ");
		Benchmark.resultDataEntry = { entryCount : Benchmark.entryCountVariants[Benchmark.entryCountIndex], values : []};
		Benchmark.resultData.entries.push(Benchmark.resultDataEntry);
	} else {
		Benchmark.repeatNumber++;
		if(Benchmark.repeatNumber >= 5) {
			Benchmark.log(" | avg: " + Math.round(Benchmark.iterationsSum / 5) + " per " + Math.round(Benchmark.timeSum / 5) + "\n");
			Benchmark.resultDataEntry.values.push({ type : Benchmark.creatorVariants[Benchmark.creatorIndex].name, value : Math.round(Benchmark.iterationsSum / 5)});
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
						Benchmark.log("\n# Done\n\n");
						Benchmark.log(JSON.stringify(Benchmark.resultData,null,"    "));
						return;
					}
					Benchmark.log("\n## " + Benchmark.benchmarkVariants[Benchmark.benchmarkIndex].name + "\n");
				}
				var map1 = Benchmark.creatorVariants[Benchmark.creatorIndex].func();
				Benchmark.log("\n### " + Type.getClassName(map1 == null?null:js.Boot.getClass(map1)) + "\n\n```\n");
				Benchmark.resultDataEntry = { entryCount : Benchmark.entryCountVariants[Benchmark.entryCountIndex], values : []};
				Benchmark.resultData.entries.push(Benchmark.resultDataEntry);
			}
			Benchmark.log("" + Benchmark.entryCountVariants[Benchmark.entryCountIndex] + " | ");
		}
	}
	var result = Benchmark.benchmarkVariants[Benchmark.benchmarkIndex].func(Benchmark.entryCountVariants[Benchmark.entryCountIndex],Benchmark.creatorVariants[Benchmark.creatorIndex].func);
	if(Benchmark.repeatNumber != 0) Benchmark.log(", ");
	Benchmark.log("" + result.iterations + " per " + result.time);
	Benchmark.iterationsSum += result.iterations;
	Benchmark.timeSum += result.time;
	window.setTimeout(Benchmark.step,5);
};
Benchmark.onstart = function(_) {
	window.document.getElementById("start").disabled = true;
	var browserId;
	if(window.navigator.userAgent.indexOf(" Firefox/") >= 0) browserId = "firefox"; else if(window.navigator.userAgent.indexOf(" Chrome/") >= 0) browserId = "chrome"; else if(window.navigator.userAgent.indexOf(" Safari/") >= 0) browserId = "safari"; else browserId = window.navigator.userAgent;
	Benchmark.log("# " + browserId + "\n");
	Benchmark.resultData = { browser : browserId, entries : []};
	window.setTimeout(Benchmark.step,5);
};
Benchmark.init = function() {
	window.document.getElementById("start").onclick = Benchmark.onstart;
};
Benchmark.main = function() {
	window.setTimeout(Benchmark.init,5);
};
var _CachingKeysStringMap = {};
_CachingKeysStringMap.CachingKeysStringMapIterator = function(map,keys) {
	this.map = map;
	this.keys = keys;
	this.index = 0;
	this.count = keys.length;
};
_CachingKeysStringMap.CachingKeysStringMapIterator.__name__ = ["_CachingKeysStringMap","CachingKeysStringMapIterator"];
_CachingKeysStringMap.CachingKeysStringMapIterator.prototype = {
	hasNext: function() {
		return this.index < this.count;
	}
	,next: function() {
		return this.map.get(this.keys[this.index++]);
	}
	,__class__: _CachingKeysStringMap.CachingKeysStringMapIterator
};
var HxOverrides = function() { };
HxOverrides.__name__ = ["HxOverrides"];
HxOverrides.indexOf = function(a,obj,i) {
	var len = a.length;
	if(i < 0) {
		i += len;
		if(i < 0) i = 0;
	}
	while(i < len) {
		if(a[i] === obj) return i;
		i++;
	}
	return -1;
};
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
var Type = function() { };
Type.__name__ = ["Type"];
Type.getClassName = function(c) {
	var a = c.__name__;
	if(a == null) return null;
	return a.join(".");
};
String.prototype.__class__ = String;
String.__name__ = ["String"];
Array.__name__ = ["Array"];
Date.prototype.__class__ = Date;
Date.__name__ = ["Date"];
var __map_reserved = {}
var __z_map_reserved = {}
var __z_map_reserved = {}
if(Array.prototype.indexOf) HxOverrides.indexOf = function(a,o,i) {
	return Array.prototype.indexOf.call(a,o,i);
};
js.Boot.__toStr = {}.toString;
CachingKeysStringMap.emptyIterator = { hasNext : function() {
	return false;
}, next : function() {
	return null;
}};
org.zamedev.lib.FastIteratingStringMap.emptyIterator = { hasNext : function() {
	return false;
}, next : function() {
	return null;
}};
Benchmark.benchmarkVariants = [{ name : "All", func : Benchmark.benchmarkAll}];
Benchmark.creatorVariants = [{ name : "old", func : Benchmark.oldMapCreator},{ name : "new", func : Benchmark.newMapCreator},{ name : "caching", func : Benchmark.cachingKeysMapCreator},{ name : "fast", func : Benchmark.fastIteratingMapCreator}];
Benchmark.entryCountVariants = [10,100,1000,10000,100000];
Benchmark.benchmarkIndex = -1;
Benchmark.creatorIndex = 0;
Benchmark.entryCountIndex = 0;
Benchmark.repeatNumber = 0;
Benchmark.iterationsSum = 0;
Benchmark.timeSum = 0;
Benchmark.main();
})(typeof console != "undefined" ? console : {log:function(){}});
