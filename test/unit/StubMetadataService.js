// Copyright (c) Brock Allen & Dominick Baier. All rights reserved.
// Licensed under the Apache License, Version 2.0. See LICENSE in the project root for license information.

export class StubMetadataService{
    resetSigningKeys(){ }
    getMetadata(){
        return this.getMetadataResult;
    }
    getIssuer(){
        return this.getIssuerResult;
    }
    getAuthorizationEndpoint(){
        return this.getAuthorizationEndpointResult;
    }
    getEndSessionEndpoint(){
        return this.getEndSessionEndpointResult;
    }
    getUserInfoEndpoint(){
        return this.userInfoEndpointResult;
    }
    getSigningKeys(){
        return this.getSigningKeysResult;
    }
}
