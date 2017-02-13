# Misc utils for Haxe

  - DynamicExt - pure haxe
  - DynamicTools - pure haxe
  - LambdaExt - pure haxe
  - XmlExt - pure haxe
  - UrlLoaderExt - for openfl

[About](http://blog.zame-dev.org/5-more-things-i-dont-like-in-haxe-and-how-to-fix-them/)

## Installation

```
haxelib git zame-miscutils https://github.com/restorer/zame-haxe-miscutils.git
```

### DynamicExt

Allow use Dynamic values like Map.

```haxe
var node = new DynamicExt();

node["foo"] = "bar";
trace(node["foo"]);

trace(node.exists("foo"));
trace(node.exists("bar"));

node["bar"] = "baz";
trace(node.keys());

node.remove("foo");
trace(node.keys());
```

### DynamicTools

Along with DynamicExt allows to parse json in a safe manner.

```haxe
import org.zamedev.lib.DynamicExt;
using org.zamedev.lib.DynamicTools;

var node:DynamicExt = haxe.Json.parse('{"a":{"b":"c"},"stringval":"haxe","arrayval":["haxe","cool"],"intval":42,"floatval":24.42,"boolval":true}');
trace(node.byPath(["a", "b"])); // Returns "c"
trace(node["stringval"].asString());
trace(node["arrayval"].asArray());
trace(node["intval"].asInt());
trace(node["floatval"].asFloat());
trace(node["boolval"].asBool());
trace(node["nonexisting"].asString("defaultvalue"));
trace(node["nonexisting"].asNullInt());
trace(node["nonexisting"].asNullFloat());
trace(node["nonexisting"].asDynamic());
```

### LambdaExt

Can be used as drop-in replacement of `Lambda` when you need to work with an `Iterator` (you should still use original `Lambda` for an `Iterable`).

```haxe
var map = new Map<String, String>();
map["foo"] = "bar";
map["bar"] = "baz";

var arrayval:Array<String> = map.keys().array();
trace(arrayval);

var listval:List<String> = map.keys().map(function(v) { return v.toUpperCase(); });
trace(listval);
```

### XmlExt

Allows to get inner text from xml node in an easy way.

```haxe
var root = Xml.parse("<root><node>inner value</node><node /></root>");

for (node in root.firstElement().elements()) {
    trace(node.innerText("defaultvalue"));
}
```

### UrlLoaderExt (for openfl)

Simplify work with json-based server API.

```haxe
var loader = new UrlLoaderExt(function(loader:UrlLoaderExt) {
    trace("success");
    trace(loader.data);
}, function(_) {
    trace("error happened");
});

loader.load(UrlLoaderExt.createJsonRequest("http://domain.tld", { foo:"bar" }));
```

## Product support

This library is finished. Later I have plant to merge several smaller libraries into bigger one.

| Feature | Support status |
|---|---|
| New features | No |
| Non-critical bugfixes | No |
| Critical bugfixes | Yes |
| Pull requests | Accepted (after review) |
| Issues | Monitored, but if you want to change something - submit a pull request |
| OpenFL version planned to support | Up to 4.x, and probably later |
| Estimated end-of-life | Up to 2017 (new library will be created later) |
