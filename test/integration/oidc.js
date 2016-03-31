(function() {

    var rsaKey = KEYUTIL.generateKeypair("RSA", 1024);
    var e = hextob64u(rsaKey.pubKeyObj.e.toString(16));
    var n = hextob64u(rsaKey.pubKeyObj.n.toString(16));

    var path = 'http://server/oidc';
    var metadataPath = path + '/.well-known/openid-configuration';
    var signingKeysPath = path + '/.well-known/jwks';
    var authorizationPath = path + '/connect/authorize';
    var userInfoPath = path + '/connect/userinfo';
    var endSessionPath = path + '/connect/endsession';

    var metadata = {
        issuer: path,
        jwks_uri: signingKeysPath,
        authorization_endpoint: authorizationPath,
        userinfo_endpoint: userInfoPath,
        end_session_endpoint: endSessionPath,
    };

    var keys = [
        {
            kty: "RSA",
            use: "sig",
            kid: "1",
            e: e,
            n: n
        }
    ];

    var claims = {
        "sub": "818727",
        "email": "AliceSmith@email.com",
        "email_verified": true,
        "role": ["Admin", "Geek"]
    };

    function genAccessToken() {
        return parseInt(Math.random().toString().replace("0.", "")).toString(16);
    }

    function hashAccessToken(access_token) {
        var hash = KJUR.crypto.Util.hashString(access_token, "sha256")
        var left = hash.substr(0, hash.length / 2);
        var left_b64u = hextob64u(left);
        return left_b64u;
    }

    function genIdToken(aud, nonce, access_token) {
        var now = parseInt(Date.now() / 1000);
        var payload = {
            aud: aud,
            iss: metadata.issuer,
            nonce: nonce,
            sid: genAccessToken(),
            nbf: now,
            iat: now,
            exp: now + 300,
            idp: "some_idp",
            amr: ["password"]
        };

        if (access_token) {
            payload.at_hash = hashAccessToken(access_token);
            payload.sub = claims.sub;
        }
        else {
            for (var key in claims) {
                payload[key] = claims[key];
            }
        }

        return KJUR.jws.JWS.sign(null, { alg: "RS256", kid: "1" }, payload, rsaKey.prvKeyObj);
    }

    function isOidc(response_type) {
        var result = response_type.split(/\s+/g).filter(function(item) {
            return item === "id_token";
        });
        return !!(result[0]);
    }

    function isOAuth(response_type) {
        var result = response_type.split(/\s+/g).filter(function(item) {
            return item === "token";
        });
        return !!(result[0]);
    }

    function addFragment(url, name, value) {
        if (url.indexOf('#') < 0) {
            url += "#";
        }

        if (url[url.length - 1] !== "#") {
            url += "&";
        }

        url += encodeURIComponent(name);
        url += "=";
        url += encodeURIComponent(value);

        return url;
    }

    function parseQuery(url) {

        var idx = url.lastIndexOf("?");
        if (idx >= 0) {
            url = url.substr(idx + 1);
        }

        var params = {},
            regex = /([^&=]+)=([^&]*)/g,
            m;

        var counter = 0;
        while (m = regex.exec(url)) {
            params[decodeURIComponent(m[1])] = decodeURIComponent(m[2]);
            if (counter++ > 50) {
                Log.error("response exceeded expected number of parameters", value);
                return {
                    error: "Response exceeded expected number of parameters"
                };
            }
        }

        for (var prop in params) {
            return params;
        }

        return {};
    }
    
    function processAuthorization(url) {
        var query = parseQuery(url);
        var response_type = query.response_type;

        url = query.redirect_uri;

        if (isOAuth(response_type)) {
            var access_token = genAccessToken();
            url = addFragment(url, "access_token", access_token);
            url = addFragment(url, "token_type", "Bearer");
            url = addFragment(url, "expires_in", "3600");
            url = addFragment(url, "scope", query.scope);
        }

        if (isOidc(response_type)) {
            url = addFragment(url, "id_token", genIdToken(query.client_id, query.nonce, access_token));
            url = addFragment(url, "session_state", "123");
        }

        var state = query.state;
        if (state) {
            url = addFragment(url, "state", state);
        }

        return url;
    }

    function processEndSession(url) {
        var query = parseQuery(url);
        if (query.post_logout_redirect_uri) {
            url = query.post_logout_redirect_uri;
            
            if (query.state){
                url += "?state=" + query.state;
            }
            
            return url;
        }
    }

    window.oidc = {
        metadata: metadata,
        signingKeys: keys,
        processAuthorization: processAuthorization,
        processEndSession: processEndSession
    };

})();
