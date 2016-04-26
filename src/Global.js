// Copyright (c) Brock Allen & Dominick Baier. All rights reserved.
// Licensed under the Apache License, Version 2.0. See LICENSE in the project root for license information.

const timer = {
    setTimeout: function (cb, duration) {
        return setTimeout(cb, duration);
    },
    clearTimeout: function (handle) {
        return clearTimeout(handle);
    }
};

export default class Global {
    static get location() {
        return location;
    }
    static get localStorage() {
        return localStorage;
    }
    static get sessionStorage() {
        return sessionStorage;
    }
    static get XMLHttpRequest() {
        return XMLHttpRequest;
    }
    static get timer() {
        return timer;
    }
};
