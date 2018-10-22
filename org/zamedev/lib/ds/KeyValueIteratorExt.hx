package org.zamedev.lib.ds;

// Taken from https://gist.github.com/RealyUniqueName/2fbeb1ec17e637d6eaf50b0facde206f
// Unlike MapKeyValueIterator from Haxe 4, return KeyValuePairExt instead of anonymous structure

class KeyValueIteratorExt<K, V> {
    var map : haxe.Constraints.IMap<K, V>;
    var keys : Iterator<K>;

    public inline function new(map : haxe.Constraints.IMap<K, V>) {
        this.map = map;
        this.keys = map.keys();
    }

    public inline function hasNext() : Bool {
        return keys.hasNext();
    }

    public inline function next() : KeyValuePairExt<K, V> {
        var key = keys.next();
        return new KeyValuePairExt(key, map.get(key));
    }

    public static inline function pairs<K, V>(map : haxe.Constraints.IMap<K, V>) : KeyValueIteratorExt<K, V> {
        return new KeyValueIteratorExt(map);
    }
}
