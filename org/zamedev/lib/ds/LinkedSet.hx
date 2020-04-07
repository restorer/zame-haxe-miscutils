package org.zamedev.lib.ds;

@:multiType(@:followWithAbstracts T)
abstract LinkedSet<T>(LinkedMap<T, Bool>) {
    public function new();

    public inline function add(key : T) : Void {
        this.set(key, true);
    }

    public inline function exists(key : Null<T>) : Bool {
        return (key == null ? false : this.exists(key));
    }

    public inline function remove(key : T) : Bool {
        return this.remove(key);
    }

    public inline function keys() : Iterator<T> {
        return this.keys();
    }

    @:to
    static inline function toLinkedStringSet<T : String>(t : LinkedMap<T, Bool>) : LinkedStringMap<Bool> {
        return new LinkedStringMap<Bool>();
    }

    @:to
    static inline function toLinkedIntSet<T : Int>(t : LinkedMap<T, Bool>) : LinkedIntMap<Bool> {
        return new LinkedIntMap<Bool>();
    }
}
