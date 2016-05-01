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
                    return false;
                }
            }
            else if (key.kty === "EC") {
                if (key.crv && key.x && key.y) {
                    key = KeyUtil.getKey(key);
                }
                else {
                    Log.error("EC key missing key material", key);
                    return false;
                }
            }
            else {
                Log.error("Unsupported key type", key.kty);
                return false;
            }

            return JoseUtil._validateJwt(jwt, key, issuer, audience, clockSkew, now);
        }
        catch (e) {
            Log.error(e);
        }

        return false;
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
            return false;
        }

        if (payload.aud !== audience) {
            Log.error("Invalid audience in token", payload.aud);
            return false;
        }

        var lowerNow = now + clockSkew;
        var upperNow = now - clockSkew;

        if (lowerNow < payload.iat) {
            Log.error("Issued at value is in the future", payload.iat);
            return false;
        }

        if (lowerNow < payload.nbf) {
            Log.error("Not before time is in the future", payload.nbf);
            return false;
        }

        if (payload.exp < upperNow) {
            Log.error("Expiration is in the past", payload.exp);
            return false;
        }

        if (!jws.JWS.verify(jwt, key, AllowedSigningAlgs)) {
            Log.error("Signature validation failed");
            return false;
        }

        return true;
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
