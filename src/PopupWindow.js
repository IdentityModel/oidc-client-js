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
        let next = window;
        let depth = 0;
        while( next.parent !== next ) {
            next = next.parent;
            depth += 1;
        }
        this._iframe_depth = depth;
        let fn = this._iframe_depth+">"+this.constructor.name+"#constructor";
        Log.debug("PopupWindow.ctor");

        this._promise = new Promise((resolve, reject) => {
            this._resolve = resolve;
            this._reject = reject;
        });

        let target = params.popupWindowTarget || DefaultPopupTarget;
        let features = params.popupWindowFeatures || DefaultPopupFeatures;

        this._popup = window.open('', target, features);
        if (this._popup) {
            console.warn( fn+": Opening Popup" );
            Log.debug("popup successfully created");
            this._checkForPopupClosedTimer = window.setInterval(this._checkForPopupClosed.bind(this), CheckForPopupClosedInterval);
        }
    }

    get promise() {
        return this._promise;
    }

    navigate(params) {
        let fn = this._iframe_depth+">"+this.constructor.name+"#navigate";
        console.log( fn+": invoked with ", params );
        Log.debug("PopupWindow.navigate");

        if (!this._popup) {
            console.warn( fn+": Error opening Popup" );
            this._error("Error opening popup window");
        }
        else if (!params || !params.url) {
            console.warn( fn+": Popup needs a URL" );
            this._error("No url provided");
        }
        else {
            console.warn( fn+": Navigating Popup", params );
            Log.debug("Setting URL in popup");

            this._id = params.id;
            if (this._id) { // Why is this._id tested here but not in _cleanup?
                window["popupCallback_" + params.id] = this._callback.bind(this);
            }

            this._popup.focus();
            this._popup.window.location = params.url;
        }

        return this.promise;
    }

    _success(data) {
        let fn = this._iframe_depth+">"+this.constructor.name+"#_success";
        console.log( fn+": invoked" );
        this._cleanup();

        console.warn( fn+": Popup Success" );
        Log.debug("Successful response from popup window");
        this._resolve(data);
    }
    _error(message) {
        let fn = this._iframe_depth+">"+this.constructor.name+"#_error";
        console.log( fn+": invoked with ", message );
        this._cleanup();

        console.warn( fn+": Popup Error" );
        Log.error(message);
        this._reject(new Error(message));
    }

    _cleanup(keepOpen) {
        let fn = this._iframe_depth+">"+this.constructor.name+"#_cleanup";
        console.log( fn+": invoked with ", keepOpen );
        Log.debug("PopupWindow._cleanup");

        window.clearInterval(this._checkForPopupClosedTimer);
        this._checkForPopupClosedTimer = null;

        delete window["popupCallback_" + this._id]; // why is this._id tested in navigate but not here?

        console.log( fn+": _popup = ", this._popup );
        if (this._popup && !keepOpen) {
            console.warn( fn+": Closing Popup" );
            this._popup.close();
        }
        this._popup = null;
    }

    _checkForPopupClosed() {
        let fn = this._iframe_depth+">"+this.constructor.name+"#_checkForPopupClosed";
        // console.log( fn+": invoked" );
        Log.debug("PopupWindow._checkForPopupClosed");

        if (!this._popup || this._popup.closed) {
            console.warn( fn+": Popup Closed" );
            this._error("Popup window closed");
        }
    }

    _callback(url, keepOpen) {
        let fn = this._iframe_depth+">"+this.constructor.name+"#_callback";
        console.log( fn+": invoked with ", arguments );
        Log.debug("PopupWindow._callback");

        this._cleanup(keepOpen);

        if (url) {
            this._success({ url: url });
        }
        else {
            console.warn( fn+": Popup response missing URL" );
            this._error("Invalid response from popup");
        }
    }

    static notifyOpener(url, keepOpen, delimiter) {
        let next = window;
        let depth = 0;
        while( next.parent !== next ) {
            next = next.parent;
            depth += 1;
        }
        this._iframe_depth = depth;
        let fn = this._iframe_depth+">"+this.constructor.name+".notifyOpener";
        console.log( fn+": invoked with ", arguments );
        Log.debug("PopupWindow.notifyOpener");

        if (window.opener) {
            url = url || window.location.href;
            if (url) {

                var data = UrlUtility.parseUrlFragment(url, delimiter);
                
                if (data.state) {
                    var name = "popupCallback_" + data.state;
                    var callback = window.opener[name]; 
                    if (callback) {
                        console.warn( fn+": invoking callback on name = ", name );
                        console.warn( fn+": invoking callback with url = ", url );
                        console.warn( fn+": invoking callback with keepOpen = ", keepOpen );
                        Log.debug("passing url message to opener");
                        callback(url, keepOpen);
                    }
                    else {
                        console.warn( fn+": no callback on name = ", name );
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
