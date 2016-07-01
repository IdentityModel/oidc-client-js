// Copyright (c) Brock Allen & Dominick Baier. All rights reserved.
// Licensed under the Apache License, Version 2.0. See LICENSE in the project root for license information.

import log from "./src/Log";
import oidcClient from "./src/OidcClient";
import webStorageStateStore from "./src/WebStorageStateStore";
import inMemoryWebStorage from "./src/InMemoryWebStorage";
import userManager from "./src/UserManager";
import accessTokenEvents from "./src/AccessTokenEvents";
import metadataService from "./src/MetadataService";

export const Log = log;
export const OidcClient = oidcClient;
export const WebStorageStateStore = webStorageStateStore;
export const InMemoryWebStorage = inMemoryWebStorage;
export const UserManager = userManager;
export const AccessTokenEvents = accessTokenEvents;
export const MetadataService = metadataService;

export default {
    Log,
    OidcClient,
    WebStorageStateStore,
    InMemoryWebStorage,
    UserManager,
    AccessTokenEvents,
    MetadataService
};
