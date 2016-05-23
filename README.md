# oidc-client

Library to provide OpenID Connect (OIDC) and OAuth2 protocol support for client-side, browser-based JavaScript client applications. 
Also included is support for user session and access token management.

## Install

Use **npm**

`npm install oidc-client --save`

If you don't use a package manager, then you can get the library from the `dist` folder on github [here](dist/oidc-client.js).

## Building the Source

```
git clone https://github.com/IdentityModel/oidc-client-js.git
cd oidc-client
npm install
npm run build
```

## Running the Sample

`npm start`

and then browse to [http://localhost:5000](http://localhost:5000).

## Running the Tests

`npm test`

## Docs

Some initial docs are [here](https://github.com/IdentityModel/oidc-client-js/wiki).

## Including the library

If you intend to use this library directly in a browser and are not using UMD/AMD then there is a compiled version in the ~/dist folder. 
It is already bundled/minified and contains the necessary dependencies and polyfills (mainly for ES6 features such as Promises).

If you are using UMD/AMD and/or you already have included an ES6 polyfill (such as babel-polyfill.js) then you can include the UMD packaged version of the file from the ~/lib folder.

## Feedback, Feature requests, and Bugs

All are welcome on the [issue tracker](https://github.com/IdentityModel/oidc-client-js/issues).
