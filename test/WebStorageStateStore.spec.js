import Log from '../src/Log';
import WebStorageStateStore from '../src/WebStorageStateStore';
import InMemoryWebStorage from '../src/InMemoryWebStorage';

import chai from 'chai';
chai.should();
let assert = chai.assert;
let expect = chai.expect;

describe("WebStorageStateStore", function() {
    let subject;
    let store;

    beforeEach(function() {
        store = new InMemoryWebStorage();
        subject = new WebStorageStateStore(store);
    });

    describe("get", function() {

        it("should return a promise", function() {
            subject.get("key").should.be.instanceof(Promise);
        });

        it("should return value if exists", function(done) {
            store.setItem("key", "test");
            
            subject.get("key").then(value => {
                value.should.equal('test');
                done();
            });
        });
        
        it("should return undefined if doesn't exist", function(done) {
            subject.get("key").then(value => {
                expect(value).to.be.undefined;
                done();
            });
        });
    });
    
    describe("set", function() {

        it("should return a promise", function() {
            subject.get("key").should.be.instanceof(Promise);
        });
        
        it("should store item", function() {
            subject.set("key", "value");
            
            store.getItem("key").should.equal("value");
        });

    });
    
    describe("remove", function() {

        it("should return a promise", function() {
            subject.get("key").should.be.instanceof(Promise);
        });
        
        it("should remove item", function() {
            store.setItem("key", "value");
            
            subject.remove("key");
            
            expect(store.getItem("key")).to.be.undefined;
        });

    });

});
