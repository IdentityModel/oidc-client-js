// Copyright (c) Brock Allen & Dominick Baier. All rights reserved.
// Licensed under the Apache License, Version 2.0. See LICENSE in the project root for license information.

import Log from './Log';
import Global from './Global';
import Event from './Event';

const TimerDuration = 5; // 5 seconds

export default class Timer extends Event {

    constructor(name, timer = Global.timer) {
        super(name);
        this._timer = timer;
        this._nowFunc = () => Date.now() / 1000;
    }

    get now() {
        return parseInt(this._nowFunc());
    }

    init(duration) {
        this.cancel();

        if (duration <= 0) {
            duration = 1;
        }
        duration = parseInt(duration);

        Log.info("Timer.init timer " + this._name + " for duration:", duration);
        this._expiration = this.now + duration;

        // we're using a fairly short timer and then checking the expiration in the 
        // callback to handle scenarios where the browser device sleeps, and then 
        // the timers end up getting delayed.
        var timerDuration = TimerDuration;
        if (duration < timerDuration) {
            timerDuration = duration;
        }
        this._timerHandle = this._timer.setInterval(this._callback.bind(this), timerDuration * 1000);
    }

    cancel() {
        if (this._timerHandle) {
            Log.info("Timer.cancel: ", this._name);
            this._timer.clearInterval(this._timerHandle);
            this._timerHandle = null;
        }
    }

    _callback() {
        var diff = this._expiration - this.now;
        Log.info("Timer._callback; " + this._name + " timer expires in:", diff);

        if (this._expiration <= this.now) {
            this.cancel();
            super.raise();
        }
    }
}
