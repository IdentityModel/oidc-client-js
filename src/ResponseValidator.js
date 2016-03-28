import Log from './Log';
import MetadataService from './MetadataService';
import UserInfoService from './UserInfoService';
import JwtUtil from './JwtUtil';

const ProtocolClaims = ["nonce", "at_hash", "iat", "nbf", "exp", "aud", "iss", "c_hash"];

export default class ResponseValidator {

    constructor(settings, MetadataServiceCtor = MetadataService, UserInfoServiceCtor = UserInfoService, jwtUtil = JwtUtil) {
        if (!settings) {
            Log.error("No settings passed to ResponseValidator");
            throw new Error("settings");
        }

        this._settings = settings;
        this._metadataService = new MetadataServiceCtor(this._settings);
        this._userInfoService = new UserInfoServiceCtor(this._settings);
        this._jwtUtil = jwtUtil;
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
        Log.info("ResponseValidator.processClaims");

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
            Log.info("protocol claims not filtered")
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

        if (!state.nonce) {
            Log.error("No nonce on state");
            return Promise.reject(new Error("No nonce on state"));
        }

        let jwt = this._jwtUtil.parseJwt(response.id_token);
        if (!jwt || !jwt.header || !jwt.payload) {
            Log.error("Failed to parse id_token", jwt);
            return Promise.reject(new Error("Failed to parse id_token"));
        }

        var kid = jwt.header.kid;
        if (!kid) {
            Log.error("No kid found in id_token");
            return Promise.reject(new Error("No kid found in id_token"));
        }

        let audience = this._settings.client_id;
        if (!audience) {
            Log.error("Invalid audience/client_id value");
            return Promise.reject(new Error("Invalid audience/client_id value"));
        }

        return this._metadataService.getIssuer().then(issuer => {
            Log.info("Received issuer");

            return this._metadataService.getSigningKeys().then(keys => {
                if (!keys){
                    Log.error("No signing keys from metadata");
                    return Promise.reject(new Error("No signing keys from metadata"));
                }
                
                Log.info("Received signing keys");

                let key = keys.filter(key => {
                    return key.kid === kid;
                })[0];

                if (!key) {
                    Log.error("No key matching kid found in signing keys");
                    return Promise.reject(new Error("No key matching kid found in signing keys"));
                }

                if (!this.validateJwt(response.id_token, key, issuer, audience)) {
                    Log.error("Signature failed to validate");
                    return Promise.reject(new Error("Signature failed to validate"));
                }

                response.profile = jwt.payload;
                return response;
            });
        });
    }

    validateJwt(id_token, key, issuer, audience) {
        Log.info("ResponseValidator.validateJwt");
        
        if (key.kty === "RSA") {
            return this._jwtUtil.validateJwtRsa(id_token, key, issuer, audience);
        }
        else if (key.kty === "EC") {
            return this._jwtUtil.validateJwtEc(id_token, key, issuer, audience);
        }
        else {
            Log.error("Unsupported key type:", key.kty);
            return false;
        }
    }

    validateAccessToken(response) {
        Log.info("ResponseValidator.validateAccessToken");

        if (!response.profile) {
            Log.error("No profile loaded from id_token");
            return Promise.reject(new Error("No profile loaded from id_token"));
        }

        if (!response.profile.at_hash) {
            Log.error("No at_hash in id_token");
            return Promise.reject(new Error("No at_hash in id_token"));
        }

        if (!response.id_token) {
            Log.error("No id_token");
            return Promise.reject(new Error("No id_token"));
        }

        let jwt = this._jwtUtil.parseJwt(response.id_token);
        if (!jwt || !jwt.header) {
            Log.error("Failed to parse id_token", jwt);
            return Promise.reject(new Error("Failed to parse id_token"));
        }

        var hashAlg = jwt.header.alg;
        if (!hashAlg || hashAlg.length !== 5) {
            Log.error("Unsupported alg:", hashAlg);
            return Promise.reject(new Error("Unsupported alg: " + hashAlg));
        }

        var hashBits = hashAlg.substr(2, 3);
        if (!hashBits) {
            Log.error("Unsupported alg:", hashAlg, hashBits);
            return Promise.reject(new Error("Unsupported alg: " + hashAlg));
        }

        hashBits = parseInt(hashBits);
        if (hashBits !== 256 && hashBits !== 384 && hashBits !== 512) {
            Log.error("Unsupported alg:", hashAlg, hashBits);
            return Promise.reject(new Error("Unsupported alg: " + hashAlg));
        }

        let sha = "sha" + hashBits;
        var hash = this._jwtUtil.hashString(response.access_token, sha);
        if (!hash) {
            Log.error("access_token hash failed:", sha);
            return Promise.reject(new Error("Failed to validate at_hash"));
        }

        var left = hash.substr(0, hash.length / 2);
        var left_b64u = this._jwtUtil.hexToBase64Url(left);
        if (left_b64u !== response.profile.at_hash) {
            Log.error("Failed to validate at_hash", left_b64u, response.profile.at_hash);
            return Promise.reject(new Error("Failed to validate at_hash"));
        }

        return Promise.resolve(response);
    }
}