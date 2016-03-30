(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory();
	else if(typeof define === 'function' && define.amd)
		define([], factory);
	else if(typeof exports === 'object')
		exports["IdentityModel"] = factory();
	else
		root["IdentityModel"] = factory();
})(this, function() {
return /******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	    value: true
	});
	exports.InMemoryWebStorage = exports.WebStorageStateStore = exports.OidcClient = undefined;

	var _OidcClient = __webpack_require__(1);

	var _OidcClient2 = _interopRequireDefault(_OidcClient);

	var _WebStorageStateStore = __webpack_require__(15);

	var _WebStorageStateStore2 = _interopRequireDefault(_WebStorageStateStore);

	var _InMemoryWebStorage = __webpack_require__(19);

	var _InMemoryWebStorage2 = _interopRequireDefault(_InMemoryWebStorage);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	exports.OidcClient = _OidcClient2.default;
	exports.WebStorageStateStore = _WebStorageStateStore2.default;
	exports.InMemoryWebStorage = _InMemoryWebStorage2.default;

/***/ },
/* 1 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	    value: true
	});

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

	var _Log = __webpack_require__(2);

	var _Log2 = _interopRequireDefault(_Log);

	var _OidcClientSettings = __webpack_require__(3);

	var _OidcClientSettings2 = _interopRequireDefault(_OidcClientSettings);

	var _MetadataService = __webpack_require__(4);

	var _MetadataService2 = _interopRequireDefault(_MetadataService);

	var _SigninRequest = __webpack_require__(7);

	var _SigninRequest2 = _interopRequireDefault(_SigninRequest);

	var _SigninResponse = __webpack_require__(11);

	var _SigninResponse2 = _interopRequireDefault(_SigninResponse);

	var _SignoutRequest = __webpack_require__(13);

	var _SignoutRequest2 = _interopRequireDefault(_SignoutRequest);

	var _SignoutResponse = __webpack_require__(14);

	var _SignoutResponse2 = _interopRequireDefault(_SignoutResponse);

	var _WebStorageStateStore = __webpack_require__(15);

	var _WebStorageStateStore2 = _interopRequireDefault(_WebStorageStateStore);

	var _ResponseValidator = __webpack_require__(16);

	var _ResponseValidator2 = _interopRequireDefault(_ResponseValidator);

	var _State = __webpack_require__(9);

	var _State2 = _interopRequireDefault(_State);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	var OidcClient = function () {
	    _createClass(OidcClient, null, [{
	        key: 'logger',

	        // logging
	        get: function get() {
	            return _Log2.default.logger;
	        },
	        set: function set(value) {
	            _Log2.default.logger = value;
	        }
	    }, {
	        key: 'logLevel',
	        get: function get() {
	            return _Log2.default.level;
	        },
	        set: function set(value) {
	            if (typeof value === 'string') {
	                _Log2.default.level = _Log2.default[value];
	            } else {
	                _Log2.default.level = value;
	            }
	        }
	    }]);

	    function OidcClient(settings) {
	        var stateStore = arguments.length <= 1 || arguments[1] === undefined ? new _WebStorageStateStore2.default() : arguments[1];
	        var ResponseValidatorCtor = arguments.length <= 2 || arguments[2] === undefined ? _ResponseValidator2.default : arguments[2];
	        var MetadataServiceCtor = arguments.length <= 3 || arguments[3] === undefined ? _MetadataService2.default : arguments[3];

	        _classCallCheck(this, OidcClient);

	        if (!settings) {
	            _Log2.default.error("No settings passed to OidcClient");
	            throw new Error("settings");
	        }

	        this._settings = new _OidcClientSettings2.default(settings);
	        this._stateStore = stateStore;
	        this._validator = new ResponseValidatorCtor(this._settings);
	        this._metadataService = new MetadataServiceCtor(this._settings);
	    }

	    _createClass(OidcClient, [{
	        key: 'createSigninRequest',
	        value: function createSigninRequest() {
	            var _this = this;

	            var _ref = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];

	            var response_type = _ref.response_type;
	            var scope = _ref.scope;
	            var redirect_uri = _ref.redirect_uri;
	            var data = _ref.data;
	            var prompt = _ref.prompt;
	            var display = _ref.display;
	            var max_age = _ref.max_age;
	            var ui_locales = _ref.ui_locales;
	            var id_token_hint = _ref.id_token_hint;
	            var login_hint = _ref.login_hint;
	            var acr_values = _ref.acr_values;

	            _Log2.default.info("OidcClient.createSigninRequest");

	            var client_id = this._settings.client_id;
	            response_type = response_type || this._settings.response_type;
	            scope = scope || this._settings.scope;
	            redirect_uri = redirect_uri || this._settings.redirect_uri;

	            // id_token_hint, login_hint aren't allowed on _settings
	            prompt = prompt || this._settings.prompt;
	            display = display || this._settings.display;
	            max_age = max_age || this._settings.max_age;
	            ui_locales = ui_locales || this._settings.ui_locales;
	            acr_values = acr_values || this._settings.acr_values;

	            return this._metadataService.getAuthorizationEndpoint().then(function (url) {
	                _Log2.default.info("Received authorization endpoint", url);

	                var request = new _SigninRequest2.default({ url: url,
	                    client_id: client_id,
	                    redirect_uri: redirect_uri,
	                    response_type: response_type,
	                    scope: scope,
	                    data: data,
	                    prompt: prompt, display: display, max_age: max_age, ui_locales: ui_locales, id_token_hint: id_token_hint, login_hint: login_hint, acr_values: acr_values
	                });

	                var state = request.state;
	                _this._stateStore.set(state.id, state.toStorageString());

	                return request;
	            });
	        }
	    }, {
	        key: 'processSigninResponse',
	        value: function processSigninResponse(url) {
	            var _this2 = this;

	            _Log2.default.info("OidcClient.processSigninResponse");

	            var response = new _SigninResponse2.default(url);
	            if (!response.state) {
	                _Log2.default.error("No state in response");
	                return Promise.reject(new Error("No state in response"));
	            }

	            var stateKey = response.state;

	            return this._stateStore.remove(stateKey).then(function (storedStateString) {
	                if (!storedStateString) {
	                    _Log2.default.error("No matching state found in storage");
	                    throw new Error("No matching state found in storage");
	                }

	                var state = _State2.default.fromStorageString(storedStateString);

	                _Log2.default.info("Received state from storage; validating response");
	                return _this2._validator.validateSigninResponse(state, response);
	            });
	        }
	    }, {
	        key: 'createSignoutRequest',
	        value: function createSignoutRequest() {
	            var _this3 = this;

	            var _ref2 = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];

	            var id_token_hint = _ref2.id_token_hint;
	            var data = _ref2.data;
	            var post_logout_redirect_uri = _ref2.post_logout_redirect_uri;

	            _Log2.default.info("OidcClient.createSignoutRequest");

	            post_logout_redirect_uri = post_logout_redirect_uri || this._settings.post_logout_redirect_uri;

	            return this._metadataService.getEndSessionEndpoint().then(function (url) {
	                _Log2.default.info("Received end session endpoint", url);

	                var request = new _SignoutRequest2.default({ url: url,
	                    id_token_hint: id_token_hint,
	                    post_logout_redirect_uri: post_logout_redirect_uri,
	                    data: data
	                });

	                var state = request.state;
	                _this3._stateStore.set(state.id, state.toStorageString());

	                return request;
	            });
	        }
	    }, {
	        key: 'processSignoutResponse',
	        value: function processSignoutResponse(url) {
	            var _this4 = this;

	            _Log2.default.info("OidcClient.processSignoutResponse");

	            var response = new _SignoutResponse2.default(url);
	            if (!response.state) {
	                _Log2.default.error("No state in response");
	                return Promise.reject(new Error("No state in response"));
	            }

	            var stateKey = response.state;

	            return this._stateStore.remove(stateKey).then(function (storedStateString) {
	                if (!storedStateString) {
	                    _Log2.default.error("No matching state found in storage");
	                    throw new Error("No matching state found in storage");
	                }

	                var state = _State2.default.fromStorageString(storedStateString);

	                _Log2.default.info("Received state from storage; validating response");
	                return _this4._validator.validateSignoutResponse(state, response);
	            });
	        }
	    }, {
	        key: 'settings',
	        get: function get() {
	            return this._settings;
	        }
	    }]);

	    return OidcClient;
	}();

	exports.default = OidcClient;
	module.exports = exports['default'];

/***/ },
/* 2 */
/***/ function(module, exports) {

	"use strict";

	Object.defineProperty(exports, "__esModule", {
	    value: true
	});

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	var nopLogger = {
	    info: function info() {},
	    warn: function warn() {},
	    error: function error() {}
	};

	var NONE = 0;
	var ERROR = 1;
	var WARN = 2;
	var INFO = 3;

	var logger = void 0;
	var level = void 0;

	var Log = function () {
	    function Log() {
	        _classCallCheck(this, Log);
	    }

	    _createClass(Log, null, [{
	        key: "reset",
	        value: function reset() {
	            level = INFO;
	            logger = nopLogger;
	        }
	    }, {
	        key: "info",
	        value: function info() {
	            if (level >= INFO) {
	                for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
	                    args[_key] = arguments[_key];
	                }

	                logger.info.apply(logger, Array.from(args));
	            }
	        }
	    }, {
	        key: "warn",
	        value: function warn() {
	            if (level >= WARN) {
	                for (var _len2 = arguments.length, args = Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
	                    args[_key2] = arguments[_key2];
	                }

	                logger.warn.apply(logger, Array.from(args));
	            }
	        }
	    }, {
	        key: "error",
	        value: function error() {
	            if (level >= ERROR) {
	                for (var _len3 = arguments.length, args = Array(_len3), _key3 = 0; _key3 < _len3; _key3++) {
	                    args[_key3] = arguments[_key3];
	                }

	                logger.error.apply(logger, Array.from(args));
	            }
	        }
	    }, {
	        key: "NONE",
	        get: function get() {
	            return NONE;
	        }
	    }, {
	        key: "ERROR",
	        get: function get() {
	            return ERROR;
	        }
	    }, {
	        key: "WARN",
	        get: function get() {
	            return WARN;
	        }
	    }, {
	        key: "INFO",
	        get: function get() {
	            return INFO;
	        }
	    }, {
	        key: "level",
	        get: function get() {
	            return level;
	        },
	        set: function set(value) {
	            if (NONE <= value && value <= INFO) {
	                level = value;
	            } else {
	                throw new Error("Invalid log level");
	            }
	        }
	    }, {
	        key: "logger",
	        get: function get() {
	            return logger;
	        },
	        set: function set(value) {
	            if (value.info && value.warn && value.error) {
	                logger = value;
	            } else {
	                throw new Error("Invalid logger");
	            }
	        }
	    }]);

	    return Log;
	}();

	exports.default = Log;


	Log.reset();
	module.exports = exports['default'];

