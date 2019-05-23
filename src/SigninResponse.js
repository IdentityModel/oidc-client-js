// Copyright (c) Brock Allen & Dominick Baier. All rights reserved.
// Licensed under the Apache License, Version 2.0. See LICENSE in the project root for license information.

import { UrlUtility } from './UrlUtility.js';

const OidcScope = "openid";

export class SigninResponse {
    constructor(url, delimiter = "#") {

        var values = UrlUtility.parseUrlFragment(url, delimiter);

        this.error = values.error;
        this.error_description = values.error_description;
        this.error_uri = values.error_uri;

        this.code = values.code;
        this.state = values.state;
        this.id_token = values.id_token;
        this.session_state = values.session_state;
        this.access_token = values.access_token;
        this.token_type = values.token_type;
        this.scope = values.scope;
        this.profile = undefined; // will be set from ResponseValidator

        this.expires_in = values.expires_in;
        this.refresh_expires_in = values.refresh_expires_in;
    }

    get expires_in() {
        if (this.expires_at) {
            let now = parseInt(Date.now() / 1000);
            return this.expires_at - now;
        }
        return undefined;
    }
    set expires_in(value){
        let expires_in = parseInt(value);
        if (typeof expires_in === 'number' && expires_in > 0) {
            let now = parseInt(Date.now() / 1000);
            this.expires_at = now + expires_in;
        }
    }

    get expired() {
        let expires_in = this.expires_in;
        if (expires_in !== undefined) {
            return expires_in <= 0;
        }
        return undefined;
    }

    get refresh_expires_in() {
        if (this.refresh_expires_at) {
            let now = parseInt(Date.now() / 1000);
            return this.refresh_expires_at - now;
        }
        return undefined;
    }

    set refresh_expires_in(value) {
        let refresh_expires_in = parseInt(value);
        if (typeof refresh_expires_in === 'number' && refresh_expires_in > 0) {
            let now = parseInt(Date.now() / 1000);
            this.refresh_expires_at = now + refresh_expires_in;
        }
    }

    get refresh_expired() {
        let refresh_expires_in = this.refresh_expires_in;
        if (refresh_expires_in !== undefined) {
            return refresh_expires_in <= 0;
        }
        return undefined;
    }

    get scopes() {
        return (this.scope || "").split(" ");
    }

    get isOpenIdConnect() {
        return this.scopes.indexOf(OidcScope) >= 0 || !!this.id_token;
    }
}
