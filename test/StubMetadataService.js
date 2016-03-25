export default class StubMetadataService{
    getAuthorizationEndpoint(){
        return this.getAuthorizationEndpointResult;
    }
    getEndSessionEndpoint(){
        return this.getEndSessionEndpointResult;
    }
    getUserInfoEndpoint(){
        return this.userInfoEndpointResult;
    }
}