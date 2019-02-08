// Copyright (c) Brock Allen & Dominick Baier. All rights reserved.
// Licensed under the Apache License, Version 2.0. See LICENSE in the project root for license information.

import { Log } from '../../src/Log';
import { SignoutResponse } from '../../src/SignoutResponse';
import { ErrorResponse } from '../../src/ErrorResponse';

import chai from 'chai';
chai.should();
let assert = chai.assert;
let expect = chai.expect;

describe("SignoutResponse", function() {

    describe("constructor", function() {

        it("should read error", function () {
            let subject = new SignoutResponse("error=foo");
            subject.error.should.equal("foo");
        });

        it("should read error_description", function () {
            let subject = new SignoutResponse("error_description=foo");
            subject.error_description.should.equal("foo");
        });

        it("should read error_uri", function () {
            let subject = new SignoutResponse("error_uri=foo");
            subject.error_uri.should.equal("foo");
        });

        it("should read state", function() {
            let subject = new SignoutResponse("state=foo");
            subject.state.should.equal("foo");
        });

    });

});
