package org.zamedev.lib.ds;

abstract HashObjectSet<T : {}>(haxe.ds.ObjectMap<T, Bool>) {
    public inline function new() {
        this = new haxe.ds.ObjectMap<T, Bool>();
    }

    public inline function add(key : T) : Void {
        this.set(key, true);
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
}
