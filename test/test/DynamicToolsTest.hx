package test;

import org.zamedev.lib.DynamicExt;
import utest.Assert;
import utest.Test;

using org.zamedev.lib.DynamicTools;

class DynamicToolsTest extends Test {
    var node : DynamicExt;

    public function setup() : Void {
        node = {
            "stringval" : "haxe",
            "arrayval" : ["haxe", "cool"],
            "intval" : 42,
            "floatval" : 24.42,
            "boolval" : true,
            "dynamicval" : {
                "a" : {
                    "b" : "c",
                },
            },
        };
    }

    public function testAsDynamic() : Void {
        Assert.equals("haxe", node["stringval"].asDynamic());
        Assert.same({ "a" : { "b": "c" } }, node["dynamicval"].asDynamic());
        Assert.same({}, node["nonexisting"].asDynamic());
    }

    public function testAsArray() : Void {
        Assert.same(["haxe", "cool"], node["arrayval"].asArray());
        Assert.same([], node["stringval"].asArray());
        Assert.same([], node["nonexisting"].asArray());

        var arrayval = node["arrayval"].asArray();
        Assert.equals("haxe,cool", [for (v in arrayval) v.asString()].join(","));
    }

    public function testAsArrayElement() : Void {
        Assert.equals("haxe", node["arrayval"].asArrayElement(0));
        Assert.equals("cool", node["arrayval"].asArrayElement(1));
        Assert.equals(null, node["arrayval"].asArrayElement(2));
        Assert.equals(null, node["arrayval"].asArrayElement(-1));
        Assert.equals(null, node["stringval"].asArrayElement(0));
        Assert.equals(null, node["nonexisting"].asArrayElement(0));
    }

    public function testAsInt() : Void {
        Assert.equals(42, node["intval"].asInt());
        Assert.equals(24, node["floatval"].asInt());
        Assert.equals(0, node["stringval"].asInt());
        Assert.equals(0, node["nonexisting"].asInt());
        Assert.equals(12, node["nonexisting"].asInt(12));
    }

    public function testAsNullInt() : Void {
        Assert.equals(42, node["intval"].asNullInt());
        Assert.equals(24, node["floatval"].asNullInt());
        Assert.equals(null, node["stringval"].asNullInt());
        Assert.equals(null, node["nonexisting"].asNullInt());
    }

    public function testAsFloat() : Void {
        Assert.floatEquals(24.42, node["floatval"].asFloat());
        Assert.floatEquals(42.0, node["intval"].asFloat());
        Assert.floatEquals(0.0, node["stringval"].asFloat());
        Assert.floatEquals(0.0, node["nonexisting"].asFloat());
        Assert.floatEquals(12.0, node["nonexisting"].asFloat(12.0));
    }

    public function testAsNullFloat() : Void {
        Assert.floatEquals(24.42, node["floatval"].asNullFloat());
        Assert.floatEquals(42.0, node["intval"].asNullFloat());
        Assert.equals(null, node["stringval"].asNullFloat());
        Assert.equals(null, node["nonexisting"].asNullFloat());
    }

    public function testAsBool() : Void {
        Assert.equals(true, node["boolval"].asBool());
        Assert.equals(false, node["stringval"].asBool());
        Assert.equals(false, node["nonexisting"].asBool());
    }

    public function testAsString() : Void {
        Assert.equals("haxe", node["stringval"].asString());
        Assert.equals("42", node["intval"].asString());
        Assert.equals("", node["nonexisting"].asString());
        Assert.equals("defaultvalue", node["nonexisting"].asString("defaultvalue"));
    }

    public function testByPath() : Void {
        Assert.equals("c", node["dynamicval"].byPath(["a", "b"]));
        Assert.equals("c", node.byPath(["dynamicval", "a", "b"]));
        Assert.same({ "b": "c" }, node.byPath(["dynamicval", "a"]));
        Assert.equals(null, node.byPath(["dynamicval", "nonexisting"]));
        Assert.equals(null, node.byPath(["dynamicval", "nonexisting", "b"]));
        Assert.equals(null, node.byPath(["dynamicval", "a", "nonexisting"]));
    }
}
