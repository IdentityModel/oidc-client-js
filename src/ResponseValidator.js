import Log from './Log';
import MetadataService from './MetadataService';
import UserInfoService from './UserInfoService';

const ProtocolClaims = ["nonce", "at_hash", "iat", "nbf", "exp", "aud", "iss", "c_hash"];

export default class ResponseValidator {

    constructor(settings, MetadataServiceCtor = MetadataService, UserInfoServiceCtor = UserInfoService) {
        if (!settings) {
            Log.error("No settings passed to ResponseValidator");
            throw new Error("settings");
        }

        this._settings = settings;
        this._metadataService = new MetadataServiceCtor(this._settings);
        this._userInfoService = new UserInfoServiceCtor(this._settings);
    }

    validateSigninResponse(state, response) {
        Log.info("ResponseValidator.validateSigninResponse");

        if (state.id !== response.state) {
            Log.error("State does not match");
            return Promise.reject(new Error("State does not match"));
        }

        // now that we know the state matches, take the stored data
        // and set it into the response so callers can get their state
        // this is important for both success & error outcomes
        response.state = state.data;

        if (response.error) {
            Log.warn("Response was error", response.error);
            return Promise.resolve(response);
        }

        if (state.nonce && !response.id_token) {
            Log.error("Expecting id_token in response");
            return Promise.reject(new Error("No id_token in response"));
        }

        let p = null;

        if (response.id_token) {
            if (response.access_token) {
                Log.info("Validating id_token and access_token");
                p = validateIdTokenAndAccessToken(state, response);
            }
            else {
                Log.info("Validating id_token");
                p = validateIdToken(state, response);
            }
        }
        else {
            Log.info("No id_token to validate");
            p = Promise.resolve(response);
        }

        return p.then(response => {
            response.profile = this.filterProtocolClaims(response.profile);

            // if (this._settings.loadUserInfo) {

            //     Log.info("loading user info");
            //     return this._userInfoService.getClaims(response.access_token).then(claims => {
                    
            //         Log.info("user info claims received");
            //         response.profile = this.mergeClaims(response.profile, claims);
                    
            //         return response;
            //     });
            // }
            
            return response;
        });
    }
    
    // mergeClaims(claims1, claims2){
    //     return claims1;
    // }
    
    filterProtocolClaims(claims){
        if (claims && this._settings.filterProtocolClaims) {
            ProtocolClaims.forEach(type => {
                delete claims[type];
            });

            Log.info("protocol claims filtered", claims);
        }
        return claims;
    }

    validateIdTokenAndAccessToken(state, response) {
        return this.validateIdToken(state, response).then(response => {
            return this.validateAccessToken(response);
        });
    }

    validateIdToken(state, response) {
        return Promise.resolve(response);
        
        //     log("OidcClient.validateIdTokenAsync");

        //     var client = this;
        //     var settings = client._settings;

        //     return client.loadX509SigningKeyAsync().then(function (cert) {

        //         var jws = new KJUR.jws.JWS();
        //         if (jws.verifyJWSByPemX509Cert(id_token, cert)) {
        //             var id_token_contents = JSON.parse(jws.parsedJWS.payloadS);

        //             if (nonce !== id_token_contents.nonce) {
        //                 return error("Invalid nonce");
        //             }

        //             return client.loadMetadataAsync().then(function (metadata) {

        //                 if (id_token_contents.iss !== metadata.issuer) {
        //                     return error("Invalid issuer");
        //                 }

        //                 if (id_token_contents.aud !== settings.client_id) {
        //                     return error("Invalid audience");
        //                 }

        //                 var now = parseInt(Date.now() / 1000);

        //                 // accept tokens issues up to 5 mins ago
        //                 var diff = now - id_token_contents.iat;
        //                 if (diff > (5 * 60)) {
        //                     return error("Token issued too long ago");
        //                 }

        //                 if (id_token_contents.exp < now) {
        //                     return error("Token expired");
        //                 }

        //                 if (access_token && settings.load_user_profile) {
        //                     // if we have an access token, then call user info endpoint
        //                     return client.loadUserProfile(access_token, id_token_contents).then(function (profile) {
        //                         return copy(profile, id_token_contents);
        //                     });
        //                 }
        //                 else {
        //                     // no access token, so we have all our claims
        //                     return id_token_contents;
        //                 }

        //             });
        //         }
        //         else {
        //             return error("JWT failed to validate");
        //         }

        //     });
    }

    validateAccessToken(response) {
        return Promise.resolve(response);

        //     log("OidcClient.validateAccessTokenAsync");

        //     if (!id_token_contents.at_hash) {
        //         return error("No at_hash in id_token");
        //     }

        //     var hash = KJUR.crypto.Util.sha256(access_token);
        //     var left = hash.substr(0, hash.length / 2);
        //     var left_b64u = hextob64u(left);

        //     if (left_b64u !== id_token_contents.at_hash) {
        //         return error("at_hash failed to validate");
        //     }

        //     return resolve();
    }
}