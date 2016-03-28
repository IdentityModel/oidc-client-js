import Log from './Log';

let __global;

try {
    __global = window;
}
catch (e) {
    // for testing
}

export default class JwtUtil {

    static init(global) {
        __global = global;
    }

    static getAlg(jwt) {
        Log.info("JwtUtil.getAlg", jwt);
        try {
            var token = __global.jws.JWS.parse(jwt);
            return token.headerObj.alg;
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
