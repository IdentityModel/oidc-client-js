import Log from '../src/Log';
import MetadataService from '../src/MetadataService';

import StubJsonService from './StubJsonService';

import chai from 'chai';
chai.should();
let assert = chai.assert;

describe("MetadataService", function() {
    let subject;
    let settings;
    let stubJsonService;

    beforeEach(function() {
        settings = {};
        stubJsonService = new StubJsonService();
        subject = new MetadataService(settings, ()=>stubJsonService);
    });

    describe("constructor", function() {

        it("should require a settings param", function() {
            try {
                new MetadataService();
            }
            catch (e) {
                return;
            }
            assert.fail();
        });

    });

    describe("getMetadata", function() {

        it("should return a promise", function() {
            subject.getMetadata().should.be.instanceof(Promise);
        });

        it("should use metadata on settings", function(done) {
            settings.metadata = "test";

            let p = subject.getMetadata();

            p.then(result => {
                result.should.equal("test");
                done();
            });
        });

        it("should require metadataUrl", function(done) {
            delete settings.metadataUrl;

            let p = subject.getMetadata();

            p.then(null, err => {
                err.message.should.contain('metadataUrl');
                done();
            });
        });

        it("should require metadataUrl", function(done) {
            delete settings.metadataUrl;

            let p = subject.getMetadata();

            p.then(null, err => {
                err.message.should.contain('metadataUrl');
                done();
            });
        });

        it("should use metadataUrl to make json call", function() {
            settings.metadataUrl = "http://sts/metadata";
            stubJsonService.result = Promise.resolve('test');

            subject.getMetadata();

            stubJsonService.url.should.equal("http://sts/metadata");
        });

        it("should return metadata from json call", function(done) {
            settings.metadataUrl = "http://sts/metadata";
            stubJsonService.result = Promise.resolve("test");

            let p = subject.getMetadata();

            p.then(result => {
                result.should.equal("test");
                done();
            });
        });

        it("should cache metadata from json call", function(done) {
            settings.metadataUrl = "http://sts/metadata";
            stubJsonService.result = Promise.resolve("test");

            let p = subject.getMetadata();

            p.then(result => {
                settings.metadata.should.equal("test");
                done();
            });
        });

        it("should fail if json call fails", function(done) {
            settings.metadataUrl = "http://sts/metadata";
            stubJsonService.result = Promise.reject("test");

            let p = subject.getMetadata();

            p.then(null, err => {
                err.message.should.contain("metadata");
                done();
            });
        });

    });

    describe("getAuthorizationUrl", function() {

        it("should return a promise", function() {
            subject.getAuthorizationUrl().should.be.instanceof(Promise);
        });

        it("should use metadata on settings", function(done) {
            settings.metadata = {
                authorization_endpoint: "http://sts/authorize"
            };

            let p = subject.getAuthorizationUrl();

            p.then(result => {
                result.should.equal("http://sts/authorize");
                done();
            });
        });

        it("should fail if no authorization_endpoint on metadata", function(done) {
            settings.metadata = {
            };

            let p = subject.getAuthorizationUrl();

            p.then(null, err => {
                err.message.should.contain("authorization_endpoint");
                done();
            });
        });
        
         it("should fail if json call to load metadata fails", function(done) {
            settings.metadata = {
                metadataUrl:"http://sts/metadata"
            };
            stubJsonService.result = Promise.reject("test");

            let p = subject.getAuthorizationUrl();

            p.then(null, err => {
                err.message.should.contain("authorization");
                done();
            });
        });
        
    });

    describe("getUserInfoUrl", function() {

        it("should return a promise", function() {
            subject.getUserInfoUrl().should.be.instanceof(Promise);
        });

        it("should use metadata on settings", function(done) {
            settings.metadata = {
                userinfo_endpoint: "http://sts/userinfo"
            };

            let p = subject.getUserInfoUrl();

            p.then(result => {
                result.should.equal("http://sts/userinfo");
                done();
            });
        });

        it("should fail if no userinfo_endpoint on metadata", function(done) {
            settings.metadata = {
            };

            let p = subject.getUserInfoUrl();

            p.then(null, err => {
                err.message.should.contain("userinfo_endpoint");
                done();
            });
        });
        
         it("should fail if json call to load metadata fails", function(done) {
            settings.metadata = {
                metadataUrl:"http://sts/metadata"
            };
            stubJsonService.result = Promise.reject("test");

            let p = subject.getUserInfoUrl();

            p.then(null, err => {
                err.message.should.contain("userinfo");
                done();
            });
        });
        
    });
    
    describe("getSigningKeys", function() {

        it("should return a promise", function() {
            subject.getSigningKeys().should.be.instanceof(Promise);
        });

        it("should use signingKeys on settings", function(done) {
            settings.signingKeys = "test";

            let p = subject.getSigningKeys();

            p.then(result => {
                result.should.equal("test");
                done();
            });
        });

        it("should fail if metadata does not have jwks_uri", function(done) {
            settings.metadata = "test";

            let p = subject.getSigningKeys();

            p.then(null, err => {
                err.message.should.contain('jwks_uri');
                done();
            });
        });

        it("should fail if keys missing on keyset from jwks_uri", function(done) {
            settings.metadata = {
                jwks_uri: "http://sts/metadata/keys"
            };
            stubJsonService.result = Promise.resolve({});

            let p = subject.getSigningKeys();

            p.then(null, err => {
                err.message.should.contain("keyset");
                done();
            })
        });

        it("should make json call to jwks_uri", function(done) {
            settings.metadata = {
                jwks_uri: "http://sts/metadata/keys"
            };
            stubJsonService.result = Promise.resolve({keys:"test"});

            let p = subject.getSigningKeys();

            p.then(result => {
                stubJsonService.url.should.equal("http://sts/metadata/keys");
                done();
            });
        });

        it("should return keys from jwks_uri", function(done) {
            settings.metadata = {
                jwks_uri: "http://sts/metadata/keys"
            };
            stubJsonService.result = Promise.resolve({keys:"test"});

            let p = subject.getSigningKeys();

            p.then(keys => {
                keys.should.equal("test");
                done();
            });
        });

        it("should cache keys in settings", function(done) {
            settings.metadata = {
                jwks_uri: "http://sts/metadata/keys"
            };
            stubJsonService.result = Promise.resolve({keys:"test"});

            let p = subject.getSigningKeys();

            p.then(keys => {
                settings.signingKeys.should.equal("test");
                done();
            })
        });

    });
});
