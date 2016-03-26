import OidcClientSettings from '../src/OidcClientSettings';
import Log from '../src/Log';

import chai from 'chai';
chai.should();
let assert = chai.assert;

describe("OidcClientSettings", function() {

    beforeEach(function() {
        Log.setLogger(console);
        Log.level = Log.NONE;
    });

    describe("constructor", function() {

        it("should require client_id on settings", function() {
            try {
                new OidcClientSettings({});
            }
            catch (e) {
                e.message.should.contain('client_id');
                return;
            }
            assert.fail();
        });

    });

    describe("client_id", function() {
        it("should return value from initial settings", function() {
            let subject = new OidcClientSettings({
                client_id: 'client'
            });
            subject.client_id.should.equal("client");
        });
    });

    describe("response_type", function() {
        it("should return value from initial settings", function() {
            let subject = new OidcClientSettings({
                client_id: 'client',
                response_type: "foo"
            });
            subject.response_type.should.equal("foo");
        });

        it("should use default value", function() {
            let subject = new OidcClientSettings({
                client_id: 'client'
            });
            subject.response_type.should.equal("id_token");
        });

    });

    describe("scope", function() {
        it("should return value from initial settings", function() {
            let subject = new OidcClientSettings({
                client_id: 'client',
                scope: "foo"
            });
            subject.scope.should.equal("foo");
        });

        it("should use default value", function() {
            let subject = new OidcClientSettings({
                client_id: 'client'
            });
            subject.scope.should.equal("openid");
        });

    });

    describe("redirect_uri", function() {
        it("should return value from initial settings", function() {
            let subject = new OidcClientSettings({
                client_id: 'client',
                redirect_uri: "foo"
            });
            subject.redirect_uri.should.equal("foo");
        });

    });

    describe("post_logout_redirect_uri", function() {
        it("should return value from initial settings", function() {
            let subject = new OidcClientSettings({
                client_id: 'client',
                post_logout_redirect_uri: "http://app/loggedout"
            });
            subject.post_logout_redirect_uri.should.equal("http://app/loggedout");
        });
    });

    describe("prompt", function() {
        it("should return value from initial settings", function() {
            let subject = new OidcClientSettings({
                client_id: 'client',
                prompt: "foo"
            });
            subject.prompt.should.equal("foo");
        });
    });
    
    describe("display", function() {
        it("should return value from initial settings", function() {
            let subject = new OidcClientSettings({
                client_id: 'client',
                display: "foo"
            });
            subject.display.should.equal("foo");
        });
    });

    describe("max_age", function() {
        it("should return value from initial settings", function() {
            let subject = new OidcClientSettings({
                client_id: 'client',
                max_age: "foo"
            });
            subject.max_age.should.equal("foo");
        });
    });

    describe("ui_locales", function() {
        it("should return value from initial settings", function() {
            let subject = new OidcClientSettings({
                client_id: 'client',
                ui_locales: "foo"
            });
            subject.ui_locales.should.equal("foo");
        });
    });

    describe("acr_values", function() {
        it("should return value from initial settings", function() {
            let subject = new OidcClientSettings({
                client_id: 'client',
                acr_values: "foo"
            });
            subject.acr_values.should.equal("foo");
        });
    });

    describe("authority", function() {
        it("should return value from initial settings", function() {
            let subject = new OidcClientSettings({
                client_id: 'client',
                authority: "http://sts"
            });
            subject.authority.should.equal("http://sts");
        });
    });

    describe("metadataUrl", function() {
        it("should return value from initial settings", function() {
            let subject = new OidcClientSettings({
                client_id: 'client',
                metadataUrl: "http://sts/metadata"
            });
            subject.metadataUrl.should.equal("http://sts/metadata");
        });

        it("should infer value from authority", function() {
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

    describe("metadata", function() {
        it("should return value from initial settings", function() {
            let subject = new OidcClientSettings({
                client_id: 'client',
                metadata: "test"
            });
            subject.metadata.should.equal("test");
        });

        it("should store value", function() {
            let subject = new OidcClientSettings({
                client_id: 'client',
            });
            subject.metadata = "test";
            subject.metadata.should.equal("test");
        });

    });

    describe("signingKeys", function() {
        it("should return value from initial settings", function() {
            let subject = new OidcClientSettings({
                client_id: 'client',
                signingKeys: "test"
            });
            subject.signingKeys.should.equal("test");
        });

        it("should store value", function() {
            let subject = new OidcClientSettings({
                client_id: 'client',
            });
            subject.signingKeys = "test";
            subject.signingKeys.should.equal("test");
        });

    });

    describe("filterProtocolClaims", function() {

        it("should use default value", function() {
            let subject = new OidcClientSettings({
                client_id: 'client',
            });
            subject.filterProtocolClaims.should.equal(true);
        });

        it("should return value from initial settings", function() {
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
    
    describe("loadUserInfo", function() {

        it("should use default value", function() {
            let subject = new OidcClientSettings({
                client_id: 'client',
            });
            subject.loadUserInfo.should.equal(true);
        });

        it("should return value from initial settings", function() {
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

});
