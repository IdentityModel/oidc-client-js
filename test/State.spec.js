import Log from '../src/Log';
import State from '../src/State';

import chai from 'chai';
chai.should();
let assert = chai.assert;


describe("State", function() {

    let stubCrypto;

    beforeEach(function() {
        stubCrypto = new StubCrypto();
        stubCrypto.hashResult = "hash";
    });

    it("can be verified", function() {
        var subject = new State("test", stubCrypto);
        var uriParam = subject.toUriString();
        var clientStorage = subject.toClientStorageString();
        
        State.verify(clientStorage, uriParam, stubCrypto).should.be.ok;
    });
    
    it("should fail if state string is changed", function() {
        
        var subject = new State("test", stubCrypto);
        var uriParam = subject.toUriString();
        var clientStorage = subject.toClientStorageString();
        
        stubCrypto.hashResult = "not hash";
        
        State.verify(clientStorage, uriParam, stubCrypto).should.not.be.ok;
    });
    
    it("can store and verify objects", function() {
        
        var subject = new State({foo:"test"}, stubCrypto);
        var uriParam = subject.toUriString();
        var clientStorage = subject.toClientStorageString();
        
        State.verify(clientStorage, uriParam, stubCrypto).should.deep.equal({foo:'test'});
    });
});

class StubCrypto {
    hash() {
        return this.hashResult;
    }
}