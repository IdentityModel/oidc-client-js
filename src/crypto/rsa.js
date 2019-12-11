/*
Based on the work of Auth0
https://github.com/auth0/idtoken-verifier
https://github.com/auth0/idtoken-verifier/blob/master/LICENSE
Which is based on the work of Tom Wu
http://www-cs-students.stanford.edu/~tjw/jsbn/
http://www-cs-students.stanford.edu/~tjw/jsbn/LICENSE
*/

/*
 * To support most basic OpenId use cases (using RSA256), we can get away without
 * requiring the full jrsasign feature set (and resulting massive bundle).
 *
 * - Support RSA 256 algorithm (optionally could support RSA* family)
 * - Parse JWT tokens using the (n) parameter.
 * - Verify signature of id_tokens
 * - Verify at_hash of access_tokens
 * - Perform common base64 encoding/decoding tasks.
 */

import JSBN from 'jsbn';
import SHA256 from 'crypto-js/sha256';
import base64Js from 'base64-js';

var BigInteger = JSBN.BigInteger;

/*! (c) Tom Wu | http://www-cs-students.stanford.edu/~tjw/jsbn/
 */
var b64map = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";
var b64pad = "=";

const Base64 = {
    b64tohex(s) {
        var ret = "";
        var i;
        var k = 0; // b64 state, 0-3
        var slop;
        for(i = 0; i < s.length; ++i) {
            if(s.charAt(i) === b64pad) break;
            var v = b64map.indexOf(s.charAt(i));
            if(v < 0) continue;
            if(k === 0) {
                ret += String.fromCharCode(v >> 2);
                slop = v & 3;
                k = 1;
            }
            else if(k === 1) {
                ret += String.fromCharCode((slop << 2) | (v >> 4));
                slop = v & 0xf;
                k = 2;
            }
            else if(k === 2) {
                ret += String.fromCharCode(slop);
                ret += String.fromCharCode(v >> 2);
                slop = v & 3;
                k = 3;
            }
            else {
                ret += String.fromCharCode((slop << 2) | (v >> 4));
                ret += String.fromCharCode(v & 0xf);
                k = 0;
            }
        }
        if(k === 1)
            ret += String.fromCharCode(slop << 2);
        return ret;
    },
    hexToBase64(h) {
        var i;
        var c;
        var ret = "";
        for(i = 0; i+3 <= h.length; i+=3) {
            c = parseInt(h.substring(i,i+3),16);
            ret += b64map.charAt(c >> 6) + b64map.charAt(c & 63);
        }
        if(i+1 === h.length) {
            c = parseInt(h.substring(i,i+1),16);
            ret += b64map.charAt(c << 2);
        }
        else if(i+2 === h.length) {
            c = parseInt(h.substring(i,i+2),16);
            ret += b64map.charAt(c >> 2) + b64map.charAt((c & 3) << 4);
        }
        if (b64pad) while((ret.length & 3) > 0) ret += b64pad;
        return ret;
    },

    padding(str) {
        var mod = (str.length % 4);
        var pad = 4 - mod;

        if (mod === 0) {
            return str;
        }

        return str + (new Array(1 + pad)).join('=');
    },

    byteArrayToHex(raw) {
        var HEX = '';

        for (var i = 0; i < raw.length; i++) {
            var _hex = raw[i].toString(16);
            HEX += (_hex.length === 2 ? _hex : '0' + _hex);
        }

        return HEX;
    },

    decodeToHEX(str) {
        return Base64.byteArrayToHex(base64Js.toByteArray(Base64.padding(str)));
    },

    base64ToBase64Url(s) {
        s = s.replace(/=/g, "");
        s = s.replace(/\+/g, "-");
        s = s.replace(/\//g, "_");
        return s;
    },

    urlDecode(str) {
        str = str.replace(/-/g, '+') // Convert '-' to '+'
            .replace(/_/g, '/') // Convert '_' to '/'
            .replace(/\s/g, ' '); // Convert '\s' to ' '

        return atob(str);
    }
};


var DigestInfoHead = {
    sha1: '3021300906052b0e03021a05000414',
    sha224: '302d300d06096086480165030402040500041c',
    sha256: '3031300d060960864801650304020105000420',
    sha384: '3041300d060960864801650304020205000430',
    sha512: '3051300d060960864801650304020305000440',
    md2: '3020300c06082a864886f70d020205000410',
    md5: '3020300c06082a864886f70d020505000410',
    ripemd160: '3021300906052b2403020105000414'
};

var DigestAlgs = {
    sha256: SHA256,
    SHA256:SHA256
};

function RSAVerifier(modulus, exp) {
    this.n = null;
    this.e = 0;

    if (modulus != null && exp != null && modulus.length > 0 && exp.length > 0) {
        this.n = new BigInteger(modulus, 16);
        this.e = parseInt(exp, 16);
    } else {
        throw new Error('Invalid key data');
    }
}

function getAlgorithmFromDigest(hDigestInfo) {
    for (var algName in DigestInfoHead) {
        var head = DigestInfoHead[algName];
        var len = head.length;

        if (hDigestInfo.substring(0, len) === head) {
            return {
                alg: algName,
                hash: hDigestInfo.substring(len)
            };
        }
    }
    return [];
}


RSAVerifier.prototype.verify = function (msg, encsig) {
    encsig = Base64.decodeToHEX(encsig);
    encsig = encsig.replace(/[^0-9a-f]|[\s\n]]/ig, '');

    var sig = new BigInteger(encsig, 16);

    if (sig.bitLength() > this.n.bitLength()) {
        throw new Error('Signature does not match with the key modulus.');
    }

    var decryptedSig = sig.modPowInt(this.e, this.n);
    var digest = decryptedSig.toString(16).replace(/^1f+00/, '');
    var digestInfo = getAlgorithmFromDigest(digest);

    if (digestInfo.length === 0) {
        return false;
    }

    if (!DigestAlgs.hasOwnProperty(digestInfo.alg)) {
        throw new Error('Hashing algorithm is not supported.');
    }

    var msgHash = DigestAlgs[digestInfo.alg](msg).toString();
    return (digestInfo.hash === msgHash);
};

