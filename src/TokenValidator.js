import Log from './Log';

export default class TokenValidator {
    
//     OidcClient.prototype.validateIdTokenAsync = function (id_token, nonce, access_token) {
//     log("OidcClient.validateIdTokenAsync");

//     var client = this;
//     var settings = client._settings;

//     return client.loadX509SigningKeyAsync().then(function (cert) {

//         var jws = new KJUR.jws.JWS();
//         if (jws.verifyJWSByPemX509Cert(id_token, cert)) {
//             var id_token_contents = JSON.parse(jws.parsedJWS.payloadS);

//             if (nonce !== id_token_contents.nonce) {
//                 return error("Invalid nonce");
//             }

//             return client.loadMetadataAsync().then(function (metadata) {

//                 if (id_token_contents.iss !== metadata.issuer) {
//                     return error("Invalid issuer");
//                 }

//                 if (id_token_contents.aud !== settings.client_id) {
//                     return error("Invalid audience");
//                 }

//                 var now = parseInt(Date.now() / 1000);

//                 // accept tokens issues up to 5 mins ago
//                 var diff = now - id_token_contents.iat;
//                 if (diff > (5 * 60)) {
//                     return error("Token issued too long ago");
//                 }

//                 if (id_token_contents.exp < now) {
//                     return error("Token expired");
//                 }

//                 if (access_token && settings.load_user_profile) {
//                     // if we have an access token, then call user info endpoint
//                     return client.loadUserProfile(access_token, id_token_contents).then(function (profile) {
//                         return copy(profile, id_token_contents);
//                     });
//                 }
//                 else {
//                     // no access token, so we have all our claims
//                     return id_token_contents;
//                 }

//             });
//         }
//         else {
//             return error("JWT failed to validate");
//         }

//     });

// };

// OidcClient.prototype.validateAccessTokenAsync = function (id_token_contents, access_token) {
//     log("OidcClient.validateAccessTokenAsync");

//     if (!id_token_contents.at_hash) {
//         return error("No at_hash in id_token");
//     }

//     var hash = KJUR.crypto.Util.sha256(access_token);
//     var left = hash.substr(0, hash.length / 2);
//     var left_b64u = hextob64u(left);

//     if (left_b64u !== id_token_contents.at_hash) {
//         return error("at_hash failed to validate");
//     }

//     return resolve();
// };

// OidcClient.prototype.validateIdTokenAndAccessTokenAsync = function (id_token, nonce, access_token) {
//     log("OidcClient.validateIdTokenAndAccessTokenAsync");

//     var client = this;

//     return client.validateIdTokenAsync(id_token, nonce, access_token).then(function (id_token_contents) {

//         return client.validateAccessTokenAsync(id_token_contents, access_token).then(function () {

//             return id_token_contents;

//         });

//     });
// }
}