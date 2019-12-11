// Copyright (c) Brock Allen & Dominick Baier. All rights reserved.
// Licensed under the Apache License, Version 2.0. See LICENSE in the project root for license information.

import { Log } from '../../src/Log';
import { State } from '../../src/State';

import { InMemoryWebStorage } from '../../src/InMemoryWebStorage';
import { WebStorageStateStore } from '../../src/WebStorageStateStore';

import chai from 'chai';
chai.should();
let assert = chai.assert;

describe("State", function() {

    beforeEach(function(){
        Log.level = Log.NONE;
        Log.logger = console;
    });

    describe("constructor", function() {

        it("should generate id", function() {
            var subject = new State();
            subject.id.should.be.ok;
        });

        it("should accept id", function() {
            var subject = new State({ id: 5 });
            subject.id.should.be.equal(5);
        });

        it("should accept data", function() {
            var subject = new State({ data: "test" });
            subject.data.should.be.equal("test");
        });

        it("should accept data as objects", function() {
            var subject = new State({ data: { foo: "test" } });
            subject.data.should.be.deep.equal({ foo: "test" });
        });

        it("should accept created", function() {
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
        it("should accept request_type", function() {
            var subject = new State({ request_type: 'xoxo' });
            subject.request_type.should.be.equal('xoxo');
        });
    });

    it("can serialize and then deserialize", function() {
        var subject1 = new State({ data: { foo: "test" }, created: 1000, request_type:'type' });

        var storage = subject1.toStorageString();
        var subject2 = State.fromStorageString(storage);

        subject2.should.be.deep.equal(subject1);
    });

    describe("clearStaleState", function() {

        it("should remove old state entries", function(done) {

            let oldNow = Date.now;
            Date.now = function() {
                return 200 * 1000; // ms
            };

            let prefix = "prefix.";
            let inMemStore = new InMemoryWebStorage();
            let store = new WebStorageStateStore({ prefix: prefix, store: inMemStore });

            let s1 = new State({ id: "s1", created: 50 });
            let s2 = new State({ id: "s2", created: 99 });
            let s3 = new State({ id: "s3", created: 100 });
            let s4 = new State({ id: "s4", created: 101 });
            let s5 = new State({ id: "s5", created: 150 });

            inMemStore.setItem("junk0", "junk");
            inMemStore.setItem(prefix + s1.id, s1.toStorageString());
            inMemStore.setItem("junk1", "junk");
            inMemStore.setItem(prefix + s2.id, s2.toStorageString());
            inMemStore.setItem("junk2", "junk");
            inMemStore.setItem(prefix + s3.id, s3.toStorageString());
            inMemStore.setItem("junk3", "junk");
            inMemStore.setItem(prefix + s4.id, s4.toStorageString());
            inMemStore.setItem("junk4", "junk");
            inMemStore.setItem(prefix + s5.id, s5.toStorageString());
            inMemStore.setItem("junk5", "junk");

            State.clearStaleState(store, 100).then(() => {
                Log.debug("clearStaleState done");

                inMemStore.length.should.equal(8);
                inMemStore.getItem(prefix + "s4").should.be.ok;
                inMemStore.getItem(prefix + "s5").should.be.ok;

                Date.now = oldNow;
                done();
            });

        });

    });


});
