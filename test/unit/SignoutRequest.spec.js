// Copyright (c) Brock Allen & Dominick Baier. All rights reserved.
// Licensed under the Apache License, Version 2.0. See LICENSE in the project root for license information.

import { Log } from '../../src/Log';
import { SignoutRequest } from '../../src/SignoutRequest';

import chai from 'chai';
chai.should();
let assert = chai.assert;

describe("SignoutRequest", function() {

    let subject;
    let settings;

    beforeEach(function() {
        settings = {
            url: "http://sts/signout",
            id_token_hint: "hint",
            post_logout_redirect_uri: "loggedout",
            data: { data: "test" }
        };
        subject = new SignoutRequest(settings);
    });

    describe("constructor", function() {

        it("should require a url param", function() {
            try {
                delete settings.url;
                new SignoutRequest(settings);
            }
            catch (e) {
                e.message.should.contain('url');
                return;
            }
            assert.fail();
        });

    });

    describe("url", function() {

        it("should include url", function() {
            subject.url.indexOf("http://sts/signout").should.equal(0);
        });

        it("should include id_token_hint", function() {
            subject.url.should.contain("id_token_hint=hint");
        });

        it("should include post_logout_redirect_uri if id_token_hint also provided", function() {
            subject.url.should.contain("post_logout_redirect_uri=loggedout");
        });

        it("should include post_logout_redirect_uri if no id_token_hint provided", function() {

            delete settings.id_token_hint;
            subject = new SignoutRequest(settings);

            subject.url.should.contain("post_logout_redirect_uri=loggedout");
        });

        it("should include state if post_logout_redirect_uri provided", function() {
            subject.url.should.contain("state=" + subject.state.id);
        });

        it("should not include state if no post_logout_redirect_uri provided", function() {
            delete settings.post_logout_redirect_uri;
            subject = new SignoutRequest(settings);
            subject.url.should.not.contain("state=");
        });


        it("should include id_token_hint, post_logout_redirect_uri, and state", function() {
            var url = subject.url;
            url.indexOf('http://sts/signout?').should.equal(0);
            url.should.contain("id_token_hint=hint");
            url.should.contain("post_logout_redirect_uri=loggedout");
            url.should.contain("state=" + subject.state.id);
        });

        it("should include extra query params", function() {
            settings.extraQueryParams = {
                'TargetResource': 'logouturl.com',
                'InErrorResource': 'errorurl.com'
            };
            subject = new SignoutRequest(settings);
            subject.url.should.contain('TargetResource=logouturl.com&InErrorResource=errorurl.com');
        });

    });

});
