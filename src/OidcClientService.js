export default class OidcClientService {
    constructor(settings, metadataService) {
        this._setting = settings;
        this._metadataService = metadataService;
    }
}
