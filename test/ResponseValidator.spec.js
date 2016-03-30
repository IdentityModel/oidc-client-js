import ResponseValidator from '../src/ResponseValidator';
import Log from '../src/Log';
import JwtUtil from '../src/JwtUtil';

import StubMetadataService from './StubMetadataService';

var KJUR = require("jsrsasign");
JwtUtil.init(KJUR);

import chai from 'chai';
chai.should();
let assert = chai.assert;
let expect = chai.expect;

class MockJwtUtility {
    parseJwt(...args) {
        this.parseJwtWasCalled = true;
        if (this.parseJwtResult){
            Log.info("MockJwtUtility.parseJwt", this.parseJwtResult)
            return this.parseJwtResult;
        }
        return JwtUtil.parseJwt(...args);
    }

    validateJwt(...args) {
        this.validateJwtWasCalled = true;
        if (this.validateJwtResult){
            Log.info("MockJwtUtility.validateJwt", this.validateJwtResult)
            return this.validateJwtResult;
        }
        return JwtUtil.validateJwt(...args);
    }

    hashString(...args) {
        this.hashStringWasCalled = true;
        if (this.hashStringResult){
            Log.info("MockJwtUtility.hashString", this.hashStringResult)
            return this.hashStringResult;
        }
        return JwtUtil.hashString(...args);
    }

    hexToBase64Url(...args) {
        this.hexToBase64UrlCalled = true;
        if (this.hexToBase64UrlResult){
            Log.info("MockJwtUtility.hexToBase64Url", this.hexToBase64UrlResult)
            return this.hexToBase64UrlResult;
        }
        return JwtUtil.hexToBase64Url(...args);
    }
}

class StubUserInfoService {
    getClaims() {
        this.getClaimsWasCalled = true;
        return this.getClaimsResult;
    }
}

class MockResponseValidator extends ResponseValidator {
    constructor(settings, MetadataServiceCtor, UserInfoServiceCtor, jwtUtility) {
        super(settings, MetadataServiceCtor, UserInfoServiceCtor, jwtUtility);
    }

    _mock(name, ...args) {
        Log.info("mock called", name);
        this[name + "WasCalled"] = true;

        if (this[name + "Result"]) {
            Log.info("mock returning result", this[name + "Result"]);
            return this[name + "Result"];
        }

        Log.info("mock calling super");
        return super[name](...args);
    }

    processSigninParams(...args) {
        return this._mock("processSigninParams", ...args);
    }
    validateTokens(...args) {
        return this._mock("validateTokens", ...args);
    }
    processClaims(...args) {
        return this._mock("processClaims", ...args);
    }
    mergeClaims(...args) {
        return this._mock("mergeClaims", ...args);
    }

    validateIdTokenAndAccessToken(...args) {
        return this._mock("validateIdTokenAndAccessToken", ...args);
    }
    validateIdToken(...args) {
        return this._mock("validateIdToken", ...args);
    }
    validateJwt(...args){
        return this._mock("validateJwt", ...args);
    }
    validateAccessToken(...args) {
        return this._mock("validateAccessToken", ...args);
    }

    filterProtocolClaims(...args) {
        return this._mock("filterProtocolClaims", ...args);
    }
}

