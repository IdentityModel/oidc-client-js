// Copyright (c) Brock Allen & Dominick Baier. All rights reserved.
// Licensed under the Apache License, Version 2.0. See LICENSE in the project root for license information.

import Log from './Log';
import OidcClient from './OidcClient';
import UserManagerSettings from './UserManagerSettings';
import WebStorageStateStore from './WebStorageStateStore';
import Global from './Global';
import User from './User';
import RedirectNavigator from './RedirectNavigator';
import PopupNavigator from './PopupNavigator';
import IFrameNavigator from './IFrameNavigator';


export default class UserManager extends OidcClient {
    constructor(settings, {
        redirectNavigator = new RedirectNavigator(),
        popupNavigator = new PopupNavigator(),
        iframeNavigator = new IFrameNavigator(),
        userStore = new WebStorageStateStore({ store: Global.sessionStorage })
    } = {}) {
        if (!(settings instanceof UserManagerSettings)) {
            settings = new UserManagerSettings(settings);
        }
        super(settings, arguments[1]);

        this._redirectNavigator = redirectNavigator;
        this._popupNavigator = popupNavigator;
        this._iframeNavigator = iframeNavigator;

        this._userStore = userStore;
    }

    get user() {
        return this._user;
    }

    getUser(data) {
        Log.info("UserManager.getUser");

        if (!this._user) {
            Log.info("no user in-memory");

            return this._loadUser().then(user => {
                this._user = user;
                return user;
            });
        }

        if (this._user && !this._user.expired) {
            Log.info("user is in-memory and not expired");
            return Promise.resolve(this._user);
        }

        Log.info("no user");
        return Promise.resolve(null);
    }

    signinPopup(data) {
        Log.info("UserManager.signinPopup");

        let url = this.settings.popup_redirect_uri || this.settings.redirect_uri;
        if (!url) {
            Log.error("No popup_redirect_uri or redirect_uri configured");
            return Promise.reject(new Error("No popup_redirect_uri or redirect_uri configured"));
        }

        let args = {
            data: data,
            redirect_uri: url,
            display: "popup"
        };

        return this._signin(args, this._popupNavigator, { startUrl: url });
    }
    signinPopupCallback(url) {
        Log.info("UserManager.signinPopupCallback");
        return this._signinCallback(url, this._popupNavigator);
    }

    signinSilent(data) {
        Log.info("UserManager.signinSilent");

        if (!this.settings.silent_redirect_uri) {
            Log.error("No silent_redirect_uri configured");
            return Promise.reject(new Error("No silent_redirect_uri configured"));
        }

        var args = {
            data: data,
            redirect_uri: this.settings.silent_redirect_uri,
            prompt: "none"
        };
        return this._signin(args, this._iframeNavigator);
    }
    signinSilentCallback(url) {
        Log.info("UserManager.signinSilentCallback");
        return this._signinCallback(url, this._iframeNavigator);
    }

    _signin(args, navigator, navigatorParams = {}) {
        Log.info("_signin");
        return this._signinStart(args, navigator, navigatorParams).then(navResponse => {
            return this._signinEnd(navResponse.url);
        });
    }
    _signinCallback(url, navigator) {
        Log.info("_signinCallback");
        return navigator.callback(url);
    }

    signinRedirect(data) {
        Log.info("UserManager.signinRedirect");
        return this._signinStart({ data: data }, this._redirectNavigator);
    }
    signinRedirectCallback(url) {
        Log.info("UserManager.signinRedirectCallback");
        return this._signinEnd(url || this._redirectNavigator.url);
    }

    _signinStart(args, navigator, navigatorParams = {}) {
        Log.info("_signinStart");
        
        return navigator.prepare().then(handle => {
            Log.info("got navigator window handle");
            
            return this.createSigninRequest(args).then(signinRequest => {
                Log.info("got signin request");
        
                navigatorParams.url = signinRequest.url;
                return handle.navigate(navigatorParams);
            });
        });
    }
    _signinEnd(url) {
        Log.info("_signinEnd");
        
        return this.processSigninResponse(url).then(signinResponse => {
            Log.info("got signin response");

            let user = new User(signinResponse);
            
            return this._storeUser(user).then(() => {
                Log.info("user stored");

                this._user = user;

                return user;
            });
        });
    }

    // signout(data) {
    //     Log.info("UserManager.signout");

    //     var id_token = this._user && this._user.id_token;
    //     this._user = null;

    //     return this._storeUser(null).then(() => {
    //         Log.info("user removed from storage");

    //         return this.createSignoutRequest({ data: data, id_token_hint: id_token }).then(signoutRequest => {
    //             Log.info("got signout request");

    //             return this._navigator.navigate(signoutRequest.url).then(navigateResponse => {
    //                 Log.info("got navigate response");

    //                 return this.processSignoutResponse(navigateResponse.url);
    //             });
    //         });
    //     });
    // }

    get _userStoreKey() {
        return `user:${this.settings.authority}:${this.settings.client_id}`;
    }

    _loadUser() {
        Log.info("_loadUser");

        return this._userStore.get(this._userStoreKey).then(storageString => {
            if (storageString) {
                Log.info("user storageString loaded");
                return User.fromStorageString(storageString);
            }

            Log.info("no user storageString");
            return null;
        });
    }

    _storeUser(user) {
        if (user) {
            Log.info("_storeUser storing user");

            var storageString = user.toStorageString();
            return this._userStore.set(this._userStoreKey, storageString);
        }
        else {
            Log.info("_storeUser removing user storage");
            return this._userStore.remove(this._userStoreKey);
        }
    }
}
