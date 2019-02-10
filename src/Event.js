// Copyright (c) Brock Allen & Dominick Baier. All rights reserved.
// Licensed under the Apache License, Version 2.0. See LICENSE in the project root for license information.

import { Log } from './Log.js';

export class Event {

    constructor(name) {
        this._name = name;
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

    raise(...params) {
        Log.debug("Event: Raising event: " + this._name);
        for (let i = 0; i < this._callbacks.length; i++) {
            this._callbacks[i](...params);
        }
    }
}
