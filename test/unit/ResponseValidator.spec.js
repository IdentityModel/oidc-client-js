// Copyright (c) Brock Allen & Dominick Baier. All rights reserved.
// Licensed under the Apache License, Version 2.0. See LICENSE in the project root for license information.

import { ResponseValidator } from '../../src/ResponseValidator';
import { Log } from '../../src/Log';
import { JoseUtil } from '../../src/JoseUtil';

import { StubMetadataService } from './StubMetadataService';

import chai from 'chai';
chai.should();
let assert = chai.assert;
let expect = chai.expect;

class MockJoseUtility {
    parseJwt(...args) {
        this.parseJwtWasCalled = true;
        if (this.parseJwtResult) {
            Log.debug("MockJoseUtility.parseJwt", this.parseJwtResult)
            return this.parseJwtResult;
        }
        return JoseUtil.parseJwt(...args);
    }

    validateJwt(...args) {
        this.validateJwtWasCalled = true;
        if (this.validateJwtResult) {
            Log.debug("MockJoseUtility.validateJwt", this.validateJwtResult)
            return this.validateJwtResult;
        }
        return JoseUtil.validateJwt(...args);
    }

    hashString(...args) {
        this.hashStringWasCalled = true;
        if (this.hashStringResult) {
            Log.debug("MockJoseUtility.hashString", this.hashStringResult)
            return this.hashStringResult;
        }
        return JoseUtil.hashString(...args);
    }

    hexToBase64Url(...args) {
        this.hexToBase64UrlCalled = true;
        if (this.hexToBase64UrlResult) {
            Log.debug("MockJoseUtility.hexToBase64Url", this.hexToBase64UrlResult)
            return this.hexToBase64UrlResult;
        }
        return JoseUtil.hexToBase64Url(...args);
    }
}

class StubUserInfoService {
    constructor() {
        this.getClaimsWasCalled = false;
    }

    getClaims() {
        this.getClaimsWasCalled = true;
        return this.getClaimsResult;
    }
}

class MockResponseValidator extends ResponseValidator {
    constructor(settings, MetadataServiceCtor, UserInfoServiceCtor, joseUtil) {
        super(settings, MetadataServiceCtor, UserInfoServiceCtor, joseUtil);
    }

    _mock(name, ...args) {
        Log.debug("mock called", name);
        this[name + "WasCalled"] = true;

        if (this[name + "Result"]) {
            Log.debug("mock returning result", this[name + "Result"]);
            return this[name + "Result"];
        }

        Log.debug("mock calling super");
        return super[name](...args);
    }

    _processSigninParams(...args) {
        return this._mock("_processSigninParams", ...args);
    }
    _validateTokens(...args) {
        return this._mock("_validateTokens", ...args);
    }
    _processClaims(...args) {
        return this._mock("_processClaims", ...args);
    }
    _mergeClaims(...args) {
        return this._mock("_mergeClaims", ...args);
    }

    _getSigningKeyForJwt(...args) {
        this._getSigningKeyForJwtSignedCalledCount = (this._getSigningKeyForJwtSignedCalledCount || 0) + 1;
        return this._mock("_getSigningKeyForJwt", ...args);
    }
    _getSigningKeyForJwtWithSingleRetry(...args) {
        this._getSigningKeyForJwtSignedCalledCount = 0;
        return this._mock("_getSigningKeyForJwtWithSingleRetry", ...args);
    }

    _validateIdTokenAndAccessToken(...args) {
        return this._mock("_validateIdTokenAndAccessToken", ...args);
    }
    _validateIdToken(...args) {
        return this._mock("_validateIdToken", ...args);
    }
    validateJwt(...args) {
        return this._mock("validateJwt", ...args);
    }
    _validateAccessToken(...args) {
        return this._mock("_validateAccessToken", ...args);
    }

    _filterProtocolClaims(...args) {
        return this._mock("_filterProtocolClaims", ...args);
    }
}

