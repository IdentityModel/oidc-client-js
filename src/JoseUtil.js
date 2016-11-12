// Copyright (c) Brock Allen & Dominick Baier. All rights reserved.
// Licensed under the Apache License, Version 2.0. See LICENSE in the project root for license information.

import { jws, KEYUTIL as KeyUtil, X509, crypto, hextob64u } from 'jsrsasign';
import Log from './Log';

const AllowedSigningAlgs = ['RS256', 'RS384', 'RS512', 'PS256', 'PS384', 'PS512', 'ES256', 'ES384', 'ES512'];

export default class JoseUtil {

    static parseJwt(jwt) {
        Log.info("JoseUtil.parseJwt");
        try {
            var token = jws.JWS.parse(jwt);
            return {
                header: token.headerObj,
                payload: token.payloadObj
            }
        }
        catch (e) {
            Log.error(e);
        }
    }

    static validateJwt(jwt, key, issuer, audience, clockSkew, now) {
        Log.info("JoseUtil.validateJwt");

        try {
            if (key.kty === "RSA") {
                if (key.e && key.n) {
                    key = KeyUtil.getKey(key);
                }
                else if (key.x5c && key.x5c.length) {
                    key = KeyUtil.getKey(X509.getPublicKeyFromCertPEM(key.x5c[0]));
                }
                else {
                    Log.error("RSA key missing key material", key);
                    return Promise.reject(new Error("RSA key missing key material"));
                }
            }
            else if (key.kty === "EC") {
                if (key.crv && key.x && key.y) {
                    key = KeyUtil.getKey(key);
                }
                else {
                    Log.error("EC key missing key material", key);
                    return Promise.reject(new Error("EC key missing key material"));
                }
            }
            else {
                Log.error("Unsupported key type", key && key.kty);
                return Promise.reject(new Error("Unsupported key type: " + key && key.kty));
            }

            return JoseUtil._validateJwt(jwt, key, issuer, audience, clockSkew, now);
        }
        catch (e) {
            Log.error(e && e.message || e);
            return Promise.reject("JWT validation failed");
        }
    }

    static _validateJwt(jwt, key, issuer, audience, clockSkew, now) {
        Log.info("JoseUtil._validateJwt");

        if (!clockSkew) {
            clockSkew = 0;
        }

        if (!now) {
            now = parseInt(Date.now() / 1000);
        }

        var payload = JoseUtil.parseJwt(jwt).payload;

        if (payload.iss !== issuer) {
            Log.error("Invalid issuer in token", payload.iss);
            return Promise.reject(new Error("Invalid issuer in token: " + payload.iss));
        }

        var validAudience = payload.aud === audience || (Array.isArray(payload.aud) && payload.aud.indexOf(audience) >= 0); 
        if (!validAudience) {
            Log.error("Invalid audience in token", payload.aud);
            return Promise.reject(new Error("Invalid audience in token: " + payload.aud));
        }

        var lowerNow = now + clockSkew;
        var upperNow = now - clockSkew;

        if (lowerNow < payload.iat) {
            Log.error("iat is in the future", payload.iat);
            return Promise.reject(new Error("iat is in the future: " + payload.iat));
        }

        if (lowerNow < payload.nbf) {
            Log.error("nbf is in the future", payload.nbf);
            return Promise.reject(new Error("nbf is in the future: " + payload.nbf));
        }

        if (payload.exp < upperNow) {
            Log.error("exp is in the past", payload.exp);
            return Promise.reject(new Error("exp is in the past:" + payload.exp));
        }

        try {
            if (!jws.JWS.verify(jwt, key, AllowedSigningAlgs)) {
                Log.error("signature validation failed");
                return Promise.reject(new Error("signature validation failed"));
            }
        }
        catch (e) {
            Log.error(e && e.message || e);
            return Promise.reject(new Error("signature validation failed"));
        }

        return Promise.resolve();
    }

    static hashString(value, alg) {
        Log.info("JoseUtil.hashString", value, alg);
        try {
            return crypto.Util.hashString(value, alg);
        }
        catch (e) {
            Log.error(e);
        }
    }

    static hexToBase64Url(value) {
        Log.info("JoseUtil.hexToBase64Url", value);
        try {
            return hextob64u(value);
        }
        catch (e) {
            Log.error(e);
        }
    }
}
