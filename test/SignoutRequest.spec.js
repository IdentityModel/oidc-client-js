import Log from '../src/Log';
import SignoutRequest from '../src/SignoutRequest';

import StubState from './StubState';

import chai from 'chai';
chai.should();
let assert = chai.assert;

describe("SignoutRequest", function() {
    
    let stubState = new StubState("state");
    let StubStateCtor = () => stubState; 
    

    describe("constructor", function() {

        it("should require a url param", function() {
            try {
                new SignoutRequest();
            }
            catch (e) {
                return;
            }
            assert.fail();
        });

    });
    
    describe("signoutUrl", function() {

        it("should include url", function() {
            let subject = new SignoutRequest("http://sts/signout");
            subject.signoutUrl.indexOf("http://sts/signout").should.equal(0);
        });
        
        it("should include state", function() {
            let subject = new SignoutRequest("http://sts/signout", {state:"test"}, StubStateCtor);
            subject.signoutUrl.should.contain("state=state");
        });
        
        it("should include id_token_hint", function() {
            let subject = new SignoutRequest("http://sts/signout", {id_token_hint:"test"});
            subject.signoutUrl.should.contain("id_token_hint=test");
        });
        
        it("should include post_logout_redirect_uri", function() {
            let subject = new SignoutRequest("http://sts/signout", {post_logout_redirect_uri:"test"});
            subject.signoutUrl.should.contain("post_logout_redirect_uri=test");
        });
        
        it("should include id_token_hint, post_logout_redirect_uri, and state", function() {
            let subject = new SignoutRequest("http://sts/signout", {
                id_token_hint : 'token',
                post_logout_redirect_uri:"uri",
                state:"xoxo"
            }, StubStateCtor);
            
            var url = subject.signoutUrl;
            url.indexOf('http://sts/signout?').should.equal(0);
            url.should.contain("id_token_hint=token");
            url.should.contain("post_logout_redirect_uri=uri");
            url.should.contain("state=state");
        });

    });

});