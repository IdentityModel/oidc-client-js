// Copyright (c) Brock Allen & Dominick Baier. All rights reserved.
// Licensed under the Apache License, Version 2.0. See LICENSE in the project root for license information.

export class StubTokenRevocationClient {
    revoke(accessToken, required) {
        this.accessToken = accessToken;
        if (this.error) {
            return Promise.reject(new Error(this.error));
        }
        return Promise.resolve();
    }
}
