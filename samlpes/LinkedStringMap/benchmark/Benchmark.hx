
package ;

import haxe.Json;
import haxe.Timer;
import js.Browser;
import js.html.ButtonElement;
import org.zamedev.lib.ds.LinkedStringMap;

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
        Browser.document.getElementById("log").innerHTML += s
            .split("&").join("&amp;")
            .split("<").join("&lt;")
            .split(">").join("&gt;")
            .split(" ").join("&nbsp;")
            .split("\n").join("<br />");

        Browser.window.scrollTo(0, Browser.document.body.scrollHeight);
    }

    
        
private static function benchmarkAll_OldStringMap(entryCount:Int):BenchmarkResult {
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


    var st:Float = Timer.stamp();
    var t:Float = 0;

    // warm-up jit
    while (true) {
        var map = new OldStringMap<Int>();
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


        t = Timer.stamp() - st;

        if (t > 1) {
            break;
        }
    }

    st = Timer.stamp();
    t = 0;
    var count:Int = 0;

    // actual computation
    while (true) {
        var map = new OldStringMap<Int>();
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


        count++;
        t = Timer.stamp() - st;

        if (t > 4) {
            break;
        }
    }

    return {
        iterations: count,
        time: Std.int(Math.round(t * 1000)),
    };
}
    
    
        
private static function benchmarkAll_NewStringMap(entryCount:Int):BenchmarkResult {
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


    var st:Float = Timer.stamp();
    var t:Float = 0;

    // warm-up jit
    while (true) {
        var map = new NewStringMap<Int>();
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


        t = Timer.stamp() - st;

        if (t > 1) {
            break;
        }
    }

    st = Timer.stamp();
    t = 0;
    var count:Int = 0;

    // actual computation
    while (true) {
        var map = new NewStringMap<Int>();
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


        count++;
        t = Timer.stamp() - st;

        if (t > 4) {
            break;
        }
    }

    return {
        iterations: count,
        time: Std.int(Math.round(t * 1000)),
    };
}
    
    
        
private static function benchmarkAll_CachingKeysStringMap(entryCount:Int):BenchmarkResult {
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


    var st:Float = Timer.stamp();
    var t:Float = 0;

    // warm-up jit
    while (true) {
        var map = new CachingKeysStringMap<Int>();
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


        t = Timer.stamp() - st;

        if (t > 1) {
            break;
        }
    }

    st = Timer.stamp();
    t = 0;
    var count:Int = 0;

    // actual computation
    while (true) {
        var map = new CachingKeysStringMap<Int>();
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


        count++;
        t = Timer.stamp() - st;

        if (t > 4) {
            break;
        }
    }

    return {
        iterations: count,
        time: Std.int(Math.round(t * 1000)),
    };
}
    
    
        
private static function benchmarkAll_LinkedStringMap(entryCount:Int):BenchmarkResult {
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


    var st:Float = Timer.stamp();
    var t:Float = 0;

    // warm-up jit
    while (true) {
        var map = new LinkedStringMap<Int>();
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


        t = Timer.stamp() - st;

        if (t > 1) {
            break;
        }
    }

    st = Timer.stamp();
    t = 0;
    var count:Int = 0;

    // actual computation
    while (true) {
        var map = new LinkedStringMap<Int>();
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


        count++;
        t = Timer.stamp() - st;

        if (t > 4) {
            break;
        }
    }

    return {
        iterations: count,
        time: Std.int(Math.round(t * 1000)),
    };
}
    
    
        
private static function benchmarkCombined_OldStringMap(entryCount:Int):BenchmarkResult {
    var map = new OldStringMap<Int>();

for (i in 0 ... entryCount) {
    map.set(Std.string(i), i);
}


    var st:Float = Timer.stamp();
    var t:Float = 0;

    // warm-up jit
    while (true) {
        var dummy:Int = 0;

for (key in map.keys()) {
    map.set(key, map.exists(key) ? (map.get(key) + 1) : 0);
    dummy++;
}

for (value in map) {
    dummy++;
}


        t = Timer.stamp() - st;

        if (t > 1) {
            break;
        }
    }

    st = Timer.stamp();
    t = 0;
    var count:Int = 0;

    // actual computation
    while (true) {
        var dummy:Int = 0;

for (key in map.keys()) {
    map.set(key, map.exists(key) ? (map.get(key) + 1) : 0);
    dummy++;
}

for (value in map) {
    dummy++;
}


        count++;
        t = Timer.stamp() - st;

        if (t > 4) {
            break;
        }
    }

    return {
        iterations: count,
        time: Std.int(Math.round(t * 1000)),
    };
}
    
    
        
