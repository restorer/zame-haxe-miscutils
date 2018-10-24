package org.zamedev.lib.ds;

abstract LinkedStringSet(LinkedStringMap<Bool>) {
    public inline function new() {
        this = new LinkedStringMap<Bool>();
    }

    public inline function add(key : String) : Void {
        this.set(key, true);
    }

    public inline function exists(key : String) : Bool {
        return this.exists(key);
    }

    public inline function remove(key : String) : Bool {
        return this.remove(key);
    }

    public inline function keys() : Iterator<String> {
        return this.keys();
    }
}
