import OidcClientService from '../src/OidcClientService';
import SignoutRequest from '../src/SignoutRequest';
import Log from '../src/Log';

import StubMetadataService from './StubMetadataService';

import chai from 'chai';
chai.should();
let assert = chai.assert;

describe("OidcClientService", function() {
    let settings;
    let subject;
    let stubMetadataService;
    
    beforeEach(function(){
        Log.setLogger(console);
        Log.level = Log.NONE;
        
        settings = {};
        stubMetadataService = new StubMetadataService();
        subject = new OidcClientService(settings, ()=>stubMetadataService); 
    });

    describe("constructor", function() {
        it("should require a settings param", function(){
            try {
               new OidcClientService(); 
            }
            catch(e){
                return;
            }
            assert.fail();
        });
        
    });

    describe("createSignoutRequest", function() {
        
        it("should return a promise", function(){
            stubMetadataService.getEndSessionEndpointResult = Promise.resolve("http://sts/signout");
            subject.createSignoutRequest().should.be.instanceof(Promise);
        });
        
        it("should return SignoutRequest", function(done) {
            stubMetadataService.getEndSessionEndpointResult = Promise.resolve("http://sts/signout");
            
            var p = subject.createSignoutRequest();
            
            p.then(request => {
                request.should.be.instanceof(SignoutRequest);
                done();
            });
        });
        
         it("should pass params to SignoutRequest", function(done) {
            stubMetadataService.getEndSessionEndpointResult = Promise.resolve("http://sts/signout");
            
            var p = subject.createSignoutRequest({
                state:'foo',
                post_logout_redirect_uri:"bar",
                id_token_hint:"baz"
            });
            
            p.then(request => {
                var url = request.signoutUrl;
                url.should.contain("http://sts/signout");
                url.should.contain("foo");
                url.should.contain("bar");
                url.should.contain("baz");
                done();
            });
        });
        
        it("should fail if metadata fails", function(done){
            stubMetadataService.getEndSessionEndpointResult = Promise.reject("test");
            
            var p = subject.createSignoutRequest();
            
            p.then(null, err => {
                err.message.should.contain("signout");
                done();
            });
        });
        
    });
});
