// Copyright (c) Brock Allen & Dominick Baier. All rights reserved.
// Licensed under the Apache License, Version 2.0. See LICENSE in the project root for license information.

import Log from './Log';
import AccessTokenEvents from './AccessTokenEvents';
import Event from './Event';

export default class UserManagerEvents extends AccessTokenEvents {

    constructor(settings) {
        super(settings);
        this._silentRenewError = new Event();
    }

    init(user) {
        super.init(user);
    }

    cancel() {
        super.cancel();
    }
    
    addSilentRenewError(cb) {
        this._silentRenewError.addHandler(cb);
    }
    removeSilentRenewError(cb) {
        this._silentRenewError.removeHandler(cb);
    }
    _raiseSilentRenewError(e) {
        this._silentRenewError.raise(e);
    }
}
