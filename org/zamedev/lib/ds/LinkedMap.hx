package org.zamedev.lib.ds;

@:multiType(@:followWithAbstracts K)
abstract LinkedMap<K, V>(haxe.Constraints.IMap<K, V>) {
    public function new();

    @:arrayAccess
    public inline function get(key : K) : V {
        return this.get(key);
    }

    public inline function set(key : K, value : V) : Void {
        this.set(key, value);
    }

    public inline function exists(key : K) : Bool {
        return this.exists(key);
    }

    #if (haxe_ver >= "4.0.0")
        public inline function remove(key : K) : Bool {
            return this.remove(key);
        }
    #end

    public inline function keys() : Iterator<K> {
        return this.keys();
    }

    public inline function iterator() : Iterator<V> {
        return this.iterator();
    }

    #if (haxe_ver >= "4.0.0")
        public inline function keyValueIterator() : KeyValueIterator<K, V> {
            return this.keyValueIterator();
        }

        public inline function copy() : haxe.Constraints.IMap<K, V> {
            return this.copy();
        }
    #end

    #if (haxe_ver >= "4.0.1")
        public inline function clear() : Void {
            return this.clear();
        }
    #end

    public inline function toString() : String {
        return this.toString();
    }

    @:arrayAccess
    @:noCompletion
    public inline function arrayWrite(key : K, value : V) : V {
        this.set(key, value);
        return value;
    }

    @:to
    static inline function toLinkedStringMap<K : String, V>(t : haxe.Constraints.IMap<K, V>) : LinkedStringMap<V> {
        return new LinkedStringMap<V>();
    }

    @:to
    static inline function toLinkedIntMap<K : Int, V>(t : haxe.Constraints.IMap<K, V>) : LinkedIntMap<V> {
        return new LinkedIntMap<V>();
    }

    // @:to
    // static inline function toLinkedObjectMap<K : {}, V>(t : haxe.Constraints.IMap<K, V>) : LinkedObjectMap<K, V> {
    //     return new LinkedObjectMap<K, V>();
    // }

    @:from
    static inline function fromLinkedStringMap<V>(map : LinkedStringMap<V>) : LinkedMap<String, V> {
        return cast map;
    }

    @:from
    static inline function fromLinkedIntMap<V>(map : LinkedIntMap<V>) : LinkedMap<Int, V> {
        return cast map;
    }

    // @:from
    // static inline function fromLinkedObjectMap<K : {}, V>(map : ObjectMap<K, V>) : Map<K, V> {
    //     return cast map;
    // }
}
