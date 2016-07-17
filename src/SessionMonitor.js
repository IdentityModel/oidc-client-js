// Copyright (c) Brock Allen & Dominick Baier. All rights reserved.
// Licensed under the Apache License, Version 2.0. See LICENSE in the project root for license information.

import Log from './Log';
import MetadataService from './MetadataService';
import CheckSessionIFrame from './CheckSessionIFrame';

export default class SessionMonitor {

    constructor(settings, MetadataServiceCtor = MetadataService, CheckSessionIFrameCtor = CheckSessionIFrame) {
        if (!settings) {
            Log.error("No settings passed to SessionMonitor");
            throw new Error("settings");
        }

        this._settings = settings;
        this._metadataService = new MetadataServiceCtor(this._settings);
        this._checkSessionIFrame = new CheckSessionIFrameCtor(this._callback);
    }

    _callback() {
        Log.info("SessionMonitor.callback happened");
    }

    initialize(user) {
        let client_id = this._settings.client_id;
        let session_state = user.session_state;
        let interval = this._settings.checkSessionInterval;

        return this._promise = this._metadataService.getCheckSessionIframe(url => {
            this._checkSessionIFrame.init(client_id, url, session_state, interval);
        });
    }
}
