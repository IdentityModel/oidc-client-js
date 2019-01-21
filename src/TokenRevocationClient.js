// Copyright (c) Brock Allen & Dominick Baier. All rights reserved.
// Licensed under the Apache License, Version 2.0. See LICENSE in the project root for license information.

import { Log } from './Log.js';
import { MetadataService } from './MetadataService.js';
import { Global } from './Global.js';

const AccessTokenTypeHint = "access_token";
const RefreshTokenTypeHint = "refresh_token";

export class TokenRevocationClient {
    constructor(settings, XMLHttpRequestCtor = Global.XMLHttpRequest, MetadataServiceCtor = MetadataService) {
        if (!settings) {
            Log.error("TokenRevocationClient.ctor: No settings provided");
            throw new Error("No settings provided.");
        }

        this._settings = settings;
        this._XMLHttpRequestCtor = XMLHttpRequestCtor;
        this._metadataService = new MetadataServiceCtor(this._settings);
    }

    revoke(token, required, type = "access_token") {
        if (!token) {
            Log.error("TokenRevocationClient.revoke: No token provided");
            throw new Error("No token provided.");
        }

        if (type !== AccessTokenTypeHint && type != RefreshTokenTypeHint) {
            Log.error("TokenRevocationClient.revoke: Invalid token type");
            throw new Error("Invalid token type.");
        }

        return this._metadataService.getRevocationEndpoint().then(url => {
            if (!url) {
                if (required) {
                    Log.error("TokenRevocationClient.revoke: Revocation not supported");
                    throw new Error("Revocation not supported");
                }

                // not required, so don't error and just return
                return;
            }

            Log.debug("TokenRevocationClient.revoke: Revoking " + type);
            var client_id = this._settings.client_id;
            var client_secret = this._settings.client_secret;
            return this._revoke(url, client_id, client_secret, token, type);
        });
    }

    _revoke(url, client_id, client_secret, token, type) {

        return new Promise((resolve, reject) => {

            var xhr = new this._XMLHttpRequestCtor();
            xhr.open("POST", url);

            xhr.onload = () => {
                Log.debug("TokenRevocationClient.revoke: HTTP response received, status", xhr.status);

                if (xhr.status === 200) {
                    resolve();
                }
                else {
                    reject(Error(xhr.statusText + " (" + xhr.status + ")"));
                }
            };
            xhr.onerror = () => { 
                Log.debug("TokenRevocationClient.revoke: Network Error.")
                reject("Network Error");
            };

            var body = "client_id=" + encodeURIComponent(client_id);
            if (client_secret) {
                body += "&client_secret=" + encodeURIComponent(client_secret);
            }
            body += "&token_type_hint=" + encodeURIComponent(type);
            body += "&token=" + encodeURIComponent(token);

            xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
            xhr.send(body);
        });
    }
}
