// Copyright (c) Brock Allen & Dominick Baier. All rights reserved.
// Licensed under the Apache License, Version 2.0. See LICENSE in the project root for license information.

import { Log } from '../../src/Log';
import { SigninState } from '../../src/SigninState';

import chai from 'chai';
chai.should();
let assert = chai.assert;

describe("SigninState", function() {

    beforeEach(function(){
        Log.level = Log.NONE;
        Log.logger = console;
    });

    describe("constructor", function() {

        it("should call base ctor", function() {
            var subject = new SigninState({ id: 5, created:6, data:7 });
            subject.id.should.be.equal(5);
            subject.created.should.be.equal(6);
            subject.data.should.be.equal(7);
        });

        it("should accept nonce", function() {
            var subject = new SigninState({ nonce: 5 });
            subject.nonce.should.be.equal(5);
        });

        it("should generate nonce", function() {
            var subject = new SigninState({ nonce: true });
            subject.nonce.should.be.ok;
        });

        it("should accept client_id", function() {
            var subject = new SigninState({ client_id: "client" });
            subject.client_id.should.be.equal("client");
        });

        it("should accept authority", function() {
            var subject = new SigninState({ authority: "test" });
            subject.authority.should.be.equal("test");
        });
    });

    it("can serialize and then deserialize", function() {
        var subject1 = new SigninState({ nonce: true, data: { foo: "test" }, created: 1000, client_id:"client", authority:"authority" });

        var storage = subject1.toStorageString();
        var subject2 = SigninState.fromStorageString(storage);

        subject2.should.be.deep.equal(subject1);
    });

});
