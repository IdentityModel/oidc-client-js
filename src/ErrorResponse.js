import Log from './Log';
import UrlUtility from './UrlUtility';

export default class ErrorResponse {
    constructor({error, error_description, error_uri, state}={}
    ) {
         if (!error){
            Log.error("No error passed to ErrorResponse");
            throw new Error("error");
        }
        
        this.message = error_description || error;
        this.name = "ErrorResponse"; 
        this.stack = (new Error()).stack;
        
        this.error = error;
        this.error_description = error_description;
        this.error_uri = error_uri;
        
        this.state = state;
    }
}