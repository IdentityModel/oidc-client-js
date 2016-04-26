// Copyright (c) Brock Allen & Dominick Baier. All rights reserved.
// Licensed under the Apache License, Version 2.0. See LICENSE in the project root for license information.

import Log from './Log';
import Global from './Global';

export default class Timer {

    constructor(timer = Global.timer) {
        this._timer = timer;
        this._callbacks = [];
    }

    addHandler(cb) {
        this._callbacks.push(cb);
    }

    removeHandler(cb) {
        var idx = this._callbacks.findIndex(item => item === cb);
        if (idx >= 0) {
            this._callbacks.splice(idx, 1);
        }
    }

    init(duration) {
        this.cancel();

        if (duration <= 0) {
            duration = 1;
        }

        this._timerHandle = this._timer.setTimeout(this._callback.bind(this), duration * 1000);
    }

    cancel() {
        if (this._timerHandle) {
            this._timer.clearTimeout(this._timerHandle);
            this._timerHandle = null;
        }
    }

    _callback() {
        this._timerHandle = null;
        for (var cb of this._callbacks) {
            cb();
        }
    }
}
