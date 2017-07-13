// Copyright (c) Brock Allen & Dominick Baier. All rights reserved.
// Licensed under the Apache License, Version 2.0. See LICENSE in the project root for license information.

import Log from './Log';

const DefaultInterval = 2000;

export default class CheckSessionIFrame {
    constructor(callback, client_id, url, interval, scriptOrigin ) {
        this._callback = callback;
        this._client_id = client_id;
        this._url = url;
        this._interval = interval || DefaultInterval;

        let next = window;
        let depth = 0;
        while( next.parent !== next ) {
            next = next.parent;
            depth += 1;
        }
        this._iframe_depth = depth;

        var idx = url.indexOf("/", url.indexOf("//") + 2);
        this._frame_origin = url.substr(0, idx);

        // let fn=this._iframe_depth+">"+this.constructor.name+"#constructor";
        // console.log( fn+": frame_origin = ", this._frame_origin );

        this._frame = window.document.createElement("iframe");
        this._frame.style.display = "none";
        this._frame.src = url;

    }
    load() {
        return new Promise((resolve) => {
            this._frame.onload = () => {
                resolve();
            }

            window.document.body.appendChild(this._frame);
            this._boundMessageEvent = this._message.bind(this);
            window.addEventListener("message", this._boundMessageEvent, false);
        });
    }
    _message(e) {
        if (e.origin === this._frame_origin &&
            e.source === this._frame.contentWindow
        ) {
            if (e.data === "error") {
                Log.error("error message from check session op iframe");
                this.stop();
            }
            else if (e.data === "changed") {
                Log.debug("changed message from check session op iframe");
                this.stop();
                this._callback();
            }
            else {
                Log.debug(e.data + " message from check session op iframe");
            }
        }
    }
    start(session_state) {
        if (this._session_state !== session_state) {
            Log.debug("CheckSessionIFrame.start");

            this.stop();

            this._session_state = session_state;

            this._timer = window.setInterval(() => {
                let fn = this._iframe_depth+">"+this.constructor.name+"#start/timer";
                console.log( fn+": postMessage with message = ", this._client_id + " " + this._session_state );
                console.log( fn+": postMessage with origin = ", this._frame_origin );
                this._frame.contentWindow.postMessage(this._client_id + " " + this._session_state, this._frame_origin);
            }, this._interval);
        }
    }

    stop() {
        Log.debug("CheckSessionIFrame.stop");

        this._session_state = null;

        if (this._timer) {
            window.clearInterval(this._timer);
            this._timer = null;
        }
    }
}
