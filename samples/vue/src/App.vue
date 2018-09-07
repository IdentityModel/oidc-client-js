<template>
  <div id="app">
    <!--The content below is only a placeholder and can be replaced.-->
    <div style="text-align:center">
      <h1>
        Sample Vue Client
      </h1>
    </div>
    <div>
      <button @click="onLogin">Login</button>
      <button @click="onCallAPI">Call API</button>
      <button @click="onRenewToken">Renew Token</button>
      <button @click="onLogout">Logout</button>
    </div>
    <pre>{{currentUserJson}}</pre>
    <div>
      <h2>Messages</h2>
      <ul>
        <li v-for="(msg,index) in messages" :key="index">{{msg}}</li>
      </ul>
    </div>
  </div>
</template>

<script>
import authn from "./app-auth-n-service.js";
import testApi from "./test-api.service.js";
export default {
  name: "app",
  data() {
    return {
      messages: [],
      currentUser: null
    };
  },
  created() {
    authn
      .getUser()
      .then(user => {
        this.currentUser = user;

        if (user) {
          this.addMessage("User Logged In");
        } else {
          this.addMessage("User Not Logged In");
        }
      })
      .catch(err => this.addError(err));
  },
  methods: {
    onLogin() {
      this.clearMessages();
      authn.login().catch(err => {
        this.addError(err);
      });
    },
    onCallAPI() {
      testApi
        .callApi()
        .then(res => {
          console.log(res);
          this.addMessage("API Result: " + JSON.stringify(res.data));
        })
        .catch(err => {
          this.addError(err);
        });
    },
    onRenewToken() {
      this.clearMessages();
      authn
        .renewToken()
        .then(user => {
          this.currentUser = user;
          this.addMessage("Silent Renew Success");
        })
        .catch(err => this.addError(err));
    },
    onLogout() {
      this.clearMessages();
      authn.logout().catch(err => this.addError(err));
    },
    clearMessages() {
      while (this.messages.length) {
        this.messages.pop();
      }
    },
    addMessage(msg) {
      this.messages.push(msg);
    },
    addError(msg) {
      this.messages.push("Error: " + msg && msg.message);
    }
  },
  computed: {
    currentUserJson() {
      return JSON.stringify(this.currentUser, null, 2);
    }
  }
};
</script>

<style>
/* #app {
  font-family: "Avenir", Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
} */
</style>
