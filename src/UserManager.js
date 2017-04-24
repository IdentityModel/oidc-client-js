// Copyright (c) Brock Allen & Dominick Baier. All rights reserved.
// Licensed under the Apache License, Version 2.0. See LICENSE in the project root for license information.

import Log from './Log';
import OidcClient from './OidcClient';
import UserManagerSettings from './UserManagerSettings';
import User from './User';
import UserManagerEvents from './UserManagerEvents';
import SilentRenewService from './SilentRenewService';
import SessionMonitor from './SessionMonitor';
import TokenRevocationClient from './TokenRevocationClient';

export default class UserManager extends OidcClient {
    constructor(settings = {},
        SilentRenewServiceCtor = SilentRenewService,
        SessionMonitorCtor = SessionMonitor,
        TokenRevocationClientCtor = TokenRevocationClient
    ) {

        if (!(settings instanceof UserManagerSettings)) {
            settings = new UserManagerSettings(settings);
        }
        super(settings);

        this._events = new UserManagerEvents(settings);

        // order is important for the following properties; these services depend upon the events.
        if (this.settings.automaticSilentRenew) {
            Log.debug("automaticSilentRenew is configured, setting up silent renew")
            this._silentRenewService = new SilentRenewServiceCtor(this);
        }
        if (this.settings.monitorSession) {
            Log.debug("monitorSession is configured, setting up session monitor")
            this._sessionMonitor = new SessionMonitorCtor(this);
        }

        this._tokenRevocationClient = new TokenRevocationClientCtor(this._settings);
    }

    get _redirectNavigator() {
        return this.settings.redirectNavigator;
    }
    get _popupNavigator() {
        return this.settings.popupNavigator;
    }
    get _iframeNavigator() {
        return this.settings.iframeNavigator;
    }
    get _userStore() {
        return this.settings.userStore;
    }

    get events() {
        return this._events;
    }

    getUser() {
        Log.debug("UserManager.getUser");

        return this._loadUser().then(user => {
            if (user) {
                Log.info("user loaded");

                this._events.load(user, false);

                return user;
            }
            else {
                Log.info("user not found in storage");
                return null;
            }
        });
    }

    removeUser() {
        Log.debug("UserManager.removeUser");

        return this._storeUser(null).then(() => {
            Log.info("user removed from storage");
            this._events.unload();
        });
    }

    signinPopup(args = {}) {
        Log.debug("UserManager.signinPopup");

        let url = args.redirect_uri || this.settings.popup_redirect_uri || this.settings.redirect_uri;
        if (!url) {
            Log.error("No popup_redirect_uri or redirect_uri configured");
            return Promise.reject(new Error("No popup_redirect_uri or redirect_uri configured"));
        }

        args.redirect_uri = url;
        args.display = "popup";

        return this._signin(args, this._popupNavigator, {
            startUrl: url,
            popupWindowFeatures: args.popupWindowFeatures || this.settings.popupWindowFeatures,
            popupWindowTarget: args.popupWindowTarget || this.settings.popupWindowTarget
        }).then(user => {
            if (user) {
                if (user.profile && user.profile.sub) {
                    Log.info("signinPopup successful, signed in sub: ", user.profile.sub);
                }
                else {
                    Log.info("signinPopup successful");
                }
            }

            return user;
        });
    }
    signinPopupCallback(url) {
        Log.debug("UserManager.signinPopupCallback");
        return this._signinCallback(url, this._popupNavigator).then(user => {
            if (user) {
                if (user.profile && user.profile.sub) {
                    Log.info("signinPopupCallback successful, signed in sub: ", user.profile.sub);
                }
                else {
                    Log.info("signinPopupCallback successful");
                }
            }

            return user;
        });
    }
    signinSilent(args = {}) {
        Log.debug("UserManager.signinSilent");

        let url = args.redirect_uri || this.settings.silent_redirect_uri;
        if (!url) {
            Log.error("No silent_redirect_uri configured");
            return Promise.reject(new Error("No silent_redirect_uri configured"));
        }

        args.redirect_uri = url;
        args.prompt = "none";

        let setIdToken;
        if (args.id_token_hint) {
            setIdToken = Promise.resolve();
        }
        else {
            setIdToken = this._loadUser().then(user => {
                args.id_token_hint = user && user.id_token;
            });
        }

        return setIdToken.then(() => {
            return this._signin(args, this._iframeNavigator, {
                startUrl: url,
                silentRequestTimeout: args.silentRequestTimeout || this.settings.silentRequestTimeout
            });
        }).then(user => {
            if (user) {
                if (user.profile && user.profile.sub) {
                    Log.info("signinSilent successful, signed in sub: ", user.profile.sub);
                }
                else {
                    Log.info("signinSilent successful");
                }
            }

            return user;
        });
    }
    signinSilentCallback(url) {
        Log.debug("UserManager.signinSilentCallback");
        return this._signinCallback(url, this._iframeNavigator).then(user => {
            if (user) {
                if (user.profile && user.profile.sub) {
                    Log.info("signinSilentCallback successful, signed in sub: ", user.profile.sub);
                }
                else {
                    Log.info("signinSilentCallback successful");
                }
            }

            return user;
        });
    }

