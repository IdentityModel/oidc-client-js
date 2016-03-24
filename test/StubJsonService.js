export default class StubJsonService {
    getJson(url, token) {
        this.url = url;
        this.token = token;
        return this.result;
    }
}
