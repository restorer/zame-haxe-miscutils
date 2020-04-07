#!/bin/bash

cd $(dirname "$0")

target_interp () {
    cat << EOF >> "$2"
-cmd echo ">>>> Interp"
--next
--interp
--next
EOF
}

target_neko () {
    cat << EOF >> "$2"
-cmd echo ">>>> Neko"
--next
-neko $1/neko/test.n
-cmd neko $1/neko/test.n
--next
EOF
}

target_js () {
    cat << EOF >> "$2"
-cmd echo ">>>> JS"
--next
-js $1/js/test.js
-cmd node $1/js/test.js
--next
EOF
}

target_cpp () {
    cat << EOF >> "$2"
-cmd echo ">>>> CPP"
--next
-D nostrip
-cpp $1/cpp
-cmd $1/cpp/TestSuite
--next
EOF
}

target_hl () {
    cat << EOF >> "$2"
-cmd echo ">>>> HL"
--next
-hl $1/hl/test.hl
-cmd hl $1/hl/test.hl
--next
EOF
}

target_hlc () {
    cat << EOF >> "$2"
-cmd echo ">>>> HL/C"
--next
-hl $1/hlc/test.c
-cmd gcc -O3 -o $1/hlc/test_hlc -std=c11 -I /usr/local/include/hl -I $1/hlc $1/hlc/test.c -lhl && $1/hlc/test_hlc
--next
EOF
}

target_php () {
    cat << EOF >> "$2"
-cmd echo ">>>> PHP"
--next
-D php7
-php $1/php
-cmd php $1/php/index.php
--next
EOF
}

target_java () {
    cat << EOF >> "$2"
-cmd echo ">>>> Java"
--next
-java $1/java
-cmd java -jar $1/java/TestSuite.jar
--next
EOF
}

target_python () {
    cat << EOF >> "$2"
-cmd echo ">>>> Python"
--next
-python $1/python3/test.py
-cmd python3 $1/python3/test.py
--next
EOF
}

target_cs () {
    cat << EOF >> "$2"
-cmd echo ">>>> CS"
--next
-cs $1/cs
-cmd mono $1/cs/bin/TestSuite.exe
--next
EOF
}

target_cppia () {
    cat << EOF >> "$2"
-cmd echo ">>>> CPPIA"
--next
-cppia $1/test.cppia
-cmd haxelib run hxcpp $1/test.cppia
--next
EOF
}

target_lua () {
    cat << EOF >> "$2"
-cmd echo ">>>> LUA"
--next
-lua $1/lua/test.lua
-cmd lua $1/lua/test.lua
--next
EOF
}

target_lua_vanilla () {
    cat << EOF >> "$2"
-cmd echo ">>>> LUA/vanilla"
--next
-D lua_vanilla
-lua $1/lua_vanilla/test.lua
-cmd lua $1/lua_vanilla/test.lua
--next
EOF
}

has_target () {
    TARGET="$1"
    shift

    [[ " $@ " =~ " $TARGET " ]] && return 0
    [[ " $@ " =~ " -${TARGET} " ]] && return 1

    while [[ $# -gt 0 ]] ; do
        [ "${1:0:1}" != "-" ] && return 1
        shift
    done

    return 0
}

cleanup () {
    [ -L haxe_libraries ] && rm haxe_libraries
    [ -L .haxerc ] && rm .haxerc
}

setup_lix () {
    cleanup

    ln -s "test/lix-$1/haxe_libraries" haxe_libraries
    ln -s "test/lix-$1/.haxerc" .haxerc
}

run_tests () {
    HAXE="$1"
    shift

    BUILD=".build/$HAXE"
    mkdir -p "$BUILD"

    HXML="$BUILD/test.hxml"

    cat << EOF > "$HXML"
-cp .
-cp ./test
-lib utest
-main TestSuite
--each
EOF

    has_target interp "$@" && target_interp "$BUILD" "$HXML"
    has_target neko "$@" && target_neko "$BUILD" "$HXML"
    has_target js "$@" && target_js "$BUILD" "$HXML"
    has_target cpp "$@" && target_cpp "$BUILD" "$HXML"
    has_target hl "$@" && target_hl "$BUILD" "$HXML"
    has_target hlc "$@" && target_hlc "$BUILD" "$HXML"
    has_target php "$@" && target_php "$BUILD" "$HXML"
    has_target java "$@" && target_java "$BUILD" "$HXML"
    has_target python "$@" && target_python "$BUILD" "$HXML"
    has_target cs "$@" && target_cs "$BUILD" "$HXML"
    has_target cppia "$@" && target_cppia "$BUILD" "$HXML"
    has_target lua "$@" && target_lua "$BUILD" "$HXML"
    has_target lua_vanilla "$@" && target_lua_vanilla "$BUILD" "$HXML"

    cat << EOF >> "$HXML"
-cmd echo ">>>> Done"
EOF

    echo "==== $HAXE ===="
    echo

    setup_lix "$HAXE"
    haxe "$HXML"
}

run_tests haxe3 "$@" && run_tests haxe4 "$@"
RESULT="$?"

cleanup
exit "$RESULT"
