import { UserManager } from "oidc-client";
import Constants from "./constants";

const settings = {
  authority: Constants.stsAuthority,
  client_id: Constants.clientId,
  redirect_uri: `${Constants.clientRoot}signin-callback.html`,
  silent_redirect_uri: `${Constants.clientRoot}silent-callback.html`,
  post_logout_redirect_uri: `${Constants.clientRoot}`,
  response_type: "id_token token",
  scope: Constants.clientScope
};

const _userManager = new UserManager(settings);

export default {
  getUser() {
    return _userManager.getUser();
  },

  login() {
    return _userManager.signinRedirect();
  },

  renewToken() {
    return _userManager.signinSilent();
  },

  logout() {
    return _userManager.signoutRedirect();
  }
};
