package org.zamedev.lib.ds;

#if js

class LinkedStringMap<T> implements haxe.Constraints.IMap<String, T> {
    private static var emptyIterator = {
        hasNext : function() {
            return false;
        },

        next : function() {
            return null;
        }
    };

    private var data : Dynamic;
    private var dataReserved : Dynamic;
    private var head : Dynamic;
    private var tail : Dynamic;

    private static function __init__() : Void {
        untyped __js__("var __linked_map_reserved = {}");
    }

    public function new() {
        data = {};
        dataReserved = {};
        head = null;
        tail = null;
    }

    public function get(key : String) : Null<T> {
        if (untyped __js__("__linked_map_reserved")[key] != null) {
            key = "$" + key;

            if (untyped dataReserved.hasOwnProperty(key)) {
                return untyped dataReserved[key].value;
            } else {
                return null;
            }
        } else {
            if (untyped data.hasOwnProperty(key)) {
                return untyped data[key].value;
            } else {
                return null;
            }
        }
    }

    public function set(key : String, value : T) : Void {
        if (untyped __js__("__linked_map_reserved")[key] != null) {
            var _key = "$" + key;

            if (untyped dataReserved.hasOwnProperty(_key)) {
                untyped dataReserved[_key].value = value;
            } else {
                var item = {
                    prev : tail,
                    key : key,
                    value : value,
                    next : null
                };

                untyped dataReserved[_key] = item;

                if (tail != null) {
                    untyped tail.next = item;
                }

                tail = item;

                if (head == null) {
                    head = item;
                }
            }
        } else {
            if (untyped data.hasOwnProperty(key)) {
                untyped data[key].value = value;
            } else {
                var item = {
                    prev : tail,
                    key : key,
                    value : value,
                    next : null
                };

                untyped data[key] = item;

                if (tail != null) {
                    untyped tail.next = item;
                }

                tail = item;

                if (head == null) {
                    head = item;
                }
            }
        }
    }

    public inline function exists(key : String) : Bool {
        if (untyped __js__("__linked_map_reserved")[key] != null) {
            return untyped dataReserved.hasOwnProperty("$" + key);
        } else {
            return untyped data.hasOwnProperty(key);
        }
    }

    public function remove(key : String) : Bool {
        if (untyped __js__("__linked_map_reserved")[key] != null) {
            key = "$" + key;

            if (untyped !dataReserved.hasOwnProperty(key)) {
                return false;
            }

            var item = untyped dataReserved[key];
            var prev : Dynamic = item.prev;
            var next : Dynamic = item.next;

            untyped __js__("delete")(dataReserved[key]);

            if (prev != null) {
                untyped prev.next = next;
            }

            if (next != null) {
                untyped next.prev = prev;
            }

            if (head == item) {
                head = next;
            }

            if (tail == item) {
                tail = prev;
            }

            item.prev = null;
            item.next = null;

            return true;
        } else {
            if (untyped !data.hasOwnProperty(key)) {
                return false;
            }

            var item = untyped data[key];
            var prev : Dynamic = item.prev;
            var next : Dynamic = item.next;

            untyped __js__("delete")(data[key]);

            if (prev != null) {
                untyped prev.next = next;
            }

            if (next != null) {
                untyped next.prev = prev;
            }

            if (head == item) {
                head = next;
            }

            if (tail == item) {
                tail = prev;
            }

            item.prev = null;
            item.next = null;

            return true;
        }
    }

    public function keys() : Iterator<String> {
        if (head == null) {
            return untyped emptyIterator;
        }

        return untyped {
            _item : head,

            hasNext : function() {
                return (__this__._item != null);
            },

            next : function() {
                var result = __this__._item.key;
                __this__._item = __this__._item.next;
                return result;
            }
        };
    }

    public function iterator() : Iterator<T> {
        if (head == null) {
            return untyped emptyIterator;
        }

        return untyped {
            _item : head,

            hasNext : function() {
                return (__this__._item != null);
            },

            next : function() {
                var result = __this__._item.value;
                __this__._item = __this__._item.next;
                return result;
            }
        };
    }

    #if (haxe_ver >= "4.0.0")
        public function keyValueIterator() : KeyValueIterator<String, T> {
            if (head == null) {
                return untyped emptyIterator;
            }

            return untyped {
                _item : head,

                hasNext : function() {
                    return (__this__._item != null);
                },

                next : function() {
                    var result = __this__._item;
                    __this__._item = __this__._item.next;
                    return { key : result.key, value : result.value };
                }
            };
        }
    #end

    public function copy() : LinkedStringMap<T> {
        var copied = new LinkedStringMap<T>();

        for (key in keys()) {
            copied.set(key, get(key));
        }

        return copied;
    }

    #if (haxe_ver >= "4.0.1")
    #end

