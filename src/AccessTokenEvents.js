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
        Log.info("AccessTokenEvents.init");
        this.cancel();

        // only register events if there's an access token where we care about expiration
        if (container.access_token) {
            let duration = container.expires_in;
            Log.info("access token present, remaining duration:", duration);

            if (duration > 0) {
                // only register expiring if we still have time
                let expiring = duration - this._expiringNotificationTime;
                if (expiring <= 0){
                    expiring = 1;
                }
                Log.info("registering expiring timer in:", expiring);
                this._expiring.init(expiring);
            }

            // always register expired. if it's negative, it will still fire
            let expired = duration + 1;
            Log.info("registering expired timer in:", expired);
            this._expired.init(expired);
        }
    }

    cancel() {
        Log.info("AccessTokenEvents.canceling timers");
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
