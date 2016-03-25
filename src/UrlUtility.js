export default class UrlUtility {
    static addQueryParam(url, name, value) {
        if (url.indexOf('?') < 0){
            url += "?";
        }
        
        if (url[url.length - 1] !== "?"){
            url += "&";
        }
        
        url += encodeURIComponent(name);
        url += "=";
        url += encodeURIComponent(value);
        
        return url;
    }
}