/***/ },
/* 3 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	    value: true
	});

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

	var _Log = __webpack_require__(2);

	var _Log2 = _interopRequireDefault(_Log);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	var OidcMetadataUrlPath = '.well-known/openid-configuration';
	var DefaultResponseType = "id_token";
	var DefaultScope = "openid";

	var OidcClientSettings = function () {
	    function OidcClientSettings(_ref) {
	        var
	        // metadata related
	        authority = _ref.authority;
	        var metadataUrl = _ref.metadataUrl;
	        var metadata = _ref.metadata;
	        var signingKeys = _ref.signingKeys;
	        var
	        // client related
	        client_id = _ref.client_id;
	        var _ref$response_type = _ref.response_type;
	        var response_type = _ref$response_type === undefined ? DefaultResponseType : _ref$response_type;
	        var _ref$scope = _ref.scope;
	        var scope = _ref$scope === undefined ? DefaultScope : _ref$scope;
	        var redirect_uri = _ref.redirect_uri;
	        var post_logout_redirect_uri = _ref.post_logout_redirect_uri;
	        var
	        // optional protocol
	        prompt = _ref.prompt;
	        var display = _ref.display;
	        var max_age = _ref.max_age;
	        var ui_locales = _ref.ui_locales;
	        var acr_values = _ref.acr_values;
	        var _ref$filterProtocolCl = _ref.filterProtocolClaims;
	        var
	        // behavior flags
	        filterProtocolClaims = _ref$filterProtocolCl === undefined ? true : _ref$filterProtocolCl;
	        var _ref$loadUserInfo = _ref.loadUserInfo;
	        var loadUserInfo = _ref$loadUserInfo === undefined ? true : _ref$loadUserInfo;

	        _classCallCheck(this, OidcClientSettings);

	        if (!client_id) {
	            _Log2.default.error("No client_id on settings passed to OidcClientSettings");
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

	        this._prompt = prompt;
	        this._display = display;
	        this._max_age = max_age;
	        this._ui_locales = ui_locales;
	        this._acr_values = acr_values;

	        this._filterProtocolClaims = !!filterProtocolClaims;
	        this._loadUserInfo = !!loadUserInfo;
	    }

	    // client config


	    _createClass(OidcClientSettings, [{
	        key: 'client_id',
	        get: function get() {
	            return this._client_id;
	        }
	    }, {
	        key: 'response_type',
	        get: function get() {
	            return this._response_type;
	        }
	    }, {
	        key: 'scope',
	        get: function get() {
	            return this._scope;
	        }
	    }, {
	        key: 'redirect_uri',
	        get: function get() {
	            return this._redirect_uri;
	        }
	    }, {
	        key: 'post_logout_redirect_uri',
	        get: function get() {
	            return this._post_logout_redirect_uri;
	        }

	        // optional protocol params

	    }, {
	        key: 'prompt',
	        get: function get() {
	            return this._prompt;
	        }
	    }, {
	        key: 'display',
	        get: function get() {
	            return this._display;
	        }
	    }, {
	        key: 'max_age',
	        get: function get() {
	            return this._max_age;
	        }
	    }, {
	        key: 'ui_locales',
	        get: function get() {
	            return this._ui_locales;
	        }
	    }, {
	        key: 'acr_values',
	        get: function get() {
	            return this._acr_values;
	        }

	        // metadata

	    }, {
	        key: 'authority',
	        get: function get() {
	            return this._authority;
	        }
	    }, {
	        key: 'metadataUrl',
	        get: function get() {
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

	        // settable/cachable metadata values

	    }, {
	        key: 'metadata',
	        get: function get() {
	            return this._metadata;
	        },
	        set: function set(value) {
	            this._metadata = value;
	        }
	    }, {
	        key: 'signingKeys',
	        get: function get() {
	            return this._signingKeys;
	        },
	        set: function set(value) {
	            this._signingKeys = value;
	        }

	        // behavior flags

	    }, {
	        key: 'filterProtocolClaims',
	        get: function get() {
	            return this._filterProtocolClaims;
	        }
	    }, {
	        key: 'loadUserInfo',
	        get: function get() {
	            return this._loadUserInfo;
	        }
	    }]);

	    return OidcClientSettings;
	}();

	exports.default = OidcClientSettings;
	module.exports = exports['default'];

/***/ },
/* 4 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	    value: true
	});

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

	var _JsonService = __webpack_require__(5);

	var _JsonService2 = _interopRequireDefault(_JsonService);

	var _Log = __webpack_require__(2);

	var _Log2 = _interopRequireDefault(_Log);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	var MetadataService = function () {
	    function MetadataService(settings) {
	        var JsonServiceCtor = arguments.length <= 1 || arguments[1] === undefined ? _JsonService2.default : arguments[1];

	        _classCallCheck(this, MetadataService);

	        if (!settings) {
	            _Log2.default.error("No settings passed to MetadataService");
	            throw new Error("settings");
	        }

	        this._settings = settings;
	        this._jsonService = new JsonServiceCtor();
	    }

	    _createClass(MetadataService, [{
	        key: 'getMetadata',
	        value: function getMetadata() {
	            var _this = this;

	            _Log2.default.info("MetadataService.getMetadata");

	            if (this._settings.metadata) {
	                _Log2.default.info("Returning metadata from settings");
	                return Promise.resolve(this._settings.metadata);
	            }

	            if (!this._settings.metadataUrl) {
	                _Log2.default.error("No metadataUrl configured on settings");
	                return Promise.reject(new Error("No metadataUrl configured on settings"));
	            }

	            _Log2.default.info("getting metadata from", this._settings.metadataUrl);

	            return this._jsonService.getJson(this._settings.metadataUrl).then(function (metadata) {
	                _Log2.default.info("metadata received", metadata);
	                _this._settings.metadata = metadata;
	                return metadata;
	            });
	        }
	    }, {
	        key: 'getIssuer',
	        value: function getIssuer() {
	            _Log2.default.info("MetadataService.getIssuer");
	            return this.getMetadataProperty("issuer");
	        }
	    }, {
	        key: 'getAuthorizationEndpoint',
	        value: function getAuthorizationEndpoint() {
	            _Log2.default.info("MetadataService.getAuthorizationEndpoint");
	            return this.getMetadataProperty("authorization_endpoint");
	        }
	    }, {
	        key: 'getUserInfoEndpoint',
	        value: function getUserInfoEndpoint() {
	            _Log2.default.info("MetadataService.getUserInfoEndpoint");
	            return this.getMetadataProperty("userinfo_endpoint");
	        }
	    }, {
	        key: 'getEndSessionEndpoint',
	        value: function getEndSessionEndpoint() {
	            _Log2.default.info("MetadataService.getEndSessionEndpoint");
	            return this.getMetadataProperty("end_session_endpoint");
	        }
	    }, {
	        key: 'getMetadataProperty',
	        value: function getMetadataProperty(name) {
	            _Log2.default.info("MetadataService.getMetadataProperty", name);

	            return this.getMetadata().then(function (metadata) {
	                _Log2.default.info("metadata recieved");

	                if (metadata[name] === undefined) {
	                    _Log2.default.error("Metadata does not contain property " + name);
	                    throw new Error("Metadata does not contain property " + name);
	                }

	                return metadata[name];
	            });
	        }
	    }, {
	        key: 'getSigningKeys',
	        value: function getSigningKeys() {
	            var _this2 = this;

	            _Log2.default.info("MetadataService.getSigningKeys");

	            if (this._settings.signingKeys) {
	                _Log2.default.info("Returning signingKeys from settings");
	                return Promise.resolve(this._settings.signingKeys);
	            }

	            return this.getMetadataProperty("jwks_uri").then(function (jwks_uri) {
	                _Log2.default.info("jwks_uri received", jwks_uri);

	                return _this2._jsonService.getJson(jwks_uri).then(function (keySet) {
	                    _Log2.default.info("key set received", keySet);

	                    if (!keySet.keys) {
	                        _Log2.default.error("Missing keys on keyset");
	                        throw new Error("Missing keys on keyset");
	                    }

	                    var filteredKeys = _this2.filterSigningKeys(keySet.keys);
	                    _Log2.default.info("filtered keys", filteredKeys);

	                    _this2._settings.signingKeys = filteredKeys;
	                    return _this2._settings.signingKeys;
	                });
	            });
	        }
	    }, {
	        key: 'filterSigningKeys',
	        value: function filterSigningKeys(keys) {
	            _Log2.default.info("MetadataService.filterSigningKeys", keys);

	            return keys.filter(function (item) {
	                return item.use === "sig";
	            });
	        }
	    }]);

	    return MetadataService;
	}();

	exports.default = MetadataService;
	module.exports = exports['default'];

/***/ },
/* 5 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	    value: true
	});

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

	var _Log = __webpack_require__(2);

	var _Log2 = _interopRequireDefault(_Log);

	var _Window = __webpack_require__(6);

	var _Window2 = _interopRequireDefault(_Window);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	var JsonService = function () {
	    function JsonService() {
	        var XMLHttpRequestCtor = arguments.length <= 0 || arguments[0] === undefined ? _Window2.default.XMLHttpRequest : arguments[0];

	        _classCallCheck(this, JsonService);

	        this._XMLHttpRequest = XMLHttpRequestCtor;
	    }

	    _createClass(JsonService, [{
	        key: 'getJson',
	        value: function getJson(url, token) {
	            var _this = this;

	            _Log2.default.info("JsonService.getJson", url);

	            if (!url) {
	                _Log2.default.error("No url passed");
	                throw new Error("url");
	            }

	            return new Promise(function (resolve, reject) {

	                var req = new _this._XMLHttpRequest();
	                req.open('GET', url);

	                req.onload = function () {
	                    _Log2.default.info("HTTP response received, status", req.status);

	                    if (req.status === 200) {
	                        resolve(JSON.parse(req.response));
	                    } else {
	                        reject(Error(req.statusText + " (" + req.status + ")"));
	                    }
	                };

	                req.onerror = function () {
	                    _Log2.default.error("network error");
	                    reject(Error("Network Error"));
	                };

	                if (token) {
	                    _Log2.default.info("token passed, setting Authorization header");
	                    req.setRequestHeader("Authorization", "Bearer " + token);
	                }

	                req.send();
	            });
	        }
	    }]);

	    return JsonService;
	}();

	exports.default = JsonService;
	module.exports = exports['default'];

/***/ },
/* 6 */
/***/ function(module, exports) {

	"use strict";

	Object.defineProperty(exports, "__esModule", {
	    value: true
	});

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	var Window = function () {
	    function Window() {
	        _classCallCheck(this, Window);
	    }

	    _createClass(Window, null, [{
	        key: "location",
	        get: function get() {
	            return window.location;
	        }
	    }, {
	        key: "localStorage",
	        get: function get() {
	            return window.localStorage;
	        }
	    }, {
	        key: "sessionStorage",
	        get: function get() {
	            return window.sessionStorage;
	        }
	    }, {
	        key: "XMLHttpRequest",
	        get: function get() {
	            return window.XMLHttpRequest;
	        }
	    }]);

	    return Window;
	}();

	exports.default = Window;
	;
	module.exports = exports['default'];

/***/ },
/* 7 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	    value: true
	});

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

	var _Log = __webpack_require__(2);

	var _Log2 = _interopRequireDefault(_Log);

	var _UrlUtility = __webpack_require__(8);

	var _UrlUtility2 = _interopRequireDefault(_UrlUtility);

	var _State = __webpack_require__(9);

	var _State2 = _interopRequireDefault(_State);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	var SigninRequest = function () {
	    function SigninRequest(_ref) {
	        var
	        // mandatory
	        url = _ref.url;
	        var client_id = _ref.client_id;
	        var redirect_uri = _ref.redirect_uri;
	        var response_type = _ref.response_type;
	        var scope = _ref.scope;
	        var data = _ref.data;
	        var
	        // optional
	        prompt = _ref.prompt;
	        var display = _ref.display;
	        var max_age = _ref.max_age;
	        var ui_locales = _ref.ui_locales;
	        var id_token_hint = _ref.id_token_hint;
	        var login_hint = _ref.login_hint;
	        var acr_values = _ref.acr_values;

	        _classCallCheck(this, SigninRequest);

	        if (!url) {
	            _Log2.default.error("No url passed to SigninRequest");
	            throw new Error("url");
	        }
	        if (!client_id) {
	            _Log2.default.error("No client_id passed to SigninRequest");
	            throw new Error("client_id");
	        }
	        if (!redirect_uri) {
	            _Log2.default.error("No redirect_uri passed to SigninRequest");
	            throw new Error("redirect_uri");
	        }
	        if (!response_type) {
	            _Log2.default.error("No response_type passed to SigninRequest");
	            throw new Error("response_type");
	        }
	        if (!scope) {
	            _Log2.default.error("No scope passed to SigninRequest");
	            throw new Error("scope");
	        }

	        var oidc = SigninRequest.isOidc(response_type);
	        this.state = new _State2.default({ nonce: oidc, data: data });

	        url = _UrlUtility2.default.addQueryParam(url, "client_id", client_id);
	        url = _UrlUtility2.default.addQueryParam(url, "redirect_uri", redirect_uri);
	        url = _UrlUtility2.default.addQueryParam(url, "response_type", response_type);
	        url = _UrlUtility2.default.addQueryParam(url, "scope", scope);

	        url = _UrlUtility2.default.addQueryParam(url, "state", this.state.id);
	        if (oidc) {
	            url = _UrlUtility2.default.addQueryParam(url, "nonce", this.state.nonce);
	        }

	        var optional = { prompt: prompt, display: display, max_age: max_age, ui_locales: ui_locales, id_token_hint: id_token_hint, login_hint: login_hint, acr_values: acr_values };
	        for (var key in optional) {
	            if (optional[key]) {
	                url = _UrlUtility2.default.addQueryParam(url, key, optional[key]);
	            }
	        }

	        this.url = url;
	    }

	    _createClass(SigninRequest, null, [{
	        key: 'isOidc',
	        value: function isOidc(response_type) {
	            var result = response_type.split(/\s+/g).filter(function (item) {
	                return item === "id_token";
	            });
	            return !!result[0];
	        }
	    }, {
	        key: 'isOAuth',
	        value: function isOAuth(response_type) {
	            var result = response_type.split(/\s+/g).filter(function (item) {
	                return item === "token";
	            });
	            return !!result[0];
	        }
	    }]);

	    return SigninRequest;
	}();

	exports.default = SigninRequest;
	module.exports = exports['default'];

/***/ },
/* 8 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	    value: true
	});

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

	var _Log = __webpack_require__(2);

	var _Log2 = _interopRequireDefault(_Log);

	var _Window = __webpack_require__(6);

	var _Window2 = _interopRequireDefault(_Window);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	var UrlUtility = function () {
	    function UrlUtility() {
	        _classCallCheck(this, UrlUtility);
	    }

	    _createClass(UrlUtility, null, [{
	        key: 'addQueryParam',
	        value: function addQueryParam(url, name, value) {
	            if (url.indexOf('?') < 0) {
	                url += "?";
	            }

	            if (url[url.length - 1] !== "?") {
	                url += "&";
	            }

	            url += encodeURIComponent(name);
	            url += "=";
	            url += encodeURIComponent(value);

	            return url;
	        }
	    }, {
	        key: 'parseUrlFragment',
	        value: function parseUrlFragment(value) {
	            var delimiter = arguments.length <= 1 || arguments[1] === undefined ? "#" : arguments[1];
	            var window = arguments.length <= 2 || arguments[2] === undefined ? _Window2.default : arguments[2];

	            _Log2.default.info("UrlUtility.parseUrlFragment");

	            if (typeof value !== 'string') {
	                value = window.location.href;
	            }

	            var idx = value.lastIndexOf(delimiter);
	            if (idx >= 0) {
	                value = value.substr(idx + 1);
	            }

	            var params = {},
	                regex = /([^&=]+)=([^&]*)/g,
	                m;

	            var counter = 0;
	            while (m = regex.exec(value)) {
	                params[decodeURIComponent(m[1])] = decodeURIComponent(m[2]);
	                if (counter++ > 50) {
	                    _Log2.default.error("response exceeded expected number of parameters", value);
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
	    }]);

	    return UrlUtility;
	}();

	exports.default = UrlUtility;
	module.exports = exports['default'];

/***/ },
/* 9 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	    value: true
	});

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

	var _random = __webpack_require__(10);

	var _random2 = _interopRequireDefault(_random);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	var State = function () {
	    function State() {
	        var _ref = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];

	        var id = _ref.id;
	        var nonce = _ref.nonce;
	        var data = _ref.data;

	        _classCallCheck(this, State);

	        this._id = id || (0, _random2.default)();
	        if (nonce === true) {
	            this._nonce = (0, _random2.default)();
	        } else if (nonce) {
	            this._nonce = nonce;
	        }
	        this._data = data;
	    }

	    _createClass(State, [{
	        key: 'toStorageString',
	        value: function toStorageString() {
	            return JSON.stringify({
	                id: this.id,
	                nonce: this.nonce,
	                data: this.data
	            });
	        }
	    }, {
	        key: 'id',
	        get: function get() {
	            return this._id;
	        }
	    }, {
	        key: 'nonce',
	        get: function get() {
	            return this._nonce;
	        }
	    }, {
	        key: 'data',
	        get: function get() {
	            return this._data;
	        }
	    }], [{
	        key: 'fromStorageString',
	        value: function fromStorageString(storageString) {
	            return new State(JSON.parse(storageString));
	        }
	    }]);

	    return State;
	}();

	exports.default = State;
	module.exports = exports['default'];

/***/ },
/* 10 */
/***/ function(module, exports) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	    value: true
	});
	exports.default = random;
	// NOTICE: the code in this file originally developed by Microsoft

	//----------------------------------------------------------------------
	// AdalJS v1.0.8
	// @preserve Copyright (c) Microsoft Open Technologies, Inc.
	// All Rights Reserved
	// Apache License 2.0
	//
	// Licensed under the Apache License, Version 2.0 (the "License");
	// you may not use this file except in compliance with the License.
	// You may obtain a copy of the License at
	//
	// http://www.apache.org/licenses/LICENSE-2.0
	//
	// Unless required by applicable law or agreed to in writing, software
	// distributed under the License is distributed on an "AS IS" BASIS,
	// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
	// See the License for the specific language governing permissions and
	// limitations under the License.
	//----------------------------------------------------------------------

	// source: https://github.com/AzureAD/azure-activedirectory-library-for-js/blob/master/lib/adal.js#L1029
	// original license: https://github.com/AzureAD/azure-activedirectory-library-for-js/blob/master/LICENSE.txt

	function random() {
	    var guidHolder = 'xxxxxxxxxxxx4xxxyxxxxxxxxxxxxxxx';
	    var hex = '0123456789abcdef';
	    var r = 0;
	    var guidResponse = "";
	    for (var i = 0; i < guidHolder.length; i++) {
	        if (guidHolder[i] !== '-' && guidHolder[i] !== '4') {
	            // each x and y needs to be random
	            r = Math.random() * 16 | 0;
	        }

	        if (guidHolder[i] === 'x') {
	            guidResponse += hex[r];
	        } else if (guidHolder[i] === 'y') {
	            // clock-seq-and-reserved first hex is filtered and remaining hex values are random
	            r &= 0x3; // bit and with 0011 to set pos 2 to zero ?0??
	            r |= 0x8; // set pos 3 to 1 as 1???
	            guidResponse += hex[r];
	        } else {
	            guidResponse += guidHolder[i];
	        }
	    }
	    return guidResponse;
	}
	module.exports = exports['default'];

