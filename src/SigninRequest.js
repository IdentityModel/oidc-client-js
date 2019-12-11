// Copyright (c) Brock Allen & Dominick Baier. All rights reserved.
// Licensed under the Apache License, Version 2.0. See LICENSE in the project root for license information.

import { Log } from './Log.js';
import { UrlUtility } from './UrlUtility.js';
import { SigninState } from './SigninState.js';

export class SigninRequest {
    constructor({
        // mandatory
        url, client_id, redirect_uri, response_type, scope, authority,
        // optional
        data, prompt, display, max_age, ui_locales, id_token_hint, login_hint, acr_values, resource, response_mode,
        request, request_uri, extraQueryParams, request_type, client_secret, extraTokenParams, skipUserInfo
    }) {
        if (!url) {
            Log.error("SigninRequest.ctor: No url passed");
            throw new Error("url");
        }
        if (!client_id) {
            Log.error("SigninRequest.ctor: No client_id passed");
            throw new Error("client_id");
        }
        if (!redirect_uri) {
            Log.error("SigninRequest.ctor: No redirect_uri passed");
            throw new Error("redirect_uri");
        }
        if (!response_type) {
            Log.error("SigninRequest.ctor: No response_type passed");
            throw new Error("response_type");
        }
        if (!scope) {
            Log.error("SigninRequest.ctor: No scope passed");
            throw new Error("scope");
        }
        if (!authority) {
            Log.error("SigninRequest.ctor: No authority passed");
            throw new Error("authority");
        }

        let oidc = SigninRequest.isOidc(response_type);
        let code = SigninRequest.isCode(response_type);

        if (!response_mode) {
            response_mode = SigninRequest.isCode(response_type) ? "query" : null;
        }

        this.state = new SigninState({ nonce: oidc, 
            data, client_id, authority, redirect_uri, 
            code_verifier: code, 
            request_type, response_mode,
            client_secret, scope, extraTokenParams, skipUserInfo });

        url = UrlUtility.addQueryParam(url, "client_id", client_id);
        url = UrlUtility.addQueryParam(url, "redirect_uri", redirect_uri);
        url = UrlUtility.addQueryParam(url, "response_type", response_type);
        url = UrlUtility.addQueryParam(url, "scope", scope);

        url = UrlUtility.addQueryParam(url, "state", this.state.id);
        if (oidc) {
            url = UrlUtility.addQueryParam(url, "nonce", this.state.nonce);
        }
        if (code) {
            url = UrlUtility.addQueryParam(url, "code_challenge", this.state.code_challenge);
            url = UrlUtility.addQueryParam(url, "code_challenge_method", "S256");
        }

        var optional = { prompt, display, max_age, ui_locales, id_token_hint, login_hint, acr_values, resource, request, request_uri, response_mode };
        for(let key in optional){
            if (optional[key]) {
                url = UrlUtility.addQueryParam(url, key, optional[key]);
            }
        }

        for(let key in extraQueryParams){
            url = UrlUtility.addQueryParam(url, key, extraQueryParams[key])
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
    
    static isCode(response_type) {
        var result = response_type.split(/\s+/g).filter(function(item) {
            return item === "code";
        });
        return !!(result[0]);
    }
}
