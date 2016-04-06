// Copyright (c) Brock Allen & Dominick Baier. All rights reserved.
// Licensed under the Apache License, Version 2.0. See LICENSE in the project root for license information.

import Log from './Log';

export default class RedirectNavigator {

    navigate(url) {
        Log.info("RedirectNavigator.navigate");
        window.location = url;
        return Promise.resolve();
    }

    get url() {
        Log.info("RedirectNavigator.url");
        return window.location.href;
    }
}
