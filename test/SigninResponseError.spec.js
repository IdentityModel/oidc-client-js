import Log from '../src/Log';
import SigninResponseError from '../src/SigninResponseError';

import chai from 'chai';
chai.should();
let assert = chai.assert;
let expect = chai.expect;

describe("SigninResponseError", function() {

    describe("constructor", function() {

        it("should require a error param", function() {
            try {
                new SigninResponseError({});
            }
            catch (e) {
                e.message.should.contain('error');
                return;
            }
            assert.fail();
        });

        it("should read error", function() {
            let subject = new SigninResponseError({error:"foo"});
            subject.error.should.equal("foo");
        });

        it("should read error_description", function() {
            let subject = new SigninResponseError({error:"error", error_description:"foo"});
            subject.error_description.should.equal("foo");
        });

        it("should read error_uri", function() {
            let subject = new SigninResponseError({error:"error", error_uri:"foo"});
            subject.error_uri.should.equal("foo");
        });

        it("should read state", function() {
            let subject = new SigninResponseError({error:"error", state:"foo"});
            subject.state.should.equal("foo");
        });
    });

    describe("message", function() {
        it("should be description if set", function() {
            let subject = new SigninResponseError({error:"error", error_description:"foo"});
            subject.message.should.equal("foo");
        });

        it("should be error if description not set", function() {
            let subject = new SigninResponseError({error:"error"});
            subject.message.should.equal("error");
        });

    });

    describe("name", function() {
        it("should be class name", function() {
            let subject = new SigninResponseError({error:"error"});
            subject.name.should.equal("SigninResponseError");
        });

    });
    
    describe("stack", function() {
        
        it("should be set", function() {
            let subject = new SigninResponseError({error:"error"});
            subject.stack.should.be.ok;
        });

    });
});