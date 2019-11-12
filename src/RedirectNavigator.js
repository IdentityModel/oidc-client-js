// Copyright (c) Brock Allen & Dominick Baier. All rights reserved.
// Licensed under the Apache License, Version 2.0. See LICENSE in the project root for license information.

import { Log } from './Log.js';

export class RedirectNavigator {

    prepare() {
        return Promise.resolve(this);
    }

    navigate(params) {
        if (!params || !params.url) {
            Log.error("RedirectNavigator.navigate: No url provided");
            return Promise.reject(new Error("No url provided"));
        }

        if (params.useReplaceToNavigate) {
            window.location.replace(params.url);
        }
        else {
            window.location.assign(params.url);
        }
  
        // The browser keeps executing code after window.location.replace or window.location.assign
        // are called. We return a promise that never resolves so that code does not keep executing
        // as this would lead applications into thinking that login has been completed.
        return new Promise((resolve, reject) => {});
    }

    get url() {
        return window.location.href;
    }
}
