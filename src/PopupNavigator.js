// Copyright (c) Brock Allen & Dominick Baier. All rights reserved.
// Licensed under the Apache License, Version 2.0. See LICENSE in the project root for license information.

import Log from './Log';

export default class PopupNavigator {

    navigate(url) {
        Log.info("PopupNavigator.navigate");
        
        return Promise.resolve();
    }

    callback(url) {
        Log.info("PopupNavigator.callback");
        
        try {
            PopupWindow.notifyOpener(url);
            return Promose.resolve();
        }
        catch (e) {
            return Promose.reject(e);
        }
    }
}
