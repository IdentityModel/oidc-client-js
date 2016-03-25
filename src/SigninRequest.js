import Log from './Log';
import UrlUtility from './UrlUtility';
import State from './State';

export default class SigninRequest {
    constructor(url, client_id, redirect_uri, response_type, scope, state, StateCtor = State) {
        
        if (!url){
            Log.error("No url passed to SigninRequest");
            throw new Error("url");
        }
        if (!client_id){
            Log.error("No client_id passed to SigninRequest");
            throw new Error("client_id");
        }
        if (!redirect_uri){
            Log.error("No redirect_uri passed to SigninRequest");
            throw new Error("redirect_uri");
        }
        if (!response_type){
            Log.error("No response_type passed to SigninRequest");
            throw new Error("response_type");
        }
        if (!scope){
            Log.error("No scope passed to SigninRequest");
            throw new Error("scope");
        }
        
        this._url = url;
        this._client_id = client_id;
        this._redirect_uri = redirect_uri;
        this._response_type = response_type;
        this._scope = scope;
        this._state = new StateCtor(state);
    }
    
    get signinUrl(){
        if (!this._signinUrl){
            this._signinUrl = this._url;
            this._signinUrl = UrlUtility.addQueryParam(this._signinUrl, "state", this._state.toUriString());
            this._signinUrl = UrlUtility.addQueryParam(this._signinUrl, "client_id", this._client_id);
            this._signinUrl = UrlUtility.addQueryParam(this._signinUrl, "redirect_uri", this._redirect_uri);
            this._signinUrl = UrlUtility.addQueryParam(this._signinUrl, "response_type", this._response_type);
            this._signinUrl = UrlUtility.addQueryParam(this._signinUrl, "scope", this._scope);
        }
        
        return this._signinUrl;
    }
    
    get state(){
        return this._state.toClientStorageString();
    }
}