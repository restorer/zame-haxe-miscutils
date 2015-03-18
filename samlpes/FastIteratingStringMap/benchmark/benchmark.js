(function (console) { "use strict";
var Std = function() { };
Std["int"] = function(x) {
	return x | 0;
};
var haxe_Timer = function() { };
haxe_Timer.stamp = function() {
	return new Date().getTime() / 1000;
};
var haxe_IMap = function() { };
var OldStringMap = function() {
	this.h = { };
};
OldStringMap.__interfaces__ = [haxe_IMap];
OldStringMap.prototype = {
	set: function(key,value) {
		this.h["$" + key] = value;
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
};
var NewStringMap = function() {
	this.h = { };
};
NewStringMap.__interfaces__ = [haxe_IMap];
NewStringMap.prototype = {
	set: function(key,value) {
		if(__map_reserved[key] != null) this.setReserved(key,value); else this.h[key] = value;
	}
	,get: function(key) {
		if(__map_reserved[key] != null) return this.getReserved(key);
		return this.h[key];
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
};
var _$NewStringMap_StringMapIterator = function(map,keys) {
	this.map = map;
	this.keys = keys;
	this.index = 0;
	this.count = keys.length;
};
_$NewStringMap_StringMapIterator.prototype = {
	hasNext: function() {
		return this.index < this.count;
	}
	,next: function() {
		return this.map.get(this.keys[this.index++]);
	}
};
var CachingKeysStringMap = function() {
	this.data = { };
	this.cachedKeys = [];
};
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
};
var HxOverrides = function() { };
HxOverrides.iter = function(a) {
	return { cur : 0, arr : a, hasNext : function() {
		return this.cur < this.arr.length;
	}, next : function() {
		return this.arr[this.cur++];
	}};
};
var _$CachingKeysStringMap_CachingKeysStringMapIterator = function(map,keys) {
	this.map = map;
	this.keys = keys;
	this.index = 0;
	this.count = keys.length;
};
_$CachingKeysStringMap_CachingKeysStringMapIterator.prototype = {
	hasNext: function() {
		return this.index < this.count;
	}
	,next: function() {
		return this.map.get(this.keys[this.index++]);
	}
};
var org_zamedev_lib_FastIteratingStringMap = function() {
	this.data = { };
	this.dataReserved = { };
	this.head = null;
	this.tail = null;
};
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
	,iterator: function() {
		if(this.head == null) return org_zamedev_lib_FastIteratingStringMap.emptyIterator;
		return { _item : this.head, hasNext : function() {
			return this._item != null;
		}, next : function() {
			var result = this._item.value;
			this._item = this._item.next;
			return result;
		}};
	}
};
var Benchmark = function() { };
Benchmark.log = function(s) {
	window.document.getElementById("log").innerHTML += s.split("&").join("&amp;").split("<").join("&lt;").split(">").join("&gt;").split(" ").join("&nbsp;").split("\n").join("<br />");
	window.scrollTo(0,window.document.body.scrollHeight);
};
Benchmark.benchmarkAll_OldStringMap = function(entryCount) {
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
	var st = haxe_Timer.stamp();
	var t = 0;
	while(true) {
		var map = new OldStringMap();
		var dummy = 0;
		var _g1 = 0;
		while(_g1 < keys.length) {
			var key1 = keys[_g1];
			++_g1;
			map.h["$" + key1] = 1;
		}
		var idx = 0;
		var $it0 = map.keys();
		while( $it0.hasNext() ) {
			var key2 = $it0.next();
			if(map.h.hasOwnProperty("$" + key2)) dummy += map.h["$" + key2]; else dummy += 0;
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
			if(map.h.hasOwnProperty("$" + key4)) dummy += map.h["$" + key4]; else dummy += 0;
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
		t = haxe_Timer.stamp() - st;
		if(t > 1) break;
	}
	st = haxe_Timer.stamp();
	t = 0;
	var count = 0;
	while(true) {
		var map1 = new OldStringMap();
		var dummy1 = 0;
		var _g4 = 0;
		while(_g4 < keys.length) {
			var key6 = keys[_g4];
			++_g4;
			map1.h["$" + key6] = 1;
		}
		var idx1 = 0;
		var $it4 = map1.keys();
		while( $it4.hasNext() ) {
			var key7 = $it4.next();
			if(map1.h.hasOwnProperty("$" + key7)) dummy1 += map1.h["$" + key7]; else dummy1 += 0;
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
			if(map1.h.hasOwnProperty("$" + key9)) dummy1 += map1.h["$" + key9]; else dummy1 += 0;
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
		t = haxe_Timer.stamp() - st;
		if(t > 4) break;
	}
	return { iterations : count, time : Std["int"](Math.round(t * 1000))};
};
Benchmark.benchmarkAll_NewStringMap = function(entryCount) {
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
	var st = haxe_Timer.stamp();
	var t = 0;
	while(true) {
		var map = new NewStringMap();
		var dummy = 0;
		var _g1 = 0;
		while(_g1 < keys.length) {
			var key1 = keys[_g1];
			++_g1;
			if(__map_reserved[key1] != null) map.setReserved(key1,1); else map.h[key1] = 1;
		}
		var idx = 0;
		var $it0 = map.keys();
		while( $it0.hasNext() ) {
			var key2 = $it0.next();
			if(__map_reserved[key2] != null?map.existsReserved(key2):map.h.hasOwnProperty(key2)) dummy += __map_reserved[key2] != null?map.getReserved(key2):map.h[key2]; else dummy += 0;
			idx++;
			if(idx >= mid) break;
		}
		idx = 0;
		var $it1 = new _$NewStringMap_StringMapIterator(map,map.arrayKeys());
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
			if(__map_reserved[key4] != null?map.existsReserved(key4):map.h.hasOwnProperty(key4)) dummy += __map_reserved[key4] != null?map.getReserved(key4):map.h[key4]; else dummy += 0;
		}
		var $it3 = new _$NewStringMap_StringMapIterator(map,map.arrayKeys());
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
		t = haxe_Timer.stamp() - st;
		if(t > 1) break;
	}
	st = haxe_Timer.stamp();
	t = 0;
	var count = 0;
	while(true) {
		var map1 = new NewStringMap();
		var dummy1 = 0;
		var _g4 = 0;
		while(_g4 < keys.length) {
			var key6 = keys[_g4];
			++_g4;
			if(__map_reserved[key6] != null) map1.setReserved(key6,1); else map1.h[key6] = 1;
		}
		var idx1 = 0;
		var $it4 = map1.keys();
		while( $it4.hasNext() ) {
			var key7 = $it4.next();
			if(__map_reserved[key7] != null?map1.existsReserved(key7):map1.h.hasOwnProperty(key7)) dummy1 += __map_reserved[key7] != null?map1.getReserved(key7):map1.h[key7]; else dummy1 += 0;
			idx1++;
			if(idx1 >= mid) break;
		}
		idx1 = 0;
		var $it5 = new _$NewStringMap_StringMapIterator(map1,map1.arrayKeys());
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
			if(__map_reserved[key9] != null?map1.existsReserved(key9):map1.h.hasOwnProperty(key9)) dummy1 += __map_reserved[key9] != null?map1.getReserved(key9):map1.h[key9]; else dummy1 += 0;
		}
		var $it7 = new _$NewStringMap_StringMapIterator(map1,map1.arrayKeys());
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
		t = haxe_Timer.stamp() - st;
		if(t > 4) break;
	}
	return { iterations : count, time : Std["int"](Math.round(t * 1000))};
};
Benchmark.benchmarkAll_CachingKeysStringMap = function(entryCount) {
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
	var st = haxe_Timer.stamp();
	var t = 0;
	while(true) {
		var map = new CachingKeysStringMap();
		var dummy = 0;
		var _g1 = 0;
		while(_g1 < keys.length) {
			var key1 = keys[_g1];
			++_g1;
			map.set(key1,1);
		}
		var idx = 0;
		var $it0 = map.cachedKeys.length == 0?CachingKeysStringMap.emptyIterator:HxOverrides.iter(map.cachedKeys);
		while( $it0.hasNext() ) {
			var key2 = $it0.next();
			if(__z_map_reserved[key2] != null?map.dataReserved == null?false:map.dataReserved.hasOwnProperty("$" + key2):map.data.hasOwnProperty(key2)) dummy += __z_map_reserved[key2] != null?map.dataReserved == null?null:map.dataReserved["$" + key2]:map.data[key2]; else dummy += 0;
			idx++;
			if(idx >= mid) break;
		}
		idx = 0;
		var $it1 = map.cachedKeys.length == 0?CachingKeysStringMap.emptyIterator:new _$CachingKeysStringMap_CachingKeysStringMapIterator(map,map.cachedKeys);
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
		var $it2 = map.cachedKeys.length == 0?CachingKeysStringMap.emptyIterator:HxOverrides.iter(map.cachedKeys);
		while( $it2.hasNext() ) {
			var key4 = $it2.next();
			if(__z_map_reserved[key4] != null?map.dataReserved == null?false:map.dataReserved.hasOwnProperty("$" + key4):map.data.hasOwnProperty(key4)) dummy += __z_map_reserved[key4] != null?map.dataReserved == null?null:map.dataReserved["$" + key4]:map.data[key4]; else dummy += 0;
		}
		var $it3 = map.cachedKeys.length == 0?CachingKeysStringMap.emptyIterator:new _$CachingKeysStringMap_CachingKeysStringMapIterator(map,map.cachedKeys);
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
		t = haxe_Timer.stamp() - st;
		if(t > 1) break;
	}
	st = haxe_Timer.stamp();
	t = 0;
	var count = 0;
	while(true) {
		var map1 = new CachingKeysStringMap();
		var dummy1 = 0;
		var _g4 = 0;
		while(_g4 < keys.length) {
			var key6 = keys[_g4];
			++_g4;
			map1.set(key6,1);
		}
		var idx1 = 0;
		var $it4 = map1.cachedKeys.length == 0?CachingKeysStringMap.emptyIterator:HxOverrides.iter(map1.cachedKeys);
		while( $it4.hasNext() ) {
			var key7 = $it4.next();
			if(__z_map_reserved[key7] != null?map1.dataReserved == null?false:map1.dataReserved.hasOwnProperty("$" + key7):map1.data.hasOwnProperty(key7)) dummy1 += __z_map_reserved[key7] != null?map1.dataReserved == null?null:map1.dataReserved["$" + key7]:map1.data[key7]; else dummy1 += 0;
			idx1++;
			if(idx1 >= mid) break;
		}
		idx1 = 0;
		var $it5 = map1.cachedKeys.length == 0?CachingKeysStringMap.emptyIterator:new _$CachingKeysStringMap_CachingKeysStringMapIterator(map1,map1.cachedKeys);
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
		var $it6 = map1.cachedKeys.length == 0?CachingKeysStringMap.emptyIterator:HxOverrides.iter(map1.cachedKeys);
		while( $it6.hasNext() ) {
			var key9 = $it6.next();
			if(__z_map_reserved[key9] != null?map1.dataReserved == null?false:map1.dataReserved.hasOwnProperty("$" + key9):map1.data.hasOwnProperty(key9)) dummy1 += __z_map_reserved[key9] != null?map1.dataReserved == null?null:map1.dataReserved["$" + key9]:map1.data[key9]; else dummy1 += 0;
		}
		var $it7 = map1.cachedKeys.length == 0?CachingKeysStringMap.emptyIterator:new _$CachingKeysStringMap_CachingKeysStringMapIterator(map1,map1.cachedKeys);
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
		t = haxe_Timer.stamp() - st;
		if(t > 4) break;
	}
	return { iterations : count, time : Std["int"](Math.round(t * 1000))};
};
Benchmark.benchmarkAll_FastIteratingStringMap = function(entryCount) {
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
	var st = haxe_Timer.stamp();
	var t = 0;
	while(true) {
		var map = new org_zamedev_lib_FastIteratingStringMap();
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
			if(__z_map_reserved[key2] != null?map.dataReserved.hasOwnProperty("$" + key2):map.data.hasOwnProperty(key2)) dummy += map.get(key2); else dummy += 0;
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
			if(__z_map_reserved[key4] != null?map.dataReserved.hasOwnProperty("$" + key4):map.data.hasOwnProperty(key4)) dummy += map.get(key4); else dummy += 0;
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
		t = haxe_Timer.stamp() - st;
		if(t > 1) break;
	}
	st = haxe_Timer.stamp();
	t = 0;
	var count = 0;
	while(true) {
		var map1 = new org_zamedev_lib_FastIteratingStringMap();
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
			if(__z_map_reserved[key7] != null?map1.dataReserved.hasOwnProperty("$" + key7):map1.data.hasOwnProperty(key7)) dummy1 += map1.get(key7); else dummy1 += 0;
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
			if(__z_map_reserved[key9] != null?map1.dataReserved.hasOwnProperty("$" + key9):map1.data.hasOwnProperty(key9)) dummy1 += map1.get(key9); else dummy1 += 0;
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
		t = haxe_Timer.stamp() - st;
		if(t > 4) break;
	}
	return { iterations : count, time : Std["int"](Math.round(t * 1000))};
};
Benchmark.benchmarkCombined_OldStringMap = function(entryCount) {
	var map = new OldStringMap();
	var _g = 0;
	while(_g < entryCount) {
		var i = _g++;
		map.h["$" + (i == null?"null":"" + i)] = i;
	}
	var st = haxe_Timer.stamp();
	var t = 0;
	while(true) {
		var dummy = 0;
		var $it0 = map.keys();
		while( $it0.hasNext() ) {
			var key = $it0.next();
			map.set(key,map.h.hasOwnProperty("$" + key)?map.h["$" + key] + 1:0);
			dummy++;
		}
		var $it1 = map.iterator();
		while( $it1.hasNext() ) {
			var value = $it1.next();
			dummy++;
		}
		t = haxe_Timer.stamp() - st;
		if(t > 1) break;
	}
	st = haxe_Timer.stamp();
	t = 0;
	var count = 0;
	while(true) {
		var dummy1 = 0;
		var $it2 = map.keys();
		while( $it2.hasNext() ) {
			var key1 = $it2.next();
			map.set(key1,map.h.hasOwnProperty("$" + key1)?map.h["$" + key1] + 1:0);
			dummy1++;
		}
		var $it3 = map.iterator();
		while( $it3.hasNext() ) {
			var value1 = $it3.next();
			dummy1++;
		}
		count++;
		t = haxe_Timer.stamp() - st;
		if(t > 4) break;
	}
	return { iterations : count, time : Std["int"](Math.round(t * 1000))};
};
Benchmark.benchmarkCombined_NewStringMap = function(entryCount) {
	var map = new NewStringMap();
	var _g = 0;
	while(_g < entryCount) {
		var i = _g++;
		map.set(i == null?"null":"" + i,i);
	}
	var st = haxe_Timer.stamp();
	var t = 0;
	while(true) {
		var dummy = 0;
		var $it0 = map.keys();
		while( $it0.hasNext() ) {
			var key = $it0.next();
			map.set(key,(__map_reserved[key] != null?map.existsReserved(key):map.h.hasOwnProperty(key))?(__map_reserved[key] != null?map.getReserved(key):map.h[key]) + 1:0);
			dummy++;
		}
		var $it1 = new _$NewStringMap_StringMapIterator(map,map.arrayKeys());
		while( $it1.hasNext() ) {
			var value = $it1.next();
			dummy++;
		}
		t = haxe_Timer.stamp() - st;
		if(t > 1) break;
	}
	st = haxe_Timer.stamp();
	t = 0;
	var count = 0;
	while(true) {
		var dummy1 = 0;
		var $it2 = map.keys();
		while( $it2.hasNext() ) {
			var key1 = $it2.next();
			map.set(key1,(__map_reserved[key1] != null?map.existsReserved(key1):map.h.hasOwnProperty(key1))?(__map_reserved[key1] != null?map.getReserved(key1):map.h[key1]) + 1:0);
			dummy1++;
		}
		var $it3 = new _$NewStringMap_StringMapIterator(map,map.arrayKeys());
		while( $it3.hasNext() ) {
			var value1 = $it3.next();
			dummy1++;
		}
		count++;
		t = haxe_Timer.stamp() - st;
		if(t > 4) break;
	}
	return { iterations : count, time : Std["int"](Math.round(t * 1000))};
};
Benchmark.benchmarkCombined_CachingKeysStringMap = function(entryCount) {
	var map = new CachingKeysStringMap();
	var _g = 0;
	while(_g < entryCount) {
		var i = _g++;
		map.set(i == null?"null":"" + i,i);
	}
	var st = haxe_Timer.stamp();
	var t = 0;
	while(true) {
		var dummy = 0;
		var $it0 = map.cachedKeys.length == 0?CachingKeysStringMap.emptyIterator:HxOverrides.iter(map.cachedKeys);
		while( $it0.hasNext() ) {
			var key = $it0.next();
			map.set(key,(__z_map_reserved[key] != null?map.dataReserved == null?false:map.dataReserved.hasOwnProperty("$" + key):map.data.hasOwnProperty(key))?(__z_map_reserved[key] != null?map.dataReserved == null?null:map.dataReserved["$" + key]:map.data[key]) + 1:0);
			dummy++;
		}
		var $it1 = map.cachedKeys.length == 0?CachingKeysStringMap.emptyIterator:new _$CachingKeysStringMap_CachingKeysStringMapIterator(map,map.cachedKeys);
		while( $it1.hasNext() ) {
			var value = $it1.next();
			dummy++;
		}
		t = haxe_Timer.stamp() - st;
		if(t > 1) break;
	}
	st = haxe_Timer.stamp();
	t = 0;
	var count = 0;
	while(true) {
		var dummy1 = 0;
		var $it2 = map.cachedKeys.length == 0?CachingKeysStringMap.emptyIterator:HxOverrides.iter(map.cachedKeys);
		while( $it2.hasNext() ) {
			var key1 = $it2.next();
			map.set(key1,(__z_map_reserved[key1] != null?map.dataReserved == null?false:map.dataReserved.hasOwnProperty("$" + key1):map.data.hasOwnProperty(key1))?(__z_map_reserved[key1] != null?map.dataReserved == null?null:map.dataReserved["$" + key1]:map.data[key1]) + 1:0);
			dummy1++;
		}
		var $it3 = map.cachedKeys.length == 0?CachingKeysStringMap.emptyIterator:new _$CachingKeysStringMap_CachingKeysStringMapIterator(map,map.cachedKeys);
		while( $it3.hasNext() ) {
			var value1 = $it3.next();
			dummy1++;
		}
		count++;
		t = haxe_Timer.stamp() - st;
		if(t > 4) break;
	}
	return { iterations : count, time : Std["int"](Math.round(t * 1000))};
};
Benchmark.benchmarkCombined_FastIteratingStringMap = function(entryCount) {
	var map = new org_zamedev_lib_FastIteratingStringMap();
	var _g = 0;
	while(_g < entryCount) {
		var i = _g++;
		map.set(i == null?"null":"" + i,i);
	}
	var st = haxe_Timer.stamp();
	var t = 0;
	while(true) {
		var dummy = 0;
		var $it0 = map.keys();
		while( $it0.hasNext() ) {
			var key = $it0.next();
			map.set(key,(__z_map_reserved[key] != null?map.dataReserved.hasOwnProperty("$" + key):map.data.hasOwnProperty(key))?map.get(key) + 1:0);
			dummy++;
		}
		var $it1 = map.iterator();
		while( $it1.hasNext() ) {
			var value = $it1.next();
			dummy++;
		}
		t = haxe_Timer.stamp() - st;
		if(t > 1) break;
	}
	st = haxe_Timer.stamp();
	t = 0;
	var count = 0;
	while(true) {
		var dummy1 = 0;
		var $it2 = map.keys();
		while( $it2.hasNext() ) {
			var key1 = $it2.next();
			map.set(key1,(__z_map_reserved[key1] != null?map.dataReserved.hasOwnProperty("$" + key1):map.data.hasOwnProperty(key1))?map.get(key1) + 1:0);
			dummy1++;
		}
		var $it3 = map.iterator();
		while( $it3.hasNext() ) {
			var value1 = $it3.next();
			dummy1++;
		}
		count++;
		t = haxe_Timer.stamp() - st;
		if(t > 4) break;
	}
	return { iterations : count, time : Std["int"](Math.round(t * 1000))};
};
Benchmark.benchmarkNoIterate_OldStringMap = function(entryCount) {
	var keys = [];
	var _g = 0;
	while(_g < entryCount) {
		var i = _g++;
		keys.push(i == null?"null":"" + i);
	}
	var st = haxe_Timer.stamp();
	var t = 0;
	while(true) {
		var map = new OldStringMap();
		var _g1 = 0;
		while(_g1 < keys.length) {
			var key = keys[_g1];
			++_g1;
			map.h["$" + key] = 1;
			map.set(key,map.h.hasOwnProperty("$" + key)?map.h["$" + key] + 1:0);
		}
		var _g2 = 0;
		while(_g2 < keys.length) {
			var key1 = keys[_g2];
			++_g2;
			map.remove(key1);
		}
		t = haxe_Timer.stamp() - st;
		if(t > 1) break;
	}
	st = haxe_Timer.stamp();
	t = 0;
	var count = 0;
	while(true) {
		var map1 = new OldStringMap();
		var _g3 = 0;
		while(_g3 < keys.length) {
			var key2 = keys[_g3];
			++_g3;
			map1.h["$" + key2] = 1;
			map1.set(key2,map1.h.hasOwnProperty("$" + key2)?map1.h["$" + key2] + 1:0);
		}
		var _g4 = 0;
		while(_g4 < keys.length) {
			var key3 = keys[_g4];
			++_g4;
			map1.remove(key3);
		}
		count++;
		t = haxe_Timer.stamp() - st;
		if(t > 4) break;
	}
	return { iterations : count, time : Std["int"](Math.round(t * 1000))};
};
Benchmark.benchmarkNoIterate_NewStringMap = function(entryCount) {
	var keys = [];
	var _g = 0;
	while(_g < entryCount) {
		var i = _g++;
		keys.push(i == null?"null":"" + i);
	}
	var st = haxe_Timer.stamp();
	var t = 0;
	while(true) {
		var map = new NewStringMap();
		var _g1 = 0;
		while(_g1 < keys.length) {
			var key = keys[_g1];
			++_g1;
			if(__map_reserved[key] != null) map.setReserved(key,1); else map.h[key] = 1;
			map.set(key,(__map_reserved[key] != null?map.existsReserved(key):map.h.hasOwnProperty(key))?(__map_reserved[key] != null?map.getReserved(key):map.h[key]) + 1:0);
		}
		var _g2 = 0;
		while(_g2 < keys.length) {
			var key1 = keys[_g2];
			++_g2;
			map.remove(key1);
		}
		t = haxe_Timer.stamp() - st;
		if(t > 1) break;
	}
	st = haxe_Timer.stamp();
	t = 0;
	var count = 0;
	while(true) {
		var map1 = new NewStringMap();
		var _g3 = 0;
		while(_g3 < keys.length) {
			var key2 = keys[_g3];
			++_g3;
			if(__map_reserved[key2] != null) map1.setReserved(key2,1); else map1.h[key2] = 1;
			map1.set(key2,(__map_reserved[key2] != null?map1.existsReserved(key2):map1.h.hasOwnProperty(key2))?(__map_reserved[key2] != null?map1.getReserved(key2):map1.h[key2]) + 1:0);
		}
		var _g4 = 0;
		while(_g4 < keys.length) {
			var key3 = keys[_g4];
			++_g4;
			map1.remove(key3);
		}
		count++;
		t = haxe_Timer.stamp() - st;
		if(t > 4) break;
	}
	return { iterations : count, time : Std["int"](Math.round(t * 1000))};
};
Benchmark.benchmarkNoIterate_CachingKeysStringMap = function(entryCount) {
	var keys = [];
	var _g = 0;
	while(_g < entryCount) {
		var i = _g++;
		keys.push(i == null?"null":"" + i);
	}
	var st = haxe_Timer.stamp();
	var t = 0;
	while(true) {
		var map = new CachingKeysStringMap();
		var _g1 = 0;
		while(_g1 < keys.length) {
			var key = keys[_g1];
			++_g1;
			map.set(key,1);
			map.set(key,(__z_map_reserved[key] != null?map.dataReserved == null?false:map.dataReserved.hasOwnProperty("$" + key):map.data.hasOwnProperty(key))?(__z_map_reserved[key] != null?map.dataReserved == null?null:map.dataReserved["$" + key]:map.data[key]) + 1:0);
		}
		var _g2 = 0;
		while(_g2 < keys.length) {
			var key1 = keys[_g2];
			++_g2;
			map.remove(key1);
		}
		t = haxe_Timer.stamp() - st;
		if(t > 1) break;
	}
	st = haxe_Timer.stamp();
	t = 0;
	var count = 0;
	while(true) {
		var map1 = new CachingKeysStringMap();
		var _g3 = 0;
		while(_g3 < keys.length) {
			var key2 = keys[_g3];
			++_g3;
			map1.set(key2,1);
			map1.set(key2,(__z_map_reserved[key2] != null?map1.dataReserved == null?false:map1.dataReserved.hasOwnProperty("$" + key2):map1.data.hasOwnProperty(key2))?(__z_map_reserved[key2] != null?map1.dataReserved == null?null:map1.dataReserved["$" + key2]:map1.data[key2]) + 1:0);
		}
		var _g4 = 0;
		while(_g4 < keys.length) {
			var key3 = keys[_g4];
			++_g4;
			map1.remove(key3);
		}
		count++;
		t = haxe_Timer.stamp() - st;
		if(t > 4) break;
	}
	return { iterations : count, time : Std["int"](Math.round(t * 1000))};
};
Benchmark.benchmarkNoIterate_FastIteratingStringMap = function(entryCount) {
	var keys = [];
	var _g = 0;
	while(_g < entryCount) {
		var i = _g++;
		keys.push(i == null?"null":"" + i);
	}
	var st = haxe_Timer.stamp();
	var t = 0;
	while(true) {
		var map = new org_zamedev_lib_FastIteratingStringMap();
		var _g1 = 0;
		while(_g1 < keys.length) {
			var key = keys[_g1];
			++_g1;
			map.set(key,1);
			map.set(key,(__z_map_reserved[key] != null?map.dataReserved.hasOwnProperty("$" + key):map.data.hasOwnProperty(key))?map.get(key) + 1:0);
		}
		var _g2 = 0;
		while(_g2 < keys.length) {
			var key1 = keys[_g2];
			++_g2;
			map.remove(key1);
		}
		t = haxe_Timer.stamp() - st;
		if(t > 1) break;
	}
	st = haxe_Timer.stamp();
	t = 0;
	var count = 0;
	while(true) {
		var map1 = new org_zamedev_lib_FastIteratingStringMap();
		var _g3 = 0;
		while(_g3 < keys.length) {
			var key2 = keys[_g3];
			++_g3;
			map1.set(key2,1);
			map1.set(key2,(__z_map_reserved[key2] != null?map1.dataReserved.hasOwnProperty("$" + key2):map1.data.hasOwnProperty(key2))?map1.get(key2) + 1:0);
		}
		var _g4 = 0;
		while(_g4 < keys.length) {
			var key3 = keys[_g4];
			++_g4;
			map1.remove(key3);
		}
		count++;
		t = haxe_Timer.stamp() - st;
		if(t > 4) break;
	}
	return { iterations : count, time : Std["int"](Math.round(t * 1000))};
};
Benchmark.benchmarkIterateOnly_OldStringMap = function(entryCount) {
	var map = new OldStringMap();
	var _g = 0;
	while(_g < entryCount) {
		var i = _g++;
		map.h["$" + (i == null?"null":"" + i)] = i;
	}
	var st = haxe_Timer.stamp();
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
		t = haxe_Timer.stamp() - st;
		if(t > 1) break;
	}
	st = haxe_Timer.stamp();
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
		t = haxe_Timer.stamp() - st;
		if(t > 4) break;
	}
	return { iterations : count, time : Std["int"](Math.round(t * 1000))};
};
Benchmark.benchmarkIterateOnly_NewStringMap = function(entryCount) {
	var map = new NewStringMap();
	var _g = 0;
	while(_g < entryCount) {
		var i = _g++;
		map.set(i == null?"null":"" + i,i);
	}
	var st = haxe_Timer.stamp();
	var t = 0;
	while(true) {
		var dummy = 0;
		var $it0 = map.keys();
		while( $it0.hasNext() ) {
			var key = $it0.next();
			dummy++;
		}
		var $it1 = new _$NewStringMap_StringMapIterator(map,map.arrayKeys());
		while( $it1.hasNext() ) {
			var value = $it1.next();
			dummy++;
		}
		t = haxe_Timer.stamp() - st;
		if(t > 1) break;
	}
	st = haxe_Timer.stamp();
	t = 0;
	var count = 0;
	while(true) {
		var dummy1 = 0;
		var $it2 = map.keys();
		while( $it2.hasNext() ) {
			var key1 = $it2.next();
			dummy1++;
		}
		var $it3 = new _$NewStringMap_StringMapIterator(map,map.arrayKeys());
		while( $it3.hasNext() ) {
			var value1 = $it3.next();
			dummy1++;
		}
		count++;
		t = haxe_Timer.stamp() - st;
		if(t > 4) break;
	}
	return { iterations : count, time : Std["int"](Math.round(t * 1000))};
};
Benchmark.benchmarkIterateOnly_CachingKeysStringMap = function(entryCount) {
	var map = new CachingKeysStringMap();
	var _g = 0;
	while(_g < entryCount) {
		var i = _g++;
		map.set(i == null?"null":"" + i,i);
	}
	var st = haxe_Timer.stamp();
	var t = 0;
	while(true) {
		var dummy = 0;
		var $it0 = map.cachedKeys.length == 0?CachingKeysStringMap.emptyIterator:HxOverrides.iter(map.cachedKeys);
		while( $it0.hasNext() ) {
			var key = $it0.next();
			dummy++;
		}
		var $it1 = map.cachedKeys.length == 0?CachingKeysStringMap.emptyIterator:new _$CachingKeysStringMap_CachingKeysStringMapIterator(map,map.cachedKeys);
		while( $it1.hasNext() ) {
			var value = $it1.next();
			dummy++;
		}
		t = haxe_Timer.stamp() - st;
		if(t > 1) break;
	}
	st = haxe_Timer.stamp();
	t = 0;
	var count = 0;
	while(true) {
		var dummy1 = 0;
		var $it2 = map.cachedKeys.length == 0?CachingKeysStringMap.emptyIterator:HxOverrides.iter(map.cachedKeys);
		while( $it2.hasNext() ) {
			var key1 = $it2.next();
			dummy1++;
		}
		var $it3 = map.cachedKeys.length == 0?CachingKeysStringMap.emptyIterator:new _$CachingKeysStringMap_CachingKeysStringMapIterator(map,map.cachedKeys);
		while( $it3.hasNext() ) {
			var value1 = $it3.next();
			dummy1++;
		}
		count++;
		t = haxe_Timer.stamp() - st;
		if(t > 4) break;
	}
	return { iterations : count, time : Std["int"](Math.round(t * 1000))};
};
Benchmark.benchmarkIterateOnly_FastIteratingStringMap = function(entryCount) {
	var map = new org_zamedev_lib_FastIteratingStringMap();
	var _g = 0;
	while(_g < entryCount) {
		var i = _g++;
		map.set(i == null?"null":"" + i,i);
	}
	var st = haxe_Timer.stamp();
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
		t = haxe_Timer.stamp() - st;
		if(t > 1) break;
	}
	st = haxe_Timer.stamp();
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
		t = haxe_Timer.stamp() - st;
		if(t > 4) break;
	}
	return { iterations : count, time : Std["int"](Math.round(t * 1000))};
};
Benchmark.step = function() {
	if(Benchmark.benchmarkIndex < 0) {
		Benchmark.benchmarkIndex = 0;
		Benchmark.log("\n## " + Benchmark.benchmarkVariants[Benchmark.benchmarkIndex].name + "\n");
		Benchmark.log("\n### " + Benchmark.benchmarkVariants[Benchmark.benchmarkIndex].funcVariants[Benchmark.funcIndex].mapClass + "\n\n```\n");
		Benchmark.log("" + Benchmark.entryCountVariants[Benchmark.entryCountIndex] + " | ");
		Benchmark.resultDataEntry = { entryCount : Benchmark.entryCountVariants[Benchmark.entryCountIndex], values : []};
		Benchmark.resultDataBrowser = { browser : Benchmark.browserId, entries : [Benchmark.resultDataEntry]};
		Benchmark.resultData = { benchmark : Benchmark.benchmarkVariants[Benchmark.benchmarkIndex].name, note : Benchmark.benchmarkVariants[Benchmark.benchmarkIndex].note, browsers : [Benchmark.resultDataBrowser]};
		Benchmark.resultDataList.push(Benchmark.resultData);
	} else {
		Benchmark.repeatNumber++;
		if(Benchmark.repeatNumber >= 5) {
			Benchmark.log(" | avg: " + Math.round(Benchmark.iterationsSum / 5) + " per " + Math.round(Benchmark.timeSum / 5) + "\n");
			Benchmark.resultDataEntry.values.push({ type : Benchmark.benchmarkVariants[Benchmark.benchmarkIndex].funcVariants[Benchmark.funcIndex].type, value : Math.round(Benchmark.iterationsSum / 5)});
			Benchmark.iterationsSum = 0;
			Benchmark.timeSum = 0;
			Benchmark.repeatNumber = 0;
			Benchmark.entryCountIndex++;
			if(Benchmark.entryCountIndex >= Benchmark.entryCountVariants.length) {
				Benchmark.log("```\n");
				Benchmark.entryCountIndex = 0;
				Benchmark.funcIndex++;
				if(Benchmark.funcIndex >= Benchmark.benchmarkVariants[Benchmark.benchmarkIndex].funcVariants.length) {
					Benchmark.funcIndex = 0;
					Benchmark.benchmarkIndex++;
					if(Benchmark.benchmarkIndex >= Benchmark.benchmarkVariants.length) {
						Benchmark.log("\n# Done\n\n");
						Benchmark.log(JSON.stringify(Benchmark.resultDataList,null,"    "));
						return;
					}
					Benchmark.log("\n## " + Benchmark.benchmarkVariants[Benchmark.benchmarkIndex].name + "\n");
					Benchmark.resultDataEntry = { entryCount : Benchmark.entryCountVariants[Benchmark.entryCountIndex], values : []};
					Benchmark.resultDataBrowser = { browser : Benchmark.browserId, entries : [Benchmark.resultDataEntry]};
					Benchmark.resultData = { benchmark : Benchmark.benchmarkVariants[Benchmark.benchmarkIndex].name, note : Benchmark.benchmarkVariants[Benchmark.benchmarkIndex].note, browsers : [Benchmark.resultDataBrowser]};
					Benchmark.resultDataList.push(Benchmark.resultData);
				}
				Benchmark.log("\n### " + Benchmark.benchmarkVariants[Benchmark.benchmarkIndex].funcVariants[Benchmark.funcIndex].mapClass + "\n\n```\n");
			}
			var found = false;
			var _g = 0;
			var _g1 = Benchmark.resultDataBrowser.entries;
			while(_g < _g1.length) {
				var item = _g1[_g];
				++_g;
				if(item.entryCount == Benchmark.entryCountVariants[Benchmark.entryCountIndex]) {
					Benchmark.resultDataEntry = item;
					found = true;
				}
			}
			if(!found) {
				Benchmark.resultDataEntry = { entryCount : Benchmark.entryCountVariants[Benchmark.entryCountIndex], values : []};
				Benchmark.resultDataBrowser.entries.push(Benchmark.resultDataEntry);
			}
			Benchmark.log("" + Benchmark.entryCountVariants[Benchmark.entryCountIndex] + " | ");
		}
	}
	var result = Benchmark.benchmarkVariants[Benchmark.benchmarkIndex].funcVariants[Benchmark.funcIndex].func(Benchmark.entryCountVariants[Benchmark.entryCountIndex]);
	if(Benchmark.repeatNumber != 0) Benchmark.log(", ");
	Benchmark.log("" + result.iterations + " per " + result.time);
	Benchmark.iterationsSum += result.iterations;
	Benchmark.timeSum += result.time;
	window.setTimeout(Benchmark.step,15);
};
Benchmark.onstart = function(_) {
	window.document.getElementById("start").disabled = true;
	if(window.navigator.userAgent.indexOf(" Firefox/") >= 0) Benchmark.browserId = "firefox"; else if(window.navigator.userAgent.indexOf(" Chrome/") >= 0) Benchmark.browserId = "chrome"; else if(window.navigator.userAgent.indexOf(" Safari/") >= 0) Benchmark.browserId = "safari"; else Benchmark.browserId = window.navigator.userAgent;
	Benchmark.log("# " + Benchmark.browserId + "\n");
	window.setTimeout(Benchmark.step,15);
};
Benchmark.init = function() {
	window.document.getElementById("start").onclick = Benchmark.onstart;
};
Benchmark.main = function() {
	window.setTimeout(Benchmark.init,15);
};
var __map_reserved = {}

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
var __z_map_reserved = {}
CachingKeysStringMap.emptyIterator = { hasNext : function() {
	return false;
}, next : function() {
	return null;
}};
org_zamedev_lib_FastIteratingStringMap.emptyIterator = { hasNext : function() {
	return false;
}, next : function() {
	return null;
}};
Benchmark.entryCountVariants = [10,100,1000,10000,100000];
Benchmark.benchmarkIndex = -1;
Benchmark.funcIndex = 0;
Benchmark.entryCountIndex = 0;
Benchmark.repeatNumber = 0;
Benchmark.iterationsSum = 0;
Benchmark.timeSum = 0;
Benchmark.resultDataList = [];
Benchmark.benchmarkVariants = [{ name : "All", note : "Iterating plus get / set / exists and remove", funcVariants : [{ type : "old", mapClass : "OldStringMap", func : Benchmark.benchmarkAll_OldStringMap},{ type : "new", mapClass : "NewStringMap", func : Benchmark.benchmarkAll_NewStringMap},{ type : "caching", mapClass : "CachingKeysStringMap", func : Benchmark.benchmarkAll_CachingKeysStringMap},{ type : "fast", mapClass : "FastIteratingStringMap", func : Benchmark.benchmarkAll_FastIteratingStringMap}]},{ name : "Combined", note : "Iterating plus get / set / exists, without remove", funcVariants : [{ type : "old", mapClass : "OldStringMap", func : Benchmark.benchmarkCombined_OldStringMap},{ type : "new", mapClass : "NewStringMap", func : Benchmark.benchmarkCombined_NewStringMap},{ type : "caching", mapClass : "CachingKeysStringMap", func : Benchmark.benchmarkCombined_CachingKeysStringMap},{ type : "fast", mapClass : "FastIteratingStringMap", func : Benchmark.benchmarkCombined_FastIteratingStringMap}]},{ name : "Without iteration", note : "Just get / set / exists / remove, without iterating", funcVariants : [{ type : "old", mapClass : "OldStringMap", func : Benchmark.benchmarkNoIterate_OldStringMap},{ type : "new", mapClass : "NewStringMap", func : Benchmark.benchmarkNoIterate_NewStringMap},{ type : "caching", mapClass : "CachingKeysStringMap", func : Benchmark.benchmarkNoIterate_CachingKeysStringMap},{ type : "fast", mapClass : "FastIteratingStringMap", func : Benchmark.benchmarkNoIterate_FastIteratingStringMap}]},{ name : "Iteration only", note : "Just iterating, without get / set / exists / remove", funcVariants : [{ type : "old", mapClass : "OldStringMap", func : Benchmark.benchmarkIterateOnly_OldStringMap},{ type : "new", mapClass : "NewStringMap", func : Benchmark.benchmarkIterateOnly_NewStringMap},{ type : "caching", mapClass : "CachingKeysStringMap", func : Benchmark.benchmarkIterateOnly_CachingKeysStringMap},{ type : "fast", mapClass : "FastIteratingStringMap", func : Benchmark.benchmarkIterateOnly_FastIteratingStringMap}]}];
Benchmark.main();
})(typeof console != "undefined" ? console : {log:function(){}});
