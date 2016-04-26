// Copyright (c) Brock Allen & Dominick Baier. All rights reserved.
// Licensed under the Apache License, Version 2.0. See LICENSE in the project root for license information.

import AccessTokenEvents from '../../src/AccessTokenEvents';

import chai from 'chai';
chai.should();
let assert = chai.assert;

class StubTimer {

    constructor() {
        this.cancelWasCalled = false;
    }

    init(duration) {
        this.duration = duration;
    }

    cancel() {
        this.cancelWasCalled = true;
    }
    
    addHandler(){}
    removeHandler(){}
}

describe("AccessTokenEvents", function () {

    let subject;
    let expiringTimer;
    let expiredTimer;

    beforeEach(function () {
        expiringTimer = new StubTimer();
        expiredTimer = new StubTimer();
        subject = new AccessTokenEvents({
            expiredTimer, expiringTimer
        });
    });

    describe("constructor", function () {

        it("should use default expiringNotificationTime", function () {
            subject._expiringNotificationTime.should.equal(60);
        });

    });

    describe("init", function () {

        it("should cancel existing timers", function () {
            subject.init();
            
            expiringTimer.cancelWasCalled.should.be.true;
            expiredTimer.cancelWasCalled.should.be.true;
        });
        
        it("should initialize timers", function () {
            subject.init({
                access_token:"token",
                expires_in : 70
            });
            
            expiringTimer.duration.should.equal(10);
            expiredTimer.duration.should.equal(71);
        });

    });
    
    describe("cancel", function () {

        it("should cancel timers", function () {
            
            subject.cancel();
            
            expiringTimer.cancelWasCalled.should.be.true;
            expiredTimer.cancelWasCalled.should.be.true;
        });

    });

});
