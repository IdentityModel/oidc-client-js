import AuthorizationResultParser from '../src/AuthorizationResultParser';

import chai from 'chai';
chai.should();
let assert = chai.assert;


describe("AuthorizationResultParser", function() {
    let subject;
    
    beforeEach(function(){
        subject = new AuthorizationResultParser(); 
    });
    
    describe("parseResult", function() {
        
        it("should parse key/value pairs", function() {
            let result = subject.parseResult("a=apple&b=banana&c=carrot");
            result.should.deep.equal({a:"apple", b:"banana", c:"carrot"});
        });
        
        it("should parse any order", function() {
            let result = subject.parseResult("b=banana&c=carrot&a=apple");
            result.should.deep.equal({a:"apple", b:"banana", c:"carrot"});
        });
        
        it("should parse past host name and hash fragment", function() {
            let result = subject.parseResult("http://server?test1=xoxo&test2=xoxo/#a=apple&b=banana&c=carrot");
            result.should.deep.equal({a:"apple", b:"banana", c:"carrot"});
        });
        
        it("should return error for long values", function() {
            let result = subject.parseResult("a=apple&a=apple&a=apple&a=apple&a=apple&a=apple&a=apple&a=apple&a=apple&a=apple&a=apple&a=apple&a=apple&a=apple&a=apple&a=apple&a=apple&a=apple&a=apple&a=apple&a=apple&a=apple&a=apple&a=apple&a=apple&a=apple&a=apple&a=apple&a=apple&a=apple&a=apple&a=apple&a=apple&a=apple&a=apple&a=apple&a=apple&a=apple&a=apple&a=apple&a=apple&a=apple&a=apple&a=apple&a=apple&a=apple&a=apple&a=apple&a=apple&a=apple&a=apple&a=apple&a=apple&a=apple&a=apple&a=apple&a=apple&a=apple&a=apple&a=apple&a=apple&a=apple&a=apple&a=apple&a=apple&a=apple&a=apple&a=apple&a=apple&a=apple&a=apple&a=apple&a=apple&a=apple&a=apple&a=apple&a=apple&a=apple&a=apple&a=apple&a=apple&a=apple&a=apple&a=apple&a=apple&a=apple&a=apple&a=apple&a=apple&a=apple&a=apple&a=apple&a=apple&a=apple&a=apple&a=apple&a=apple&a=apple&a=apple&a=apple&a=apple&a=apple&a=apple&a=apple&a=apple&a=apple&a=apple&a=apple&a=apple&a=apple&a=apple&a=apple&a=apple&a=apple&a=apple&a=apple&a=apple&a=apple&a=apple&a=apple");
            result.should.have.property('error');
        });
        
        it("should use window.location.hash when no value is passed", function() {
            let w = {
                location : {
                    hash: "a=apple&b=banana&c=carrot"
                }
            };
            subject = new AuthorizationResultParser(w);
            let result = subject.parseResult();
            result.should.deep.equal({a:"apple", b:"banana", c:"carrot"});
        });
        
    });
});
