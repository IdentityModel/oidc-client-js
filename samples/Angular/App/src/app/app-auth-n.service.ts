import { User, UserManager, UserManagerSettings } from 'oidc-client';
import { environment } from 'src/environments/environment';

import { Injectable } from '@angular/core';

export { User };

@Injectable({
  providedIn: 'root'
})
export class AppAuthNService {

  _userManager: UserManager;

  constructor() {
    var settings = {
      authority: environment.stsAuthority,
      client_id: environment.clientId,
      redirect_uri: `${environment.clientRoot}assets/signin-callback.html`,
      silent_redirect_uri: `${environment.clientRoot}assets/silent-callback.html`,
      post_logout_redirect_uri: `${environment.clientRoot}`,
      response_type: 'id_token token',
      scope: environment.clientScope
    };
    this._userManager = new UserManager(settings);
  }

  public getUser(): Promise<User> {
    return this._userManager.getUser();
  }

  public login(): Promise<void> {
    return this._userManager.signinRedirect();
  }

  public renewToken(): Promise<User> {
    return this._userManager.signinSilent();
  }

  public logout(): Promise<void> {
    return this._userManager.signoutRedirect();
  }
}
