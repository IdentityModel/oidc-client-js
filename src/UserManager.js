// Copyright (c) Brock Allen & Dominick Baier. All rights reserved.
// Licensed under the Apache License, Version 2.0. See LICENSE in the project root for license information.

import { Log } from './Log';
import { OidcClient } from './OidcClient';
import { UserManagerSettings } from './UserManagerSettings';
import { User } from './User';
import { UserManagerEvents } from './UserManagerEvents';
import { SilentRenewService } from './SilentRenewService';
import { SessionMonitor } from './SessionMonitor';
import { TokenRevocationClient } from './TokenRevocationClient';

export class UserManager extends OidcClient {
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
        this._silentRenewService = new SilentRenewServiceCtor(this);

        // order is important for the following properties; these services depend upon the events.
        if (this.settings.automaticSilentRenew) {
            Log.debug("UserManager.ctor: automaticSilentRenew is configured, setting up silent renew");
            this.startSilentRenew();
        }

        if (this.settings.monitorSession) {
            Log.debug("UserManager.ctor: monitorSession is configured, setting up session monitor");
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
        return this._loadUser().then(user => {
            if (user) {
                Log.info("UserManager.getUser: user loaded");

                this._events.load(user, false);

                return user;
            }
            else {
                Log.info("UserManager.getUser: user not found in storage");
                return null;
            }
        });
    }

    removeUser() {
        return this.storeUser(null).then(() => {
            Log.info("UserManager.removeUser: user removed from storage");
            this._events.unload();
        });
    }

    signinRedirect(args) {
        return this._signinStart(args, this._redirectNavigator).then(()=>{
            Log.info("UserManager.signinRedirect: successful");
        });
    }
    signinRedirectCallback(url) {
        return this._signinEnd(url || this._redirectNavigator.url).then(user => {
            if (user) {
                if (user.profile && user.profile.sub) {
                    Log.info("UserManager.signinRedirectCallback: successful, signed in sub: ", user.profile.sub);
                }
                else {
                    Log.info("UserManager.signinRedirectCallback: no sub");
                }
            }

            return user;
        });
    }

    signinPopup(args = {}) {
        let url = args.redirect_uri || this.settings.popup_redirect_uri || this.settings.redirect_uri;
        if (!url) {
            Log.error("UserManager.signinPopup: No popup_redirect_uri or redirect_uri configured");
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
                    Log.info("UserManager.signinPopup: signinPopup successful, signed in sub: ", user.profile.sub);
                }
                else {
                    Log.info("UserManager.signinPopup: no sub");
                }
            }

