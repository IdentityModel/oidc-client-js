// Copyright (c) Brock Allen & Dominick Baier. All rights reserved.
// Licensed under the Apache License, Version 2.0. See LICENSE in the project root for license information.

import { Log } from './Log.js';
import { AccessTokenEvents } from './AccessTokenEvents.js';
import { Event } from './Event.js';

export class UserManagerEvents extends AccessTokenEvents {

    constructor(settings) {
        super(settings);
        this._userLoaded = new Event("User loaded");
        this._userUnloaded = new Event("User unloaded");
        this._silentRenewError = new Event("Silent renew error");
        this._userSignedIn = new Event("User signed in");
        this._userSignedOut = new Event("User signed out");
        this._userSessionChanged = new Event("User session changed");
    }

    load(user, raiseEvent=true) {
        Log.debug("UserManagerEvents.load");
        super.load(user);
        if (raiseEvent) {
            this._userLoaded.raise(user);
        }
    }
    unload() {
        Log.debug("UserManagerEvents.unload");
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
        Log.debug("UserManagerEvents._raiseSilentRenewError", e.message);
        this._silentRenewError.raise(e);
    }

    addUserSignedIn(cb) {
        this._userSignedIn.addHandler(cb);
    }
    removeUserSignedIn(cb) {
        this._userSignedIn.removeHandler(cb);
    }
    _raiseUserSignedIn() {
        Log.debug("UserManagerEvents._raiseUserSignedIn");
        this._userSignedIn.raise();
    }

    addUserSignedOut(cb) {
        this._userSignedOut.addHandler(cb);
    }
    removeUserSignedOut(cb) {
        this._userSignedOut.removeHandler(cb);
    }
    _raiseUserSignedOut() {
        Log.debug("UserManagerEvents._raiseUserSignedOut");
        this._userSignedOut.raise();
    }

    addUserSessionChanged(cb) {
        this._userSessionChanged.addHandler(cb);
    }
    removeUserSessionChanged(cb) {
        this._userSessionChanged.removeHandler(cb);
    }
    _raiseUserSessionChanged() {
        Log.debug("UserManagerEvents._raiseUserSessionChanged");
        this._userSessionChanged.raise();
    }
}
