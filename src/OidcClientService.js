import Log from './Log';
import OidcClientSettings from './OidcClientSettings';
import MetadataService from './MetadataService';
import SigninRequest from './SigninRequest';
import SignoutRequest from './SignoutRequest';

export default class OidcClientService {
    constructor(settings, MetadataServiceCtor = MetadataService) {
        if (!settings) {
            Log.error("No settings passed to OidcClientService");
            throw new Error("settings");
        }
        
        this._settings = new OidcClientSettings(settings);
        this._metadataService = new MetadataServiceCtor(this._settings);
    }
    
    get settings() {
        return this._settings;
    }
    
    createSigninRequest(request) {
        Log.info("createSigninRequest");
    }
    
    processSigninResponse(){
        Log.info("processSigninResponse");
    }
    
    createSignoutRequest(request){
        Log.info("createSignoutRequest");
        
        
    }
    
//     OidcClient.prototype.createTokenRequestAsync = function () {
//     log("OidcClient.createTokenRequestAsync");

//     var client = this;
//     var settings = client._settings;

//     return client.loadAuthorizationEndpoint().then(function (authorization_endpoint) {

//         var state = rand();
//         var url = authorization_endpoint + "?state=" + encodeURIComponent(state);

//         if (client.isOidc) {
//             var nonce = rand();
//             url += "&nonce=" + encodeURIComponent(nonce);
//         }

//         var required = ["client_id", "redirect_uri", "response_type", "scope"];
//         required.forEach(function (key) {
//             var value = settings[key];
//             if (value) {
//                 url += "&" + key + "=" + encodeURIComponent(value);
//             }
//         });

//         var optional = ["prompt", "display", "max_age", "ui_locales", "id_token_hint", "login_hint", "acr_values"];
//         optional.forEach(function (key) {
//             var value = settings[key];
//             if (value) {
//                 url += "&" + key + "=" + encodeURIComponent(value);
//             }
//         });

//         var request_state = {
//             oidc: client.isOidc,
//             oauth: client.isOAuth,
//             state: state
//         };

//         if (nonce) {
//             request_state["nonce"] = nonce;
//         }

//         settings.request_state_store.setItem(settings.request_state_key, JSON.stringify(request_state));

//         return {
//             request_state: request_state,
//             url: url
//         };
//     });
// }

// OidcClient.prototype.createLogoutRequestAsync = function (id_token_hint) {
//     log("OidcClient.createLogoutRequestAsync");

//     var settings = this._settings;
//     return this.loadMetadataAsync().then(function (metadata) {
//         if (!metadata.end_session_endpoint) {
//             return error("No end_session_endpoint in metadata");
//         }

//         var url = metadata.end_session_endpoint;
//         if (id_token_hint && settings.post_logout_redirect_uri) {
//             url += "?post_logout_redirect_uri=" + encodeURIComponent(settings.post_logout_redirect_uri);
//             url += "&id_token_hint=" + encodeURIComponent(id_token_hint);
//         }
//         return url;
//     });
// }



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
