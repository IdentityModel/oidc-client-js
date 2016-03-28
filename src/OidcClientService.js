import Log from './Log';
import OidcClientSettings from './OidcClientSettings';
import MetadataService from './MetadataService';
import SigninRequest from './SigninRequest';
import SigninResponse from './SigninResponse';
import SignoutRequest from './SignoutRequest';
import SignoutResponse from './SignoutResponse';
import WebStorageStateStore from './WebStorageStateStore';
import ResponseValidator from './ResponseValidator';

export default class OidcClientService {
    constructor(settings, 
        stateStore = new WebStorageStateStore(), 
        ResponseValidatorCtor = ResponseValidator,
        MetadataServiceCtor = MetadataService
    ){
        if (!settings) {
            Log.error("No settings passed to OidcClientService");
            throw new Error("settings");
        }
        
        this._settings = new OidcClientSettings(settings);
        this._stateStore = stateStore;
        this._validator = new ResponseValidatorCtor(this._settings);
        this._metadataService = new MetadataServiceCtor(this._settings);
    }
    
    get settings() {
        return this._settings;
    }
    
    createSigninRequest({
        response_type, scope, redirect_uri, data, 
        prompt, display, max_age, ui_locales, id_token_hint, login_hint, acr_values}={}
    ) {
        Log.info("OidcClientService.createSigninRequest");
        
        let client_id = this._settings.client_id;
        response_type = response_type || this._settings.response_type;
        scope = scope || this._settings.scope;
        redirect_uri = redirect_uri || this._settings.redirect_uri;
        
        // id_token_hint, login_hint aren't allowed on _settings
        prompt = prompt || this._settings.prompt;
        display = display || this._settings.display;
        max_age = max_age  || this._settings.max_age ;
        ui_locales = ui_locales || this._settings.ui_locales;
        acr_values = acr_values || this._settings.acr_values;

        return this._metadataService.getAuthorizationEndpoint().then(url => {
            Log.info("Received authorization endpoint", url);
            
            let request = new SigninRequest({url, 
                client_id,
                redirect_uri,
                response_type,
                scope,
                data,
                prompt, display, max_age, ui_locales, id_token_hint, login_hint, acr_values
            });
            
            var state = request.state;
            this._stateStore.set(state.id, state.toStorageString());
            
            return request;
            
        }, err => {
            Log.error("Failed to create signin request", err);
            throw new Error("Failed to create signin request");
        });
    }
    
    processSigninResponse(url){
        Log.info("OidcClientService.processSigninResponse");
        
        var response = new SigninResponse(url);
        if (!response.state) {
            Log.error("No state in response");
            return Promise.reject(new Error("No state in response"));
        }
        
        var stateKey = response.state;
        
        return this._stateStore.remove(stateKey).then(state => {
            if (!state){
                Log.error("No matching state found in storage");
                throw new Error("Failed to process response");
            }
            
            Log.info("Received state from storage; validating response");
            return this._validator.validateSigninResponse(state, response);
            
        }, err => {
            Log.error("Failed to process response", err);
            return Promise.reject(new Error("Failed to process response"));
        });
    }
    
    createSignoutRequest({id_token_hint, data, post_logout_redirect_uri}={}){
        Log.info("OidcClientService.createSignoutRequest");
        
        post_logout_redirect_uri = post_logout_redirect_uri || this._settings.post_logout_redirect_uri;
        
        return this._metadataService.getEndSessionEndpoint().then(url => {
            Log.info("Received end session endpoint", url);
            
            let request = new SignoutRequest({url,
                id_token_hint,
                post_logout_redirect_uri,
                data
            });
            
            var state = request.state;
            this._stateStore.set(state.id, state.toStorageString());

            return request;
        }, err => {
            Log.error("Failed to create signout request", err);
            throw new Error("Failed to create signout request");
        });
    }
    
    processSignoutResponse(url){
        Log.info("OidcClientService.processSignoutResponse");
        
        var response = new SignoutResponse(url);
        if (!response.state) {
            Log.error("No state in response");
            return Promise.reject(new Error("No state in response"));
        }
        
        var stateKey = response.state;
        
        return this._stateStore.remove(stateKey).then(state => {
            if (!state){
                Log.error("No matching state found in storage");
                throw new Error("Failed to process response");
            }
            
            Log.info("Received state from storage; validating response");
            return this._validator.validateSignoutResponse(state, response);
            
        }, err => {
            Log.error("Failed to process response", err);
            return Promise.reject(new Error("Failed to process response"));
        });
    }
}
