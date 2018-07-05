// Copyright (c) Brock Allen & Dominick Baier. All rights reserved.
// Licensed under the Apache License, Version 2.0. See LICENSE in the project root for license information.

import { Log } from './Log';
import { Global } from './Global';

export class JsonService {
    constructor(additionalContentTypes = null, XMLHttpRequestCtor = Global.XMLHttpRequest) {
        if (additionalContentTypes && Array.isArray(additionalContentTypes))
        {
            this._contentTypes = additionalContentTypes.slice();
        }
        else
        {
            this._contentTypes = [];
        }
        this._contentTypes.push('application/json');

        this._XMLHttpRequest = XMLHttpRequestCtor;
    }

    getJson(url, token) {
        if (!url){
            Log.error("JsonService.getJson: No url passed");
            throw new Error("url");
        }

        Log.debug("JsonService.getJson, url: ", url);

        return new Promise((resolve, reject) => {

            var req = new this._XMLHttpRequest();
            req.open('GET', url);

            var allowedContentTypes = this._contentTypes;

            req.onload = function() {
                Log.debug("JsonService.getJson: HTTP response received, status", req.status);

                if (req.status === 200) {

                    var contentType = req.getResponseHeader("Content-Type");
                    if (contentType) {

                        var found = allowedContentTypes.find(item=>{
                            if (contentType.startsWith(item)) {
                                return true;
                            }
                        });

                        if (found) {
                            try {
                                resolve(JSON.parse(req.responseText));
                                return;
                            }
                            catch (e) {
                                Log.error("JsonService.getJson: Error parsing JSON response", e.message);
                                reject(e);
                                return;
                            }
                        }
                    }

                    reject(Error("Invalid response Content-Type: " + contentType + ", from URL: " + url));
                }
                else {
                    reject(Error(req.statusText + " (" + req.status + ")"));
                }
            };

            req.onerror = function() {
                Log.error("JsonService.getJson: network error");
                reject(Error("Network Error"));
            };

            if (token) {
                Log.debug("JsonService.getJson: token passed, setting Authorization header");
                req.setRequestHeader("Authorization", "Bearer " + token);
            }

            req.send();
        });
    }
}
