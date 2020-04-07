package test;

import utest.Assert;
import utest.Test;

using org.zamedev.lib.XmlExt;

class XmlExtTest extends Test {
    public function testInnerText() : Void {
        var root = Xml.parse("<root><node>inner value</node><node /></root>");
        Assert.same(["inner value", "default value"], [for (node in root.firstElement().elements()) node.innerText("default value")]);
    }
}
