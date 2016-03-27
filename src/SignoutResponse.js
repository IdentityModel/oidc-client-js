import Log from './Log';
import UrlUtility from './UrlUtility';
import ErrorResponse from './ErrorResponse';

export default class SignoutResponse {
    constructor(url) {
        
        var values = UrlUtility.parseUrlFragment(url);
        
        if (values.error){
            return new ErrorResponse(values);
        }
        
        this._state = values.state;
    }
    
    get state(){
        return this._state;
    }
    set state(value){
        this._state = value;
    }
}