describe("ResponseValidator", function () {
    let id_token = "eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiIsIng1dCI6ImEzck1VZ01Gdjl0UGNsTGE2eUYzekFrZnF1RSIsImtpZCI6ImEzck1VZ01Gdjl0UGNsTGE2eUYzekFrZnF1RSJ9.eyJpc3MiOiJodHRwczovL2xvY2FsaG9zdDo0NDMzMy9jb3JlIiwiYXVkIjoianMudG9rZW5tYW5hZ2VyIiwiZXhwIjoxNDU5MTMwMjAxLCJuYmYiOjE0NTkxMjk5MDEsIm5vbmNlIjoiNzIyMTAwNTIwOTk3MjM4MiIsImlhdCI6MTQ1OTEyOTkwMSwiYXRfaGFzaCI6IkpnRFVDeW9hdEp5RW1HaWlXYndPaEEiLCJzaWQiOiIwYzVmMDYxZTYzOThiMWVjNmEwYmNlMmM5NDFlZTRjNSIsInN1YiI6Ijg4NDIxMTEzIiwiYXV0aF90aW1lIjoxNDU5MTI5ODk4LCJpZHAiOiJpZHNydiIsImFtciI6WyJwYXNzd29yZCJdfQ.f6S1Fdd0UQScZAFBzXwRiVsUIPQnWZLSe07kdtjANRZDZXf5A7yDtxOftgCx5W0ONQcDFVpLGPgTdhp7agZkPpCFutzmwr0Rr9G7E7mUN4xcIgAABhmRDfzDayFBEu6VM8wEWTChezSWtx2xG_2zmVJxxmNV0jvkaz0bu7iin-C_UZg6T-aI9FZDoKRGXZP9gF65FQ5pQ4bCYQxhKcvjjUfs0xSHGboL7waN6RfDpO4vvVR1Kz-PQhIRyFAJYRuoH4PdMczHYtFCb-k94r-7TxEU0vp61ww4WntbPvVWwUbCUgsEtmDzAZT-NEJVhWztNk1ip9wDPXzZ2hEhDAPJ7A";

    let access_token = "eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiIsIng1dCI6ImEzck1VZ01Gdjl0UGNsTGE2eUYzekFrZnF1RSIsImtpZCI6ImEzck1VZ01Gdjl0UGNsTGE2eUYzekFrZnF1RSJ9.eyJpc3MiOiJodHRwczovL2xvY2FsaG9zdDo0NDMzMy9jb3JlIiwiYXVkIjoiaHR0cHM6Ly9sb2NhbGhvc3Q6NDQzMzMvY29yZS9yZXNvdXJjZXMiLCJleHAiOjE0NTkxMzM1MDEsIm5iZiI6MTQ1OTEyOTkwMSwiY2xpZW50X2lkIjoianMudG9rZW5tYW5hZ2VyIiwic2NvcGUiOlsib3BlbmlkIiwicHJvZmlsZSIsImVtYWlsIiwicmVhZCIsIndyaXRlIl0sInN1YiI6Ijg4NDIxMTEzIiwiYXV0aF90aW1lIjoxNDU5MTI5ODk4LCJpZHAiOiJpZHNydiIsImFtciI6WyJwYXNzd29yZCJdfQ.ldCBx4xF_WIj6S9unppYAzXFKMs5ce7sKuse-nleFbzwRbZ-VNubLOlnpsFzquJIyTlGLekqLWnsfpAmaORQBtv5ZoaUHxC_s5APLWGC9Io19tF8NxWVmX2OK3cwHWQ5HtFkILQdYR9l3Bf5RIQK4ixbrKJN7OyzoLAen0FgEXDn-dXMAhFJDl123G7pBaayQb8ic44y808cfKlu3wwP2QkDEzgW-L0avvjN95zji5528c32L2LBMveRklcOXO6Gb0alcFw6PysfJotsNo9WahJWu404mSl3Afc-4jCWjoTL7PBL-xciPmq9iCNAgqVS7GN1s1WsnBW2R4kGLy-kcQ";

    let at_hash = "JgDUCyoatJyEmGiiWbwOhA";

    let settings;
    let subject;
    let stubMetadataService;
    let stubUserInfoService;
    let mockJoseUtility;

    let stubState;
    let stubResponse;

    beforeEach(function () {
        Log.logger = console;
        Log.level = Log.NONE;

        stubState = {
            id: "the_id",
            nonce: "7221005209972382",
            data: { some: 'data' },
            client_id: "client",
            authority: "op"
        };
        stubResponse = {
            state: 'the_id',
            isOpenIdConnect: false
        };

        settings = {
            authority: "op",
            client_id: 'client'
        };
        stubMetadataService = new StubMetadataService();
        stubUserInfoService = new StubUserInfoService();
        mockJoseUtility = new MockJoseUtility();

        subject = new MockResponseValidator(settings, () => stubMetadataService, () => stubUserInfoService, mockJoseUtility);
    });

    describe("constructor", function () {

        it("should require a settings param", function () {
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

    describe("validateSignoutResponse", function () {

        it("should validate that the client state matches response state", function (done) {

            stubResponse.state = "not_the_id";
            subject.validateSignoutResponse(stubState, stubResponse).then(null, err => {
                err.message.should.contain('match');
                done();
            });

        });

        it("should fail on error response", function (done) {

            stubResponse.error = "some_error";
            subject.validateSignoutResponse(stubState, stubResponse).then(null, err => {
                err.error.should.equal("some_error");
                done();
            });

        });

        it("should return data for error responses", function (done) {

            stubResponse.error = "some_error";
            subject.validateSignoutResponse(stubState, stubResponse).then(null, err => {
                err.state.should.deep.equal({ some: 'data' });
                done();
            });

        });

        it("should return data for successful responses", function (done) {

            subject.validateSignoutResponse(stubState, stubResponse).then(response => {
                response.state.should.deep.equal({ some: 'data' });
                done();
            });

        });

    });

    describe("validateSigninResponse", function () {

        it("should process signin params", function (done) {

            subject._processSigninParamsResult = Promise.resolve(stubResponse);
            subject._validateTokensResult = Promise.resolve(stubResponse);

            subject.validateSigninResponse(stubState, stubResponse).then(response => {
                subject._processSigninParamsWasCalled.should.be.true;
                done();
            });

        });

        it("should validate tokens", function (done) {

            subject._processSigninParamsResult = Promise.resolve(stubResponse);
            subject._validateTokensResult = Promise.resolve(stubResponse);

            subject.validateSigninResponse(stubState, stubResponse).then(response => {
                subject._validateTokensWasCalled.should.be.true;
                done();
            });

        });

        it("should not validate tokens if state fails", function (done) {

            subject._processSigninParamsResult = Promise.reject("error");
            subject._validateTokensResult = Promise.resolve(stubResponse);

            subject.validateSigninResponse(stubState, stubResponse).then(null, err => {
                expect(subject._validateTokensWasCalled).to.be.undefined;
                done();
            });

        });

        it("should process claims", function (done) {

            subject._processSigninParamsResult = Promise.resolve(stubResponse);
            subject._validateTokensResult = Promise.resolve(stubResponse);

            subject.validateSigninResponse(stubState, stubResponse).then(response => {
                subject._processClaimsWasCalled.should.be.true;
                done();
            });

        });

        it("should not process claims if state fails", function (done) {

            subject._processSigninParamsResult = Promise.resolve(stubResponse);
            subject._validateTokensResult = Promise.reject("error");

            subject.validateSigninResponse(stubState, stubResponse).then(null, err => {
                expect(subject._processClaimsWasCalled).to.be.undefined;
                done();
            });

        });

    });

    describe("_processSigninParams", function () {

        it("should fail if no authority on state", function (done) {

            delete stubState.authority;

            subject._processSigninParams(stubState, stubResponse).then(null, err => {
                err.message.should.contain('authority');
                done();
            });
        });

        it("should fail if no client_id on state", function (done) {

            delete stubState.client_id;

            subject._processSigninParams(stubState, stubResponse).then(null, err => {
                err.message.should.contain('client_id');
                done();
            });
        });

        it("should fail if the authority on the state is not the same as the settings", function (done) {

            stubState.authority = "something different";

            subject._processSigninParams(stubState, stubResponse).then(null, err => {
                err.message.should.contain('authority mismatch');
                done();
            });
        });

        it("should fail if the client_id on the state is not the same as the settings", function (done) {

            stubState.client_id = "something different";

            subject._processSigninParams(stubState, stubResponse).then(null, err => {
                err.message.should.contain('client_id mismatch');
                done();
            });
        });

        it("should assign the authority on the settings if not already assigned", function (done) {

            delete subject._settings.authority;
            stubState.authority = "something different";

            stubResponse.id_token = id_token;

            subject._processSigninParams(stubState, stubResponse).then(response => {
                delete subject._settings.authority.should.equal("something different");
                done();
            });
        });

        it("should assign the client_id on the settings if not already assigned", function (done) {

            delete subject._settings.client_id;
            stubState.client_id = "something different";

            stubResponse.id_token = id_token;

            subject._processSigninParams(stubState, stubResponse).then(response => {
                delete subject._settings.client_id.should.equal("something different");
                done();
            });
        });

        it("should validate that the client state matches response state", function (done) {

            stubResponse.state = "not_the_id";
            subject._processSigninParams(stubState, stubResponse).then(null, err => {
                err.message.should.contain('match');
                done();
            });

        });

        it("should fail on error response", function (done) {

            stubResponse.error = "some_error";
            subject._processSigninParams(stubState, stubResponse).then(null, err => {
                err.error.should.equal("some_error");
                done();
            });

        });

        it("should return data for error responses", function (done) {

            stubResponse.error = "some_error";
            subject._processSigninParams(stubState, stubResponse).then(null, err => {
                err.state.should.deep.equal({ some: 'data' });
                done();
            });

        });

        it("should fail if request was OIDC but no id_token in response", function (done) {

            delete stubResponse.id_token;
            stubResponse.isOpenIdConnect = true;

            subject._processSigninParams(stubState, stubResponse).then(null, err => {
                err.message.should.contain("id_token");
                done();
            });

        });

        it("should fail if request was not OIDC but id_token in response", function (done) {

            delete stubState.nonce;
            stubResponse.id_token = id_token;

            subject._processSigninParams(stubState, stubResponse).then(null, err => {
                err.message.should.contain("id_token");
                done();
            });

        });

        it("should fail if request was code flow but no code in response", function (done) {

            stubResponse.id_token = id_token;
            stubState.code_verifier = "secret";
            delete stubResponse.code;

            subject._processSigninParams(stubState, stubResponse).then(null, err => {
                err.message.should.contain("code");
                done();
            });

        });
        
        it("should fail if request was not code flow no code in response", function (done) {

            stubResponse.id_token = id_token;
            stubResponse.code = "code";

            subject._processSigninParams(stubState, stubResponse).then(null, err => {
                err.message.should.contain("code");
                done();
            });

        });

        it("should return data for successful responses", function (done) {

            stubResponse.id_token = id_token;

            subject._processSigninParams(stubState, stubResponse).then(response => {
                response.state.should.deep.equal({ some: 'data' });
                done();
            });

        });
    });

    describe("_processClaims", function () {

        it("should filter protocol claims if OIDC", function (done) {

            stubResponse.isOpenIdConnect = true;
            stubResponse.profile = { a: 'apple', b: 'banana' };

            subject._processClaims({}, stubResponse).then(response => {
                subject._filterProtocolClaimsWasCalled.should.be.true;
                done();
            });

        });

        it("should not filter protocol claims if not OIDC", function (done) {

            stubResponse.isOpenIdConnect = false;

            subject._processClaims({}, stubResponse).then(response => {
                assert.isUndefined(subject._filterProtocolClaimsWasCalled);
                done();
            });

        });

        it("should load and merge user info claims when loadUserInfo configured", function (done) {

            settings.loadUserInfo = true;

            stubResponse.isOpenIdConnect = true;
            stubResponse.profile = { a: 'apple', b: 'banana' };
            stubResponse.access_token = "access_token";
            stubUserInfoService.getClaimsResult = Promise.resolve({ c: 'carrot' });

            subject._processClaims({}, stubResponse).then(response => {
                stubUserInfoService.getClaimsWasCalled.should.be.true;
                subject._mergeClaimsWasCalled.should.be.true;
                done();
            });

        });

        it("should not run if reqest was not openid", function (done) {

            settings.loadUserInfo = true;

            stubResponse.isOpenIdConnect = false;
            stubResponse.profile = { a: 'apple', b: 'banana' };
            stubResponse.access_token = "access_token";
            stubUserInfoService.getClaimsResult = Promise.resolve({ c: 'carrot' });

            subject._processClaims({}, stubResponse).then(response => {
                stubUserInfoService.getClaimsWasCalled.should.be.false;
                done();
            });

        });

        it("should not load and merge user info claims when loadUserInfo not configured", function (done) {

            settings.loadUserInfo = false;

            stubResponse.isOpenIdConnect = true;
            stubResponse.profile = { a: 'apple', b: 'banana' };
            stubResponse.access_token = "access_token";
            stubUserInfoService.getClaimsResult = Promise.resolve({ c: 'carrot' });

            subject._processClaims({}, stubResponse).then(response => {
                stubUserInfoService.getClaimsWasCalled.should.be.false;
                done();
            });

        });

        it("should not load user info claims if no access token", function (done) {

            settings.loadUserInfo = true;

            stubResponse.isOpenIdConnect = true;
            stubResponse.profile = { a: 'apple', b: 'banana' };
            stubUserInfoService.getClaimsResult = Promise.resolve({ c: 'carrot' });

            subject._processClaims({}, stubResponse).then(response => {
                stubUserInfoService.getClaimsWasCalled.should.be.false;
                done();
            });

        });

    });


    describe("_mergeClaims", function () {

        it("should merge claims", function () {

            var c1 = { a: 'apple', b: 'banana' };
            var c2 = { c: 'carrot' };

            var result = subject._mergeClaims(c1, c2);
            result.should.deep.equal({ a: 'apple', c: 'carrot', b: 'banana' });
        });

        it("should not merge claims when claim types are objects", function () {

            var c1 = { custom: {'apple': 'foo', 'pear': 'bar'} };
            var c2 = { custom: {'apple': 'foo', 'orange': 'peel'}, b: 'banana' };

            var result = subject._mergeClaims(c1, c2);
            result.should.deep.equal({ custom: [{'apple': 'foo', 'pear': 'bar'}, {'apple': 'foo', 'orange': 'peel'}], b: 'banana' });
        });

        it("should merge claims when claim types are objects when mergeClaims settings is true", function () {

            settings.mergeClaims = true;

            var c1 = { custom: {'apple': 'foo', 'pear': 'bar'} };
            var c2 = { custom: {'apple': 'foo', 'orange': 'peel'}, b: 'banana' };
            
            var result = subject._mergeClaims(c1, c2);
            result.should.deep.equal({ custom: {'apple': 'foo', 'pear': 'bar', 'orange': 'peel'}, b: 'banana' });
        });

        it("should merge same claim types into array", function () {

            var c1 = { a: 'apple', b: 'banana' };
            var c2 = { a: 'carrot' };

            var result = subject._mergeClaims(c1, c2);
            result.should.deep.equal({ a: ['apple', 'carrot'], b: 'banana' });
        });

        it("should merge arrays of same claim types into array", function () {

            var c1 = { a: 'apple', b: 'banana' };
            var c2 = { a: ['carrot', 'durian'] };
            var result = subject._mergeClaims(c1, c2);
            result.should.deep.equal({ a: ['apple', 'carrot', 'durian'], b: 'banana' });

            var c1 = { a: ['apple', 'carrot'], b: 'banana' };
            var c2 = { a: ['durian'] };
            var result = subject._mergeClaims(c1, c2);
            result.should.deep.equal({ a: ['apple', 'carrot', 'durian'], b: 'banana' });

            var c1 = { a: ['apple', 'carrot'], b: 'banana' };
            var c2 = { a: 'durian' };
            var result = subject._mergeClaims(c1, c2);
            result.should.deep.equal({ a: ['apple', 'carrot', 'durian'], b: 'banana' });
        });

        it("should remove duplicates when producing arrays", function () {

            var c1 = { a: 'apple', b: 'banana' };
            var c2 = { a: ['apple', 'durian'] };
            var result = subject._mergeClaims(c1, c2);
            result.should.deep.equal({ a: ['apple', 'durian'], b: 'banana' });
        });

        it("should not add if already present in array", function () {

            var c1 = { a: ['apple', 'durian'], b: 'banana' };
            var c2 = { a: 'apple' };
            var result = subject._mergeClaims(c1, c2);
            result.should.deep.equal({ a: ['apple', 'durian'], b: 'banana' });
        });
    });

    describe("_filterProtocolClaims", function () {

        it("should filter protocol claims if enabled on settings", function () {

            settings._filterProtocolClaims = true;
            let claims = {
                foo: 1, bar: 'test',
                aud: 'some_aud', iss: 'issuer',
                sub: '123', email: 'foo@gmail.com',
                role: ['admin', 'dev'],
                nonce: 'nonce', at_hash: "athash",
                iat: 5, nbf: 10, exp: 20
            };

            var result = subject._filterProtocolClaims(claims);
            result.should.deep.equal({
                foo: 1, bar: 'test',
                sub: '123', email: 'foo@gmail.com',
                role: ['admin', 'dev']
            });

        });

        it("should not filter protocol claims if not enabled on settings", function () {

            settings._filterProtocolClaims = false;
            let claims = {
                foo: 1, bar: 'test',
                aud: 'some_aud', iss: 'issuer',
                sub: '123', email: 'foo@gmail.com',
                role: ['admin', 'dev'],
                nonce: 'nonce', at_hash: "athash",
                iat: 5, nbf: 10, exp: 20
            };

            var result = subject._filterProtocolClaims(claims);
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

    describe("_validateTokens", function () {

        it("should validate id_token and access_token", function (done) {

            stubResponse.id_token = "id_token";
            stubResponse.access_token = "access_token";
            subject._validateIdTokenAndAccessTokenResult = Promise.resolve(stubResponse);

            subject._validateTokens(stubState, stubResponse).then(response => {
                subject._validateIdTokenAndAccessTokenWasCalled.should.be.true;
                expect(subject._validateIdTokenWasCalled).to.be.undefined;
                done();
            });

        });

        it("should validate just id_token", function (done) {

            stubResponse.id_token = "id_token";
            subject._validateIdTokenResult = Promise.resolve(stubResponse);

            subject._validateTokens(stubState, stubResponse).then(response => {
                subject._validateIdTokenWasCalled.should.be.true;
                expect(subject._validateIdTokenAndAccessTokenWasCalled).to.be.undefined;
                done();
            });

        });

        it("should not validate if only access_token", function (done) {

            stubResponse.access_token = "access_token";

            subject._validateTokens(stubState, stubResponse).then(response => {
                expect(subject._validateIdTokenWasCalled).to.be.undefined;
                expect(subject._validateIdTokenAndAccessTokenWasCalled).to.be.undefined;
                done();
            });

        });
    });

    describe("_validateIdTokenAndAccessToken", function () {

        it("should validate id_token and access_token", function (done) {

            stubResponse.id_token = id_token;
            stubResponse.access_token = access_token;
            stubResponse.profile = {
                at_hash: at_hash
            };
            subject._validateIdTokenResult = Promise.resolve(stubResponse);

            subject._validateIdTokenAndAccessToken(stubState, stubResponse).then(response => {
                subject._validateIdTokenWasCalled.should.be.true;
                subject._validateAccessTokenWasCalled.should.be.true;
                done();
            });

        });

        it("should not access_token if id_token validation fails", function (done) {

            stubResponse.id_token = "id_token";
            stubResponse.access_token = "access_token";
            subject._validateIdTokenResult = Promise.reject(new Error("error"));

            subject._validateIdTokenAndAccessToken(stubState, stubResponse).then(null, err => {
                subject._validateIdTokenWasCalled.should.be.true;
                expect(subject._validateAccessTokenWasCalled).to.be.undefined;
                done();
            });

        });

    });

    describe("_getSigningKeyForJwt", function () {

        it("should fail if loading keys fails.", function (done) {

            const jwt = { header: { kid: 'a3rMUgMFv9tPclLa6yF3zAkfquE' }};
            stubMetadataService.getSigningKeysResult = Promise.reject(new Error("keys"));

            subject._getSigningKeyForJwt(jwt).then(null, err => {
              err.message.should.contain('keys');
              done();
            })
        })

        it("should fetch suitable signing key for the jwt.", function (done) {

            const jwt = { header: { kid: 'a3rMUgMFv9tPclLa6yF3zAkfquE' }};
            stubMetadataService.getSigningKeysResult = Promise.resolve([{ kid: 'a3rMUgMFv9tPclLa6yF3zAkfquE' }, { kid: 'other_key' } ])

            subject._getSigningKeyForJwt(jwt).then(key => {
              key.should.deep.equal({ kid: 'a3rMUgMFv9tPclLa6yF3zAkfquE' })
              done();
            })
        })
    })

    describe("_getSigningKeyForJwtWithSingleRetry", function () {

        it("should retry once if suitable signing key is not found.", function (done) {

            const jwt = { header: { kid: 'a3rMUgMFv9tPclLa6yF3zAkfquE' }};
            var callCount = 0
            stubMetadataService.getSigningKeysResult = Promise.resolve([ { kid: 'other_key' } ])

            subject._getSigningKeyForJwtWithSingleRetry(jwt).then(key => {
              subject._getSigningKeyForJwtSignedCalledCount.should.equal(2);
              done();
            })
        })

        it("should not retry if suitable signing key is found.", function (done) {

            const jwt = { header: { kid: 'a3rMUgMFv9tPclLa6yF3zAkfquE' }};
            var callCount = 0
            stubMetadataService.getSigningKeysResult = Promise.resolve([ { kid: 'a3rMUgMFv9tPclLa6yF3zAkfquE' } ])

            subject._getSigningKeyForJwtWithSingleRetry(jwt).then(key => {
              subject._getSigningKeyForJwtSignedCalledCount.should.equal(1);
              done();
            })
        })
    })

    describe("_validateIdToken", function () {

        it("should fail if no nonce on state", function (done) {

            delete stubState.nonce;
            stubResponse.id_token = id_token;

            subject._validateIdToken(stubState, stubResponse).then(null, err => {
                err.message.should.contain('nonce');
                done();
            });
        });

        it("should fail if invalid id_token", function (done) {

            subject._validateIdToken(stubState, stubResponse).then(null, err => {
                err.message.should.contain('id_token');
                done();
            });
        });

        it("should fail if audience doesn't match id_token", function (done) {

            stubState.client_id = "invalid client_id";
            stubResponse.id_token = id_token;
            stubMetadataService.getIssuerResult = Promise.resolve("test");
            stubMetadataService.getSigningKeysResult = Promise.resolve([{ kid: 'a3rMUgMFv9tPclLa6yF3zAkfquE' }]);

            subject._validateIdToken(stubState, stubResponse).then(null, err => {
                done();
            });
        });

        it("should fail if nonce doesn't match id_token", function (done) {

            stubState.nonce = "invalid nonce";
            stubResponse.id_token = id_token;

            subject._validateIdToken(stubState, stubResponse).then(null, err => {
                err.message.should.contain('nonce');
                done();
            });
        });

        it("should fail if issuer fails", function (done) {
            stubResponse.id_token = id_token;
            stubMetadataService.getIssuerResult = Promise.reject(new Error("issuer"));

            subject._validateIdToken(stubState, stubResponse).then(null, err => {
                err.message.should.contain('issuer');
                done();
            });
        });

        it("should fail if loading keys fails", function (done) {

            stubResponse.id_token = id_token;
            stubMetadataService.getIssuerResult = Promise.resolve("test");
            stubMetadataService.getSigningKeysResult = Promise.reject(new Error("keys"));

            subject._validateIdToken(stubState, stubResponse).then(null, err => {
                err.message.should.contain('keys');
                done();
            });
        });

        it("should fail if no matching key found in signing keys", function (done) {

            stubResponse.id_token = id_token;
            stubMetadataService.getIssuerResult = Promise.resolve("test");
            stubMetadataService.getSigningKeysResult = Promise.resolve([]);

            subject._validateIdToken(stubState, stubResponse).then(null, err => {
                err.message.should.contain('kid');
                done();
            });
        });

        it("should validate JWT", function (done) {

            stubResponse.id_token = id_token;
            stubMetadataService.getIssuerResult = Promise.resolve("test");
            stubMetadataService.getSigningKeysResult = Promise.resolve([{ kid: 'a3rMUgMFv9tPclLa6yF3zAkfquE' }]);

            mockJoseUtility.validateJwtResult = Promise.resolve();

            subject._validateIdToken(stubState, stubResponse).then(response => {
                mockJoseUtility.validateJwtWasCalled.should.be.true;
                done();
            });
        });

        it("should set profile on result if successful", function (done) {

            stubResponse.id_token = id_token;
            stubMetadataService.getIssuerResult = Promise.resolve("test");
            stubMetadataService.getSigningKeysResult = Promise.resolve([{ kid: 'a3rMUgMFv9tPclLa6yF3zAkfquE' }]);

            mockJoseUtility.validateJwtResult = Promise.resolve();

            subject._validateIdToken(stubState, stubResponse).then(response => {
                response.profile.should.be.ok;
                done();
            });
        });

    });

    describe("_validateAccessToken", function () {

        it("should require id_token", function (done) {

            stubResponse.id_token = null;
            stubResponse.profile = {
                at_hash: at_hash
            };

            subject._validateAccessToken(stubResponse).then(null, err => {
                err.message.should.contain("id_token");
                done();
            });
        });

        it("should require profile", function (done) {

            stubResponse.id_token = id_token;
            stubResponse.profile = null;

            subject._validateAccessToken(stubResponse).then(null, err => {
                err.message.should.contain("profile");
                done();
            });
        });

        it("should require at_hash on profile", function (done) {

            stubResponse.id_token = id_token;
            stubResponse.profile = {
            };

            subject._validateAccessToken(stubResponse).then(null, err => {
                err.message.should.contain("at_hash");
                done();
            });
        });

        it("should fail for invalid id_token", function (done) {

            stubResponse.id_token = "bad";
            stubResponse.profile = {
                at_hash: at_hash
            };

            subject._validateAccessToken(stubResponse).then(null, err => {
                Log.debug(err);
                err.message.should.contain("id_token");
                done();
            });
        });

        it("should require proper alg on id_token", function (done) {

            stubResponse.id_token = "bad";
            stubResponse.profile = {
                at_hash: at_hash
            };
            mockJoseUtility.parseJwtResult = { header: { alg: "bad" } };

            subject._validateAccessToken(stubResponse).then(null, err => {
                Log.debug(err);
                err.message.should.contain("alg");
                done();
            });
        });

        it("should fail for invalid algs of incorrect bit lengths", function (done) {

            stubResponse.id_token = id_token;
            stubResponse.access_token = access_token;
            stubResponse.profile = {
                at_hash: at_hash
            };

            mockJoseUtility.parseJwtResult = { header: { alg: "HS123" } };
            subject._validateAccessToken(stubResponse).then(null, err => {
                err.message.should.contain("alg");
                done();
            });
        });

        it("should fail for algs of not correct string length", function (done) {

            stubResponse.id_token = id_token;
            stubResponse.access_token = access_token;
            stubResponse.profile = {
                at_hash: at_hash
            };

            mockJoseUtility.parseJwtResult = { header: { alg: "abc" } };
            subject._validateAccessToken(stubResponse).then(null, err => {
                err.message.should.contain("alg");
                done();
            });

        });

        it("should fail if at_hash does not match", function (done) {

            stubResponse.id_token = id_token;
            stubResponse.access_token = access_token;
            stubResponse.profile = {
                at_hash: at_hash
            };
            mockJoseUtility.parseJwtResult = { header: { alg: "RS256" } };
            mockJoseUtility.hashStringResult = "hash";
            mockJoseUtility.hexToBase64UrlResult = "wrong";

            subject._validateAccessToken(stubResponse).then(null, err => {
                err.message.should.contain("at_hash");
                done();
            });
        });

        it("should validate at_hash", function (done) {

            stubResponse.id_token = id_token;
            stubResponse.access_token = access_token;
            stubResponse.profile = {
                at_hash: at_hash
            };

            subject._validateAccessToken(stubResponse).then(response => {
                response.should.be.deep.equal(stubResponse);
                done();
            });
        });

    });
});