private static function benchmarkCombined_NewStringMap(entryCount:Int):BenchmarkResult {
    var map = new NewStringMap<Int>();

for (i in 0 ... entryCount) {
    map.set(Std.string(i), i);
}


    var st:Float = Timer.stamp();
    var t:Float = 0;

    // warm-up jit
    while (true) {
        var dummy:Int = 0;

for (key in map.keys()) {
    map.set(key, map.exists(key) ? (map.get(key) + 1) : 0);
    dummy++;
}

for (value in map) {
    dummy++;
}


        t = Timer.stamp() - st;

        if (t > 1) {
            break;
        }
    }

    st = Timer.stamp();
    t = 0;
    var count:Int = 0;

    // actual computation
    while (true) {
        var dummy:Int = 0;

for (key in map.keys()) {
    map.set(key, map.exists(key) ? (map.get(key) + 1) : 0);
    dummy++;
}

for (value in map) {
    dummy++;
}


        count++;
        t = Timer.stamp() - st;

        if (t > 4) {
            break;
        }
    }

    return {
        iterations: count,
        time: Std.int(Math.round(t * 1000)),
    };
}
    
    
        
private static function benchmarkCombined_CachingKeysStringMap(entryCount:Int):BenchmarkResult {
    var map = new CachingKeysStringMap<Int>();

for (i in 0 ... entryCount) {
    map.set(Std.string(i), i);
}


    var st:Float = Timer.stamp();
    var t:Float = 0;

    // warm-up jit
    while (true) {
        var dummy:Int = 0;

for (key in map.keys()) {
    map.set(key, map.exists(key) ? (map.get(key) + 1) : 0);
    dummy++;
}

for (value in map) {
    dummy++;
}


        t = Timer.stamp() - st;

        if (t > 1) {
            break;
        }
    }

    st = Timer.stamp();
    t = 0;
    var count:Int = 0;

    // actual computation
    while (true) {
        var dummy:Int = 0;

for (key in map.keys()) {
    map.set(key, map.exists(key) ? (map.get(key) + 1) : 0);
    dummy++;
}

for (value in map) {
    dummy++;
}


        count++;
        t = Timer.stamp() - st;

        if (t > 4) {
            break;
        }
    }

    return {
        iterations: count,
        time: Std.int(Math.round(t * 1000)),
    };
}
    
    
        
private static function benchmarkCombined_LinkedStringMap(entryCount:Int):BenchmarkResult {
    var map = new LinkedStringMap<Int>();

for (i in 0 ... entryCount) {
    map.set(Std.string(i), i);
}


    var st:Float = Timer.stamp();
    var t:Float = 0;

    // warm-up jit
    while (true) {
        var dummy:Int = 0;

for (key in map.keys()) {
    map.set(key, map.exists(key) ? (map.get(key) + 1) : 0);
    dummy++;
}

for (value in map) {
    dummy++;
}


        t = Timer.stamp() - st;

        if (t > 1) {
            break;
        }
    }

    st = Timer.stamp();
    t = 0;
    var count:Int = 0;

    // actual computation
    while (true) {
        var dummy:Int = 0;

for (key in map.keys()) {
    map.set(key, map.exists(key) ? (map.get(key) + 1) : 0);
    dummy++;
}

for (value in map) {
    dummy++;
}


        count++;
        t = Timer.stamp() - st;

        if (t > 4) {
            break;
        }
    }

    return {
        iterations: count,
        time: Std.int(Math.round(t * 1000)),
    };
}
    
    
        
private static function benchmarkNoIterate_OldStringMap(entryCount:Int):BenchmarkResult {
    var keys:Array<String> = new Array<String>();

for (i in 0 ... entryCount) {
    keys.push(Std.string(i));
}


    var st:Float = Timer.stamp();
    var t:Float = 0;

    // warm-up jit
    while (true) {
        var map = new OldStringMap<Int>();

for (key in keys) {
    map.set(key, 1);
    map.set(key, map.exists(key) ? (map.get(key) + 1) : 0);
}

for (key in keys) {
    map.remove(key);
}


        t = Timer.stamp() - st;

        if (t > 1) {
            break;
        }
    }

    st = Timer.stamp();
    t = 0;
    var count:Int = 0;

    // actual computation
    while (true) {
        var map = new OldStringMap<Int>();

for (key in keys) {
    map.set(key, 1);
    map.set(key, map.exists(key) ? (map.get(key) + 1) : 0);
}

for (key in keys) {
    map.remove(key);
}


        count++;
        t = Timer.stamp() - st;

        if (t > 4) {
            break;
        }
    }

    return {
        iterations: count,
        time: Std.int(Math.round(t * 1000)),
    };
}
    
    
        
