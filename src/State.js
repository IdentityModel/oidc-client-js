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
        return JSON.stringify({
            id:this.id,
            nonce:this.nonce,
            data:this.data,
            created:this.created
        });
    }
    
    static fromStorageString(storageString){
        return new State(JSON.parse(storageString));
    }
}
