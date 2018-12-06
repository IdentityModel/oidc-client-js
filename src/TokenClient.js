// Copyright (c) Brock Allen & Dominick Baier. All rights reserved.
// Licensed under the Apache License, Version 2.0. See LICENSE in the project root for license information.

import { JsonService } from './JsonService';
import { MetadataService } from './MetadataService';
import { Log } from './Log';

export class TokenClient {
    constructor(settings, JsonServiceCtor = JsonService, MetadataServiceCtor = MetadataService) {
        if (!settings) {
            Log.error("TokenClient.ctor: No settings passed");
            throw new Error("settings");
        }

        this._settings = settings;
        this._jsonService = new JsonServiceCtor();
        this._metadataService = new MetadataServiceCtor(this._settings);
    }

    exchangeCode(args = {}) {
        args.grant_type = args.grant_type || "authorization_code";

        if (!args.code) {
            Log.error("TokenClient.exchangeCode: No code passed");
            return Promise.reject(new Error("A code is required"));
        }
        if (!args.redirect_uri) {
            Log.error("TokenClient.exchangeCode: No redirect_uri passed");
            return Promise.reject(new Error("A redirect_uri is required"));
        }
        if (!args.code_verifier) {
            Log.error("TokenClient.exchangeCode: No code_verifier passed");
            return Promise.reject(new Error("A code_verifier is required"));
        }
        if (!args.client_id) {
            Log.error("TokenClient.exchangeCode: No client_id passed");
            return Promise.reject(new Error("A client_id is required"));
        }

        return this._metadataService.getTokenEndpoint(false).then(url => {
            Log.debug("TokenClient.exchangeCode: Received token endpoint");

            return this._jsonService.postForm(url, args).then(response => {
                Log.debug("TokenClient.exchangeCode: response received", response);
                return response;
            });
        });
    }
}
