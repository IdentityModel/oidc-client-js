// Copyright (c) Brock Allen & Dominick Baier. All rights reserved.
// Licensed under the Apache License, Version 2.0. See LICENSE in the project root for license information.

import { Log } from '../../src/Log';
import { WebStorageStateStore } from '../../src/WebStorageStateStore';
import { InMemoryWebStorage } from '../../src/InMemoryWebStorage';

import chai from 'chai';
chai.should();
let assert = chai.assert;
let expect = chai.expect;

describe("WebStorageStateStore", function() {
    let prefix;
    let subject;
    let store;

    beforeEach(function() {
        prefix = "";
        store = new InMemoryWebStorage();
        subject = new WebStorageStateStore({ prefix: prefix, store: store });
    });

    describe("set", function() {

        it("should return a promise", function() {
            var p = subject.set("key", "value");
            p.should.be.instanceof(Promise);
            p.catch(e=>{});
        });

        it("should store item", function(done) {
            subject.set("key", "value").then(() => {
                store.getItem("key").should.equal("value");
                done();
            })
        });

        it("should use prefix if specified", function(done) {
            prefix = "foo.";
            subject = new WebStorageStateStore({ prefix: prefix, store: store });

            subject.set("key", "value").then(() => {
                store.getItem(prefix + "key").should.equal("value");
                done();
            })
        });

    });

    describe("remove", function() {

        it("should return a promise", function() {
            var p = subject.remove("key");
            p.should.be.instanceof(Promise);
            p.catch(e=>{});
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

        it("should use prefix if specified", function(done) {
            prefix = "foo.";
            subject = new WebStorageStateStore({ prefix: prefix, store: store });

            store.setItem("foo.key", "value");

            subject.remove("key").then(item => {
                expect(store.getItem("foo.key")).to.be.undefined;
                done();
            });
        });

    });

    describe("get", function() {

        it("should return a promise", function() {
            var p = subject.get("key");
            p.should.be.instanceof(Promise);
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

        it("should use prefix if specified", function(done) {
            prefix = "foo.";
            subject = new WebStorageStateStore({ prefix: prefix, store: store });

            store.setItem("foo.key", "value");

            subject.get("key").then(item => {
                item.should.equal("value");
                done();
            });
        });

    });

    describe("getAllKeys", function() {

        it("should return a promise", function() {
            var p = subject.getAllKeys();
            p.should.be.instanceof(Promise);
            p.catch(e=>{});
        });

        it("should return keys", function(done) {
            store.setItem("key1", "test");
            store.setItem("key2", "test");

            subject.getAllKeys().then(keys => {
                keys.should.deep.equal(["key1", "key2"]);
                done();
            });
        });

        it("should return keys without prefix", function(done) {
            prefix = "foo.";
            subject = new WebStorageStateStore({ prefix: prefix, store: store });

            store.setItem("foo.key1", "test");
            store.setItem("foo.key2", "test");

            subject.getAllKeys().then(keys => {
                keys.should.deep.equal(["key1", "key2"]);
                done();
            });
        });

        it("should return empty keys when empty", function(done) {
            subject.getAllKeys().then(keys => {
                keys.should.deep.equal([]);
                done();
            });
        });

    });

});
