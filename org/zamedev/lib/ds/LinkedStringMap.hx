package org.zamedev.lib.ds;

#if js

class LinkedStringMap<T> implements haxe.Constraints.IMap<String, T> {
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
    private var head:Dynamic;
    private var tail:Dynamic;

    static function __init__():Void {
        untyped __js__("var __linked_map_reserved = {}");
    }

    public function new():Void {
        data = {};
        dataReserved = {};
        head = null;
        tail = null;
    }

    public function set(key:String, value:T):Void {
        if (untyped __js__("__linked_map_reserved")[key] != null) {
            var _key = "$" + key;

            if (untyped dataReserved.hasOwnProperty(_key)) {
                untyped dataReserved[_key].value = value;
            } else {
                var item = {
                    prev: tail,
                    key: key,
                    value: value,
                    next: null
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
                    prev: tail,
                    key: key,
                    value: value,
                    next: null
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

    public function get(key:String):Null<T> {
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

    public inline function exists(key:String):Bool {
        if (untyped __js__("__linked_map_reserved")[key] != null) {
            return untyped dataReserved.hasOwnProperty("$" + key);
        } else {
            return untyped data.hasOwnProperty(key);
        }
    }

    public function remove(key:String):Bool {
        if (untyped __js__("__linked_map_reserved")[key] != null) {
            key = "$" + key;

            if (untyped !dataReserved.hasOwnProperty(key)) {
                return false;
            }

            var item = untyped dataReserved[key];
            var prev:Dynamic = item.prev;
            var next:Dynamic = item.next;

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
            var prev:Dynamic = item.prev;
            var next:Dynamic = item.next;

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

    public function keys():Iterator<String> {
        if (head == null) {
            return untyped emptyIterator;
        }

        return untyped {
            _item: head,

            hasNext: function() {
                return (__this__._item != null);
            },

            next: function() {
                var result = __this__._item.key;
                __this__._item = __this__._item.next;
                return result;
            }
        };
    }

    public function iterator():Iterator<T> {
        if (head == null) {
            return untyped emptyIterator;
        }

        return untyped {
            _item: head,

            hasNext: function() {
                return (__this__._item != null);
            },

            next: function() {
                var result = __this__._item.value;
                __this__._item = __this__._item.next;
                return result;
            }
        };
    }

    public function toString():String {
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
    public function toDebugString():String {
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

typedef LinkedStringMapItem<T> = {
    prev:LinkedStringMapItem<T>,
    key:String,
    value:T,
    next:LinkedStringMapItem<T>,
};

class LinkedStringMapKeysIterator<T> {
    private var item:LinkedStringMapItem<T>;

    public inline function new(head:LinkedStringMapItem<T>):Void {
        this.item = head;
    }

    public inline function hasNext():Bool {
        return (item != null);
    }

    public inline function next():String {
        var result:String = item.key;
        item = item.next;
        return result;
    }
}

class LinkedStringMapValuesIterator<T> {
    private var item:LinkedStringMapItem<T>;

    public inline function new(head:LinkedStringMapItem<T>):Void {
        this.item = head;
    }

    public inline function hasNext():Bool {
        return (item != null);
    }

    public inline function next():T {
        var result:T = item.value;
        item = item.next;
        return result;
    }
}

class LinkedStringMap<T> {
    private static var emptyIterator = {
        hasNext: function() {
            return false;
        },

        next: function() {
            return null;
        }
    };

    private var data:StringMap<LinkedStringMapItem<T>>;
    private var head:LinkedStringMapItem<T>;
    private var tail:LinkedStringMapItem<T>;

    public inline function new():Void {
        data = new StringMap<LinkedStringMapItem<T>>();
        head = null;
        tail = null;
    }

    public function set(key:String, value:T):Void {
        var item:LinkedStringMapItem<T> = data.get(key);

        if (item != null) {
            item.value = value;
        } else {
            item = {
                prev: tail,
                key: key,
                value: value,
                next: null,
            };

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

    public inline function get(key:String):Null<T> {
        var item = data.get(key);
        return (item == null ? null : item.value);
    }

    public inline function exists(key:String):Bool {
        return data.exists(key);
    }

    public function remove(key:String):Bool {
        var item = data.get(key);

        if (item == null) {
            return false;
        }

        var prev:LinkedStringMapItem<T> = item.prev;
        var next:LinkedStringMapItem<T> = item.next;

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

    public function keys():Iterator<String> {
        return (head == null ? cast emptyIterator : new LinkedStringMapKeysIterator<T>(head));
    }

    public function iterator():Iterator<T> {
        return (head == null ? cast emptyIterator : new LinkedStringMapValuesIterator<T>(head));
    }

    public function toString():String {
        var s = new StringBuf();
        s.add("{");

        var item:LinkedStringMapItem<T> = head;

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
}

#end
