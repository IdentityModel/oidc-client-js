import JsonService from './JsonService';
import Log from './Log';

export default class MetadataService {
    constructor(settings, jsonService = new JsonService()) {
        
        if (!settings){
            throw new Error("settings");
        }
        
        this._settings = settings;
        this._jsonService = jsonService;
    }

    getMetadata() {
        Log.info("MetadataService.getMetadata");
        
        if (this._settings.metadata) {
            return Promise.resolve(this._settings.metadata);
        }
        
        if (!this._settings.metadataUrl) {
            return Promise.reject(new Error("No metadataUrl configured"));
        }
        
        return this._jsonService.getJson(this._settings.metadataUrl)
            .then(metadata => {
                this._settings.metadata = metadata;
                return metadata;
            }, err => {
                Log.error("MetadataService.getMetadata", err);
                throw new Error("Failed to load metadata");
            });
    }
    
    // getKeys() {
    //     log("OidcClient.loadX509SigningKeyAsync");

    //     var settings = this._settings;

    //     function getKeyAsync(jwks) {
    //         if (!jwks.keys || !jwks.keys.length) {
    //             return error("Signing keys empty");
    //         }

    //         var key = jwks.keys[0];
    //         if (key.kty !== "RSA") {
    //             return error("Signing key not RSA");
    //         }

    //         if (!key.x5c || !key.x5c.length) {
    //             return error("RSA keys empty");
    //         }

    //         return resolve(key.x5c[0]);
    //     }

    //     if (settings.jwks) {
    //         return getKeyAsync(settings.jwks);
    //     }

    //     return this.loadMetadataAsync().then(function (metadata) {
    //         if (!metadata.jwks_uri) {
    //             return error("Metadata does not contain jwks_uri");
    //         }

    //         return getJson(metadata.jwks_uri).then(function (jwks) {
    //             settings.jwks = jwks;
    //             return getKeyAsync(jwks);
    //         }, function (err) {
    //             return error("Failed to load signing keys (" + err && err.message + ")");
    //         });
    //     });
    // };

    // getAuthorizationEndpoint() {
    //     log("OidcClient.loadAuthorizationEndpoint");

    //     if (this._settings.authorization_endpoint) {
    //         return resolve(this._settings.authorization_endpoint);
    //     }

    //     if (!this._settings.authority) {
    //         return error("No authorization_endpoint configured");
    //     }

    //     return this.loadMetadataAsync().then(function (metadata) {
    //         if (!metadata.authorization_endpoint) {
    //             return error("Metadata does not contain authorization_endpoint");
    //         }

    //         return metadata.authorization_endpoint;
    //     });
    // };
}
