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
            var result = subject.parseResult("a=apple&b=banana&c=carrot");
            result.should.deep.equal({a:"apple", b:"banana", c:"carrot"});
        });
        
        it("should parse any order", function() {
            var result = subject.parseResult("b=banana&c=carrot&a=apple");
            result.should.deep.equal({a:"apple", b:"banana", c:"carrot"});
        });
        
        it("should parse past host name and hash fragment", function() {
            var result = subject.parseResult("http://server?test1=xoxo&test2=xoxo/#a=apple&b=banana&c=carrot");
            result.should.deep.equal({a:"apple", b:"banana", c:"carrot"});
        });
        
        it("should return error for long values", function() {
            var result = subject.parseResult("a=apple&a=apple&a=apple&a=apple&a=apple&a=apple&a=apple&a=apple&a=apple&a=apple&a=apple&a=apple&a=apple&a=apple&a=apple&a=apple&a=apple&a=apple&a=apple&a=apple&a=apple&a=apple&a=apple&a=apple&a=apple&a=apple&a=apple&a=apple&a=apple&a=apple&a=apple&a=apple&a=apple&a=apple&a=apple&a=apple&a=apple&a=apple&a=apple&a=apple&a=apple&a=apple&a=apple&a=apple&a=apple&a=apple&a=apple&a=apple&a=apple&a=apple&a=apple&a=apple&a=apple&a=apple&a=apple&a=apple&a=apple&a=apple&a=apple&a=apple&a=apple&a=apple&a=apple&a=apple&a=apple&a=apple&a=apple&a=apple&a=apple&a=apple&a=apple&a=apple&a=apple&a=apple&a=apple&a=apple&a=apple&a=apple&a=apple&a=apple&a=apple&a=apple&a=apple&a=apple&a=apple&a=apple&a=apple&a=apple&a=apple&a=apple&a=apple&a=apple&a=apple&a=apple&a=apple&a=apple&a=apple&a=apple&a=apple&a=apple&a=apple&a=apple&a=apple&a=apple&a=apple&a=apple&a=apple&a=apple&a=apple&a=apple&a=apple&a=apple&a=apple&a=apple&a=apple&a=apple&a=apple&a=apple&a=apple&a=apple");
            result.should.have.property('error');
        });
        
    });
});
