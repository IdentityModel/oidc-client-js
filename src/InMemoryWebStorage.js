export default class InMemoryWebStorage{
    constructor(){
        this._data = {};
    }
    
    getItem(key) {
        return this._data[key];
    }
    
    setItem(key, value){
        this._data[key] = value;
    }   
    
    removeItem(key){
        delete this._data[key];
    }   
}