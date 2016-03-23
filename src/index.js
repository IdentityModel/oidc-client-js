import XMLHttpRequestFactory from './XMLHttpRequestFactory';
import JsonService from './JsonService';
import MetadataService from './MetadataService';

import OidcClientService from './OidcClientService';

let xmlHttpRequestFactory = new XMLHttpRequestFactory();
let jsonService = new JsonService(xmlHttpRequestFactory);
let metadataService = new MetadataService(jsonService);

export default class OidcClient extends OidcClientService {
    constructor(settings) {
        super(settings, metadataService)
    }
}
