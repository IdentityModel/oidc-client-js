// Copyright (c) Brock Allen & Dominick Baier. All rights reserved.
// Licensed under the Apache License, Version 2.0. See LICENSE in the project root for license information.

import Log from "./Log";

export default class User {
    constructor({id_token, session_state, access_token, token_type, scope, profile, expires_at, state}) {
        this.id_token = id_token;
        this.session_state = session_state;
        this.access_token = access_token;
        this.token_type = token_type;
        this.scope = scope;
        this.profile = profile;
        this.expires_at = expires_at;
        this.state = state;
    }

    public id_token: string;
    private session_state: string;
    private access_token: string;
    private token_type: string;
    private scope: string;
    private profile: string;
    private expires_at: number;
    private state: string;


    get expires_in() {
        if (this.expires_at) {
            return this.expires_at - (Date.now() / 1000);
        }
        return undefined;
    }

    get expired() {
        let expires_in = this.expires_in;
        if (expires_in !== undefined) {
            return expires_in <= 0;
        }
        return undefined;
    }

    get scopes() {
        return (this.scope || "").split(" ");
    }

    toStorageString() {
        Log.info("User.toStorageString");
        return JSON.stringify({
            id_token: this.id_token,
            session_state: this.session_state,
            access_token: this.access_token,
            token_type: this.token_type,
            scope: this.scope,
            profile: this.profile,
            expires_at: this.expires_at
        });
    }

    static fromStorageString(storageString) {
        Log.info("User.fromStorageString");
        return new User(JSON.parse(storageString));
    }
}