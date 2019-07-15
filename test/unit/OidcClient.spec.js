// Copyright (c) Brock Allen & Dominick Baier. All rights reserved.
// Licensed under the Apache License, Version 2.0. See LICENSE in the project root for license information.

import { Global } from '../../src/Global';
import { OidcClient } from '../../src/OidcClient';
import { SigninRequest } from '../../src/SigninRequest';
import { SigninResponse } from '../../src/SigninResponse';
import { ErrorResponse } from '../../src/ErrorResponse';
import { SignoutRequest } from '../../src/SignoutRequest';
import { SignoutResponse } from '../../src/SignoutResponse';
import { State } from '../../src/State';
import { SigninState } from '../../src/SigninState';
import { OidcClientSettings } from '../../src/OidcClientSettings';
import { MetadataService } from '../../src/MetadataService';

import { Log } from '../../src/Log';

import { StubMetadataService } from './StubMetadataService';
import { StubStateStore } from './StubStateStore';
import { StubResponseValidator } from './StubResponseValidator';

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

        Global._testing();

        Log.logger = console;
        Log.level = Log.NONE;

        stubStore = new StubStateStore();
        stubValidator = new StubResponseValidator();
        stubMetadataService = new StubMetadataService();

        settings = {
            authority: 'authority',
            client_id: 'client',
            redirect_uri: "http://app",
            post_logout_redirect_uri: "http://app",
            stateStore: stubStore,
            ResponseValidatorCtor: () => stubValidator,
            MetadataServiceCtor: () => stubMetadataService
        };
        subject = new OidcClient(settings);
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
            var p = subject.createSigninRequest();
            p.should.be.instanceof(Promise);
            p.catch(e=>{});
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
                response_mode: 'mode',
                scope: 'baz',
                redirect_uri: 'quux',
                prompt: 'p',
                display: 'd',
                max_age: 'm',
                ui_locales: 'u',
                id_token_hint: 'ith',
                login_hint: 'lh',
                acr_values: 'av',
                resource: 'res',
                request: 'req',
                request_uri: 'req_uri'
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
                url.should.contain("resource=res");
                url.should.contain("request=req");
                url.should.contain("request_uri=req_uri");
                url.should.contain("response_mode=mode");

                done();
            });
        });

        it("should pass state in place of data to SigninRequest", function (done) {
            stubMetadataService.getAuthorizationEndpointResult = Promise.resolve("http://sts/authorize");

            var p = subject.createSigninRequest({
                state: 'foo',
                response_type: 'bar',
                scope: 'baz',
                redirect_uri: 'quux',
                prompt: 'p',
                display: 'd',
                max_age: 'm',
                ui_locales: 'u',
                id_token_hint: 'ith',
                login_hint: 'lh',
                acr_values: 'av',
                resource: 'res'
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
                url.should.contain("resource=res");

                done();
            });
        });

        it("should fail if hybrid code id_token requested", function (done) {
            var p = subject.createSigninRequest({response_type:"code id_token"});
            p.then(null, err => {
                err.message.should.contain("hybrid");
                done();
            });
        });

        it("should fail if hybrid code token requested", function (done) {
            var p = subject.createSigninRequest({response_type:"code token"});
            p.then(null, err => {
                err.message.should.contain("hybrid");
                done();
            });
        });

        it("should fail if hybrid code id_token token requested", function (done) {
            var p = subject.createSigninRequest({response_type:"code id_token token"});
            p.then(null, err => {
                err.message.should.contain("hybrid");
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

    describe("readSigninResponseState", function () {

        it("should return a promise", function () {
            var p = subject.readSigninResponseState("state=state");
            p.should.be.instanceof(Promise);
            p.catch(e=>{});
        });

        it("should fail if no state on response", function (done) {
            stubStore.item = "state";
            subject.readSigninResponseState("").then(null, err => {
                err.message.should.contain('state');
                done();
            });
        });

        it("should fail if storage fails", function (done) {
            stubStore.error = "fail";
            subject.readSigninResponseState("state=state").then(null, err => {
                err.message.should.contain('fail');
                done();
            });
        });

        it("should deserialize stored state and return state and response", function (done) {
            stubStore.item = new SigninState({ id: '1', nonce: '2', authority:'authority', client_id:'client', request_type:'type' }).toStorageString();

            subject.readSigninResponseState("state=1").then(({state, response}) => {
                state.id.should.equal('1');
                state.nonce.should.equal('2');
                state.authority.should.equal('authority');
                state.client_id.should.equal('client');
                state.request_type.should.equal('type');
                response.state.should.equal('1');
                done();
            });
        });

    });

    describe("processSigninResponse", function () {

        it("should return a promise", function () {
            var p = subject.processSigninResponse("state=state");
            p.should.be.instanceof(Promise);
            p.catch(e=>{});
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
            stubStore.item = new SigninState({ id: '1', nonce: '2', authority:'authority', client_id:'client' }).toStorageString();

            subject.processSigninResponse("state=1").then(response => {
                stubValidator.signinState.id.should.equal('1');
                stubValidator.signinState.nonce.should.equal('2');
                stubValidator.signinState.authority.should.equal('authority');
                stubValidator.signinState.client_id.should.equal('client');
                stubValidator.signinResponse.should.be.deep.equal(response);
                done();
            });
        });

    });

    describe("createSignoutRequest", function () {

        it("should return a promise", function () {
            stubMetadataService.getEndSessionEndpointResult = Promise.resolve("http://sts/signout");
            var p = subject.createSignoutRequest();
            p.should.be.instanceof(Promise);
            p.catch(e=>{});
        });

        it("should return SignoutRequest", function (done) {
            stubMetadataService.getEndSessionEndpointResult = Promise.resolve("http://sts/signout");

            var p = subject.createSignoutRequest();

            p.then(request => {
                request.should.be.instanceof(SignoutRequest);
                done();
            });
        });

        it("should pass state in place of data to SignoutRequest", function (done) {
            stubMetadataService.getEndSessionEndpointResult = Promise.resolve("http://sts/signout");

            var p = subject.createSignoutRequest({
                state: 'foo',
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

        it("should fail if no signout endpoint on metadata", function (done) {
            stubMetadataService.getEndSessionEndpointResult = Promise.resolve(undefined);

            var p = subject.createSignoutRequest();

            p.catch(err => {
                err.message.should.contain("no end session endpoint");
                done();
            });
        });

        it("should store state", function (done) {
            stubMetadataService.getEndSessionEndpointResult = Promise.resolve("http://sts/signout");

            var p = subject.createSignoutRequest({
                data:"foo", id_token_hint:'hint'
            });

            p.then(request => {
                stubStore.item.should.be.ok;
                done();
            });
        });

        it("should not generate state if no data", function (done) {
            stubMetadataService.getEndSessionEndpointResult = Promise.resolve("http://sts/signout");

            var p = subject.createSignoutRequest();

            p.then(request => {
                assert.isUndefined(stubStore.item);
                done();
            });
        });
    });

    describe("readSignoutResponseState", function () {

        it("should return a promise", function () {
            var p = subject.readSignoutResponseState("state=state");
            p.should.be.instanceof(Promise);
            p.catch(e=>{});
        });

        it("should return result if no state on response", function (done) {
            subject.readSignoutResponseState("").then(({state, response}) => {
                response.should.be.ok;
                done();
            });
        });

        it("should return error", function (done) {
            subject.readSignoutResponseState("error=foo").then(null, err => {
                err.error.should.equal("foo");
                done();
            });
        });

        it("should fail if storage fails", function (done) {
            stubStore.error = "fail";
            subject.readSignoutResponseState("state=state").then(null, err => {
                err.message.should.contain('fail');
                done();
            });
        });

        it("should deserialize stored state and return state and response", function (done) {

            stubStore.item = new State({ id: '1', request_type:'type' }).toStorageString();

            subject.readSignoutResponseState("state=1").then(({state, response}) => {
                state.id.should.equal('1');
                state.request_type.should.equal('type');
                response.state.should.be.equal('1');
                done();
            });
        });

        it("should call validator with state even if error in response", function (done) {

            stubStore.item = new State({ id: '1', data:"bar" }).toStorageString();

            subject.processSignoutResponse("state=1&error=foo").then(response => {
                stubValidator.signoutState.id.should.equal('1');
                stubValidator.signoutResponse.should.be.deep.equal(response);
                done();
            });
        });

    });

    describe("processSignoutResponse", function () {

        it("should return a promise", function () {
            var p = subject.processSignoutResponse("state=state");
            p.should.be.instanceof(Promise);
            p.catch(e=>{});
        });

        it("should return result if no state on response", function (done) {
            subject.processSignoutResponse("").then(response => {
                response.should.be.ok;
                done();
            });
        });

        it("should return error", function (done) {
            subject.processSignoutResponse("error=foo").then(null, err => {
                err.error.should.equal("foo");
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

        it("should call validator with state even if error in response", function (done) {

            stubStore.item = new State({ id: '1', data:"bar" }).toStorageString();

            subject.processSignoutResponse("state=1&error=foo").then(response => {
                stubValidator.signoutState.id.should.equal('1');
                stubValidator.signoutResponse.should.be.deep.equal(response);
                done();
            });
        });

    });

    describe("clearStaleState", function () {

        it("should return a promise", function () {
            var p = subject.clearStaleState();
            p.should.be.instanceof(Promise);
            p.catch(e=>{});
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
