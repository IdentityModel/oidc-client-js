// Copyright (c) Brock Allen & Dominick Baier. All rights reserved.
// Licensed under the Apache License, Version 2.0. See LICENSE in the project root for license information.

import Log from './Log';

const DefaultTimeout = 5000;

export default class IFrameWindow {

    constructor(params) {
        Log.debug("IFrameWindow.ctor");

        // let next = window;
        // let depth = 0;
        // while( next.parent !== next ) {
        //     next = next.parent;
        //     depth += 1;
        // }
        // this._iframe_depth = depth;
        // let fn=this._iframe_depth+">"+this.constructor.name+"#constructor";
        // console.log( fn+": params = ", params );
        this._scriptOrigin = params.scriptOrigin;
        // console.log( fn+": scriptOrigin = ", this._scriptOrigin );

        this._promise = new Promise((resolve, reject) => {
            this._resolve = resolve;
            this._reject = reject;
        });

        this._boundMessageEvent = this._message.bind(this);
        window.addEventListener("message", this._boundMessageEvent, false);
        
        this._frame = window.document.createElement("iframe");
        this._frame.style.display = "none";
        window.document.body.appendChild(this._frame);

    }

    navigate(params) {
        Log.debug("IFrameWindow.navigate");

        if (!params || !params.url) {
            this._error("No url provided");
        }
        else {
            let timeout = params.silentRequestTimeout || DefaultTimeout;
            Log.debug("Using timeout of:", timeout);
            this._timer = window.setTimeout(this._timeout.bind(this), timeout);
            this._frame.src = params.url;
        }
        
        return this.promise;
    }

    get promise() {
        return this._promise;
    }

    _success(data) {
        this._cleanup();

        Log.debug("Successful response from frame window");
        this._resolve(data);
    }
    _error(message) {
        this._cleanup();

        Log.error(message);
        this._reject(new Error(message));
    }

    _cleanup() {
        Log.debug("IFrameWindow._cleanup");

        window.removeEventListener("message", this._boundMessageEvent, false);
        window.clearTimeout(this._timer);
        window.document.body.removeChild(this._frame);

        this._timer = null;
        this._frame = null;
        this._boundMessageEvent = null;
    }

    _timeout() {
        Log.debug("IFrameWindow._timeout");
        this._error("Frame window timed out");
    }

    _message(e) {
        let next = window;
        let depth = 0;
        while( next.parent !== next ) {
            next = next.parent;
            depth += 1;
        }
        let fn=depth+">"+this.constructor.name+"#_message";
        // console.log( fn+": message = ", e );
        // console.log( fn+": message origin = ", e.origin );
        // console.warn( fn+": message origin match = ", e.origin === this._scriptOrigin );
        // console.log( fn+": message source = ", e.source );
        // console.warn( fn+": message source match = ", e.source === this._frame.contentWindow );
        Log.debug("IFrameWindow._message");

        if (this._timer &&
            e.origin === this._scriptOrigin &&
            e.source === this._frame.contentWindow
        ) {
            // console.log( fn+": message meets processing criteria" );
            console.log( fn+": message.data = ", e.data );
            let url = e.data;
            if (url) {
                this._success({ url: url });
            }
            else {
                console.log( fn+": message invalid" );
                this._error("Invalid response from frame");
            }
        }
    }

    // get _origin() {
    //     // return location.protocol + "//" + location.host;
    //     let url = document.currentScript.src;
    //     var idx = url.indexOf("/", url.indexOf("//") + 2);
    //     return url.substr(0, idx);
    // }

    static notifyParent(url, pageOrigin) {
        let next = window;
        let depth = 0;
        while( next.parent !== next ) {
            next = next.parent;
            depth += 1;
        }
        let fn=depth+">IFrameWindow.notifyParent";
        // console.log( fn+": pageOrigin = ", pageOrigin );
        Log.debug("IFrameWindow.notifyParent");

        if (window.parent && window !== window.parent) {
            url = url || window.location.href;
            if (url) {
                Log.debug("posting url message to parent");
                console.log( fn+": postMessage with message = ", url );
                console.log( fn+": postMessage with origin = ", pageOrigin );
                window.parent.postMessage( url, pageOrigin );
            }
        }
    }
}
