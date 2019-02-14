// Copyright (c) Brock Allen & Dominick Baier. All rights reserved.
// Licensed under the Apache License, Version 2.0. See LICENSE in the project root for license information.

import { CordovaPopupWindow } from './CordovaPopupWindow.js';

export class CordovaIFrameNavigator {

    prepare(params) {
        params.popupWindowFeatures = 'hidden=yes';
        let popup = new CordovaPopupWindow(params);
        return Promise.resolve(popup);
    }
}
