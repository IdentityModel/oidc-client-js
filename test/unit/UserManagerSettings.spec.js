// Copyright (c) Brock Allen & Dominick Baier. All rights reserved.
// Licensed under the Apache License, Version 2.0. See LICENSE in the project root for license information.

import Log from '../../src/Log';
import UserManagerSettings from '../../src/UserManagerSettings';

import chai from 'chai';
chai.should();
let assert = chai.assert;

describe("UserManagerSettings", function () {

    beforeEach(function () {
        Log.logger = console;
        Log.level = Log.NONE;
    });

    describe("constructor", function () {

        it("should allow no settings", function () {
            let subject = new UserManagerSettings();
        });

        it("should pass settings to base class", function () {
            let subject = new UserManagerSettings({ client_id: 'client' });
            subject.client_id.should.equal('client');
        });

    });

    describe("popup_redirect_uri", function () {

        it("should return value from initial settings", function () {
            let subject = new UserManagerSettings({ popup_redirect_uri: 'test' });
            subject.popup_redirect_uri.should.equal('test');
        });

    });

    describe("silent_redirect_uri", function () {

        it("should return value from initial settings", function () {
            let subject = new UserManagerSettings({ silent_redirect_uri: 'test' });
            subject.silent_redirect_uri.should.equal('test');
        });

    });

    describe("automaticSilentRenewEnabled", function () {

        it("should return value from initial settings", function () {
            let subject = new UserManagerSettings({
                silent_redirect_uri: 'test',
                enableAutomaticSilentRenew: false
            });
            subject.automaticSilentRenewEnabled.should.be.false;
        });

        it("should use default value", function () {
            let subject = new UserManagerSettings({
                silent_redirect_uri: 'test'
            });
            subject.automaticSilentRenewEnabled.should.be.true;
        });

        it("should be false if no silent redirect uri", function () {
            let subject = new UserManagerSettings({
                enableAutomaticSilentRenew: true
            });
            subject.automaticSilentRenewEnabled.should.be.false;
        });

    });

    describe("expiringNotificationTime", function () {

        it("should return value from initial settings", function () {
            let subject = new UserManagerSettings({
                expiringNotificationTime: 10
            });
            subject.expiringNotificationTime.should.equal(10);
        });

        it("should use default value", function () {
            let subject = new UserManagerSettings({
            });
            subject.expiringNotificationTime.should.equal(60);
        });

    });

});
