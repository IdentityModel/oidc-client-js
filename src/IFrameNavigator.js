// Copyright (c) Brock Allen & Dominick Baier. All rights reserved.
// Licensed under the Apache License, Version 2.0. See LICENSE in the project root for license information.

import Log from './Log';
import IFrameLoader from './IFrameLoader';

const DefaultTimeout = 5000;

export default class IFrameNavigator {
    constructor(timeout = DefaultTimeout){
        this._timeout = timeout;
    }

    navigate(url) {
        Log.info("IFrameNavigator.navigate");

        if (!url) {
            Log.error("No url provided");
            return Promise.reject(new Error("No url provided"));
        }

        return new Promise((resolve, reject) => {
            new IFrameLoader(resolve, reject, this._timeout, url);
        });
    }

    get url() {
        Log.error("url should not be used with IFrameNavigator");
        throw new Error("url should not be used with IFrameNavigator");
    }

    callback(url) {
        Log.info("IFrameNavigator.callback");
        
        try{
            IFrameLoader.notifyParent(url);
            return Promose.resolve();
        }
        catch(e){
            return Promose.reject(e);
        }
    }
}
