package org.zamedev.lib.ds;

@:multiType(@:followWithAbstracts T)
abstract LinkedSet<T>(ISet<T>) {
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
    static inline function toLinkedStringSet<T : String>(t : ISet<T>) : LinkedStringSet {
        return new LinkedStringSet();
    }

    @:to
    static inline function toLinkedIntSet<T : Int>(t : ISet<T>) : LinkedIntSet {
        return new LinkedIntSet();
    }
}
