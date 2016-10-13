// Copyright (c) Brock Allen & Dominick Baier. All rights reserved.
// Licensed under the Apache License, Version 2.0. See LICENSE in the project root for license information.

import Log from './Log';

const CheckForPopupClosedInterval = 500;
const DefaultPopupFeatures = {width: 500, height: 500};

export default class ElectronPopupWindow {

    constructor(params) {
        Log.info("ElectronPopupWindow.ctor");

        this._promise = new Promise((resolve, reject) => {
            this._resolve = resolve;
            this._reject = reject;
        });


        this.features = params.popupWindowFeatures || DefaultPopupFeatures;
        
        
        var electron = require('electron');
        var electronRemote = electron.remote;
        this._popup = new electronRemote.BrowserWindow(this.features);

        if (this._popup) {
            Log.info("popup successfully created");
            this._checkForPopupClosedTimer = window.setInterval(this._checkForPopupClosed.bind(this), CheckForPopupClosedInterval);
        }
    }
    
    navigate(params) {
        Log.info("PopupWindow.navigate");

        if (!this._popup) {
            this._error("Error opening popup window");
        }
        else if (!params || !params.url) {
            this._error("No url provided");
        }
        else {
            Log.info("Setting URL in popup");

            var success = this._success;

            var self = this;

            this._popup.webContents.on('did-get-redirect-request', function (event, oldUrl, newUrl, isMainFrame) {
                Log.info('Redirect intercepted');
                Log.info(newUrl);

                //if redirect contains access_token then should consider a success!
                if(newUrl.indexOf('access_token=') > -1)
                {
                    Log.info('Redirect contains access_token');
                    event.preventDefault();

                    success.apply(self, [ { url: newUrl } ]);
                }
            });

            this._popup.loadURL(params.url);
        }

        return this.promise;
    }

    get promise() {
        return this._promise;
    }

    _success(data) {
        this._cleanup();

        Log.info("Successful response from popup window");
        this._resolve(data);
    }
    _error(message) {
        this._cleanup();

        Log.error(message);
        this._reject(new Error(message));
    }

    _cleanup() {
        Log.info("PopupWindow._cleanup");

        require('electron').remote.getCurrentWindow().removeAllListeners();
        window.clearInterval(this._checkForPopupClosedTimer);

        this._checkForPopupClosedTimer = null;
        this._boundMessageEventssage = null;
        
        if (this._popup && !this._popup.isDestroyed()){
            this._popup.close();
        }
        this._popup = null;
    }

    _checkForPopupClosed() {
        Log.info("PopupWindow._checkForPopupClosed");

        if (!this._popup || this._popup.closed || this._popup.isDestroyed()) {
            this._error("Popup window closed");
        }
    }


}
