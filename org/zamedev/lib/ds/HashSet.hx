package org.zamedev.lib.ds;

@:multiType(@:followWithAbstracts T)
abstract HashSet<T>(haxe.Constraints.IMap<T, Bool>) {
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
    static inline function toHashStringSet<T : String>(t : haxe.Constraints.IMap<T, Bool>) : haxe.ds.StringMap<Bool> {
        return new haxe.ds.StringMap<Bool>();
    }

    @:to
    static inline function toHashIntSet<T : Int>(t : haxe.Constraints.IMap<T, Bool>) : haxe.ds.IntMap<Bool> {
        return new haxe.ds.IntMap<Bool>();
    }

    @:to
    static inline function toObjectIntSet<T : {}>(t : haxe.Constraints.IMap<T, Bool>) : haxe.ds.ObjectMap<{}, Bool> {
        return new haxe.ds.ObjectMap<{}, Bool>();
    }
}
