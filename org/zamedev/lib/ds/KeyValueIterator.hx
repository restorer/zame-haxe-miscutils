package org.zamedev.lib.ds;

// Taken from https://gist.github.com/RealyUniqueName/2fbeb1ec17e637d6eaf50b0facde206f

class KeyValueIterator<K, V> {
    var map : Map<K, V>;
    var keys : Iterator<K>;

    static public inline function pairs<K, V>(map : Map<K, V>) {
        return new KeyValueIterator(map);
    }

    public inline function new(map:Map<K,V>) {
        this.map = map;
        this.keys = map.keys();
    }

    public inline function hasNext() return keys.hasNext();

    public inline function next() {
        var key = keys.next();
        return new KeyValuePair(key, map.get(key));
    }
}
