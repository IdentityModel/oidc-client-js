// Copyright (c) Brock Allen & Dominick Baier. All rights reserved.
// Licensed under the Apache License, Version 2.0. See LICENSE in the project root for license information.

import { Log } from './src/Log';
import { OidcClient } from './src/OidcClient';
import { OidcClientSettings } from './src/OidcClientSettings';
import { WebStorageStateStore } from './src/WebStorageStateStore';
import { InMemoryWebStorage } from './src/InMemoryWebStorage';
import { UserManager } from './src/UserManager';
import { AccessTokenEvents } from './src/AccessTokenEvents';
import { MetadataService } from './src/MetadataService';
import { CordovaPopupNavigator } from './src/CordovaPopupNavigator';
import { CordovaIFrameNavigator } from './src/CordovaIFrameNavigator';
import { CheckSessionIFrame } from './src/CheckSessionIFrame';
import { TokenRevocationClient } from './src/TokenRevocationClient';
import { SessionMonitor } from './src/SessionMonitor';
import { Global } from './src/Global';
import { User } from './src/User';

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