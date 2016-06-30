// Copyright (c) Brock Allen & Dominick Baier. All rights reserved.
// Licensed under the Apache License, Version 2.0. See LICENSE in the project root for license information.

import Log from './Log';
import PopupWindow from './PopupWindow';

export default class PopupNavigator {
    
    prepare(params) {
        let popup = new PopupWindow(params);
        return Promise.resolve(popup);
    }
    
    callback(url) {
        Log.info("PopupNavigator.callback");

        try {
            PopupWindow.notifyOpener(url);
            return Promise.resolve();
        }
        catch (e) {
            return Promise.reject(e);
        }
    }
}
