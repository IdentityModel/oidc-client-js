import Log from './Log';
import XMLHttpRequestFactory from './XMLHttpRequestFactory';

export default class JsonService {
    constructor(httpRequestFactory = XMLHttpRequestFactory) {
        this._httpRequestFactory = httpRequestFactory;
    }
    
    getJson(url, token) {
        
        if (!url){
            Log.error("No url passed to getJson");
            throw new Error("url");
        }
        
        return new Promise((resolve, reject) => {
            
            var req = this._httpRequestFactory.create();

            Log.info("getJson from url", url);
            req.open('GET', url);

            req.onload = function() {
                Log.info("HTTP response received, status", req.status);
                
                if (req.status === 200) {
                    resolve(JSON.parse(req.response));
                }
                else {
                    Log.error("getJson request failed");
                    reject(Error(req.statusText + " (" + req.status + ")"));
                }
            };

            req.onerror = function() {
                Log.error("getJson failed with network error");
                reject(Error("Network Error"));
            };
            
            if (token) {
                Log.error("token passed, setting Authorization header");
                req.setRequestHeader("Authorization", "Bearer " + token);
            }

            req.send();
        });
    }
}