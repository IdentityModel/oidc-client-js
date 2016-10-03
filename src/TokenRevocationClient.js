// Copyright (c) Brock Allen & Dominick Baier. All rights reserved.
// Licensed under the Apache License, Version 2.0. See LICENSE in the project root for license information.

import Log from './Log';
import Global from './Global';

const AccessTokenTypeHint = "access_token";

export default class TokenRevocationClient {
    constructor(url, XMLHttpRequestCtor = Global.XMLHttpRequest) {
        this._url = url;
        this._XMLHttpRequestCtor = XMLHttpRequestCtor;
    }

    revoke(accessToken) {
        Log.info("TokenRevocationClient.revoke");

        return new Promise((resolve, reject) => {

            var xhr = new this._XMLHttpRequestCtor();
            xhr.open("POST", this._url);
            
            xhr.onload = () => {
                Log.info("HTTP response received, status", xhr.status);
                
                if (xhr.status === 200) {
                    resolve();
                }
                else {
                    reject(Error(xhr.statusText + " (" + xhr.status + ")"));
                }
            };

            var body = "token_type_hint=" + encodeURIComponent(AccessTokenTypeHint);
            body += "&token=" + encodeURIComponent(accessToken);
            
            xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
            xhr.send(body);
        });
    }
}
