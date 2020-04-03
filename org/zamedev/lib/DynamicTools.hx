package org.zamedev.lib;

class DynamicTools {
    public static function asDynamic(value : Dynamic) : DynamicExt {
        if (value == null) {
            return {};
        } else {
            return value;
        }
    }

    public static function asArray(value : Dynamic) : Array<DynamicExt> {
        if (Std.is(value, Array)) {
            return value;
        } else {
            return new Array<Dynamic>();
        }
    }

    public static function asArrayElement(value : Dynamic, index : Int) : DynamicExt {
        if (index >= 0 && Std.is(value, Array)) {
            var elements : Array<DynamicExt> = cast value;

            if (index < elements.length) {
                return elements[index];
            } else {
                return null;
            }
        } else {
            return null;
        }
    }

    public static function asInt(value : Dynamic, def : Int = 0) : Int {
        if (Std.is(value, Int)) {
            return value;
        } else if (Std.is(value, Float)) {
            return Std.int(value);
        } else {
            return def;
        }
    }

    public static function asNullInt(value : Dynamic) : Null<Int> {
        if (Std.is(value, Int)) {
            return value;
        } else if (Std.is(value, Float)) {
            return Std.int(value);
        } else {
            return null;
        }
    }

    public static function asFloat(value : Dynamic, def : Float = 0.0) : Float {
        if (Std.is(value, Float) || Std.is(value, Int)) {
            return value;
        } else {
            return def;
        }
    }

    public static function asNullFloat(value : Dynamic) : Null<Float> {
        if (Std.is(value, Float) || Std.is(value, Int)) {
            return value;
        } else {
            return null;
        }
    }

    public static function asBool(value : Dynamic, def : Bool = false) : Bool {
        if (Std.is(value, Bool)) {
            return value;
        } else {
            return def;
        }
    }

    public static function asString(value : Dynamic, def : String = "") : String {
        if (value == null) {
            return def;
        } else {
            return Std.string(value);
        }
    }

    /**
     * Finds an element in a nested objects with a given path.
     */
    public static function byPath(value : Dynamic, path : Array<String>) : DynamicExt {
        var node = value;

        for (key in path) {
            node = Reflect.field(node, key);

            if (node == null) {
                break;
            }
        }

        return node;
    }
}
