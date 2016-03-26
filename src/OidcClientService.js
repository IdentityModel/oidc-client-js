import Log from './Log';
import OidcClientSettings from './OidcClientSettings';
import MetadataService from './MetadataService';
import SigninRequest from './SigninRequest';
import SignoutRequest from './SignoutRequest';
import WebStorageStateStore from './WebStorageStateStore';

export default class OidcClientService {
    constructor(settings, 
        stateStore = new WebStorageStateStore(), 
        MetadataServiceCtor = MetadataService
    ){
        if (!settings) {
            Log.error("No settings passed to OidcClientService");
            throw new Error("settings");
        }
        
        this._settings = new OidcClientSettings(settings);
        this._stateStore = stateStore;
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
    }

// OidcClient.prototype.processResponseAsync = function (queryString) {
//     log("OidcClient.processResponseAsync");

//     var client = this;
//     var settings = client._settings;

//     var request_state = settings.request_state_store.getItem(settings.request_state_key);
//     settings.request_state_store.removeItem(settings.request_state_key);

//     if (!request_state) {
//         return error("No request state loaded");
//     }

//     request_state = JSON.parse(request_state);
//     if (!request_state) {
//         return error("No request state loaded");
//     }

//     if (!request_state.state) {
//         return error("No state loaded");
//     }

//     var result = parseOidcResult(queryString);
//     if (!result) {
//         return error("No OIDC response");
//     }

//     if (result.error) {
//         return error(result.error);
//     }

//     if (result.state !== request_state.state) {
//         return error("Invalid state");
//     }

//     if (request_state.oidc) {
//         if (!result.id_token) {
//             return error("No identity token");
//         }

//         if (!request_state.nonce) {
//             return error("No nonce loaded");
//         }
//     }

//     if (request_state.oauth) {
//         if (!result.access_token) {
//             return error("No access token");
//         }

//         if (!result.token_type || result.token_type.toLowerCase() !== "bearer") {
//             return error("Invalid token type");
//         }

//         if (!result.expires_in) {
//             return error("No token expiration");
//         }
//     }

//     var promise = resolve();
//     if (request_state.oidc && request_state.oauth) {
//         promise = client.validateIdTokenAndAccessTokenAsync(result.id_token, request_state.nonce, result.access_token);
//     }
//     else if (request_state.oidc) {
//         promise = client.validateIdTokenAsync(result.id_token, request_state.nonce);
//     }

//     return promise.then(function (profile) {
//         if (profile && settings.filter_protocol_claims) {
//             var remove = ["nonce", "at_hash", "iat", "nbf", "exp", "aud", "iss"];
//             remove.forEach(function (key) {
//                 delete profile[key];
//             });
//         }

//         return {
//             profile: profile,
//             id_token: result.id_token,
//             access_token: result.access_token,
//             expires_in: result.expires_in,
//             scope: result.scope,
//             session_state : result.session_state
//         };
//     });
// }
}
