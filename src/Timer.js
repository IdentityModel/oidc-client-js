// Copyright (c) Brock Allen & Dominick Baier. All rights reserved.
// Licensed under the Apache License, Version 2.0. See LICENSE in the project root for license information.

import Log from './Log';
import Global from './Global';
import Event from './Event';

export default class Timer extends Event {

    constructor(name, timer = Global.timer) {
        super(name);
        this._timer = timer;
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
        super.raise();
    }
}