describe("ResponseValidator", function() {
    let id_token = "eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiIsIng1dCI6ImEzck1VZ01Gdjl0UGNsTGE2eUYzekFrZnF1RSIsImtpZCI6ImEzck1VZ01Gdjl0UGNsTGE2eUYzekFrZnF1RSJ9.eyJpc3MiOiJodHRwczovL2xvY2FsaG9zdDo0NDMzMy9jb3JlIiwiYXVkIjoianMudG9rZW5tYW5hZ2VyIiwiZXhwIjoxNDU5MTMwMjAxLCJuYmYiOjE0NTkxMjk5MDEsIm5vbmNlIjoiNzIyMTAwNTIwOTk3MjM4MiIsImlhdCI6MTQ1OTEyOTkwMSwiYXRfaGFzaCI6IkpnRFVDeW9hdEp5RW1HaWlXYndPaEEiLCJzaWQiOiIwYzVmMDYxZTYzOThiMWVjNmEwYmNlMmM5NDFlZTRjNSIsInN1YiI6Ijg4NDIxMTEzIiwiYXV0aF90aW1lIjoxNDU5MTI5ODk4LCJpZHAiOiJpZHNydiIsImFtciI6WyJwYXNzd29yZCJdfQ.f6S1Fdd0UQScZAFBzXwRiVsUIPQnWZLSe07kdtjANRZDZXf5A7yDtxOftgCx5W0ONQcDFVpLGPgTdhp7agZkPpCFutzmwr0Rr9G7E7mUN4xcIgAABhmRDfzDayFBEu6VM8wEWTChezSWtx2xG_2zmVJxxmNV0jvkaz0bu7iin-C_UZg6T-aI9FZDoKRGXZP9gF65FQ5pQ4bCYQxhKcvjjUfs0xSHGboL7waN6RfDpO4vvVR1Kz-PQhIRyFAJYRuoH4PdMczHYtFCb-k94r-7TxEU0vp61ww4WntbPvVWwUbCUgsEtmDzAZT-NEJVhWztNk1ip9wDPXzZ2hEhDAPJ7A";

    let access_token = "eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiIsIng1dCI6ImEzck1VZ01Gdjl0UGNsTGE2eUYzekFrZnF1RSIsImtpZCI6ImEzck1VZ01Gdjl0UGNsTGE2eUYzekFrZnF1RSJ9.eyJpc3MiOiJodHRwczovL2xvY2FsaG9zdDo0NDMzMy9jb3JlIiwiYXVkIjoiaHR0cHM6Ly9sb2NhbGhvc3Q6NDQzMzMvY29yZS9yZXNvdXJjZXMiLCJleHAiOjE0NTkxMzM1MDEsIm5iZiI6MTQ1OTEyOTkwMSwiY2xpZW50X2lkIjoianMudG9rZW5tYW5hZ2VyIiwic2NvcGUiOlsib3BlbmlkIiwicHJvZmlsZSIsImVtYWlsIiwicmVhZCIsIndyaXRlIl0sInN1YiI6Ijg4NDIxMTEzIiwiYXV0aF90aW1lIjoxNDU5MTI5ODk4LCJpZHAiOiJpZHNydiIsImFtciI6WyJwYXNzd29yZCJdfQ.ldCBx4xF_WIj6S9unppYAzXFKMs5ce7sKuse-nleFbzwRbZ-VNubLOlnpsFzquJIyTlGLekqLWnsfpAmaORQBtv5ZoaUHxC_s5APLWGC9Io19tF8NxWVmX2OK3cwHWQ5HtFkILQdYR9l3Bf5RIQK4ixbrKJN7OyzoLAen0FgEXDn-dXMAhFJDl123G7pBaayQb8ic44y808cfKlu3wwP2QkDEzgW-L0avvjN95zji5528c32L2LBMveRklcOXO6Gb0alcFw6PysfJotsNo9WahJWu404mSl3Afc-4jCWjoTL7PBL-xciPmq9iCNAgqVS7GN1s1WsnBW2R4kGLy-kcQ";

    let at_hash = "JgDUCyoatJyEmGiiWbwOhA";

    let settings;
    let subject;
    let stubMetadataService;
    let stubUserInfoService;
    let mockJwtUtility;

    let stubState;
    let stubResponse;

    beforeEach(function() {
        Log.logger = console;
        Log.level = Log.NONE;

        stubState = {
            id: "the_id",
            nonce: "7221005209972382",
            data: { some: 'data' }
        };
        stubResponse = {
            state: 'the_id'
        };

        settings = {
            client_id: 'client'
        };
        stubMetadataService = new StubMetadataService();
        stubUserInfoService = new StubUserInfoService();
        mockJwtUtility = new MockJwtUtility();
        
        subject = new MockResponseValidator(settings, () => stubMetadataService, () => stubUserInfoService, mockJwtUtility);
    });

    describe("constructor", function() {

        it("should require a settings param", function() {
            try {
                new ResponseValidator(undefined, () => stubMetadataService, () => stubUserInfoService);
            }
            catch (e) {
                e.message.should.contain('settings');
                return;
            }
            assert.fail();
        });

    });

    describe("validateSignoutResponse", function(done) {

        it("should validate that the client state matches response state", function() {

            stubResponse.state = "not_the_id";
            subject.validateSignoutResponse(stubState, stubResponse).then(null, err => {
                err.message.should.contain('match');
                done();
            });

        });

        it("should fail on error response", function(done) {

            stubResponse.error = "some_error";
            subject.validateSignoutResponse(stubState, stubResponse).then(null, err => {
                err.error.should.equal("some_error");
                done();
            });

        });

        it("should return data for error responses", function(done) {

            stubResponse.error = "some_error";
            subject.validateSignoutResponse(stubState, stubResponse).then(null, err => {
                err.state.should.deep.equal({ some: 'data' });
                done();
            });

        });

        it("should return data for successful responses", function(done) {

            subject.validateSignoutResponse(stubState, stubResponse).then(response => {
                response.state.should.deep.equal({ some: 'data' });
                done();
            });

        });

    });

    describe("validateSigninResponse", function(done) {

        it("should process signin params", function(done) {

            subject.processSigninParamsResult = Promise.resolve(stubResponse);
            subject.validateTokensResult = Promise.resolve(stubResponse);

            subject.validateSigninResponse(stubState, stubResponse).then(response => {
                subject.processSigninParamsWasCalled.should.be.true;
                done();
            });

        });

        it("should validate tokens", function(done) {

            subject.processSigninParamsResult = Promise.resolve(stubResponse);
            subject.validateTokensResult = Promise.resolve(stubResponse);

            subject.validateSigninResponse(stubState, stubResponse).then(response => {
                subject.validateTokensWasCalled.should.be.true;
                done();
            });

        });

        it("should not validate tokens if state fails", function(done) {

            subject.processSigninParamsResult = Promise.reject("error");
            subject.validateTokensResult = Promise.resolve(stubResponse);

            subject.validateSigninResponse(stubState, stubResponse).then(null, err => {
                expect(subject.validateTokensWasCalled).to.be.undefined;
                done();
            });

        });

        it("should process claims", function(done) {

            subject.processSigninParamsResult = Promise.resolve(stubResponse);
            subject.validateTokensResult = Promise.resolve(stubResponse);

            subject.validateSigninResponse(stubState, stubResponse).then(response => {
                subject.processClaimsWasCalled.should.be.true;
                done();
            });

        });

        it("should not process claims if state fails", function(done) {

            subject.processSigninParamsResult = Promise.resolve(stubResponse);
            subject.validateTokensResult = Promise.reject("error");

            subject.validateSigninResponse(stubState, stubResponse).then(null, err => {
                expect(subject.processClaimsWasCalled).to.be.undefined;
                done();
            });

        });

    });

    describe("processSigninParams", function() {

        it("should validate that the client state matches response state", function() {

            stubResponse.state = "not_the_id";
            subject.processSigninParams(stubState, stubResponse).then(null, err => {
                err.message.should.contain('match');
                done();
            });

        });

        it("should fail on error response", function(done) {

            stubResponse.error = "some_error";
            subject.processSigninParams(stubState, stubResponse).then(null, err => {
                err.error.should.equal("some_error");
                done();
            });

        });

        it("should return data for error responses", function(done) {

            stubResponse.error = "some_error";
            subject.processSigninParams(stubState, stubResponse).then(null, err => {
                err.state.should.deep.equal({ some: 'data' });
                done();
            });

        });

        it("should fail if request was OIDC but no id_token in response", function(done) {

            delete stubResponse.id_token;

            subject.processSigninParams(stubState, stubResponse).then(null, err => {
                err.message.should.contain("id_token");
                done();
            });

        });

        it("should fail if request was not OIDC but id_token in response", function(done) {

            delete stubState.nonce;
            stubResponse.id_token = id_token;

            subject.processSigninParams(stubState, stubResponse).then(null, err => {
                err.message.should.contain("id_token");
                done();
            });

        });

        it("should return data for successful responses", function(done) {

            stubResponse.id_token = id_token;

            subject.processSigninParams(stubState, stubResponse).then(response => {
                response.state.should.deep.equal({ some: 'data' });
                done();
            });

        });
    });

    describe("processClaims", function() {

        it("should filter protocol claims", function(done) {

            subject.processClaims(stubState, stubResponse).then(response => {
                subject.filterProtocolClaimsWasCalled.should.be.true;
                done();
            });

        });
        
        it("should load and merge user info claims when loadUserInfo configured", function(done) {

            settings.loadUserInfo = true;
            stubResponse.profile = { a: 'apple', b: 'banana' };
            stubResponse.access_token = "access_token";
            stubUserInfoService.getClaimsResult = Promise.resolve({ c: 'carrot' });

            subject.processClaims(stubResponse).then(response => {
                stubUserInfoService.getClaimsWasCalled.should.be.true;
                subject.mergeClaimsWasCalled.should.be.true;
                done();
            });

        });

        it("should not load and merge user info claims when loadUserInfo not configured", function(done) {

            settings.loadUserInfo = false;
            stubResponse.profile = { a: 'apple', b: 'banana' };
            stubUserInfoService.getClaimsResult = Promise.resolve({ c: 'carrot' });

            subject.processClaims(stubResponse).then(response => {
                expect(stubUserInfoService.getClaimsWasCalled).to.be.undefined;
                expect(subject.mergeClaimsWasCalled).to.be.undefined;
                done();
            });

        });
        
        it("should not load user info claims if no access token", function(done) {

            settings.loadUserInfo = true;
            stubResponse.profile = { a: 'apple', b: 'banana' };
            stubUserInfoService.getClaimsResult = Promise.resolve({ c: 'carrot' });

            subject.processClaims(stubResponse).then(response => {
                expect(stubUserInfoService.getClaimsWasCalled).to.be.undefined;
                expect(subject.mergeClaimsWasCalled).to.be.undefined;
                done();
            });

        });

    });


    describe("mergeClaims", function() {

        it("should merge claims", function() {

            var c1 = { a: 'apple', b: 'banana' };
            var c2 = { c: 'carrot' };

            var result = subject.mergeClaims(c1, c2);
            result.should.deep.equal({ a: 'apple', c: 'carrot', b: 'banana' });

        });

        it("should merge same claim types into array", function() {

            var c1 = { a: 'apple', b: 'banana' };
            var c2 = { a: 'carrot' };

            var result = subject.mergeClaims(c1, c2);
            result.should.deep.equal({ a: ['apple', 'carrot'], b: 'banana' });

        });

        it("should merge arrays of same claim types into array", function() {

            var c1 = { a: 'apple', b: 'banana' };
            var c2 = { a: ['carrot', 'durian'] };
            var result = subject.mergeClaims(c1, c2);
            result.should.deep.equal({ a: ['apple', 'carrot', 'durian'], b: 'banana' });

            var c1 = { a: ['apple', 'carrot'], b: 'banana' };
            var c2 = { a: ['durian'] };
            var result = subject.mergeClaims(c1, c2);
            result.should.deep.equal({ a: ['apple', 'carrot', 'durian'], b: 'banana' });

            var c1 = { a: ['apple', 'carrot'], b: 'banana' };
            var c2 = { a: 'durian' };
            var result = subject.mergeClaims(c1, c2);
            result.should.deep.equal({ a: ['apple', 'carrot', 'durian'], b: 'banana' });
        });
        
        it("should remove duplicates when producing arrays", function() {

            var c1 = { a: 'apple', b: 'banana' };
            var c2 = { a: ['apple', 'durian'] };
            var result = subject.mergeClaims(c1, c2);
            result.should.deep.equal({ a: ['apple', 'durian'], b: 'banana' });
        });
        
        it("should not add if already present in array", function() {

            var c1 = { a: ['apple', 'durian'], b: 'banana' };
            var c2 = { a: 'apple' };
            var result = subject.mergeClaims(c1, c2);
            result.should.deep.equal({ a: ['apple', 'durian'], b: 'banana' });
        });
    });

    describe("filterProtocolClaims", function() {

        it("should filter protocol claims if enabled on settings", function() {

            settings.filterProtocolClaims = true;
            let claims = {
                foo: 1, bar: 'test',
                aud: 'some_aud', iss: 'issuer',
                sub: '123', email: 'foo@gmail.com',
                role: ['admin', 'dev'],
                nonce: 'nonce', at_hash: "athash",
                iat: 5, nbf: 10, exp: 20
            };

            var result = subject.filterProtocolClaims(claims);
            result.should.deep.equal({
                foo: 1, bar: 'test',
                sub: '123', email: 'foo@gmail.com',
                role: ['admin', 'dev']
            });

        });

        it("should not filter protocol claims if not enabled on settings", function() {

            settings.filterProtocolClaims = false;
            let claims = {
                foo: 1, bar: 'test',
                aud: 'some_aud', iss: 'issuer',
                sub: '123', email: 'foo@gmail.com',
                role: ['admin', 'dev'],
                nonce: 'nonce', at_hash: "athash",
                iat: 5, nbf: 10, exp: 20
            };

            var result = subject.filterProtocolClaims(claims);
            result.should.deep.equal({
                foo: 1, bar: 'test',
                aud: 'some_aud', iss: 'issuer',
                sub: '123', email: 'foo@gmail.com',
                role: ['admin', 'dev'],
                nonce: 'nonce', at_hash: "athash",
                iat: 5, nbf: 10, exp: 20
            });

        });
    });

    describe("validateTokens", function() {

        it("should validate id_token and access_token", function(done) {

            stubResponse.id_token = "id_token";
            stubResponse.access_token = "access_token";
            subject.validateIdTokenAndAccessTokenResult = Promise.resolve(stubResponse);

            subject.validateTokens(stubState, stubResponse).then(response => {
                subject.validateIdTokenAndAccessTokenWasCalled.should.be.true;
                expect(subject.validateIdTokenWasCalled).to.be.undefined;
                done();
            });

        });

        it("should validate just id_token", function(done) {

            stubResponse.id_token = "id_token";
            subject.validateIdTokenResult = Promise.resolve(stubResponse);

            subject.validateTokens(stubState, stubResponse).then(response => {
                subject.validateIdTokenWasCalled.should.be.true;
                expect(subject.validateIdTokenAndAccessTokenWasCalled).to.be.undefined;
                done();
            });

        });

        it("should not validate if only access_token", function(done) {

            stubResponse.access_token = "access_token";

            subject.validateTokens(stubState, stubResponse).then(response => {
                expect(subject.validateIdTokenWasCalled).to.be.undefined;
                expect(subject.validateIdTokenAndAccessTokenWasCalled).to.be.undefined;
                done();
            });

        });
    });

    describe("validateIdTokenAndAccessToken", function() {

        it("should validate id_token and access_token", function(done) {

            stubResponse.id_token = id_token;
            stubResponse.access_token = access_token;
            stubResponse.profile = {
                at_hash: at_hash
            };
            subject.validateIdTokenResult = Promise.resolve(stubResponse);

            subject.validateIdTokenAndAccessToken(stubState, stubResponse).then(response => {
                subject.validateIdTokenWasCalled.should.be.true;
                subject.validateAccessTokenWasCalled.should.be.true;
                done();
            });

        });

        it("should not access_token if id_token validation fails", function(done) {

            stubResponse.id_token = "id_token";
            stubResponse.access_token = "access_token";
            subject.validateIdTokenResult = Promise.reject(new Error("error"));

            subject.validateIdTokenAndAccessToken(stubState, stubResponse).then(null, err => {
                subject.validateIdTokenWasCalled.should.be.true;
                expect(subject.validateAccessTokenWasCalled).to.be.undefined;
                done();
            });

        });

    });

    describe("validateIdToken", function() {

        it("should fail if no client/audience", function(done) {

            stubResponse.id_token = id_token;
            delete settings.client_id;

            subject.validateIdToken(stubState, stubResponse).then(null, err => {
                err.message.should.contain('audience');
                done();
            });
        });

        it("should fail if no nonce on state", function(done) {

            delete stubState.nonce;
            stubResponse.id_token = id_token;

            subject.validateIdToken(stubState, stubResponse).then(null, err => {
                err.message.should.contain('nonce');
                done();
            });
        });
        
        it("should fail if invalid id_token", function(done) {

            subject.validateIdToken(stubState, stubResponse).then(null, err => {
                err.message.should.contain('id_token');
                done();
            });
        });
        
        it("should fail if nonce doesn't match id_token", function(done) {

            stubState.nonce = "invalid nonce";
            stubResponse.id_token = id_token;

            subject.validateIdToken(stubState, stubResponse).then(null, err => {
                err.message.should.contain('nonce');
                done();
            });
        });

        it("should fail if issuer fails", function(done) {
            stubResponse.id_token = id_token;
            stubMetadataService.getIssuerResult = Promise.reject(new Error("issuer"));

            subject.validateIdToken(stubState, stubResponse).then(null, err => {
                err.message.should.contain('issuer');
                done();
            });
        });

        it("should fail if loading keys fails", function(done) {

            stubResponse.id_token = id_token;
            stubMetadataService.getIssuerResult = Promise.resolve("test");
            stubMetadataService.getSigningKeysResult = Promise.reject(new Error("keys"));

            subject.validateIdToken(stubState, stubResponse).then(null, err => {
                err.message.should.contain('keys');
                done();
            });
        });
        
        it("should fail if no matching key found in signing keys", function(done) {

            stubResponse.id_token = id_token;
            stubMetadataService.getIssuerResult = Promise.resolve("test");
            stubMetadataService.getSigningKeysResult = Promise.resolve([]);

            subject.validateIdToken(stubState, stubResponse).then(null, err => {
                err.message.should.contain('kid');
                done();
            });
        });
        
        it("should validate JWT", function(done) {
            
            stubResponse.id_token = id_token;
            stubMetadataService.getIssuerResult = Promise.resolve("test");
            stubMetadataService.getSigningKeysResult = Promise.resolve([{kid:'a3rMUgMFv9tPclLa6yF3zAkfquE'}]);

            mockJwtUtility.validateJwtResult = true;
            
            subject.validateIdToken(stubState, stubResponse).then(response => {
                 mockJwtUtility.validateJwtWasCalled.should.be.true;
                done();
            });
        });
        
        it("should set profile on result if successful", function(done) {

            stubResponse.id_token = id_token;
            stubMetadataService.getIssuerResult = Promise.resolve("test");
            stubMetadataService.getSigningKeysResult = Promise.resolve([{kid:'a3rMUgMFv9tPclLa6yF3zAkfquE'}]);
            
            mockJwtUtility.validateJwtResult = true;

            subject.validateIdToken(stubState, stubResponse).then(response => {
                response.profile.should.be.ok;
                done();
            });
        });

    });

    describe("validateAccessToken", function() {

        it("should require id_token", function(done) {

            stubResponse.id_token = null;
            stubResponse.profile = {
                at_hash: at_hash
            };

            subject.validateAccessToken(stubResponse).then(null, err => {
                err.message.should.contain("id_token");
                done();
            });
        });

        it("should require profile", function(done) {

            stubResponse.id_token = id_token;
            stubResponse.profile = null;

            subject.validateAccessToken(stubResponse).then(null, err => {
                err.message.should.contain("profile");
                done();
            });
        });

        it("should require at_hash on profile", function(done) {

            stubResponse.id_token = id_token;
            stubResponse.profile = {
            };

            subject.validateAccessToken(stubResponse).then(null, err => {
                err.message.should.contain("at_hash");
                done();
            });
        });

        it("should fail for invalid id_token", function(done) {

            stubResponse.id_token = "bad";
            stubResponse.profile = {
                at_hash: at_hash
            };

            subject.validateAccessToken(stubResponse).then(null, err => {
                Log.info(err);
                err.message.should.contain("id_token");
                done();
            });
        });

        it("should require proper alg on id_token", function(done) {

            stubResponse.id_token = "bad";
            stubResponse.profile = {
                at_hash: at_hash
            };
            mockJwtUtility.parseJwtResult = { header: { alg: "bad" } };

            subject.validateAccessToken(stubResponse).then(null, err => {
                Log.info(err);
                err.message.should.contain("alg");
                done();
            });
        });

        it("should fail for invalid algs of incorrect bit lengths", function(done) {

            stubResponse.id_token = id_token;
            stubResponse.access_token = access_token;
            stubResponse.profile = {
                at_hash: at_hash
            };

            mockJwtUtility.parseJwtResult = { header: { alg: "HS123" } };
            subject.validateAccessToken(stubResponse).then(null, err => {
                err.message.should.contain("alg");
                done();
            });
        });

        it("should fail for algs of not correct string length", function(done) {

            stubResponse.id_token = id_token;
            stubResponse.access_token = access_token;
            stubResponse.profile = {
                at_hash: at_hash
            };

            mockJwtUtility.parseJwtResult = { header: { alg: "abc" } };
            subject.validateAccessToken(stubResponse).then(null, err => {
                err.message.should.contain("alg");
                done();
            });

        });

        it("should fail if at_hash does not match", function(done) {

            stubResponse.id_token = id_token;
            stubResponse.access_token = access_token;
            stubResponse.profile = {
                at_hash: at_hash
            };
            mockJwtUtility.parseJwtResult = { header: { alg: "RS256" } };
            mockJwtUtility.hashStringResult = "hash";
            mockJwtUtility.hexToBase64UrlResult = "wrong";

            subject.validateAccessToken(stubResponse).then(null, err => {
                err.message.should.contain("at_hash");
                done();
            });
        });

        it("should validate at_hash", function(done) {

            stubResponse.id_token = id_token;
            stubResponse.access_token = access_token;
            stubResponse.profile = {
                at_hash: at_hash
            };

            subject.validateAccessToken(stubResponse).then(response => {
                response.should.be.deep.equal(stubResponse);
                done();
            });
        });

    });
});
