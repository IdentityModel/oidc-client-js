import Log from './Log';
import Window from './Window';

export default class WebStorageStateStore {
    constructor({prefix = "oidc.", store = Window.localStorage} = {}){
        this._store = store;
        this._prefix = prefix;
    }
    
    set(key, value){
        Log.info("WebStorageStateStore.set", key);
        
        key = this._prefix + key;
        
        try{
            this._store.setItem(key, value);
            return Promise.resolve();
        }
        catch(e){
            Log.error("storage exception", e);
            return Promise.reject(new Error("Failed to store item", key));
        }
    }   
    
    remove(key){
        Log.info("WebStorageStateStore.remove", key);
        
        key = this._prefix + key;

        var item = this._store.getItem(key);
        this._store.removeItem(key);
        
        return Promise.resolve(item);
    }   
}