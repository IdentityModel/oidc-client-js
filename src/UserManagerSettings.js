// Copyright (c) Brock Allen & Dominick Baier. All rights reserved.
// Licensed under the Apache License, Version 2.0. See LICENSE in the project root for license information.

import { Log } from './Log.js';
import { OidcClientSettings } from './OidcClientSettings.js';
import { RedirectNavigator } from './RedirectNavigator.js';
import { PopupNavigator } from './PopupNavigator.js';
import { IFrameNavigator } from './IFrameNavigator.js';
import { WebStorageStateStore } from './WebStorageStateStore.js';
import { Global } from './Global.js';
import { SigninRequest } from './SigninRequest.js';

const DefaultAccessTokenExpiringNotificationTime = 60;
const DefaultCheckSessionInterval = 2000;

export class UserManagerSettings extends OidcClientSettings {
    constructor({
        popup_redirect_uri,
        popup_post_logout_redirect_uri,
        popupWindowFeatures,
        popupWindowTarget,
        silent_redirect_uri,
        silentRequestTimeout,
        automaticSilentRenew = false,
        validateSubOnSilentRenew = false,
        includeIdTokenInSilentRenew = true,
        monitorSession = true,
        monitorAnonymousSession = false,
        checkSessionInterval = DefaultCheckSessionInterval,
        stopCheckSessionOnError = true,
        query_status_response_type,
        revokeAccessTokenOnSignout = false,
        accessTokenExpiringNotificationTime = DefaultAccessTokenExpiringNotificationTime,
        redirectNavigator = new RedirectNavigator(),
        popupNavigator = new PopupNavigator(),
        iframeNavigator = new IFrameNavigator(),
        userStore = new WebStorageStateStore({ store: Global.sessionStorage })
    } = {}) {
        super(arguments[0]);

        this._popup_redirect_uri = popup_redirect_uri;
        this._popup_post_logout_redirect_uri = popup_post_logout_redirect_uri;
        this._popupWindowFeatures = popupWindowFeatures;
        this._popupWindowTarget = popupWindowTarget;

        this._silent_redirect_uri = silent_redirect_uri;
        this._silentRequestTimeout = silentRequestTimeout;
        this._automaticSilentRenew = automaticSilentRenew;
        this._validateSubOnSilentRenew = validateSubOnSilentRenew;
        this._includeIdTokenInSilentRenew = includeIdTokenInSilentRenew;
        this._accessTokenExpiringNotificationTime = accessTokenExpiringNotificationTime;

        this._monitorSession = monitorSession;
        this._monitorAnonymousSession = monitorAnonymousSession;
        this._checkSessionInterval = checkSessionInterval;
        this._stopCheckSessionOnError = stopCheckSessionOnError;
        if (query_status_response_type) {
            this._query_status_response_type = query_status_response_type;
        } 
        else if (arguments[0] && arguments[0].response_type) {
            this._query_status_response_type = SigninRequest.isOidc(arguments[0].response_type) ? "id_token" : "code";
        }
        else {
            this._query_status_response_type = "id_token";
        }
        this._revokeAccessTokenOnSignout = revokeAccessTokenOnSignout;

        this._redirectNavigator = redirectNavigator;
        this._popupNavigator = popupNavigator;
        this._iframeNavigator = iframeNavigator;

        this._userStore = userStore;
    }

    get popup_redirect_uri() {
        return this._popup_redirect_uri;
    }
    get popup_post_logout_redirect_uri() {
        return this._popup_post_logout_redirect_uri;
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
        return this._automaticSilentRenew;
    }
    get validateSubOnSilentRenew() {
        return this._validateSubOnSilentRenew;
    }
    get includeIdTokenInSilentRenew() {
        return this._includeIdTokenInSilentRenew;
    }
    get accessTokenExpiringNotificationTime() {
        return this._accessTokenExpiringNotificationTime;
    }

    get monitorSession() {
        return this._monitorSession;
    }
    get monitorAnonymousSession() {
        return this._monitorAnonymousSession;
    }
    get checkSessionInterval() {
        return this._checkSessionInterval;
    }
    get stopCheckSessionOnError(){
        return this._stopCheckSessionOnError;
    }
    get query_status_response_type(){
        return this._query_status_response_type;
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
