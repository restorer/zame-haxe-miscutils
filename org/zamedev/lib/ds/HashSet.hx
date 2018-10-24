package org.zamedev.lib.ds;

@:multiType(@:followWithAbstracts T)
abstract HashSet<T>(ISet<T>) {
    public function new();

    public inline function add(key : T) : Void {
        this.add(key);
    }

    public inline function exists(key : T) : Bool {
        return this.exists(key);
    }

    public inline function remove(key : T) : Bool {
        return this.remove(key);
    }

    public inline function keys() : Iterator<T> {
        return this.keys();
    }

    @:to
    static inline function toHashStringSet<T : String>(t : ISet<T>) : HashStringSet {
        return new HashStringSet();
    }

    @:to
    static inline function toHashIntSet<T : Int>(t : ISet<T>) : HashIntSet {
        return new HashIntSet();
    }

    @:to
    static inline function toObjectIntSet<T : {}>(t : ISet<T>) : HashObjectSet<T> {
        return new HashObjectSet<T>();
    }
}
