import JsonService from './JsonService';
import Log from './Log';

export default class MetadataService {
    constructor(settings, JsonServiceCtor = JsonService) {
        if (!settings) {
            Log.error("No settings passed to MetadataService");
            throw new Error("settings");
        }

        this._settings = settings;
        this._jsonService = new JsonServiceCtor();
    }

    getMetadata() {
        Log.info("MetadataService.getMetadata");

        if (this._settings.metadata) {
            Log.info("Returning metadata from settings");
            return Promise.resolve(this._settings.metadata);
        }

        if (!this._settings.metadataUrl) {
            Log.error("No metadataUrl configured on settings");
            return Promise.reject(new Error("No metadataUrl configured on settings"));
        }

        Log.info("getting metadata from", this._settings.metadataUrl);

        return this._jsonService.getJson(this._settings.metadataUrl)
            .then(metadata => {
                Log.info("metadata received", metadata);
                this._settings.metadata = metadata;
                return metadata;
            }, err => {
                Log.error("MetadataService.getMetadata", err);
                throw new Error("Failed to load metadata");
            });
    }
    
    getAuthorizationUrl(){
        Log.info("MetadataService.getAuthorizationUrl");
        
        return this.getMetadata().then(metadata => {
            Log.info("metadata recieved");

            if (!metadata.authorization_endpoint) {
                Log.error("Metadata does not contain authorization_endpoint");
                throw new Error("Metadata does not contain authorization_endpoint");
            }
            
            return metadata.authorization_endpoint;
        }, err => {
            Log.error("Failed to load authorization url", err);
            throw new Error("Failed to load authorization url")
        });
    }
    
    getUserInfoUrl(){
        Log.info("MetadataService.getUserInfoUrl");
        
        return this.getMetadata().then(metadata => {
            Log.info("metadata recieved");

            if (!metadata.userinfo_endpoint) {
                Log.error("Metadata does not contain userinfo_endpoint");
                throw new Error("Metadata does not contain userinfo_endpoint");
            }
            
            return metadata.userinfo_endpoint;
        }, err => {
            Log.error("Failed to load userinfo url", err);
            throw new Error("Failed to load userinfo url")
        });
    }
    
    getSigningKeys() {
        Log.info("MetadataService.getSigningKeys");

        if (this._settings.signingKeys) {
            Log.info("Returning signingKeys from settings");
            return Promise.resolve(this._settings.signingKeys);
        }

        return this.getMetadata().then(metadata => {
            Log.info("Metadata received", metadata);
            
            if (!metadata.jwks_uri) {
                Log.error("Metadata does not contain jwks_uri");
                throw new Error("Metadata does not contain jwks_uri");
            }
            
            Log.info("getting keys from", metadata.jwks_uri);

            return this._jsonService.getJson(metadata.jwks_uri).then(keySet => {
                Log.info("key set received", keySet);
                
                if (!keySet.keys){
                    Log.error("Missing keys on keyset");
                    throw new Error("Missing keys on keyset");
                }
                
                this._settings.signingKeys = keySet.keys;
                return this._settings.signingKeys;
            });
        }, err => {
            Log.error("Failed to load signing keys", err);
            throw new Error("Failed to load signing keys");
        });
    }
}