    querySessionStatus(args = {}) {
        Log.debug("UserManager.querySessionStatus");

        let url = args.redirect_uri || this.settings.silent_redirect_uri;
        if (!url) {
            Log.error("No silent_redirect_uri configured");
            return Promise.reject(new Error("No silent_redirect_uri configured"));
        }

        args.redirect_uri = url;
        args.prompt = "none";
        args.response_type = "id_token";
        args.scope = "openid";

        return this._signinStart(args, this._iframeNavigator, {
            startUrl: url,
            silentRequestTimeout: args.silentRequestTimeout || this.settings.silentRequestTimeout
        }).then(navResponse => {
            return this.processSigninResponse(navResponse.url).then(signinResponse => {
                Log.debug("got signin response");

                if (signinResponse.session_state && signinResponse.profile.sub && signinResponse.profile.sid) {
                    Log.info("querySessionStatus success for sub: ",  signinResponse.profile.sub);
                    return {
                        session_state: signinResponse.session_state,
                        sub: signinResponse.profile.sub,
                        sid: signinResponse.profile.sid
                    };
                }
                else {
                    Log.info("querySessionStatus successful, user not authenticated");
                }
            });
        });
    }

    _signin(args, navigator, navigatorParams = {}) {
        Log.debug("_signin");
        return this._signinStart(args, navigator, navigatorParams).then(navResponse => {
            return this._signinEnd(navResponse.url);
        });
    }
    _signinCallback(url, navigator) {
        Log.debug("_signinCallback");
        return navigator.callback(url);
    }
    _signout(args, navigator, navigatorParams = {}) {
        Log.debug("_signout");
        return this._signoutStart(args, navigator, navigatorParams).then(navResponse => {
            return this._signoutEnd(navResponse.url);
        });
    }

    signinRedirect(args) {
        Log.debug("UserManager.signinRedirect");
        return this._signinStart(args, this._redirectNavigator).then(()=>{
            Log.info("signinRedirect successful");
        });
    }
    signinRedirectCallback(url) {
        Log.debug("UserManager.signinRedirectCallback");
        return this._signinEnd(url || this._redirectNavigator.url).then(user => {
            if (user) {
                if (user.profile && user.profile.sub) {
                    Log.info("signinRedirectCallback successful, signed in sub: ", user.profile.sub);
                }
                else {
                    Log.info("signinRedirectCallback successful");
                }
            }

            return user;
        });
    }
    signoutRedirect(args) {
        Log.debug("UserManager.signoutRedirect");
        return this._signoutStart(args, this._redirectNavigator).then(()=>{
            Log.info("signoutRedirect successful");
        });
    }
    signoutRedirectCallback(url) {
        Log.debug("UserManager.signoutRedirectCallback");
        return this._signoutEnd(url || this._redirectNavigator.url).then(response=>{
            Log.info("signoutRedirectCallback successful");
        });
    }
    signoutPopup(args = {}) {
        Log.debug("UserManager.signinPopup");

        let url = args.post_logout_redirect_uri || this.settings.popup_post_logout_redirect_uri || this.settings.post_logout_redirect_uri;
        args.post_logout_redirect_uri = url;
        args.display = "popup";
        if (args.post_logout_redirect_uri){
            // we're putting a dummy entry in here because we 
            // need a unique id from the state for notification
            // to the parent window, which is necessary if we
            // plan to return back to the client after signout
            // and so we can close the popup after signout
            args.state = args.state || {};
        }

        return this._signout(args, this._popupNavigator, {
            startUrl: url,
            popupWindowFeatures: args.popupWindowFeatures || this.settings.popupWindowFeatures,
            popupWindowTarget: args.popupWindowTarget || this.settings.popupWindowTarget
        }).then(() => {
            Log.info("signoutPopup successful");
        });
    }
    signoutPopupCallback(url, keepOpen) {
        if (typeof(keepOpen) === 'undefined' && typeof(url) === 'boolean') {
            url = null;
            keepOpen = true;
        }
        Log.debug("UserManager.signoutPopupCallback");
        let delimiter = '?';
        return this._popupNavigator.callback(url, keepOpen, delimiter).then(() => {
            Log.info("signoutPopupCallback successful");
        });
    }

