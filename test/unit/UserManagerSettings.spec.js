// Copyright (c) Brock Allen & Dominick Baier. All rights reserved.
// Licensed under the Apache License, Version 2.0. See LICENSE in the project root for license information.

import { Log } from '../../src/Log';
import { UserManagerSettings } from '../../src/UserManagerSettings';

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

    describe("popupWindowFeatures", function () {

        it("should return value from initial settings", function () {
            let subject = new UserManagerSettings({ popupWindowFeatures: 'foo' });
            subject.popupWindowFeatures.should.equal('foo');
        });

    });

    describe("popupWindowTarget", function () {

        it("should return value from initial settings", function () {
            let subject = new UserManagerSettings({ popupWindowTarget: 'foo' });
            subject.popupWindowTarget.should.equal('foo');
        });

    });

    describe("silent_redirect_uri", function () {

        it("should return value from initial settings", function () {
            let subject = new UserManagerSettings({ silent_redirect_uri: 'test' });
            subject.silent_redirect_uri.should.equal('test');
        });

    });

    describe("silentRequestTimeout", function () {

        it("should return value from initial settings", function () {
            let subject = new UserManagerSettings({ silentRequestTimeout: 123 });
            subject.silentRequestTimeout.should.equal(123);
        });

    });

    describe("automaticSilentRenew", function () {

        it("should return value from initial settings", function () {
            let subject = new UserManagerSettings({
                automaticSilentRenew: true
            });
            subject.automaticSilentRenew.should.be.true;
        });

        it("should use default value", function () {
            let subject = new UserManagerSettings({
            });
            subject.automaticSilentRenew.should.be.false;
        });

    });

    describe("validateSubOnSilentRenew", function () {

        it("should return value from initial settings", function () {
            let subject = new UserManagerSettings({
                validateSubOnSilentRenew: true
            });
            subject.validateSubOnSilentRenew.should.be.true;
        });

        it("should use default value", function () {
            let subject = new UserManagerSettings({
            });
            subject.validateSubOnSilentRenew.should.be.false;
        });

    });

    describe("includeIdTokenInSilentRenew", function () {
        it("should return true value from initial settings", function () {
            let subject = new UserManagerSettings({
                includeIdTokenInSilentRenew: true,
            });
            subject.includeIdTokenInSilentRenew.should.be.true;
        });

        it("should return false value from initial settings", function () {
            let subject = new UserManagerSettings({
                includeIdTokenInSilentRenew: false,
            });
            subject.includeIdTokenInSilentRenew.should.be.false;
        });

        it("should use default value", function () {
            let subject = new UserManagerSettings({
            });
            subject.includeIdTokenInSilentRenew.should.be.true;
        });
    });

    describe("accessTokenExpiringNotificationTime", function () {

        it("should return value from initial settings", function () {
            let subject = new UserManagerSettings({
                accessTokenExpiringNotificationTime: 10
            });
            subject.accessTokenExpiringNotificationTime.should.equal(10);
        });

        it("should use default value", function () {
            let subject = new UserManagerSettings({
            });
            subject.accessTokenExpiringNotificationTime.should.equal(60);
        });

    });

    describe("redirectNavigator", function() {
        it("should return value from initial settings", function() {
            let temp = {};
            let subject = new UserManagerSettings({
                redirectNavigator : temp
            });
            subject.redirectNavigator.should.equal(temp);
        });
    });

    describe("popupNavigator", function() {
        it("should return value from initial settings", function() {
            let temp = {};
            let subject = new UserManagerSettings({
                popupNavigator : temp
            });
            subject.popupNavigator.should.equal(temp);
        });
    });

    describe("iframeNavigator", function() {
        it("should return value from initial settings", function() {
            let temp = {};
            let subject = new UserManagerSettings({
                iframeNavigator : temp
            });
            subject.iframeNavigator.should.equal(temp);
        });
    });

    describe("redirectNavigator", function() {
        it("should return value from initial settings", function() {
            let temp = {};
            let subject = new UserManagerSettings({
                userStore : temp
            });
            subject.userStore.should.equal(temp);
        });
    });

    describe("revokeAccessTokenOnSignout", function() {
        it("should return value from initial settings", function() {
            let subject = new UserManagerSettings({
                revokeAccessTokenOnSignout : true
            });
            subject.revokeAccessTokenOnSignout.should.equal(true);
        });
    });

    describe("checkSessionInterval", function() {
        it("should return value from initial settings", function() {
            let subject = new UserManagerSettings({
                checkSessionInterval : 6000
            });
            subject.checkSessionInterval.should.equal(6000);
        });
        it("should use default value", function () {
            let subject = new UserManagerSettings({
            });
            subject.checkSessionInterval.should.equal(2000);
        });
    });

    describe("query_status_response_type", function() {
        it("should return value from initial settings", function() {
            let temp = 'type';
            let subject = new UserManagerSettings({
                query_status_response_type : temp
            });
            subject.query_status_response_type.should.equal(temp);
        });
        it("should infer default value", function () {
            {
                let subject = new UserManagerSettings({
                    response_type: "id_token token"
                });
                subject.query_status_response_type.should.equal("id_token");
            }
            {            
                let subject = new UserManagerSettings({
                    response_type: "code"
                });
                subject.query_status_response_type.should.equal("code");
            }
        });
    });

    describe("stopCheckSessionOnError", function() {
        it("should return value from initial settings", function() {
            let subject = new UserManagerSettings({
                stopCheckSessionOnError : false
            });
            subject.stopCheckSessionOnError.should.be.false;
        });
        it("should use default value", function () {
            let subject = new UserManagerSettings({
            });
            subject.stopCheckSessionOnError.should.be.true;
        });
    });
});
