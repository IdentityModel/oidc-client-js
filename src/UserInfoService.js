import JsonService from './JsonService';
import MetadataService from './MetadataService';
import Log from './Log';

export default class UserInfoService{
    constructor(settings, JsonServiceCtor = JsonService, MetadataServiceCtor = MetadataService) {
        if (!settings) {
            Log.error("No settings passed to UserInfoService");
            throw new Error("settings");
        }

        this._settings = settings;
        this._jsonService = new JsonServiceCtor();
        this._metadataService = new MetadataServiceCtor(this._settings);
    }
    
    getUserInfo(){
        return Promise.resolve();
    }
}
