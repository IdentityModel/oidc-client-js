// Copyright (c) Brock Allen & Dominick Baier. All rights reserved.
// Licensed under the Apache License, Version 2.0. See LICENSE in the project root for license information.

import { Log } from './Log.js';

export class InMemoryWebStorage{
    constructor(){
        this._data = {};
    }

    getItem(key) {
        Log.debug("InMemoryWebStorage.getItem", key);
        return this._data[key];
    }

    setItem(key, value){
        Log.debug("InMemoryWebStorage.setItem", key);
        this._data[key] = value;
    }

    removeItem(key){
        Log.debug("InMemoryWebStorage.removeItem", key);
        delete this._data[key];
    }

    get length() {
        return Object.getOwnPropertyNames(this._data).length;
    }

    key(index) {
        return Object.getOwnPropertyNames(this._data)[index];
    }
}
