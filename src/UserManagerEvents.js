// Copyright (c) Brock Allen & Dominick Baier. All rights reserved.
// Licensed under the Apache License, Version 2.0. See LICENSE in the project root for license information.

import Log from './Log';
import AccessTokenEvents from './AccessTokenEvents';
import Event from './Event';

export default class UserManagerEvents extends AccessTokenEvents {

    constructor(settings) {
        super(settings);
        this._userLoaded = new Event("User loaded");
        this._userUnloaded = new Event("User unloaded");
        this._silentRenewError = new Event("Silent renew error");
        this._userSignedOut = new Event("User signed out");
        this._userSessionChanged = new Event("User session changed");
    }

    load(user, raiseEvent=true) {
        Log.info("UserManagerEvents.load");
        super.load(user);
        if (raiseEvent) {
            this._userLoaded.raise(user);
        }
    }
    unload() {
        Log.info("UserManagerEvents.unload");
        super.unload();
        this._userUnloaded.raise();
    }

    addUserLoaded(cb) {
        this._userLoaded.addHandler(cb);
    }
    removeUserLoaded(cb) {
        this._userLoaded.removeHandler(cb);
    }
    
    addUserUnloaded(cb) {
        this._userUnloaded.addHandler(cb);
    }
    removeUserUnloaded(cb) {
        this._userUnloaded.removeHandler(cb);
    }

    addSilentRenewError(cb) {
        this._silentRenewError.addHandler(cb);
    }
    removeSilentRenewError(cb) {
        this._silentRenewError.removeHandler(cb);
    }
    _raiseSilentRenewError(e) {
        Log.info("UserManagerEvents._raiseSilentRenewError", e.message);
        this._silentRenewError.raise(e);
    }

    addUserSignedOut(cb) {
        this._userSignedOut.addHandler(cb);
    }
    removeUserSignedOut(cb) {
        this._userSignedOut.removeHandler(cb);
    }
    _raiseUserSignedOut(e) {
        Log.info("UserManagerEvents._raiseUserSignedOut");
        this._userSignedOut.raise(e);
    }

    addUserSessionChanged(cb) {
        this._userSessionChanged.addHandler(cb);
    }
    removeUserSessionChanged(cb) {
        this._userSessionChanged.removeHandler(cb);
    }
    _raiseUserSessionChanged(e) {
        Log.info("UserManagerEvents._raiseUserSessionChanged");
        this._userSessionChanged.raise(e);
    }
}
