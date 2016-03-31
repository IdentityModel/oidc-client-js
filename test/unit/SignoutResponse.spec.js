import Log from '../../src/Log';
import SignoutResponse from '../../src/SignoutResponse';
import ErrorResponse from '../../src/ErrorResponse';

import chai from 'chai';
chai.should();
let assert = chai.assert;
let expect = chai.expect;

describe("SignoutResponse", function() {

    describe("constructor", function() {
        it("should read state", function() {
            let subject = new SignoutResponse("state=foo");
            subject.state.should.equal("foo");
        });
        
        it("should return SignoutResponse if no error", function() {
            let subject = new SignoutResponse("");
            subject.should.be.instanceof(SignoutResponse);
        });
        
        it("should return ErrorResponse if error", function() {
            let subject = new SignoutResponse("error=foo");
            subject.should.be.instanceof(ErrorResponse);
        });
        
    });

});
