// Copyright (c) Brock Allen & Dominick Baier. All rights reserved.
// Licensed under the Apache License, Version 2.0. See LICENSE in the project root for license information.

///////////////////////////////
// UI event handlers
///////////////////////////////
document.getElementById('clearState').addEventListener("click", clearState, false);
document.getElementById('getUser').addEventListener("click", getUser, false);
document.getElementById('removeUser').addEventListener("click", removeUser, false);
document.getElementById('querySessionStatus').addEventListener("click", querySessionStatus, false);

document.getElementById('startSigninMainWindow').addEventListener("click", startSigninMainWindow, false);
document.getElementById('endSigninMainWindow').addEventListener("click", endSigninMainWindow, false);
document.getElementById('startSigninMainWindowDiffCallbackPage').addEventListener("click", startSigninMainWindowDiffCallbackPage, false);

document.getElementById('popupSignin').addEventListener("click", popupSignin, false);
document.getElementById('iframeSignin').addEventListener("click", iframeSignin, false);

document.getElementById('startSignoutMainWindow').addEventListener("click", startSignoutMainWindow, false);
document.getElementById('endSignoutMainWindow').addEventListener("click", endSignoutMainWindow, false);

document.getElementById('popupSignout').addEventListener("click", popupSignout, false);

///////////////////////////////
// config
///////////////////////////////
Oidc.Log.logger = console;
Oidc.Log.level = Oidc.Log.DEBUG;
console.log("Using oidc-client version: ", Oidc.Version);

var url = window.location.origin;

var settings = {
    authority: 'https://demo.identityserver.io',
    client_id: 'interactive.public',
    //client_id: 'interactive.public.short',
    redirect_uri: url + '/code-identityserver-sample.html',
    post_logout_redirect_uri: url + '/code-identityserver-sample.html',
    response_type: 'code',
    //response_mode: 'fragment',
    scope: 'openid profile api',
    //scope: 'openid profile api offline_access',
    
    popup_redirect_uri: url + '/code-identityserver-sample-popup-signin.html',
    popup_post_logout_redirect_uri: url + '/code-identityserver-sample-popup-signout.html',
    
    silent_redirect_uri: url + '/code-identityserver-sample-silent.html',
    automaticSilentRenew:false,
    validateSubOnSilentRenew: true,
    //silentRequestTimeout:10000,

    monitorAnonymousSession : true,

    filterProtocolClaims: true,
    loadUserInfo: true,
    revokeAccessTokenOnSignout : true,

    //metadata: {"issuer":"https://demo.identityserver.io","jwks_uri":"https://demo.identityserver.io/.well-known/openid-configuration/jwks","authorization_endpoint":"https://demo.identityserver.io/connect/authorize","token_endpoint":"https://demo.identityserver.io/connect/token","userinfo_endpoint":"https://demo.identityserver.io/connect/userinfo","end_session_endpoint":"https://demo.identityserver.io/connect/endsession","check_session_iframe":"https://demo.identityserver.io/connect/checksession","revocation_endpoint":"https://demo.identityserver.io/connect/revocation","introspection_endpoint":"https://demo.identityserver.io/connect/introspect","device_authorization_endpoint":"https://demo.identityserver.io/connect/deviceauthorization","frontchannel_logout_supported":true,"frontchannel_logout_session_supported":true,"backchannel_logout_supported":true,"backchannel_logout_session_supported":true,"scopes_supported":["openid","profile","email","api","api.scope1","api.scope2","scope2","policyserver.runtime","policyserver.management","offline_access"],"claims_supported":["sub","name","family_name","given_name","middle_name","nickname","preferred_username","profile","picture","website","gender","birthdate","zoneinfo","locale","updated_at","email","email_verified"],"grant_types_supported":["authorization_code","client_credentials","refresh_token","implicit","password","urn:ietf:params:oauth:grant-type:device_code"],"response_types_supported":["code","token","id_token","id_token token","code id_token","code token","code id_token token"],"response_modes_supported":["form_post","query","fragment"],"token_endpoint_auth_methods_supported":["client_secret_basic","client_secret_post"],"id_token_signing_alg_values_supported":["RS256"],"subject_types_supported":["public"],"code_challenge_methods_supported":["plain","S256"],"request_parameter_supported":true},
    //metadataSeed: {"some_extra_data":"some_value"},
    //signingKeys:[{"kty":"RSA","use":"sig","kid":"5CCAA03EDDE26D53104CC35D0D4B299C","e":"AQAB","n":"3fbgsZuL5Kp7HyliAznS6N0kTTAqApIzYqu0tORUk4T9m2f3uW5lDomNmwwPuZ3QDn0nwN3esx2NvZjL_g5DN407Pgl0ffHhARdtydJvdvNJIpW4CmyYGnI8H4ZdHtuW4wF8GbKadIGgwpI4UqcsHuPiWKARfWZMQfPKBT08SiIPwGncavlRRDgRVX1T94AgZE_fOTJ4Odko9RX9iNXghJIzJ_wEkY9GEkoHz5lQGdHYUplxOS6fcxL8j_N9urSBlnoYjPntBOwUfPsMoNcmIDXPARcq10miWTz8SHzUYRtsiSUMqimRJ9KdCucKcCmttB_p_EAWohJQDnav-Vqi3Q","alg":"RS256"}]
};
var mgr = new Oidc.UserManager(settings);

