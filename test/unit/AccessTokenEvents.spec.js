// Copyright (c) Brock Allen & Dominick Baier. All rights reserved.
// Licensed under the Apache License, Version 2.0. See LICENSE in the project root for license information.

import { AccessTokenEvents } from '../../src/AccessTokenEvents';

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
    let accessTokenExpiringTimer;
    let accessTokenExpiredTimer;

    beforeEach(function () {
        accessTokenExpiringTimer = new StubTimer();
        accessTokenExpiredTimer = new StubTimer();
        subject = new AccessTokenEvents({
            accessTokenExpiringTimer, accessTokenExpiredTimer
        });
    });

    describe("constructor", function () {

        it("should use default expiringNotificationTime", function () {
            subject._accessTokenExpiringNotificationTime.should.equal(60);
        });

    });

    describe("load", function () {

        it("should cancel existing timers", function () {
            subject.load({});

            accessTokenExpiringTimer.cancelWasCalled.should.be.true;
            accessTokenExpiredTimer.cancelWasCalled.should.be.true;
        });

        it("should initialize timers", function () {
            subject.load({
                access_token:"token",
                expires_in : 70
            });

            accessTokenExpiringTimer.duration.should.equal(10);
            accessTokenExpiredTimer.duration.should.equal(71);
        });

        it("should immediately schedule expiring timer if expiration is soon", function () {
            subject.load({
                access_token:"token",
                expires_in : 10
            });

            accessTokenExpiringTimer.duration.should.equal(1);
        });

        it("should not initialize expiring timer if already expired", function () {
            subject.load({
                access_token:"token",
                expires_in : 0
            });

            assert.isUndefined(accessTokenExpiringTimer.duration);
        });

        it("should initialize expired timer if already expired", function () {
            subject.load({
                access_token:"token",
                expires_in : 0
            });

            accessTokenExpiredTimer.duration.should.equal(1);
        });

        it("should not initialize timers if no access token", function () {
            subject.load({
                expires_in : 70
            });

            assert.isUndefined(accessTokenExpiringTimer.duration);
            assert.isUndefined(accessTokenExpiredTimer.duration);
        });

        it("should not initialize timers if no expiration on access token", function () {
            subject.load({
                access_token:"token"
            });

            assert.isUndefined(accessTokenExpiringTimer.duration);
            assert.isUndefined(accessTokenExpiredTimer.duration);
        });
    });

    describe("unload", function () {

        it("should cancel timers", function () {

            subject.unload();

            accessTokenExpiringTimer.cancelWasCalled.should.be.true;
            accessTokenExpiredTimer.cancelWasCalled.should.be.true;
        });

    });

});
