// Copyright (c) Brock Allen & Dominick Baier. All rights reserved.
// Licensed under the Apache License, Version 2.0. See LICENSE in the project root for license information.

import Log from './Log';
import MetadataService from './MetadataService';
import Global from './Global';

const AccessTokenTypeHint = "access_token";

export default class TokenRevocationClient {
    constructor(settings, XMLHttpRequestCtor = Global.XMLHttpRequest, MetadataServiceCtor = MetadataService) {
        if (!settings) {
            Log.error("No settings provided");
            throw new Error("No settings provided.");
        }
        
        this._settings = settings;
        this._XMLHttpRequestCtor = XMLHttpRequestCtor;
        this._metadataService = new MetadataServiceCtor(this._settings);
    }

    revoke(accessToken, required) {
        Log.info("TokenRevocationClient.revoke");

        if (!accessToken) {
            Log.error("No accessToken provided");
            throw new Error("No accessToken provided.");
        }

        return this._metadataService.getRevocationEndpoint().then(url => {
            if (!url) {
                if (required) {
                    Log.error("Revocation not supported");
                    throw new Error("Revocation not supported");
                }

                // not required, so don't error and just return
                return;
            }

            var client_id = this._settings.client_id;
            var client_secret = this._settings.client_secret;
            return this._revoke(url, client_id, client_secret, accessToken);
        });
    }

    _revoke(url, client_id, client_secret, accessToken) {
        Log.info("Calling revocation endpoint");

        return new Promise((resolve, reject) => {

            var xhr = new this._XMLHttpRequestCtor();
            xhr.open("POST", url);
            
            xhr.onload = () => {
                Log.info("HTTP response received, status", xhr.status);
                
                if (xhr.status === 200) {
                    resolve();
                }
                else {
                    reject(Error(xhr.statusText + " (" + xhr.status + ")"));
                }
            };

            var body = "client_id=" + encodeURIComponent(client_id); 
            if (client_secret) {
                body += "&client_secret=" + encodeURIComponent(client_secret);
            }
            body += "&token_type_hint=" + encodeURIComponent(AccessTokenTypeHint);
            body += "&token=" + encodeURIComponent(accessToken);
            
            xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
            xhr.send(body);
        });
    }
}
