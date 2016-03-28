import Log from './Log';

let __global;

try {
    // this is assuming we have a reference to 
    // the jsrsasign library loaded in the browser
    __global = window;
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
    }

    static parseJwt(jwt) {
        Log.info("JwtUtil.parseJwt");
        try {
            var token = __global.jws.JWS.parse(jwt);
            return {
                header: token.headerObj,
                payload : token.payloadObj
            }
        }
        catch (e) {
            Log.error(e);
        }
    }
    
    static validateJwtRsa(jwt, key) {
        Log.info("JwtUtil.validateJwtRsa");
        try {
            return true;
        }
        catch (e) {
            Log.error(e);
        }
    }
    
    static validateJwtEc(jwt, key) {
        Log.info("JwtUtil.validateJwtEc");
        try {
            return true;
        }
        catch (e) {
            Log.error(e);
        }
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
