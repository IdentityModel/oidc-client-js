import Window from './Window';

export default class XMLHttpRequestFactory {
    constructor(window){
        this._window = window || Window;
    }
    
    create() {
        return new this._window.XMLHttpRequest();
    }
}
