// Copyright (c) Brock Allen & Dominick Baier. All rights reserved.
// Licensed under the Apache License, Version 2.0. See LICENSE in the project root for license information.

export default class Event {

    constructor() {
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

    raise() {
        for (var cb of this._callbacks) {
            cb();
        }
    }
}
