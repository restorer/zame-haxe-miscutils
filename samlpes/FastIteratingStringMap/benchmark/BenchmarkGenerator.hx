package ;

import org.zamedev.lib.DynamicExt;
import sys.io.File;

using StringTools;

typedef BenchmarkVariant = {
    name:String,
    note:String,
    template:String,
};

typedef MapClassVariant = {
    type:String,
    mapClass:String,
};

class BenchmarkGenerator {
    private static inline var OUTPUT_FILE_NAME:String = "Benchmark.hx";
    private static inline var WARMUP_SECONDS:Int = 1;
    private static inline var COMPUTATION_SECONDS:Int = 4;

    private static var RESULT_TEMPLATE:String = "
package ;

import haxe.Json;
import haxe.Timer;
import js.Browser;
import js.html.ButtonElement;
import org.zamedev.lib.FastIteratingStringMap;

typedef BenchmarkResult = {
    iterations:Int,
    time:Int,
};

typedef BenchmarkFunc = Int->BenchmarkResult;

typedef BenchmarkFuncVariant = {
    type:String,
    mapClass:String,
    func:BenchmarkFunc,
};

typedef BenchmarkVariant = {
    name:String,
    note:String,
    funcVariants:Array<BenchmarkFuncVariant>,
};

typedef ResultDataEntryItem = {
    type:String,
    value:Int,
};

typedef ResultDataEntry = {
    entryCount:Int,
    values:Array<ResultDataEntryItem>
};

typedef ResultDataBrowser = {
    browser:String,
    entries:Array<ResultDataEntry>,
};

typedef ResultData = {
    benchmark:String,
    note:String,
    browsers:Array<ResultDataBrowser>,
};

class Benchmark {
    private static inline var TIMEOUT_VALUE:Int = 15;
    private static inline var REPEAT_COUNT:Int = 5;

    private static var entryCountVariants:Array<Int> = [10, 100, 1000, 10000, 100000];

    private static var browserId:String;
    private static var benchmarkIndex:Int = -1;
    private static var funcIndex:Int = 0;
    private static var entryCountIndex:Int = 0;
    private static var repeatNumber:Int = 0;

    private static var iterationsSum:Int = 0;
    private static var timeSum:Int = 0;

    private static var resultDataList:Array<ResultData> = [];
    private static var resultData:ResultData;
    private static var resultDataBrowser:ResultDataBrowser;
    private static var resultDataEntry:ResultDataEntry;

