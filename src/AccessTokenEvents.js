// Copyright (c) Brock Allen & Dominick Baier. All rights reserved.
// Licensed under the Apache License, Version 2.0. See LICENSE in the project root for license information.

import { Log } from './Log.js';
import { Timer } from './Timer.js';

const DefaultAccessTokenExpiringNotificationTime = 60; // seconds

export class AccessTokenEvents {

    constructor({
        accessTokenExpiringNotificationTime = DefaultAccessTokenExpiringNotificationTime,
        accessTokenExpiringTimer = new Timer("Access token expiring"),
        accessTokenExpiredTimer = new Timer("Access token expired")
    } = {}) {
        this._accessTokenExpiringNotificationTime = accessTokenExpiringNotificationTime;

        this._accessTokenExpiring = accessTokenExpiringTimer;
        this._accessTokenExpired = accessTokenExpiredTimer;
    }

    load(container) {
        // only register events if there's an access token and it has an expiration
        if (container.access_token && container.expires_in !== undefined) {
            let duration = container.expires_in;
            Log.debug("AccessTokenEvents.load: access token present, remaining duration:", duration);

            if (duration > 0) {
                // only register expiring if we still have time
                let expiring = duration - this._accessTokenExpiringNotificationTime;
                if (expiring <= 0){
                    expiring = 1;
                }
                
                Log.debug("AccessTokenEvents.load: registering expiring timer in:", expiring);
                this._accessTokenExpiring.init(expiring);
            }
            else {
                Log.debug("AccessTokenEvents.load: canceling existing expiring timer becase we're past expiration.");
                this._accessTokenExpiring.cancel();
            }

            // if it's negative, it will still fire
            let expired = duration + 1;
            Log.debug("AccessTokenEvents.load: registering expired timer in:", expired);
            this._accessTokenExpired.init(expired);
        }
        else {
            this._accessTokenExpiring.cancel();
            this._accessTokenExpired.cancel();
        }
    }

    unload() {
        Log.debug("AccessTokenEvents.unload: canceling existing access token timers");
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
