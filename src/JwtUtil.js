// Copyright (c) Brock Allen & Dominick Baier. All rights reserved.
// Licensed under the Apache License, Version 2.0. See LICENSE in the project root for license information.

import { jws, KEYUTIL as KeyUtil, X509, crypto, hextob64u } from 'jsrsasign';
import Log from './Log';

export default class JwtUtil {

    static parseJwt(jwt) {
        Log.info("JwtUtil.parseJwt");
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

    static validateJwt(jwt, key, issuer, audience, now) {
        Log.info("JwtUtil.validateJwt");

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

            return jws.JWS.verifyJWT(jwt,
                key,
                {
                    alg: ['RS256', 'RS384', 'RS512', 'PS256', 'PS384', 'PS512', 'ES256', 'ES384', 'ES512'],
                    iss: [issuer],
                    aud: [audience],
                    verifyAt: now
                });
        }
        catch (e) {
            Log.error(e);
        }

        return false;
    }

    static hashString(value, alg) {
        Log.info("JwtUtil.hashString", value, alg);
        try {
            return crypto.Util.hashString(value, alg);
        }
        catch (e) {
            Log.error(e);
        }
    }

    static hexToBase64Url(value) {
        Log.info("JwtUtil.hexToBase64Url", value);
        try {
            return hextob64u(value);
        }
        catch (e) {
            Log.error(e);
        }
    }
}
