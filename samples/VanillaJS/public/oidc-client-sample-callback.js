Oidc.Log.logger = console;
Oidc.Log.level = Oidc.Log.INFO;
new Oidc.OidcClient().processSigninResponse().then(function(response) {
    log("signin response success", response);
}).catch(function(err) {
    log(err);
});
