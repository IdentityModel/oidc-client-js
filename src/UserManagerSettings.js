// Copyright (c) Brock Allen & Dominick Baier. All rights reserved.
// Licensed under the Apache License, Version 2.0. See LICENSE in the project root for license information.

import { Log } from './Log.js';
import { OidcClientSettings } from './OidcClientSettings.js';
import { RedirectNavigator } from './RedirectNavigator.js';
import { PopupNavigator } from './PopupNavigator.js';
import { IFrameNavigator } from './IFrameNavigator.js';
import { WebStorageStateStore } from './WebStorageStateStore.js';
import { Global } from './Global.js';

const DefaultAccessTokenExpiringThresholdInSeconds = 60;
const DefaultCheckSessionIntervalInSeconds = 2;
const DefaultQuerySessionStatusResponseType = "id_token";

export class UserManagerSettings extends OidcClientSettings {
    constructor({
        popup_redirect_uri,
        popup_post_logout_redirect_uri,
        popupWindowFeatures,
        popupWindowTarget,
        silent_redirect_uri,
        silentRequestTimeoutInSeconds,
        automaticSilentRenew = false,
        includeIdTokenInSilentRenew = true,
        monitorSession = true,
        checkSessionIntervalInSeconds = DefaultCheckSessionIntervalInSeconds,
        stopCheckSessionOnError = true,
        query_status_response_type = DefaultQuerySessionStatusResponseType,
        revokeAccessTokenOnSignout = false,
        accessTokenExpiringThresholdInSeconds = DefaultAccessTokenExpiringThresholdInSeconds,
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
        this._silentRequestTimeoutInSeconds = silentRequestTimeoutInSeconds;
        this._automaticSilentRenew = !!automaticSilentRenew;
        this._includeIdTokenInSilentRenew = includeIdTokenInSilentRenew;
        this._accessTokenExpiringThreshholdInSeconds = accessTokenExpiringThresholdInSeconds;

        this._monitorSession = monitorSession;
        this._checkSessionIntervalInSeconds = checkSessionIntervalInSeconds;
        this._stopCheckSessionOnError = stopCheckSessionOnError;
        this._query_status_response_type = query_status_response_type;
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
    get silentRequestTimeoutInSeconds() {
        return this._silentRequestTimeoutInSeconds;
    }
    get automaticSilentRenew() {
        return !!(this.silent_redirect_uri && this._automaticSilentRenew);
    }
    get includeIdTokenInSilentRenew() {
        return this._includeIdTokenInSilentRenew;
    }
    get accessTokenExpiringThresholdInSeconds() {
        return this._accessTokenExpiringThreshholdInSeconds;
    }
    get monitorSession() {
        return this._monitorSession;
    }
    get checkSessionIntervalInSeconds() {
        return this._checkSessionIntervalInSeconds;
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
