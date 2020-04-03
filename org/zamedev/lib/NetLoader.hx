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
    #if debug_netloader
        private static var requestUid : Int = 0;
    #end

    private var urlRequest : URLRequest;

    public function new(url : String = null) : Void {
        urlRequest = new URLRequest(url);
    }

    public function setUrl(url : String) : NetLoader {
        urlRequest.url = url;
        return this;
    }

    public function setMethod(method : String) : NetLoader {
        urlRequest.method = method;
        return this;
    }

    public function setData(data : Dynamic) : NetLoader {
        urlRequest.data = data;
        return this;
    }

    public function setContentType(contentType : String) : NetLoader {
        urlRequest.contentType = contentType;
        return this;
    }

    public function forGet(data : Dynamic = null) : NetLoader {
        urlRequest.method = URLRequestMethod.GET;
        urlRequest.data = data;
        return this;
    }

    public function forPost(data : Dynamic) : NetLoader {
        urlRequest.method = URLRequestMethod.POST;
        urlRequest.contentType = "application/x-www-form-urlencoded";
        urlRequest.data = data;
        return this;
    }

    public function forPostJson(data : Dynamic) : NetLoader {
        urlRequest.method = URLRequestMethod.POST;
        urlRequest.contentType = "application/x-www-form-urlencoded"; // "application/json" is not used because of CORS
        urlRequest.data = Json.stringify(data);
        return this;
    }

    public function loadText() : Task<String> {
        var tcs = new TaskCompletionSource<String>();
        var urlLoader = new URLLoader();
        var removeListeners : Void->Void = null;

        #if debug_netloader
            var uid = ++requestUid;
        #end

        var onLoaderComplete = function(_) : Void {
            #if debug_netloader
                trace('[NetLoader.loadText:response] #${uid} data=[[ ${urlLoader.data} ]]');
            #end

            removeListeners();
            tcs.setResult(Std.string(urlLoader.data));
        };

        var onLoaderError = function(e : Event) : Void {
            #if debug_netloader
                trace('[NetLoader.loadText:response] #${uid} error="${e.type}"');
            #end

            removeListeners();
            tcs.setError(e.type);
        }

        removeListeners = function() : Void {
            urlLoader.removeEventListener(Event.COMPLETE, onLoaderComplete);
            urlLoader.removeEventListener(IOErrorEvent.IO_ERROR, onLoaderError);
            urlLoader.removeEventListener(SecurityErrorEvent.SECURITY_ERROR, onLoaderError);
        }

        urlLoader.dataFormat = URLLoaderDataFormat.TEXT;
        urlLoader.addEventListener(Event.COMPLETE, onLoaderComplete);
        urlLoader.addEventListener(IOErrorEvent.IO_ERROR, onLoaderError);
        urlLoader.addEventListener(SecurityErrorEvent.SECURITY_ERROR, onLoaderError);

        #if debug_netloader
            trace('[NetLoader.loadText:request] #${uid} method="${urlRequest.method}" url="${urlRequest.url}" data=[[ ${urlRequest.data} ]]');
        #end

        try {
            urlLoader.load(urlRequest);
        } catch (e : Dynamic) {
            #if debug_netloader
                trace('[NetLoader.loadText:request] #${uid} error="${e}"');
            #end

            removeListeners();
            tcs.setError(Std.string(e));
        }

        return tcs.task;
    }

    public function loadBinary() : Task<ByteArray> {
        var tcs = new TaskCompletionSource<ByteArray>();
        var urlLoader = new URLLoader();
        var removeListeners : Void->Void = null;

        #if debug_netloader
            var uid = ++requestUid;
        #end

        var onLoaderComplete = function(_) : Void {
            var result : ByteArray = cast urlLoader.data;

            #if debug_netloader
                trace('[NetLoader.loadBinary:response] #${uid} ' + (result == null ? "data=null" : 'data.length=${result.length}'));
            #end

            removeListeners();
            tcs.setResult(result);
        }

        var onLoaderError = function(e : Event) : Void {
            #if debug_netloader
                trace('[NetLoader.loadBinary:response] #${uid} error="${e.type}"');
            #end

            removeListeners();
            tcs.setError(e.type);
        }

        removeListeners = function() : Void {
            urlLoader.removeEventListener(Event.COMPLETE, onLoaderComplete);
            urlLoader.removeEventListener(IOErrorEvent.IO_ERROR, onLoaderError);
            urlLoader.removeEventListener(SecurityErrorEvent.SECURITY_ERROR, onLoaderError);
        }

        urlLoader.dataFormat = URLLoaderDataFormat.BINARY;
        urlLoader.addEventListener(Event.COMPLETE, onLoaderComplete);
        urlLoader.addEventListener(IOErrorEvent.IO_ERROR, onLoaderError);
        urlLoader.addEventListener(SecurityErrorEvent.SECURITY_ERROR, onLoaderError);

        #if debug_netloader
            trace('[NetLoader.loadBinary:request] #${uid} method="${urlRequest.method}" url="${urlRequest.url}" data=[[ ${urlRequest.data} ]]');
        #end

        try {
            urlLoader.load(urlRequest);
        } catch (e : Dynamic) {
            #if debug_netloader
                trace('[NetLoader.loadBinary:request] #${uid} error="${e}"');
            #end

            removeListeners();
            tcs.setError(Std.string(e));
        }

        return tcs.task;
    }

    public function loadImage() : Task<BitmapData> {
        var tcs = new TaskCompletionSource<BitmapData>();
        var loader = new Loader();
        var removeListeners : Void->Void = null;

        #if debug_netloader
            var uid = ++requestUid;
        #end

        var onLoaderComplete = function(_) : Void {
            var bitmap : Bitmap = cast loader.content;
            var result = (bitmap == null ? null : bitmap.bitmapData);

            #if debug_netloader
                trace('[NetLoader.loadImage:response] #${uid} ' + (result == null
                    ? "data=null"
                    : 'data.width=${result.width} data.height=${result.height}'
                ));
            #end

            removeListeners();
            tcs.setResult(result);
            loader.unload();
        }

        var onLoaderError = function(e : Event) : Void {
            #if debug_netloader
                trace('[NetLoader.loadImage:response] #${uid} error="${e.type}"');
            #end

            removeListeners();
            tcs.setError(e.type);
        }

        removeListeners = function() : Void {
            loader.contentLoaderInfo.removeEventListener(Event.COMPLETE, onLoaderComplete);
            loader.contentLoaderInfo.removeEventListener(IOErrorEvent.IO_ERROR, onLoaderError);
            loader.contentLoaderInfo.removeEventListener(SecurityErrorEvent.SECURITY_ERROR, onLoaderError);
        }

        loader.contentLoaderInfo.addEventListener(Event.COMPLETE, onLoaderComplete);
        loader.contentLoaderInfo.addEventListener(IOErrorEvent.IO_ERROR, onLoaderError);
        loader.contentLoaderInfo.addEventListener(SecurityErrorEvent.SECURITY_ERROR, onLoaderError);

        #if debug_netloader
            trace('[NetLoader.loadImage:request] #${uid} method="${urlRequest.method}" url="${urlRequest.url}" data=[[ ${urlRequest.data} ]]');
        #end

        try {
            loader.load(urlRequest, new LoaderContext(true));
        } catch (e : Dynamic) {
            #if debug_netloader
                trace('[NetLoader.loadImage:request] #${uid} error="${e}"');
            #end

            removeListeners();
            tcs.setError(Std.string(e));
        }

        return tcs.task;
    }

    public function loadJson() : Task<DynamicExt> {
        return loadText().onSuccess(function(task : Task<String>) : DynamicExt {
            return cast Json.parse(task.result);
        });
    }
}
