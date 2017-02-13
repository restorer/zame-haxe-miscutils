package ;

import haxe.Json;
import org.zamedev.lib.DynamicExt;

using org.zamedev.lib.DynamicTools;

class DynamicToolsSample {
    public static function main() {
        var node:DynamicExt = Json.parse('{"stringval":"haxe","arrayval":["haxe","cool"],"intval":42,"floatval":24.42,"boolval":true,"dynamicval":{"a":{"b":"c"}}}');

        var stringval:String = node["stringval"].asString();
        trace(stringval);

        var arrayval:Array<DynamicExt> = node["arrayval"].asArray();
        trace(arrayval);

        for (v in arrayval) {
            var sv:String = v.asString();
            trace(sv);
        }

        var intval:Int = node["intval"].asInt();
        trace(intval);

        intval = node["floatval"].asInt();
        trace(intval);

        var floatval:Float = node["floatval"].asFloat();
        trace(floatval);

        floatval = node["intval"].asFloat();
        trace(floatval);

        var boolval:Bool = node["boolval"].asBool();
        trace(boolval);

        stringval = node["nonexisting"].asString("defaultvalue");
        trace(stringval);

        var intnullval:Null<Int> = node["nonexisting"].asNullInt();
        trace(intnullval);

        var floatnullval:Null<Float> = node["nonexisting"].asNullFloat();
        trace(floatnullval);

        var dynamicval:DynamicExt = node["nonexisting"].asDynamic();
        trace(dynamicval);

        stringval = node.byPath(["dynamicval", "a", "b"]).asString();
        trace(stringval);

        dynamicval = node.byPath(["dynamicval", "nonexisting", "b"]);
        trace(dynamicval);

        dynamicval = node.byPath(["dynamicval", "nonexisting", "b"]).asDynamic();
        trace(dynamicval);
    }
}
