export default class OidcClientSettings {
    constructor(settings) {
        if (!settings) {
            throw new Error("settings");
        }

        if (settings.metadata){
            this._metadata = settings.metadata;
        }
        
        if (settings.authority){
            this._authority = authority;
        }
        
        // if (!this._settings.request_state_key) {
        //     this._settings.request_state_key = "OidcClient.request_state";
        // }

        // if (!this._settings.request_state_store) {
        //     this._settings.request_state_store = window.localStorage;
        // }

        // if (typeof this._settings.load_user_profile === 'undefined') {
        //     this._settings.load_user_profile = true;
        // }

        // if (typeof this._settings.filter_protocol_claims === 'undefined') {
        //     this._settings.filter_protocol_claims = true;
        // }

        // if (this._settings.authority && this._settings.authority.indexOf('.well-known/openid-configuration') < 0) {
        //     if (this._settings.authority[this._settings.authority.length - 1] !== '/') {
        //         this._settings.authority += '/';
        //     }
        //     this._settings.authority += '.well-known/openid-configuration';
        // }

        // if (!this._settings.response_type) {
        //     this._settings.response_type = "id_token token";
        // }
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
    
    get metadata(){
        return this._metadata;
    }
    set metadata(val){
        this._metadata = val;
    }
}
