package org.zamedev.lib.ds;

interface ISet<T> {
    function add(key : T) : Void;
    function exists(key : T) : Bool;
    function remove(key : T) : Bool;
    function keys() : Iterator<T>;
}
