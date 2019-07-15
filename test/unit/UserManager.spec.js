// Copyright (c) Brock Allen & Dominick Baier. All rights reserved.
// Licensed under the Apache License, Version 2.0. See LICENSE in the project root for license information.

import { UserManager } from '../../src/UserManager';
import { Log } from '../../src/Log';
import { Global } from '../../src/Global';
import { UserManagerSettings } from '../../src/UserManagerSettings';
import { User } from '../../src/User';

import { StubMetadataService } from './StubMetadataService';
import { StubSilentRenewService } from './StubSilentRenewService';
import { StubStateStore } from './StubStateStore';
import { StubResponseValidator } from './StubResponseValidator';
import { StubTokenRevocationClient } from './StubTokenRevocationClient';

import chai from 'chai';
chai.should();
let assert = chai.assert;

describe("UserManager", function () {
    let settings;
    let subject;
    let stubMetadataService;
    let stubStateStore;
    let stubValidator;
    let stubSilentRenewService;
    let stubNavigator;
    let stubUserStore;
    let stubTokenRevocationClient;

    beforeEach(function () {

        Global._testing();

        Log.logger = console;
        Log.level = Log.NONE;

        stubNavigator = {};
        stubUserStore = new StubStateStore();
        stubStateStore = new StubStateStore();
        stubValidator = new StubResponseValidator();
        stubSilentRenewService = new StubSilentRenewService();
        stubMetadataService = new StubMetadataService();
        stubTokenRevocationClient = new StubTokenRevocationClient();

        settings = {
            authority: 'http://sts/oidc',
            client_id: 'client',
            monitorSession : false,
            navigator: stubNavigator,
            userStore: stubUserStore,
            stateStore: stubStateStore,
            ResponseValidatorCtor: () => stubValidator,
            MetadataServiceCtor: () => stubMetadataService
        };

        subject = new UserManager(settings,
            () => stubSilentRenewService,
            null,
            () => stubTokenRevocationClient);
    });

    describe("constructor", function () {

        it("should accept settings", function () {
            subject.settings.client_id.should.equal('client');
        });

    });

    describe("settings", function () {

        it("should be UserManagerSettings", function () {
            subject.settings.should.be.instanceof(UserManagerSettings);
        });

    });

    describe("userLoaded", function () {

        it("should be able to call getUser without recursion", function (done) {

            stubUserStore.item = new User({id_token:"id_token"}).toStorageString();

            subject.events.addUserLoaded(user => {
                subject.getUser().then(user => {
                    done();
                });
            });

            subject.events.load({});
        });

    });

    describe("signinSilent", function(){

        it("should pass silentRequestTimeout from settings", function(done) {

            stubUserStore.item = new User({id_token:"id_token"}).toStorageString();

            settings.silentRequestTimeout = 123;
            settings.silent_redirect_uri = "http://client/silent_callback";
            subject = new UserManager(settings);

            subject._signin = function(args, nav, navArgs){
                Log.debug("_signin", args, nav, navArgs);

                navArgs.silentRequestTimeout.should.equal(123);
                done();
                return Promise.resolve()
            }
            subject.signinSilent();
        });

        it("should pass silentRequestTimeout from params", function(done){

            stubUserStore.item = new User({id_token:"id_token"}).toStorageString();

            settings.silent_redirect_uri = "http://client/silent_callback";
            subject = new UserManager(settings);

            subject._signin = function(args, nav, navArgs){
                navArgs.silentRequestTimeout.should.equal(234);
                done();
                return Promise.resolve()
            }
            subject.signinSilent({silentRequestTimeout:234});
        });

        it("should pass prompt from params", function(done){

            stubUserStore.item = new User({id_token:"id_token"}).toStorageString();

            settings.silent_redirect_uri = "http://client/silent_callback";
            subject = new UserManager(settings);

            subject._signin = function(args, nav, navArgs){
                args.prompt.should.equal("foo");
                done();
                return Promise.resolve()
            }
            subject.signinSilent({prompt:"foo"});
        });

        it("should work when having no User present", function(done) {
            settings.silent_redirect_uri = "http://client/silent_callback";
            subject = new UserManager(settings);

            subject._signin = function(){
                done();
                return Promise.resolve()
            }
            subject.signinSilent({prompt:"foo"});
        })
    });

});
