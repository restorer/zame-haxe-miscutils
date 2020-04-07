package test.ds;

import org.zamedev.lib.ds.KeyValueIteratorExt;
import utest.Assert;
import utest.Test;

class KeyValueIteratorExtTest extends Test {
    public function testHasNoCompilationErrors() : Void {
        Assert.notEquals(null, new KeyValueIteratorExt<String, String>(new Map<String, String>()));
    }
}
