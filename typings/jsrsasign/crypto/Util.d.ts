// Derived from http://kjur.github.io/jsrsasign/

declare module KJUR {
    export module crypto {
        export module Util {
            export var DEFAULTPROVIDER: { [alg: string]: string; };
            export var DIGESTINFOHEAD: { [alg: string]: string; };
            
            export function getDigestInfoHex(hHash: string, alg: string): string;
            export function getPaddedDigestInfoHex(hHash: string, alg: string, keySize: number): string;
            export function hashHex(sHex: string, alg: string): string;
            export function hashString(s: string, alg: string): string;
            export function md5(s: string): string;
            export function ripemd160(s: string): string;
            export function sha1(s: string): string;
            export function sha256(s: string): string;
            export function sha512(s: string): string;
        }
    }
}