///////////////////////////////
// events
///////////////////////////////
mgr.events.addAccessTokenExpiring(function () {
    console.log("token expiring");
    log("token expiring");

    // maybe do this code manually if automaticSilentRenew doesn't work for you
    mgr.signinSilent().then(function(user) {
        log("silent renew success", user);
    }).catch(function(e) {
        log("silent renew error", e.message);
    })
});

mgr.events.addAccessTokenExpired(function () {
    console.log("token expired");
    log("token expired");
});

mgr.events.addSilentRenewError(function (e) {
    console.log("silent renew error", e.message);
    log("silent renew error", e.message);
});

mgr.events.addUserLoaded(function (user) {
    console.log("user loaded", user);
    mgr.getUser().then(function(){
       console.log("getUser loaded user after userLoaded event fired"); 
    });
});

mgr.events.addUserUnloaded(function (e) {
    console.log("user unloaded");
});

mgr.events.addUserSignedIn(function (e) {
    log("user logged in to the token server");
});
mgr.events.addUserSignedOut(function (e) {
    log("user logged out of the token server");
});

///////////////////////////////
// functions for UI elements
///////////////////////////////
function clearState(){
    mgr.clearStaleState().then(function(){
        log("clearStateState success");
    }).catch(function(e){
        log("clearStateState error", e.message);
    });
}

function getUser() {
    mgr.getUser().then(function(user) {
        log("got user", user);
    }).catch(function(err) {
        log(err);
    });
}

function removeUser() {
    mgr.removeUser().then(function() {
        log("user removed");
    }).catch(function(err) {
        log(err);
    });
}

function startSigninMainWindow() {
    var someState = {message:'some data'};
    mgr.signinRedirect({state:someState, useReplaceToNavigate:true}).then(function() {
        log("signinRedirect done");
    }).catch(function(err) {
        log(err);
    });
}

function endSigninMainWindow() {
    mgr.signinCallback().then(function(user) {
        log("signed in", user);
        // this is how you get the state after the login:
        var theState = user.state;
        var theMessage = theState.message;
        console.log("here's our post-login state", theMessage);
    }).catch(function(err) {
        log(err);
    });
}

function startSigninMainWindowDiffCallbackPage() {
    mgr.signinRedirect({state:'some data', redirect_uri: url + '/code-identityserver-sample-callback.html'}).then(function() {
        log("signinRedirect done");
    }).catch(function(err) {
        log(err);
    });
}

function popupSignin() {
    mgr.signinPopup({state:'some data'}).then(function(user) {
        log("signed in", user);
    }).catch(function(err) {
        log(err);
    });
}

function popupSignout() {
    mgr.signoutPopup({state:'some data'}).then(function() {
        log("signed out");
    }).catch(function(err) {
        log(err);
    });
}

function iframeSignin() {
    mgr.signinSilent({state:'some data'}).then(function(user) {
        log("signed in", user);
    }).catch(function(err) {
        log(err);
    });
}

function querySessionStatus() {
    mgr.querySessionStatus().then(function(status) {
        log("user's session status", status);
    }).catch(function(err) {
        log(err);
    });
}

function startSignoutMainWindow(){
    mgr.signoutRedirect({state:'some data'}).then(function(resp) {
    //mgr.signoutRedirect().then(function(resp) {
            log("signed out", resp);
    }).catch(function(err) {
        log(err);
    });
};

function endSignoutMainWindow(){
    mgr.signoutCallback().then(function(resp) {
        log("signed out", resp);
    }).catch(function(err) {
        log(err);
    });
};
