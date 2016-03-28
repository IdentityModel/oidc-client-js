let __global;

try{
    __global = window;
}
catch(e){
    // for testing
}

export default class JwtUtil {
    
    static init(global){
        __global = global;
    }
    
    static getAlg(jwt){
        var token = __global.jws.JWS.parse(jwt);
        return token.headerObj.alg;
    }
    
    static hashString(value, alg){
        return __global.crypto.Util.hashString(value, alg);
    }
    
    static hexToBase64Url(value){
        return __global.hextob64u(value);
    }
}
