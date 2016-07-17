// Copyright (c) Brock Allen & Dominick Baier. All rights reserved.
// Licensed under the Apache License, Version 2.0. See LICENSE in the project root for license information.

import Log from './Log';
import CheckSessionHtml from './CheckSessionHtml';

const DefaultInterval = 2000;

export default class CheckSessionIFrame {
    constructor(callback) {
        this._callback = callback;

        this._boundMessageEvent = this._message.bind(this);
        window.addEventListener("message", this._boundMessageEvent, false);
        
        this._frame = window.document.createElement("iframe");
        this._frame.style.display = "none";
        window.document.body.appendChild(this._frame);
        this._frame.document.write(CheckSessionHtml);
    }

    _message(e) {
        Log.info("CheckSessionIFrame._message");

        if (e.origin === this._origin &&
            e.source === this._popup.window
        ) {
            Log.info("processing message", e.data);
            this._callback();
        }
    }

    get _origin() {
        return window.location.protocol + "//" + window.location.host;
    }

    init(client_id, check_session_iframe, session_state, interval) {
        let msg = {
            client_id: client_id,
            check_session_iframe : check_session_iframe,
            session_state : session_state,
            check_interval: interval || DefaultInterval
        };
        this._frame.postMessage(msg, this._origin);
    }
}
