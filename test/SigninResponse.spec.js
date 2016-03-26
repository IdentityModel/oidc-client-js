import Log from '../src/Log';
import SigninResponse from '../src/SigninResponse';

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
        
        it("should read error", function() {
            let subject = new SigninResponse("error=foo");
            subject.error.should.equal("foo");
        });
        
        it("should read error_description", function() {
            let subject = new SigninResponse("error=error&error_description=foo");
            subject.error_description.should.equal("foo");
        });
        
        it("should read error_uri", function() {
            let subject = new SigninResponse("error=error&error_uri=foo");
            subject.error_uri.should.equal("foo");
        });
        
        it("should only read error info if error", function() {
            let subject = new SigninResponse("error_description=foo");
            expect(subject.error_description).to.be.undefined;
            
            subject = new SigninResponse("error_uri=foo");
            expect(subject.error_uri).to.be.undefined;
            
            subject = new SigninResponse("error=error&id_token=foo&session_state=foo&access_token=foo&token_type=foo&scope=foo&expires_in=10");
            expect(subject.id_token).to.be.undefined;
            expect(subject.session_state).to.be.undefined;
            expect(subject.access_token).to.be.undefined;
            expect(subject.token_type).to.be.undefined;
            expect(subject.scope).to.be.undefined;
            expect(subject.expires_in).to.be.undefined;
            expect(subject.expires_at).to.be.undefined;
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
