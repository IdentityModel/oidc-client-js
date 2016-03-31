import Log from '../../src/Log';
import WebStorageStateStore from '../../src/WebStorageStateStore';
import InMemoryWebStorage from '../../src/InMemoryWebStorage';

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

    describe("set", function() {

        it("should return a promise", function() {
            subject.set("key", "value").should.be.instanceof(Promise);
        });

        it("should store item", function(done) {
            subject.set("key", "value").then(()=>{
                store.getItem("key").should.equal("value");
                done();
            })
        });

    });

    describe("remove", function() {

        it("should return a promise", function() {
            subject.remove("key").should.be.instanceof(Promise);
        });

        it("should remove item", function(done) {
            store.setItem("key", "value");

            subject.remove("key").then(item => {
                expect(store.getItem("key")).to.be.undefined;
                done();
            });
        });

        it("should return value if exists", function(done) {
            store.setItem("key", "test");

            subject.remove("key").then(value => {
                value.should.equal('test');
                done();
            });
        });

        it("should return undefined if doesn't exist", function(done) {
            subject.remove("key").then(value => {
                expect(value).to.be.undefined;
                done();
            });
        });
    });

});
