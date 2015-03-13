package org.zamedev.lib;

import haxe.Int32;
import haxe.Int64;

class JavaRandom {
    private static var MULTIPLIER:Int64 = Int64.make(0x05, 0xdeece66d);
    private static var ADDEND:Int64 = Int64.ofInt(0x0b);
    private static var MASK:Int64 = Int64.sub(Int64.shl(Int64.ofInt(1), 48), Int64.ofInt(1));
    private static var MASK_INT:Int64 = Int64.ofInt(0xffffffff);

    private var _seed:Int64;

    public var seed(get, set):Int64;

    public function new(?seed:Int64):Void {
        if (seed != null) {
            this.seed = seed;
        } else {
            this.seed = Int64.ofInt(0);
        }
    }

    public function randNext(bits:Int):Int {
        _seed = Int64.and(Int64.add(Int64.mul(_seed, MULTIPLIER), ADDEND), MASK);
        return Int64.getLow(Int64.and(Int64.shr(_seed, 48 - bits), MASK_INT));
    }

    public function rand(n:Int):Int {
        // i.e., n is a power of 2
        if ((n & -n) == n) {
            return Int64.getLow(Int64.and(Int64.shr(Int64.mul(Int64.ofInt(n), Int64.ofInt(randNext(31))), 31), MASK_INT));
        }

        while (true) {
            var bits:Int32 = randNext(31);
            var val:Int32 = bits % n;

            if (Int32.ucompare(bits - val + ((cast n:Int32) - 1), 0) >= 0) {
                return val;
            }
        }
    }

    public function fromArray<T>(arr:Array<T>):Null<T> {
        return (arr != null && arr.length > 0) ? arr[rand(arr.length)] : null;
    }

    public function shuffle<T>(arr:Array<T>):Array<T> {
        if (arr != null) {
            for (i in 0 ... arr.length) {
                var j = rand(arr.length);

                var t = arr[i];
                arr[i] = arr[j];
                arr[j] = t;
            }
        }

        return arr;
    }

    @:noCompletion
    private function get_seed():Int64 {
        return _seed;
    }

    @:noCompletion
    private function set_seed(value:Int64):Int64 {
        _seed = Int64.and(Int64.xor(value, MULTIPLIER), MASK);
        return value;
    }
}