private static function benchmarkNoIterate_NewStringMap(entryCount:Int):BenchmarkResult {
    var keys:Array<String> = new Array<String>();

for (i in 0 ... entryCount) {
    keys.push(Std.string(i));
}


    var st:Float = Timer.stamp();
    var t:Float = 0;

    // warm-up jit
    while (true) {
        var map = new NewStringMap<Int>();

for (key in keys) {
    map.set(key, 1);
    map.set(key, map.exists(key) ? (map.get(key) + 1) : 0);
}

for (key in keys) {
    map.remove(key);
}


        t = Timer.stamp() - st;

        if (t > 1) {
            break;
        }
    }

    st = Timer.stamp();
    t = 0;
    var count:Int = 0;

    // actual computation
    while (true) {
        var map = new NewStringMap<Int>();

for (key in keys) {
    map.set(key, 1);
    map.set(key, map.exists(key) ? (map.get(key) + 1) : 0);
}

for (key in keys) {
    map.remove(key);
}


        count++;
        t = Timer.stamp() - st;

        if (t > 4) {
            break;
        }
    }

    return {
        iterations: count,
        time: Std.int(Math.round(t * 1000)),
    };
}
    
    
        
private static function benchmarkNoIterate_CachingKeysStringMap(entryCount:Int):BenchmarkResult {
    var keys:Array<String> = new Array<String>();

for (i in 0 ... entryCount) {
    keys.push(Std.string(i));
}


    var st:Float = Timer.stamp();
    var t:Float = 0;

    // warm-up jit
    while (true) {
        var map = new CachingKeysStringMap<Int>();

for (key in keys) {
    map.set(key, 1);
    map.set(key, map.exists(key) ? (map.get(key) + 1) : 0);
}

for (key in keys) {
    map.remove(key);
}


        t = Timer.stamp() - st;

        if (t > 1) {
            break;
        }
    }

    st = Timer.stamp();
    t = 0;
    var count:Int = 0;

    // actual computation
    while (true) {
        var map = new CachingKeysStringMap<Int>();

for (key in keys) {
    map.set(key, 1);
    map.set(key, map.exists(key) ? (map.get(key) + 1) : 0);
}

for (key in keys) {
    map.remove(key);
}


        count++;
        t = Timer.stamp() - st;

        if (t > 4) {
            break;
        }
    }

    return {
        iterations: count,
        time: Std.int(Math.round(t * 1000)),
    };
}
    
    
        
private static function benchmarkNoIterate_LinkedStringMap(entryCount:Int):BenchmarkResult {
    var keys:Array<String> = new Array<String>();

for (i in 0 ... entryCount) {
    keys.push(Std.string(i));
}


    var st:Float = Timer.stamp();
    var t:Float = 0;

    // warm-up jit
    while (true) {
        var map = new LinkedStringMap<Int>();

for (key in keys) {
    map.set(key, 1);
    map.set(key, map.exists(key) ? (map.get(key) + 1) : 0);
}

for (key in keys) {
    map.remove(key);
}


        t = Timer.stamp() - st;

        if (t > 1) {
            break;
        }
    }

    st = Timer.stamp();
    t = 0;
    var count:Int = 0;

    // actual computation
    while (true) {
        var map = new LinkedStringMap<Int>();

for (key in keys) {
    map.set(key, 1);
    map.set(key, map.exists(key) ? (map.get(key) + 1) : 0);
}

for (key in keys) {
    map.remove(key);
}


        count++;
        t = Timer.stamp() - st;

        if (t > 4) {
            break;
        }
    }

    return {
        iterations: count,
        time: Std.int(Math.round(t * 1000)),
    };
}
    
    
        
private static function benchmarkIterateOnly_OldStringMap(entryCount:Int):BenchmarkResult {
    var map = new OldStringMap<Int>();

for (i in 0 ... entryCount) {
    map.set(Std.string(i), i);
}


    var st:Float = Timer.stamp();
    var t:Float = 0;

    // warm-up jit
    while (true) {
        var dummy:Int = 0;

for (key in map.keys()) {
    dummy++;
}

for (value in map) {
    dummy++;
}


        t = Timer.stamp() - st;

        if (t > 1) {
            break;
        }
    }

    st = Timer.stamp();
    t = 0;
    var count:Int = 0;

    // actual computation
    while (true) {
        var dummy:Int = 0;

for (key in map.keys()) {
    dummy++;
}

for (value in map) {
    dummy++;
}


        count++;
        t = Timer.stamp() - st;

        if (t > 4) {
            break;
        }
    }

    return {
        iterations: count,
        time: Std.int(Math.round(t * 1000)),
    };
}
    
    
        
