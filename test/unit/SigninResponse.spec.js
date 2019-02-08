// Copyright (c) Brock Allen & Dominick Baier. All rights reserved.
// Licensed under the Apache License, Version 2.0. See LICENSE in the project root for license information.

import { Log } from '../../src/Log';
import { SigninResponse } from '../../src/SigninResponse';

import chai from 'chai';
chai.should();
let assert = chai.assert;
let expect = chai.expect;

describe("SigninResponse", function () {

    describe("constructor", function () {

        it("should read error", function () {
            let subject = new SigninResponse("error=foo");
            subject.error.should.equal("foo");
        });

        it("should read error_description", function () {
            let subject = new SigninResponse("error_description=foo");
            subject.error_description.should.equal("foo");
        });

        it("should read error_uri", function () {
            let subject = new SigninResponse("error_uri=foo");
            subject.error_uri.should.equal("foo");
        });

        it("should read state", function () {
            let subject = new SigninResponse("state=foo");
            subject.state.should.equal("foo");
        });

        it("should read code", function () {
            let subject = new SigninResponse("code=foo");
            subject.code.should.equal("foo");
        });

        it("should read id_token", function () {
            let subject = new SigninResponse("id_token=foo");
            subject.id_token.should.equal("foo");
        });

        it("should read session_state", function () {
            let subject = new SigninResponse("session_state=foo");
            subject.session_state.should.equal("foo");
        });

        it("should read access_token", function () {
            let subject = new SigninResponse("access_token=foo");
            subject.access_token.should.equal("foo");
        });

        it("should read token_type", function () {
            let subject = new SigninResponse("token_type=foo");
            subject.token_type.should.equal("foo");
        });

        it("should read scope", function () {
            let subject = new SigninResponse("scope=foo");
            subject.scope.should.equal("foo");
        });

        it("should read expires_in", function () {
            let subject = new SigninResponse("expires_in=10");
            subject.expires_in.should.equal(10);
        });

        it("should calculate expires_at", function () {
            let subject = new SigninResponse("expires_in=10");
            subject.expires_at.should.equal(parseInt((Date.now() / 1000) + 10));
        });

        it("should not read invalid expires_in", function () {
            let subject = new SigninResponse("expires_in=foo");
            expect(subject.expires_in).to.be.undefined;
            expect(subject.expires_at).to.be.undefined;

            subject = new SigninResponse("expires_in=-10");
            expect(subject.expires_in).to.be.undefined;
            expect(subject.expires_at).to.be.undefined;
        });

    });

    describe("scopes", function () {
        it("should return list of scope", function () {
            let subject = new SigninResponse("scope=foo");
            subject.scopes.should.deep.equal(["foo"]);

            subject = new SigninResponse("scope=foo%20bar");
            subject.scopes.should.deep.equal(["foo", "bar"]);

            subject = new SigninResponse("scope=foo%20bar%20baz");
            subject.scopes.should.deep.equal(["foo", "bar", "baz"]);
        });
    });

    describe("expires_in", function () {
        it("should calculate how much time left", function () {
            var oldNow = Date.now;
            Date.now = function () {
                return 1000 * 1000; // ms
            }
            let subject = new SigninResponse("expires_in=100");
            subject.expires_in.should.equal(100);

            Date.now = function () {
                return 1050 * 1000; // ms
            }
            subject.expires_in.should.equal(50);
            Date.now = oldNow;
        });
    });

    describe("expired", function () {
        it("should calculate how much time left", function () {
            var oldNow = Date.now;
            Date.now = function () {
                return 1000 * 1000; // ms
            }
            let subject = new SigninResponse("expires_in=100");
            subject.expired.should.be.false;

            Date.now = function () {
                return 1100 * 1000; // ms
            }
            subject.expired.should.be.true;
            Date.now = oldNow;
        });
    });

    describe("isOpenIdConnect", function () {
        it("should detect openid scope", function () {
            let subject = new SigninResponse("scope=foo%20openid%20bar");
            subject.isOpenIdConnect.should.be.true;

            subject = new SigninResponse("scope=openid%20foo%20bar");
            subject.isOpenIdConnect.should.be.true;

            subject = new SigninResponse("scope=foo%20bar%20openid");
            subject.isOpenIdConnect.should.be.true;

            subject = new SigninResponse("scope=foo%20bar");
            subject.isOpenIdConnect.should.be.false;
        });
    });

});
