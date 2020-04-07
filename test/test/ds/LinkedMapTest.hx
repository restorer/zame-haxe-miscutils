package test.ds;

import org.zamedev.lib.ds.LinkedMap;
import utest.Assert;
import utest.Test;

class LinkedMapTest extends Test {
    public function testHasNoCompilationErrors() : Void {
        Assert.notEquals(null, new LinkedMap<Int, String>());
        Assert.notEquals(null, new LinkedMap<String, String>());
    }
}
