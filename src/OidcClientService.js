export default class OidcClientService {
    constructor(settings, metadataService, authorizationResultParser) {
        this._settings = settings;
        this._metadataService = metadataService;
        this._authorizationResultParser = authorizationResultParser;
    }
}
