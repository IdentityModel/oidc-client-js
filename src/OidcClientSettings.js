const OidcMetadataUrlPath = '.well-known/openid-configuration';

export default class OidcClientSettings {
    constructor(settings) {
        if (!settings) {
            Log.error("No settings passed to OidcClientSettings");
            throw new Error("settings");
        }

        this._authority = settings.authority;
        this._metadataUrl = settings.metadataUrl; 
        this._metadata = settings.metadata;
        this._signingKeys = settings.signingKeys;
    }
    
    get authority() {
        return this._authority;
    }

    get metadataUrl() {
        if (!this._metadataUrl) {
            this._metadataUrl = this.authority;
             
            if (this._metadataUrl && this._metadataUrl.indexOf(OidcMetadataUrlPath) < 0) {
                if (this._metadataUrl[this._metadataUrl.length - 1] !== '/') {
                    this._metadataUrl += '/';
                }
                this._metadataUrl += OidcMetadataUrlPath;
            }
        }
        
        return this._metadataUrl;
    }
    
    get metadata() {
        return this._metadata;
    }
    set metadata(value){
        this._metadata = value;
    }
    
    get signingKeys() {
        return this._signingKeys;
    }
    set signingKeys(value){
        this._signingKeys = value;
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
