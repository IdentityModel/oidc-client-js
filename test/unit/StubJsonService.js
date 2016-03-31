import Log from '../../src/Log';

export default class StubJsonService {
    getJson(url, token) {
        Log.info("StubJsonService.getJson", this.result);
        
        this.url = url;
        this.token = token;
        return this.result;
    }
}
