// Copyright (c) Brock Allen & Dominick Baier. All rights reserved.
// Licensed under the Apache License, Version 2.0. See LICENSE in the project root for license information.

import Log from './Log';
import OidcClientSettings from './OidcClientSettings';

const DefaultAccessTokenExpiringNotificationTime = 60;

export default class UserManagerSettings extends OidcClientSettings {
    constructor({
        popup_redirect_uri,
        popupWindowFeatures,
        silent_redirect_uri,
        automaticSilentRenew = false,
        accessTokenExpiringNotificationTime = DefaultAccessTokenExpiringNotificationTime
    } = {}) {
        super(arguments[0]);
        
        this._popup_redirect_uri = popup_redirect_uri;
        this._popupWindowFeatures = popupWindowFeatures;
        this._silent_redirect_uri = silent_redirect_uri;
        this._automaticSilentRenew = !!automaticSilentRenew;
        this._accessTokenExpiringNotificationTime = accessTokenExpiringNotificationTime;
    }
    
    get popup_redirect_uri(){
        return this._popup_redirect_uri;
    }
    get popupWindowFeatures(){
        return this._popupWindowFeatures;
    }

    get silent_redirect_uri() {
        return this._silent_redirect_uri;
    }
    get automaticSilentRenew() {
        return !!(this.silent_redirect_uri && this._automaticSilentRenew);
    }
    
    get accessTokenExpiringNotificationTime(){
        return this._accessTokenExpiringNotificationTime;
    }
}
