Oidc.Log.logger = console;
Oidc.Log.level = Oidc.Log.DEBUG;
new Oidc.UserManager({response_mode:'query'}).signinRedirectCallback().then(function(user) {
    log("signin response success", user);
}).catch(function(err) {
    log(err);
});
