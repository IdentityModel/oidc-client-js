// Copyright (c) Brock Allen & Dominick Baier. All rights reserved.
// Licensed under the Apache License, Version 2.0. See LICENSE in the project root for license information.

import Log from './Log';
import Global from './Global';

const AccessTokenTypeHint = "access_token";

export default class TokenRevocationClient {
    constructor({url, client_id}, XMLHttpRequestCtor = Global.XMLHttpRequest) {
        if (!url) {
            Log.error("No url provided");
            throw new Error("No url provided.");
        }
        if (!client_id) {
            Log.error("No client_id provided");
            throw new Error("No client_id provided.");
        }
        
        this._client_id = client_id;
        this._url = url;
        this._XMLHttpRequestCtor = XMLHttpRequestCtor;
    }

    revoke(accessToken) {
        Log.info("TokenRevocationClient.revoke");

        if (!accessToken) {
            Log.error("No accessToken provided");
            throw new Error("No accessToken provided.");
        }

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

            var body = "client_id=" + encodeURIComponent(this._client_id); 
            body += "&token_type_hint=" + encodeURIComponent(AccessTokenTypeHint);
            body += "&token=" + encodeURIComponent(accessToken);
            
            xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
            xhr.send(body);
        });
    }
}
