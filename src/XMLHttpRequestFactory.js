import Window from './Window';

export default class XMLHttpRequestFactory {
    constructor(window = Window){
        this._window = window;
    }
    
    create() {
        return new this._window.XMLHttpRequest();
    }
}
