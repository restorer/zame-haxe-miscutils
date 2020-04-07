package ;

import utest.UTest;

class TestSuite {
    public static function main() {
        UTest.run([
            new test.DynamicExtTest(),
            new test.DynamicToolsTest(),
            new test.JavaRandomTest(),
            new test.LambdaExtTest(),
            new test.XmlExtTest(),
            new test.ds.HashSetTest(),
            new test.ds.KeyValueIteratorExtTest(),
            new test.ds.LinkedIntMapTest(),
            new test.ds.LinkedMapTest(),
            new test.ds.LinkedSetTest(),
            new test.ds.LinkedStringMapTest(),
        ]);
    }
}
