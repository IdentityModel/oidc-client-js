import UrlUtility from './UrlUtility';
import State from './State';

export default class SignoutRequest {
    constructor(url, {id_token_hint, post_logout_redirect_uri, state}={}, StateCtor = State){
        if (!url){
            Log.error("No url passed to SignoutRequest");
            throw new Error("url");
        }
        
        this._url = url;
        this._id_token_hint = id_token_hint;
        this._post_logout_redirect_uri = post_logout_redirect_uri;

        this._state = new StateCtor(state);
    }
    
    get signoutUrl(){
        if (!this._signoutUrl){
            this._signoutUrl = this._url;
            this._signoutUrl = UrlUtility.addQueryParam(this._signoutUrl, "state", this._state.toUriString());

            if (this._id_token_hint){
                this._signoutUrl = UrlUtility.addQueryParam(this._signoutUrl, "id_token_hint", this._id_token_hint);
            }
            
            if (this._post_logout_redirect_uri){
                this._signoutUrl = UrlUtility.addQueryParam(this._signoutUrl, "post_logout_redirect_uri", this._post_logout_redirect_uri);
            }
        }
        
        return this._signoutUrl;
    }
    
    get state(){
        return this._state.toClientStorageString();
    }
}
