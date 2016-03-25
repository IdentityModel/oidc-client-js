import Log from './Log';
import Window from './Window';

export default class WebStorageStateStore {
    constructor(store = Window.localStorage){
        this._store = store;
    }
    
    get(key) {
        return Promise.resolve(this._store.getItem(key));
    }
    
    set(key, value){
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
        this._store.removeItem(key);
        return Promise.resolve();
    }   
}