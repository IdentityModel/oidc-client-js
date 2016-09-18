// Copyright (c) Brock Allen & Dominick Baier. All rights reserved.
// Licensed under the Apache License, Version 2.0. See LICENSE in the project root for license information.

IdentityModel.Log.logger = console;

window.sessionStorage.clear();
window.localStorage.clear();

describe("OidcClient", function() {
    
    var settings;
    var oidcClient;
    
    beforeEach(function() {
        IdentityModel.Log.level = IdentityModel.Log.NONE;

        settings = {
            authority: 'http://localhost:5000/oidc',
            metadata: oidc.metadata,
            signingKeys: oidc.signingKeys,
            
            client_id: 'js.tokenmanager',
            redirect_uri: 'http://localhost:5000/index.html',
            post_logout_redirect_uri: 'http://localhost:5000/index.html',
            response_type: 'id_token token',
            scope: 'openid email roles',

            filterProtocolClaims: true,
            loadUserInfo: false
        };
        
        oidcClient = new IdentityModel.OidcClient(settings);
    });
    
    it("should perform signin", function(done) {
        
        oidcClient.createSigninRequest({data:{foo:1}}).then(function(req){
            
            var url = oidc.processAuthorization(req.url);

            oidcClient.processSigninResponse(url).then(function(res){
                
                assert(res, "result");
                assert(res.state, "res.result");
                assert(res.state.foo === 1, "foo===1");
                
                done();
            }, function(e){
                fail(e);
            });
        }, function(e){
            fail(e);
        });
    });
    
    it("should perform signout", function(done) {
        
        oidcClient.createSignoutRequest({data:{foo:1}}).then(function(req){
            
            var url = oidc.processEndSession(req.url);

            oidcClient.processSignoutResponse(url).then(function(res){
                
                assert(res, "result");
                assert(res.state, "res.result");
                assert(res.state.foo === 1, "foo===1");
                
                done();
            }, function(e){
                fail(e);
            });
        }, function(e){
            fail(e);
        });
    });
});
