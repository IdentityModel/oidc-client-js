// Copyright (c) Brock Allen & Dominick Baier. All rights reserved.
// Licensed under the Apache License, Version 2.0. See LICENSE in the project root for license information.

import Log from './Log';
import OidcClientSettings from './OidcClientSettings';
import RedirectNavigator from './RedirectNavigator';
import PopupNavigator from './PopupNavigator';
import IFrameNavigator from './IFrameNavigator';
import WebStorageStateStore from './WebStorageStateStore';
import Global from './Global';

const DefaultAccessTokenExpiringNotificationTime = 60;
const DefaultCheckSessionInterval = 2000;

export default class UserManagerSettings extends OidcClientSettings {
    constructor({
        popup_redirect_uri,
        popupWindowFeatures,
        popupWindowTarget,
        silent_redirect_uri,
        silentRequestTimeout,
        automaticSilentRenew = false,
        monitorSession = true,
        checkSessionInterval = DefaultCheckSessionInterval,
        revokeAccessTokenOnSignout = false,
        accessTokenExpiringNotificationTime = DefaultAccessTokenExpiringNotificationTime,
        redirectNavigator = new RedirectNavigator(),
        popupNavigator = new PopupNavigator(),
        iframeNavigator = new IFrameNavigator(),
        userStore = new WebStorageStateStore({ store: Global.sessionStorage })
    } = {}) {
        super(arguments[0]);

        this._popup_redirect_uri = popup_redirect_uri;
        this._popupWindowFeatures = popupWindowFeatures;
        this._popupWindowTarget = popupWindowTarget;
        
        this._silent_redirect_uri = silent_redirect_uri;
        this._silentRequestTimeout = silentRequestTimeout;
        this._automaticSilentRenew = !!automaticSilentRenew;
        this._accessTokenExpiringNotificationTime = accessTokenExpiringNotificationTime;

        this._monitorSession = monitorSession;
        this._checkSessionInterval = checkSessionInterval;
        this._revokeAccessTokenOnSignout = revokeAccessTokenOnSignout;

        this._redirectNavigator = redirectNavigator;
        this._popupNavigator = popupNavigator;
        this._iframeNavigator = iframeNavigator;
        
        this._userStore = userStore;
    }

    get popup_redirect_uri() {
        return this._popup_redirect_uri;
    }
    get popupWindowFeatures() {
        return this._popupWindowFeatures;
    }
    get popupWindowTarget() {
        return this._popupWindowTarget;
    }

    get silent_redirect_uri() {
        return this._silent_redirect_uri;
    }
     get silentRequestTimeout() {
        return this._silentRequestTimeout;
    }
    get automaticSilentRenew() {
        return !!(this.silent_redirect_uri && this._automaticSilentRenew);
    }
    get accessTokenExpiringNotificationTime() {
        return this._accessTokenExpiringNotificationTime;
    }

    get monitorSession() {
        return this._monitorSession;
    }
    get checkSessionInterval() {
        return this._checkSessionInterval;
    }
    get revokeAccessTokenOnSignout() {
        return this._revokeAccessTokenOnSignout;
    }

    get redirectNavigator() {
        return this._redirectNavigator;
    }
    get popupNavigator() {
        return this._popupNavigator;
    }
    get iframeNavigator() {
        return this._iframeNavigator;
    }
    
    get userStore() {
        return this._userStore;
    }
}
