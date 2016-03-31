import Log from '../../src/Log';
import SignoutRequest from '../../src/SignoutRequest';

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

        it("should include state", function() {
            subject.url.should.contain("state=" + subject.state.id);
        });

        it("should include id_token_hint", function() {
            subject.url.should.contain("id_token_hint=hint");
        });

        it("should include post_logout_redirect_uri", function() {
            subject.url.should.contain("post_logout_redirect_uri=loggedout");
        });

        it("should include id_token_hint, post_logout_redirect_uri, and state", function() {
            var url = subject.url;
            url.indexOf('http://sts/signout?').should.equal(0);
            url.should.contain("id_token_hint=hint");
            url.should.contain("post_logout_redirect_uri=loggedout");
            url.should.contain("state=" + subject.state.id);
        });

    });

});
