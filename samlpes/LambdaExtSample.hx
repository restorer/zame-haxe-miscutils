package ;

using org.zamedev.lib.LambdaExt;

class LambdaExtSample {
    public static function main() {
        var map = new Map<String, String>();
        map["foo"] = "bar";
        map["bar"] = "baz";

        var arrayval:Array<String> = map.keys().array();
        trace(arrayval);

        var listval:List<String> = map.keys().map(function(v) { return v.toUpperCase(); });
        trace(listval);
    }
}
