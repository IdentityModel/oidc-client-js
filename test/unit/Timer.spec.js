// Copyright (c) Brock Allen & Dominick Baier. All rights reserved.
// Licensed under the Apache License, Version 2.0. See LICENSE in the project root for license information.

import Timer from '../../src/Timer';

import chai from 'chai';
chai.should();
let assert = chai.assert;

class StubWindowTimer {

    constructor() {
        this.clearTimeoutWasCalled = false;
    }

    setTimeout(cb, duration) {
        this.callback = cb;
        this.duration = duration;
        return 5;
    }

    clearTimeout() {
        this.clearTimeoutWasCalled = true;
    }
}

describe("Timer", function () {

    let subject;
    let stubWindowTimer;

    beforeEach(function () {
        stubWindowTimer = new StubWindowTimer();
        subject = new Timer(stubWindowTimer);
    });

    describe("init", function () {

        it("should setup a timer", function () {
            subject.init(10);
            stubWindowTimer.callback.should.be.ok;
            stubWindowTimer.duration.should.equal(10000);
        });

        it("should use 1 second if duration is too low", function () {
            subject.init(0);
            stubWindowTimer.duration.should.equal(1000);
            subject.init(-1);
            stubWindowTimer.duration.should.equal(1000);
            subject.init(-5);
            stubWindowTimer.duration.should.equal(1000);
        });

        it("should cancel previous timer", function () {
            subject.init(10);
            stubWindowTimer.clearTimeoutWasCalled.should.be.false;

            subject.init(10);

            stubWindowTimer.clearTimeoutWasCalled.should.be.true;
        });
    });

    describe("cancel", function () {

        it("should cancel timer", function () {
            subject.init(10);
            stubWindowTimer.clearTimeoutWasCalled.should.be.false;

            subject.cancel();

            stubWindowTimer.clearTimeoutWasCalled.should.be.true;
        });

        it("should do nothing if no existing timer", function () {
            subject.cancel();

            stubWindowTimer.clearTimeoutWasCalled.should.be.false;
        });
    });

    describe("addHandler", function () {

        it("should allow callback to be invoked", function () {
            var cb = function () {
                cb.wasCalled = true;
            };
            subject.addHandler(cb);

            subject.init(10);
            stubWindowTimer.callback();

            cb.wasCalled.should.be.true;
        });
        
        it("should allow multiple callbacks", function () {
            var count = 0;
            var cb = function () {
                count++;
            };
            subject.addHandler(cb);
            subject.addHandler(cb);
            subject.addHandler(cb);
            subject.addHandler(cb);

            subject.init(10);
            stubWindowTimer.callback();

            count.should.equal(4);
        });

    });

    describe("removeHandler", function () {

        it("should remove callback from being invoked", function () {
            var cb = function () {
                cb.wasCalled = true;
            };
            cb.wasCalled = false;
            
            subject.addHandler(cb);
            subject.init(10);
            subject.removeHandler(cb);
            stubWindowTimer.callback();

            cb.wasCalled.should.be.false;
        });
        
        it("should remove individual callback", function () {
            var count = 0;
            var cb1 = function () {
                count++;
            };
            var cb2 = function () {
                cb2.wasCalled = true;
            };

            subject.addHandler(cb1);
            subject.addHandler(cb2);
            subject.addHandler(cb1);

            subject.init(10);
            subject.removeHandler(cb1);
            subject.removeHandler(cb1);

            stubWindowTimer.callback();

            count.should.equal(0);
            cb2.wasCalled.should.be.true;
        });

    });

});
