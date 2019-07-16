Oidc.Log.logger = console;
Oidc.Log.level = Oidc.Log.INFO;
new Oidc.UserManager({response_mode:'query'}).signinCallback();
