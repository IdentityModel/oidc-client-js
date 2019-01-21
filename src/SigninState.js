// Copyright (c) Brock Allen & Dominick Baier. All rights reserved.
// Licensed under the Apache License, Version 2.0. See LICENSE in the project root for license information.

import { Log } from './Log.js';
import { State } from './State.js';
import { JoseUtil } from './JoseUtil.js';
import random from './random.js';

export class SigninState extends State {
    constructor({nonce, authority, client_id, redirect_uri, code_verifier} = {}) {
        super(arguments[0]);

        if (nonce === true) {
            this._nonce = random();
        }
        else if (nonce) {
            this._nonce = nonce;
        }

        if (code_verifier === true) {
            // random() produces 32 length
            this._code_verifier = random() + random() + random();
        }
        else if (code_verifier) {
            this._code_verifier = code_verifier;
        }
        
        if (this.code_verifier) {
            let hash = JoseUtil.hashString(this.code_verifier, "SHA256");
            this._code_challenge = JoseUtil.hexToBase64Url(hash);
        }

        this._redirect_uri = redirect_uri;
        this._authority = authority;
        this._client_id = client_id;
    }

    get nonce() {
        return this._nonce;
    }
    get authority() {
        return this._authority;
    }
    get client_id() {
        return this._client_id;
    }
    get redirect_uri() {
        return this._redirect_uri;
    }
    get code_verifier() {
        return this._code_verifier;
    }
    get code_challenge() {
        return this._code_challenge;
    }

    toStorageString() {
        Log.debug("SigninState.toStorageString");
        return JSON.stringify({
            id: this.id,
            data: this.data,
            created: this.created,
            nonce: this.nonce,
            code_verifier: this.code_verifier,
            redirect_uri: this.redirect_uri,
            authority: this.authority,
            client_id: this.client_id
        });
    }

    static fromStorageString(storageString) {
        Log.debug("SigninState.fromStorageString");
        var data = JSON.parse(storageString);
        return new SigninState(data);
    }
}
