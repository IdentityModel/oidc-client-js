// Copyright (c) Brock Allen & Dominick Baier. All rights reserved.
// Licensed under the Apache License, Version 2.0. See LICENSE in the project root for license information.

import { Log } from '../../src/Log';
import { UserInfoService } from '../../src/UserInfoService';

import { StubJsonService } from './StubJsonService';
import { StubMetadataService } from './StubMetadataService';

import chai from 'chai';
chai.should();
let assert = chai.assert;

describe("UserInfoService", function() {
    let subject;
    let settings;
    let stubJsonService;
    let stubMetadataService;

    beforeEach(function() {
        settings = {};
        stubJsonService = new StubJsonService();
        stubMetadataService = new StubMetadataService();
        subject = new UserInfoService(settings, () => stubJsonService, () => stubMetadataService);
    });

    describe("constructor", function() {

        it("should require a settings param", function() {
            try {
                new UserInfoService();
            }
            catch (e) {
                e.message.should.contain('settings');
                return;
            }
            assert.fail();
        });

    });

    describe("getClaims", function() {

        it("should return a promise", function() {
            var p = subject.getClaims();
            p.should.be.instanceof(Promise);
            p.catch(e=>{});
        });

        it("should require a token", function(done) {
            subject.getClaims().catch(err => {
                err.message.should.contain("token");
                done();
            });
        });

        it("should call userinfo endpoint and pass token", function(done) {
            stubMetadataService.userInfoEndpointResult = Promise.resolve("http://sts/userinfo");
            stubJsonService.result = Promise.resolve("test");

            subject.getClaims("token").then(claims => {
                stubJsonService.url.should.equal("http://sts/userinfo");
                stubJsonService.token.should.equal("token");
                done();
            });

        });

        it("should fail when dependencies fail", function(done) {
            stubMetadataService.userInfoEndpointResult = Promise.reject(new Error("test"));

            subject.getClaims("token").then(null,
                err => {
                    err.message.should.contain('test');
                    done();
                }
            );

        });

        it("should return claims", function(done) {
            stubMetadataService.userInfoEndpointResult = Promise.resolve("http://sts/userinfo");
            stubJsonService.result = Promise.resolve({
                foo: 1, bar: 'test',
                aud:'some_aud', iss:'issuer',
                sub:'123', email:'foo@gmail.com',
                role:['admin', 'dev'],
                nonce:'nonce', at_hash:"athash",
                iat:5, nbf:10, exp:20
            });

            subject.getClaims("token").then(claims => {
                claims.should.deep.equal({
                    foo: 1, bar: 'test',
                    aud:'some_aud', iss:'issuer',
                    sub:'123', email:'foo@gmail.com',
                    role:['admin', 'dev'],
                    nonce:'nonce', at_hash:"athash",
                    iat:5, nbf:10, exp:20
                });
                done();
            });

        });
    });
});
