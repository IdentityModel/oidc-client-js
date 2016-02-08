interface OpenIdMetadata {
    authorization_endpoint: string;
    token_endpoint: string;
    token_endpoint_auth_methods_supported: string[];
    jwks_uri: string;
    response_modes_supported: string[];
    subject_types_supported: string[];
    id_token_signing_alg_values_supported: string[];
    http_logout_supported: boolean;
    response_types_supported: string[];
    scopes_supported: string[];
    issuer: string;
    claims_supported: string[];
    microsoft_multi_refresh_token: boolean;
    check_session_iframe: string;
    end_session_endpoint: string;
    userinfo_endpoint: string;
}