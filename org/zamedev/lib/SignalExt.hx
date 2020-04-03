package org.zamedev.lib;

import msignal.Slot;
import msignal.Signal;

class Slot3<T1, T2, T3> extends Slot<Signal3<T1, T2, T3>, T1->T2->T3->Void> {
    public var param1 : T1;
    public var param2 : T2;
    public var param3 : T3;

    public function new(signal : Signal3<T1, T2, T3>, listener : T1->T2->T3->Void, ?once : Bool = false, ?priority : Int = 0) {
        super(signal, listener, once, priority);
    }

    public function execute(value1 : T1, value2 : T2, value3 : T3) : Void {
        if (!enabled) {
            return;
        }

        if (once) {
            remove();
        }

        if (param1 != null) {
            value1 = param1;
        }

        if (param2 != null) {
            value2 = param2;
        }

        if (param3 != null) {
            value3 = param3;
        }

        listener(value1, value2, value3);
    }
}

class Slot4<T1, T2, T3, T4> extends Slot<Signal4<T1, T2, T3, T4>, T1->T2->T3->T4->Void> {
    public var param1 : T1;
    public var param2 : T2;
    public var param3 : T3;
    public var param4 : T4;

    public function new(signal : Signal4<T1, T2, T3, T4>, listener : T1->T2->T3->T4->Void, ?once : Bool = false, ?priority : Int = 0) {
        super(signal, listener, once, priority);
    }

    public function execute(value1 : T1, value2 : T2, value3 : T3, value4 : T4) : Void {
        if (!enabled) {
            return;
        }

        if (once) {
            remove();
        }

        if (param1 != null) {
            value1 = param1;
        }

        if (param2 != null) {
            value2 = param2;
        }

        if (param3 != null) {
            value3 = param3;
        }

        if (param3 != null) {
            value4 = param4;
        }

        listener(value1, value2, value3, value4);
    }
}

class Signal3<T1, T2, T3> extends Signal<Slot3<T1, T2, T3>, T1->T2->T3->Void> {
    public function new(?type1 : Dynamic = null, ?type2 : Dynamic = null, ?type3 : Dynamic = null) {
        super([type1, type2, type3]);
    }

    public function dispatch(value1 : T1, value2 : T2, value3 : T3) : Void {
        var slotsToProcess = slots;

        while (slotsToProcess.nonEmpty) {
            slotsToProcess.head.execute(value1, value2, value3);
            slotsToProcess = slotsToProcess.tail;
        }
    }

    override function createSlot(listener : T1->T2->T3->Void, ?once : Bool = false, ?priority : Int = 0) : Slot3<T1, T2, T3> {
        return new Slot3<T1, T2, T3>(this, listener, once, priority);
    }
}

class Signal4<T1, T2, T3, T4> extends Signal<Slot4<T1, T2, T3, T4>, T1->T2->T3->T4->Void> {
    public function new(?type1 : Dynamic = null, ?type2 : Dynamic = null, ?type3 : Dynamic = null, ?type4 : Dynamic = null) {
        super([type1, type2, type3, type4]);
    }

    public function dispatch(value1 : T1, value2 : T2, value3 : T3, value4 : T4) : Void {
        var slotsToProcess = slots;

        while (slotsToProcess.nonEmpty) {
            slotsToProcess.head.execute(value1, value2, value3, value4);
            slotsToProcess = slotsToProcess.tail;
        }
    }

    override function createSlot(listener : T1->T2->T3->T4->Void, ?once : Bool = false, ?priority : Int = 0) : Slot4<T1, T2, T3, T4> {
        return new Slot4<T1, T2, T3, T4>(this, listener, once, priority);
    }
}
