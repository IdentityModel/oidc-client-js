import { Component, OnInit } from '@angular/core';
import { AppAuthNService, User } from './app-auth-n.service';
import { TestApiService } from './test-api.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  constructor(public authn: AppAuthNService, public apiService: TestApiService) {
  }

  messages: string[] = [];
  get currentUserJson() : string {
    return JSON.stringify(this.currentUser, null, 2);
  }
  currentUser : User;

  ngOnInit(): void {
    this.authn.getUser().then(user => {
      this.currentUser = user;

      if (user){
        this.addMessage("User Logged In");
      }
      else {
        this.addMessage("User Not Logged In");
      }
    }).catch(err => this.addError(err));
  }

  clearMessages() {
    while (this.messages.length) {
      this.messages.pop();
    }
  }
  addMessage(msg: string) {
    this.messages.push(msg);
  }
  addError(msg: string | any) {
    this.messages.push("Error: " + msg && msg.message);
  }

  public onLogin() {
    this.clearMessages();
    this.authn.login().catch(err => {
      this.addError(err);
    });
  }

  public onCallAPI() {
    this.clearMessages();
    this.apiService.callApi().then(result => {
      this.addMessage("API Result: " + JSON.stringify(result));
    }, err => this.addError(err));
  }

  public onRenewToken() {
    this.clearMessages();
    this.authn.renewToken()
      .then(user=>{
        this.currentUser = user;
        this.addMessage("Silent Renew Success");
      })
      .catch(err => this.addError(err));
  }

  public onLogout() {
    this.clearMessages();
    this.authn.logout().catch(err => this.addError(err));
  }
}
