// Copyright (c) Brock Allen & Dominick Baier. All rights reserved.
// Licensed under the Apache License, Version 2.0. See LICENSE in the project root for license information.

import Log from './Log';

export default class PopupWindow {

    static load(url) {
        Log.info("PopupWindow.load");

        if (!url) {
            Log.error("No url provided");
            return Promise.reject(new Error("No url provided"));
        }

        return new Promise((resolve, reject) => {
            let loader = new PopupWindow(resolve, reject);
            loader.loadUrl(url);
        });
    }

    constructor(resolve, reject) {
        Log.info("PopupWindow.ctor");

        this._resolve = resolve;
        this._reject = reject;
    }

    loadUrl(url) {
        Log.info("PopupWindow.loadUrl");
        this._popup = window.open(url, 'oidc.popup', 'location=no,toolbar=no,width=500,height=500');
    }
    
    static notifyOpener(url){
        
    }
}
