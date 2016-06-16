// Copyright (c) Brock Allen & Dominick Baier. All rights reserved.
// Licensed under the Apache License, Version 2.0. See LICENSE in the project root for license information.

export const Log = require('./src/Log');
export const OidcClient = require('./src/OidcClient');
export const WebStorageStateStore = require('./src/WebStorageStateStore');
export const InMemoryWebStorage = require('./src/InMemoryWebStorage');
export const UserManager = require('./src/UserManager');
export const AccessTokenEvents = require('./src/AccessTokenEvents');
export const MetadataService = require('./src/MetadataService');
export const CordovaPopupNavigator = require('./src/CordovaPopupNavigator');
export const CordovaIFrameNavigator = require('./src/CordovaIFrameNavigator');

export default {
    Log,
    OidcClient,
    WebStorageStateStore,
    InMemoryWebStorage,
    UserManager,
    AccessTokenEvents,
    MetadataService,
    CordovaPopupNavigator,
    CordovaIFrameNavigator
};
