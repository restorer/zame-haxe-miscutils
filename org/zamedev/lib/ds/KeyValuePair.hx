package org.zamedev.lib.ds;

// Taken from https://gist.github.com/RealyUniqueName/2fbeb1ec17e637d6eaf50b0facde206f

class KeyValuePair<K, V> {
    public var key(default, null) : K;
    public var value(default, null) : V;

    public inline function new(key : K, value : V) {
        this.key = key;
        this.value = value;
    }
}
