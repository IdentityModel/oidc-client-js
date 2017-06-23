import { jws, KEYUTIL as KeyUtil, X509, crypto, hextob64u } from 'jsrsasign';

const AllowedSigningAlgs = ['RS256', 'RS384', 'RS512', 'PS256', 'PS384', 'PS512', 'ES256', 'ES384', 'ES512'];


export default {
  jws,
  KeyUtil,
  X509,
  crypto,
  hextob64u,
  AllowedSigningAlgs
};
