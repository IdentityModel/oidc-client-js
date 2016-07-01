// Copyright (c) Brock Allen & Dominick Baier. All rights reserved.
// Licensed under the Apache License, Version 2.0. See LICENSE in the project root for license information.

import UrlUtility from "./UrlUtility";

const OidcScope = "openid";

export default class SigninResponse {
    constructor(url) {

        let values: any = UrlUtility.parseUrlFragment(url, "#");

        this.error = values.error;
        this.error_description = values.error_description;
        this.error_uri = values.error_uri;

        this.state = values.state;
        this.id_token = values.id_token;
        this.session_state = values.session_state;
        this.access_token = values.access_token;
        this.token_type = values.token_type;
        this.scope = values.scope;
        this.profile = undefined; // will be set from ResponseValidator

        let expires_in = parseInt(values.expires_in);
        if (typeof expires_in === "number" && expires_in > 0) {
            this.expires_at = (Date.now() / 1000) + expires_in;
        }
    }

    private error;
    private error_description: string;
    private error_uri: string;

    private state: string;
    private id_token: string;
    private session_state: string;
    private access_token: string;
    private token_type: any;
    private scope: string;
    private profile: any; // will be set from ResponseValidator
    private expires_at: number;


    get expires_in() {
        if (this.expires_at) {
            return this.expires_at - (Date.now() / 1000);
        }
        return undefined;
    }

    get expired() {
        let expires_in = this.expires_in;
        if (expires_in !== undefined) {
            return expires_in <= 0;
        }
        return undefined;
    }

    get scopes() {
        return (this.scope || "").split(" ");
    }

    get isOpenIdConnect() {
        return this.scopes.indexOf(OidcScope) >= 0;
    }
}
