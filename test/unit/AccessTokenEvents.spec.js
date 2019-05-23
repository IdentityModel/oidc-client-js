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
    let refreshTokenExpiringTimer;
    let refreshTokenExpiredTimer;

    beforeEach(function () {
        accessTokenExpiringTimer = new StubTimer();
        accessTokenExpiredTimer = new StubTimer();
        refreshTokenExpiringTimer = new StubTimer();
        refreshTokenExpiredTimer = new StubTimer();
        subject = new AccessTokenEvents({
            accessTokenExpiringTimer, accessTokenExpiredTimer,
            refreshTokenExpiringTimer, refreshTokenExpiredTimer
        });
    });

    describe("constructor", function () {

        it("should use default expiringNotificationTime", function () {
            subject._accessTokenExpiringNotificationTime.should.equal(60);
            subject._refreshTokenExpiringNotificationTime.should.equal(60);
        });

    });

    describe("load", function () {

        it("should cancel existing access and refresh timers", function () {
            subject.load({});

            accessTokenExpiringTimer.cancelWasCalled.should.be.true;
            accessTokenExpiredTimer.cancelWasCalled.should.be.true;

            refreshTokenExpiringTimer.cancelWasCalled.should.be.true;
            refreshTokenExpiredTimer.cancelWasCalled.should.be.true;
        });

        it("should initialize access and refresh timers", function () {
            subject.load({
                access_token:"token",
                expires_in : 70,
                refresh_token: "token",
                refresh_expires_in: 140
            });

            accessTokenExpiringTimer.duration.should.equal(10);
            accessTokenExpiredTimer.duration.should.equal(71);
            refreshTokenExpiringTimer.duration.should.equal(80);
            refreshTokenExpiredTimer.duration.should.equal(141);
        });

        it("should immediately schedule expiring access and refresh timer if expiration is soon", function () {
            subject.load({
                access_token:"token",
                expires_in : 10,
                refresh_token: "token",
                refresh_expires_in: 10
            });

            accessTokenExpiringTimer.duration.should.equal(1);
            refreshTokenExpiringTimer.duration.should.equal(1);
        });

        it("should not initialize expiring access and refresh timer if already expired", function () {
            subject.load({
                access_token:"token",
                expires_in : 0,
                refresh_token: "token",
                refresh_expires_in: 0
            });

            assert.isUndefined(accessTokenExpiringTimer.duration);
            assert.isUndefined(refreshTokenExpiringTimer.duration);
        });

        it("should initialize expired access and refresh timer if already expired", function () {
            subject.load({
                access_token:"token",
                expires_in : 0,
                refresh_token: "token",
                refresh_expires_in: 0
            });

            accessTokenExpiredTimer.duration.should.equal(1);
            refreshTokenExpiredTimer.duration.should.equal(1);
        });

        it("should not initialize access token timers if no access token", function () {
            subject.load({
                expires_in : 70
            });

            assert.isUndefined(accessTokenExpiringTimer.duration);
            assert.isUndefined(accessTokenExpiredTimer.duration);
        });

        it("should not initialize refresh token timers if no refresh token", function () {
            subject.load({
                refresh_expires_in: 70
            });

            assert.isUndefined(refreshTokenExpiringTimer.duration);
            assert.isUndefined(refreshTokenExpiredTimer.duration);
        });

        it("should not initialize access token timers if no expiration on access token", function () {
            subject.load({
                access_token:"token"
            });

            assert.isUndefined(accessTokenExpiringTimer.duration);
            assert.isUndefined(accessTokenExpiredTimer.duration);
        });

        it("should not initialize refresh token timers if no expiration on refresh token", function () {
            subject.load({
                refresh_token: "token"
            });

            assert.isUndefined(refreshTokenExpiringTimer.duration);
            assert.isUndefined(refreshTokenExpiredTimer.duration);
        })
    });

    describe("unload", function () {

        it("should cancel access and refresh token timers", function () {

            subject.unload();

            accessTokenExpiringTimer.cancelWasCalled.should.be.true;
            accessTokenExpiredTimer.cancelWasCalled.should.be.true;

            refreshTokenExpiringTimer.cancelWasCalled.should.be.true;
            refreshTokenExpiredTimer.cancelWasCalled.should.be.true;
        });

    });

});
