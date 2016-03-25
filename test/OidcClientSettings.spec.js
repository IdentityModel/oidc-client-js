import OidcClientSettings from '../src/OidcClientSettings';

import chai from 'chai';
chai.should();
let assert = chai.assert;

describe("OidcClientSettings", function() {
    
    describe("constructor", function() {
        it("should require a settings param", function(){
            try {
               new OidcClientSettings(); 
            }
            catch(e){
                return;
            }
            assert.fail();
        });
        
    });
    
    describe("authority", function() {
        it("should return value from initial settings", function(){
            let subject = new OidcClientSettings({
                authority:"http://sts"
            });
            subject.authority.should.equal("http://sts");
        });
        
    });
    
    describe("metadataUrl", function() {
        it("should return value from initial settings", function(){
            let subject = new OidcClientSettings({
                metadataUrl:"http://sts/metadata"
            });
            subject.metadataUrl.should.equal("http://sts/metadata");
        });
        
        it("should infer value from authority", function(){
            let subject = new OidcClientSettings({
                authority:"http://sts"
            });
            subject.metadataUrl.should.equal("http://sts/.well-known/openid-configuration");
            
            subject = new OidcClientSettings({
                authority:"http://sts/"
            });
            subject.metadataUrl.should.equal("http://sts/.well-known/openid-configuration");
        });
        
    });
    
    describe("metadata", function() {
        it("should return value from initial settings", function(){
            let subject = new OidcClientSettings({
                metadata:"test"
            });
            subject.metadata.should.equal("test");
        });
        
        it("should store value", function(){
            let subject = new OidcClientSettings({
            });
            subject.metadata = "test";
            subject.metadata.should.equal("test");
        });
        
    });
    
    describe("signingKeys", function() {
        it("should return value from initial settings", function(){
            let subject = new OidcClientSettings({
                signingKeys:"test"
            });
            subject.signingKeys.should.equal("test");
        });
        
        it("should store value", function(){
            let subject = new OidcClientSettings({
            });
            subject.signingKeys = "test";
            subject.signingKeys.should.equal("test");
        });
        
    });
    
    describe("filterProtocolClaims", function() {
        
        it("should use default value", function(){
            let subject = new OidcClientSettings({
            });
            subject.filterProtocolClaims.should.equal(true);
        });
        
        it("should return value from initial settings", function(){
            let subject = new OidcClientSettings({
                filterProtocolClaims:true
            });
            subject.filterProtocolClaims.should.equal(true);
            
            subject = new OidcClientSettings({
                filterProtocolClaims:false
            });
            subject.filterProtocolClaims.should.equal(false);
        });
    });
    
    describe("post_logout_redirect_uri", function() {
        it("should return value from initial settings", function(){
            let subject = new OidcClientSettings({
                post_logout_redirect_uri:"http://app/loggedout"
            });
            subject.post_logout_redirect_uri.should.equal("http://app/loggedout");
        });
    });
});
