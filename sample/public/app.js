///////////////////////////////
// UI event handlers
///////////////////////////////
document.getElementById('signin').addEventListener("click", signin, false);
document.getElementById('processSignin').addEventListener("click", processSigninResponse, false);
document.getElementById('signout').addEventListener("click", signout, false);
document.getElementById('processSignout').addEventListener("click", processSignoutResponse, false);
document.getElementById('links').addEventListener('change', toggleLinks, false);

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
    response_type: 'id_token token',
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
        log("signin request", req, "<a href='" + req.url + "'>go signin</a>");
        if (followLinks()){    
            window.location = req.url;
        }
    }, function (err) {
        log(err);
    });
}

var signinResponse;
function processSigninResponse() {
    oidcClient.processSigninResponse().then(function(response){
        signinResponse = response;
        log("signin response", signinResponse);
    }, function (err) {
        log(err.message);
    });
}

function signout() {
    oidcClient.createSignoutRequest({id_token_hint:signinResponse && signinResponse.id_token, data:{foo:5}}).then(function(req){
        log("signout request", req, "<a href='" + req.url + "'>go signout</a>");    
        if (followLinks()){    
            window.location = req.url;
        }
    });
}

function processSignoutResponse() {
    oidcClient.processSignoutResponse().then(function(response){
        signinResponse = null;
        log("signout response", response);
    }, function (err) {
        log(err.message);
    });
}

function toggleLinks(){
    var val = document.getElementById('links').checked;
    localStorage.setItem("follow", val);
    
    var display = val ? 'none' : '';
    
    document.getElementById('processSignin').style.display = display;
    document.getElementById('processSignout').style.display = display;
}

function followLinks() {
    return localStorage.getItem("follow") === "true";
}

var follow = followLinks();
var display = follow ? 'none' : '';
document.getElementById('links').checked = follow; 
document.getElementById('processSignin').style.display = display;
document.getElementById('processSignout').style.display = display;

if (followLinks()){
    if (window.location.href.indexOf("#") >= 0){
        processSigninResponse();
    }
    else if (window.location.href.indexOf("?") >= 0){
        processSignoutResponse();
    }
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
        document.getElementById('out').innerHTML += msg + '\r\n';
        
    });
}
