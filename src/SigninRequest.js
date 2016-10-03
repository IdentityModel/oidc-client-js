// Copyright (c) Brock Allen & Dominick Baier. All rights reserved.
// Licensed under the Apache License, Version 2.0. See LICENSE in the project root for license information.

import Log from './Log';
import UrlUtility from './UrlUtility';
import SigninState from './SigninState';

export default class SigninRequest {
    constructor({
        // mandatory
        url, client_id, redirect_uri, response_type, scope, authority,
        // optional
        data, prompt, display, max_age, ui_locales, id_token_hint, login_hint, acr_values, resource
    }) {
        if (!url) {
            Log.error("No url passed to SigninRequest");
            throw new Error("url");
        }
        if (!client_id) {
            Log.error("No client_id passed to SigninRequest");
            throw new Error("client_id");
        }
        if (!redirect_uri) {
            Log.error("No redirect_uri passed to SigninRequest");
            throw new Error("redirect_uri");
        }
        if (!response_type) {
            Log.error("No response_type passed to SigninRequest");
            throw new Error("response_type");
        }
        if (!scope) {
            Log.error("No scope passed to SigninRequest");
            throw new Error("scope");
        }
        if (!authority) {
            Log.error("No authority passed to SigninRequest");
            throw new Error("authority");
        }

        let oidc = SigninRequest.isOidc(response_type);
        this.state = new SigninState({ nonce: oidc, data, client_id, authority });

        url = UrlUtility.addQueryParam(url, "client_id", client_id);
        url = UrlUtility.addQueryParam(url, "redirect_uri", redirect_uri);
        url = UrlUtility.addQueryParam(url, "response_type", response_type);
        url = UrlUtility.addQueryParam(url, "scope", scope);
        
        url = UrlUtility.addQueryParam(url, "state", this.state.id);
        if (oidc) {
            url = UrlUtility.addQueryParam(url, "nonce", this.state.nonce);
        }

        var optional = { prompt, display, max_age, ui_locales, id_token_hint, login_hint, acr_values, resource };
        for(let key in optional){
            if (optional[key]) {
                url = UrlUtility.addQueryParam(url, key, optional[key]);
            }
        }

        this.url = url;
    }

    static isOidc(response_type) {
        var result = response_type.split(/\s+/g).filter(function(item) {
            return item === "id_token";
        });
        return !!(result[0]);
    }
    
    static isOAuth(response_type) {
        var result = response_type.split(/\s+/g).filter(function(item) {
            return item === "token";
        });
        return !!(result[0]);
    }
}