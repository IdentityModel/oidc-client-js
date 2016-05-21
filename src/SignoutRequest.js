// Copyright (c) Brock Allen & Dominick Baier. All rights reserved.
// Licensed under the Apache License, Version 2.0. See LICENSE in the project root for license information.

import Log from './Log';
import UrlUtility from './UrlUtility';
import State from './State';

export default class SignoutRequest {
    constructor({url, id_token_hint, post_logout_redirect_uri, data}) {
        if (!url) {
            Log.error("No url passed to SignoutRequest");
            throw new Error("url");
        }

        if (id_token_hint) {
            url = UrlUtility.addQueryParam(url, "id_token_hint", id_token_hint);
            
            if (post_logout_redirect_uri) {
                url = UrlUtility.addQueryParam(url, "post_logout_redirect_uri", post_logout_redirect_uri);
                
                if (data) {
                    this.state = new State({ data });
                    
                    url = UrlUtility.addQueryParam(url, "state", this.state.id);
                }
            }
        }
        
        this.url = url;
    }
}
