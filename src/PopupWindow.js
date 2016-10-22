// Copyright (c) Brock Allen & Dominick Baier. All rights reserved.
// Licensed under the Apache License, Version 2.0. See LICENSE in the project root for license information.

import Log from './Log';
import UrlUtility from './UrlUtility';

const CheckForPopupClosedInterval = 500;
const DefaultPopupFeatures = 'location=no,toolbar=no,width=500,height=500,left=100,top=100;';
//const DefaultPopupFeatures = 'location=no,toolbar=no,width=500,height=500,left=100,top=100;resizable=yes';

const DefaultPopupTarget = "_blank";

export default class PopupWindow {

    constructor(params) {
        Log.info("PopupWindow.ctor");

        this._promise = new Promise((resolve, reject) => {
            this._resolve = resolve;
            this._reject = reject;
        });

        let target = params.popupWindowTarget || DefaultPopupTarget;
        let features = params.popupWindowFeatures || DefaultPopupFeatures;

        this._popup = window.open('', target, features);
        if (this._popup) {
            Log.info("popup successfully created");
            this._checkForPopupClosedTimer = window.setInterval(this._checkForPopupClosed.bind(this), CheckForPopupClosedInterval);
        }
    }

    get promise() {
        return this._promise;
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

            this._id = params.id;
            window["popupCallback_" + params.id] = this._callback.bind(this);

            this._popup.focus();
            this._popup.window.location = params.url;
        }

        return this.promise;
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

        window.clearInterval(this._checkForPopupClosedTimer);
        this._checkForPopupClosedTimer = null;

        delete window["popupCallback_" + this._id];

        if (this._popup) {
            this._popup.close();
        }
        this._popup = null;
    }

    _checkForPopupClosed() {
        Log.info("PopupWindow._checkForPopupClosed");

        if (!this._popup || this._popup.closed) {
            this._error("Popup window closed");
        }
    }

    _callback(url) {
        Log.info("PopupWindow._callback");

        this._cleanup();

        if (url) {
            this._success({ url: url });
        }
        else {
            this._error("Invalid response from popup");
        }
    }

    static notifyOpener(url) {
        Log.info("PopupWindow.notifyOpener");

        if (window.opener) {
            url = url || window.location.href;
            if (url) {

                var data = UrlUtility.parseUrlFragment(url);
                
                if (data.state) {
                    var name = "popupCallback_" + data.state;
                    var callback = window.opener[name]; 
                    if (callback) {
                        Log.info("passing url message to opener");
                        callback(url);
                    }
                    else {
                        Log.warn("no matching callback found on opener");
                    }
                }
                else {
                    Log.warn("no state found in response url");
                }
            }
        }
    }
}
