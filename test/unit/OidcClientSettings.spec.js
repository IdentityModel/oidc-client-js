// Copyright (c) Brock Allen & Dominick Baier. All rights reserved.
// Licensed under the Apache License, Version 2.0. See LICENSE in the project root for license information.

import { Log } from '../../src/Log';
import { OidcClientSettings } from '../../src/OidcClientSettings';
import { Global } from '../../src/Global';

import chai from 'chai';
chai.should();
let assert = chai.assert;

describe("OidcClientSettings", function () {

    beforeEach(function () {
        Global._testing();
        Log.logger = console;
        Log.level = Log.NONE;
    });

    describe("client_id", function () {
        it("should return value from initial settings", function () {
            let subject = new OidcClientSettings({
                client_id: 'client'
            });
            subject.client_id.should.equal("client");
        });

        it("should not allow setting if previously set", function () {
            let subject = new OidcClientSettings({
                client_id: 'client',
                authority: "http://sts"
            });
            try {
                subject.client_id = "diff";
                assert.fail();
            }
            catch (e) {
                e.message.should.contain("client_id");
            }
        });

        it("should allow setting if not previously set", function () {
            let subject = new OidcClientSettings({
            });
            subject.client_id = "test";
            subject.client_id.should.equal("test");
        });
    });

    describe("client_secret", function () {
        it("should return value from initial settings", function () {
            let subject = new OidcClientSettings({
                client_secret: 'secret'
            });
            subject.client_secret.should.equal("secret");
        });
    });

    describe("response_type", function () {
        it("should return value from initial settings", function () {
            let subject = new OidcClientSettings({
                client_id: 'client',
                response_type: "foo"
            });
            subject.response_type.should.equal("foo");
        });

        it("should use default value", function () {
            let subject = new OidcClientSettings({
                client_id: 'client'
            });
            subject.response_type.should.equal("id_token");
        });

    });

    describe("scope", function () {
        it("should return value from initial settings", function () {
            let subject = new OidcClientSettings({
                client_id: 'client',
                scope: "foo"
            });
            subject.scope.should.equal("foo");
        });

        it("should use default value", function () {
            let subject = new OidcClientSettings({
                client_id: 'client'
            });
            subject.scope.should.equal("openid");
        });

    });

    describe("redirect_uri", function () {
        it("should return value from initial settings", function () {
            let subject = new OidcClientSettings({
                client_id: 'client',
                redirect_uri: "foo"
            });
            subject.redirect_uri.should.equal("foo");
        });

    });

    describe("post_logout_redirect_uri", function () {
        it("should return value from initial settings", function () {
            let subject = new OidcClientSettings({
                client_id: 'client',
                post_logout_redirect_uri: "http://app/loggedout"
            });
            subject.post_logout_redirect_uri.should.equal("http://app/loggedout");
        });
    });

    describe("prompt", function () {
        it("should return value from initial settings", function () {
            let subject = new OidcClientSettings({
                client_id: 'client',
                prompt: "foo"
            });
            subject.prompt.should.equal("foo");
        });
    });

    describe("display", function () {
        it("should return value from initial settings", function () {
            let subject = new OidcClientSettings({
                client_id: 'client',
                display: "foo"
            });
            subject.display.should.equal("foo");
        });
    });

    describe("max_age", function () {
        it("should return value from initial settings", function () {
            let subject = new OidcClientSettings({
                client_id: 'client',
                max_age: "foo"
            });
            subject.max_age.should.equal("foo");
        });
    });

    describe("ui_locales", function () {
        it("should return value from initial settings", function () {
            let subject = new OidcClientSettings({
                client_id: 'client',
                ui_locales: "foo"
            });
            subject.ui_locales.should.equal("foo");
        });
    });

    describe("acr_values", function () {
        it("should return value from initial settings", function () {
            let subject = new OidcClientSettings({
                client_id: 'client',
                acr_values: "foo"
            });
            subject.acr_values.should.equal("foo");
        });
    });

    describe("resource", function () {
        it("should return value from initial settings", function () {
            let subject = new OidcClientSettings({
                client_id: 'client',
                resource: "foo"
            });
            subject.resource.should.equal("foo");
        });
    });

    describe("response_mode", function () {
        it("should return value from initial settings", function () {
            let subject = new OidcClientSettings({
                client_id: 'client',
                response_mode: "foo"
            });
            subject.response_mode.should.equal("foo");
        });
    });

    describe("authority", function () {
        it("should return value from initial settings", function () {
            let subject = new OidcClientSettings({
                client_id: 'client',
                authority: "http://sts"
            });
            subject.authority.should.equal("http://sts");
        });

        it("should not allow setting if previously set", function () {
            let subject = new OidcClientSettings({
                client_id: 'client',
                authority: "http://sts"
            });
            try {
                subject.authority = "http://sts2";
                assert.fail();
            }
            catch (e) {
                e.message.should.contain("authority");
            }
        });

        it("should allow setting if not previously set", function () {
            let subject = new OidcClientSettings({
                client_id: 'client'
            });
            subject.authority = "http://sts";
            subject.authority.should.equal("http://sts");
        });
    });

    describe("metadataUrl", function () {
        it("should return value from initial settings", function () {
            let subject = new OidcClientSettings({
                client_id: 'client',
                metadataUrl: "http://sts/metadata"
            });
            subject.metadataUrl.should.equal("http://sts/metadata");
        });

        it("should infer value from authority", function () {
            let subject = new OidcClientSettings({
                client_id: 'client',
                authority: "http://sts"
            });
            subject.metadataUrl.should.equal("http://sts/.well-known/openid-configuration");

            subject = new OidcClientSettings({
                client_id: 'client',
                authority: "http://sts/"
            });
            subject.metadataUrl.should.equal("http://sts/.well-known/openid-configuration");
        });

    });

    describe("metadata", function () {
        it("should return value from initial settings", function () {
            let subject = new OidcClientSettings({
                client_id: 'client',
                metadata: "test"
            });
            subject.metadata.should.equal("test");
        });

        it("should store value", function () {
            let subject = new OidcClientSettings({
                client_id: 'client',
            });
            subject.metadata = "test";
            subject.metadata.should.equal("test");
        });

    });

    describe("signingKeys", function () {
        it("should return value from initial settings", function () {
            let subject = new OidcClientSettings({
                client_id: 'client',
                signingKeys: "test"
            });
            subject.signingKeys.should.equal("test");
        });

        it("should store value", function () {
            let subject = new OidcClientSettings({
                client_id: 'client',
            });
            subject.signingKeys = "test";
            subject.signingKeys.should.equal("test");
        });

    });

    describe("filterProtocolClaims", function () {

        it("should use default value", function () {
            let subject = new OidcClientSettings({
                client_id: 'client',
            });
            subject.filterProtocolClaims.should.equal(true);
        });

        it("should return value from initial settings", function () {
            let subject = new OidcClientSettings({
                client_id: 'client',
                filterProtocolClaims: true
            });
            subject.filterProtocolClaims.should.equal(true);

            subject = new OidcClientSettings({
                client_id: 'client',
                filterProtocolClaims: false
            });
            subject.filterProtocolClaims.should.equal(false);
        });
    });

    describe("loadUserInfo", function () {

        it("should use default value", function () {
            let subject = new OidcClientSettings({
                client_id: 'client',
            });
            subject.loadUserInfo.should.equal(true);
        });

        it("should return value from initial settings", function () {
            let subject = new OidcClientSettings({
                client_id: 'client',
                loadUserInfo: true
            });
            subject.loadUserInfo.should.equal(true);

            subject = new OidcClientSettings({
                client_id: 'client',
                loadUserInfo: false
            });
            subject.loadUserInfo.should.equal(false);
        });
    });

    describe("staleStateAge", function () {

        it("should use default value", function () {
            let subject = new OidcClientSettings({
                client_id: 'client',
            });
            subject.staleStateAge.should.equal(900);
        });

        it("should return value from initial settings", function () {
            let subject = new OidcClientSettings({
                client_id: 'client',
                staleStateAge: 100
            });
            subject.staleStateAge.should.equal(100);
        });
    });

    describe("clockSkew", function () {

        it("should use default value", function () {
            let subject = new OidcClientSettings({
                client_id: 'client'
            });
            subject.clockSkew.should.equal(5 * 60); // 5 mins
        });

        it("should return value from initial settings", function () {
            let subject = new OidcClientSettings({
                client_id: 'client',
                clockSkew: 10
            });
            subject.clockSkew.should.equal(10);
        });
    });

    describe("stateStore", function () {

        it("should return value from initial settings", function () {
            let temp = {};
            let subject = new OidcClientSettings({
                client_id: 'client',
                stateStore: temp
            });
            subject.stateStore.should.equal(temp);
        });
    });

    describe("stateStore", function () {

        it("should return value from initial settings", function () {
            let temp = {};
            let subject = new OidcClientSettings({
                client_id: 'client',
                stateStore: temp
            });
            subject.stateStore.should.equal(temp);
        });
    });

    describe("validator", function () {

        it("should return value from initial settings", function () {

            let temp = {};
            let subject = new OidcClientSettings({
                client_id: 'client',
                ResponseValidatorCtor: function () { return temp }
            });
            subject.validator.should.equal(temp);
        });
    });

    describe("metadataServiceCtor", function () {

        it("should return value from initial settings", function () {

            let temp = {};
            let subject = new OidcClientSettings({
                client_id: 'client',
                MetadataServiceCtor: function () { return temp }
            });
            subject.metadataService.should.equal(temp);
        });
    });

    describe("extraQueryParams", function() {

        it("should use default value", function () {
            let subject = new OidcClientSettings({
                client_id: 'client'
            });
            subject.extraQueryParams.should.deep.equal({});
        });

        it("should return value from initial settings", function () {
            let subject = new OidcClientSettings({
                client_id: 'client',
                extraQueryParams: {
                    'hd': 'domain.com'
                }
            });
            subject.extraQueryParams.should.deep.equal({ 'hd': 'domain.com' });
        });

        it("should not set value from initial settings if not object, but set default value ({})", function () {
            let subject = new OidcClientSettings({
                client_id: 'client',
                extraQueryParams: 123456
            });
            subject.extraQueryParams.should.deep.equal({});
        });

        it("should set it if object", function () {
            let subject = new OidcClientSettings({
                client_id: 'client',
            });
            subject.extraQueryParams = { 'hd': 'domain.com' };
            subject.extraQueryParams.should.deep.equal({ 'hd': 'domain.com' });
        });

        it("should clear it if not object", function() {
            let subject = new OidcClientSettings({
                client_id: 'client',
                extraQueryParams: {
                    'hd': 'domain.com',
                }
            });
            subject.extraQueryParams = undefined;
            subject.extraQueryParams.should.deep.equal({});
        });
    })

    describe("extraTokenParams", function() {

        it("should use default value", function () {
            let subject = new OidcClientSettings({
                client_id: 'client'
            });
            subject.extraTokenParams.should.deep.equal({});
        });

        it("should return value from initial settings", function () {
            let subject = new OidcClientSettings({
                client_id: 'client',
                extraTokenParams: {
                    'resourceServer': 'abc'
                }
            });
            subject.extraTokenParams.should.deep.equal({ 'resourceServer': 'abc' });
        });

        it("should not set value from initial settings if not object, but set default value ({})", function () {
            let subject = new OidcClientSettings({
                client_id: 'client',
                extraTokenParams: 123456
            });
            subject.extraTokenParams.should.deep.equal({});
        });

        it("should set it if object", function () {
            let subject = new OidcClientSettings({
                client_id: 'client',
            });
            subject.extraTokenParams = { 'resourceServer': 'abc' };
            subject.extraTokenParams.should.deep.equal({ 'resourceServer': 'abc' });
        });

        it("should clear it if not object", function() {
            let subject = new OidcClientSettings({
                client_id: 'client',
                extraTokenParams: {
                    'resourceServer': 'abc',
                }
            });
            subject.extraTokenParams = undefined;
            subject.extraTokenParams.should.deep.equal({});
        });
    })

});
