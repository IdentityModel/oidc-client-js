import Log from '../../src/Log';
import State from '../../src/State';

import chai from 'chai';
chai.should();
let assert = chai.assert;

describe("State", function() {

    it("can generate id", function() {
        var subject = new State();
        subject.id.should.be.ok;
    });

    it("can accept nonce", function() {
        var subject = new State({ id: 5 });
        subject.id.should.be.equal(5);
    });

    it("can generate nonce", function() {
        var subject = new State({ nonce: true });
        subject.nonce.should.be.ok;
    });

    it("can accept nonce", function() {
        var subject = new State({ nonce: 5 });
        subject.nonce.should.be.equal(5);
    });

    it("can accept data", function() {
        var subject = new State({ data: "test" });
        subject.data.should.be.equal("test");
    });

    it("can accept data as objects", function() {
        var subject = new State({ data: { foo: "test" } });
        subject.data.should.be.deep.equal({ foo: "test" });
    });

    it("can accept created", function() {
        var subject = new State({ created: 1000 });
        subject.created.should.be.equal(1000);
    });

    it("should use date.now for created", function() {
        var oldNow = Date.now; 
        Date.now = function() {
            return 123 * 1000; // ms
        };
        var subject = new State();
        subject.created.should.be.equal(123);
        Date.now = oldNow;
    });

    it("can serialize and then deserialize", function() {
        var subject1 = new State({ nonce: true, data: { foo: "test" }, created: 1000 });

        var storage = subject1.toStorageString();
        var subject2 = State.fromStorageString(storage);

        subject2.should.be.deep.equal(subject1);
    });


});
