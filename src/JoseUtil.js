// Copyright (c) Brock Allen & Dominick Baier. All rights reserved.
// Licensed under the Apache License, Version 2.0. See LICENSE in the project root for license information.

//import { jws, KEYUTIL as KeyUtil, X509, crypto, hextob64u, b64tohex } from 'jsrsasign';
import { Log } from './Log';
import { TextEncoder } from 'text-encoding-shim';

const AllowedSigningAlgs = ['RS256', 'RS384', 'RS512', 'PS256', 'PS384', 'PS512', 'ES256', 'ES384', 'ES512'];

export class JoseUtil {

    static getCrypto() {
        return window.crypto || window.msCrypto; // for IE11
    }

    static parseJwt(jwt) {
        Log.debug("JoseUtil.parseJwt");
        if(jwt == null) {
            return;
        }

        try {
            const tokenParts = jwt.split('.');
            const headerBase64 = JoseUtil._padBase64(tokenParts[0]);
            const headerJson = JoseUtil._b64DecodeUnicode(headerBase64);
            const header = JSON.parse(headerJson);
            const payloadBase64 = JoseUtil._padBase64(tokenParts[1]);
            const payloadJson = JoseUtil._b64DecodeUnicode(payloadBase64);
            const payload = JSON.parse(payloadJson);

            return {
                header: header,
                payload: payload
            };
        } catch (e) {
            Log.error(e);
            console.warn(e);
        }
    }

    static validateJwt(jwt, key, issuer, audience, clockSkew, now) {
        Log.debug("JoseUtil.validateJwt");

        try {
            return JoseUtil._validateJwt(jwt, key, issuer, audience, clockSkew, now);
        } catch (e) {
            Log.error(e && e.message || e);
            return Promise.reject(new Error("JWT validation failed: " + e));
        }
    }

    static _getKey(jwt, key) {
        const keys = jwt.keys;
        const kid = key.kid;
        const kty = key.kty;

        if (kid && keys) {
            key = keys.find(k => k['kid'] === kid /* && k['use'] === 'sig' */ );
        } else {
            let matchingKeys = keys.filter(
                k => k['kty'] === kty && k['use'] === 'sig'
            );

            if (matchingKeys.length === 1) {
                key = matchingKeys[0];
            } else if (matchingKeys.length > 1) {
                let error = 'More than one matching key found. Please specify a kid in the id_token header.';
                console.error(error);
                return Promise.reject(new Error(error));
            } else {
                let error = 'No matching key found';
                console.error(error);
                return Promise.reject(new Error(error));
            }
        }

        return Promise.resolve(key);
    }

    static _validateJwt(jwt, key, issuer, audience, clockSkew, now) {
        if (!clockSkew) {
            clockSkew = 0;
        }

        if (!now) {
            now = parseInt(Date.now() / 1000);
        }

        var payload = JoseUtil.parseJwt(jwt).payload;

        if (!payload.iss) {
            Log.error("JoseUtil._validateJwt: issuer was not provided");
            return Promise.reject(new Error("issuer was not provided"));
        }
        if (payload.iss !== issuer) {
            Log.error("JoseUtil._validateJwt: Invalid issuer in token", payload.iss);
            return Promise.reject(new Error("Invalid issuer in token: " + payload.iss));
        }

        if (!payload.aud) {
            Log.error("JoseUtil._validateJwt: aud was not provided");
            return Promise.reject(new Error("aud was not provided"));
        }
        var validAudience = payload.aud === audience || (Array.isArray(payload.aud) && payload.aud.indexOf(audience) >= 0);
        if (!validAudience) {
            Log.error("JoseUtil._validateJwt: Invalid audience in token", payload.aud);
            return Promise.reject(new Error("Invalid audience in token: " + payload.aud));
        }

        var lowerNow = now + clockSkew;
        var upperNow = now - clockSkew;

        if (!payload.iat) {
            Log.error("JoseUtil._validateJwt: iat was not provided");
            return Promise.reject(new Error("iat was not provided"));
        }
        if (lowerNow < payload.iat) {
            Log.error("JoseUtil._validateJwt: iat is in the future", payload.iat);
            return Promise.reject(new Error("iat is in the future: " + payload.iat));
        }

        if (payload.nbf && lowerNow < payload.nbf) {
            Log.error("JoseUtil._validateJwt: nbf is in the future", payload.nbf);
            return Promise.reject(new Error("nbf is in the future: " + payload.nbf));
        }

        if (!payload.exp) {
            Log.error("JoseUtil._validateJwt: exp was not provided");
            return Promise.reject(new Error("exp was not provided"));
        }
        if (payload.exp < upperNow) {
            Log.error("JoseUtil._validateJwt: exp is in the past", payload.exp);
            return Promise.reject(new Error("exp is in the past:" + payload.exp));
        }

        try {
            return JoseUtil._verifyJwtSignature(jwt, key);
        } catch (e) {
            Log.error(e && e.message || e);
            return Promise.reject(new Error("signature validation failed: " + e));
        }
    }

