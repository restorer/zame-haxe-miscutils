#!/bin/bash

haxe -lib zame-miscutils -x DynamicExtSample.hx
[ -e DynamicExtSample.hx.n ] && rm DynamicExtSample.hx.n

echo

haxe -lib zame-miscutils -D haxeJSON -x DynamicToolsSample.hx
[ -e DynamicToolsSample.hx.n ] && rm DynamicToolsSample.hx.n

echo

haxe -lib zame-miscutils -x LambdaExtSample.hx
[ -e LambdaExtSample.hx.n ] && rm LambdaExtSample.hx.n

echo

haxe -lib zame-miscutils -x XmlExtSample.hx
[ -e XmlExtSample.hx.n ] && rm XmlExtSample.hx.n
