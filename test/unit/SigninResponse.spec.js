import Log from '../../src/Log';
import SigninResponse from '../../src/SigninResponse';
import ErrorResponse from '../../src/ErrorResponse';

import chai from 'chai';
chai.should();
let assert = chai.assert;
let expect = chai.expect;

describe("SigninResponse", function() {

    describe("constructor", function() {
        it("should read state", function() {
            let subject = new SigninResponse("state=foo");
            subject.state.should.equal("foo");
        });
        
        it("should return SigninResponse if no error", function() {
            let subject = new SigninResponse("");
            subject.should.be.instanceof(SigninResponse);
        });
        
        it("should return ErrorResponse if error", function() {
            let subject = new SigninResponse("error=foo");
            subject.should.be.instanceof(ErrorResponse);
        });
        
        it("should read id_token", function() {
            let subject = new SigninResponse("id_token=foo");
            subject.id_token.should.equal("foo");
        });
        
        it("should read session_state", function() {
            let subject = new SigninResponse("session_state=foo");
            subject.session_state.should.equal("foo");
        });
        
        it("should read access_token", function() {
            let subject = new SigninResponse("access_token=foo");
            subject.access_token.should.equal("foo");
        });
        
        it("should read token_type", function() {
            let subject = new SigninResponse("token_type=foo");
            subject.token_type.should.equal("foo");
        });
        
        it("should read scope", function() {
            let subject = new SigninResponse("scope=foo");
            subject.scope.should.equal("foo");
        });
        
        it("should read expires_in", function() {
            let subject = new SigninResponse("expires_in=10");
            subject.expires_in.should.equal(10);
        });
        
        it("should calculate expires_at", function() {
            let subject = new SigninResponse("expires_in=10");
            subject.expires_at.should.equal(parseInt((Date.now()/1000) + 10));
        });
        
        it("should not read invalid expires_in", function() {
            let subject = new SigninResponse("expires_in=foo");
            expect(subject.expires_in).to.be.undefined;
            expect(subject.expires_at).to.be.undefined;
            
            subject = new SigninResponse("expires_in=-10");
            expect(subject.expires_in).to.be.undefined;
            expect(subject.expires_at).to.be.undefined;
        });

    });

});
