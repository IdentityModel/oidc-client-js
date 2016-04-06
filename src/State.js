// Copyright (c) Brock Allen & Dominick Baier. All rights reserved.
// Licensed under the Apache License, Version 2.0. See LICENSE in the project root for license information.

import Log from './Log';
import random from './random';

export default class State {
    constructor({id, nonce, data, created}={}) {
        this._id = id || random();
        this._data = data;
        
        if (nonce === true){
            this._nonce = random();
        }
        else if (nonce){
            this._nonce = nonce;
        }
        
        if (typeof created === 'number' && created > 0) {
            this._created =  created;
        }
        else {
            this._created =  parseInt(Date.now() / 1000);
        }
    }
    
    get id() {
        return this._id;
    }
    get nonce() {
        return this._nonce;
    }
    get data() {
        return this._data;
    }
    get created() {
        return this._created;
    }

    toStorageString() {
        Log.info("State.toStorageString");
        return JSON.stringify({
            id:this.id,
            nonce:this.nonce,
            data:this.data,
            created:this.created
        });
    }
    
    static fromStorageString(storageString){
        Log.info("State.fromStorageString");
        return new State(JSON.parse(storageString));
    }
    
    static clearStaleState(storage, age){
        Log.info("State.clearStaleState");
        
        var cutoff = Date.now()/1000 - age;
        
        return storage.getAllKeys().then(keys => {
            Log.info("got keys", keys);
            
            var promises = [];
            for(let key of keys){
                var p = storage.get(key).then(item => {
                    var state = State.fromStorageString(item)
                    
                    Log.info("got item from key", key, state.created);
                    
                    if (state.created <= cutoff) {
                        Log.info("key being removed", key);
                        return storage.remove(key);
                    }
                });
                
                promises.push(p);
            }

            Log.info("waiting on promise count:", promises.length);
            return Promise.all(promises);
        });
    }
}
