
Oidc.Log.logger = console;
Oidc.Log.level = Oidc.Log.INFO;

var rp_id = "oidc-client-js";
var response_type = 'id_token';
var test_client_name = 'configuration';
var default_scope = "openid";
var authority = 'https://rp.certification.openid.net:8090/' + rp_id + '.' + test_client_name + '/';
var log_url = 'https://rp.certification.openid.net:8090/log/' + rp_id + '.' + test_client_name + '/';

var redirect_uri = window.location.protocol + '//' + window.location.hostname + window.location.pathname + 'callback.html';

var start_button = document.getElementById('start');
if (start_button) {
    start_button.addEventListener('click', start);
}
var log_link = document.getElementById('log_link');
if (log_link) {
    log_link.href = log_url;
}

function start() {
    //rp__discovery__jwks_uri__keys();
    //rp__discovery__issuer__not__matching__config();
    //rp__discovery__openid__configuration();
    //rp__id_token__sig__none(); // not applicable for implicit
    //rp__key__rotation__op__sign__key__native();
    //rp__key__rotation__op__sign__key(); // not applicable for implicit
}

function rp__discovery__jwks_uri__keys() {
    run('rp-discovery-jwks_uri-keys');
}
function rp__discovery__issuer__not__matching__config() {
    run('rp-discovery-issuer-not-matching-config');
}
function rp__discovery__openid__configuration() {
    run('rp-discovery-openid-configuration');
}
function rp__id_token__sig__none() {
    run('rp-id_token-sig-none');
}
function rp__key__rotation__op__sign__key__native() {
    run('rp-key-rotation-op-sign-key-native');
}
function rp__key__rotation__op__sign__key() {
    run('rp-key-rotation-op-sign-key');
}


function run(test_id, scope){
    registerClient(test_id).then(function (result) {
        log("Client Id: " + result.client_id);
        var mgr = createManager(test_id, result.client_id);
        return mgr.signinRedirect({ scope: scope || default_scope, state: response_type + ":" + test_id });
    }).catch(function(err){
        log(err);
    });
}

function createManager(test_id, client_id) {
    var settings = {
        authority: authority + test_id,
        client_id: client_id,
        redirect_uri: redirect_uri,
        response_type: response_type,
        scope: default_scope,
        filterProtocolClaims: false,
        loadUserInfo: true
    };
    var mgr = new Oidc.UserManager(settings);
    return mgr;
};

function registerClient(test_id){
    var url = authority + test_id;

    var metadataService = new Oidc.MetadataService({authority:url});
    return metadataService.getMetadata().then(function(metadata){
        var reg_url = metadata.registration_endpoint;
        return register(reg_url);
    });
}

function register(url) {
    return new Promise(function(resolve, reject){
        var req = {
            redirect_uris : [ redirect_uri ],
            application_type : "web",
            response_types: ["id_token", "id_token token"]
        };
        var xhr = new XMLHttpRequest();
        xhr.open("POST", url);
        xhr.onload = function(){
            console.log(xhr.status, xhr.responseText);
            if (xhr.status < 300){
                resolve(JSON.parse(xhr.responseText));
            }
            else {
                reject(new Error("Error calling registration endpoint. Status code: " + xhr.status));
            }
        }
        xhr.setRequestHeader('Content-Type', 'application/json');
        xhr.send(JSON.stringify(req));
    });
}

function runTest(mgr){
    mgr.signinRedirect().catch(function(err){
        log(err);
    });
}

