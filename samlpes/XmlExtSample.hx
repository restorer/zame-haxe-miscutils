package ;

using org.zamedev.lib.XmlExt;

class XmlExtSample {
    public static function main() {
        var root = Xml.parse("<root><node>inner value</node><node /></root>");

        for (node in root.firstElement().elements()) {
            trace(node.innerText("defaultvalue"));
        }
    }
}
