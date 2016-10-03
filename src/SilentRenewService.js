// Copyright (c) Brock Allen & Dominick Baier. All rights reserved.
// Licensed under the Apache License, Version 2.0. See LICENSE in the project root for license information.

import Log from './Log';

export default class SilentRenewService {

    constructor(userManager) {
        this._userManager = userManager;
        this._userManager.events.addAccessTokenExpiring(this._tokenExpiring.bind(this));

        // this will trigger loading of the user so the expiring events can be initialized
        this._userManager.getUser().then(user=>{
            // deliberate nop
        }).catch(err=>{
            // catch to suppress errors since we're in a ctor
            Log.error("Error from getUser:", err.message);
        });
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
