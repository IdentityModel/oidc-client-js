// Copyright (c) Brock Allen & Dominick Baier. All rights reserved.
// Licensed under the Apache License, Version 2.0. See LICENSE in the project root for license information.

import { Timer } from '../../src/Timer';

import chai from 'chai';
chai.should();
let assert = chai.assert;

class StubWindowTimer {

    constructor() {
        this.clearTimeoutWasCalled = false;
    }

    setInterval(cb, duration) {
        this.callback = cb;
        this.duration = duration;
        return 5;
    }

    clearInterval() {
        this.clearTimeoutWasCalled = true;
    }
}

describe("Timer", function () {

    let subject;
    let stubWindowTimer;
    let now = Date.now() / 1000;

    beforeEach(function () {
        stubWindowTimer = new StubWindowTimer();
        subject = new Timer("test name", stubWindowTimer, () => now);
    });

    describe("init", function () {

        it("should setup a timer", function () {
            subject.init(10);
            stubWindowTimer.callback.should.be.ok;
        });

        it("should use 1 second if duration is too low", function () {
            subject.init(0);
            stubWindowTimer.duration.should.equal(1000);
            subject.init(-1);
            stubWindowTimer.duration.should.equal(1000);
            subject.init(-5);
            stubWindowTimer.duration.should.equal(1000);
        });

        it("should use duration if less than default", function () {
            subject.init(2);
            stubWindowTimer.duration.should.equal(2000);
            subject.init(3);
            stubWindowTimer.duration.should.equal(3000);
        });

        it("should cancel previous timer if new time is not the same", function () {
            subject.init(10);
            stubWindowTimer.clearTimeoutWasCalled.should.be.false;

            now = now + 1;
            subject.init(10);

            stubWindowTimer.clearTimeoutWasCalled.should.be.true;
        });
        
        it("should not cancel previous timer if new time is same", function () {
            subject.init(10);
            stubWindowTimer.clearTimeoutWasCalled.should.be.false;

            subject.init(10);
            stubWindowTimer.clearTimeoutWasCalled.should.be.false;
        });
    });

    describe("_callback", function () {

        it("should fire when timer expires", function () {
            var cb = function () {
                cb.wasCalled = true;
            };
            cb.wasCalled = false;
            subject.addHandler(cb);

            subject._nowFunc = () => 100;
            subject.init(10);

            subject._nowFunc = () => 109;
            stubWindowTimer.callback();
            cb.wasCalled.should.be.false;

            subject._nowFunc = () => 110;
            stubWindowTimer.callback();
            cb.wasCalled.should.be.true;
        });


        it("should fire if timer late", function () {
            var cb = function () {
                cb.wasCalled = true;
            };
            cb.wasCalled = false;
            subject.addHandler(cb);

            subject._nowFunc = () => 100;
            subject.init(10);

            subject._nowFunc = () => 109;
            stubWindowTimer.callback();
            cb.wasCalled.should.be.false;

            subject._nowFunc = () => 111;
            stubWindowTimer.callback();
            cb.wasCalled.should.be.true;
        });

        it("should cancel window timer", function () {
            subject._nowFunc = () => 100;
            subject.init(10);

            subject._nowFunc = () => 110;
            stubWindowTimer.callback();

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

            subject._nowFunc = () => 100;
            subject.init(10);
            subject._nowFunc = () => 110;
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

            subject._nowFunc = () => 100;
            subject.init(10);
            subject._nowFunc = () => 110;
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

            subject._nowFunc = () => 100;
            subject.addHandler(cb);
            subject.init(10);
            subject.removeHandler(cb);

            subject._nowFunc = () => 110;
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

            subject._nowFunc = () => 100;
            subject.init(10);
            subject.removeHandler(cb1);
            subject.removeHandler(cb1);

            subject._nowFunc = () => 110;
            stubWindowTimer.callback();

            count.should.equal(0);
            cb2.wasCalled.should.be.true;
        });

    });

});
