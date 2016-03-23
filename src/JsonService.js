import XMLHttpRequestFactory from './XMLHttpRequestFactory';

export default class JsonService {
    constructor(httpRequestFactory) {
        this._httpRequestFactory = httpRequestFactory || XMLHttpRequestFactory;
    }
    
    getJson(url, token) {
        
        if (!url){
            throw new Error("url");
        }
        
        return new Promise((resolve, reject) => {
            
            var req = this._httpRequestFactory.create();
            req.open('GET', url);

            req.onload = function() {
                if (req.status === 200) {
                    resolve(JSON.parse(req.response));
                }
                else {
                    reject(Error(req.statusText + " (" + req.status + ")"));
                }
            };

            req.onerror = function() {
                reject(Error("Network Error"));
            };
            
            if (token) {
                req.setRequestHeader("Authorization", "Bearer " + token);
            }

            req.send();
        });
    }
}