
Oidc.Log.logger = console;
Oidc.Log.level = Oidc.Log.DEBUG;

var rp_id = "oidc-client-js";
var response_type = 'id_token token';
var default_scope = "openid";
var authority = 'https://rp.certification.openid.net:8090/' + rp_id + '.' + response_type.replace(' ', '__') + '/';
var log_url = 'https://rp.certification.openid.net:8090/log/' + rp_id + '.' + response_type.replace(' ', '__') + '/';

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
    //rp__response_type__id_token_token();
    //rp__scope__userinfo__claims();
    //rp__nonce__unless__code__flow();
    //rp__nonce__invalid();
    //rp__id_token__aud();
    //rp__id_token__kid__absent__single__jwks();
    //rp__id_token__issuer__mismatch();
    //rp__id_token__bad__at_hash();
    //rp__id_token__kid__absent__multiple__jwks();
    //rp__id_token__bad__sig__rs256();
    //rp__id_token__iat();
    //rp__id_token__sig__rs256();
    //rp__id_token__sub();
    //rp__userinfo__bad__sub__claim();
    //rp__userinfo__bearer__header();
}

function rp__response_type__id_token_token() {
    run('rp-response_type-id_token+token');
}
function rp__scope__userinfo__claims() {
    run('rp-scope-userinfo-claims', 'openid profile email');
}
function rp__nonce__unless__code__flow() {
    run('rp-nonce-unless-code-flow');
}
function rp__nonce__invalid() {
    run('rp-nonce-invalid');
}
function rp__id_token__aud() {
    run('rp-id_token-aud');
}
function rp__id_token__kid__absent__single__jwks() {
    run('rp-id_token-kid-absent-single-jwks');
}
function rp__id_token__issuer__mismatch() {
    run('rp-id_token-issuer-mismatch');
}
function rp__id_token__bad__at_hash() {
    run('rp-id_token-bad-at_hash');
}
function rp__id_token__kid__absent__multiple__jwks() {
    run('rp-id_token-kid-absent-multiple-jwks');
}
function rp__id_token__bad__sig__rs256() {
    run('rp-id_token-bad-sig-rs256');
}
function rp__id_token__iat() {
    run('rp-id_token-iat');
}
function rp__id_token__sig__rs256() {
    run('rp-id_token-sig-rs256');
}
function rp__id_token__sub() {
    run('rp-id_token-sub');
}
function rp__userinfo__bad__sub__claim() {
    run('rp-userinfo-bad-sub-claim');
}
function rp__userinfo__bearer__header() {
    run('rp-userinfo-bearer-header');
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

