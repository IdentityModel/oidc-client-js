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

        return this.processSigninParams(state, response).then(response => {
            Log.info("state processed");
            return this.validateTokens(state, response).then(response => {
                Log.info("tokens validated");
                return this.processClaims(response).then(response => {
                    Log.info("claims processed");
                    return response;
                });
            });
        });
    }

    validateSignoutResponse(state, response) {
        Log.info("ResponseValidator.validateSignoutResponse");

        if (state.id !== response.state) {
            Log.error("State does not match");
            return Promise.reject(new Error("State does not match"));
        }

        // now that we know the state matches, take the stored data
        // and set it into the response so callers can get their state
        // this is important for both success & error outcomes
        Log.info("state validated");
        response.state = state.data;

        if (response.error) {
            Log.warn("Response was error", response.error);
            return Promise.reject(response);
        }

        return Promise.resolve(response);
    }

    processSigninParams(state, response) {
        Log.info("ResponseValidator.processSigninParams");

        if (state.id !== response.state) {
            Log.error("State does not match");
            return Promise.reject(new Error("State does not match"));
        }

        // now that we know the state matches, take the stored data
        // and set it into the response so callers can get their state
        // this is important for both success & error outcomes
        Log.info("state validated");
        response.state = state.data;

        if (response.error) {
            Log.warn("Response was error", response.error);
            return Promise.reject(response);
        }

        if (state.nonce && !response.id_token) {
            Log.error("Expecting id_token in response");
            return Promise.reject(new Error("No id_token in response"));
        }

        if (!state.nonce && response.id_token) {
            Log.error("Not expecting id_token in response");
            return Promise.reject(new Error("Unexpected id_token in response"));
        }

        return Promise.resolve(response);
    }

    processClaims(response) {
        Log.info("ResponseValidator.processClaims, incoming claims");

        response.profile = this.filterProtocolClaims(response.profile);

        if (this._settings.loadUserInfo) {

            Log.info("loading user info");
            return this._userInfoService.getClaims(response.access_token).then(claims => {

                response.profile = this.mergeClaims(response.profile, claims);
                Log.info("user info claims received, updated profile:", response.profile);

                return response;
            });
        }

        return Promise.resolve(response);
    }

    mergeClaims(claims1, claims2) {
        var result = Object.assign({}, claims1);

        for (let name in claims2) {
            var values = claims2[name];
            if (!Array.isArray(values)) {
                values = [values];
            }
            for (let value of values) {
                if (!result[name]) {
                    result[name] = value;
                }
                else if (Array.isArray(result[name])) {
                    result[name].push(value);
                }
                else {
                    result[name] = [result[name], value];
                }
            }
        }

        return result;
    }

    filterProtocolClaims(claims) {
        Log.info("ResponseValidator.filterProtocolClaims, incoming claims:", claims);

        var result = Object.assign({}, claims);

        if (this._settings.filterProtocolClaims) {
            ProtocolClaims.forEach(type => {
                delete result[type];
            });

            Log.info("protocol claims filtered", result);
        }
        else {
            Log.info("protocol claims filtered")
        }

        return result;
    }

    validateTokens(state, response) {
        Log.info("ResponseValidator.validateTokens");

        if (response.id_token) {

            if (response.access_token) {
                Log.info("Validating id_token and access_token");
                return this.validateIdTokenAndAccessToken(state, response);
            }

            Log.info("Validating id_token");
            return this.validateIdToken(state, response);
        }

        Log.info("No id_token to validate");
        return Promise.resolve(response);
    }

    validateIdTokenAndAccessToken(state, response) {
        Log.info("ResponseValidator.validateIdTokenAndAccessToken");

        return this.validateIdToken(state, response).then(response => {
            return this.validateAccessToken(response);
        });
    }

    validateIdToken(state, response) {
        Log.info("ResponseValidator.validateIdToken");

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
        Log.info("ResponseValidator.validateAccessToken");

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