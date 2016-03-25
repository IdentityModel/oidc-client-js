import Log from './Log';
import Window from './Window';

export default class JsonService {
    constructor(XMLHttpRequestCtor = Window.XMLHttpRequest) {
        this._XMLHttpRequest = XMLHttpRequestCtor;
    }
    
    getJson(url, token) {
        Log.info("JsonService.getJson", url);
        
        if (!url){
            Log.error("No url passed");
            throw new Error("url");
        }
        
        return new Promise((resolve, reject) => {
            
            var req = new this._XMLHttpRequest();
            req.open('GET', url);

            req.onload = function() {
                Log.info("HTTP response received, status", req.status);
                
                if (req.status === 200) {
                    resolve(JSON.parse(req.response));
                }
                else {
                    reject(Error(req.statusText + " (" + req.status + ")"));
                }
            };

            req.onerror = function() {
                Log.error("network error");
                reject(Error("Network Error"));
            };
            
            if (token) {
                Log.info("token passed, setting Authorization header");
                req.setRequestHeader("Authorization", "Bearer " + token);
            }

            req.send();
        });
    }
}