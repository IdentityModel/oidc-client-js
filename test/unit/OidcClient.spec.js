// Copyright (c) Brock Allen & Dominick Baier. All rights reserved.
// Licensed under the Apache License, Version 2.0. See LICENSE in the project root for license information.

import OidcClient from '../../src/OidcClient';
import SigninRequest from '../../src/SigninRequest';
import SigninResponse from '../../src/SigninResponse';
import ErrorResponse from '../../src/ErrorResponse';
import SignoutRequest from '../../src/SignoutRequest';
import SignoutResponse from '../../src/SignoutResponse';
import State from '../../src/State';
import OidcClientSettings from '../../src/OidcClientSettings';
import MetadataService from '../../src/MetadataService';

import Log from '../../src/Log';

import StubMetadataService from './StubMetadataService';
import StubStateStore from './StubStateStore';
import StubResponseValidator from './StubResponseValidator';

import chai from 'chai';
chai.should();
let assert = chai.assert;

describe("OidcClient", function () {
    let settings;
    let subject;
    let stubMetadataService;
    let stubStore;
    let stubValidator;

    beforeEach(function () {
        Log.logger = console;
        Log.level = Log.NONE;

        settings = {
            client_id: 'client',
            redirect_uri: "http://app"
        };

        stubStore = new StubStateStore();
        stubValidator = new StubResponseValidator();
        stubMetadataService = new StubMetadataService();

        subject = new OidcClient(settings, {
            stateStore: stubStore,
            ResponseValidatorCtor: () => stubValidator,
            MetadataServiceCtor: () => stubMetadataService
        });
    });

    describe("constructor", function () {

        it("should allow no settings", function () {
            let subject = new OidcClientSettings();
        });

        it("should expose settings", function () {
            subject.settings.should.be.ok;
            subject.settings.client_id.should.equal("client");
        });

        it("should accept OidcClientSettings", function () {
            let settings = new OidcClientSettings({ client_id: "client" });

            let subject = new OidcClient(settings, {
                stateStore: stubStore,
                ResponseValidatorCtor: () => stubValidator,
                MetadataServiceCtor: () => stubMetadataService
            });

            subject.settings.should.equal(settings);
        });

    });

    describe("settings", function () {

        it("should be OidcClientSettings", function () {
            subject.settings.should.be.instanceof(OidcClientSettings);
        });

    });

    describe("metadataService", function () {

        it("should be MetadataService", function () {
            subject.metadataService.should.be.equal(stubMetadataService);
        });

    });

    describe("createSigninRequest", function () {

        it("should return a promise", function () {
            stubMetadataService.getAuthorizationEndpointResult = Promise.resolve("http://sts/authorize");
            subject.createSigninRequest().should.be.instanceof(Promise);
        });

        it("should return SigninRequest", function (done) {
            stubMetadataService.getAuthorizationEndpointResult = Promise.resolve("http://sts/authorize");

            var p = subject.createSigninRequest();

            p.then(request => {
                request.should.be.instanceof(SigninRequest);
                done();
            });
        });

        it("should pass params to SigninRequest", function (done) {
            stubMetadataService.getAuthorizationEndpointResult = Promise.resolve("http://sts/authorize");

            var p = subject.createSigninRequest({
                data: 'foo',
                response_type: 'bar',
                scope: 'baz',
                redirect_uri: 'quux',
                prompt: 'p',
                display: 'd',
                max_age: 'm',
                ui_locales: 'u',
                id_token_hint: 'ith',
                login_hint: 'lh',
                acr_values: 'av'
            });

            p.then(request => {
                request.state.data.should.equal('foo');

                var url = request.url;
                url.should.contain("http://sts/authorize");
                url.should.contain("response_type=bar");
                url.should.contain("scope=baz");
                url.should.contain("redirect_uri=quux");
                url.should.contain("prompt=p");
                url.should.contain("display=d");
                url.should.contain("max_age=m");
                url.should.contain("ui_locales=u");
                url.should.contain("id_token_hint=ith");
                url.should.contain("login_hint=lh");
                url.should.contain("acr_values=av");

                done();
            });
        });

        it("should fail if metadata fails", function (done) {

            stubMetadataService.getAuthorizationEndpointResult = Promise.reject(new Error("test"));

            var p = subject.createSigninRequest();

            p.then(null, err => {
                err.message.should.contain("test");
                done();
            });
        });

        it("should fail if seting state into store fails", function (done) {
            stubMetadataService.getAuthorizationEndpointResult = Promise.resolve("http://sts/authorize");
            stubStore.error = "foo";

            var p = subject.createSigninRequest();

            p.then(null, err => {
                err.message.should.contain("foo");
                done();
            });
        });

        it("should store state", function (done) {
            stubMetadataService.getAuthorizationEndpointResult = Promise.resolve("http://sts/authorize");

            var p = subject.createSigninRequest();

            p.then(request => {
                stubStore.item.should.be.ok;
                done();
            });
        });

    });

    describe("processSigninResponse", function () {

        it("should return a promise", function () {
            subject.processSigninResponse("state=state").should.be.instanceof(Promise);
        });

        it("should fail if no state on response", function (done) {
            stubStore.item = "state";
            subject.processSigninResponse("").then(null, err => {
                err.message.should.contain('state');
                done();
            });
        });

        it("should fail if storage fails", function (done) {
            stubStore.error = "fail";
            subject.processSigninResponse("state=state").then(null, err => {
                err.message.should.contain('fail');
                done();
            });
        });

        it("should deserialize stored state and call validator", function (done) {

            stubStore.item = new State({ id: '1', nonce: '2' }).toStorageString();

            subject.processSigninResponse("state=1").then(response => {
                stubValidator.signinState.id.should.equal('1');
                stubValidator.signinState.nonce.should.equal('2');
                stubValidator.signinResponse.should.be.deep.equal(response);
                done();
            });
        });

    });

    describe("createSignoutRequest", function () {

        it("should return a promise", function () {
            stubMetadataService.getEndSessionEndpointResult = Promise.resolve("http://sts/signout");
            subject.createSignoutRequest().should.be.instanceof(Promise);
        });

        it("should return SignoutRequest", function (done) {
            stubMetadataService.getEndSessionEndpointResult = Promise.resolve("http://sts/signout");

            var p = subject.createSignoutRequest();

            p.then(request => {
                request.should.be.instanceof(SignoutRequest);
                done();
            });
        });

        it("should pass params to SignoutRequest", function (done) {
            stubMetadataService.getEndSessionEndpointResult = Promise.resolve("http://sts/signout");

            var p = subject.createSignoutRequest({
                data: 'foo',
                post_logout_redirect_uri: "bar",
                id_token_hint: "baz"
            });

            p.then(request => {
                request.state.data.should.equal('foo');
                var url = request.url;
                url.should.contain("http://sts/signout");
                url.should.contain("post_logout_redirect_uri=bar");
                url.should.contain("id_token_hint=baz");
                done();
            });
        });

        it("should fail if metadata fails", function (done) {
            stubMetadataService.getEndSessionEndpointResult = Promise.reject(new Error("test"));

            var p = subject.createSignoutRequest();

            p.then(null, err => {
                err.message.should.contain("test");
                done();
            });
        });

        it("should store state", function (done) {
            stubMetadataService.getEndSessionEndpointResult = Promise.resolve("http://sts/signout");

            var p = subject.createSignoutRequest();

            p.then(request => {
                stubStore.item.should.be.ok;
                done();
            });
        });

    });

    describe("processSignoutResponse", function () {

        it("should return a promise", function () {
            subject.processSignoutResponse("state=state").should.be.instanceof(Promise);
        });

        it("should fail if no state on response", function (done) {
            stubStore.item = "state";
            subject.processSignoutResponse("").then(null, err => {
                err.message.should.contain('state');
                done();
            });
        });

        it("should fail if storage fails", function (done) {
            stubStore.error = "fail";
            subject.processSignoutResponse("state=state").then(null, err => {
                err.message.should.contain('fail');
                done();
            });
        });

        it("should deserialize stored state and call validator", function (done) {

            stubStore.item = new State({ id: '1' }).toStorageString();

            subject.processSignoutResponse("state=1").then(response => {
                stubValidator.signoutState.id.should.equal('1');
                stubValidator.signoutResponse.should.be.deep.equal(response);
                done();
            });
        });

    });

    describe("clearStaleState", function () {

        it("should return a promise", function () {
            subject.clearStaleState().should.be.instanceof(Promise);
        });

        it("should call State.clearStaleState", function () {
            var oldState = State.clearStaleState;

            State.clearStaleState = function (store, age) {
                State.clearStaleState.wasCalled = true;
                State.clearStaleState.store = store;
                State.clearStaleState.age = age;
            };
            subject.clearStaleState();

            State.clearStaleState.wasCalled.should.be.true;
            State.clearStaleState.store.should.equal(subject._stateStore);
            State.clearStaleState.age.should.equal(subject.settings.staleStateAge);

            State.clearStaleState = oldState;
        });

    });

});
