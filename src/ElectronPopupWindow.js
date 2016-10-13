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
        
        this.electron = require('electron');
        this.electronRemote = this.electron.remote;

        
        this._boundMessageEvent = this._message.bind(this);
        window.addEventListener("message", this._boundMessageEvent);

        this._popup = new this.electronRemote.BrowserWindow(this.features);
        var popup = this._popup;

        // this._popup.webContents.on('did-get-redirect-request', function (event, oldUrl, newUrl, isMainFrame) {
        //     Log.info('Redirect electron');
        //     event.preventDefault();
        //     console.log(event);
        //     console.log(newUrl);
        //     this._success({ url: arg });
        // });



        var ipcMain = this.electronRemote.ipcMain;
        if(ipcMain)
        {
            Log.info("configuring electron receiver");
            ipcMain.on('synchronous-message', (event, arg) => {
                Log.info("receiving url");
                this._success({ url: arg });
            });
        }


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

    _message(e) {
        Log.info("PopupWindow._message");

        if (e.origin === this._origin &&
            e.source === this._popup.window
        ) {
            Log.info("processing message");
            
            let url = e.data || e.source.location.href; // for IE9

            this._cleanup();

            if (url) {
                this._success({ url: url });
            }
            else {
                this._error("Invalid response from popup");
            }
        }
    }

    get _origin() {
        return location.protocol + "//" + location.host;
    }

    static notifyOpener(url) {
        Log.info("PopupWindow.notifyOpener");


        if (window.opener) {
            url = url || window.location.href;
            if (url) {
                Log.info("posting url message to opener");
                window.opener.postMessage(url, location.protocol + "//" + location.host);
            }
        }else{
            var electron = require('electron');
            const ipcRenderer = electron.ipcRenderer;
            if(ipcRenderer)
            {
                url = url || window.location.href;
                Log.info("posting url message to opener (electron)");

                ipcRenderer.send('synchronous-message', url);
                
            }
        }
    }
}
