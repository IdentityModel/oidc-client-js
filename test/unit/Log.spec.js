// Copyright (c) Brock Allen & Dominick Baier. All rights reserved.
// Licensed under the Apache License, Version 2.0. See LICENSE in the project root for license information.

import { Log } from '../../src/Log';

import chai from 'chai';
chai.should();
let assert = chai.assert;

describe("Log", function() {

    beforeEach(function() {
        Log.reset();
        Log.level = Log.INFO;
    });

    describe("level", function() {

        it("should not log when set to NONE", function() {
            let stub = new StubLog();
            Log.logger = stub;
            Log.level = Log.NONE;

            Log.info("test info");
            Log.warn("test warn");
            Log.error("test error");

            stub.infoWasCalled.should.be.false;
            stub.warnWasCalled.should.be.false;
            stub.errorWasCalled.should.be.false;
        });

        it("should not log info or warn for ERROR level", function() {
            let stub = new StubLog();

            Log.logger = stub;
            Log.level = Log.ERROR;

            Log.info("test info");
            Log.warn("test warn");
            Log.error("test error");

            stub.infoWasCalled.should.be.false;
            stub.warnWasCalled.should.be.false;
            stub.errorWasCalled.should.be.true;
        });

        it("should not log info for WARN level", function() {
            let stub = new StubLog();

            Log.logger =stub;
            Log.level = Log.WARN;

            Log.info("test info");
            Log.warn("test warn");
            Log.error("test error");

            stub.infoWasCalled.should.be.false;
            stub.warnWasCalled.should.be.true;
            stub.errorWasCalled.should.be.true;
        });

        it("should log to all for INFO level", function() {
            let stub = new StubLog();

            Log.logger = stub;
            Log.level = Log.INFO;

            Log.info("test info");
            Log.warn("test warn");
            Log.error("test error");

            stub.infoWasCalled.should.be.true;
            stub.warnWasCalled.should.be.true;
            stub.errorWasCalled.should.be.true;
        });

    });

    describe("logger", function() {

        it("should use the logger specified", function() {
            let stub = new StubLog();
            Log.logger = stub;

            Log.info("test info");
            Log.warn("test warn");
            Log.error("test error");

            stub.infoParam.should.equal("test info");
            stub.warnParam.should.equal("test warn");
            stub.errorParam.should.equal("test error");
        });

    });

    describe("info", function() {

        it("should work with no config", function() {
            Log.info("test");
        });

    });

    describe("warn", function() {

        it("should work with no config", function() {
            Log.warn("test");
        });

    });

    describe("error", function() {

        it("should work with no config", function() {
            Log.error("test");
        });

    });
});

class StubLog {
    constructor(){
        this.infoWasCalled = false;
        this.warnWasCalled = false;
        this.errorWasCalled = false;
    }
    info(arg) {
        this.infoParam = arg;
        this.infoWasCalled = true;
    }
    warn(arg) {
        this.warnParam = arg;
        this.warnWasCalled = true;
    }
    error(arg) {
        this.errorParam = arg;
        this.errorWasCalled = true;
    }
}
