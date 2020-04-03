package ;

using org.zamedev.lib.LambdaExt;

class LambdaExtSample {
    public static function main() {
        var map = new Map<String, String>();
        map["foo"] = "bar";
        map["bar"] = "baz";

        var result1 : Array<String> = map.keys().array();
        trace(result1);

        var result2 : Array<String> = map.keys().map(function(v) { return v.toUpperCase(); });
        trace(result2);
    }
}
