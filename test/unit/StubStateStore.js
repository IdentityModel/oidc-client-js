// Copyright (c) Brock Allen & Dominick Baier. All rights reserved.
// Licensed under the Apache License, Version 2.0. See LICENSE in the project root for license information.

export class StubStateStore {
    set(key, value) {
        if (this.error) {
            return Promise.reject(new Error(this.error));
        }
        this.item = value;
        return Promise.resolve();
    }

    get(key) {
        if (this.error) {
            return Promise.reject(new Error(this.error));
        }
        return Promise.resolve(this.item);
    }

    remove(key) {
        if (this.error) {
            return Promise.reject(new Error(this.error));
        }
        return Promise.resolve(this.item);
    }

    getAllKeys(){
        if (this.item){
            return Promise.resolve(["key"]);
        }
            return Promise.resolve([]);
    }
    get length(){
        return this.item ? 1 : 0;
    }
}
