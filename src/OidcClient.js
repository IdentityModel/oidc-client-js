// Copyright (c) Brock Allen & Dominick Baier. All rights reserved.
// Licensed under the Apache License, Version 2.0. See LICENSE in the project root for license information.

import { Log } from './Log.js';
import { OidcClientSettings } from './OidcClientSettings.js';
import { ErrorResponse } from './ErrorResponse.js';
import { SigninRequest } from './SigninRequest.js';
import { SigninResponse } from './SigninResponse.js';
import { SignoutRequest } from './SignoutRequest.js';
import { SignoutResponse } from './SignoutResponse.js';
import { SigninState } from './SigninState.js';
import { State } from './State.js';

export class OidcClient {
    constructor(settings = {}) {
        if (settings instanceof OidcClientSettings) {
            this._settings = settings;
        }
        else {
            this._settings = new OidcClientSettings(settings);
        }
    }

    get _stateStore() {
        return this.settings.stateStore;
    }
    get _validator() {
        return this.settings.validator;
    }
    get _metadataService() {
        return this.settings.metadataService;
    }

    get settings() {
        return this._settings;
    }
    get metadataService() {
        return this._metadataService;
    }

    createSigninRequest({
        response_type, scope, redirect_uri,
        // data was meant to be the place a caller could indicate the data to
        // have round tripped, but people were getting confused, so i added state (since that matches the spec)
        // and so now if data is not passed, but state is then state will be used
        data, state, prompt, display, max_age, ui_locales, id_token_hint, login_hint, acr_values,
        resource, request, request_uri, response_mode, extraQueryParams, extraTokenParams, request_type, skipUserInfo } = {},
        stateStore
    ) {
        Log.debug("OidcClient.createSigninRequest");

        let client_id = this._settings.client_id;
        response_type = response_type || this._settings.response_type;
        scope = scope || this._settings.scope;
        redirect_uri = redirect_uri || this._settings.redirect_uri;

        // id_token_hint, login_hint aren't allowed on _settings
        prompt = prompt || this._settings.prompt;
        display = display || this._settings.display;
        max_age = max_age || this._settings.max_age;
        ui_locales = ui_locales || this._settings.ui_locales;
        acr_values = acr_values || this._settings.acr_values;
        resource = resource || this._settings.resource;
        response_mode = response_mode || this._settings.response_mode;
        extraQueryParams = extraQueryParams || this._settings.extraQueryParams;
        extraTokenParams = extraTokenParams || this._settings.extraTokenParams;

        let authority = this._settings.authority;

        if (SigninRequest.isCode(response_type) && response_type !== "code") {
            return Promise.reject(new Error("OpenID Connect hybrid flow is not supported"));
        }

        return this._metadataService.getAuthorizationEndpoint().then(url => {
            Log.debug("OidcClient.createSigninRequest: Received authorization endpoint", url);

            let signinRequest = new SigninRequest({
                url,
                client_id,
                redirect_uri,
                response_type,
                scope,
                data: data || state,
                authority,
                prompt, display, max_age, ui_locales, id_token_hint, login_hint, acr_values,
                resource, request, request_uri, extraQueryParams, extraTokenParams, request_type, response_mode,
                client_secret: this._settings.client_secret,
                skipUserInfo
            });

            var signinState = signinRequest.state;
            stateStore = stateStore || this._stateStore;

            return stateStore.set(signinState.id, signinState.toStorageString()).then(() => {
                return signinRequest;
            });
        });
    }

    readSigninResponseState(url, stateStore, removeState = false) {
        Log.debug("OidcClient.readSigninResponseState");

        let useQuery = this._settings.response_mode === "query" || 
            (!this._settings.response_mode && SigninRequest.isCode(this._settings.response_type));
        let delimiter = useQuery ? "?" : "#";

        var response = new SigninResponse(url, delimiter);

        if (!response.state) {
            Log.error("OidcClient.readSigninResponseState: No state in response");
            return Promise.reject(new Error("No state in response"));
        }

        stateStore = stateStore || this._stateStore;

        var stateApi = removeState ? stateStore.remove.bind(stateStore) : stateStore.get.bind(stateStore);

        return stateApi(response.state).then(storedStateString => {
            if (!storedStateString) {
                Log.error("OidcClient.readSigninResponseState: No matching state found in storage");
                throw new Error("No matching state found in storage");
            }

            let state = SigninState.fromStorageString(storedStateString);
            return {state, response};
        });
    }

    processSigninResponse(url, stateStore) {
        Log.debug("OidcClient.processSigninResponse");

        return this.readSigninResponseState(url, stateStore, true).then(({state, response}) => {
            Log.debug("OidcClient.processSigninResponse: Received state from storage; validating response");
            return this._validator.validateSigninResponse(state, response);
        });
    }

    createSignoutRequest({id_token_hint, data, state, post_logout_redirect_uri, extraQueryParams, request_type } = {},
        stateStore
    ) {
        Log.debug("OidcClient.createSignoutRequest");

        post_logout_redirect_uri = post_logout_redirect_uri || this._settings.post_logout_redirect_uri;
        extraQueryParams = extraQueryParams || this._settings.extraQueryParams;

        return this._metadataService.getEndSessionEndpoint().then(url => {
            if (!url) {
                Log.error("OidcClient.createSignoutRequest: No end session endpoint url returned");
                throw new Error("no end session endpoint");
            }

            Log.debug("OidcClient.createSignoutRequest: Received end session endpoint", url);

            let request = new SignoutRequest({
                url,
                id_token_hint,
                post_logout_redirect_uri,
                data: data || state,
                extraQueryParams,
                request_type
            });

            var signoutState = request.state;
            if (signoutState) {
                Log.debug("OidcClient.createSignoutRequest: Signout request has state to persist");

                stateStore = stateStore || this._stateStore;
                stateStore.set(signoutState.id, signoutState.toStorageString());
            }

            return request;
        });
    }

    readSignoutResponseState(url, stateStore, removeState = false) {
        Log.debug("OidcClient.readSignoutResponseState");

        var response = new SignoutResponse(url);
        if (!response.state) {
            Log.debug("OidcClient.readSignoutResponseState: No state in response");

            if (response.error) {
                Log.warn("OidcClient.readSignoutResponseState: Response was error: ", response.error);
                return Promise.reject(new ErrorResponse(response));
            }

            return Promise.resolve({state: undefined, response});
        }

        var stateKey = response.state;

        stateStore = stateStore || this._stateStore;

        var stateApi = removeState ? stateStore.remove.bind(stateStore) : stateStore.get.bind(stateStore);
        return stateApi(stateKey).then(storedStateString => {
            if (!storedStateString) {
                Log.error("OidcClient.readSignoutResponseState: No matching state found in storage");
                throw new Error("No matching state found in storage");
            }

            let state = State.fromStorageString(storedStateString);

            return {state, response};
        });
    }

    processSignoutResponse(url, stateStore) {
        Log.debug("OidcClient.processSignoutResponse");

        return this.readSignoutResponseState(url, stateStore, true).then(({state, response}) => {
            if (state) {
                Log.debug("OidcClient.processSignoutResponse: Received state from storage; validating response");
                return this._validator.validateSignoutResponse(state, response);
            }
            else {
                Log.debug("OidcClient.processSignoutResponse: No state from storage; skipping validating response");
                return response;
            }
        });
    }

    clearStaleState(stateStore) {
        Log.debug("OidcClient.clearStaleState");

        stateStore = stateStore || this._stateStore;

        return State.clearStaleState(stateStore, this.settings.staleStateAge);
    }
}
