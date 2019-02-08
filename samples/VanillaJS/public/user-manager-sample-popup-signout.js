Oidc.Log.logger = console;
Oidc.Log.level = Oidc.Log.INFO;
// true param will keep popup window open
new Oidc.UserManager().signoutPopupCallback(true);
