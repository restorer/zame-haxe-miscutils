package ;

import org.zamedev.lib.DynamicExt;

class DynamicExtSample {
    public static function main() {
        var node = new DynamicExt();

        node["foo"] = "bar";
        trace(node["foo"]);

        trace(node.exists("foo"));
        trace(node.exists("bar"));

        node["bar"] = "baz";
        trace(node.keys());

        node.remove("foo");
        trace(node.keys());
    }
}
