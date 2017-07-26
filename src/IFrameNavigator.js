// Copyright (c) Brock Allen & Dominick Baier. All rights reserved.
// Licensed under the Apache License, Version 2.0. See LICENSE in the project root for license information.

import Log from './Log';
import IFrameWindow from './IFrameWindow';

export default class IFrameNavigator {
    constructor( pageOrigin ) {
        this._pageOrigin = pageOrigin;
    }

    prepare(params) {
        this._pageOrigin = params.pageOrigin;
        this._scriptOrigin = params.scriptOrigin;
        let frame = new IFrameWindow(params);
        return Promise.resolve(frame);
    }

    callback(url) {
        Log.debug("IFrameNavigator.callback");

        try {
            IFrameWindow.notifyParent(url, this._pageOrigin);
            return Promise.resolve();
        }
        catch (e) {
            return Promise.reject(e);
        }
    }
}
