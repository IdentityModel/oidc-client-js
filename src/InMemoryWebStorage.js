import Log from './Log';

export default class InMemoryWebStorage{
    constructor(){
        this._data = {};
    }
    
    getItem(key) {
        Log.info("InMemoryWebStorage.getItem", key);
        return this._data[key];
    }
    
    setItem(key, value){
        Log.info("InMemoryWebStorage.setItem", key);
        this._data[key] = value;
    }   
    
    removeItem(key){
        Log.info("InMemoryWebStorage.removeItem", key);
        delete this._data[key];
    }
    
    get length() {
        return Object.getOwnPropertyNames(this._data).length;
    }
    
    key(index) {
        return Object.getOwnPropertyNames(this._data)[index];
    }
}