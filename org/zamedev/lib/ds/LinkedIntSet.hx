package org.zamedev.lib.ds;

abstract LinkedIntSet(LinkedIntMap<Bool>) {
    public inline function new() {
        this = new LinkedIntMap<Bool>();
    }

    public inline function add(key : Int) : Void {
        this.set(key, true);
    }

    public inline function exists(key : Int) : Bool {
        return this.exists(key);
    }

    public inline function remove(key : Int) : Bool {
        return this.remove(key);
    }

    public inline function keys() : Iterator<Int> {
        return this.keys();
    }
}
