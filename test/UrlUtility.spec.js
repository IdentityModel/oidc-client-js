import UrlUtility from '../src/UrlUtility';

import chai from 'chai';
chai.should();
let assert = chai.assert;

describe("UrlUtility", function() {

    describe("addQueryParam", function() {

        it("should add ? if not present", function() {
            UrlUtility.addQueryParam("url", "foo", "test").should.equal("url?foo=test");
        });
        
        it("should not add ? if already present", function() {
            UrlUtility.addQueryParam("url?", "foo", "test").should.equal("url?foo=test");
        });
        
        it("should add & if needed", function() {
            UrlUtility.addQueryParam("url?x=1", "foo", "test").should.equal("url?x=1&foo=test");
        });

        it("should urlencode key and value", function() {
            UrlUtility.addQueryParam("url", "#", "#").should.equal("url?%23=%23");
        });
    });
    
});