            return user;
        });
    }
    signinPopupCallback(url) {
        return this._signinCallback(url, this._popupNavigator).then(user => {
            if (user) {
                if (user.profile && user.profile.sub) {
                    Log.info("UserManager.signinPopupCallback: successful, signed in sub: ", user.profile.sub);
                }
                else {
                    Log.info("UserManager.signinPopupCallback: no sub");
                }
            }

            return user;
        }).catch(err=>{
            Log.error("UserManager.signinPopupCallback error: " + err && err.message);
            
        });
    }

    signinSilent(args = {}) {
        let url = args.redirect_uri || this.settings.silent_redirect_uri;
        if (!url) {
            Log.error("UserManager.signinSilent: No silent_redirect_uri configured");
            return Promise.reject(new Error("No silent_redirect_uri configured"));
        }

        args.redirect_uri = url;
        args.prompt = "none";

        let setIdToken;
        if (args.id_token_hint || !this.settings.includeIdTokenInSilentRenew) {
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
                    Log.info("UserManager.signinSilent: successful, signed in sub: ", user.profile.sub);
                }
                else {
                    Log.info("UserManager.signinSilent: no sub");
                }
            }

            return user;
        });
    }
    signinSilentCallback(url) {
        return this._signinCallback(url, this._iframeNavigator).then(user => {
            if (user) {
                if (user.profile && user.profile.sub) {
                    Log.info("UserManager.signinSilentCallback: successful, signed in sub: ", user.profile.sub);
                }
                else {
                    Log.info("UserManager.signinSilentCallback: no sub");
                }
            }

            return user;
        });
    }

    querySessionStatus(args = {}) {
        let url = args.redirect_uri || this.settings.silent_redirect_uri;
        if (!url) {
            Log.error("UserManager.querySessionStatus: No silent_redirect_uri configured");
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
                Log.debug("UserManager.querySessionStatus: got signin response");

                if (signinResponse.session_state && signinResponse.profile.sub && signinResponse.profile.sid) {
                    Log.info("UserManager.querySessionStatus: querySessionStatus success for sub: ",  signinResponse.profile.sub);
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
        return this._signinStart(args, navigator, navigatorParams).then(navResponse => {
            return this._signinEnd(navResponse.url);
        });
    }
    _signinStart(args, navigator, navigatorParams = {}) {

        return navigator.prepare(navigatorParams).then(handle => {
            Log.debug("UserManager._signinStart: got navigator window handle");

            return this.createSigninRequest(args).then(signinRequest => {
                Log.debug("UserManager._signinStart: got signin request");

                navigatorParams.url = signinRequest.url;
                navigatorParams.id = signinRequest.state.id;

                return handle.navigate(navigatorParams);
            }).catch(err => {
                if (handle.close) {
                    Log.debug("UserManager._signinStart: Error after preparing navigator, closing navigator window");
                    handle.close();
                }
                throw err;
            });
        });
    }
    _signinEnd(url) {
        return this.processSigninResponse(url).then(signinResponse => {
            Log.debug("UserManager._signinEnd: got signin response");

            let user = new User(signinResponse);

            return this.storeUser(user).then(() => {
                Log.debug("UserManager._signinEnd: user stored");

                this._events.load(user);

                return user;
            });
        });
    }
    _signinCallback(url, navigator) {
        Log.debug("UserManager._signinCallback");
        return navigator.callback(url);
    }

    signoutRedirect(args = {}) {
        let postLogoutRedirectUri = args.post_logout_redirect_uri || this.settings.post_logout_redirect_uri;
        if (postLogoutRedirectUri){
            args.post_logout_redirect_uri = postLogoutRedirectUri;
        }
        return this._signoutStart(args, this._redirectNavigator).then(()=>{
            Log.info("UserManager.signoutRedirect: successful");
        });
    }
    signoutRedirectCallback(url) {
        return this._signoutEnd(url || this._redirectNavigator.url).then(response=>{
            Log.info("UserManager.signoutRedirectCallback: successful");
            return response;
        });
    }

    signoutPopup(args = {}) {
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
            Log.info("UserManager.signinPopup: successful");
        });
    }
    signoutPopupCallback(url, keepOpen) {
        if (typeof(keepOpen) === 'undefined' && typeof(url) === 'boolean') {
            url = null;
            keepOpen = true;
        }

        let delimiter = '?';
        return this._popupNavigator.callback(url, keepOpen, delimiter).then(() => {
            Log.info("UserManager.signoutPopupCallback: successful");
        });
    }

    _signout(args, navigator, navigatorParams = {}) {
        return this._signoutStart(args, navigator, navigatorParams).then(navResponse => {
            return this._signoutEnd(navResponse.url);
        });
    }
    _signoutStart(args = {}, navigator, navigatorParams = {}) {
        return navigator.prepare(navigatorParams).then(handle => {
            Log.debug("UserManager._signoutStart: got navigator window handle");

            return this._loadUser().then(user => {
                Log.debug("UserManager._signoutStart: loaded current user from storage");

                var revokePromise = this._settings.revokeAccessTokenOnSignout ? this._revokeInternal(user) : Promise.resolve();
                return revokePromise.then(() => {

                    var id_token = args.id_token_hint || user && user.id_token;
                    if (id_token) {
                        Log.debug("UserManager._signoutStart: Setting id_token into signout request");
                        args.id_token_hint = id_token;
                    }

                    return this.removeUser().then(() => {
                        Log.debug("UserManager._signoutStart: user removed, creating signout request");

                        return this.createSignoutRequest(args).then(signoutRequest => {
                            Log.debug("UserManager._signoutStart: got signout request");

                            navigatorParams.url = signoutRequest.url;
                            if (signoutRequest.state) {
                                navigatorParams.id = signoutRequest.state.id;
                            }
                            return handle.navigate(navigatorParams);
                        });
                    });
                });
            }).catch(err => {
                if (handle.close) {
                    Log.debug("UserManager._signoutStart: Error after preparing navigator, closing navigator window");
                    handle.close();
                }
                throw err;
            });
        });
    }
    _signoutEnd(url) {
        return this.processSignoutResponse(url).then(signoutResponse => {
            Log.debug("UserManager._signoutEnd: got signout response");

            return signoutResponse;
        });
    }

    revokeAccessToken() {
        return this._loadUser().then(user => {
            return this._revokeInternal(user, true).then(success => {
                if (success) {
                    Log.debug("UserManager.revokeAccessToken: removing token properties from user and re-storing");

                    user.access_token = null;
                    user.expires_at = null;
                    user.token_type = null;

                    return this.storeUser(user).then(() => {
                        Log.debug("UserManager.revokeAccessToken: user stored");
                        this._events.load(user);
                    });
                }
            });
        }).then(()=>{
            Log.info("UserManager.revokeAccessToken: access token revoked successfully");
        });
    }

    _revokeInternal(user, required) {
        var access_token = user && user.access_token;

        // check for JWT vs. reference token
        if (!access_token || access_token.indexOf('.') >= 0) {
            Log.debug("UserManager.revokeAccessToken: no need to revoke due to no user, token, or JWT format");
            return Promise.resolve(false);
        }

        return this._tokenRevocationClient.revoke(access_token, required).then(() => true);
    }

    startSilentRenew() {
        this._silentRenewService.start();
    }

    stopSilentRenew() {
        this._silentRenewService.stop();
    }

    get _userStoreKey() {
        return `user:${this.settings.authority}:${this.settings.client_id}`;
    }

    _loadUser() {
        return this._userStore.get(this._userStoreKey).then(storageString => {
            if (storageString) {
                Log.debug("UserManager._loadUser: user storageString loaded");
                return User.fromStorageString(storageString);
            }

            Log.debug("UserManager._loadUser: no user storageString");
            return null;
        });
    }

    storeUser(user) {
        if (user) {
            Log.debug("UserManager.storeUser: storing user");

            var storageString = user.toStorageString();
            return this._userStore.set(this._userStoreKey, storageString);
        }
        else {
            Log.debug("storeUser.storeUser: removing user");
            return this._userStore.remove(this._userStoreKey);
        }
    }
}