    public function toString() : String {
        var s = new StringBuf();
        s.add("{");

        untyped {
            var item = head;

            while (item != null) {
                s.add(item.key);
                s.add(" => ");
                s.add(Std.string(item.value));

                item = item.next;

                if (item != null) {
                    s.add(", ");
                }
            }
        }

        s.add("}");
        return s.toString();
    }

    /*
    public function toDebugString() : String {
        var s = new StringBuf();
        s.add("{");
        s.add(" head: ");
        s.add(head);
        s.add(", tail: ");
        s.add(tail);
        s.add(", data: ");
        s.add(data);
        s.add(", dataReserved: ");
        s.add(dataReserved);
        s.add(" }");
        return s.toString();
    }
    */
}

#else

import haxe.ds.StringMap;

class LinkedStringMapItem<T> {
    public var prev : Null<LinkedStringMapItem<T>>;
    public var key : String;
    public var value : T;
    public var next : Null<LinkedStringMapItem<T>>;

    public function new(prev : Null<LinkedStringMapItem<T>>, key : String, value : T, next : Null<LinkedStringMapItem<T>>) {
        this.prev = prev;
        this.key = key;
        this.value = value;
        this.next = next;
    }
}

class LinkedStringMapKeyIterator<T> {
    private var item : Null<LinkedStringMapItem<T>>;

    public inline function new(head : LinkedStringMapItem<T>) {
        this.item = head;
    }

    public inline function hasNext() : Bool {
        return (item != null);
    }

    public inline function next() : String {
        var result : String = item.key;
        item = item.next;
        return result;
    }
}

class LinkedStringMapValueIterator<T> {
    private var item : Null<LinkedStringMapItem<T>>;

    public inline function new(head : LinkedStringMapItem<T>) {
        this.item = head;
    }

    public inline function hasNext() : Bool {
        return (item != null);
    }

    public inline function next() : T {
        var result : T = item.value;
        item = item.next;
        return result;
    }
}

class LinkedStringMapKeyValueIterator<T> {
    private var item : Null<LinkedStringMapItem<T>>;

    public inline function new(head : LinkedStringMapItem<T>) {
        this.item = head;
    }

    public inline function hasNext() : Bool {
        return (item != null);
    }

    public inline function next() : { key : String, value : T } {
        var result : LinkedStringMapItem<T> = item;
        item = item.next;
        return { key : result.key, value : result.value };
    }
}

class LinkedStringMap<T> {
    private static var emptyIterator = {
        hasNext : function() {
            return false;
        },

        next : function() {
            return null;
        }
    };

    private var data : StringMap<LinkedStringMapItem<T>>;
    private var head : Null<LinkedStringMapItem<T>>;
    private var tail : Null<LinkedStringMapItem<T>>;

    public function new() {
        initialize();
    }

    public inline function get(key : String) : Null<T> {
        var item = data.get(key);
        return (item == null ? null : item.value);
    }

    public function set(key : String, value : T) : Void {
        var item = data.get(key);

        if (item != null) {
            item.value = value;
        } else {
            item = new LinkedStringMapItem<T>(tail, key, value, null);
            data.set(key, item);

            if (tail != null) {
                tail.next = item;
            }

            tail = item;

            if (head == null) {
                head = item;
            }
        }
    }

    public inline function exists(key : String) : Bool {
        return data.exists(key);
    }

    public function remove(key : String) : Bool {
        var item = data.get(key);

        if (item == null) {
            return false;
        }

        var prev = item.prev;
        var next = item.next;

        data.remove(key);

        if (prev != null) {
            prev.next = next;
        }

        if (next != null) {
            next.prev = prev;
        }

        if (head == item) {
            head = next;
        }

        if (tail == item) {
            tail = prev;
        }

        item.prev = null;
        item.next = null;

        return true;
    }

    public function keys() : Iterator<String> {
        return (head == null ? cast emptyIterator : new LinkedStringMapKeyIterator<T>(head));
    }

    public function iterator() : Iterator<T> {
        return (head == null ? cast emptyIterator : new LinkedStringMapValueIterator<T>(head));
    }

    public function keyValueIterator() : KeyValueIterator<String, T> {
        return (head == null ? cast emptyIterator : new LinkedStringMapKeyValueIterator<T>(head));
    }

    public function copy() : LinkedStringMap<T> {
        var copied = new LinkedStringMap<T>();

        for (key in keys()) {
            copied.set(key, get(key));
        }

        return copied;
    }

    #if (haxe_ver >= "4.0.0")
        public function clear() : Void {
            initialize();
        }
    #end

    public function toString() : String {
        var s = new StringBuf();
        s.add("{");

        var item = head;

        while (item != null) {
            s.add(item.key);
            s.add(" => ");
            s.add(Std.string(item.value));

            item = item.next;

            if (item != null) {
                s.add(", ");
            }
        }

        s.add("}");
        return s.toString();
    }

    private inline function initialize() : Void {
        data = new StringMap<LinkedStringMapItem<T>>();
        head = null;
        tail = null;
    }
}

#end
