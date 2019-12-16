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

        it("should accept redirect_uri", function() {
            var subject = new SigninState({ redirect_uri: "http://cb" });
            subject.redirect_uri.should.be.equal("http://cb");
        });

        it("should accept code_verifier", function() {
            var subject = new SigninState({ code_verifier: 5 });
            subject.code_verifier.should.be.equal(5);
        });

        it("should generate code_verifier", function() {
            var subject = new SigninState({ code_verifier: true });
            subject.code_verifier.should.be.ok;
        });

        it("should generate code_challenge", function() {
            var subject = new SigninState({ code_verifier: true });
            subject.code_challenge.should.be.ok;
        });

        it("should accept client_id", function() {
            var subject = new SigninState({ client_id: "client" });
            subject.client_id.should.be.equal("client");
        });

        it("should accept authority", function() {
            var subject = new SigninState({ authority: "test" });
            subject.authority.should.be.equal("test");
        });
        
        it("should accept request_type", function() {
            var subject = new SigninState({ request_type: 'xoxo' });
            subject.request_type.should.be.equal('xoxo');
        });

        it("should accept extraTokenParams", function() {
            var subject = new SigninState({ extraTokenParams: { 'resourceServer' : 'abc' } });
            assert.deepEqual(subject.extraTokenParams, { 'resourceServer' : 'abc' });
        });
    });

    it("can serialize and then deserialize", function() {
        var subject1 = new SigninState({ nonce: true, data: { foo: "test" }, created: 1000, client_id:"client", authority:"authority", redirect_uri:"http://cb", code_verifier:true, request_type:'type' });

        var storage = subject1.toStorageString();
        var subject2 = SigninState.fromStorageString(storage);

        subject2.should.be.deep.equal(subject1);
    });

});
