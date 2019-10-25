// Copyright (c) Brock Allen & Dominick Baier. All rights reserved.
// Licensed under the Apache License, Version 2.0. See LICENSE in the project root for license information.

import { Log } from '../../src/Log';
import { SigninRequest } from '../../src/SigninRequest';

import chai from 'chai';
chai.should();
let assert = chai.assert;

describe("SigninRequest", function() {

    let subject;
    let settings;

    beforeEach(function() {
        settings = {url: "http://sts/signin",
            client_id: "client",
            redirect_uri: "http://app",
            response_type: "id_token",
            scope: "openid",
            authority : "op",
            data: {data: "test"}
        };
        subject = new SigninRequest(settings);
    });

    describe("constructor", function() {

        it("should require a url param", function() {
            try {
                delete settings.url;
                new SigninRequest(settings);
            }
            catch (e) {
                e.message.should.contain('url');
                return;
            }
            assert.fail();
        });

        it("should require a client_id param", function() {
            try {
                delete settings.client_id;
                new SigninRequest(settings);
            }
            catch (e) {
                e.message.should.contain('client_id');
                return;
            }
            assert.fail();
        });

        it("should require a redirect_uri param", function() {
            try {
                delete settings.redirect_uri;
                new SigninRequest(settings);
            }
            catch (e) {
                e.message.should.contain('redirect_uri');
                return;
            }
            assert.fail();
        });

        it("should require a response_type param", function() {
            try {
                delete settings.response_type;
                new SigninRequest(settings);
            }
            catch (e) {
                e.message.should.contain('response_type');
                return;
            }
            assert.fail();
        });

        it("should require a scope param", function() {
            try {
                delete settings.scope;
                new SigninRequest(settings);
            }
            catch (e) {
                e.message.should.contain('scope');
                return;
            }
            assert.fail();
        });

        it("should require a authority param", function() {
            try {
                delete settings.authority;
                new SigninRequest(settings);
            }
            catch (e) {
                e.message.should.contain('authority');
                return;
            }
            assert.fail();
        });

    });

    describe("url", function() {

        it("should include url", function() {
            subject.url.indexOf("http://sts/signin").should.equal(0);
        });

        it("should include client_id", function() {
            subject.url.should.contain("client_id=client");
        });

        it("should include redirect_uri", function() {
            subject.url.should.contain("redirect_uri=" + encodeURIComponent("http://app"));
        });

        it("should include response_type", function() {
            subject.url.should.contain("response_type=id_token");
        });

        it("should include scope", function() {
            subject.url.should.contain("scope=openid");
        });

        it("should include state", function() {
            subject.url.should.contain("state=" + subject.state.id);
        });

        it("should include prompt", function() {
            settings.prompt = "foo";
            subject = new SigninRequest(settings);
            subject.url.should.contain("prompt=foo");
        });

        it("should include display", function() {
            settings.display = "foo";
            subject = new SigninRequest(settings);
            subject.url.should.contain("display=foo");
        });

        it("should include max_age", function() {
            settings.max_age = "foo";
            subject = new SigninRequest(settings);
            subject.url.should.contain("max_age=foo");
        });

        it("should include ui_locales", function() {
            settings.ui_locales = "foo";
            subject = new SigninRequest(settings);
            subject.url.should.contain("ui_locales=foo");
        });

        it("should include id_token_hint", function() {
            settings.id_token_hint = "foo";
            subject = new SigninRequest(settings);
            subject.url.should.contain("id_token_hint=foo");
        });

        it("should include login_hint", function() {
            settings.login_hint = "foo";
            subject = new SigninRequest(settings);
            subject.url.should.contain("login_hint=foo");
        });

        it("should include acr_values", function() {
            settings.acr_values = "foo";
            subject = new SigninRequest(settings);
            subject.url.should.contain("acr_values=foo");
        });

        it("should include resource", function() {
            settings.resource = "foo";
            subject = new SigninRequest(settings);
            subject.url.should.contain("resource=foo");
        });

        it("should include response_mode", function() {
            settings.response_mode = "foo";
            subject = new SigninRequest(settings);
            subject.url.should.contain("response_mode=foo");
        });

        it("should include request", function() {
            settings.request = "foo";
            subject = new SigninRequest(settings);
            subject.url.should.contain("request=foo");
        });

        it("should include request_uri", function() {
            settings.request_uri = "foo";
            subject = new SigninRequest(settings);
            subject.url.should.contain("request_uri=foo");
        });

        it("should include extra query params", function() {
            settings.extraQueryParams = {
                'hd': 'domain.com',
                'foo': 'bar'
            };
            subject = new SigninRequest(settings);
            subject.url.should.contain('hd=domain.com&foo=bar');
        });

        it("should store extra token params in state", function() {
            settings.extraTokenParams = {
                'resourceServer': 'abc',
            };
            subject = new SigninRequest(settings);
            assert.deepEqual(subject.state.extraTokenParams, {
                'resourceServer': 'abc'
            });
        });

        it("should include code flow params", function() {
            settings.response_type = "code";
            subject = new SigninRequest(settings);
            subject.url.should.contain("code_challenge=");
            subject.url.should.contain("code_challenge_method=S256");
        });
        
        it("should include hybrid flow params", function() {
            settings.response_type = "code id_token";
            subject = new SigninRequest(settings);
            subject.url.should.contain("nonce=");
            subject.url.should.contain("code_challenge=");
            subject.url.should.contain("code_challenge_method=S256");
        });
    });

    describe("isOidc", function() {
        it("should indicate if response_type is oidc", function() {
            SigninRequest.isOidc("id_token").should.be.true;
            SigninRequest.isOidc("id_token token").should.be.true;
            SigninRequest.isOidc("token id_token").should.be.true;
            SigninRequest.isOidc("token").should.be.false;
        });
    });

    describe("isOAuth", function() {
        it("should indicate if response_type is oauth", function() {
            SigninRequest.isOAuth("token").should.be.true;
            SigninRequest.isOAuth("id_token token").should.be.true;
            SigninRequest.isOAuth("token id_token").should.be.true;
            SigninRequest.isOAuth("id_token").should.be.false;
        });
    });

    describe("isCode", function() {
        it("should indicate if response_type is code", function() {
            SigninRequest.isCode("code").should.be.true;
            SigninRequest.isCode("id_token code").should.be.true;
            SigninRequest.isCode("code id_token").should.be.true;
            SigninRequest.isCode("id_token token code").should.be.true;
            SigninRequest.isCode("id_token code token").should.be.true;
            SigninRequest.isCode("code id_token token").should.be.true;

            SigninRequest.isCode("id_token token").should.be.false;
            SigninRequest.isCode("token id_token").should.be.false;
        });
    });

});
