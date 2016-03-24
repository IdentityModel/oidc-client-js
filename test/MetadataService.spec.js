import MetadataService from '../src/MetadataService';

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
        subject = new MetadataService(settings, stubJsonService);
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

            var p = subject.getMetadata();

            p.then(result => {
                result.should.equal("test");
                done();
            });
        });

        it("should require metadataUrl", function(done) {
            delete settings.metadataUrl;

            var p = subject.getMetadata();

            p.then(null, err => {
                err.message.should.contain('metadataUrl');
                done();
            });
        });

        it("should require metadataUrl", function(done) {
            delete settings.metadataUrl;

            var p = subject.getMetadata();

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

            var p = subject.getMetadata();

            p.then(result => {
                result.should.equal("test");
                done();
            });
        });

        it("should cache metadata from json call", function(done) {
            settings.metadataUrl = "http://sts/metadata";
            stubJsonService.result = Promise.resolve("test");

            var p = subject.getMetadata();

            p.then(result => {
                settings.metadata.should.equal("test");
                done();
            });
        });
        
        it("should fail if json call fails", function(done) {
            settings.metadataUrl = "http://sts/metadata";
            stubJsonService.result = Promise.reject("test");

            var p = subject.getMetadata();

            p.then(null, err => {
                err.message.should.contain("metadata");
                done();
            });
        });

    });
});

class StubJsonService {
    getJson(url) {
        this.url = url;
        return this.result;
    }
}
