// Copyright (c) Brock Allen & Dominick Baier. All rights reserved.
// Licensed under the Apache License, Version 2.0. See LICENSE in the project root for license information.

import { Log } from './Log.js';
import { Global } from './Global.js';
import { Event } from './Event.js';

const DefaultTimerDurationInSeconds = 5;

export class Timer extends Event {

    constructor(name, timer = Global.timer, nowFunc = undefined) {
        super(name);
        this._timer = timer;

        if (nowFunc) {
            this._nowFunc = nowFunc;
        }
        else {
            this._nowFunc = () => Date.now() / 1000;
        }
    }

    get now() {
        return parseInt(this._nowFunc());
    }

    init(durationInSeconds) {
        if (durationInSeconds <= 0) {
            durationInSeconds = 1;
        }
        durationInSeconds = parseInt(durationInSeconds);

        var expiration = this.now + durationInSeconds;
        if (this.expiration === expiration && this._timerHandle) {
            // no need to reinitialize to same expiration, so bail out
            Log.debug("Timer.init timer " + this._name + " skipping initialization since already initialized for expiration:", this.expiration);
            return;
        }

        this.cancel();

        Log.debug("Timer.init timer " + this._name + " for duration:", durationInSeconds);
        this._expiration = expiration;

        // we're using a fairly short timer and then checking the expiration in the
        // callback to handle scenarios where the browser device sleeps, and then
        // the timers end up getting delayed.
        var timerDurationInSeconds = DefaultTimerDurationInSeconds;
        if (durationInSeconds < timerDurationInSeconds) {
            timerDurationInSeconds = durationInSeconds;
        }
        this._timerHandle = this._timer.setInterval(this._callback.bind(this), timerDurationInSeconds * 1000);
    }
    
    get expiration() {
        return this._expiration;
    }

    cancel() {
        if (this._timerHandle) {
            Log.debug("Timer.cancel: ", this._name);
            this._timer.clearInterval(this._timerHandle);
            this._timerHandle = null;
        }
    }

    _callback() {
        var diff = this._expiration - this.now;
        Log.debug("Timer.callback; " + this._name + " timer expires in:", diff);

        if (this._expiration <= this.now) {
            this.cancel();
            super.raise();
        }
    }
}
