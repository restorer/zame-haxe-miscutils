package test;

import org.zamedev.lib.JavaRandom;
import utest.Assert;
import utest.Test;

class JavaRandomTest extends Test {
    public function testHasNoCompilationErrors() : Void {
        Assert.notEquals(null, new JavaRandom());
    }
}
