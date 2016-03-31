export default class StubMetadataService{
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