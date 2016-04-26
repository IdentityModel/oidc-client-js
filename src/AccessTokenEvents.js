// Copyright (c) Brock Allen & Dominick Baier. All rights reserved.
// Licensed under the Apache License, Version 2.0. See LICENSE in the project root for license information.

import Log from './Log';
import Timer from './Timer';

const DefaultAccessTokenExpiringNotificationTime = 60;

export default class AccessTokenEvents {

    constructor({
        accessTokenExpiringNotificationTime = DefaultAccessTokenExpiringNotificationTime,
        accessTokenExpiringTimer = new Timer(),
        accessTokenExpiredTimer = new Timer()
    } = {}) {
        this._accessTokenExpiringNotificationTime = accessTokenExpiringNotificationTime;

        this._accessTokenExpiring = accessTokenExpiringTimer;
        this._accessTokenExpired = accessTokenExpiredTimer;
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
                let expiring = duration - this._accessTokenExpiringNotificationTime;
                if (expiring <= 0){
                    expiring = 1;
                }
                Log.info("registering expiring timer in:", expiring);
                this._accessTokenExpiring.init(expiring);
            }

            // always register expired. if it's negative, it will still fire
            let expired = duration + 1;
            Log.info("registering expired timer in:", expired);
            this._accessTokenExpired.init(expired);
        }
    }

    cancel() {
        Log.info("AccessTokenEvents.canceling timers");
        this._accessTokenExpiring.cancel();
        this._accessTokenExpired.cancel();
    }

    addAccessTokenExpiring(cb) {
        this._accessTokenExpiring.addHandler(cb);
    }
    removeAccessTokenExpiring(cb) {
        this._accessTokenExpiring.removeHandler(cb);
    }

    addAccessTokenExpired(cb) {
        this._accessTokenExpired.addHandler(cb);
    }
    removeAccessTokenExpired(cb) {
        this._accessTokenExpired.removeHandler(cb);
    }
}
