package test.ds;

import org.zamedev.lib.ds.LinkedSet;
import utest.Assert;
import utest.Test;

class LinkedSetTest extends Test {
    public function testHasNoCompilationErrors() : Void {
        Assert.notEquals(null, new LinkedSet<Int>());
        Assert.notEquals(null, new LinkedSet<String>());
    }
}
