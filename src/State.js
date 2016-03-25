import Log from './Log';
import random from './random';

export default class State {
    constructor({id, nonce, data}={}) {
        this._id = id || random();
        if (nonce === true){
            this._nonce = random();
        }
        else if (nonce){
            this._nonce = nonce;
        }
        this._data = data;
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

    toStorageString() {
        return JSON.stringify({
            id:this.id,
            nonce:this.nonce,
            data:this.data
        });
    }
    
    static fromStorageString(storageString){
        return new State(JSON.parse(storageString));
    }
}
