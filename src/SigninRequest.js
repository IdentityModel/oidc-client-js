export default class SigninRequest {
    constructor(settings){
        this._settings = settings;
    }
    
    // get isOidc() {
    //     if (this._settings.response_type) {
    //         var result = this._settings.response_type.split(/\s+/g).filter(function(item) {
    //             return item === "id_token";
    //         });
    //         return !!(result[0]);
    //     }
    //     return false;
    // }

    // get isOAuth() {
    //     if (this._settings.response_type) {
    //         var result = this._settings.response_type.split(/\s+/g).filter(function(item) {
    //             return item === "token";
    //         });
    //         return !!(result[0]);
    //     }
    //     return false;
    // }
}