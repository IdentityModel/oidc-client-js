import axios from "axios";
import Constants from "./constants";
import authn from "./app-auth-n-service";

const _lf = {
  customAxios(token) {
    axios.interceptors.response.use(
      res => {
        return res;
      },
      err => {
        if (err.response.status === 401) {
          return authn.renewToken().then(user => {
            return this._callApi(user.access_token);
          });
        } else {
          Promise.reject(err);
        }
      }
    );
    axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    axios.defaults.baseURL = Constants.apiRoot;
    return axios;
  },
  _callApi(token) {
    return this.customAxios(token).get("test");
  }
};

export default {
  callApi() {
    return authn.getUser().then(user => {
      if (user && user.access_token) {
        return _lf._callApi(user.access_token);
      } else if (user) {
        return authn.renewToken().then(user => {
          return _lf._callApi(user.access_token);
        });
      } else {
        throw new Error("user is not logged in");
      }
    });
  }
};
