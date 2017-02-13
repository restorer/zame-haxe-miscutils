/*
 * Copyright (C)2005-2012 Haxe Foundation
 *
 * Permission is hereby granted, free of charge, to any person obtaining a
 * copy of this software and associated documentation files (the "Software"),
 * to deal in the Software without restriction, including without limitation
 * the rights to use, copy, modify, merge, publish, distribute, sublicense,
 * and/or sell copies of the Software, and to permit persons to whom the
 * Software is furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING
 * FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER
 * DEALINGS IN THE SOFTWARE.
 */
package ;

private class CachingKeysStringMapIterator<T> {
	var map:CachingKeysStringMap<T>;
	var keys:Array<String>;
	var index:Int;
	var count:Int;

	public inline function new(map:CachingKeysStringMap<T>, keys:Array<String>) {
		this.map = map;
		this.keys = keys;
		this.index = 0;
		this.count = keys.length;
	}

	public inline function hasNext() {
		return index < count;
	}

	public inline function next() {
		return map.get(keys[index++]);
	}
}

// @:coreApi
// for haxe 3.2 - implements haxe.Constraints.IMap<String, T>
class CachingKeysStringMap<T> implements Map.IMap<String, T> {
    private static var emptyIterator = {
        hasNext: function() {
            return false;
        },

        next: function() {
            return null;
        }
    };

	private var data:Dynamic;
	private var dataReserved:Dynamic;
	private var cachedKeys:Array<String>;

	static function __init__() : Void {
		untyped __js__("
			var __z_map_reserved = {};

			var __z_map_indexOf = Array.prototype.indexOf || function(v) {
				for (var i = 0, l = this.length; i < l; i++) {
					if (this[i] == v) {
						return i;
					}
				}

				return -1;
			};
		");
	}

	public inline function new():Void {
		data = {};
		cachedKeys = [];
	}

	public function set(key:String, value:T):Void {
		if (untyped __js__("__z_map_reserved")[key] != null) {
			if (dataReserved == null) {
				dataReserved = {};
			}

			var _key = "$" + key;

			if (!dataReserved.hasOwnProperty(_key)) {
				cachedKeys.push(key);
			}

			dataReserved[cast _key] = value;
		} else {
			if (!data.hasOwnProperty(key)) {
				cachedKeys.push(key);
			}

			data[cast key] = value;
		}
	}

	public inline function get(key:String):Null<T> {
		if (untyped __js__("__z_map_reserved")[key] != null) {
			return (dataReserved == null ? null : dataReserved[cast "$" + key]);
		}

		return data[cast key];
	}

	public inline function exists(key:String):Bool {
		if (untyped __js__("__z_map_reserved")[key] != null) {
			return (dataReserved == null ? false : dataReserved.hasOwnProperty("$" + key));
		}

		return data.hasOwnProperty(key);
	}

	public function remove(key:String):Bool {
		if (untyped __js__("__z_map_reserved")[key] != null) {
			if (dataReserved == null) {
				return false;
			}

			var _key = "$" + key;

			if (!dataReserved.hasOwnProperty(_key)) {
				return false;
			}

			untyped __js__("delete")(dataReserved[_key]);
			cachedKeys.splice(untyped __js__("__z_map_indexOf.call(this.cachedKeys, key)"), 1);
			return true;
		}

		if (!data.hasOwnProperty(key)) {
			return false;
		}

		untyped __js__("delete")(data[key]);
		cachedKeys.splice(untyped __js__("__z_map_indexOf.call(this.cachedKeys, key)"), 1);
		return true;
	}

	public inline inline function keys():Iterator<String> {
		if (cachedKeys.length == 0) {
			return untyped emptyIterator;
		}

		return cachedKeys.iterator();
	}

	public inline inline function iterator():Iterator<T> {
		if (cachedKeys.length == 0) {
			return untyped emptyIterator;
		}

		return new CachingKeysStringMapIterator(this, cachedKeys);
	}

	public function toString() : String {
		var s = new StringBuf();
		s.add("{");

		for (i in 0 ... cachedKeys.length) {
			var k = cachedKeys[i];
			s.add(k);
			s.add(" => ");
			s.add(Std.string(get(k)));

			if (i < cachedKeys.length) {
				s.add(", ");
			}
		}

		s.add("}");
		return s.toString();
	}
}
