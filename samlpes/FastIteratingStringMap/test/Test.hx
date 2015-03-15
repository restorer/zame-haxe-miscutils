package ;

import js.Browser;
import org.zamedev.lib.FastIteratingStringMap;

using org.zamedev.lib.LambdaExt;

class Test {
    private static function log(s:String):Void {
        Browser.document.getElementById("log").innerHTML += s
            .split("&").join("&amp;")
            .split("<").join("&lt;")
            .split(">").join("&gt;")
            .split(" ").join("&nbsp;")
            .split("\n").join("<br />");

        Browser.window.scrollTo(0, Browser.document.body.scrollHeight);
    }

    private static function stringRepresentation(map:Map.IMap<String, Int>):String {
        var keys = map.keys().array();
        keys.sort(Reflect.compare);

        var sb = new StringBuf();
        var sep = false;

        for (key in keys) {
            if (sep) {
                sb.add(";");
            }

            sb.add(key);
            sb.add("=");
            sb.add(Std.string(map.get(key)));

            sep = true;
        }

        return sb.toString();
    }

    private static function compare(name:String, actual:String, expected:String):Bool {
        if (actual != expected) {
            log('${name} - FAILED\n');
            log('EXPECTED - "${expected}"\n');
            log('ACTUAL - "${actual}"\n');
            return false;
        }

        log('${name} - PASSED\n');
        return true;
    }