private static function benchmarkIterateOnly_NewStringMap(entryCount:Int):BenchmarkResult {
    var map = new NewStringMap<Int>();

for (i in 0 ... entryCount) {
    map.set(Std.string(i), i);
}


    var st:Float = Timer.stamp();
    var t:Float = 0;

    // warm-up jit
    while (true) {
        var dummy:Int = 0;

for (key in map.keys()) {
    dummy++;
}

for (value in map) {
    dummy++;
}


        t = Timer.stamp() - st;

        if (t > 1) {
            break;
        }
    }

    st = Timer.stamp();
    t = 0;
    var count:Int = 0;

    // actual computation
    while (true) {
        var dummy:Int = 0;

for (key in map.keys()) {
    dummy++;
}

for (value in map) {
    dummy++;
}


        count++;
        t = Timer.stamp() - st;

        if (t > 4) {
            break;
        }
    }

    return {
        iterations: count,
        time: Std.int(Math.round(t * 1000)),
    };
}
    
    
        
private static function benchmarkIterateOnly_CachingKeysStringMap(entryCount:Int):BenchmarkResult {
    var map = new CachingKeysStringMap<Int>();

for (i in 0 ... entryCount) {
    map.set(Std.string(i), i);
}


    var st:Float = Timer.stamp();
    var t:Float = 0;

    // warm-up jit
    while (true) {
        var dummy:Int = 0;

for (key in map.keys()) {
    dummy++;
}

for (value in map) {
    dummy++;
}


        t = Timer.stamp() - st;

        if (t > 1) {
            break;
        }
    }

    st = Timer.stamp();
    t = 0;
    var count:Int = 0;

    // actual computation
    while (true) {
        var dummy:Int = 0;

for (key in map.keys()) {
    dummy++;
}

for (value in map) {
    dummy++;
}


        count++;
        t = Timer.stamp() - st;

        if (t > 4) {
            break;
        }
    }

    return {
        iterations: count,
        time: Std.int(Math.round(t * 1000)),
    };
}
    
    
        
