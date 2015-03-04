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
var CachingStringMapV3 = function() {
	this.cachedKeys = [];
	this.h = { };
};
CachingStringMapV3.__name__ = ["CachingStringMapV3"];
CachingStringMapV3.__interfaces__ = [IMap];
CachingStringMapV3.prototype = {
	isReserved: function(key) {
		return __map_v3_reserved[key] != null;
	}
	,set: function(key,value) {
		if(__map_v3_reserved[key] != null) this.setReserved(key,value); else {
			if(!this.h.hasOwnProperty(key)) this.cachedKeys.push(key);
			this.h[key] = value;
		}
	}
	,get: function(key) {
		if(__map_v3_reserved[key] != null) return this.getReserved(key);
		return this.h[key];
	}
	,exists: function(key) {
		if(__map_v3_reserved[key] != null) return this.existsReserved(key);
		return this.h.hasOwnProperty(key);
	}
	,setReserved: function(key,value) {
		if(this.rh == null) this.rh = { };
		var _key = "$" + key;
		if(!this.rh.hasOwnProperty(_key)) this.cachedKeys.push(key);
		this.rh[_key] = value;
	}
	,getReserved: function(key) {
		if(this.rh == null) return null; else return this.rh["$" + key];
	}
	,existsReserved: function(key) {
		if(this.rh == null) return false;
		return this.rh.hasOwnProperty("$" + key);
	}
	,remove: function(key) {
		if(__map_v3_reserved[key] != null) {
			key = "$" + key;
			if(this.rh == null || !this.rh.hasOwnProperty(key)) return false;
			delete(this.rh[key]);
			this.cachedKeys.splice(HxOverrides.indexOf(this.cachedKeys,key,0),1);
			return true;
		} else {
			if(!this.h.hasOwnProperty(key)) return false;
			delete(this.h[key]);
			this.cachedKeys.splice(HxOverrides.indexOf(this.cachedKeys,key,0),1);
			return true;
		}
	}
	,keys: function() {
		if(this.cachedKeys.length == 0) return CachingStringMapV3.emptyIterator;
		return HxOverrides.iter(this.cachedKeys);
	}
	,iterator: function() {
		if(this.cachedKeys.length == 0) return CachingStringMapV3.emptyIterator;
		return new _CachingStringMapV3.CachingStringMapV3Iterator(this,this.cachedKeys);
	}
	,toString: function() {
		var s = new StringBuf();
		s.b += "{";
		var _g1 = 0;
		var _g = this.cachedKeys.length;
		while(_g1 < _g) {
			var i = _g1++;
			var k = this.cachedKeys[i];
			if(k == null) s.b += "null"; else s.b += "" + k;
			s.b += " => ";
			s.add(Std.string(__map_v3_reserved[k] != null?this.getReserved(k):this.h[k]));
			if(i < this.cachedKeys.length) s.b += ", ";
		}
		s.b += "}";
		return s.b;
	}
	,__class__: CachingStringMapV3
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
org.zamedev.lib.FastIteratingStringMap.__interfaces__ = [IMap];
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
	,toString: function() {
		var s = new StringBuf();
		s.b += "{";
		var item = this.head;
		while(item != null) {
			s.b += Std.string(item.key);
			s.b += " => ";
			s.add(Std.string(item.value));
			item = item.next;
			if(item != null) s.b += ", ";
		}
		s.b += "}";
		return s.b;
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
Benchmark.cachingMapV1Creator = function() {
	return new CachingStringMapV1();
};
Benchmark.cachingMapV2Creator = function() {
	return new CachingStringMapV2();
};
Benchmark.cachingMapV3Creator = function() {
	return new CachingStringMapV3();
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
Benchmark.benchmarkAll = function(entryCount,createMapFunc) {
	var keys = [];
	var halfKeys1 = [];
	var halfKeys2 = [];
	var _g = 0;
	while(_g < entryCount) {
		var i = _g++;
		var key;
		if(i == null) key = "null"; else key = "" + i;
		keys.push(key);
		if(i < entryCount / 2) halfKeys1.push(key); else halfKeys2.push(key);
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
		var $it0 = map.keys();
		while( $it0.hasNext() ) {
			var key2 = $it0.next();
			if(map.exists(key2)) dummy += map.get(key2); else dummy += 0;
		}
		var $it1 = map.iterator();
		while( $it1.hasNext() ) {
			var value = $it1.next();
			dummy++;
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
		var $it4 = map1.keys();
		while( $it4.hasNext() ) {
			var key7 = $it4.next();
			if(map1.exists(key7)) dummy1 += map1.get(key7); else dummy1 += 0;
		}
		var $it5 = map1.iterator();
		while( $it5.hasNext() ) {
			var value2 = $it5.next();
			dummy1++;
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
		Benchmark.log("\n### " + Type.getClassName(Type.getClass(map)) + "\n\n```\n");
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
				Benchmark.log("\n### " + Type.getClassName(Type.getClass(map1)) + "\n\n```\n");
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
	window.setTimeout(Benchmark.step,1);
};
Benchmark.onstart = function(_) {
	window.document.getElementById("start").disabled = true;
	var browserId;
	if(window.navigator.userAgent.indexOf(" Firefox/") >= 0) browserId = "firefox"; else if(window.navigator.userAgent.indexOf(" Chrome/") >= 0) browserId = "chrome"; else if(window.navigator.userAgent.indexOf(" Safari/") >= 0) browserId = "safari"; else browserId = window.navigator.userAgent;
	Benchmark.log("# " + browserId + "\n");
	Benchmark.resultData = { browser : browserId, entries : []};
	window.setTimeout(Benchmark.step,1);
};
Benchmark.init = function() {
	window.document.getElementById("start").onclick = Benchmark.onstart;
};
Benchmark.main = function() {
	window.setTimeout(Benchmark.init,1);
};
var _CachingStringMapV1 = {};
_CachingStringMapV1.CachingStringMapV1Iterator = function(map,keys) {
	this.map = map;
	this.keys = keys;
	this.index = 0;
	this.count = keys.length;
};
_CachingStringMapV1.CachingStringMapV1Iterator.__name__ = ["_CachingStringMapV1","CachingStringMapV1Iterator"];
_CachingStringMapV1.CachingStringMapV1Iterator.prototype = {
	hasNext: function() {
		return this.index < this.count;
	}
	,next: function() {
		return this.map.get(this.keys[this.index++]);
	}
	,__class__: _CachingStringMapV1.CachingStringMapV1Iterator
};
var CachingStringMapV1 = function() {
	this.cachedKeys = null;
	this.h = { };
};
CachingStringMapV1.__name__ = ["CachingStringMapV1"];
CachingStringMapV1.__interfaces__ = [IMap];
CachingStringMapV1.prototype = {
	isReserved: function(key) {
		return __map_v1_reserved[key] != null;
	}
	,set: function(key,value) {
		if(__map_v1_reserved[key] != null) this.setReserved(key,value); else this.h[key] = value;
		this.cachedKeys = null;
	}
	,get: function(key) {
		if(__map_v1_reserved[key] != null) return this.getReserved(key);
		return this.h[key];
	}
	,exists: function(key) {
		if(__map_v1_reserved[key] != null) return this.existsReserved(key);
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
		if(__map_v1_reserved[key] != null) {
			key = "$" + key;
			if(this.rh == null || !this.rh.hasOwnProperty(key)) return false;
			delete(this.rh[key]);
			this.cachedKeys = null;
			return true;
		} else {
			if(!this.h.hasOwnProperty(key)) return false;
			delete(this.h[key]);
			this.cachedKeys = null;
			return true;
		}
	}
	,keys: function() {
		var _this = this.arrayKeys();
		return HxOverrides.iter(_this);
	}
	,arrayKeys: function() {
		if(this.cachedKeys != null) return this.cachedKeys;
		var out = [];
		for( var key in this.h ) {
		if(this.h.hasOwnProperty(key)) out.push(key);
		}
		if(this.rh != null) {
			for( var key in this.rh ) {
			if(key.charCodeAt(0) == 36) out.push(key.substr(1));
			}
		}
		this.cachedKeys = out;
		return out;
	}
	,iterator: function() {
		return new _CachingStringMapV1.CachingStringMapV1Iterator(this,this.arrayKeys());
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
			s.add(Std.string(__map_v1_reserved[k] != null?this.getReserved(k):this.h[k]));
			if(i < keys.length) s.b += ", ";
		}
		s.b += "}";
		return s.b;
	}
	,__class__: CachingStringMapV1
};
var _CachingStringMapV2 = {};
_CachingStringMapV2.CachingStringMapV2Iterator = function(map,keys) {
	this.map = map;
	this.keys = keys;
	this.index = 0;
	this.count = keys.length;
};
_CachingStringMapV2.CachingStringMapV2Iterator.__name__ = ["_CachingStringMapV2","CachingStringMapV2Iterator"];
_CachingStringMapV2.CachingStringMapV2Iterator.prototype = {
	hasNext: function() {
		return this.index < this.count;
	}
	,next: function() {
		return this.map.get(this.keys[this.index++]);
	}
	,__class__: _CachingStringMapV2.CachingStringMapV2Iterator
};
var CachingStringMapV2 = function() {
	this.cachedKeys = [];
	this.h = { };
};
CachingStringMapV2.__name__ = ["CachingStringMapV2"];
CachingStringMapV2.__interfaces__ = [IMap];
CachingStringMapV2.prototype = {
	isReserved: function(key) {
		return __map_v2_reserved[key] != null;
	}
	,set: function(key,value) {
		if(__map_v2_reserved[key] != null) this.setReserved(key,value); else {
			if(!this.h.hasOwnProperty(key)) this.cachedKeys.push(key);
			this.h[key] = value;
		}
	}
	,get: function(key) {
		if(__map_v2_reserved[key] != null) return this.getReserved(key);
		return this.h[key];
	}
	,exists: function(key) {
		if(__map_v2_reserved[key] != null) return this.existsReserved(key);
		return this.h.hasOwnProperty(key);
	}
	,setReserved: function(key,value) {
		if(this.rh == null) this.rh = { };
		var _key = "$" + key;
		if(!this.rh.hasOwnProperty(_key)) this.cachedKeys.push(key);
		this.rh[_key] = value;
	}
	,getReserved: function(key) {
		if(this.rh == null) return null; else return this.rh["$" + key];
	}
	,existsReserved: function(key) {
		if(this.rh == null) return false;
		return this.rh.hasOwnProperty("$" + key);
	}
	,remove: function(key) {
		if(__map_v2_reserved[key] != null) {
			key = "$" + key;
			if(this.rh == null || !this.rh.hasOwnProperty(key)) return false;
			delete(this.rh[key]);
			this.cachedKeys = [];
			return true;
		} else {
			if(!this.h.hasOwnProperty(key)) return false;
			delete(this.h[key]);
			this.cachedKeys = [];
			return true;
		}
	}
	,keys: function() {
		var _this = this.arrayKeys();
		return HxOverrides.iter(_this);
	}
	,arrayKeys: function() {
		return this.cachedKeys;
	}
	,iterator: function() {
		return new _CachingStringMapV2.CachingStringMapV2Iterator(this,this.arrayKeys());
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
			s.add(Std.string(__map_v2_reserved[k] != null?this.getReserved(k):this.h[k]));
			if(i < keys.length) s.b += ", ";
		}
		s.b += "}";
		return s.b;
	}
	,__class__: CachingStringMapV2
};
var _CachingStringMapV3 = {};
_CachingStringMapV3.CachingStringMapV3Iterator = function(map,keys) {
	this.map = map;
	this.keys = keys;
	this.index = 0;
	this.count = keys.length;
};
_CachingStringMapV3.CachingStringMapV3Iterator.__name__ = ["_CachingStringMapV3","CachingStringMapV3Iterator"];
_CachingStringMapV3.CachingStringMapV3Iterator.prototype = {
	hasNext: function() {
		return this.index < this.count;
	}
	,next: function() {
		return this.map.get(this.keys[this.index++]);
	}
	,__class__: _CachingStringMapV3.CachingStringMapV3Iterator
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
var __map_v3_reserved = {}
var __z_map_reserved = {}
var __map_v1_reserved = {}
var __map_v2_reserved = {}
if(Array.prototype.indexOf) HxOverrides.indexOf = function(a,o,i) {
	return Array.prototype.indexOf.call(a,o,i);
};
var __map_reserved = {}
CachingStringMapV3.emptyIterator = { hasNext : function() {
	return false;
}, next : function() {
	return null;
}};
org.zamedev.lib.FastIteratingStringMap.emptyIterator = { hasNext : function() {
	return false;
}, next : function() {
	return null;
}};
Benchmark.WARMUP_SECONDS = 1;
Benchmark.COMPUTATION_SECONDS = 4;
Benchmark.REPEAT_COUNT = 5;
Benchmark.benchmarkVariants = [{ name : "Combined", func : Benchmark.benchmarkCombined}];
Benchmark.creatorVariants = [{ name : "caching3", func : Benchmark.cachingMapV3Creator},{ name : "fast", func : Benchmark.fastIteratingMapCreator}];
Benchmark.entryCountVariants = [10,100,1000,10000,100000];
Benchmark.benchmarkIndex = -1;
Benchmark.creatorIndex = 0;
Benchmark.entryCountIndex = 0;
Benchmark.repeatNumber = 0;
Benchmark.iterationsSum = 0;
Benchmark.timeSum = 0;
Benchmark.main();
})();
