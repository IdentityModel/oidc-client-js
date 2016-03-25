import Log from './Log';

const OidcMetadataUrlPath = '.well-known/openid-configuration';
const DefaultResponseType = "id_token";
const DefaultScope = "openid";

export default class OidcClientSettings {
    constructor({
        // metadata related
        authority, metadataUrl, metadata, signingKeys, 
        // client related
        client_id, response_type = DefaultResponseType, scope = DefaultScope, 
        redirect_uri, post_logout_redirect_uri,
        // behavior flags
        filterProtocolClaims = true
    }) {
        if (!client_id) {
            Log.error("No client_id on settings passed to OidcClientSettings");
            throw new Error("client_id");
        }

        this._authority = authority;
        this._metadataUrl = metadataUrl;
        this._metadata = metadata;
        this._signingKeys = signingKeys;

        this._client_id = client_id;
        this._response_type = response_type;
        this._scope = scope;
        this._redirect_uri = redirect_uri;
        this._post_logout_redirect_uri = post_logout_redirect_uri;

        this._filterProtocolClaims = !!filterProtocolClaims;
    }

    // config values
    // client
    get client_id() {
        return this._client_id;
    }
    get response_type() {
        return this._response_type;
    }
    get scope() {
        return this._scope;
    }
    get redirect_uri() {
        return this._redirect_uri;
    }
    get post_logout_redirect_uri() {
        return this._post_logout_redirect_uri;
    }
    
    // metadata
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
    
    // behavior
    get filterProtocolClaims() {
        return this._filterProtocolClaims;
    }
    
    // settable/cachable values
    get metadata() {
        return this._metadata;
    }
    set metadata(value) {
        this._metadata = value;
    }

    get signingKeys() {
        return this._signingKeys;
    }
    set signingKeys(value) {
        this._signingKeys = value;
    }
}
