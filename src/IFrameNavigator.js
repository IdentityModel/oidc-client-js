// Copyright (c) Brock Allen & Dominick Baier. All rights reserved.
// Licensed under the Apache License, Version 2.0. See LICENSE in the project root for license information.

import Log from './Log';
import IFrameWindow from './IFrameWindow';

export default class IFrameNavigator {
    constructor( pageOrigin ) {
        let next = window;
        let depth = 0;
        while( next.parent !== next ) {
            next = next.parent;
            depth += 1;
        }
        this._iframe_depth = depth;
        this._pageOrigin = pageOrigin;
        let fn=this._iframe_depth+">"+this.constructor.name+"#constructor";
        console.log( fn+": pageOrigin = ", this._pageOrigin );
    }

    prepare(params) {
        let fn=this._iframe_depth+">"+this.constructor.name+"#prepare";
        console.log( fn+": pageOrigin = ", params.pageOrigin );
        console.log( fn+": scriptOrigin = ", params.scriptOrigin );
        this._pageOrigin = params.pageOrigin;
        this._scriptOrigin = params.scriptOrigin;
        let frame = new IFrameWindow(params);
        return Promise.resolve(frame);
    }

    callback(url) {
    // callback(url, pageOrigin) {
        let fn=this._iframe_depth+">"+this.constructor.name+"#callback";
        console.log( fn+": pageOrigin = ", this._pageOrigin );
        Log.debug("IFrameNavigator.callback");

        try {
            console.log( fn+": notifyParent with message = ", url );
            console.log( fn+": notifyParent with pageOrigin = ", this._pageOrigin );
            IFrameWindow.notifyParent(url, this._pageOrigin);
            return Promise.resolve();
        }
        catch (e) {
            return Promise.reject(e);
        }
    }
}
