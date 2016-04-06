// Copyright (c) Brock Allen & Dominick Baier. All rights reserved.
// Licensed under the Apache License, Version 2.0. See LICENSE in the project root for license information.

import Log from './Log';
import OidcClientSettings from './OidcClientSettings';

export default class UserManagerSettings extends OidcClientSettings {
    constructor(args = {
        silent_redirect_uri : undefined,
        enableAutomaticSilentRenew : true
    }) {
        super(args);
        
        this._silent_redirect_uri = args.silent_redirect_uri;
        this._enableAutomaticSilentRenew = !!args.enableAutomaticSilentRenew;
    }

    get silent_redirect_uri() {
        return this._silent_redirect_uri;
    }
    get automaticSilentRenewEnabled() {
        return !!(this.silent_redirect_uri && this._enableAutomaticSilentRenew);
    }
}
