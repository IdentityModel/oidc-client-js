// Copyright (c) Brock Allen & Dominick Baier. All rights reserved.
// Licensed under the Apache License, Version 2.0. See LICENSE in the project root for license information.

import { Log } from './Log';
import { PopupWindow } from './PopupWindow';

export class PopupNavigator {

    prepare(params) {
        let popup = new PopupWindow(params);
        return Promise.resolve(popup);
    }

    callback(url, keepOpen, delimiter) {
        Log.debug("PopupNavigator.callback");

        try {
            PopupWindow.notifyOpener(url, keepOpen, delimiter);
            return Promise.resolve();
        }
        catch (e) {
            return Promise.reject(e);
        }
    }
}
