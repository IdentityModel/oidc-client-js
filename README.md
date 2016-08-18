# oidc-client

Library to provide OpenID Connect (OIDC) and OAuth2 protocol support for client-side, browser-based JavaScript client applications. 
Also included is support for user session and access token management.

## Install

##### Node.js

Node.js v4.4 or later required.

##### NPM

`npm install oidc-client --save`

**NOTE**: if you're not already using [babel-polyfill](https://www.npmjs.com/package/babel-polyfill) make sure you run
`npm install --save babel-polyfill` as well. Then include it in your build.

##### CommonJS
If you don't use a package manager or a module loader, then you can get the library from the `dist` folder on github [here](dist).

## Including in the browser

If you intend to use this library directly in a browser and are not using UMD/AMD then there is a compiled version in the [~/dist](dist) folder. 
It is already bundled/minified and contains the necessary dependencies and polyfills (mainly for ES6 features such as Promises).

If you are using UMD/AMD and/or you already have included an ES6 polyfill (such as babel-polyfill.js) then you can include the UMD packaged version of the file from the [~/lib](lib) folder.

## Building the Source

```
git clone https://github.com/IdentityModel/oidc-client-js.git
cd oidc-client-js
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

## Feedback, Feature requests, and Bugs

All are welcome on the [issue tracker](https://github.com/IdentityModel/oidc-client-js/issues).
