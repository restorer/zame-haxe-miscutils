package test.ds;

import org.zamedev.lib.ds.LinkedIntMap;
import utest.Assert;
import utest.Test;

class LinkedIntMapTest extends Test {
    public function testHasNoCompilationErrors() : Void {
        Assert.notEquals(null, new LinkedIntMap<String>());
    }
}
