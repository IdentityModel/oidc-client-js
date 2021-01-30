// Copyright (c) Brock Allen & Dominick Baier. All rights reserved.
// Licensed under the Apache License, Version 2.0. See LICENSE in the project root for license information.

import { Log } from './Log.js';
import { OidcClient } from './OidcClient.js';
import { UserManagerSettings } from './UserManagerSettings.js';
import { User } from './User.js';
import { UserManagerEvents } from './UserManagerEvents.js';
import { SilentRenewService } from './SilentRenewService.js';
import { SessionMonitor } from './SessionMonitor.js';
import { SigninRequest } from "./SigninRequest";
import { TokenRevocationClient } from './TokenRevocationClient.js';
import { TokenClient } from './TokenClient.js';
import { JoseUtil } from './JoseUtil.js';


export class UserManager extends OidcClient {
    constructor(settings = {},
        SilentRenewServiceCtor = SilentRenewService,
        SessionMonitorCtor = SessionMonitor,
        TokenRevocationClientCtor = TokenRevocationClient,
        TokenClientCtor = TokenClient,
        joseUtil = JoseUtil
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
        this._tokenClient = new TokenClientCtor(this._settings);
        this._joseUtil = joseUtil;
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

    signinRedirect(args = {}) {
        args = Object.assign({}, args);

        args.request_type = "si:r";
        let navParams = {
            useReplaceToNavigate : args.useReplaceToNavigate
        };
        return this._signinStart(args, this._redirectNavigator, navParams).then(()=>{
            Log.info("UserManager.signinRedirect: successful");
        });
    }
    signinRedirectCallback(url) {
        return this._signinEnd(url || this._redirectNavigator.url).then(user => {
            if (user.profile && user.profile.sub) {
                Log.info("UserManager.signinRedirectCallback: successful, signed in sub: ", user.profile.sub);
            }
            else {
                Log.info("UserManager.signinRedirectCallback: no sub");
            }

            return user;
        });
    }

    signinPopup(args = {}) {
        args = Object.assign({}, args);

        args.request_type = "si:p";
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
        args = Object.assign({}, args);

        // first determine if we have a refresh token, or need to use iframe
        return this._loadUser().then(user => {
            if (user && user.refresh_token) {
                args.refresh_token = user.refresh_token;
                return this._useRefreshToken(args);
            }
            else {
                args.request_type = "si:s";
                args.id_token_hint = args.id_token_hint || (this.settings.includeIdTokenInSilentRenew && user && user.id_token);
                if (user && this._settings.validateSubOnSilentRenew) {
                    Log.debug("UserManager.signinSilent, subject prior to silent renew: ", user.profile.sub);
                    args.current_sub = user.profile.sub;
                }
                return this._signinSilentIframe(args);
            }
        });
    }

    _useRefreshToken(args = {}) {
        return this._tokenClient.exchangeRefreshToken(args).then(result => {
            if (!result) {
                Log.error("UserManager._useRefreshToken: No response returned from token endpoint");
                return Promise.reject("No response returned from token endpoint");
            }
            if (!result.access_token) {
                Log.error("UserManager._useRefreshToken: No access token returned from token endpoint");
                return Promise.reject("No access token returned from token endpoint");
            }

            return this._loadUser().then(user => {
                if (user) {
                    let idTokenValidation = Promise.resolve();
                    if (result.id_token) {
                        idTokenValidation = this._validateIdTokenFromTokenRefreshToken(user.profile, result.id_token);
                    }

                    return idTokenValidation.then(() => {
                        Log.debug("UserManager._useRefreshToken: refresh token response success");
                        user.id_token = result.id_token || user.id_token;
                        user.access_token = result.access_token;
                        user.refresh_token = result.refresh_token || user.refresh_token;
                        user.expires_in = result.expires_in;

                        return this.storeUser(user).then(()=>{
                            this._events.load(user);
                            return user;
                        });
                    });
                }
                else {
                    return null;
                }
            });
        });
    }

    _validateIdTokenFromTokenRefreshToken(profile, id_token) {
        return this._metadataService.getIssuer().then(issuer => {
            return this.settings.getEpochTime().then(now => {
                return this._joseUtil.validateJwtAttributes(id_token, issuer, this._settings.client_id, this._settings.clockSkew, now).then(payload => {
                    if (!payload) {
                        Log.error("UserManager._validateIdTokenFromTokenRefreshToken: Failed to validate id_token");
                        return Promise.reject(new Error("Failed to validate id_token"));
                    }
                    if (payload.sub !== profile.sub) {
                        Log.error("UserManager._validateIdTokenFromTokenRefreshToken: sub in id_token does not match current sub");
                        return Promise.reject(new Error("sub in id_token does not match current sub"));
                    }
                    if (payload.auth_time && payload.auth_time !== profile.auth_time) {
                        Log.error("UserManager._validateIdTokenFromTokenRefreshToken: auth_time in id_token does not match original auth_time");
                        return Promise.reject(new Error("auth_time in id_token does not match original auth_time"));
                    }
                    if (payload.azp && payload.azp !== profile.azp) {
                        Log.error("UserManager._validateIdTokenFromTokenRefreshToken: azp in id_token does not match original azp");
                        return Promise.reject(new Error("azp in id_token does not match original azp"));
                    }
                    if (!payload.azp && profile.azp) {
                        Log.error("UserManager._validateIdTokenFromTokenRefreshToken: azp not in id_token, but present in original id_token");
                        return Promise.reject(new Error("azp not in id_token, but present in original id_token"));
                    }
                });
            });
        });
    }
    
    _signinSilentIframe(args = {}) {
        let url = args.redirect_uri || this.settings.silent_redirect_uri || this.settings.redirect_uri;
        if (!url) {
            Log.error("UserManager.signinSilent: No silent_redirect_uri configured");
            return Promise.reject(new Error("No silent_redirect_uri configured"));
        }

        args.redirect_uri = url;
        args.prompt = args.prompt || "none";

        return this._signin(args, this._iframeNavigator, {
            startUrl: url,
            silentRequestTimeout: args.silentRequestTimeout || this.settings.silentRequestTimeout
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

    signinCallback(url) {
        return this.readSigninResponseState(url).then(({state, response}) => {
            if (state.request_type === "si:r") {
                return this.signinRedirectCallback(url);
            }
            if (state.request_type === "si:p") {
                return this.signinPopupCallback(url);
            }
            if (state.request_type === "si:s") {
                return this.signinSilentCallback(url);
            }
            return Promise.reject(new Error("invalid response_type in state"));
        });
    }

    signoutCallback(url, keepOpen) {
        return this.readSignoutResponseState(url).then(({state, response}) => {
            if (state) {
                if (state.request_type === "so:r") {
                    return this.signoutRedirectCallback(url);
                }
                if (state.request_type === "so:p") {
                    return this.signoutPopupCallback(url, keepOpen);
                }
                return Promise.reject(new Error("invalid response_type in state"));
            }
            return response;
        });
    }

    querySessionStatus(args = {}) {
        args = Object.assign({}, args);

        args.request_type = "si:s"; // this acts like a signin silent
        let url = args.redirect_uri || this.settings.silent_redirect_uri || this.settings.redirect_uri;
        if (!url) {
            Log.error("UserManager.querySessionStatus: No silent_redirect_uri configured");
            return Promise.reject(new Error("No silent_redirect_uri configured"));
        }

        args.redirect_uri = url;
        args.prompt = "none";
        args.response_type = args.response_type || this.settings.query_status_response_type;
        args.scope = args.scope || "openid";
        args.skipUserInfo = true;

        return this._signinStart(args, this._iframeNavigator, {
            startUrl: url,
            silentRequestTimeout: args.silentRequestTimeout || this.settings.silentRequestTimeout
        }).then(navResponse => {
            return this.processSigninResponse(navResponse.url).then(signinResponse => {
                Log.debug("UserManager.querySessionStatus: got signin response");

                if (signinResponse.session_state && signinResponse.profile.sub) {
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
            })
            .catch(err => {
                if (err.session_state && this.settings.monitorAnonymousSession) {
                    if (err.message == "login_required" || 
                        err.message == "consent_required" || 
                        err.message == "interaction_required" || 
                        err.message == "account_selection_required"
                    ) {
                        Log.info("UserManager.querySessionStatus: querySessionStatus success for anonymous user");
                        return {
                            session_state: err.session_state
                        };
                    }
                }

                throw err;
            });
        });
    }

    _signin(args, navigator, navigatorParams = {}) {
        return this._signinStart(args, navigator, navigatorParams).then(navResponse => {
            return this._signinEnd(navResponse.url, args);
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
    _signinEnd(url, args = {}) {
        return this.processSigninResponse(url).then(signinResponse => {
            Log.debug("UserManager._signinEnd: got signin response");

            let user = new User(signinResponse);

            if (args.current_sub) {
                if (args.current_sub !== user.profile.sub) {
                    Log.debug("UserManager._signinEnd: current user does not match user returned from signin. sub from signin: ", user.profile.sub);
                    return Promise.reject(new Error("login_required"));
                }
                else {
                    Log.debug("UserManager._signinEnd: current user matches user returned from signin");
                }
            }

            return this.storeUser(user).then(() => {
                Log.debug("UserManager._signinEnd: user stored");

                this._events.load(user);

                return user;
            });
        });
    }
    _signinCallback(url, navigator) {
        Log.debug("UserManager._signinCallback");
        let useQuery = this._settings.response_mode === "query" || (!this._settings.response_mode && SigninRequest.isCode(this._settings.response_type));
        let delimiter = useQuery ? "?" : "#";
        return navigator.callback(url, undefined, delimiter);
    }

    signoutRedirect(args = {}) {
        args = Object.assign({}, args);

        args.request_type = "so:r";
        let postLogoutRedirectUri = args.post_logout_redirect_uri || this.settings.post_logout_redirect_uri;
        if (postLogoutRedirectUri){
            args.post_logout_redirect_uri = postLogoutRedirectUri;
        }
        let navParams = {
            useReplaceToNavigate : args.useReplaceToNavigate
        };
        return this._signoutStart(args, this._redirectNavigator, navParams).then(()=>{
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
        args = Object.assign({}, args);

        args.request_type = "so:p";
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
            Log.info("UserManager.signoutPopup: successful");
        });
    }
    signoutPopupCallback(url, keepOpen) {
        if (typeof(keepOpen) === 'undefined' && typeof(url) === 'boolean') {
            keepOpen = url;
            url = null;
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
                    user.refresh_token = null;
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
        if (user) {
            var access_token = user.access_token;
            var refresh_token = user.refresh_token;

            return this._revokeAccessTokenInternal(access_token, required)
                .then(atSuccess => {
                    return this._revokeRefreshTokenInternal(refresh_token, required)
                        .then(rtSuccess => {
                            if (!atSuccess && !rtSuccess) {
                                Log.debug("UserManager.revokeAccessToken: no need to revoke due to no token(s), or JWT format");
                            }
                            
                            return atSuccess || rtSuccess;
                        });
                });
        }

        return Promise.resolve(false);
    }

    _revokeAccessTokenInternal(access_token, required) {
        // check for JWT vs. reference token
        if (!access_token || access_token.indexOf('.') >= 0) {
            return Promise.resolve(false);
        }

        return this._tokenRevocationClient.revoke(access_token, required).then(() => true);
    }

    _revokeRefreshTokenInternal(refresh_token, required) {
        if (!refresh_token) {
            return Promise.resolve(false);
        }

        return this._tokenRevocationClient.revoke(refresh_token, required, "refresh_token").then(() => true);
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