const AllowedSigningAlgs = ['RS256'];

const jws = {
    JWS: {
        parse: function(token) {
            var parts = token.split('.');
            var header;
            var payload;

            // This diverges from Auth0's implementation, which throws rather than
            // returning undefined
            if (parts.length !== 3) {
                return undefined;
            }

            try {
                header = JSON.parse(Base64.urlDecode(parts[0]));
                payload = JSON.parse(Base64.urlDecode(parts[1]));
            } catch (e) {
                return new Error('Token header or payload is not valid JSON');
            }

            return {
                headerObj: header,
                payloadObj: payload,
            };
        },
        verify: function(jwt, key, allowedSigningAlgs = []) {
            allowedSigningAlgs.forEach((alg) => {
                if (AllowedSigningAlgs.indexOf(alg) === -1) {
                    throw new Error('Invalid signing algorithm: ' + alg);
                }
            });
            var verify = new RSAVerifier(key.n, key.e);
            var parts = jwt.split('.');

            var headerAndPayload = [parts[0], parts[1]].join('.');
            return verify.verify(headerAndPayload, parts[2]);
        },
    },
};

const KeyUtil = {
    /**
     * Returns decoded keys in Hex format for use in crypto functions.
     * Supports modulus/exponent-style keys.
     *
     * @param {object} key the security key
     * @returns
     */
    getKey(key) {
        if (key.kty === 'RSA') {
            return {
                e: Base64.decodeToHEX(key.e),
                n: Base64.decodeToHEX(key.n),
            };
        }

        return null;
    },
};

const X509 = {
    getPublicKeyFromCertPEM: function() {
        throw new Error('Not implemented. Use the full oidc-client library if you need support for X509.');
    },
};

const crypto = {
    Util: {
        hashString: function(value, alg) {
            var hashFunc = DigestAlgs[alg];
            return hashFunc(value).toString();
        },
    }
};

function hextob64u(s) {
    if (s.length % 2 === 1) {
        s = '0' + s;
    }
    return Base64.base64ToBase64Url(Base64.hexToBase64(s));
}

const {b64tohex} = Base64;

export {
    jws,
    KeyUtil,
    X509,
    crypto,
    hextob64u,
    b64tohex,
    AllowedSigningAlgs
};
