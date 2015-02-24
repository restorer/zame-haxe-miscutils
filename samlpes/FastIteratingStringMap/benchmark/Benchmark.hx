package ;

import haxe.Timer;
import js.Browser;
import js.html.ButtonElement;
import org.zamedev.lib.FastIteratingStringMap;

typedef BenchmarkResult = {
	iterations:Int,
	time:Int,
};

typedef CreatorFunc = Void->Map.IMap<String, Int>;
typedef BenchmarkFunc = Int->CreatorFunc->BenchmarkResult;

typedef BenchmarkVariant = {
	name:String,
	func:BenchmarkFunc,
};

class Benchmark {
	private static inline var WARMUP_SECONDS:Int = 1;
	private static inline var COMPUTATION_SECONDS:Int = 4;
	private static inline var REPEAT_COUNT:Int = 5;

	private static var benchmarkVariants:Array<BenchmarkVariant> = [{
		name: "Iteration only",
		func: benchmarkIterateOnly,
	}, {
		name: "Without iteration",
		func: benchmarkNoIterate,
	}, {
		name: "Combined",
		func: benchmarkCombined,
	}];

	private static var creatorVariants:Array<CreatorFunc> = [oldMapCreator, newMapCreator, fastIteratingMapCreator];
	private static var entryCountVariants:Array<Int> = [10, 100, 1000, 10000, 100000];

	private static var benchmarkIndex:Int = -1;
	private static var creatorIndex:Int = 0;
	private static var entryCountIndex:Int = 0;
	private static var repeatNumber:Int = 0;

	private static var iterationsSum:Int = 0;
	private static var timeSum:Int = 0;

	private static function log(s:String):Void {
		Browser.document.getElementById("log").innerHTML += s
			.split("&").join("&amp;")
			.split("<").join("&lt;")
			.split(">").join("&gt;")
			.split("\n").join("<br />");

		Browser.window.scrollTo(0, Browser.document.body.scrollHeight);
	}

	private static function oldMapCreator():Map.IMap<String, Int> {
		return new OldStringMap<Int>();
	}

	private static function newMapCreator():Map.IMap<String, Int> {
		return new NewStringMap<Int>();
	}

	private static function fastIteratingMapCreator():Map.IMap<String, Int> {
		return new FastIteratingStringMap<Int>();
	}

	private static function benchmarkIterateOnly(entryCount:Int, createMapFunc:CreatorFunc):BenchmarkResult {
		var map = createMapFunc();

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

			if (t > WARMUP_SECONDS) {
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

			if (t > COMPUTATION_SECONDS) {
				break;
			}
		}

		return {
			iterations: count,
			time: Std.int(Math.round(t * 1000)),
		};
	}

	// https://github.com/HaxeFoundation/haxe/pull/3743#issuecomment-70280834
	private static function benchmarkNoIterate(entryCount:Int, createMapFunc:CreatorFunc):BenchmarkResult {
		var keys:Array<String> = new Array<String>();

		for (i in 0 ... entryCount) {
			keys.push(Std.string(i));
		}

		var st:Float = Timer.stamp();
		var t:Float = 0;

		// warm-up jit
		while (true) {
			var map = createMapFunc();

			for (key in keys) {
				map.set(key, 1);
				map.set(key, map.exists(key) ? (map.get(key) + 1) : 0);
			}

			for (key in keys) {
				map.remove(key);
			}

			t = Timer.stamp() - st;

			if (t > WARMUP_SECONDS) {
				break;
			}
		}

		st = Timer.stamp();
		t = 0;
		var count:Int = 0;

		// actual computation
		while (true) {
			var map = createMapFunc();

			for (key in keys) {
				map.set(key, 1);
				map.set(key, map.exists(key) ? (map.get(key) + 1) : 0);
			}

			for (key in keys) {
				map.remove(key);
			}

			count++;
			t = Timer.stamp() - st;

			if (t > COMPUTATION_SECONDS) {
				break;
			}
		}

		return {
			iterations: count,
			time: Std.int(Math.round(t * 1000)),
		};
	}

	private static function benchmarkCombined(entryCount:Int, createMapFunc:CreatorFunc):BenchmarkResult {
		var map = createMapFunc();

		for (i in 0 ... entryCount) {
			map.set(Std.string(i), i);
		}

		var st:Float = Timer.stamp();
		var t:Float = 0;

		// warm-up jit
		while (true) {
			var dummy:Int = 0;

			for (key in map.keys()) {
				dummy += (map.exists(key) ? map.get(key) : 0);
			}

			for (value in map) {
				dummy++;
			}

			t = Timer.stamp() - st;

			if (t > WARMUP_SECONDS) {
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
				dummy += (map.exists(key) ? map.get(key) : 0);
			}

			for (value in map) {
				dummy++;
			}

			count++;
			t = Timer.stamp() - st;

			if (t > COMPUTATION_SECONDS) {
				break;
			}
		}

		return {
			iterations: count,
			time: Std.int(Math.round(t * 1000)),
		};
	}

	private static function step():Void {
		if (benchmarkIndex < 0) {
			benchmarkIndex = 0;

			log('\n## ${benchmarkVariants[benchmarkIndex].name}\n');

			var map = creatorVariants[creatorIndex]();
			log('\n### ${Type.getClassName(Type.getClass(map))}\n\n```\n');

			log('${entryCountVariants[entryCountIndex]} | ');
		} else {
			repeatNumber++;

			if (repeatNumber >= REPEAT_COUNT) {
				log(' | avg: ${Math.round(iterationsSum / REPEAT_COUNT)} per ${Math.round(timeSum / REPEAT_COUNT)}\n');

				iterationsSum = 0;
				timeSum = 0;
				repeatNumber = 0;
				entryCountIndex++;

				if (entryCountIndex >= entryCountVariants.length) {
					log("```\n");

					entryCountIndex = 0;
					creatorIndex++;

					if (creatorIndex >= creatorVariants.length) {
						creatorIndex = 0;
						benchmarkIndex++;

						if (benchmarkIndex >= benchmarkVariants.length) {
							log("\n# Done");
							return;
						}

						log('\n## ${benchmarkVariants[benchmarkIndex].name}\n');
					}

					var map = creatorVariants[creatorIndex]();
					log('\n### ${Type.getClassName(Type.getClass(map))}\n\n```\n');
				}

				log('${entryCountVariants[entryCountIndex]} | ');
			}
		}

		var result = benchmarkVariants[benchmarkIndex].func(entryCountVariants[entryCountIndex], creatorVariants[creatorIndex]);

		if (repeatNumber != 0) {
			log(", ");
		}

		log('${result.iterations} per ${result.time}');

		iterationsSum += result.iterations;
		timeSum += result.time;

		Browser.window.setTimeout(step, 1);
	}

	public static function onstart(_):Void {
		(cast Browser.document.getElementById("start"):ButtonElement).disabled = true;

		log('# ${Browser.navigator.userAgent}\n');
		Browser.window.setTimeout(step, 1);
	}

	public static function init():Void {
		Browser.document.getElementById("start").onclick = onstart;
	}

	public static function main():Void {
		Browser.window.setTimeout(init, 1);
	}
}
