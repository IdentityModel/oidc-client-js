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
            subject.init({});
            
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
        
        it("should immediately schedule expiring timer if expiration is soon", function () {
            subject.init({
                access_token:"token",
                expires_in : 10
            });
            
            expiringTimer.duration.should.equal(1);
        });
        
        it("should not initialize expiring timer if already expired", function () {
            subject.init({
                access_token:"token",
                expires_in : 0
            });
            
            assert.isUndefined(expiringTimer.duration);
        });

        it("should initialize expired timer if already expired", function () {
            subject.init({
                access_token:"token",
                expires_in : 0
            });
            
            expiredTimer.duration.should.equal(1);
        });
        
        it("should not initialize timers if no access token", function () {
            subject.init({
                expires_in : 70
            });
            
            assert.isUndefined(expiringTimer.duration);
            assert.isUndefined(expiredTimer.duration);
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
