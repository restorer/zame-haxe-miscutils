package org.zamedev.lib.ds;

import haxe.ds.IntMap;

typedef LinkedIntMapItem<T> = {
    prev:LinkedIntMapItem<T>,
    key:Int,
    value:T,
    next:LinkedIntMapItem<T>,
};

class LinkedIntMapKeysIterator<T> {
    private var item:LinkedIntMapItem<T>;

    public inline function new(head:LinkedIntMapItem<T>):Void {
        this.item = head;
    }

    public inline function hasNext():Bool {
        return (item != null);
    }

    public inline function next():Int {
        var result:Int = item.key;
        item = item.next;
        return result;
    }
}

class LinkedIntMapValuesIterator<T> {
    private var item:LinkedIntMapItem<T>;

    public inline function new(head:LinkedIntMapItem<T>):Void {
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

class LinkedIntMap<T> implements haxe.Constraints.IMap<Int, T> {
    private static var emptyIterator = {
        hasNext: function() {
            return false;
        },

        next: function() {
            return null;
        }
    };

    private var data:IntMap<LinkedIntMapItem<T>>;
    private var head:LinkedIntMapItem<T>;
    private var tail:LinkedIntMapItem<T>;

    public inline function new():Void {
        data = new IntMap<LinkedIntMapItem<T>>();
        head = null;
        tail = null;
    }

    public function set(key:Int, value:T):Void {
        var item:LinkedIntMapItem<T> = data.get(key);

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

    public inline function get(key:Int):Null<T> {
        var item = data.get(key);
        return (item == null ? null : item.value);
    }

    public inline function exists(key:Int):Bool {
        return data.exists(key);
    }

    public function remove(key:Int):Bool {
        var item = data.get(key);

        if (item == null) {
            return false;
        }

        var prev:LinkedIntMapItem<T> = item.prev;
        var next:LinkedIntMapItem<T> = item.next;

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

    public function keys():Iterator<Int> {
        return (head == null ? cast emptyIterator : new LinkedIntMapKeysIterator<T>(head));
    }

    public function iterator():Iterator<T> {
        return (head == null ? cast emptyIterator : new LinkedIntMapValuesIterator<T>(head));
    }

    public function toString():String {
        var s = new StringBuf();
        s.add("{");

        var item:LinkedIntMapItem<T> = head;

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
}
