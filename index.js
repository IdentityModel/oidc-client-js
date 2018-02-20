// Copyright (c) Brock Allen & Dominick Baier. All rights reserved.
// Licensed under the Apache License, Version 2.0. See LICENSE in the project root for license information.

export const Log = require('./src/Log').Log;
export const OidcClient = require('./src/OidcClient').OidcClient;
export const OidcClientSettings = require('./src/OidcClientSettings').OidcClientSettings;
export const WebStorageStateStore = require('./src/WebStorageStateStore').WebStorageStateStore;
export const InMemoryWebStorage = require('./src/InMemoryWebStorage').InMemoryWebStorage;
export const UserManager = require('./src/UserManager').UserManager;
export const AccessTokenEvents = require('./src/AccessTokenEvents').AccessTokenEvents;
export const MetadataService = require('./src/MetadataService').MetadataService;
export const CordovaPopupNavigator = require('./src/CordovaPopupNavigator').CordovaPopupNavigator;
export const CordovaIFrameNavigator = require('./src/CordovaIFrameNavigator').CordovaIFrameNavigator;
export const CheckSessionIFrame = require('./src/CheckSessionIFrame').CheckSessionIFrame;
export const TokenRevocationClient = require('./src/TokenRevocationClient').TokenRevocationClient;
export const SessionMonitor = require('./src/SessionMonitor').SessionMonitor;
export const Global = require('./src/Global').Global;
export const User = require('./src/User').User;

export default {
    Log,
    OidcClient,
    OidcClientSettings,
    WebStorageStateStore,
    InMemoryWebStorage,
    UserManager,
    AccessTokenEvents,
    MetadataService,
    CordovaPopupNavigator,
    CordovaIFrameNavigator,
    CheckSessionIFrame,
    TokenRevocationClient,
    SessionMonitor,
    Global,
    User
};
