// Derived from http://kjur.github.io/jsrsasign/

declare module KJUR {
    export module jws {
        export class JWS {
            public jwsalg2sigalg: { [alg: string]: string };
            public parsedJWS: {
                headB64U: string;
                payloadB64U : string;
                sigvalB64U: string;
                si: string;
                sigvalH?: string;
                sigvalBI?: any; // BigInt
                headS: string;
                payloadS: string;
            };
            
            parseJWS(sJWS: string, sigValNotNeeded?: boolean): void;
            verifyJWSByPemX509Cert(sJWS: string, sPemX509Cert: string): boolean;
            
            static getEncodedSignatureValueFromJWS(sJWS: string): string;
            static getJWKthumbprint(o: string): string;
            static inArray(item: string, a: string[]): boolean;
            static includedArray(a1: string[], a2: string[]): boolean;
            static isSafeJSONString(s: string): number;
            static parse(sJWS: string): string[];
            static readSafeJSONString(s: string): Object;
            static sign(alg: string, spHead: string, spPayload: string, key: string, pass: string): string;
            static verify(sJWS: string, key: string, acceptAlgs?: string[]): boolean;
            static verifyJWT(sJWT: string, key: string, acceptField?: string[]): boolean;
        }
    }
}