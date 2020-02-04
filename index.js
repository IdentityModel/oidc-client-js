// Copyright (c) Brock Allen & Dominick Baier. All rights reserved.
// Licensed under the Apache License, Version 2.0. See LICENSE in the project root for license information.

import { Log } from './src/Log.js';
import { OidcClient } from './src/OidcClient.js';
import { OidcClientSettings } from './src/OidcClientSettings.js';
import { WebStorageStateStore } from './src/WebStorageStateStore.js';
import { InMemoryWebStorage } from './src/InMemoryWebStorage.js';
import { UserManager } from './src/UserManager.js';
import { AccessTokenEvents } from './src/AccessTokenEvents.js';
import { MetadataService } from './src/MetadataService.js';
import { CordovaPopupNavigator } from './src/CordovaPopupNavigator.js';
import { CordovaIFrameNavigator } from './src/CordovaIFrameNavigator.js';
import { CheckSessionIFrame } from './src/CheckSessionIFrame.js';
import { TokenRevocationClient } from './src/TokenRevocationClient.js';
import { SessionMonitor } from './src/SessionMonitor.js';
import { Global } from './src/Global.js';
import { User } from './src/User.js';

import { Version } from './version.js';

export default {
    Version,
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
