package test.ds;

import org.zamedev.lib.ds.HashSet;
import utest.Assert;
import utest.Test;

class HashSetTest extends Test {
    public function testHasNoCompilationErrors() : Void {
        Assert.notEquals(null, new HashSet<Int>());
        Assert.notEquals(null, new HashSet<String>());
        Assert.notEquals(null, new HashSet<HashSetTest>());
    }
}
