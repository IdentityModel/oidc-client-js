// Copyright (c) Brock Allen & Dominick Baier. All rights reserved.
// Licensed under the Apache License, Version 2.0. See LICENSE in the project root for license information.

import Log from './Log';
import State from './State';
import random from './random';

export default class SigninState extends State {
    constructor({nonce, authority, client_id} = {}) {
        super(arguments[0]);
        
        if (nonce === true) {
            this._nonce = random();
        }
        else if (nonce) {
            this._nonce = nonce;
        }
        
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
    
    toStorageString() {
        Log.info("SigninState.toStorageString");
        return JSON.stringify({
            id: this.id,
            data: this.data,
            created: this.created,
            nonce: this.nonce,
            authority: this.authority,
            client_id: this.client_id
        });
    }

    static fromStorageString(storageString) {
        Log.info("SigninState.fromStorageString");
        var data = JSON.parse(storageString);
        return new SigninState(data);
    }
}
