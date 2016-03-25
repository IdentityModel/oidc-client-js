import Log from '../src/Log';
import SigninRequest from '../src/SigninRequest';

import StubState from './StubState';

import chai from 'chai';
chai.should();
let assert = chai.assert;

describe("SigninRequest", function() {
    
    let stubState = new StubState("state");
    let StubStateCtor = () => stubState; 
    
    let subject;
    
    beforeEach(function(){
        subject = new SigninRequest("http://sts/signin", "client", "http://app", "id_token", "openid", undefined, StubStateCtor);
    });

    describe("constructor", function() {

        it("should require a url param", function() {
            try {
                new SigninRequest(undefined, "client", "http://app", "id_token", "openid");
            }
            catch (e) {
                e.message.should.contain('url');
                return;
            }
            assert.fail();
        });
        it("should require a client_id param", function() {
            try {
                new SigninRequest("http://sts/signin", undefined, "http://app", "id_token", "openid");
            }
            catch (e) {
                e.message.should.contain('client_id');
                return;
            }
            assert.fail();
        });
        it("should require a redirect_uri param", function() {
            try {
                new SigninRequest("http://sts/signin", "client", undefined, "id_token", "openid");
            }
            catch (e) {
                e.message.should.contain('redirect_uri');
                return;
            }
            assert.fail();
        });
        it("should require a response_type param", function() {
            try {
                new SigninRequest("http://sts/signin", "client", "http://app", undefined, "openid");
            }
            catch (e) {
                e.message.should.contain('response_type');
                return;
            }
            assert.fail();
        });
        it("should require a scope param", function() {
            try {
                new SigninRequest("http://sts/signin", "client", "http://app", "id_token", undefined);
            }
            catch (e) {
                e.message.should.contain('scope');
                return;
            }
            assert.fail();
        });

    });
    
    describe("signinUrl", function() {

        it("should include url", function() {
            subject.signinUrl.indexOf("http://sts/signin").should.equal(0);
        });
        it("should include client_id", function() {
            subject.signinUrl.should.contain("client_id=client");
        });
        it("should include redirect_uri", function() {
            subject.signinUrl.should.contain("redirect_uri=" + encodeURIComponent("http://app"));
        });
        it("should include response_type", function() {
            subject.signinUrl.should.contain("response_type=id_token");
        });
        it("should include scope", function() {
            subject.signinUrl.should.contain("scope=openid");
        });
        it("should include state", function() {
            subject.signinUrl.should.contain("state=state");
        });
        
    });

});