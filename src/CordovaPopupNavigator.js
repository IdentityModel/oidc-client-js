// Copyright (c) Brock Allen & Dominick Baier. All rights reserved.
// Licensed under the Apache License, Version 2.0. See LICENSE in the project root for license information.

import Log from './Log';
import CordovaPopupWindow from './CordovaPopupWindow';

export default class CordovaPopupNavigator {
    
    prepare(params) {
        let popup = new CordovaPopupWindow(params);
        return Promise.resolve(popup);
    }
}
