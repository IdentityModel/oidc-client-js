///////////////////////////////
// UI event handlers
///////////////////////////////
document.getElementById('signin').addEventListener("click", signin, false);
document.getElementById('processSignin').addEventListener("click", processSigninResponse, false);
document.getElementById('signout').addEventListener("click", signout, false);
document.getElementById('processSignout').addEventListener("click", processSignoutResponse, false);

///////////////////////////////
// OidcClient config
///////////////////////////////
IdentityModel.OidcClient.logger = console;
IdentityModel.OidcClient.logLevel = 'INFO';

var settings = {
    authority: 'http://localhost:5000/oidc',
    client_id: 'js.tokenmanager',
    redirect_uri: 'http://localhost:5000/index.html',
    post_logout_redirect_uri: 'http://localhost:5000/index.html',
    response_type: 'id_token',
    scope: 'openid email roles',
    
    filterProtocolClaims : true,
    loadUserInfo:true
};
var oidcClient = new IdentityModel.OidcClient(settings);

///////////////////////////////
// functions for UI elements
///////////////////////////////
function signin() {
    oidcClient.createSigninRequest({data:{bar:15}}).then(function(req){
        log(req);    
        window.location = req.url;
    }, function (err) {
        log(err);
    });
}

var signinResponse;
function processSigninResponse() {
    oidcClient.processSigninResponse().then(function(response){
        signinResponse = response;
        log(signinResponse);
    }, function (err) {
        log(err.message);
    });
}

function signout() {
    oidcClient.createSignoutRequest({id_token_hint:signinResponse && signinResponse.id_token, data:{foo:5}}).then(function(req){
        window.location = req.url;
        //log(req);    
    });
}

function processSignoutResponse() {
    oidcClient.processSignoutResponse().then(function(response){
        signinResponse = null;
        log(response);
    }, function (err) {
        log(err.message);
    });
}

///////////////////////////////
// debugging helpers
///////////////////////////////

function log() {
    document.getElementById('out').innerText = '';

    Array.prototype.forEach.call(arguments, function(msg){
        if (typeof msg !== 'string') {
            msg = JSON.stringify(msg, null, 2);
        }
        document.getElementById('out').innerText += msg + '\r\n';
        
    });
}