    static _verifyJwtSignature(jwt, key) {
        var alg = JoseUtil.parseJwt(jwt).header.alg;
        var msg = '';
        if(AllowedSigningAlgs.indexOf(alg) === -1) {
            msg = 'Algorithm ' + alg + ' in header is not allowed';
            Log.error(msg);
            return Promise.reject(new Error(msg));
        }

        if(alg.substr(0, 2).toUpperCase() !== key.kty.substr(0, 2).toUpperCase()) {
            msg = 'Algorithm ' + key.kty + ' in key doesn\'t match signature';
            Log.error(msg);
            return Promise.reject(new Error(msg));
        }
 
        var splitted = jwt.split('.');
        var body = splitted[1];
        var sig = splitted[2];

        let inferredAlg = this._inferHashAlgorithm(alg);

        return crypto.subtle.importKey('jwk', key, inferredAlg, true, ['verify'])
            .catch(reason => new Error('Error while loading key: ' + reason))
            .then(cryptokey => crypto.subtle.verify(alg, cyptokey, new TextEncoder().encode(sig), TextEncoder.encode(body)))
            .catch(reason => new Error('Error while veryfing signature: ' + reason))
            .then(result => result ? Promise.resolve() : Promise.reject(new Error("signature validation failed")));
    }

    static hashString(value, alg) {
        try {
            const valueAsBytes = new TextEncoder().encode(value);
            console.log('Hashing using ' + this._inferHashAlgorithm(alg) + ' ' );
            return this.getCrypto().subtle.digest(this._inferHashAlgorithm(alg), valueAsBytes)
                .catch(reason => Promise.reject(new Error('Error in hashString during digest: ' + reason)))
                .then(resultBytes => {
                    return String.fromCharCode.apply(null, new Uint16Array(resultBytes));
                } )
                .catch(reason => {
                    return Promise.reject(reason.constructor.name === "Error" ? reason : new Error('Error in hashString during encoding: ' + reason))
                })
                ;
        } catch (e) {
            Log.error(e);
            return Promise.reject(new Error('Error while hashing: ' + e));
        }
    }

    static hexToBase64Url(value) {
        try {
            var s = (value.length % 2 == 1) ? "0" + value : value;
            s = s.replace(/\=/g, "");
            s = s.replace(/\+/g, "-");
            s = s.replace(/\//g, "_");
            return s;
        } catch (e) {
            Log.error(e);
        }
    }

    static _padBase64(base64data) {
        while (base64data.length % 4 !== 0) {
            base64data += '=';
        }
        return base64data;
    }

    static _b64DecodeUnicode(str) {
        const base64 = str.replace(/\-/g, '+').replace(/\_/g, '/');

        return decodeURIComponent(
            atob(base64)
            .split('')
            .map(function (c) {
                return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
            })
            .join('')
        );
    }

    static _inferHashAlgorithm(alg) {
    
        if (!alg.match(/^.S[0-9]{3}$/)) {
          throw new Error('Algorithm not supported: ' + alg);
        }
    
        return 'sha-' + alg.substr(2);
      }

    static _getCrypto() {
        // IE11 is prefixed
        return window.crypto || window.msCrypto || global.crypto || global.msCrypto;
    }
}