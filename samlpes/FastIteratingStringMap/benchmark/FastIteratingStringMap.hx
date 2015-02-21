package ;

#if js

/*
 * Probably, these iterator classes will work faster on Haxe 3.2 due to inlining,
 * but for Haxe 3.1.3 it works slower
 *

private class FastIteratingStringMapKeysIterator<T> {
    var map:FastIteratingStringMap<T>;
    var key:String;

    public inline function new(map:FastIteratingStringMap<T>):Void {
        this.map = map;
        this.key = untyped map.head;
    }

    public inline function hasNext():Bool {
        return (key != null);
    }

    public inline function next():String {
        var item = untyped map.data[key];
        key = item.next;
        return item.key;
    }
}

private class FastIteratingStringMapValuesIterator<T> {
    var map:FastIteratingStringMap<T>;
    var key:String;

    public inline function new(map:FastIteratingStringMap<T>):Void {
        this.map = map;
        this.key = untyped map.head;
    }

    public inline function hasNext():Bool {
        return (key != null);
    }

    public inline function next():T {
        var item = untyped map.data[key];
        key = item.next;
        return item.value;
    }
}
*/

// for haxe 3.2 - implements haxe.Constraints.IMap<String, T>
class FastIteratingStringMap<T> implements Map.IMap<String, T> {
    private var data:Dynamic;
    private var head:String;
    private var tail:String;

    static function __init__():Void {
        untyped __js__("var __z_map_reserved = {}");
    }

    public function new():Void {
        data = {};
        head = null;
        tail = null;
    }

    public function set(key:String, value:T):Void {
        var _key:String = (untyped __js__("__z_map_reserved")[key] == null ? key : "$" + key);

        if (untyped data.hasOwnProperty(_key)) {
            untyped data[_key].value = value;
        } else {
            untyped data[_key] = {
                prev: tail,
                key: key,
                value: value,
                next: null
            };

            if (tail != null) {
                untyped data[tail].next = _key;
            }

            tail = _key;

            if (head == null) {
                head = _key;
            }
        }
    }

    public function get(key:String):Null<T> {
        if (untyped __js__("__z_map_reserved")[key] != null) {
            key = "$" + key;
        }

        if (untyped data.hasOwnProperty(key)) {
            return untyped data[key].value;
        } else {
            return null;
        }
    }

    public function exists(key:String):Bool {
        if (untyped __js__("__z_map_reserved")[key] != null) {
            key = "$" + key;
        }

        return untyped data.hasOwnProperty(key);
    }

    public function remove(key:String):Bool {
        if (untyped __js__("__z_map_reserved")[key] != null) {
            key = "$" + key;
        }

        if (untyped !data.hasOwnProperty(key)) {
            return false;
        }

        var item = untyped data[key];
        var prev:String = item.prev;
        var next:String = item.next;

        untyped __js__("delete")(data[key]);

        if (prev != null) {
            untyped data[prev].next = next;
        }

        if (next != null) {
            untyped data[next].prev = prev;
        }

        if (head == key) {
            head = next;
        }

        if (tail == key) {
            tail = prev;
        }

        return true;
    }

    public function keys():Iterator<String> {
        return untyped {
            _data: data,
            _key: head,

            hasNext: function() {
                return (__this__._key != null);
            },

            next: function() {
                var item = __this__._data[__this__._key];
                __this__._key = item.next;
                return item.key;
            }
        };

        // return new FastIteratingStringMapKeysIterator(this);
    }

    public function iterator():Iterator<T> {
        return untyped {
            _data: data,
            _key: head,

            hasNext: function() {
                return (__this__._key != null);
            },

            next: function() {
                var item = __this__._data[__this__._key];
                __this__._key = item.next;
                return item.value;
            }
        };

        // return new FastIteratingStringMapValuesIterator(this);
    }

    public function toString():String {
        var s = new StringBuf();
        s.add("{");

        untyped {
            var _key = head;

            while (_key != null) {
                var item = data[_key];

                s.add(item.key);
                s.add(" => ");
                s.add(Std.string(item.value));

                _key = item.next;

                if (_key != null) {
                    s.add(", ");
                }
            }
        }

        s.add("}");
        return s.toString();
    }

    /*
    public function toDebugString():String {
        var s = new StringBuf();
        s.add("{");
        s.add(" head: ");
        s.add(head == null ? "null" : '"${head}"');
        s.add(", tail: ");
        s.add(tail == null ? "null" : '"${tail}"');
        s.add(", data: ");
        s.add(data);
        s.add(" }");
        return s.toString();
    }
    */
}

#else

typedef FastIteratingStringMap = haxe.ds.StringMap;

#end