    private static function log(s:String):Void {
        Browser.document.getElementById(\"log\").innerHTML += s
            .split(\"&\").join(\"&amp;\")
            .split(\"<\").join(\"&lt;\")
            .split(\">\").join(\"&gt;\")
            .split(\" \").join(\"&nbsp;\")
            .split(\"\\n\").join(\"<br />\");

        Browser.window.scrollTo(0, Browser.document.body.scrollHeight);
    }

    ::foreach funcBodies::
        ::__current__::
    ::end::

    private static var benchmarkVariants = [
        ::foreach benchmarkVariants::
            {
                name: \"::name::\",
                note: \"::note::\",
                funcVariants: [
                    ::foreach funcVariants::
                        {
                            type: \"::type::\",
                            mapClass: \"::mapClass::\",
                            func: ::func::,
                        },
                    ::end::
                ],
            },
        ::end::
    ];

    private static function step():Void {
        if (benchmarkIndex < 0) {
            benchmarkIndex = 0;

            log('\\n## ${benchmarkVariants[benchmarkIndex].name}\\n');
            log('\\n### ${benchmarkVariants[benchmarkIndex].funcVariants[funcIndex].mapClass}\\n\\n```\\n');
            log('${entryCountVariants[entryCountIndex]} | ');

            resultDataEntry = {
                entryCount: entryCountVariants[entryCountIndex],
                values: [],
            };

            resultDataBrowser = {
                browser: browserId,
                entries: [ resultDataEntry ],
            };

            resultData = {
                benchmark: benchmarkVariants[benchmarkIndex].name,
                note: benchmarkVariants[benchmarkIndex].note,
                browsers: [ resultDataBrowser ],
            };

            resultDataList.push(resultData);
        } else {
            repeatNumber++;

            if (repeatNumber >= REPEAT_COUNT) {
                log(' | avg: ${Math.round(iterationsSum / REPEAT_COUNT)} per ${Math.round(timeSum / REPEAT_COUNT)}\\n');

                resultDataEntry.values.push({
                    type: benchmarkVariants[benchmarkIndex].funcVariants[funcIndex].type,
                    value: Math.round(iterationsSum / REPEAT_COUNT),
                });

                iterationsSum = 0;
                timeSum = 0;
                repeatNumber = 0;
                entryCountIndex++;

                if (entryCountIndex >= entryCountVariants.length) {
                    log(\"```\\n\");

                    entryCountIndex = 0;
                    funcIndex++;

                    if (funcIndex >= benchmarkVariants[benchmarkIndex].funcVariants.length) {
                        funcIndex = 0;
                        benchmarkIndex++;

                        if (benchmarkIndex >= benchmarkVariants.length) {
                            log(\"\\n# Done\\n\\n\");
                            log(Json.stringify(resultDataList, null, \"    \"));
                            return;
                        }

                        log('\\n## ${benchmarkVariants[benchmarkIndex].name}\\n');

                        resultDataEntry = {
                            entryCount: entryCountVariants[entryCountIndex],
                            values: [],
                        };

                        resultDataBrowser = {
                            browser: browserId,
                            entries: [ resultDataEntry ],
                        };

                        resultData = {
                            benchmark: benchmarkVariants[benchmarkIndex].name,
                            note: benchmarkVariants[benchmarkIndex].note,
                            browsers: [ resultDataBrowser ],
                        };

                        resultDataList.push(resultData);
                    }

                    log('\\n### ${benchmarkVariants[benchmarkIndex].funcVariants[funcIndex].mapClass}\\n\\n```\\n');
                }

                var found = false;

                for (item in resultDataBrowser.entries) {
                    if (item.entryCount == entryCountVariants[entryCountIndex]) {
                        resultDataEntry = item;
                        found = true;
                    }
                }

                if (!found) {
                    resultDataEntry = {
                        entryCount: entryCountVariants[entryCountIndex],
                        values: [],
                    };

                    resultDataBrowser.entries.push(resultDataEntry);
                }

                log('${entryCountVariants[entryCountIndex]} | ');
            }
        }

        var result = benchmarkVariants[benchmarkIndex].funcVariants[funcIndex].func(entryCountVariants[entryCountIndex]);

        if (repeatNumber != 0) {
            log(\", \");
        }

        log('${result.iterations} per ${result.time}');

        iterationsSum += result.iterations;
        timeSum += result.time;

        Browser.window.setTimeout(step, TIMEOUT_VALUE);
    }

    public static function onstart(_):Void {
        (cast Browser.document.getElementById(\"start\"):ButtonElement).disabled = true;

        if (Browser.navigator.userAgent.indexOf(\" Firefox/\") >= 0) {
            browserId = \"firefox\";
        } else if (Browser.navigator.userAgent.indexOf(\" Chrome/\") >= 0) {
            browserId = \"chrome\";
        } else if (Browser.navigator.userAgent.indexOf(\" Safari/\") >= 0) {
            browserId = \"safari\";
        } else {
            browserId = Browser.navigator.userAgent;
        }

        log('# ${browserId}\\n');
        Browser.window.setTimeout(step, TIMEOUT_VALUE);
    }

    public static function init():Void {
        Browser.document.getElementById(\"start\").onclick = onstart;
    }

    public static function main():Void {
        Browser.window.setTimeout(init, TIMEOUT_VALUE);
    }
}
    ";

    private static var BENCHMARK_TEMPLATE:String = "
private static function ::funcName::(entryCount:Int):BenchmarkResult {
    ::prepare::

    var st:Float = Timer.stamp();
    var t:Float = 0;

    // warm-up jit
    while (true) {
        ::loop::

        t = Timer.stamp() - st;

        if (t > ::warmupSeconds::) {
            break;
        }
    }

    st = Timer.stamp();
    t = 0;
    var count:Int = 0;

    // actual computation
    while (true) {
        ::loop::

        count++;
        t = Timer.stamp() - st;

        if (t > ::computationSeconds::) {
            break;
        }
    }

    return {
        iterations: count,
        time: Std.int(Math.round(t * 1000)),
    };
}
    ";

    private static var BENCHMARK_ITERATE_ONLY:String = "
[[funcName-]]

benchmarkIterateOnly_::mapClass::

[[prepare]]

var map = new ::mapClass::<Int>();

for (i in 0 ... entryCount) {
    map.set(Std.string(i), i);
}

[[loop]]

var dummy:Int = 0;

for (key in map.keys()) {
    dummy++;
}

for (value in map) {
    dummy++;
}
    ";

    // https://github.com/HaxeFoundation/haxe/pull/3743#issuecomment-70280834
    private static var BENCHMARK_NO_ITERATE:String = "
[[funcName-]]

benchmarkNoIterate_::mapClass::

[[prepare]]

var keys:Array<String> = new Array<String>();

for (i in 0 ... entryCount) {
    keys.push(Std.string(i));
}

[[loop]]

var map = new ::mapClass::<Int>();

for (key in keys) {
    map.set(key, 1);
    map.set(key, map.exists(key) ? (map.get(key) + 1) : 0);
}

for (key in keys) {
    map.remove(key);
}
    ";

    private static var BENCHMARK_COMBINED:String = "
[[funcName-]]

benchmarkCombined_::mapClass::

[[prepare]]

var map = new ::mapClass::<Int>();

for (i in 0 ... entryCount) {
    map.set(Std.string(i), i);
}

[[loop]]

var dummy:Int = 0;

for (key in map.keys()) {
    dummy += (map.exists(key) ? map.get(key) : 0);
}

for (value in map) {
    dummy++;
}
    ";

    private static var BENCHMARK_ALL:String = "
[[funcName-]]

benchmarkAll_::mapClass::

[[prepare]]

var keys:Array<String> = [];
var halfKeys1:Array<String> = [];
var halfKeys2:Array<String> = [];
var mid = Std.int(entryCount / 2);

for (i in 0 ... entryCount) {
    var key = Std.string(i);
    keys.push(key);

    if (i < mid) {
        halfKeys1.push(key);
    } else {
        halfKeys2.push(key);
    }
}

[[loop]]

var map = new ::mapClass::<Int>();
var dummy:Int = 0;

for (key in keys) {
    map.set(key, 1);
}

var idx:Int = 0;

for (key in map.keys()) {
    dummy += (map.exists(key) ? map.get(key) : 0);
    idx++;

    if (idx >= mid) {
        break;
    }
}

idx = 0;

for (value in map) {
    dummy++;
    idx++;

    if (idx >= mid) {
        break;
    }
}

for (key in halfKeys1) {
    map.remove(key);
}

for (key in map.keys()) {
    dummy += (map.exists(key) ? map.get(key) : 0);
}

for (value in map) {
    dummy++;
}

for (key in halfKeys2) {
    map.remove(key);
}
    ";

    private static var BENCHMARK_VARIANTS:Array<BenchmarkVariant> = [{
        name: "Iteration only",
        note: "Just iterating, without get / set / exists / remove",
        template: BENCHMARK_ITERATE_ONLY,
    }, {
        name: "Combined",
        note: "Iterating plus get / set / exists, without remove",
        template: BENCHMARK_COMBINED,
    }, {
        name: "Without iteration",
        note: "Just get / set / exists / remove, without iterating",
        template: BENCHMARK_NO_ITERATE,
    }, {
        name: "All",
        note: "Iterating plus get / set / exists and remove",
        template: BENCHMARK_ALL,
    }];

    private static var MAP_CLASS_VARIANTS:Array<MapClassVariant> = [{
        type: "old",
        mapClass: "OldStringMap",
    }, {
        type: "new",
        mapClass: "NewStringMap",
    }, {
        type: "caching",
        mapClass: "CachingKeysStringMap",
    }, {
        type: "fast",
        mapClass: "FastIteratingStringMap",
    }];

    private static function splitTemplate(templateStr:String, vars:DynamicExt):DynamicExt {
        var section = null;
        var doTrim = new Map<String, Bool>();
        var result:DynamicExt = {};

        var re = ~/^\s*\[\[([a-z]+)(\-)?\]\]\s*$/i;

        for (line in ~/[\r\n]/g.split(templateStr)) {
            if (re.match(line)) {
                section = re.matched(1);
                doTrim[section] = (re.matched(2) != null);

                if (!result.exists(section)) {
                    result[section] = "";
                }
            } else if (section != null) {
                result[section] += (doTrim[section] ? line.trim() : line.rtrim()) + "\n";
            }
        }

        for (k in result.keys()) {
            var str = ~/^\n+/s.replace(result[k], "");

            if (doTrim[k]) {
                str = ~/\n+$/s.replace(str, "");
            } else {
                str = ~/\n+$/s.replace(str, "\n");
            }

            var template = new haxe.Template(str);
            result[k] = template.execute(vars);
        }

        return result;
    }

    public static function main():Void {
        var template = new haxe.Template(BENCHMARK_TEMPLATE);
        var resFuncBodies = new Array<String>();
        var resBenchmarkVariants = new Array<DynamicExt>();

        for (benchmarkVariant in BENCHMARK_VARIANTS) {
            var resFuncVariants = new Array<DynamicExt>();

            for (mapClassVariant in MAP_CLASS_VARIANTS) {
                var vars = splitTemplate(benchmarkVariant.template, { mapClass: mapClassVariant.mapClass });

                vars["warmupSeconds"] = WARMUP_SECONDS;
                vars["computationSeconds"] = COMPUTATION_SECONDS;

                resFuncBodies.push(template.execute(vars));

                resFuncVariants.push({
                    type: mapClassVariant.type,
                    mapClass: mapClassVariant.mapClass,
                    func: vars["funcName"],
                });
            }

            resBenchmarkVariants.push({
                name: benchmarkVariant.name,
                note: benchmarkVariant.note,
                funcVariants: resFuncVariants,
            });
        }

        var template = new haxe.Template(RESULT_TEMPLATE);

        var result = template.execute({
            funcBodies: resFuncBodies,
            benchmarkVariants: resBenchmarkVariants,
        });

        var fo = File.write(OUTPUT_FILE_NAME, true);
        fo.writeString(result);
        fo.close();
    }
}
