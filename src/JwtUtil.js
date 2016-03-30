import Log from './Log';

let __global;
let __jwtModule;

try {
    // this is assuming we have a reference to 
    // the jsrsasign library loaded in the browser
    __global = window;
    __jwtModule = window.KJUR;
}
catch (e) {
    // this will certainly throw in our unit tests
    // we're assuming the use of the init() method 
    // below for testing
}

export default class JwtUtil {

    // this is used to configure jsrsasign loaded via
    // require in our unit tests
    static init(global) {
        __global = global;
        __jwtModule = global;
    }

    static parseJwt(jwt) {
        Log.info("JwtUtil.parseJwt");
        try {
            var token = __jwtModule.jws.JWS.parse(jwt);
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
                    key = __global.KEYUTIL.getKey(key);
                }
                else if (key.x5c && key.x5c.length) {
                    key = __global.KEYUTIL.getKey(__global.X509.getPublicKeyFromCertPEM(key.x5c[0]));
                }
                else {
                    Log.error("RSA key missing key material", key);
                    return false;
                }
            }
            else if (key.kty === "EC") {
                if (key.crv && key.x && key.y) {
                    key = __global.KEYUTIL.getKey(key);
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

            return __jwtModule.jws.JWS.verifyJWT(jwt,
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
            return __global.crypto.Util.hashString(value, alg);
        }
        catch (e) {
            Log.error(e);
        }
    }

    static hexToBase64Url(value) {
        Log.info("JwtUtil.hexToBase64Url", value);
        try {
            return __global.hextob64u(value);
        }
        catch (e) {
            Log.error(e);
        }
    }
}
