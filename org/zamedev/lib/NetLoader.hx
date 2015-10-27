package org.zamedev.lib;

import haxe.Json;
import hxbolts.Task;
import hxbolts.TaskCompletionSource;
import openfl.display.Bitmap;
import openfl.display.BitmapData;
import openfl.display.Loader;
import openfl.events.Event;
import openfl.events.IOErrorEvent;
import openfl.events.SecurityErrorEvent;
import openfl.net.URLLoader;
import openfl.net.URLLoaderDataFormat;
import openfl.net.URLRequest;
import openfl.net.URLRequestMethod;
import openfl.system.LoaderContext;
import openfl.utils.ByteArray;

class NetLoader {
    private var urlRequest:URLRequest;

    public function new(url:String = null):Void {
        urlRequest = new URLRequest(url);
    }

    public function setUrl(url:String):NetLoader {
        urlRequest.url = url;
        return this;
    }

    public function setMethod(method:String):NetLoader {
        urlRequest.method = method;
        return this;
    }

    public function setData(data:Dynamic):NetLoader {
        urlRequest.data = data;
        return this;
    }

    public function setContentType(contentType:String):NetLoader {
        urlRequest.contentType = contentType;
        return this;
    }

    public function forGet(data:Dynamic = null):NetLoader {
        urlRequest.method = URLRequestMethod.GET;
        urlRequest.data = data;
        return this;
    }

    public function forPost(data:Dynamic):NetLoader {
        urlRequest.method = URLRequestMethod.POST;
        urlRequest.contentType = "application/x-www-form-urlencoded";
        urlRequest.data = data;
        return this;
    }

    public function forPostJson(data:Dynamic):NetLoader {
        urlRequest.method = URLRequestMethod.POST;
        urlRequest.contentType = "application/x-www-form-urlencoded"; // "application/json" is not used because of CORS
        urlRequest.data = Json.stringify(data);
        return this;
    }

    public function loadText():Task<String> {
        var tcs = new TaskCompletionSource<String>();
        var urlLoader = new URLLoader();
        var removeListeners:Void->Void = null;

        var onLoaderComplete = function(_):Void {
            removeListeners();
            tcs.setResult(Std.string(urlLoader.data));
        };

        var onLoaderError = function(e:Event):Void {
            removeListeners();
            tcs.setError(e.type);
        }

        removeListeners = function():Void {
            urlLoader.removeEventListener(Event.COMPLETE, onLoaderComplete);
            urlLoader.removeEventListener(IOErrorEvent.IO_ERROR, onLoaderError);
            urlLoader.removeEventListener(SecurityErrorEvent.SECURITY_ERROR, onLoaderError);
        }

        urlLoader.dataFormat = URLLoaderDataFormat.TEXT;
        urlLoader.addEventListener(Event.COMPLETE, onLoaderComplete);
        urlLoader.addEventListener(IOErrorEvent.IO_ERROR, onLoaderError);
        urlLoader.addEventListener(SecurityErrorEvent.SECURITY_ERROR, onLoaderError);

        try {
            urlLoader.load(urlRequest);
        } catch (e:Dynamic) {
            removeListeners();
            tcs.setError(Std.string(e));
        }

        return tcs.task;
    }

    public function loadBinary():Task<ByteArray> {
        var tcs = new TaskCompletionSource<ByteArray>();
        var urlLoader = new URLLoader();
        var removeListeners:Void->Void = null;

        var onLoaderComplete = function(_):Void {
            removeListeners();
            tcs.setResult(cast urlLoader.data);
        }

        var onLoaderError = function(e:Event):Void {
            removeListeners();
            tcs.setError(e.type);
        }

        removeListeners = function():Void {
            urlLoader.removeEventListener(Event.COMPLETE, onLoaderComplete);
            urlLoader.removeEventListener(IOErrorEvent.IO_ERROR, onLoaderError);
            urlLoader.removeEventListener(SecurityErrorEvent.SECURITY_ERROR, onLoaderError);
        }

        urlLoader.dataFormat = URLLoaderDataFormat.BINARY;
        urlLoader.addEventListener(Event.COMPLETE, onLoaderComplete);
        urlLoader.addEventListener(IOErrorEvent.IO_ERROR, onLoaderError);
        urlLoader.addEventListener(SecurityErrorEvent.SECURITY_ERROR, onLoaderError);

        try {
            urlLoader.load(urlRequest);
        } catch (e:Dynamic) {
            removeListeners();
            tcs.setError(Std.string(e));
        }

        return tcs.task;
    }

    public function loadImage():Task<BitmapData> {
        var tcs = new TaskCompletionSource<BitmapData>();
        var loader = new Loader();
        var removeListeners:Void->Void = null;

        var onLoaderComplete = function(_):Void {
            removeListeners();
            tcs.setResult((cast loader.content:Bitmap).bitmapData);
            loader.unload();
        }

        var onLoaderError = function(e:Event):Void {
            removeListeners();
            tcs.setError(e.type);
        }

        removeListeners = function():Void {
            loader.contentLoaderInfo.removeEventListener(Event.COMPLETE, onLoaderComplete);
            loader.contentLoaderInfo.removeEventListener(IOErrorEvent.IO_ERROR, onLoaderError);
            loader.contentLoaderInfo.removeEventListener(SecurityErrorEvent.SECURITY_ERROR, onLoaderError);
        }

        loader.contentLoaderInfo.addEventListener(Event.COMPLETE, onLoaderComplete);
        loader.contentLoaderInfo.addEventListener(IOErrorEvent.IO_ERROR, onLoaderError);
        loader.contentLoaderInfo.addEventListener(SecurityErrorEvent.SECURITY_ERROR, onLoaderError);

        try {
            loader.load(urlRequest, new LoaderContext(true));
        } catch (e:Dynamic) {
            removeListeners();
            tcs.setError(Std.string(e));
        }

        return tcs.task;
    }

    public function loadJson():Task<DynamicExt> {
        return loadText().onSuccess(function(task:Task<String>):DynamicExt {
            return cast Json.parse(task.result);
        });
    }
}
