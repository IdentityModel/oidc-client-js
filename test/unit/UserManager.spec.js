// Copyright (c) Brock Allen & Dominick Baier. All rights reserved.
// Licensed under the Apache License, Version 2.0. See LICENSE in the project root for license information.

import UserManager from '../../src/UserManager';
import Log from '../../src/Log';
import UserManagerSettings from '../../src/UserManagerSettings';

import StubMetadataService from './StubMetadataService';
import StubStateStore from './StubStateStore';
import StubResponseValidator from './StubResponseValidator';

import chai from 'chai';
chai.should();
let assert = chai.assert;

describe("UserManager", function() {
    let settings;
    let subject;
    let stubMetadataService;
    let stubStateStore;
    let stubValidator;
    let stubNavigator;
    let stubUserStore;

    beforeEach(function() {
        Log.logger = console;
        Log.level = Log.NONE;

        settings = {
            authority:'http://sts/oidc',
            client_id: 'client'
        };

        stubNavigator = {};
        stubUserStore = new StubStateStore();
        stubStateStore = new StubStateStore();
        stubValidator = new StubResponseValidator();
        stubMetadataService = new StubMetadataService();
        
        subject = new UserManager(settings, {
            navigator : stubNavigator,
            userStore: stubUserStore,
            stateStore:stubStateStore, 
            ResponseValidatorCtor : () => stubValidator, 
            MetadataServiceCtor : () => stubMetadataService
        });
    });

    describe("constructor", function() {
        
        it("should accept settings", function(){
            subject.settings.client_id.should.equal('client');
        });
        
    });
   
    describe("settings", function() {
        
        it("should be UserManagerSettings", function(){
            subject.settings.should.be.instanceof(UserManagerSettings);
        });
        
    });

});