private static function benchmarkIterateOnly_LinkedStringMap(entryCount:Int):BenchmarkResult {
    var map = new LinkedStringMap<Int>();

for (i in 0 ... entryCount) {
    map.set(Std.string(i), i);
}


    var st:Float = Timer.stamp();
    var t:Float = 0;

    // warm-up jit
    while (true) {
        var dummy:Int = 0;

for (key in map.keys()) {
    dummy++;
}

for (value in map) {
    dummy++;
}


        t = Timer.stamp() - st;

        if (t > 1) {
            break;
        }
    }

    st = Timer.stamp();
    t = 0;
    var count:Int = 0;

    // actual computation
    while (true) {
        var dummy:Int = 0;

for (key in map.keys()) {
    dummy++;
}

for (value in map) {
    dummy++;
}


        count++;
        t = Timer.stamp() - st;

        if (t > 4) {
            break;
        }
    }

    return {
        iterations: count,
        time: Std.int(Math.round(t * 1000)),
    };
}
    
    

    private static var benchmarkVariants = [
        
            {
                name: "All",
                note: "Iterating plus get / set / exists and remove",
                funcVariants: [
                    
                        {
                            type: "old",
                            mapClass: "OldStringMap",
                            func: benchmarkAll_OldStringMap,
                        },
                    
                        {
                            type: "new",
                            mapClass: "NewStringMap",
                            func: benchmarkAll_NewStringMap,
                        },
                    
                        {
                            type: "caching",
                            mapClass: "CachingKeysStringMap",
                            func: benchmarkAll_CachingKeysStringMap,
                        },
                    
                        {
                            type: "linked",
                            mapClass: "LinkedStringMap",
                            func: benchmarkAll_LinkedStringMap,
                        },
                    
                ],
            },
        
            {
                name: "Combined",
                note: "Iterating plus get / set / exists, without remove",
                funcVariants: [
                    
                        {
                            type: "old",
                            mapClass: "OldStringMap",
                            func: benchmarkCombined_OldStringMap,
                        },
                    
                        {
                            type: "new",
                            mapClass: "NewStringMap",
                            func: benchmarkCombined_NewStringMap,
                        },
                    
                        {
                            type: "caching",
                            mapClass: "CachingKeysStringMap",
                            func: benchmarkCombined_CachingKeysStringMap,
                        },
                    
                        {
                            type: "linked",
                            mapClass: "LinkedStringMap",
                            func: benchmarkCombined_LinkedStringMap,
                        },
                    
                ],
            },
        
            {
                name: "Without iteration",
                note: "Just get / set / exists / remove, without iterating",
                funcVariants: [
                    
                        {
                            type: "old",
                            mapClass: "OldStringMap",
                            func: benchmarkNoIterate_OldStringMap,
                        },
                    
                        {
                            type: "new",
                            mapClass: "NewStringMap",
                            func: benchmarkNoIterate_NewStringMap,
                        },
                    
                        {
                            type: "caching",
                            mapClass: "CachingKeysStringMap",
                            func: benchmarkNoIterate_CachingKeysStringMap,
                        },
                    
                        {
                            type: "linked",
                            mapClass: "LinkedStringMap",
                            func: benchmarkNoIterate_LinkedStringMap,
                        },
                    
                ],
            },
        
            {
                name: "Iteration only",
                note: "Just iterating, without get / set / exists / remove",
                funcVariants: [
                    
                        {
                            type: "old",
                            mapClass: "OldStringMap",
                            func: benchmarkIterateOnly_OldStringMap,
                        },
                    
                        {
                            type: "new",
                            mapClass: "NewStringMap",
                            func: benchmarkIterateOnly_NewStringMap,
                        },
                    
                        {
                            type: "caching",
                            mapClass: "CachingKeysStringMap",
                            func: benchmarkIterateOnly_CachingKeysStringMap,
                        },
                    
                        {
                            type: "linked",
                            mapClass: "LinkedStringMap",
                            func: benchmarkIterateOnly_LinkedStringMap,
                        },
                    
                ],
            },
        
    ];

    private static function step():Void {
        if (benchmarkIndex < 0) {
            benchmarkIndex = 0;

            log('\n## ${benchmarkVariants[benchmarkIndex].name}\n');
            log('\n### ${benchmarkVariants[benchmarkIndex].funcVariants[funcIndex].mapClass}\n\n```\n');
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
                log(' | avg: ${Math.round(iterationsSum / REPEAT_COUNT)} per ${Math.round(timeSum / REPEAT_COUNT)}\n');

                resultDataEntry.values.push({
                    type: benchmarkVariants[benchmarkIndex].funcVariants[funcIndex].type,
                    value: Math.round(iterationsSum / REPEAT_COUNT),
                });

                iterationsSum = 0;
                timeSum = 0;
                repeatNumber = 0;
                entryCountIndex++;

                if (entryCountIndex >= entryCountVariants.length) {
                    log("```\n");

                    entryCountIndex = 0;
                    funcIndex++;

                    if (funcIndex >= benchmarkVariants[benchmarkIndex].funcVariants.length) {
                        funcIndex = 0;
                        benchmarkIndex++;

                        if (benchmarkIndex >= benchmarkVariants.length) {
                            log("\n# Done\n\n");
                            log(Json.stringify(resultDataList, null, "    "));
                            return;
                        }

                        log('\n## ${benchmarkVariants[benchmarkIndex].name}\n');

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

                    log('\n### ${benchmarkVariants[benchmarkIndex].funcVariants[funcIndex].mapClass}\n\n```\n');
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
            log(", ");
        }

        log('${result.iterations} per ${result.time}');

        iterationsSum += result.iterations;
        timeSum += result.time;

        Browser.window.setTimeout(step, TIMEOUT_VALUE);
    }

    public static function onstart(_):Void {
        (cast Browser.document.getElementById("start"):ButtonElement).disabled = true;

        if (Browser.navigator.userAgent.indexOf(" Firefox/") >= 0) {
            browserId = "firefox";
        } else if (Browser.navigator.userAgent.indexOf(" Chrome/") >= 0) {
            browserId = "chrome";
        } else if (Browser.navigator.userAgent.indexOf(" Safari/") >= 0) {
            browserId = "safari";
        } else {
            browserId = Browser.navigator.userAgent;
        }

        log('# ${browserId}\n');
        Browser.window.setTimeout(step, TIMEOUT_VALUE);
    }

    public static function init():Void {
        Browser.document.getElementById("start").onclick = onstart;
    }

    public static function main():Void {
        Browser.window.setTimeout(init, TIMEOUT_VALUE);
    }
}
    