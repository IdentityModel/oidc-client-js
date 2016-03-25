import Log from './Log';
import random from './random';
import Crypto from './Crypto';

export default class State {
    constructor(state, crypto = Crypto){
        
        this._data = {nonce:random()};
        this._data.state = state;
        
        this._crypto = crypto;
    }
    
    get id() {
        return this._data.nonce;
    }

    toUriString(){
        return encodeURIComponent(JSON.stringify(this._data));
    }
    
    toClientStorageString(){
        return JSON.stringify({
            hash: this._crypto.hash(this.toUriString()),
            nonce: this._data.nonce
        });
    }
    
    static verify(clientStorageString, stateString, crypto = Crypto){
        Log.info("State.verify");
        
        var clientStorage = JSON.parse(clientStorageString);
        
        if (clientStorage.hash === crypto.hash(stateString)){
            Log.info("hash comparison successful");
            
            var json = decodeURIComponent(stateString);
            var data = JSON.parse(json);
            
            if (data.nonce === clientStorage.nonce) {
                Log.info("nonce comparison successful");
                
                return data.state || true;
            }
            else{
                Log.warn("nonce comparison failed");
            }
        }
        else {
            Log.warn("hash comparison failed");
        }
        
        return false;
    }
}
