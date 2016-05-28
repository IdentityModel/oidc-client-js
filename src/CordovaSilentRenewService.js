// Copyright (c) Brock Allen & Dominick Baier. All rights reserved.
// Licensed under the Apache License, Version 2.0. See LICENSE in the project root for license information.

import Log from './Log';

export default class CordovaSilentRenewService {

    constructor(userManager) {
        this._userManager = userManager;
        this._userManager.events.addAccessTokenExpiring(this._tokenExpiring.bind(this));
    }
    
    _tokenExpiring() {
        Log.info("CordovaSilentRenewService automatically renewing access token");
        
        this._userManager.signinCordovaSilent().then(user => {
            Log.info("Cordova silent token renewal successful");
        }, err => {
            Log.error("Error from signinCordovaSilent:", err.message);
            this._userManager.events._raiseSilentRenewError(err);
        });
    }
}
