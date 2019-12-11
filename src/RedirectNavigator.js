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
            window.location = params.url;
        }

        return Promise.resolve();
    }

    get url() {
        return window.location.href;
    }
}
