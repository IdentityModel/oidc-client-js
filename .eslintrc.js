module.exports = {
    extends: "eslint:recommended",
    parserOptions: {
        ecmaVersion: 6,
        sourceType: "module",
    },
    globals: {
        Promise: true,
        cordova: true,
    },
    env: {
        browser: true,
        node: true
    }
}
