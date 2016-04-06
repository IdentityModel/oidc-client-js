// Copyright (c) Brock Allen & Dominick Baier. All rights reserved.
// Licensed under the Apache License, Version 2.0. See LICENSE in the project root for license information.

import Log from './Log';

export default class IFrameLoader {

    constructor(resolve, reject, timeout, url) {
        Log.info("IFrameLoader.ctor");

        this._resolve = resolve;
        this._reject = reject;

        this._frame = window.document.createElement("iframe");
        this._frame.style.display = "none";

        this._boundMessageEvent = this._message.bind(this);
        window.addEventListener("message", this._boundMessageEvent, false);

        this._timer = window.setTimeout(this._timeout.bind(this), timeout);

        window.document.body.appendChild(this._frame);
        this._frame.src = url;
    }

    _cleanup() {
        Log.info("IFrameLoader._cleanup");

        window.removeEventListener("message", this._boundMessageEvent, false);
        window.clearTimeout(this._timer);
        window.document.body.removeChild(this._frame);

        this._timer = null;
        this._frame = null;
        this._boundMessageEventssage = null;
    }

    _timeout() {
        Log.info("IFrameLoader._timeout");

        this._cleanup();

        Log.error("Frame loader timed out");
        this._reject(new Error("Frame loader timed out"));
    }

    _message(e) {
        Log.info("IFrameLoader._message");

        if (this._timer &&
            e.origin === this._origin &&
            e.source === this._frame.contentWindow
        ) {
            let url = e.data.url;

            this._cleanup();

            if (url) {
                Log.info("Successful response from frame");
                this._resolve({ url: url });
            }
            else {
                Log.error("Invalid response from frame", e.data);
                this._reject(new Error("Invalid response from frame"));
            }
        }
    }

    get _origin() {
        return location.protocol + "//" + location.host;
    }

    static notifyParent(url) {
        if (window.parent && window !== window.parent) {
            url = url || window.location.href;
            if (url) {
                window.parent.postMessage({url:url}, location.protocol + "//" + location.host);
            }
        }
    }
}
