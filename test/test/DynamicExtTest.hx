package test;

import org.zamedev.lib.DynamicExt;
import utest.Assert;
import utest.Test;

class DynamicExtTest extends Test {
    public function testHasNoCompilationErrors() : Void {
        Assert.notEquals(null, new DynamicExt());
    }

    public function testSet() : Void {
        var node = new DynamicExt();
        node["foo"] = "bar";
        Assert.same({ "foo" : "bar" }, node);
    }

    public function testGet() : Void {
        var node : DynamicExt = { "foo" : "bar" };
        Assert.equals("bar", node["foo"]);

        node["bar"] = "baz";
        Assert.equals("baz", node["bar"]);
    }

    public function testExists() : Void {
        var node : DynamicExt = { "foo" : "bar" };
        Assert.isTrue(node.exists("foo"));
        Assert.isFalse(node.exists("bar"));

        node["bar"] = "baz";
        Assert.isTrue(node.exists("bar"));
    }

    public function testRemove() : Void {
        var node : DynamicExt = { "foo" : "bar", "bar" : "baz" };
        node.remove("foo");
        Assert.same({ "bar" : "baz" }, node);

        node.remove("baz");
        Assert.same({ "bar" : "baz" }, node);

        node.remove("bar");
        Assert.same({}, node);
    }

    public function testKeys() : Void {
        var node : DynamicExt = { "foo" : "bar", "bar" : "baz" };
        var keys = node.keys();

        Assert.equals(2, keys.length);
        Assert.contains("foo", keys);
        Assert.contains("bar", keys);
        Assert.notContains("baz", keys);
    }
}
