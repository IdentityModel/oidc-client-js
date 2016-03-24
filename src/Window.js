export default class Window {
    static get location(){
        return window.location;
    }
    static get localStorage() {
        return window.localStorage;
    }
    static get sessionStorage() {
        return window.sessionStorage;
    }
    static XMLHttpRequest(){
        return window.XMLHttpRequest;
    }
};
