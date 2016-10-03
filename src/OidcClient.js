// Copyright (c) Brock Allen & Dominick Baier. All rights reserved.
// Licensed under the Apache License, Version 2.0. See LICENSE in the project root for license information.

import Log from './Log';
import OidcClientSettings from './OidcClientSettings';
import ErrorResponse from './ErrorResponse';
import SigninRequest from './SigninRequest';
import SigninResponse from './SigninResponse';
import SignoutRequest from './SignoutRequest';
import SignoutResponse from './SignoutResponse';
import SigninState from './SigninState';
import State from './State';

export default class OidcClient {
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
        // data was meant to be the place a caller could indiate the data to 
        // have round tripped, but people were getting confused, so i added state (since that matches the spec) 
        // and so now if data is not passed, but state is then state will be used
        data, state,
        prompt, display, max_age, ui_locales, id_token_hint, login_hint, acr_values, resource} = {},
        stateStore
    ) {
        Log.info("OidcClient.createSigninRequest");

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
        
        let authority = this._settings.authority;

        return this._metadataService.getAuthorizationEndpoint().then(url => {
            Log.info("Received authorization endpoint", url);

            let request = new SigninRequest({
                url,
                client_id,
                redirect_uri,
                response_type,
                scope,
                data: data || state,
                authority,
                prompt, display, max_age, ui_locales, id_token_hint, login_hint, acr_values, resource
            });

            var signinState = request.state;
            stateStore = stateStore || this._stateStore;

            return stateStore.set(signinState.id, signinState.toStorageString()).then(() => {
                return request;
            });
        });
    }

    processSigninResponse(url, stateStore) {
        Log.info("OidcClient.processSigninResponse");

        var response = new SigninResponse(url);

        if (!response.state) {
            Log.error("No state in response");
            return Promise.reject(new Error("No state in response"));
        }

        stateStore = stateStore || this._stateStore;

        return stateStore.remove(response.state).then(storedStateString => {
            if (!storedStateString) {
                Log.error("No matching state found in storage");
                throw new Error("No matching state found in storage");
            }

            let state = SigninState.fromStorageString(storedStateString);

            Log.info("Received state from storage; validating response");
            return this._validator.validateSigninResponse(state, response);
        });
    }

    createSignoutRequest({id_token_hint, data, state, post_logout_redirect_uri} = {},
        stateStore
    ) {
        Log.info("OidcClient.createSignoutRequest");

        post_logout_redirect_uri = post_logout_redirect_uri || this._settings.post_logout_redirect_uri;

        return this._metadataService.getEndSessionEndpoint().then(url => {
            if (!url) {
                Log.error("No end session endpoint url returned");
                throw new Error("no end session endpoint");
            }

            Log.info("Received end session endpoint", url);

            let request = new SignoutRequest({
                url,
                id_token_hint,
                post_logout_redirect_uri,
                data: data || state
            });

            var signoutState = request.state;
            if (signoutState) {
                Log.info("Signout request has state to persist");

                stateStore = stateStore || this._stateStore;
                stateStore.set(signoutState.id, signoutState.toStorageString());
            }

            return request;
        });
    }

    processSignoutResponse(url, stateStore) {
        Log.info("OidcClient.processSignoutResponse");

        var response = new SignoutResponse(url);
        if (!response.state) {
            Log.info("No state in response");

            if (response.error) {
                Log.warn("Response was error", response.error);
                return Promise.reject(new ErrorResponse(response));
            }

            return Promise.resolve(response);
        }

        var stateKey = response.state;

        stateStore = stateStore || this._stateStore;

        return stateStore.remove(stateKey).then(storedStateString => {
            if (!storedStateString) {
                Log.error("No matching state found in storage");
                throw new Error("No matching state found in storage");
            }

            let state = State.fromStorageString(storedStateString);

            Log.info("Received state from storage; validating response");
            return this._validator.validateSignoutResponse(state, response);
        });
    }

    clearStaleState(stateStore) {
        Log.info("OidcClient.clearStaleState");

        stateStore = stateStore || this._stateStore;

        return State.clearStaleState(stateStore, this.settings.staleStateAge);
    }
}
