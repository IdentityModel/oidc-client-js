// Copyright (c) Brock Allen & Dominick Baier. All rights reserved.
// Licensed under the Apache License, Version 2.0. See LICENSE in the project root for license information.

import Log from './Log';

export default class RedirectNavigator {
    
    prepare() {
        return Promise.resolve(this);
    }

    navigate(params) {
        Log.info("RedirectNavigator.navigate");
        
        if (!params || !params.url) {
            Log.error("No url provided");
            return Promise.reject(new Error("No url provided"));
        }

        window.location = params.url;
        
        return Promise.resolve();
    }

    get url() {
        Log.info("RedirectNavigator.url");
        return window.location.href;
    }
}
