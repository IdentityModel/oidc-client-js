// Copyright (c) Brock Allen & Dominick Baier. All rights reserved.
// Licensed under the Apache License, Version 2.0. See LICENSE in the project root for license information.

import Log from './Log';

export default class SilentRenewService {

    constructor(userManager) {
        this._userManager = userManager;
        this._userManager.events.addAccessTokenExpiring(this._tokenExpiring.bind(this));
    }
    
    _tokenExpiring() {
        Log.info("SilentRenewService automatically renewing access token");
        
        this._userManager.signinSilent().then(user => {
            Log.info("Silent token renewal successful");
        }, err => {
            Log.error("Error from signinSilent:", err.message);
            this._userManager.events._raiseSilentRenewError(err);
        });
    }
}
