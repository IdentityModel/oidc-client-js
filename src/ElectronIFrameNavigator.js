// Copyright (c) Brock Allen & Dominick Baier. All rights reserved.
// Licensed under the Apache License, Version 2.0. See LICENSE in the project root for license information.

import Log from './Log';
import ElectronPopupWindow from './ElectronPopupWindow';

export default class ElectronIFrameNavigator {
    
    prepare(params) {
        params.popupWindowFeatures = params.popupWindowFeatures || {};
        params.popupWindowFeatures.show = false;
        let popup = new ElectronPopupWindow(params);
        return Promise.resolve(popup);
    }

}
