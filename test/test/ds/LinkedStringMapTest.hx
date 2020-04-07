package test.ds;

import org.zamedev.lib.ds.LinkedStringMap;
import utest.Assert;
import utest.Test;

class LinkedStringMapTest extends Test {
    public function testHasNoCompilationErrors() : Void {
        Assert.notEquals(null, new LinkedStringMap<String>());
    }
}
