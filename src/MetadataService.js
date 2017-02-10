// Copyright (c) Brock Allen & Dominick Baier. All rights reserved.
// Licensed under the Apache License, Version 2.0. See LICENSE in the project root for license information.

import Log from './Log';
import JsonService from './JsonService';

const OidcMetadataUrlPath = '.well-known/openid-configuration';

export default class MetadataService {
    constructor(settings, JsonServiceCtor = JsonService) {
        if (!settings) {
            Log.error("No settings passed to MetadataService");
            throw new Error("settings");
        }

        this._settings = settings;
        this._jsonService = new JsonServiceCtor();
    }

    get metadataUrl() {
        if (!this._metadataUrl) {
            if (this._settings.metadataUrl) {
                this._metadataUrl = this._settings.metadataUrl;
            }
            else {
                this._metadataUrl = this._settings.authority;

                if (this._metadataUrl && this._metadataUrl.indexOf(OidcMetadataUrlPath) < 0) {
                    if (this._metadataUrl[this._metadataUrl.length - 1] !== '/') {
                        this._metadataUrl += '/';
                    }
                    this._metadataUrl += OidcMetadataUrlPath;
                }
            }
        }

        return this._metadataUrl;
    }

    getMetadata() {
        Log.debug("MetadataService.getMetadata");

        if (this._settings.metadata) {
            Log.debug("Returning metadata from settings");
            return Promise.resolve(this._settings.metadata);
        }

        if (!this.metadataUrl) {
            Log.error("No authority or metadataUrl configured on settings");
            return Promise.reject(new Error("No authority or metadataUrl configured on settings"));
        }

        Log.debug("getting metadata from", this.metadataUrl);

        return this._jsonService.getJson(this.metadataUrl)
            .then(metadata => {
                Log.debug("json received");
                this._settings.metadata = metadata;
                return metadata;
            });
    }
    
    getIssuer() {
        Log.debug("MetadataService.getIssuer");
        return this._getMetadataProperty("issuer");
    }

    getAuthorizationEndpoint() {
        Log.debug("MetadataService.getAuthorizationEndpoint");
        return this._getMetadataProperty("authorization_endpoint");
    }

    getUserInfoEndpoint() {
        Log.debug("MetadataService.getUserInfoEndpoint");
        return this._getMetadataProperty("userinfo_endpoint");
    }

    getTokenEndpoint() {
        Log.debug("MetadataService.getTokenEndpoint");
        return this._getMetadataProperty("token_endpoint", true);
    }
    
    getCheckSessionIframe() {
        Log.debug("MetadataService.getCheckSessionIframe");
        return this._getMetadataProperty("check_session_iframe", true);
    }

    getEndSessionEndpoint() {
        Log.debug("MetadataService.getEndSessionEndpoint");
        return this._getMetadataProperty("end_session_endpoint", true);
    }

    getRevocationEndpoint() {
        Log.debug("MetadataService.getRevocationEndpoint");
        return this._getMetadataProperty("revocation_endpoint", true);
    }

    _getMetadataProperty(name, optional=false) {
        Log.debug("MetadataService._getMetadataProperty", name);

        return this.getMetadata().then(metadata => {
            Log.debug("metadata recieved");

            if (metadata[name] === undefined) {

                if (optional === true) {
                    Log.warn("Metadata does not contain optional property " + name);
                    return undefined;
                }
                else {
                    Log.error("Metadata does not contain property " + name);
                    throw new Error("Metadata does not contain property " + name);
                }
            }

            return metadata[name];
        });
    }

    getSigningKeys() {
        Log.debug("MetadataService.getSigningKeys");

        if (this._settings.signingKeys) {
            Log.debug("Returning signingKeys from settings");
            return Promise.resolve(this._settings.signingKeys);
        }

        return this._getMetadataProperty("jwks_uri").then(jwks_uri => {
            Log.debug("jwks_uri received", jwks_uri);

            return this._jsonService.getJson(jwks_uri).then(keySet => {
                Log.debug("key set received", keySet);

                if (!keySet.keys) {
                    Log.error("Missing keys on keyset");
                    throw new Error("Missing keys on keyset");
                }

                this._settings.signingKeys = keySet.keys;
                return this._settings.signingKeys;
            });
        });
    }
}
