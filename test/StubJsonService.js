export default class StubJsonService {
    getJson(url) {
        this.url = url;
        return this.result;
    }
}
