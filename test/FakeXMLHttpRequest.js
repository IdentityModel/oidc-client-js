export default class FakeXMLHttpRequest {
    constructor(sendCallback) {
        this.headers = new Map();
    }
    
    open(method, url) {
        this.method = method;
        this.url = url;
    }
    
    setRequestHeader(header, value){
        this.headers.set(header, value);
    }
    
    send() {
    }
}