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
    
    getAuthorizationEndpoint(){
        Log.info("MetadataService.getAuthorizationEndpoint");
        return this.getMetadataProperty("authorization_endpoint");
    }
    
    getUserInfoEndpoint(){
        Log.info("MetadataService.getUserInfoEndpoint");
        return this.getMetadataProperty("userinfo_endpoint");
    }
    
    getEndSessionEndpoint(){
        Log.info("MetadataService.getEndSessionEndpoint");
        return this.getMetadataProperty("end_session_endpoint");
    }
    
    getMetadataProperty(name){
        Log.info("MetadataService.getMetadataProperty", name);
        
        return this.getMetadata().then(metadata => {
            Log.info("metadata recieved");

            if (metadata[name] === undefined) {
                Log.error("Metadata does not contain property " + name);
                throw new Error("Metadata does not contain property " + name);
            }
            
            return metadata[name];
        }, err => {
            Log.error("Failed to load metadata property " + name, err);
            throw new Error("Failed to load metadata property " + name)
        });
    }
    
    getSigningKeys() {
        Log.info("MetadataService.getSigningKeys");

        if (this._settings.signingKeys) {
            Log.info("Returning signingKeys from settings");
            return Promise.resolve(this._settings.signingKeys);
        }

        return this.getMetadataProperty("jwks_uri").then(jwks_uri => {
            Log.info("jwks_uri received", jwks_uri);

            return this._jsonService.getJson(jwks_uri).then(keySet => {
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
