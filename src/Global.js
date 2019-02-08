// Copyright (c) Brock Allen & Dominick Baier. All rights reserved.
// Licensed under the Apache License, Version 2.0. See LICENSE in the project root for license information.

const timer = {
    setInterval: function (cb, duration) {
        return setInterval(cb, duration);
    },
    clearInterval: function (handle) {
        return clearInterval(handle);
    }
};

let testing = false;
let request = null;

export class Global {

    static _testing() {
        testing = true;
    }

    static get location() {
        if (!testing) {
            return location;
        }
    }

    static get localStorage() {
        if (!testing && typeof window !== 'undefined') {
            return localStorage;
        }
    }

    static get sessionStorage() {
        if (!testing && typeof window !== 'undefined') {
            return sessionStorage;
        }
    }

    static setXMLHttpRequest(newRequest) {
        request = newRequest;
    }

    static get XMLHttpRequest() {
        if (!testing && typeof window !== 'undefined') {
            return request || XMLHttpRequest;
        }
    }

    static get timer() {
        if (!testing) {
            return timer;
        }
    }
}
