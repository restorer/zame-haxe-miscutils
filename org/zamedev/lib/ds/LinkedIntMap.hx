package org.zamedev.lib.ds;

import haxe.ds.IntMap;

class LinkedIntMapItem<T> {
    public var prev : Null<LinkedIntMapItem<T>>;
    public var key : Int;
    public var value : T;
    public var next : Null<LinkedIntMapItem<T>>;

    public function new(prev : Null<LinkedIntMapItem<T>>, key : Int, value : T, next : Null<LinkedIntMapItem<T>>) {
        this.prev = prev;
        this.key = key;
        this.value = value;
        this.next = next;
    }
}

class LinkedIntMapKeyIterator<T> {
    private var item : Null<LinkedIntMapItem<T>>;

    public inline function new(head : LinkedIntMapItem<T>) {
        this.item = head;
    }

    public inline function hasNext() : Bool {
        return (item != null);
    }

    public inline function next() : Int {
        var result : Int = item.key;
        item = item.next;
        return result;
    }
}

class LinkedIntMapValueIterator<T> {
    private var item : Null<LinkedIntMapItem<T>>;

    public inline function new(head : LinkedIntMapItem<T>) {
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

class LinkedIntMapKeyValueIterator<T> {
    private var item : Null<LinkedIntMapItem<T>>;

    public inline function new(head : LinkedIntMapItem<T>) {
        this.item = head;
    }

    public inline function hasNext() : Bool {
        return (item != null);
    }

    public inline function next() : { key : Int, value : T } {
        var result : LinkedIntMapItem<T> = item;
        item = item.next;
        return { key : result.key, value : result.value };
    }
}

class LinkedIntMap<T> implements haxe.Constraints.IMap<Int, T> {
    private static var emptyIterator = {
        hasNext : function() {
            return false;
        },

        next : function() {
            return null;
        }
    };

    private var data : IntMap<LinkedIntMapItem<T>>;
    private var head : Null<LinkedIntMapItem<T>>;
    private var tail : Null<LinkedIntMapItem<T>>;

    public function new() {
        initialize();
    }

    public inline function get(key : Int) : Null<T> {
        var item = data.get(key);
        return (item == null ? null : item.value);
    }

    public function set(key : Int, value : T) {
        var item = data.get(key);

        if (item != null) {
            item.value = value;
        } else {
            item = new LinkedIntMapItem<T>(tail, key, value, null);
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

    public inline function exists(key : Int) : Bool {
        return data.exists(key);
    }

    public function remove(key : Int) : Bool {
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

    public function keys() : Iterator<Int> {
        return (head == null ? cast emptyIterator : new LinkedIntMapKeyIterator<T>(head));
    }

    public function iterator() : Iterator<T> {
        return (head == null ? cast emptyIterator : new LinkedIntMapValueIterator<T>(head));
    }

    #if (haxe_ver >= "4.0.0")
        public function keyValueIterator() : KeyValueIterator<Int, T> {
            return (head == null ? cast emptyIterator : new LinkedIntMapKeyValueIterator<T>(head));
        }
    #end

    public function copy() : LinkedIntMap<T> {
        var copied = new LinkedIntMap<T>();

        for (key in keys()) {
            copied.set(key, get(key));
        }

        return copied;
    }

    #if (haxe_ver >= "4.0.1")
        public function clear() : Void {
            initialize();
        }
    #end

    public function toString() : String {
        var s = new StringBuf();
        s.add("{");

        var item = head;

        while (item != null) {
            s.add(Std.string(item.key));
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

    private inline function initialize() {
        data = new IntMap<LinkedIntMapItem<T>>();
        head = null;
        tail = null;
    }
}
