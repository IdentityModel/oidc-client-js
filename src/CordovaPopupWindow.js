// Copyright (c) Brock Allen & Dominick Baier. All rights reserved.
// Licensed under the Apache License, Version 2.0. See LICENSE in the project root for license information.

import Log from './Log';

const DefaultPopupFeatures = 'location=no,toolbar=no,zoom=no';
const DefaultPopupTarget = "_blank";

export default class CordovaPopupWindow {

    constructor(params) {
        Log.info("CordovaPopupWindow.ctor");

        this._promise = new Promise((resolve, reject) => {
            this._resolve = resolve;
            this._reject = reject;
        });

        this.features = params.popupWindowFeatures || DefaultPopupFeatures;
        this.target = params.popupWindowTarget || DefaultPopupTarget;
        
        this.redirect_uri = params.startUrl;
        Log.info("redirect_uri: " + this.redirect_uri);
    }

    _isInAppBrowserInstalled(cordovaMetadata) {
        return ["cordova-plugin-inappbrowser", "cordova-plugin-inappbrowser.inappbrowser", "org.apache.cordova.inappbrowser"].some(function (name) {
            return cordovaMetadata.hasOwnProperty(name)
        })
    }
    
    navigate(params) {
        Log.info("CordovaPopupWindow.navigate");

        if (!params || !params.url) {
            this._error("No url provided");
        } else {
            if (!window.cordova) {
                return this._error("cordova is undefined")
            }
            
            var cordovaMetadata = window.cordova.require("cordova/plugin_list").metadata;
            if (this._isInAppBrowserInstalled(cordovaMetadata) === false) {
                return this._error("InAppBrowser plugin not found")
            }
            this._popup = cordova.InAppBrowser.open(params.url, this.target, this.features);
            if (this._popup) {
                Log.info("popup successfully created");
                
                this._exitCallbackEvent = this._exitCallback.bind(this); 
                this._loadStartCallbackEvent = this._loadStartCallback.bind(this);
                
                this._popup.addEventListener("exit", this._exitCallbackEvent, false);
                this._popup.addEventListener("loadstart", this._loadStartCallbackEvent, false);
            } else {
                this._error("Error opening popup window");
            }
        }
        return this.promise;
    }

    get promise() {
        return this._promise;
    }

    _loadStartCallback(event) {
        if (event.url.indexOf(this.redirect_uri) === 0) {
            this._success({ url: event.url });
        }    
    }
    _exitCallback(message) {
        this._error(message);    
    }
    
    _success(data) {
        this._cleanup();

        Log.info("Successful response from cordova popup window");
        this._resolve(data);
    }
    _error(message) {
        this._cleanup();

        Log.error(message);
        this._reject(new Error(message));
    }

    _cleanup() {
        Log.info("CordovaPopupWindow._cleanup");

        if (this._popup){
            this._popup.removeEventListener("exit", this._exitCallbackEvent, false);
            this._popup.removeEventListener("loadstart", this._loadStartCallbackEvent, false);
            this._popup.close();
        }
        this._popup = null;
    }
}
