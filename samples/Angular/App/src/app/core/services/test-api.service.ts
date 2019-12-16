import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

import { HttpClient, HttpErrorResponse, HttpHeaders, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { AuthService, User } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class TestApiService {

  constructor(private httpClient: HttpClient, private authService: AuthService) {
  }

  public callApi(): Promise<any> {
    return this.authService.getUser().then((user: User) => {
      if (user && user.access_token) {
        return this._callApi(user.access_token);
      } else if (user) {
        return this.authService.renewToken().then((user: User) => {
          return this._callApi(user.access_token);
        });
      } else {
        throw new Error('user is not logged in');
      }
    });
  }

  _callApi(token: string) {
    const headers = new HttpHeaders({
      Accept: 'application/json',
      Authorization: 'Bearer ' + token
    });

    return this.httpClient.get(environment.apiRoot + 'test', { headers })
      .toPromise()
      .catch((result: HttpErrorResponse) => {
        if (result.status === 401) {
          return this.authService.renewToken().then(user => {
            return this._callApi(user.access_token);
          });
        }
        throw result;
      });
  }
}
