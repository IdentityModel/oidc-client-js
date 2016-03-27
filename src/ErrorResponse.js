import Log from './Log';
import UrlUtility from './UrlUtility';

export default class ErrorResponse {
    constructor({error, error_description, error_uri, state}={}
    ) {
         if (!error){
            Log.error("No error passed to ErrorResponse");
            throw new Error("error");
        }
        
        this._error = error;
        this._error_description = error_description;
        this._error_uri = error_uri;
        this._state = state;
        
        this._stack = (new Error()).stack;
    }
    
    get message(){
        return this.error_description || this.error;
    }
    get name(){
        return "ErrorResponse";
    }
    get stack(){
        return this._stack;
    }
    
    get error(){
        return this._error;
    }
    get error_description(){
        return this._error_description;
    }
    get error_uri(){
        return this._error_uri;
    }
    get state(){
        return this._state;
    }
}