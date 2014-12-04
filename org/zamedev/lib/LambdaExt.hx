package org.zamedev.lib;

class LabmdaExt {
    public static function array<T>(it:Iterator<T>):Array<T> {
        var a = new Array<T>();

        for (v in it) {
            a.push(v);
        }

        return a;
    }
}
