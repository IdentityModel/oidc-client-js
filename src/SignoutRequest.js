// Copyright (c) Brock Allen & Dominick Baier. All rights reserved.
// Licensed under the Apache License, Version 2.0. See LICENSE in the project root for license information.

import { Log } from './Log.js';
import { UrlUtility } from './UrlUtility.js';
import { State } from './State.js';

export class SignoutRequest {
    constructor({url, id_token_hint, post_logout_redirect_uri, data, extraQueryParams, request_type}) {
        if (!url) {
            Log.error("SignoutRequest.ctor: No url passed");
            throw new Error("url");
        }

        if (id_token_hint) {
            url = UrlUtility.addQueryParam(url, "id_token_hint", id_token_hint);
        }

        if (post_logout_redirect_uri) {
            url = UrlUtility.addQueryParam(url, "post_logout_redirect_uri", post_logout_redirect_uri);

            if (data) {
                this.state = new State({ data, request_type });

                url = UrlUtility.addQueryParam(url, "state", this.state.id);
            }
        }

        for(let key in extraQueryParams){
            url = UrlUtility.addQueryParam(url, key, extraQueryParams[key])
        }

        this.url = url;
    }
}
