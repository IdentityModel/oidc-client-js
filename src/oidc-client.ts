/*
 * Copyright 2015 Dominick Baier, Brock Allen
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
/// <reference path="./lib/defaultHttpRequest.ts" />
/// <reference path="./lib/defaultPromiseFactory.ts" />
/// <reference path="./typings/jsrsasign/jws.d.ts" />
/// <reference path="./typings/jsrsasign/crypto/Util.d.ts" />
/// <reference path="./typings/openid-configuration.d.ts" />

declare var hextob64u: (hexString: string) => string;

function log(...args: any[]) {
    //var param = [].join.call(arguments);
    //console.log(param);
}

function copy<TSource, TDest>(obj: TSource, target?: TDest) {
    target = target || <TDest>{};
    for (var key in obj) {
        if (obj.hasOwnProperty(key)) {
            target[key] = obj[key];
        }
    }
    return target;
}

function rand() {
    return ((Date.now() + Math.random()) * Math.random()).toString().replace(".", "");
}

function resolve<T>(param?: T) {
    return _promiseFactory.resolve(param);
}

function error<T>(message: string): DefaultPromise<T> {
    return _promiseFactory.reject(Error(message));
}

function getJson<T>(url: string, token?: string): PromiseLike<T> {
    log("getJson", url);

    var config: any = {};

    if (token) {
        config.headers = {"Authorization": "Bearer " + token};
    }

    return _httpRequest.getJSON<T>(url, config);
}

interface OidcKey {
    kty: string;
    x5c: string[];
}

type OidcClaim = string | string[] | number | boolean | Object;

interface OidcIdToken {
    iss: string;
    sub: string;
    aud: string | string[];
    exp: number;
    iat: number;
    auth_time?: number;
    nonce?: string;
    acr?: string;
    amr?: string[];
    azp?: string;
    at_hash?: string;
    [claim: string]: OidcClaim;
}

interface OidcAuthenticationResponse {
    access_token?: string;
    code?: string;
    token_type?: string;
    id_token?: string;
    state?: string;
    expires_in?: string;
    error?: string;
    scope?: string;
    session_state?: string; // Where is this coming from??? It doesn't appear in the spec.
}

interface OidcClientSettings {
    authority: string;
    authorization_endpoint?: string;
    client_id: string;
    filter_protocol_claims?: boolean;
    load_user_profile?: boolean;
    post_logout_redirect_uri?: string;
    request_state_key?: string;
    request_state_store?: Storage;
    response_type?: string;
    jwks?: { keys: OidcKey[] };
    metadata?: OpenIdMetadata; // TODO: Pull well know open id json schema.
}

class OidcClient {
    _settings: OidcClientSettings;
    
    constructor(settings?: OidcClientSettings){
        this._settings = settings || <OidcClientSettings>{};

        if (!this._settings.request_state_key) {
            this._settings.request_state_key = "OidcClient.request_state";
        }

        if (!this._settings.request_state_store) {
            this._settings.request_state_store = window.localStorage;
        }

        if (typeof this._settings.load_user_profile === 'undefined') {
            this._settings.load_user_profile = true;
        }

        if (typeof this._settings.filter_protocol_claims === 'undefined') {
            this._settings.filter_protocol_claims = true;
        }

        if (this._settings.authority && this._settings.authority.indexOf('.well-known/openid-configuration') < 0) {
            if (this._settings.authority[this._settings.authority.length - 1] !== '/') {
                this._settings.authority += '/';
            }
            this._settings.authority += '.well-known/openid-configuration';
        }

        if (!this._settings.response_type) {
            this._settings.response_type = "id_token token";
        }
    }
    
    get isOidc() {
        if (this._settings.response_type) {
            var result = this._settings.response_type.split(/\s+/g).filter(function (item) {
                return item === "id_token";
            });
            return !!(result[0]);
        }
        return false;
    }
    
    get isOAuth() {
        if (this._settings.response_type) {
            var result = this._settings.response_type.split(/\s+/g).filter(function (item) {
                return item === "token";
            });
            return !!(result[0]);
        }
        return false;
    }
    
    static parseOidcResult(queryString: string): OidcAuthenticationResponse {
        log("parseOidcResult");

        queryString = queryString || location.hash;

        var idx = queryString.lastIndexOf("#");
        if (idx >= 0) {
            queryString = queryString.substr(idx + 1);
        }

        var params = <any>{},
            regex = /([^&=]+)=([^&]*)/g,
            m: RegExpExecArray;

        var counter = 0;
        while (m = regex.exec(queryString)) {
            params[decodeURIComponent(m[1])] = decodeURIComponent(m[2]);
            if (counter++ > 50) {
                return {
                    error: "Response exceeded expected number of parameters"
                };
            }
        }

        for (var prop in params) {
            return params;
        }
    }
    
    loadX509SigningKeyAsync(): PromiseLike<string> {
        log("OidcClient.loadX509SigningKeyAsync");

        var settings = this._settings;

        function getKeyAsync(jwks: { keys: OidcKey[] }): DefaultPromise<string> {
            if (!jwks.keys || !jwks.keys.length) {
                return error("Signing keys empty");
            }

            var key = jwks.keys[0];
            if (key.kty !== "RSA") {
                return error("Signing key not RSA");
            }

            if (!key.x5c || !key.x5c.length) {
                return error("RSA keys empty");
            }

            return resolve(key.x5c[0]);
        }

        if (settings.jwks) {
            return getKeyAsync(settings.jwks);
        }

        return this.loadMetadataAsync().then(function (metadata) {
            if (!metadata.jwks_uri) {
                return error("Metadata does not contain jwks_uri");
            }

            return getJson<{ keys: OidcKey[] }>(metadata.jwks_uri).then((jwks) => {
                settings.jwks = jwks;
                return getKeyAsync(jwks);
            }, function (err) {
                return error<string>("Failed to load signing keys (" + err && err.message + ")");
            });
        });
    };
    
    loadMetadataAsync(): PromiseLike<OpenIdMetadata> {
        log("OidcClient.loadMetadataAsync");

        var settings = this._settings;

        if (settings.metadata) {
            return resolve(settings.metadata);
        }

        if (!settings.authority) {
            return error("No authority configured");
        }

        return getJson<OpenIdMetadata>(settings.authority)
            .then<OpenIdMetadata>(function (metadata) {
                settings.metadata = metadata;
                return metadata;
            }, function (err) {
                return error("Failed to load metadata (" + err && err.message + ")");
            });
    };
    
    loadUserProfile(access_token: string): PromiseLike<{ [claim: string]: OidcClaim }> {
        log("OidcClient.loadUserProfile");

        return this.loadMetadataAsync().then(function (metadata) {

            if (!metadata.userinfo_endpoint) {
                return error("Metadata does not contain userinfo_endpoint");
            }

            return getJson(metadata.userinfo_endpoint, access_token);
        });
    }
    
    loadAuthorizationEndpoint(): PromiseLike<string> {
        log("OidcClient.loadAuthorizationEndpoint");

        if (this._settings.authorization_endpoint) {
            return resolve(this._settings.authorization_endpoint);
        }

        if (!this._settings.authority) {
            return error("No authorization_endpoint configured");
        }

        return this.loadMetadataAsync().then(function (metadata) {
            if (!metadata.authorization_endpoint) {
                return error("Metadata does not contain authorization_endpoint");
            }

            return metadata.authorization_endpoint;
        });
    };
    
    createTokenRequestAsync() {
        log("OidcClient.createTokenRequestAsync");

        var client = this;
        var settings = client._settings;

        return client.loadAuthorizationEndpoint().then(function (authorization_endpoint) {

            var state = rand();
            var url = authorization_endpoint + "?state=" + encodeURIComponent(state);

            if (client.isOidc) {
                var nonce = rand();
                url += "&nonce=" + encodeURIComponent(nonce);
            }

            var required = ["client_id", "redirect_uri", "response_type", "scope"];
            required.forEach(function (key) {
                var value = settings[key];
                if (value) {
                    url += "&" + key + "=" + encodeURIComponent(value);
                }
            });

            var optional = ["prompt", "display", "max_age", "ui_locales", "id_token_hint", "login_hint", "acr_values"];
            optional.forEach(function (key) {
                var value = settings[key];
                if (value) {
                    url += "&" + key + "=" + encodeURIComponent(value);
                }
            });

            var request_state = {
                oidc: client.isOidc,
                oauth: client.isOAuth,
                state: state
            };

            if (nonce) {
                request_state["nonce"] = nonce;
            }

            settings.request_state_store.setItem(settings.request_state_key, JSON.stringify(request_state));

            return {
                request_state: request_state,
                url: url
            };
        });
    };
    
    createLogoutRequestAsync(id_token_hint: string): PromiseLike<string> {
        log("OidcClient.createLogoutRequestAsync");

        var settings = this._settings;
        return this.loadMetadataAsync().then(function (metadata) {
            if (!metadata.end_session_endpoint) {
                return error("No end_session_endpoint in metadata");
            }

            var url = metadata.end_session_endpoint;
            if (id_token_hint && settings.post_logout_redirect_uri) {
                url += "?post_logout_redirect_uri=" + encodeURIComponent(settings.post_logout_redirect_uri);
                url += "&id_token_hint=" + encodeURIComponent(id_token_hint);
            }
            return url;
        });
    };
    
    validateIdTokenAsync(id_token: string, nonce: string, access_token?: string): PromiseLike<OidcIdToken> {
        log("OidcClient.validateIdTokenAsync");

        var client = this;
        var settings = client._settings;

        return client.loadX509SigningKeyAsync().then((cert) => {
            var jws = new KJUR.jws.JWS();
            if (jws.verifyJWSByPemX509Cert(id_token, cert)) {
                var id_token_contents: OidcIdToken = JSON.parse(jws.parsedJWS.payloadS);

                if (nonce !== id_token_contents.nonce) {
                    return error("Invalid nonce");
                }

                return client.loadMetadataAsync().then(function (metadata) {

                    if (id_token_contents.iss !== metadata.issuer) {
                        return error("Invalid issuer");
                    }

                    if (id_token_contents.aud !== settings.client_id) {
                        return error("Invalid audience");
                    }

                    var now = parseInt(<any>(Date.now() / 1000));

                    // accept tokens issues up to 5 mins ago
                    var diff = now - id_token_contents.iat;
                    if (diff > (5 * 60)) {
                        return error("Token issued too long ago");
                    }

                    if (id_token_contents.exp < now) {
                        return error("Token expired");
                    }

                    if (access_token && settings.load_user_profile) {
                        // if we have an access token, then call user info endpoint
                        return client.loadUserProfile(access_token).then(function (profile) {
                            return copy(profile, id_token_contents);
                        });
                    }
                    else {
                        // no access token, so we have all our claims
                        return id_token_contents;
                    }

                });
            }
            else {
                return error("JWT failed to validate");
            }

        });

    };
    
    validateAccessTokenAsync(id_token_contents: OidcIdToken, access_token: string) {
        log("OidcClient.validateAccessTokenAsync");

        if (!id_token_contents.at_hash) {
            return error("No at_hash in id_token");
        }

        var hash = KJUR.crypto.Util.sha256(access_token);
        var left = hash.substr(0, hash.length / 2);
        var left_b64u = hextob64u(left);

        if (left_b64u !== id_token_contents.at_hash) {
            return error("at_hash failed to validate");
        }

        return resolve();
    };
    
    validateIdTokenAndAccessTokenAsync(id_token: string, nonce: string, access_token: string) {
        log("OidcClient.validateIdTokenAndAccessTokenAsync");

        var client = this;

        return client.validateIdTokenAsync(id_token, nonce, access_token).then(function (id_token_contents) {

            return client.validateAccessTokenAsync(id_token_contents, access_token).then(function () {

                return id_token_contents;

            });

        });
    };
    
    processResponseAsync(queryString: string) {
        log("OidcClient.processResponseAsync");

        var client = this;
        var settings = client._settings;

        var request_state = settings.request_state_store.getItem(settings.request_state_key);
        settings.request_state_store.removeItem(settings.request_state_key);

        if (!request_state) {
            return error("No request state loaded");
        }

        request_state = JSON.parse(request_state);
        if (!request_state) {
            return error("No request state loaded");
        }

        if (!request_state.state) {
            return error("No state loaded");
        }

        var result = OidcClient.parseOidcResult(queryString);
        if (!result) {
            return error("No OIDC response");
        }

        if (result.error) {
            return error(result["error"]);
        }

        if (result.state !== request_state.state) {
            return error("Invalid state");
        }

        if (request_state.oidc) {
            if (!result.id_token) {
                return error("No identity token");
            }

            if (!request_state.nonce) {
                return error("No nonce loaded");
            }
        }

        if (request_state.oauth) {
            if (!result.access_token) {
                return error("No access token");
            }

            if (!result.token_type || result.token_type.toLowerCase() !== "bearer") {
                return error("Invalid token type");
            }

            if (!result.expires_in) {
                return error("No token expiration");
            }
        }

        var promise: PromiseLike<OidcIdToken> = resolve<OidcIdToken>();
        if (request_state.oidc && request_state.oauth) {
            promise = client.validateIdTokenAndAccessTokenAsync(result.id_token, request_state.nonce, result.access_token);
        }
        else if (request_state.oidc) {
            promise = client.validateIdTokenAsync(result.id_token, request_state.nonce);
        }

        return promise.then(function (profile) {
            if (profile && settings.filter_protocol_claims) {
                var remove = ["nonce", "at_hash", "iat", "nbf", "exp", "aud", "iss"];
                remove.forEach(function (key) {
                    delete profile[key];
                });
            }

            return {
                profile: profile,
                id_token: result.id_token,
                access_token: result.access_token,
                expires_in: result.expires_in,
                scope: result.scope,
                session_state : result.session_state
            };
        });
    };
};
