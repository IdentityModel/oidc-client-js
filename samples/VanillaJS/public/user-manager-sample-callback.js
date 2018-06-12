Oidc.Log.logger = console;
Oidc.Log.level = Oidc.Log.INFO;
new Oidc.UserManager().signinRedirectCallback().then(function(user) {
    log("signin response success", user);
}).catch(function(err) {
    log(err);
});