    _signinStart(args, navigator, navigatorParams = {}) {
        Log.debug("_signinStart");

        return navigator.prepare(navigatorParams).then(handle => {
            Log.debug("got navigator window handle");

            return this.createSigninRequest(args).then(signinRequest => {
                Log.debug("got signin request");

                navigatorParams.url = signinRequest.url;
                navigatorParams.id = signinRequest.state.id;
                return handle.navigate(navigatorParams);
            });
        });
    }
    _signinEnd(url) {
        Log.debug("_signinEnd");

        return this.processSigninResponse(url).then(signinResponse => {
            Log.debug("got signin response");

            let user = new User(signinResponse);

            return this._storeUser(user).then(() => {
                Log.debug("user stored");

                this._events.load(user);

                return user;
            });
        });
    }

    _signoutStart(args = {}, navigator, navigatorParams = {}) {
        Log.debug("_signoutStart");

        return navigator.prepare(navigatorParams).then(handle => {
            Log.debug("got navigator window handle");

            return this._loadUser().then(user => {
                Log.debug("loaded current user from storage");

                var revokePromise = this._settings.revokeAccessTokenOnSignout ? this._revokeInternal(user) : Promise.resolve();
                return revokePromise.then(() => {

                    var id_token = args.id_token_hint || user && user.id_token;
                    if (id_token) {
                        Log.debug("Setting id_token into signout request");
                        args.id_token_hint = id_token;
                    }

                    return this.removeUser().then(() => {
                        Log.debug("user removed, creating signout request");

                        return this.createSignoutRequest(args).then(signoutRequest => {
                            Log.debug("got signout request");

                            navigatorParams.url = signoutRequest.url;
                            if (signoutRequest.state) {
                                navigatorParams.id = signoutRequest.state.id;
                            }
                            return handle.navigate(navigatorParams);
                        });
                    });
                });
            });
        });
    }
    _signoutEnd(url) {
        Log.debug("_signoutEnd");

        return this.processSignoutResponse(url).then(signoutResponse => {
            Log.debug("got signout response");

            return signoutResponse;
        });
    }

    revokeAccessToken() {
        Log.debug("UserManager.revokeAccessToken");

        return this._loadUser().then(user => {
            return this._revokeInternal(user, true).then(success => {
                if (success) {
                    Log.debug("removing token properties from user and re-storing");

                    user.access_token = null;
                    user.expires_at = null;
                    user.token_type = null;

                    return this._storeUser(user).then(() => {
                        Log.debug("user stored");
                        this._events.load(user);
                    });
                }
            });
        }).then(()=>{
            Log.info("access token revoked successfully");
        });
    }

    _revokeInternal(user, required) {
        Log.debug("checking if token revocation is necessary");

        var access_token = user && user.access_token;

        // check for JWT vs. reference token
        if (!access_token || access_token.indexOf('.') >= 0) {
            Log.debug("no need to revoke due to no user, token, or JWT format");
            return Promise.resolve(false);
        }

        return this._tokenRevocationClient.revoke(access_token, required).then(() => true);
    }
    
    get _userStoreKey() {
        return `user:${this.settings.authority}:${this.settings.client_id}`;
    }

    _loadUser() {
        Log.debug("_loadUser");

        return this._userStore.get(this._userStoreKey).then(storageString => {
            if (storageString) {
                Log.debug("user storageString loaded");
                return User.fromStorageString(storageString);
            }

            Log.debug("no user storageString");
            return null;
        });
    }

    _storeUser(user) {
        if (user) {
            Log.debug("_storeUser storing user");

            var storageString = user.toStorageString();
            return this._userStore.set(this._userStoreKey, storageString);
        }
        else {
            Log.debug("_storeUser removing user storage");
            return this._userStore.remove(this._userStoreKey);
        }
    }
}
