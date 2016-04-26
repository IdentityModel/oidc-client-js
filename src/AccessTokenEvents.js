// Copyright (c) Brock Allen & Dominick Baier. All rights reserved.
// Licensed under the Apache License, Version 2.0. See LICENSE in the project root for license information.

import Log from './Log';
import Timer from './Timer';

const DefaultExpiringNotificationTime = 60;

export default class AccessTokenEvents {

    constructor({
        expiringNotificationTime = DefaultExpiringNotificationTime, 
        expiringTimer = new Timer(),
        expiredTimer = new Timer()
    } = {}) {
        this._expiringNotificationTime = expiringNotificationTime;
        
        this._expiring = expiringTimer;
        this._expired = expiredTimer;
    }

    init(container) {
        this.cancel();
        
        if (container && container.access_token) {
            var duration = container.expires_in;
            
            this._expiring.init(duration - this._expiringNotificationTime);
            this._expired.init(duration + 1);
        }
    }

    cancel() {
        this._expiring.cancel();
        this._expired.cancel();
    }

    addExpiring(cb) {
        this._expiring.addHandler(cb);
    }
    removeExpiring(cb) {
        this._expiring.removeHandler(cb);
    }

    addExpired(cb) {
        this._expired.addHandler(cb);
    }
    removeExpired(cb) {
        this._expired.removeHandler(cb);
    }
}
