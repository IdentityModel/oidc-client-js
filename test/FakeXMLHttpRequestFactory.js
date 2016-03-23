import FakeXMLHttpRequest from './FakeXMLHttpRequest';

export default class FakeXMLHttpRequestFactory {
    constructor(request){
        this.request = request || new FakeXMLHttpRequest();
    }
    
    create() {
        return this.request;
    }
}