// Copyright (c) Brock Allen & Dominick Baier. All rights reserved.
// Licensed under the Apache License, Version 2.0. See LICENSE in the project root for license information.

import { Log } from './Log';
import { Global } from './Global';

export class JsonService {
    constructor(XMLHttpRequestCtor = Global.XMLHttpRequest) {
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

            req.onload = function() {
                Log.debug("JsonService.getJson: HTTP response received, status", req.status);

                if (req.status === 200) {
                    var contentType = req.getResponseHeader("Content-Type");
                    if (contentType && contentType.startsWith("application/json")) {
                        try {
                            resolve(JSON.parse(req.responseText));
                        }
                        catch (e) {
                            Log.error("JsonService.getJson: Error parsing JSON response", e.message);
                            reject(e);
                        }
                    }
                    else {
                        reject(Error("Invalid response Content-Type: " + contentType + ", from URL: " + url));
                    }
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
