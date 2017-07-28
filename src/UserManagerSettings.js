// Copyright (c) Brock Allen & Dominick Baier. All rights reserved.
// Licensed under the Apache License, Version 2.0. See LICENSE in the project root for license information.

import Log from './Log';
import OidcClientSettings from './OidcClientSettings';
import RedirectNavigator from './RedirectNavigator';
import PopupNavigator from './PopupNavigator';
import IFrameNavigator from './IFrameNavigator';
import WebStorageStateStore from './WebStorageStateStore';
import Global from './Global';

// Minimal definitions for testing
let location = (typeof window == "undefined" || typeof window.location === "undefined") ? {protocol:"test:"} : window.location;
let document = (typeof window == "undefined" || typeof window.document === "undefined") ? {host:"unknown"} : window.document;

const DefaultAccessTokenExpiringNotificationTime = 60;
const DefaultCheckSessionInterval = 2000;
const DefaultPageOrigin = location.protocol + "//" + location.host;
const DefaultScriptOrigin = typeof document.currentScript === "undefined" ? location.protocol + "//" + location.host : document.currentScript.src.substr(0, document.currentScript.src.indexOf("/", document.currentScript.src.indexOf("//") + 2))

export default class UserManagerSettings extends OidcClientSettings {
    constructor({
        popup_redirect_uri,
        popup_post_logout_redirect_uri,
        popupWindowFeatures,
        popupWindowTarget,
        silent_redirect_uri,
        silentRequestTimeout,
        automaticSilentRenew = false,
        monitorSession = true,
        checkSessionInterval = DefaultCheckSessionInterval,
        revokeAccessTokenOnSignout = false,
        accessTokenExpiringNotificationTime = DefaultAccessTokenExpiringNotificationTime,
        pageOrigin = DefaultPageOrigin,
        scriptOrigin = DefaultScriptOrigin,
        redirectNavigator = new RedirectNavigator(),
        popupNavigator = new PopupNavigator(),
        iframeNavigator, // = new IFrameNavigator( pageOrigin ), // this would be nice, but doesn't work
        userStore = new WebStorageStateStore({ store: Global.sessionStorage }),
        userinfoHeaderBug = false, // set true if your auth server ignores Authorization token in headers; this will send it as a query parameter
    } = {}) {
        super(arguments[0]);

        this._popup_redirect_uri = popup_redirect_uri;
        this._popup_post_logout_redirect_uri = popup_post_logout_redirect_uri;
        this._popupWindowFeatures = popupWindowFeatures;
        this._popupWindowTarget = popupWindowTarget;
        
        this._silent_redirect_uri = silent_redirect_uri;
        this._silentRequestTimeout = silentRequestTimeout;
        this._automaticSilentRenew = !!automaticSilentRenew;
        this._accessTokenExpiringNotificationTime = accessTokenExpiringNotificationTime;

        this._monitorSession = monitorSession;
        this._checkSessionInterval = checkSessionInterval;
        this._revokeAccessTokenOnSignout = revokeAccessTokenOnSignout;

        this._pageOrigin = pageOrigin;
        this._scriptOrigin = scriptOrigin;

        this._redirectNavigator = redirectNavigator;
        this._popupNavigator = popupNavigator;
        this._iframeNavigator = (typeof iframeNavigator === "undefined") ? new IFrameNavigator( this._pageOrigin ) : iframeNavigator;
        
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

    get pageOrigin() { return this._pageOrigin; }
    get scriptOrigin() { return this._scriptOrigin; }
}
