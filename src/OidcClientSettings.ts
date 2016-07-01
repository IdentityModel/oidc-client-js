// Copyright (c) Brock Allen & Dominick Baier. All rights reserved.
// Licensed under the Apache License, Version 2.0. See LICENSE in the project root for license information.

import Log from "./Log";
import WebStorageStateStore from "./WebStorageStateStore";
import ResponseValidator from "./ResponseValidator";
import MetadataService from "./MetadataService";

const OidcMetadataUrlPath = ".well-known/openid-configuration";

const DefaultResponseType = "id_token";
const DefaultScope = "openid";
const DefaultStaleStateAge = 60; // seconds
const DefaultClockSkewInSeconds = 60 * 5;

export default class OidcClientSettings {
    constructor({
        // metadata related
        authority = "", metadataUrl = "", metadata = "", signingKeys = "",
        // client related
        client_id = "", response_type = DefaultResponseType, scope = DefaultScope,
        redirect_uri = "", post_logout_redirect_uri = "",
        // optional protocol
        prompt = "", display = "", max_age = "", ui_locales = "", acr_values = "",
        // behavior flags
        filterProtocolClaims = true, loadUserInfo = true,
        staleStateAge = DefaultStaleStateAge, clockSkew = DefaultClockSkewInSeconds,
        // other behavior
        stateStore = new WebStorageStateStore(),
        ResponseValidatorCtor = ResponseValidator,
        MetadataServiceCtor = MetadataService
    } = {}) {

        this._authority = authority;
        this._metadataUrl = metadataUrl;
        this._metadata = metadata;
        this._signingKeys = signingKeys;

        this._client_id = client_id;
        this._response_type = response_type;
        this._scope = scope;
        this._redirect_uri = redirect_uri;
        this._post_logout_redirect_uri = post_logout_redirect_uri;

        this._prompt = prompt;
        this._display = display;
        this._max_age = max_age;
        this._ui_locales = ui_locales;
        this._acr_values = acr_values;

        this._filterProtocolClaims = !!filterProtocolClaims;
        this._loadUserInfo = !!loadUserInfo;
        this._staleStateAge = staleStateAge;
        this._clockSkew = clockSkew;

        this._stateStore = stateStore;
        this._validator = new ResponseValidatorCtor(this);
        this._metadataService = new MetadataServiceCtor(this);
    }

    private _authority: string;
    private _metadataUrl: string;
    private _metadata;
    private _signingKeys;

    private _client_id: string;
    private _response_type: string;
    private _scope: string;
    private _redirect_uri: string;
    private _post_logout_redirect_uri: string;

    private _prompt: string;
    private _display;
    private _max_age;
    private _ui_locales;
    private _acr_values;

    private _filterProtocolClaims;
    private _loadUserInfo;
    private _staleStateAge;
    private _clockSkew;

    private _stateStore;
    private _validator;
    private _metadataService;


    // client config
    get client_id(): any {
        return this._client_id;
    }

    set client_id(value: any) {
        if (!this._client_id) {
            // one-time set only
            this._client_id = value;
        }
        else {
            Log.error("client_id has already been assigned.");
            throw new Error("client_id has already been assigned.");
        }
    }
    get response_type(): any {
        return this._response_type;
    }
    get scope(): string {
        return this._scope;
    }
    get redirect_uri(): string {
        return this._redirect_uri;
    }
    get post_logout_redirect_uri(): string {
        return this._post_logout_redirect_uri;
    }


    // optional protocol params
    get prompt(): string {
        return this._prompt;
    }
    get display() {
        return this._display;
    }
    get max_age() {
        return this._max_age;
    }
    get ui_locales() {
        return this._ui_locales;
    }
    get acr_values() {
        return this._acr_values;
    }


    // metadata
    get authority(): string {
        return this._authority;
    }
    set authority(value: string) {
        if (!this._authority) {
            // one-time set only
            this._authority = value;
        }
        else {
            Log.error("authority has already been assigned.");
            throw new Error("authority has already been assigned.");
        }
    }
    get metadataUrl(): string {
        if (!this._metadataUrl) {
            this._metadataUrl = this.authority;

            if (this._metadataUrl && this._metadataUrl.indexOf(OidcMetadataUrlPath) < 0) {
                if (this._metadataUrl[this._metadataUrl.length - 1] !== "/") {
                    this._metadataUrl += "/";
                }
                this._metadataUrl += OidcMetadataUrlPath;
            }
        }

        return this._metadataUrl;
    }

    // settable/cachable metadata values
    get metadata() {
        return this._metadata;
    }
    set metadata(value) {
        this._metadata = value;
    }

    get signingKeys() {
        return this._signingKeys;
    }
    set signingKeys(value) {
        this._signingKeys = value;
    }

    // behavior flags
    get filterProtocolClaims() {
        return this._filterProtocolClaims;
    }
    get loadUserInfo() {
        return this._loadUserInfo;
    }
    get staleStateAge() {
        return this._staleStateAge;
    }
    get clockSkew() {
        return this._clockSkew;
    }

    get stateStore() {
        return this._stateStore;
    }
    get validator() {
        return this._validator;
    }
    get metadataService() {
        return this._metadataService;
    }
}