    private static function test(map:Map.IMap<String, Int>):Void {
        var passed = true;

        log('[ ${Type.getClassName(Type.getClass(map))} ]\n\n');

        if (!compare(
            "Initial",
            stringRepresentation(map),
            ""
        )) {
            passed = false;
        }

        if (!compare(
            "Exists non-existing non-reserved #1",
            Std.string(map.exists("k1")),
            "false"
        )) {
            passed = false;
        }

        if (!compare(
            "Get non-existing non-reserved #1",
            Std.string(map.get("k1")),
            "null"
        )) {
            passed = false;
        }

        if (!compare(
            "Exists non-existing reserved #1",
            Std.string(map.exists("__proto__")),
            "false"
        )) {
            passed = false;
        }

        if (!compare(
            "Get non-existing reserved #1",
            Std.string(map.get("__proto__")),
            "null"
        )) {
            passed = false;
        }

        map.set("k1", 1);
        map.set("k3", 3);

        if (!compare(
            "Set first and last non-reserved",
            stringRepresentation(map),
            "k1=1;k3=3"
        )) {
            passed = false;
        }

        if (!compare(
            "Exists non-existing non-reserved #2",
            Std.string(map.exists("k2")),
            "false"
        )) {
            passed = false;
        }

        map.set("__proto__", 101);

        if (!compare(
            "Set first reserved",
            stringRepresentation(map),
            "__proto__=101;k1=1;k3=3"
        )) {
            passed = false;
        }

        map.set("k2", 2);
        map.set("toString", 102);
        map.set("valueOf", 103);

        if (!compare(
            "Set more #1",
            stringRepresentation(map),
            "__proto__=101;k1=1;k2=2;k3=3;toString=102;valueOf=103"
        )) {
            passed = false;
        }

        map.set("k3", 3);

        if (!compare(
            "Set existing to the same value",
            stringRepresentation(map),
            "__proto__=101;k1=1;k2=2;k3=3;toString=102;valueOf=103"
        )) {
            passed = false;
        }

        map.set("hasOwnProperty", 104);
        map.set("toSource", 105);

        if (!compare(
            "Set more #2",
            stringRepresentation(map),
            "__proto__=101;hasOwnProperty=104;k1=1;k2=2;k3=3;toSource=105;toString=102;valueOf=103"
        )) {
            passed = false;
        }

        map.set("k3", 4);

        if (!compare(
            "Set existing to the different value",
            stringRepresentation(map),
            "__proto__=101;hasOwnProperty=104;k1=1;k2=2;k3=4;toSource=105;toString=102;valueOf=103"
        )) {
            passed = false;
        }

        map.set("isPrototypeOf", 106);
        map.set("toLocaleString", 107);

        if (!compare(
            "Set more #3",
            stringRepresentation(map),
            "__proto__=101;hasOwnProperty=104;isPrototypeOf=106;k1=1;k2=2;k3=4;toLocaleString=107;toSource=105;toString=102;valueOf=103"
        )) {
            passed = false;
        }

        if (!compare(
            "Exists existing non-reserved #1",
            Std.string(map.exists("k2")),
            "true"
        )) {
            passed = false;
        }

        if (!compare(
            "Get existing non-reserved #1",
            Std.string(map.get("k3")),
            "4"
        )) {
            passed = false;
        }

        if (!compare(
            "Exists existing reserved #1",
            Std.string(map.exists("toString")),
            "true"
        )) {
            passed = false;
        }

        if (!compare(
            "Get existing reserved #1",
            Std.string(map.get("hasOwnProperty")),
            "104"
        )) {
            passed = false;
        }

        map.remove("k1");

        if (!compare(
            "Remove non-reserved #1",
            stringRepresentation(map),
            "__proto__=101;hasOwnProperty=104;isPrototypeOf=106;k2=2;k3=4;toLocaleString=107;toSource=105;toString=102;valueOf=103"
        )) {
            passed = false;
        }

        map.remove("__proto__");

        if (!compare(
            "Remove first reserved #1",
            stringRepresentation(map),
            "hasOwnProperty=104;isPrototypeOf=106;k2=2;k3=4;toLocaleString=107;toSource=105;toString=102;valueOf=103"
        )) {
            passed = false;
        }

        map.remove("valueOf");

        if (!compare(
            "Remove last reserved #1",
            stringRepresentation(map),
            "hasOwnProperty=104;isPrototypeOf=106;k2=2;k3=4;toLocaleString=107;toSource=105;toString=102"
        )) {
            passed = false;
        }

        map.remove("hasOwnProperty");

        if (!compare(
            "Remove first reserved #2",
            stringRepresentation(map),
            "isPrototypeOf=106;k2=2;k3=4;toLocaleString=107;toSource=105;toString=102"
        )) {
            passed = false;
        }

        map.remove("toString");

        if (!compare(
            "Remove last reserved #2",
            stringRepresentation(map),
            "isPrototypeOf=106;k2=2;k3=4;toLocaleString=107;toSource=105"
        )) {
            passed = false;
        }

        map.set("a1", 11);

        if (!compare(
            "Set first non-reserved",
            stringRepresentation(map),
            "a1=11;isPrototypeOf=106;k2=2;k3=4;toLocaleString=107;toSource=105"
        )) {
            passed = false;
        }

        map.set("a2", 12);

        if (!compare(
            "Set non-reserved",
            stringRepresentation(map),
            "a1=11;a2=12;isPrototypeOf=106;k2=2;k3=4;toLocaleString=107;toSource=105"
        )) {
            passed = false;
        }

        map.set("z2", 14);

        if (!compare(
            "Set last non-reserved",
            stringRepresentation(map),
            "a1=11;a2=12;isPrototypeOf=106;k2=2;k3=4;toLocaleString=107;toSource=105;z2=14"
        )) {
            passed = false;
        }

        map.set("z1", 13);

        if (!compare(
            "Set non-reserved",
            stringRepresentation(map),
            "a1=11;a2=12;isPrototypeOf=106;k2=2;k3=4;toLocaleString=107;toSource=105;z1=13;z2=14"
        )) {
            passed = false;
        }

        map.remove("toLocaleString");

        if (!compare(
            "Remove reserved #1",
            stringRepresentation(map),
            "a1=11;a2=12;isPrototypeOf=106;k2=2;k3=4;toSource=105;z1=13;z2=14"
        )) {
            passed = false;
        }

        map.remove("isPrototypeOf");

        if (!compare(
            "Remove reserved #2",
            stringRepresentation(map),
            "a1=11;a2=12;k2=2;k3=4;toSource=105;z1=13;z2=14"
        )) {
            passed = false;
        }

        map.remove("k2");

        if (!compare(
            "Remove non-reserved #2",
            stringRepresentation(map),
            "a1=11;a2=12;k3=4;toSource=105;z1=13;z2=14"
        )) {
            passed = false;
        }

        map.remove("k3");

        if (!compare(
            "Remove non-reserved #3",
            stringRepresentation(map),
            "a1=11;a2=12;toSource=105;z1=13;z2=14"
        )) {
            passed = false;
        }

        map.remove("toSource");

        if (!compare(
            "Remove reserved #3",
            stringRepresentation(map),
            "a1=11;a2=12;z1=13;z2=14"
        )) {
            passed = false;
        }

        map.remove("a2");

        if (!compare(
            "Remove non-reserved #4",
            stringRepresentation(map),
            "a1=11;z1=13;z2=14"
        )) {
            passed = false;
        }

        map.remove("a1");

        if (!compare(
            "Remove first non-reserved",
            stringRepresentation(map),
            "z1=13;z2=14"
        )) {
            passed = false;
        }

        map.remove("z2");

        if (!compare(
            "Remove last non-reserved",
            stringRepresentation(map),
            "z1=13"
        )) {
            passed = false;
        }

        map.remove("z1");

        if (!compare(
            "Remove the last one non-reserved",
            stringRepresentation(map),
            ""
        )) {
            passed = false;
        }

        if (passed) {
            log("\nSummary - PASSED\n\n");
        } else {
            log("\nSummary - FAILED\n\n");
        }
    }

    private static function init():Void {
        test(new CachingKeysStringMap<Int>());
        test(new FastIteratingStringMap<Int>());
    }

    public static function main():Void {
        Browser.window.setTimeout(init, 1);
    }
}
