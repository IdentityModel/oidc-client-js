// Copyright (c) Brock Allen & Dominick Baier. All rights reserved.
// Licensed under the Apache License, Version 2.0. See LICENSE in the project root for license information.

import Log from './Log';
import OidcClientSettings from './OidcClientSettings';

const DefaultAccessTokenExpiringNotificationTime = 60;

export default class UserManagerSettings extends OidcClientSettings {
    constructor({
        popup_redirect_uri,
        silent_redirect_uri,
        enableAutomaticSilentRenew = true,
        accessTokenExpiringNotificationTime = DefaultAccessTokenExpiringNotificationTime
    } = {}) {
        super(arguments[0]);
        
        this._popup_redirect_uri = popup_redirect_uri;
        this._silent_redirect_uri = silent_redirect_uri;
        this._enableAutomaticSilentRenew = !!enableAutomaticSilentRenew;
        this._accessTokenExpiringNotificationTime = accessTokenExpiringNotificationTime;
    }
    
    get popup_redirect_uri(){
        return this._popup_redirect_uri;
    }

    get silent_redirect_uri() {
        return this._silent_redirect_uri;
    }
    get performAutomaticSilentRenew() {
        return !!(this.silent_redirect_uri && this._enableAutomaticSilentRenew);
    }
    
    get accessTokenExpiringNotificationTime(){
        return this._accessTokenExpiringNotificationTime;
    }
}