/***/ },
/* 11 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	    value: true
	});

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

	var _Log = __webpack_require__(2);

	var _Log2 = _interopRequireDefault(_Log);

	var _UrlUtility = __webpack_require__(8);

	var _UrlUtility2 = _interopRequireDefault(_UrlUtility);

	var _ErrorResponse = __webpack_require__(12);

	var _ErrorResponse2 = _interopRequireDefault(_ErrorResponse);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	var SigninResponse = function () {
	    function SigninResponse(url) {
	        _classCallCheck(this, SigninResponse);

	        var values = _UrlUtility2.default.parseUrlFragment(url, "#");

	        if (values.error) {
	            return new _ErrorResponse2.default(values);
	        }

	        this.state = values.state;
	        this.id_token = values.id_token;
	        this.session_state = values.session_state;
	        this.access_token = values.access_token;
	        this.token_type = values.token_type;
	        this.scope = values.scope;

	        var expires_in = parseInt(values.expires_in);
	        if (typeof expires_in === 'number' && expires_in > 0) {
	            var now = parseInt(Date.now() / 1000);
	            this.expires_at = now + expires_in;
	        }
	    }

	    _createClass(SigninResponse, [{
	        key: 'expires_in',
	        get: function get() {
	            if (this.expires_at) {
	                var now = parseInt(Date.now() / 1000);
	                return this.expires_at - now;
	            }
	            return undefined;
	        }
	    }]);

	    return SigninResponse;
	}();

	exports.default = SigninResponse;
	module.exports = exports['default'];

/***/ },
/* 12 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	    value: true
	});

	var _Log = __webpack_require__(2);

	var _Log2 = _interopRequireDefault(_Log);

	var _UrlUtility = __webpack_require__(8);

	var _UrlUtility2 = _interopRequireDefault(_UrlUtility);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	var ErrorResponse = function ErrorResponse() {
	    var _ref = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];

	    var error = _ref.error;
	    var error_description = _ref.error_description;
	    var error_uri = _ref.error_uri;
	    var state = _ref.state;

	    _classCallCheck(this, ErrorResponse);

	    if (!error) {
	        _Log2.default.error("No error passed to ErrorResponse");
	        throw new Error("error");
	    }

	    this.message = error_description || error;
	    this.name = "ErrorResponse";
	    this.stack = new Error().stack;

	    this.error = error;
	    this.error_description = error_description;
	    this.error_uri = error_uri;

	    this.state = state;
	};

	exports.default = ErrorResponse;
	module.exports = exports['default'];

/***/ },
/* 13 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	    value: true
	});

	var _Log = __webpack_require__(2);

	var _Log2 = _interopRequireDefault(_Log);

	var _UrlUtility = __webpack_require__(8);

	var _UrlUtility2 = _interopRequireDefault(_UrlUtility);

	var _State = __webpack_require__(9);

	var _State2 = _interopRequireDefault(_State);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	var SignoutRequest = function SignoutRequest(_ref) {
	    var url = _ref.url;
	    var id_token_hint = _ref.id_token_hint;
	    var post_logout_redirect_uri = _ref.post_logout_redirect_uri;
	    var data = _ref.data;

	    _classCallCheck(this, SignoutRequest);

	    if (!url) {
	        _Log2.default.error("No url passed to SignoutRequest");
	        throw new Error("url");
	    }

	    this.state = new _State2.default({ data: data });

	    url = _UrlUtility2.default.addQueryParam(url, "state", this.state.id);
	    if (id_token_hint) {
	        url = _UrlUtility2.default.addQueryParam(url, "id_token_hint", id_token_hint);
	    }
	    if (post_logout_redirect_uri) {
	        url = _UrlUtility2.default.addQueryParam(url, "post_logout_redirect_uri", post_logout_redirect_uri);
	    }
	    this.url = url;
	};

	exports.default = SignoutRequest;
	module.exports = exports['default'];

/***/ },
/* 14 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	    value: true
	});

	var _Log = __webpack_require__(2);

	var _Log2 = _interopRequireDefault(_Log);

	var _UrlUtility = __webpack_require__(8);

	var _UrlUtility2 = _interopRequireDefault(_UrlUtility);

	var _ErrorResponse = __webpack_require__(12);

	var _ErrorResponse2 = _interopRequireDefault(_ErrorResponse);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	var SignoutResponse = function SignoutResponse(url) {
	    _classCallCheck(this, SignoutResponse);

	    var values = _UrlUtility2.default.parseUrlFragment(url, "?");

	    if (values.error) {
	        return new _ErrorResponse2.default(values);
	    }

	    this.state = values.state;
	};

	exports.default = SignoutResponse;
	module.exports = exports['default'];

/***/ },
/* 15 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	    value: true
	});

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

	var _Log = __webpack_require__(2);

	var _Log2 = _interopRequireDefault(_Log);

	var _Window = __webpack_require__(6);

	var _Window2 = _interopRequireDefault(_Window);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	var WebStorageStateStore = function () {
	    function WebStorageStateStore() {
	        var store = arguments.length <= 0 || arguments[0] === undefined ? _Window2.default.localStorage : arguments[0];

	        _classCallCheck(this, WebStorageStateStore);

	        this._store = store;
	    }

	    _createClass(WebStorageStateStore, [{
	        key: 'set',
	        value: function set(key, value) {
	            _Log2.default.info("WebStorageStateStore.set", key);

	            try {
	                this._store.setItem(key, value);
	                return Promise.resolve();
	            } catch (e) {
	                _Log2.default.error("storage exception", e);
	                return Promise.reject(new Error("Failed to store item", key));
	            }
	        }
	    }, {
	        key: 'remove',
	        value: function remove(key) {
	            _Log2.default.info("WebStorageStateStore.remove", key);

	            var item = this._store.getItem(key);
	            this._store.removeItem(key);

	            return Promise.resolve(item);
	        }
	    }]);

	    return WebStorageStateStore;
	}();

	exports.default = WebStorageStateStore;
	module.exports = exports['default'];

/***/ },
/* 16 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	    value: true
	});

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

	var _Log = __webpack_require__(2);

	var _Log2 = _interopRequireDefault(_Log);

	var _MetadataService = __webpack_require__(4);

	var _MetadataService2 = _interopRequireDefault(_MetadataService);

	var _UserInfoService = __webpack_require__(17);

	var _UserInfoService2 = _interopRequireDefault(_UserInfoService);

	var _JwtUtil = __webpack_require__(18);

	var _JwtUtil2 = _interopRequireDefault(_JwtUtil);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	var ProtocolClaims = ["nonce", "at_hash", "iat", "nbf", "exp", "aud", "iss", "c_hash"];

	var ResponseValidator = function () {
	    function ResponseValidator(settings) {
	        var MetadataServiceCtor = arguments.length <= 1 || arguments[1] === undefined ? _MetadataService2.default : arguments[1];
	        var UserInfoServiceCtor = arguments.length <= 2 || arguments[2] === undefined ? _UserInfoService2.default : arguments[2];
	        var jwtUtil = arguments.length <= 3 || arguments[3] === undefined ? _JwtUtil2.default : arguments[3];

	        _classCallCheck(this, ResponseValidator);

	        if (!settings) {
	            _Log2.default.error("No settings passed to ResponseValidator");
	            throw new Error("settings");
	        }

	        this._settings = settings;
	        this._metadataService = new MetadataServiceCtor(this._settings);
	        this._userInfoService = new UserInfoServiceCtor(this._settings);
	        this._jwtUtil = jwtUtil;
	    }

	    _createClass(ResponseValidator, [{
	        key: 'validateSigninResponse',
	        value: function validateSigninResponse(state, response) {
	            var _this = this;

	            _Log2.default.info("ResponseValidator.validateSigninResponse");

	            return this.processSigninParams(state, response).then(function (response) {
	                _Log2.default.info("state processed");
	                return _this.validateTokens(state, response).then(function (response) {
	                    _Log2.default.info("tokens validated");
	                    return _this.processClaims(response).then(function (response) {
	                        _Log2.default.info("claims processed");
	                        return response;
	                    });
	                });
	            });
	        }
	    }, {
	        key: 'validateSignoutResponse',
	        value: function validateSignoutResponse(state, response) {
	            _Log2.default.info("ResponseValidator.validateSignoutResponse");

	            if (state.id !== response.state) {
	                _Log2.default.error("State does not match");
	                return Promise.reject(new Error("State does not match"));
	            }

	            // now that we know the state matches, take the stored data
	            // and set it into the response so callers can get their state
	            // this is important for both success & error outcomes
	            _Log2.default.info("state validated");
	            response.state = state.data;

	            if (response.error) {
	                _Log2.default.warn("Response was error", response.error);
	                return Promise.reject(response);
	            }

	            return Promise.resolve(response);
	        }
	    }, {
	        key: 'processSigninParams',
	        value: function processSigninParams(state, response) {
	            _Log2.default.info("ResponseValidator.processSigninParams");

	            if (state.id !== response.state) {
	                _Log2.default.error("State does not match");
	                return Promise.reject(new Error("State does not match"));
	            }

	            // now that we know the state matches, take the stored data
	            // and set it into the response so callers can get their state
	            // this is important for both success & error outcomes
	            _Log2.default.info("state validated");
	            response.state = state.data;

	            if (response.error) {
	                _Log2.default.warn("Response was error", response.error);
	                return Promise.reject(response);
	            }

	            if (state.nonce && !response.id_token) {
	                _Log2.default.error("Expecting id_token in response");
	                return Promise.reject(new Error("No id_token in response"));
	            }

	            if (!state.nonce && response.id_token) {
	                _Log2.default.error("Not expecting id_token in response");
	                return Promise.reject(new Error("Unexpected id_token in response"));
	            }

	            return Promise.resolve(response);
	        }
	    }, {
	        key: 'processClaims',
	        value: function processClaims(response) {
	            var _this2 = this;

	            _Log2.default.info("ResponseValidator.processClaims");

	            response.profile = this.filterProtocolClaims(response.profile);

	            if (this._settings.loadUserInfo && response.access_token) {

	                _Log2.default.info("loading user info");
	                return this._userInfoService.getClaims(response.access_token).then(function (claims) {

	                    response.profile = _this2.mergeClaims(response.profile, claims);
	                    _Log2.default.info("user info claims received, updated profile:", response.profile);

	                    return response;
	                });
	            }

	            return Promise.resolve(response);
	        }
	    }, {
	        key: 'mergeClaims',
	        value: function mergeClaims(claims1, claims2) {
	            var result = Object.assign({}, claims1);

	            for (var name in claims2) {
	                var values = claims2[name];
	                if (!Array.isArray(values)) {
	                    values = [values];
	                }

	                var _iteratorNormalCompletion = true;
	                var _didIteratorError = false;
	                var _iteratorError = undefined;

	                try {
	                    for (var _iterator = values[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
	                        var value = _step.value;

	                        if (!result[name]) {
	                            result[name] = value;
	                        } else if (Array.isArray(result[name])) {
	                            if (result[name].indexOf(value) < 0) {
	                                result[name].push(value);
	                            }
	                        } else if (result[name] !== value) {
	                            result[name] = [result[name], value];
	                        }
	                    }
	                } catch (err) {
	                    _didIteratorError = true;
	                    _iteratorError = err;
	                } finally {
	                    try {
	                        if (!_iteratorNormalCompletion && _iterator.return) {
	                            _iterator.return();
	                        }
	                    } finally {
	                        if (_didIteratorError) {
	                            throw _iteratorError;
	                        }
	                    }
	                }
	            }

	            return result;
	        }
	    }, {
	        key: 'filterProtocolClaims',
	        value: function filterProtocolClaims(claims) {
	            _Log2.default.info("ResponseValidator.filterProtocolClaims, incoming claims:", claims);

	            var result = Object.assign({}, claims);

	            if (this._settings.filterProtocolClaims) {
	                ProtocolClaims.forEach(function (type) {
	                    delete result[type];
	                });

	                _Log2.default.info("protocol claims filtered", result);
	            } else {
	                _Log2.default.info("protocol claims not filtered");
	            }

	            return result;
	        }
	    }, {
	        key: 'validateTokens',
	        value: function validateTokens(state, response) {
	            _Log2.default.info("ResponseValidator.validateTokens");

	            if (response.id_token) {

	                if (response.access_token) {
	                    _Log2.default.info("Validating id_token and access_token");
	                    return this.validateIdTokenAndAccessToken(state, response);
	                }

	                _Log2.default.info("Validating id_token");
	                return this.validateIdToken(state, response);
	            }

	            _Log2.default.info("No id_token to validate");
	            return Promise.resolve(response);
	        }
	    }, {
	        key: 'validateIdTokenAndAccessToken',
	        value: function validateIdTokenAndAccessToken(state, response) {
	            var _this3 = this;

	            _Log2.default.info("ResponseValidator.validateIdTokenAndAccessToken");

	            return this.validateIdToken(state, response).then(function (response) {
	                return _this3.validateAccessToken(response);
	            });
	        }
	    }, {
	        key: 'validateIdToken',
	        value: function validateIdToken(state, response) {
	            var _this4 = this;

	            _Log2.default.info("ResponseValidator.validateIdToken");

	            if (!state.nonce) {
	                _Log2.default.error("No nonce on state");
	                return Promise.reject(new Error("No nonce on state"));
	            }

	            var jwt = this._jwtUtil.parseJwt(response.id_token);
	            if (!jwt || !jwt.header || !jwt.payload) {
	                _Log2.default.error("Failed to parse id_token", jwt);
	                return Promise.reject(new Error("Failed to parse id_token"));
	            }

	            if (state.nonce !== jwt.payload.nonce) {
	                _Log2.default.error("Invalid nonce in id_token");
	                return Promise.reject(new Error("Invalid nonce in id_token"));
	            }

	            var kid = jwt.header.kid;
	            if (!kid) {
	                _Log2.default.error("No kid found in id_token");
	                return Promise.reject(new Error("No kid found in id_token"));
	            }

	            var audience = this._settings.client_id;
	            if (!audience) {
	                _Log2.default.error("Invalid audience/client_id value");
	                return Promise.reject(new Error("Invalid audience/client_id value"));
	            }

	            return this._metadataService.getIssuer().then(function (issuer) {
	                _Log2.default.info("Received issuer");

	                return _this4._metadataService.getSigningKeys().then(function (keys) {
	                    if (!keys) {
	                        _Log2.default.error("No signing keys from metadata");
	                        return Promise.reject(new Error("No signing keys from metadata"));
	                    }

	                    _Log2.default.info("Received signing keys");

	                    var key = keys.filter(function (key) {
	                        return key.kid === kid;
	                    })[0];

	                    if (!key) {
	                        _Log2.default.error("No key matching kid found in signing keys");
	                        return Promise.reject(new Error("No key matching kid found in signing keys"));
	                    }

	                    if (!_this4._jwtUtil.validateJwt(response.id_token, key, issuer, audience)) {
	                        _Log2.default.error("Signature failed to validate");
	                        return Promise.reject(new Error("Signature failed to validate"));
	                    }

	                    response.profile = jwt.payload;
	                    return response;
	                });
	            });
	        }
	    }, {
	        key: 'validateAccessToken',
	        value: function validateAccessToken(response) {
	            _Log2.default.info("ResponseValidator.validateAccessToken");

	            if (!response.profile) {
	                _Log2.default.error("No profile loaded from id_token");
	                return Promise.reject(new Error("No profile loaded from id_token"));
	            }

	            if (!response.profile.at_hash) {
	                _Log2.default.error("No at_hash in id_token");
	                return Promise.reject(new Error("No at_hash in id_token"));
	            }

	            if (!response.id_token) {
	                _Log2.default.error("No id_token");
	                return Promise.reject(new Error("No id_token"));
	            }

	            var jwt = this._jwtUtil.parseJwt(response.id_token);
	            if (!jwt || !jwt.header) {
	                _Log2.default.error("Failed to parse id_token", jwt);
	                return Promise.reject(new Error("Failed to parse id_token"));
	            }

	            var hashAlg = jwt.header.alg;
	            if (!hashAlg || hashAlg.length !== 5) {
	                _Log2.default.error("Unsupported alg:", hashAlg);
	                return Promise.reject(new Error("Unsupported alg: " + hashAlg));
	            }

	            var hashBits = hashAlg.substr(2, 3);
	            if (!hashBits) {
	                _Log2.default.error("Unsupported alg:", hashAlg, hashBits);
	                return Promise.reject(new Error("Unsupported alg: " + hashAlg));
	            }

	            hashBits = parseInt(hashBits);
	            if (hashBits !== 256 && hashBits !== 384 && hashBits !== 512) {
	                _Log2.default.error("Unsupported alg:", hashAlg, hashBits);
	                return Promise.reject(new Error("Unsupported alg: " + hashAlg));
	            }

	            var sha = "sha" + hashBits;
	            var hash = this._jwtUtil.hashString(response.access_token, sha);
	            if (!hash) {
	                _Log2.default.error("access_token hash failed:", sha);
	                return Promise.reject(new Error("Failed to validate at_hash"));
	            }

	            var left = hash.substr(0, hash.length / 2);
	            var left_b64u = this._jwtUtil.hexToBase64Url(left);
	            if (left_b64u !== response.profile.at_hash) {
	                _Log2.default.error("Failed to validate at_hash", left_b64u, response.profile.at_hash);
	                return Promise.reject(new Error("Failed to validate at_hash"));
	            }

	            return Promise.resolve(response);
	        }
	    }]);

	    return ResponseValidator;
	}();

	exports.default = ResponseValidator;
	module.exports = exports['default'];

/***/ },
/* 17 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	    value: true
	});

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

	var _JsonService = __webpack_require__(5);

	var _JsonService2 = _interopRequireDefault(_JsonService);

	var _MetadataService = __webpack_require__(4);

	var _MetadataService2 = _interopRequireDefault(_MetadataService);

	var _Log = __webpack_require__(2);

	var _Log2 = _interopRequireDefault(_Log);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	var UserInfoService = function () {
	    function UserInfoService(settings) {
	        var JsonServiceCtor = arguments.length <= 1 || arguments[1] === undefined ? _JsonService2.default : arguments[1];
	        var MetadataServiceCtor = arguments.length <= 2 || arguments[2] === undefined ? _MetadataService2.default : arguments[2];

	        _classCallCheck(this, UserInfoService);

	        if (!settings) {
	            _Log2.default.error("No settings passed to UserInfoService");
	            throw new Error("settings");
	        }

	        this._settings = settings;
	        this._jsonService = new JsonServiceCtor();
	        this._metadataService = new MetadataServiceCtor(this._settings);
	    }

	    _createClass(UserInfoService, [{
	        key: 'getClaims',
	        value: function getClaims(token) {
	            var _this = this;

	            _Log2.default.info("UserInfoService.getClaims");

	            if (!token) {
	                _Log2.default.error("No token passed");
	                return Promise.reject(new Error("A token is required"));
	            }

	            return this._metadataService.getUserInfoEndpoint().then(function (url) {
	                _Log2.default.info("received userinfo url", url);

	                return _this._jsonService.getJson(url, token).then(function (claims) {
	                    _Log2.default.info("claims received", claims);
	                    return claims;
	                });
	            });
	        }
	    }]);

	    return UserInfoService;
	}();

	exports.default = UserInfoService;
	module.exports = exports['default'];

/***/ },
/* 18 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";

	Object.defineProperty(exports, "__esModule", {
	    value: true
	});

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

	var _Log = __webpack_require__(2);

	var _Log2 = _interopRequireDefault(_Log);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	var __global = void 0;
	var __jwtModule = void 0;

	try {
	    // this is assuming we have a reference to
	    // the jsrsasign library loaded in the browser
	    __global = window;
	    __jwtModule = window.KJUR;
	} catch (e) {
	    // this will certainly throw in our unit tests
	    // we're assuming the use of the init() method
	    // below for testing
	}

	var JwtUtil = function () {
	    function JwtUtil() {
	        _classCallCheck(this, JwtUtil);
	    }

	    _createClass(JwtUtil, null, [{
	        key: "init",


	        // this is used to configure jsrsasign loaded via
	        // require in our unit tests
	        value: function init(global) {
	            __global = global;
	            __jwtModule = global;
	        }
	    }, {
	        key: "parseJwt",
	        value: function parseJwt(jwt) {
	            _Log2.default.info("JwtUtil.parseJwt");
	            try {
	                var token = __jwtModule.jws.JWS.parse(jwt);
	                return {
	                    header: token.headerObj,
	                    payload: token.payloadObj
	                };
	            } catch (e) {
	                _Log2.default.error(e);
	            }
	        }
	    }, {
	        key: "validateJwt",
	        value: function validateJwt(jwt, key, issuer, audience, now) {
	            _Log2.default.info("JwtUtil.validateJwt");

	            try {
	                if (key.kty === "RSA") {
	                    if (key.e && key.n) {
	                        key = __global.KEYUTIL.getKey(key);
	                    } else if (key.x5c && key.x5c.length) {
	                        key = __global.KEYUTIL.getKey(__global.X509.getPublicKeyFromCertPEM(key.x5c[0]));
	                    } else {
	                        _Log2.default.error("RSA key missing key material", key);
	                        return false;
	                    }
	                } else if (key.kty === "EC") {
	                    if (key.crv && key.x && key.y) {
	                        key = __global.KEYUTIL.getKey(key);
	                    } else {
	                        _Log2.default.error("EC key missing key material", key);
	                        return false;
	                    }
	                } else {
	                    _Log2.default.error("Unsupported key type", key.kty);
	                    return false;
	                }

	                return __jwtModule.jws.JWS.verifyJWT(jwt, key, {
	                    alg: ['RS256', 'RS384', 'RS512', 'PS256', 'PS384', 'PS512', 'ES256', 'ES384', 'ES512'],
	                    iss: [issuer],
	                    aud: [audience],
	                    verifyAt: now
	                });
	            } catch (e) {
	                _Log2.default.error(e);
	            }

	            return false;
	        }
	    }, {
	        key: "hashString",
	        value: function hashString(value, alg) {
	            _Log2.default.info("JwtUtil.hashString", value, alg);
	            try {
	                return __jwtModule.crypto.Util.hashString(value, alg);
	            } catch (e) {
	                _Log2.default.error(e);
	            }
	        }
	    }, {
	        key: "hexToBase64Url",
	        value: function hexToBase64Url(value) {
	            _Log2.default.info("JwtUtil.hexToBase64Url", value);
	            try {
	                return __global.hextob64u(value);
	            } catch (e) {
	                _Log2.default.error(e);
	            }
	        }
	    }]);

	    return JwtUtil;
	}();

	exports.default = JwtUtil;
	module.exports = exports['default'];

/***/ },
/* 19 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";

	Object.defineProperty(exports, "__esModule", {
	    value: true
	});

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

	var _Log = __webpack_require__(2);

	var _Log2 = _interopRequireDefault(_Log);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	var InMemoryWebStorage = function () {
	    function InMemoryWebStorage() {
	        _classCallCheck(this, InMemoryWebStorage);

	        this._data = {};
	    }

	    _createClass(InMemoryWebStorage, [{
	        key: "getItem",
	        value: function getItem(key) {
	            _Log2.default.info("InMemoryWebStorage.getItem", key);
	            return this._data[key];
	        }
	    }, {
	        key: "setItem",
	        value: function setItem(key, value) {
	            _Log2.default.info("InMemoryWebStorage.setItem", key);
	            this._data[key] = value;
	        }
	    }, {
	        key: "removeItem",
	        value: function removeItem(key) {
	            _Log2.default.info("InMemoryWebStorage.removeItem", key);
	            delete this._data[key];
	        }
	    }]);

	    return InMemoryWebStorage;
	}();

	exports.default = InMemoryWebStorage;
	module.exports = exports['default'];

/***/ }
/******/ ])
});
;