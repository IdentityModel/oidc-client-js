var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
// Copyright (c) Brock Allen & Dominick Baier. All rights reserved.
// Licensed under the Apache License, Version 2.0. See LICENSE in the project root for license information.
define("index", ["require", "exports"], function (require, exports) {
    "use strict";
    exports.Log = require('./src/Log');
    exports.OidcClient = require('./src/OidcClient');
    exports.WebStorageStateStore = require('./src/WebStorageStateStore');
    exports.InMemoryWebStorage = require('./src/InMemoryWebStorage');
    exports.UserManager = require('./src/UserManager');
    exports.AccessTokenEvents = require('./src/AccessTokenEvents');
    exports.MetadataService = require('./src/MetadataService');
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = {
        Log: exports.Log,
        OidcClient: exports.OidcClient,
        WebStorageStateStore: exports.WebStorageStateStore,
        InMemoryWebStorage: exports.InMemoryWebStorage,
        UserManager: exports.UserManager,
        AccessTokenEvents: exports.AccessTokenEvents,
        MetadataService: exports.MetadataService
    };
});
// Copyright (c) Brock Allen & Dominick Baier. All rights reserved.
// Licensed under the Apache License, Version 2.0. See LICENSE in the project root for license information.
define("src/Log", ["require", "exports"], function (require, exports) {
    "use strict";
    var nopLogger = {
        info: function () { },
        warn: function () { },
        error: function () { }
    };
    var NONE = 0;
    var ERROR = 1;
    var WARN = 2;
    var INFO = 3;
    var logger;
    var level;
    var Log = (function () {
        function Log() {
        }
        Object.defineProperty(Log, "NONE", {
            get: function () { return NONE; },
            enumerable: true,
            configurable: true
        });
        ;
        Object.defineProperty(Log, "ERROR", {
            get: function () { return ERROR; },
            enumerable: true,
            configurable: true
        });
        ;
        Object.defineProperty(Log, "WARN", {
            get: function () { return WARN; },
            enumerable: true,
            configurable: true
        });
        ;
        Object.defineProperty(Log, "INFO", {
            get: function () { return INFO; },
            enumerable: true,
            configurable: true
        });
        ;
        Log.reset = function () {
            level = INFO;
            logger = nopLogger;
        };
        Object.defineProperty(Log, "level", {
            get: function () {
                return level;
            },
            set: function (value) {
                if (NONE <= value && value <= INFO) {
                    level = value;
                }
                else {
                    throw new Error("Invalid log level");
                }
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Log, "logger", {
            get: function () {
                return logger;
            },
            set: function (value) {
                if (value.info && value.warn && value.error) {
                    logger = value;
                }
                else {
                    throw new Error("Invalid logger");
                }
            },
            enumerable: true,
            configurable: true
        });
        Log.info = function () {
            var args = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                args[_i - 0] = arguments[_i];
            }
            if (level >= INFO) {
                logger.info.apply(logger, Array.from(args));
            }
        };
        Log.warn = function () {
            var args = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                args[_i - 0] = arguments[_i];
            }
            if (level >= WARN) {
                logger.warn.apply(logger, Array.from(args));
            }
        };
        Log.error = function () {
            var args = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                args[_i - 0] = arguments[_i];
            }
            if (level >= ERROR) {
                logger.error.apply(logger, Array.from(args));
            }
        };
        return Log;
    }());
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = Log;
    Log.reset();
});
// Copyright (c) Brock Allen & Dominick Baier. All rights reserved.
// Licensed under the Apache License, Version 2.0. See LICENSE in the project root for license information.
define("src/Global", ["require", "exports"], function (require, exports) {
    "use strict";
    var timer = {
        setTimeout: function (cb, duration) {
            return setTimeout(cb, duration);
        },
        clearTimeout: function (handle) {
            return clearTimeout(handle);
        }
    };
    var testing = false;
    var Global = (function () {
        function Global() {
        }
        Global._testing = function () {
            testing = true;
        };
        Object.defineProperty(Global, "location", {
            get: function () {
                if (!testing) {
                    return location;
                }
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Global, "localStorage", {
            get: function () {
                if (!testing) {
                    return localStorage;
                }
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Global, "sessionStorage", {
            get: function () {
                if (!testing) {
                    return sessionStorage;
                }
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Global, "XMLHttpRequest", {
            get: function () {
                if (!testing) {
                    return XMLHttpRequest;
                }
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Global, "timer", {
            get: function () {
                if (!testing) {
                    return timer;
                }
            },
            enumerable: true,
            configurable: true
        });
        return Global;
    }());
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = Global;
    ;
});
// Copyright (c) Brock Allen & Dominick Baier. All rights reserved.
// Licensed under the Apache License, Version 2.0. See LICENSE in the project root for license information.
define("src/Event", ["require", "exports", "src/Log"], function (require, exports, Log_1) {
    "use strict";
    var Event = (function () {
        function Event(name) {
            this._name = name;
            this._callbacks = [];
        }
        Event.prototype.addHandler = function (cb) {
            this._callbacks.push(cb);
        };
        Event.prototype.removeHandler = function (cb) {
            var idx = this._callbacks.findIndex(function (item) { return item === cb; });
            if (idx >= 0) {
                this._callbacks.splice(idx, 1);
            }
        };
        Event.prototype.raise = function () {
            var params = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                params[_i - 0] = arguments[_i];
            }
            Log_1.default.info("Raising event: " + this._name);
            for (var _a = 0, _b = this._callbacks; _a < _b.length; _a++) {
                var cb = _b[_a];
                cb.apply(void 0, params);
            }
        };
        return Event;
    }());
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = Event;
});
// Copyright (c) Brock Allen & Dominick Baier. All rights reserved.
// Licensed under the Apache License, Version 2.0. See LICENSE in the project root for license information.
define("src/Timer", ["require", "exports", "src/Global", "src/Event"], function (require, exports, Global_1, Event_1) {
    "use strict";
    var Timer = (function (_super) {
        __extends(Timer, _super);
        function Timer(name, timer) {
            if (timer === void 0) { timer = Global_1.default.timer; }
            _super.call(this, name);
            this._timer = timer;
        }
        Timer.prototype.init = function (duration) {
            this.cancel();
            if (duration <= 0) {
                duration = 1;
            }
            this._timerHandle = this._timer.setTimeout(this._callback.bind(this), duration * 1000);
        };
        Timer.prototype.cancel = function () {
            if (this._timerHandle) {
                this._timer.clearTimeout(this._timerHandle);
                this._timerHandle = null;
            }
        };
        Timer.prototype._callback = function () {
            this._timerHandle = null;
            _super.prototype.raise.call(this);
        };
        return Timer;
    }(Event_1.default));
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = Timer;
});
// Copyright (c) Brock Allen & Dominick Baier. All rights reserved.
// Licensed under the Apache License, Version 2.0. See LICENSE in the project root for license information.
define("src/AccessTokenEvents", ["require", "exports", "src/Log", "src/Timer"], function (require, exports, Log_2, Timer_1) {
    "use strict";
    var DefaultAccessTokenExpiringNotificationTime = 60;
    var AccessTokenEvents = (function () {
        function AccessTokenEvents(_a) {
            var _b = _a === void 0 ? {} : _a, _c = _b.accessTokenExpiringNotificationTime, accessTokenExpiringNotificationTime = _c === void 0 ? DefaultAccessTokenExpiringNotificationTime : _c, _d = _b.accessTokenExpiringTimer, accessTokenExpiringTimer = _d === void 0 ? new Timer_1.default("Access token expiring") : _d, _e = _b.accessTokenExpiredTimer, accessTokenExpiredTimer = _e === void 0 ? new Timer_1.default("Access token expired") : _e;
            this._accessTokenExpiringNotificationTime = accessTokenExpiringNotificationTime;
            this._accessTokenExpiring = accessTokenExpiringTimer;
            this._accessTokenExpired = accessTokenExpiredTimer;
        }
        AccessTokenEvents.prototype.load = function (container) {
            Log_2.default.info("AccessTokenEvents.load");
            this._cancelTimers();
            // only register events if there's an access token where we care about expiration
            if (container.access_token) {
                var duration = container.expires_in;
                Log_2.default.info("access token present, remaining duration:", duration);
                if (duration > 0) {
                    // only register expiring if we still have time
                    var expiring = duration - this._accessTokenExpiringNotificationTime;
                    if (expiring <= 0) {
                        expiring = 1;
                    }
                    Log_2.default.info("registering expiring timer in:", expiring);
                    this._accessTokenExpiring.init(expiring);
                }
                // always register expired. if it's negative, it will still fire
                var expired = duration + 1;
                Log_2.default.info("registering expired timer in:", expired);
                this._accessTokenExpired.init(expired);
            }
        };
        AccessTokenEvents.prototype.unload = function () {
            Log_2.default.info("AccessTokenEvents.unload");
            this._cancelTimers();
        };
        AccessTokenEvents.prototype._cancelTimers = function () {
            Log_2.default.info("canceling existing access token timers");
            this._accessTokenExpiring.cancel();
            this._accessTokenExpired.cancel();
        };
        AccessTokenEvents.prototype.addAccessTokenExpiring = function (cb) {
            this._accessTokenExpiring.addHandler(cb);
        };
        AccessTokenEvents.prototype.removeAccessTokenExpiring = function (cb) {
            this._accessTokenExpiring.removeHandler(cb);
        };
        AccessTokenEvents.prototype.addAccessTokenExpired = function (cb) {
            this._accessTokenExpired.addHandler(cb);
        };
        AccessTokenEvents.prototype.removeAccessTokenExpired = function (cb) {
            this._accessTokenExpired.removeHandler(cb);
        };
        return AccessTokenEvents;
    }());
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = AccessTokenEvents;
});
// Copyright (c) Brock Allen & Dominick Baier. All rights reserved.
// Licensed under the Apache License, Version 2.0. See LICENSE in the project root for license information.
define("src/ErrorResponse", ["require", "exports", "src/Log"], function (require, exports, Log_3) {
    "use strict";
    var ErrorResponse = (function (_super) {
        __extends(ErrorResponse, _super);
        function ErrorResponse(_a) {
            var _b = _a === void 0 ? {} : _a, _c = _b.error, error = _c === void 0 ? "" : _c, _d = _b.error_description, error_description = _d === void 0 ? "" : _d, _e = _b.error_uri, error_uri = _e === void 0 ? "" : _e, _f = _b.state, state = _f === void 0 ? "" : _f;
            if (!error) {
                Log_3.default.error("No error passed to ErrorResponse");
                throw new Error("error");
            }
            _super.call(this, error_description || error);
            this.name = "ErrorResponse";
            this._error = error;
            this._error_description = error_description;
            this._error_uri = error_uri;
            this._state = state;
        }
        return ErrorResponse;
    }(Error));
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = ErrorResponse;
});
// Copyright (c) Brock Allen & Dominick Baier. All rights reserved.
// Licensed under the Apache License, Version 2.0. See LICENSE in the project root for license information.
define("src/IFrameWindow", ["require", "exports", "src/Log"], function (require, exports, Log_4) {
    "use strict";
    var DefaultTimeout = 5000;
    var IFrameWindow = (function () {
        function IFrameWindow() {
            var _this = this;
            Log_4.default.info("IFrameWindow.ctor");
            this._promise = new Promise(function (resolve, reject) {
                _this._resolve = resolve;
                _this._reject = reject;
            });
            this._boundMessageEvent = this._message.bind(this);
            window.addEventListener("message", this._boundMessageEvent, false);
            this._frame = window.document.createElement("iframe");
            this._frame.style.display = "none";
            window.document.body.appendChild(this._frame);
        }
        IFrameWindow.prototype.navigate = function (params) {
            Log_4.default.info("IFrameWindow.navigate");
            if (!params || !params.url) {
                this._error("No url provided");
            }
            else {
                this._timer = window.setTimeout(this._timeout.bind(this), DefaultTimeout);
                this._frame.src = params.url;
            }
            return this.promise;
        };
        Object.defineProperty(IFrameWindow.prototype, "promise", {
            get: function () {
                return this._promise;
            },
            enumerable: true,
            configurable: true
        });
        IFrameWindow.prototype._success = function (data) {
            this._cleanup();
            Log_4.default.info("Successful response from frame window");
            this._resolve(data);
        };
        IFrameWindow.prototype._error = function (message) {
            this._cleanup();
            Log_4.default.error(message);
            this._reject(new Error(message));
        };
        IFrameWindow.prototype._cleanup = function () {
            Log_4.default.info("IFrameWindow._cleanup");
            window.removeEventListener("message", this._boundMessageEvent, false);
            window.clearTimeout(this._timer);
            window.document.body.removeChild(this._frame);
            this._timer = null;
            this._frame = null;
            this._boundMessageEvent = null;
        };
        IFrameWindow.prototype._timeout = function () {
            Log_4.default.info("IFrameWindow._timeout");
            this._error("Frame window timed out");
        };
        IFrameWindow.prototype._message = function (e) {
            Log_4.default.info("IFrameWindow._message");
            if (this._timer &&
                e.origin === this._origin &&
                e.source === this._frame.contentWindow) {
                var url = e.data;
                if (url) {
                    this._success({ url: url });
                }
                else {
                    this._error("Invalid response from frame");
                }
            }
        };
        Object.defineProperty(IFrameWindow.prototype, "_origin", {
            get: function () {
                return location.protocol + "//" + location.host;
            },
            enumerable: true,
            configurable: true
        });
        IFrameWindow.notifyParent = function (url) {
            Log_4.default.info("IFrameWindow.notifyParent");
            if (window.parent && window !== window.parent) {
                url = url || window.location.href;
                if (url) {
                    Log_4.default.info("posting url message to parent");
                    window.parent.postMessage(url, location.protocol + "//" + location.host);
                }
            }
        };
        return IFrameWindow;
    }());
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = IFrameWindow;
});
// Copyright (c) Brock Allen & Dominick Baier. All rights reserved.
// Licensed under the Apache License, Version 2.0. See LICENSE in the project root for license information.
define("src/IFrameNavigator", ["require", "exports", "src/Log", "src/IFrameWindow"], function (require, exports, Log_5, IFrameWindow_1) {
    "use strict";
    var IFrameNavigator = (function () {
        function IFrameNavigator() {
        }
        IFrameNavigator.prototype.prepare = function () {
            var frame = new IFrameWindow_1.default();
            return Promise.resolve(frame);
        };
        IFrameNavigator.prototype.callback = function (url) {
            Log_5.default.info("IFrameNavigator.callback");
            try {
                IFrameWindow_1.default.notifyParent(url);
                return Promise.resolve();
            }
            catch (e) {
                return Promise.reject(e);
            }
        };
        return IFrameNavigator;
    }());
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = IFrameNavigator;
});
// Copyright (c) Brock Allen & Dominick Baier. All rights reserved.
// Licensed under the Apache License, Version 2.0. See LICENSE in the project root for license information.
define("src/InMemoryWebStorage", ["require", "exports", "src/Log"], function (require, exports, Log_6) {
    "use strict";
    var InMemoryWebStorage = (function () {
        function InMemoryWebStorage() {
            this._data = {};
        }
        InMemoryWebStorage.prototype.getItem = function (key) {
            Log_6.default.info("InMemoryWebStorage.getItem", key);
            return this._data[key];
        };
        InMemoryWebStorage.prototype.setItem = function (key, value) {
            Log_6.default.info("InMemoryWebStorage.setItem", key);
            this._data[key] = value;
        };
        InMemoryWebStorage.prototype.removeItem = function (key) {
            Log_6.default.info("InMemoryWebStorage.removeItem", key);
            delete this._data[key];
        };
        Object.defineProperty(InMemoryWebStorage.prototype, "length", {
            get: function () {
                return Object.getOwnPropertyNames(this._data).length;
            },
            enumerable: true,
            configurable: true
        });
        InMemoryWebStorage.prototype.key = function (index) {
            return Object.getOwnPropertyNames(this._data)[index];
        };
        return InMemoryWebStorage;
    }());
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = InMemoryWebStorage;
});
// Copyright (c) Brock Allen & Dominick Baier. All rights reserved.
// Licensed under the Apache License, Version 2.0. See LICENSE in the project root for license information.
define("src/JoseUtil", ["require", "exports", 'jsrsasign', "src/Log"], function (require, exports, jsrsasign_1, Log_7) {
    "use strict";
    var AllowedSigningAlgs = ['RS256', 'RS384', 'RS512', 'PS256', 'PS384', 'PS512', 'ES256', 'ES384', 'ES512'];
    var JoseUtil = (function () {
        function JoseUtil() {
        }
        JoseUtil.parseJwt = function (jwt) {
            Log_7.default.info("JoseUtil.parseJwt");
            try {
                var token = jsrsasign_1.jws.JWS.parse(jwt);
                return {
                    header: token.headerObj,
                    payload: token.payloadObj
                };
            }
            catch (e) {
                Log_7.default.error(e);
            }
        };
        JoseUtil.validateJwt = function (jwt, key, issuer, audience, clockSkew, now) {
            Log_7.default.info("JoseUtil.validateJwt");
            try {
                if (key.kty === "RSA") {
                    if (key.e && key.n) {
                        key = jsrsasign_1.KEYUTIL.getKey(key);
                    }
                    else if (key.x5c && key.x5c.length) {
                        key = jsrsasign_1.KEYUTIL.getKey(jsrsasign_1.X509.getPublicKeyFromCertPEM(key.x5c[0]));
                    }
                    else {
                        Log_7.default.error("RSA key missing key material", key);
                        return Promise.reject(new Error("RSA key missing key material"));
                    }
                }
                else if (key.kty === "EC") {
                    if (key.crv && key.x && key.y) {
                        key = jsrsasign_1.KEYUTIL.getKey(key);
                    }
                    else {
                        Log_7.default.error("EC key missing key material", key);
                        return Promise.reject(new Error("EC key missing key material"));
                    }
                }
                else {
                    Log_7.default.error("Unsupported key type", key && key.kty);
                    return Promise.reject(new Error("Unsupported key type: " + key && key.kty));
                }
                return JoseUtil._validateJwt(jwt, key, issuer, audience, clockSkew, now);
            }
            catch (e) {
                Log_7.default.error(e && e.message || e);
                return Promise.reject("JWT validation failed");
            }
        };
        JoseUtil._validateJwt = function (jwt, key, issuer, audience, clockSkew, now) {
            Log_7.default.info("JoseUtil._validateJwt");
            if (!clockSkew) {
                clockSkew = 0;
            }
            if (!now) {
                now = Date.now() / 1000;
            }
            var payload = JoseUtil.parseJwt(jwt).payload;
            if (payload.iss !== issuer) {
                Log_7.default.error("Invalid issuer in token", payload.iss);
                return Promise.reject(new Error("Invalid issuer in token: " + payload.iss));
            }
            if (payload.aud !== audience) {
                Log_7.default.error("Invalid audience in token", payload.aud);
                return Promise.reject(new Error("Invalid audience in token: " + payload.aud));
            }
            var lowerNow = now + clockSkew;
            var upperNow = now - clockSkew;
            if (lowerNow < payload.iat) {
                Log_7.default.error("iat is in the future", payload.iat);
                return Promise.reject(new Error("iat is in the future: " + payload.iat));
            }
            if (lowerNow < payload.nbf) {
                Log_7.default.error("nbf is in the future", payload.nbf);
                return Promise.reject(new Error("nbf is in the future: " + payload.nbf));
            }
            if (payload.exp < upperNow) {
                Log_7.default.error("exp is in the past", payload.exp);
                return Promise.reject(new Error("exp is in the past:" + payload.exp));
            }
            try {
                if (!jsrsasign_1.jws.JWS.verify(jwt, key, AllowedSigningAlgs)) {
                    Log_7.default.error("signature validation failed");
                    return Promise.reject(new Error("signature validation failed"));
                }
            }
            catch (e) {
                Log_7.default.error(e && e.message || e);
                return Promise.reject(new Error("signature validation failed"));
            }
            return Promise.resolve();
        };
        JoseUtil.hashString = function (value, alg) {
            Log_7.default.info("JoseUtil.hashString", value, alg);
            try {
                return jsrsasign_1.crypto.Util.hashString(value, alg);
            }
            catch (e) {
                Log_7.default.error(e);
            }
        };
        JoseUtil.hexToBase64Url = function (value) {
            Log_7.default.info("JoseUtil.hexToBase64Url", value);
            try {
                return jsrsasign_1.hextob64u(value);
            }
            catch (e) {
                Log_7.default.error(e);
            }
        };
        return JoseUtil;
    }());
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = JoseUtil;
});
// Copyright (c) Brock Allen & Dominick Baier. All rights reserved.
// Licensed under the Apache License, Version 2.0. See LICENSE in the project root for license information.
define("src/JsonService", ["require", "exports", "src/Log", "src/Global"], function (require, exports, Log_8, Global_2) {
    "use strict";
    var JsonService = (function () {
        function JsonService(XMLHttpRequestCtor) {
            if (XMLHttpRequestCtor === void 0) { XMLHttpRequestCtor = Global_2.default.XMLHttpRequest; }
            this._XMLHttpRequest = XMLHttpRequestCtor;
        }
        JsonService.prototype.getJson = function (url, token) {
            var _this = this;
            Log_8.default.info("JsonService.getJson", url);
            if (!url) {
                Log_8.default.error("No url passed");
                throw new Error("url");
            }
            return new Promise(function (resolve, reject) {
                var req = new _this._XMLHttpRequest();
                req.open('GET', url);
                req.onload = function () {
                    Log_8.default.info("HTTP response received, status", req.status);
                    if (req.status === 200) {
                        resolve(JSON.parse(req.responseText));
                    }
                    else {
                        reject(Error(req.statusText + " (" + req.status + ")"));
                    }
                };
                req.onerror = function () {
                    Log_8.default.error("network error");
                    reject(Error("Network Error"));
                };
                if (token) {
                    Log_8.default.info("token passed, setting Authorization header");
                    req.setRequestHeader("Authorization", "Bearer " + token);
                }
                req.send();
            });
        };
        return JsonService;
    }());
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = JsonService;
});
// Copyright (c) Brock Allen & Dominick Baier. All rights reserved.
// Licensed under the Apache License, Version 2.0. See LICENSE in the project root for license information.
define("src/MetadataService", ["require", "exports", "src/Log", "src/JsonService"], function (require, exports, Log_9, JsonService_1) {
    "use strict";
    var MetadataService = (function () {
        function MetadataService(settings, JsonServiceCtor) {
            if (JsonServiceCtor === void 0) { JsonServiceCtor = JsonService_1.default; }
            if (!settings) {
                Log_9.default.error("No settings passed to MetadataService");
                throw new Error("settings");
            }
            this._settings = settings;
            this._jsonService = new JsonServiceCtor();
        }
        MetadataService.prototype.getMetadata = function () {
            var _this = this;
            Log_9.default.info("MetadataService.getMetadata");
            if (this._settings.metadata) {
                Log_9.default.info("Returning metadata from settings");
                return Promise.resolve(this._settings.metadata);
            }
            if (!this._settings.metadataUrl) {
                Log_9.default.error("No metadataUrl configured on settings");
                return Promise.reject(new Error("No metadataUrl configured on settings"));
            }
            Log_9.default.info("getting metadata from", this._settings.metadataUrl);
            return this._jsonService.getJson(this._settings.metadataUrl)
                .then(function (metadata) {
                Log_9.default.info("json received");
                _this._settings.metadata = metadata;
                return metadata;
            });
        };
        MetadataService.prototype.getIssuer = function () {
            Log_9.default.info("MetadataService.getIssuer");
            return this._getMetadataProperty("issuer");
        };
        MetadataService.prototype.getAuthorizationEndpoint = function () {
            Log_9.default.info("MetadataService.getAuthorizationEndpoint");
            return this._getMetadataProperty("authorization_endpoint");
        };
        MetadataService.prototype.getUserInfoEndpoint = function () {
            Log_9.default.info("MetadataService.getUserInfoEndpoint");
            return this._getMetadataProperty("userinfo_endpoint");
        };
        MetadataService.prototype.getCheckSessionIframe = function () {
            Log_9.default.info("MetadataService.getCheckSessionIframe");
            return this._getMetadataProperty("check_session_iframe");
        };
        MetadataService.prototype.getEndSessionEndpoint = function () {
            Log_9.default.info("MetadataService.getEndSessionEndpoint");
            return this._getMetadataProperty("end_session_endpoint");
        };
        MetadataService.prototype._getMetadataProperty = function (name) {
            Log_9.default.info("MetadataService._getMetadataProperty", name);
            return this.getMetadata().then(function (metadata) {
                Log_9.default.info("metadata recieved");
                if (metadata[name] === undefined) {
                    Log_9.default.error("Metadata does not contain property " + name);
                    throw new Error("Metadata does not contain property " + name);
                }
                return metadata[name];
            });
        };
        MetadataService.prototype.getSigningKeys = function () {
            var _this = this;
            Log_9.default.info("MetadataService.getSigningKeys");
            if (this._settings.signingKeys) {
                Log_9.default.info("Returning signingKeys from settings");
                return Promise.resolve(this._settings.signingKeys);
            }
            return this._getMetadataProperty("jwks_uri").then(function (jwks_uri) {
                Log_9.default.info("jwks_uri received", jwks_uri);
                return _this._jsonService.getJson(jwks_uri).then(function (keySet) {
                    Log_9.default.info("key set received", keySet);
                    if (!keySet.keys) {
                        Log_9.default.error("Missing keys on keyset");
                        throw new Error("Missing keys on keyset");
                    }
                    var filteredKeys = _this._filterSigningKeys(keySet.keys);
                    Log_9.default.info("filtered keys", filteredKeys);
                    _this._settings.signingKeys = filteredKeys;
                    return _this._settings.signingKeys;
                });
            });
        };
        MetadataService.prototype._filterSigningKeys = function (keys) {
            Log_9.default.info("MetadataService._filterSigningKeys", keys);
            return keys.filter(function (item) {
                return item.use === "sig";
            });
        };
        return MetadataService;
    }());
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = MetadataService;
});
// Copyright (c) Brock Allen & Dominick Baier. All rights reserved.
// Licensed under the Apache License, Version 2.0. See LICENSE in the project root for license information.
define("src/WebStorageStateStore", ["require", "exports", "src/Log", "src/Global"], function (require, exports, Log_10, Global_3) {
    "use strict";
    var WebStorageStateStore = (function () {
        function WebStorageStateStore(_a) {
            var _b = _a === void 0 ? {} : _a, _c = _b.prefix, prefix = _c === void 0 ? "oidc." : _c, _d = _b.store, store = _d === void 0 ? Global_3.default.localStorage : _d;
            this._store = store;
            this._prefix = prefix;
        }
        WebStorageStateStore.prototype.set = function (key, value) {
            Log_10.default.info("WebStorageStateStore.set", key);
            key = this._prefix + key;
            this._store.setItem(key, value);
            return Promise.resolve();
        };
        WebStorageStateStore.prototype.get = function (key) {
            Log_10.default.info("WebStorageStateStore.get", key);
            key = this._prefix + key;
            var item = this._store.getItem(key);
            return Promise.resolve(item);
        };
        WebStorageStateStore.prototype.remove = function (key) {
            Log_10.default.info("WebStorageStateStore.remove", key);
            key = this._prefix + key;
            var item = this._store.getItem(key);
            this._store.removeItem(key);
            return Promise.resolve(item);
        };
        WebStorageStateStore.prototype.getAllKeys = function () {
            Log_10.default.info("WebStorageStateStore.getAllKeys");
            var keys = [];
            for (var index = 0; index < this._store.length; index++) {
                var key = this._store.key(index);
                if (key.indexOf(this._prefix) === 0) {
                    keys.push(key.substr(this._prefix.length));
                }
            }
            return Promise.resolve(keys);
        };
        return WebStorageStateStore;
    }());
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = WebStorageStateStore;
});
// Copyright (c) Brock Allen & Dominick Baier. All rights reserved.
// Licensed under the Apache License, Version 2.0. See LICENSE in the project root for license information.
define("src/UserInfoService", ["require", "exports", "src/JsonService", "src/MetadataService", "src/Log"], function (require, exports, JsonService_2, MetadataService_1, Log_11) {
    "use strict";
    var UserInfoService = (function () {
        function UserInfoService(settings, JsonServiceCtor, MetadataServiceCtor) {
            if (JsonServiceCtor === void 0) { JsonServiceCtor = JsonService_2.default; }
            if (MetadataServiceCtor === void 0) { MetadataServiceCtor = MetadataService_1.default; }
            if (!settings) {
                Log_11.default.error("No settings passed to UserInfoService");
                throw new Error("settings");
            }
            this._settings = settings;
            this._jsonService = new JsonServiceCtor();
            this._metadataService = new MetadataServiceCtor(this._settings);
        }
        UserInfoService.prototype.getClaims = function (token) {
            var _this = this;
            Log_11.default.info("UserInfoService.getClaims");
            if (!token) {
                Log_11.default.error("No token passed");
                return Promise.reject(new Error("A token is required"));
            }
            return this._metadataService.getUserInfoEndpoint().then(function (url) {
                Log_11.default.info("received userinfo url", url);
                return _this._jsonService.getJson(url, token).then(function (claims) {
                    Log_11.default.info("claims received", claims);
                    return claims;
                });
            });
        };
        return UserInfoService;
    }());
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = UserInfoService;
});
// Copyright (c) Brock Allen & Dominick Baier. All rights reserved.
// Licensed under the Apache License, Version 2.0. See LICENSE in the project root for license information.
define("src/ResponseValidator", ["require", "exports", "src/Log", "src/MetadataService", "src/UserInfoService", "src/ErrorResponse", "src/JoseUtil"], function (require, exports, Log_12, MetadataService_2, UserInfoService_1, ErrorResponse_1, JoseUtil_1) {
    "use strict";
    var ProtocolClaims = ["nonce", "at_hash", "iat", "nbf", "exp", "aud", "iss", "c_hash"];
    var ResponseValidator = (function () {
        function ResponseValidator(settings, MetadataServiceCtor, UserInfoServiceCtor, joseUtil) {
            if (MetadataServiceCtor === void 0) { MetadataServiceCtor = MetadataService_2.default; }
            if (UserInfoServiceCtor === void 0) { UserInfoServiceCtor = UserInfoService_1.default; }
            if (joseUtil === void 0) { joseUtil = JoseUtil_1.default; }
            if (!settings) {
                Log_12.default.error("No settings passed to ResponseValidator");
                throw new Error("settings");
            }
            this._settings = settings;
            this._metadataService = new MetadataServiceCtor(this._settings);
            this._userInfoService = new UserInfoServiceCtor(this._settings);
            this._joseUtil = joseUtil;
        }
        ResponseValidator.prototype.validateSigninResponse = function (state, response) {
            var _this = this;
            Log_12.default.info("ResponseValidator.validateSigninResponse");
            return this._processSigninParams(state, response).then(function (response) {
                Log_12.default.info("state processed");
                return _this._validateTokens(state, response).then(function (response) {
                    Log_12.default.info("tokens validated");
                    return _this._processClaims(response).then(function (response) {
                        Log_12.default.info("claims processed");
                        return response;
                    });
                });
            });
        };
        ResponseValidator.prototype.validateSignoutResponse = function (state, response) {
            Log_12.default.info("ResponseValidator.validateSignoutResponse");
            if (state.id !== response.state) {
                Log_12.default.error("State does not match");
                return Promise.reject(new Error("State does not match"));
            }
            // now that we know the state matches, take the stored data
            // and set it into the response so callers can get their state
            // this is important for both success & error outcomes
            Log_12.default.info("state validated");
            response.state = state.data;
            if (response.error) {
                Log_12.default.warn("Response was error", response.error);
                return Promise.reject(new ErrorResponse_1.default(response));
            }
            return Promise.resolve(response);
        };
        ResponseValidator.prototype._processSigninParams = function (state, response) {
            Log_12.default.info("ResponseValidator._processSigninParams");
            if (state.id !== response.state) {
                Log_12.default.error("State does not match");
                return Promise.reject(new Error("State does not match"));
            }
            if (!state.client_id) {
                Log_12.default.error("No client_id on state");
                return Promise.reject(new Error("No client_id on state"));
            }
            if (!state.authority) {
                Log_12.default.error("No authority on state");
                return Promise.reject(new Error("No authority on state"));
            }
            // this allows the authority to be loaded from the signin state
            if (!this._settings.authority) {
                this._settings.authority = state.authority;
            }
            else if (this._settings.authority && this._settings.authority !== state.authority) {
                Log_12.default.error("authority mismatch on settings vs. signin state");
                return Promise.reject(new Error("authority mismatch on settings vs. signin state"));
            }
            // this allows the client_id to be loaded from the signin state
            if (!this._settings.client_id) {
                this._settings.client_id = state.client_id;
            }
            else if (this._settings.client_id && this._settings.client_id !== state.client_id) {
                Log_12.default.error("client_id mismatch on settings vs. signin state");
                return Promise.reject(new Error("client_id mismatch on settings vs. signin state"));
            }
            // now that we know the state matches, take the stored data
            // and set it into the response so callers can get their state
            // this is important for both success & error outcomes
            Log_12.default.info("state validated");
            response.state = state.data;
            if (response.error) {
                Log_12.default.warn("Response was error", response.error);
                return Promise.reject(new ErrorResponse_1.default(response));
            }
            if (state.nonce && !response.id_token) {
                Log_12.default.error("Expecting id_token in response");
                return Promise.reject(new Error("No id_token in response"));
            }
            if (!state.nonce && response.id_token) {
                Log_12.default.error("Not expecting id_token in response");
                return Promise.reject(new Error("Unexpected id_token in response"));
            }
            return Promise.resolve(response);
        };
        ResponseValidator.prototype._processClaims = function (response) {
            var _this = this;
            Log_12.default.info("ResponseValidator._processClaims");
            if (response.isOpenIdConnect) {
                Log_12.default.info("response is OIDC, processing claims");
                response.profile = this._filterProtocolClaims(response.profile);
                if (this._settings.loadUserInfo && response.access_token) {
                    Log_12.default.info("loading user info");
                    return this._userInfoService.getClaims(response.access_token).then(function (claims) {
                        response.profile = _this._mergeClaims(response.profile, claims);
                        Log_12.default.info("user info claims received, updated profile:", response.profile);
                        return response;
                    });
                }
                else {
                    Log_12.default.info("not loading user info");
                }
            }
            else {
                Log_12.default.info("response is not OIDC, not processing claims");
            }
            return Promise.resolve(response);
        };
        ResponseValidator.prototype._mergeClaims = function (claims1, claims2) {
            var result = Object.assign({}, claims1);
            for (var name_1 in claims2) {
                var values = claims2[name_1];
                if (!Array.isArray(values)) {
                    values = [values];
                }
                for (var _i = 0, values_1 = values; _i < values_1.length; _i++) {
                    var value = values_1[_i];
                    if (!result[name_1]) {
                        result[name_1] = value;
                    }
                    else if (Array.isArray(result[name_1])) {
                        if (result[name_1].indexOf(value) < 0) {
                            result[name_1].push(value);
                        }
                    }
                    else if (result[name_1] !== value) {
                        result[name_1] = [result[name_1], value];
                    }
                }
            }
            return result;
        };
        ResponseValidator.prototype._filterProtocolClaims = function (claims) {
            Log_12.default.info("ResponseValidator._filterProtocolClaims, incoming claims:", claims);
            var result = Object.assign({}, claims);
            if (this._settings._filterProtocolClaims) {
                ProtocolClaims.forEach(function (type) {
                    delete result[type];
                });
                Log_12.default.info("protocol claims filtered", result);
            }
            else {
                Log_12.default.info("protocol claims not filtered");
            }
            return result;
        };
        ResponseValidator.prototype._validateTokens = function (state, response) {
            Log_12.default.info("ResponseValidator._validateTokens");
            if (response.id_token) {
                if (response.access_token) {
                    Log_12.default.info("Validating id_token and access_token");
                    return this._validateIdTokenAndAccessToken(state, response);
                }
                Log_12.default.info("Validating id_token");
                return this._validateIdToken(state, response);
            }
            Log_12.default.info("No id_token to validate");
            return Promise.resolve(response);
        };
        ResponseValidator.prototype._validateIdTokenAndAccessToken = function (state, response) {
            var _this = this;
            Log_12.default.info("ResponseValidator._validateIdTokenAndAccessToken");
            return this._validateIdToken(state, response).then(function (response) {
                return _this._validateAccessToken(response);
            });
        };
        ResponseValidator.prototype._validateIdToken = function (state, response) {
            var _this = this;
            Log_12.default.info("ResponseValidator._validateIdToken");
            if (!state.nonce) {
                Log_12.default.error("No nonce on state");
                return Promise.reject(new Error("No nonce on state"));
            }
            var jwt = this._joseUtil.parseJwt(response.id_token);
            if (!jwt || !jwt.header || !jwt.payload) {
                Log_12.default.error("Failed to parse id_token", jwt);
                return Promise.reject(new Error("Failed to parse id_token"));
            }
            if (state.nonce !== jwt.payload.nonce) {
                Log_12.default.error("Invalid nonce in id_token");
                return Promise.reject(new Error("Invalid nonce in id_token"));
            }
            var kid = jwt.header.kid;
            if (!kid) {
                Log_12.default.error("No kid found in id_token");
                return Promise.reject(new Error("No kid found in id_token"));
            }
            return this._metadataService.getIssuer().then(function (issuer) {
                Log_12.default.info("Received issuer");
                return _this._metadataService.getSigningKeys().then(function (keys) {
                    if (!keys) {
                        Log_12.default.error("No signing keys from metadata");
                        return Promise.reject(new Error("No signing keys from metadata"));
                    }
                    Log_12.default.info("Received signing keys");
                    var key = keys.filter(function (key) {
                        return key.kid === kid;
                    })[0];
                    if (!key) {
                        Log_12.default.error("No key matching kid found in signing keys");
                        return Promise.reject(new Error("No key matching kid found in signing keys"));
                    }
                    var audience = state.client_id;
                    var clockSkewInSeconds = _this._settings.clockSkew;
                    Log_12.default.info("Validaing JWT; using clock skew (in seconds) of: ", clockSkewInSeconds);
                    return _this._joseUtil.validateJwt(response.id_token, key, issuer, audience, clockSkewInSeconds).then(function () {
                        Log_12.default.info("JWT validation successful");
                        response.profile = jwt.payload;
                        return response;
                    });
                });
            });
        };
        ResponseValidator.prototype._validateAccessToken = function (response) {
            Log_12.default.info("ResponseValidator._validateAccessToken");
            if (!response.profile) {
                Log_12.default.error("No profile loaded from id_token");
                return Promise.reject(new Error("No profile loaded from id_token"));
            }
            if (!response.profile.at_hash) {
                Log_12.default.error("No at_hash in id_token");
                return Promise.reject(new Error("No at_hash in id_token"));
            }
            if (!response.id_token) {
                Log_12.default.error("No id_token");
                return Promise.reject(new Error("No id_token"));
            }
            var jwt = this._joseUtil.parseJwt(response.id_token);
            if (!jwt || !jwt.header) {
                Log_12.default.error("Failed to parse id_token", jwt);
                return Promise.reject(new Error("Failed to parse id_token"));
            }
            var hashAlg = jwt.header.alg;
            if (!hashAlg || hashAlg.length !== 5) {
                Log_12.default.error("Unsupported alg:", hashAlg);
                return Promise.reject(new Error("Unsupported alg: " + hashAlg));
            }
            var hashBits = hashAlg.substr(2, 3);
            if (!hashBits) {
                Log_12.default.error("Unsupported alg:", hashAlg, hashBits);
                return Promise.reject(new Error("Unsupported alg: " + hashAlg));
            }
            hashBits = parseInt(hashBits);
            if (hashBits !== 256 && hashBits !== 384 && hashBits !== 512) {
                Log_12.default.error("Unsupported alg:", hashAlg, hashBits);
                return Promise.reject(new Error("Unsupported alg: " + hashAlg));
            }
            var sha = "sha" + hashBits;
            var hash = this._joseUtil.hashString(response.access_token, sha);
            if (!hash) {
                Log_12.default.error("access_token hash failed:", sha);
                return Promise.reject(new Error("Failed to validate at_hash"));
            }
            var left = hash.substr(0, hash.length / 2);
            var left_b64u = this._joseUtil.hexToBase64Url(left);
            if (left_b64u !== response.profile.at_hash) {
                Log_12.default.error("Failed to validate at_hash", left_b64u, response.profile.at_hash);
                return Promise.reject(new Error("Failed to validate at_hash"));
            }
            return Promise.resolve(response);
        };
        return ResponseValidator;
    }());
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = ResponseValidator;
});
// Copyright (c) Brock Allen & Dominick Baier. All rights reserved.
// Licensed under the Apache License, Version 2.0. See LICENSE in the project root for license information.
define("src/OidcClientSettings", ["require", "exports", "src/Log", "src/WebStorageStateStore", "src/ResponseValidator", "src/MetadataService"], function (require, exports, Log_13, WebStorageStateStore_1, ResponseValidator_1, MetadataService_3) {
    "use strict";
    var OidcMetadataUrlPath = '.well-known/openid-configuration';
    var DefaultResponseType = "id_token";
    var DefaultScope = "openid";
    var DefaultStaleStateAge = 60; // seconds
    var DefaultClockSkewInSeconds = 60 * 5;
    var OidcClientSettings = (function () {
        function OidcClientSettings(_a) {
            var _b = _a === void 0 ? {} : _a, _c = _b.authority, authority = _c === void 0 ? "" : _c, _d = _b.metadataUrl, metadataUrl = _d === void 0 ? "" : _d, _e = _b.metadata, metadata = _e === void 0 ? "" : _e, _f = _b.signingKeys, signingKeys = _f === void 0 ? "" : _f, _g = _b.client_id, client_id = _g === void 0 ? "" : _g, _h = _b.response_type, response_type = _h === void 0 ? DefaultResponseType : _h, _j = _b.scope, scope = _j === void 0 ? DefaultScope : _j, _k = _b.redirect_uri, redirect_uri = _k === void 0 ? "" : _k, _l = _b.post_logout_redirect_uri, post_logout_redirect_uri = _l === void 0 ? "" : _l, _m = _b.prompt, prompt = _m === void 0 ? "" : _m, _o = _b.display, display = _o === void 0 ? "" : _o, _p = _b.max_age, max_age = _p === void 0 ? "" : _p, _q = _b.ui_locales, ui_locales = _q === void 0 ? "" : _q, _r = _b.acr_values, acr_values = _r === void 0 ? "" : _r, _s = _b.filterProtocolClaims, filterProtocolClaims = _s === void 0 ? true : _s, _t = _b.loadUserInfo, loadUserInfo = _t === void 0 ? true : _t, _u = _b.staleStateAge, staleStateAge = _u === void 0 ? DefaultStaleStateAge : _u, _v = _b.clockSkew, clockSkew = _v === void 0 ? DefaultClockSkewInSeconds : _v, _w = _b.stateStore, stateStore = _w === void 0 ? new WebStorageStateStore_1.default() : _w, _x = _b.ResponseValidatorCtor, ResponseValidatorCtor = _x === void 0 ? ResponseValidator_1.default : _x, _y = _b.MetadataServiceCtor, MetadataServiceCtor = _y === void 0 ? MetadataService_3.default : _y;
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
            this._staleStateAge = staleStateAge;
            this._clockSkew = clockSkew;
            this._stateStore = stateStore;
            this._validator = new ResponseValidatorCtor(this);
            this._metadataService = new MetadataServiceCtor(this);
        }
        Object.defineProperty(OidcClientSettings.prototype, "client_id", {
            // client config
            get: function () {
                return this._client_id;
            },
            set: function (value) {
                if (!this._client_id) {
                    // one-time set only
                    this._client_id = value;
                }
                else {
                    Log_13.default.error("client_id has already been assigned.");
                    throw new Error("client_id has already been assigned.");
                }
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(OidcClientSettings.prototype, "response_type", {
            get: function () {
                return this._response_type;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(OidcClientSettings.prototype, "scope", {
            get: function () {
                return this._scope;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(OidcClientSettings.prototype, "redirect_uri", {
            get: function () {
                return this._redirect_uri;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(OidcClientSettings.prototype, "post_logout_redirect_uri", {
            get: function () {
                return this._post_logout_redirect_uri;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(OidcClientSettings.prototype, "prompt", {
            // optional protocol params
            get: function () {
                return this._prompt;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(OidcClientSettings.prototype, "display", {
            get: function () {
                return this._display;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(OidcClientSettings.prototype, "max_age", {
            get: function () {
                return this._max_age;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(OidcClientSettings.prototype, "ui_locales", {
            get: function () {
                return this._ui_locales;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(OidcClientSettings.prototype, "acr_values", {
            get: function () {
                return this._acr_values;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(OidcClientSettings.prototype, "authority", {
            // metadata
            get: function () {
                return this._authority;
            },
            set: function (value) {
                if (!this._authority) {
                    // one-time set only
                    this._authority = value;
                }
                else {
                    Log_13.default.error("authority has already been assigned.");
                    throw new Error("authority has already been assigned.");
                }
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(OidcClientSettings.prototype, "metadataUrl", {
            get: function () {
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
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(OidcClientSettings.prototype, "metadata", {
            // settable/cachable metadata values
            get: function () {
                return this._metadata;
            },
            set: function (value) {
                this._metadata = value;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(OidcClientSettings.prototype, "signingKeys", {
            get: function () {
                return this._signingKeys;
            },
            set: function (value) {
                this._signingKeys = value;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(OidcClientSettings.prototype, "filterProtocolClaims", {
            // behavior flags
            get: function () {
                return this._filterProtocolClaims;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(OidcClientSettings.prototype, "loadUserInfo", {
            get: function () {
                return this._loadUserInfo;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(OidcClientSettings.prototype, "staleStateAge", {
            get: function () {
                return this._staleStateAge;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(OidcClientSettings.prototype, "clockSkew", {
            get: function () {
                return this._clockSkew;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(OidcClientSettings.prototype, "stateStore", {
            get: function () {
                return this._stateStore;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(OidcClientSettings.prototype, "validator", {
            get: function () {
                return this._validator;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(OidcClientSettings.prototype, "metadataService", {
            get: function () {
                return this._metadataService;
            },
            enumerable: true,
            configurable: true
        });
        return OidcClientSettings;
    }());
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = OidcClientSettings;
});
// Copyright (c) Brock Allen & Dominick Baier. All rights reserved.
// Licensed under the Apache License, Version 2.0. See LICENSE in the project root for license information.
define("src/UrlUtility", ["require", "exports", "src/Log", "src/Global"], function (require, exports, Log_14, Global_4) {
    "use strict";
    var UrlUtility = (function () {
        function UrlUtility() {
        }
        UrlUtility.addQueryParam = function (url, name, value) {
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
        };
        UrlUtility.parseUrlFragment = function (value, delimiter, global) {
            if (delimiter === void 0) { delimiter = "#"; }
            if (global === void 0) { global = Global_4.default; }
            Log_14.default.info("UrlUtility.parseUrlFragment");
            if (typeof value !== 'string') {
                value = global.location.href;
            }
            var idx = value.lastIndexOf(delimiter);
            if (idx >= 0) {
                value = value.substr(idx + 1);
            }
            var params = {}, regex = /([^&=]+)=([^&]*)/g, m;
            var counter = 0;
            while (m = regex.exec(value)) {
                params[decodeURIComponent(m[1])] = decodeURIComponent(m[2]);
                if (counter++ > 50) {
                    Log_14.default.error("response exceeded expected number of parameters", value);
                    return {
                        error: "Response exceeded expected number of parameters"
                    };
                }
            }
            for (var prop in params) {
                return params;
            }
            return {};
        };
        return UrlUtility;
    }());
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = UrlUtility;
});
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
// NOTICE: the code in this file originally developed by Microsoft
// original source: https://github.com/AzureAD/azure-activedirectory-library-for-js/blob/master/lib/adal.js#L1029
define("src/random", ["require", "exports"], function (require, exports) {
    "use strict";
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
            }
            else if (guidHolder[i] === 'y') {
                // clock-seq-and-reserved first hex is filtered and remaining hex values are random
                r &= 0x3; // bit and with 0011 to set pos 2 to zero ?0??
                r |= 0x8; // set pos 3 to 1 as 1???
                guidResponse += hex[r];
            }
            else {
                guidResponse += guidHolder[i];
            }
        }
        return guidResponse;
    }
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = random;
});
// Copyright (c) Brock Allen & Dominick Baier. All rights reserved.
// Licensed under the Apache License, Version 2.0. See LICENSE in the project root for license information.
define("src/State", ["require", "exports", "src/Log", "src/random"], function (require, exports, Log_15, random_1) {
    "use strict";
    var State = (function () {
        function State(_a) {
            var _b = _a === void 0 ? {} : _a, _c = _b.id, id = _c === void 0 ? "" : _c, _d = _b.data, data = _d === void 0 ? {} : _d, _e = _b.created, created = _e === void 0 ? 0 : _e;
            this._id = id || random_1.default();
            this._data = data;
            if (typeof created === 'number' && created > 0) {
                this._created = created;
            }
            else {
                this._created = Date.now() / 1000;
            }
        }
        Object.defineProperty(State.prototype, "id", {
            get: function () {
                return this._id;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(State.prototype, "data", {
            get: function () {
                return this._data;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(State.prototype, "created", {
            get: function () {
                return this._created;
            },
            enumerable: true,
            configurable: true
        });
        State.prototype.toStorageString = function () {
            Log_15.default.info("State.toStorageString");
            return JSON.stringify({
                id: this.id,
                data: this.data,
                created: this.created
            });
        };
        State.fromStorageString = function (storageString) {
            Log_15.default.info("State.fromStorageString");
            return new State(JSON.parse(storageString));
        };
        State.clearStaleState = function (storage, age) {
            Log_15.default.info("State.clearStaleState");
            var cutoff = Date.now() / 1000 - age;
            return storage.getAllKeys().then(function (keys) {
                Log_15.default.info("got keys", keys);
                var promises = [];
                var _loop_1 = function(key) {
                    p = storage.get(key).then(function (item) {
                        var remove = false;
                        if (item) {
                            try {
                                var state = State.fromStorageString(item);
                                Log_15.default.info("got item from key: ", key, state.created);
                                if (state.created <= cutoff) {
                                    remove = true;
                                }
                            }
                            catch (e) {
                                Log_15.default.error("Error parsing state for key", key, e.message);
                                remove = true;
                            }
                        }
                        else {
                            Log_15.default.info("no item in storage for key: ", key);
                            remove = true;
                        }
                        if (remove) {
                            Log_15.default.info("removed item for key: ", key);
                            return storage.remove(key);
                        }
                    });
                    promises.push(p);
                };
                var p;
                for (var _i = 0, keys_1 = keys; _i < keys_1.length; _i++) {
                    var key = keys_1[_i];
                    _loop_1(key);
                }
                Log_15.default.info("waiting on promise count:", promises.length);
                return Promise.all(promises);
            });
        };
        return State;
    }());
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = State;
});
// Copyright (c) Brock Allen & Dominick Baier. All rights reserved.
// Licensed under the Apache License, Version 2.0. See LICENSE in the project root for license information.
define("src/SigninState", ["require", "exports", "src/Log", "src/State", "src/random"], function (require, exports, Log_16, State_1, random_2) {
    "use strict";
    var SigninState = (function (_super) {
        __extends(SigninState, _super);
        function SigninState(_a) {
            var _b = _a === void 0 ? {} : _a, _c = _b.nonce, nonce = _c === void 0 ? {} : _c, _d = _b.authority, authority = _d === void 0 ? "" : _d, _e = _b.client_id, client_id = _e === void 0 ? "" : _e;
            _super.call(this, arguments[0]);
            if (nonce) {
                this._nonce = random_2.default();
            }
            else if (nonce) {
                this._nonce = nonce;
            }
            this._authority = authority;
            this._client_id = client_id;
        }
        Object.defineProperty(SigninState.prototype, "nonce", {
            get: function () {
                return this._nonce;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(SigninState.prototype, "authority", {
            get: function () {
                return this._authority;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(SigninState.prototype, "client_id", {
            get: function () {
                return this._client_id;
            },
            enumerable: true,
            configurable: true
        });
        SigninState.prototype.toStorageString = function () {
            Log_16.default.info("SigninState.toStorageString");
            return JSON.stringify({
                id: this.id,
                data: this.data,
                created: this.created,
                nonce: this.nonce,
                authority: this.authority,
                client_id: this.client_id
            });
        };
        SigninState.fromStorageString = function (storageString) {
            Log_16.default.info("SigninState.fromStorageString");
            var data = JSON.parse(storageString);
            return new SigninState(data);
        };
        return SigninState;
    }(State_1.default));
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = SigninState;
});
// Copyright (c) Brock Allen & Dominick Baier. All rights reserved.
// Licensed under the Apache License, Version 2.0. See LICENSE in the project root for license information.
define("src/SigninRequest", ["require", "exports", "src/Log", "src/UrlUtility", "src/SigninState"], function (require, exports, Log_17, UrlUtility_1, SigninState_1) {
    "use strict";
    var SigninRequest = (function () {
        function SigninRequest(_a) {
            var url = _a.url, client_id = _a.client_id, redirect_uri = _a.redirect_uri, response_type = _a.response_type, scope = _a.scope, authority = _a.authority, data = _a.data, prompt = _a.prompt, display = _a.display, max_age = _a.max_age, ui_locales = _a.ui_locales, id_token_hint = _a.id_token_hint, login_hint = _a.login_hint, acr_values = _a.acr_values;
            if (!url) {
                Log_17.default.error("No url passed to SigninRequest");
                throw new Error("url");
            }
            if (!client_id) {
                Log_17.default.error("No client_id passed to SigninRequest");
                throw new Error("client_id");
            }
            if (!redirect_uri) {
                Log_17.default.error("No redirect_uri passed to SigninRequest");
                throw new Error("redirect_uri");
            }
            if (!response_type) {
                Log_17.default.error("No response_type passed to SigninRequest");
                throw new Error("response_type");
            }
            if (!scope) {
                Log_17.default.error("No scope passed to SigninRequest");
                throw new Error("scope");
            }
            if (!authority) {
                Log_17.default.error("No authority passed to SigninRequest");
                throw new Error("authority");
            }
            var oidc = SigninRequest.isOidc(response_type);
            this.state = new SigninState_1.default({ nonce: oidc, client_id: client_id, authority: authority });
            url = UrlUtility_1.default.addQueryParam(url, "client_id", client_id);
            url = UrlUtility_1.default.addQueryParam(url, "redirect_uri", redirect_uri);
            url = UrlUtility_1.default.addQueryParam(url, "response_type", response_type);
            url = UrlUtility_1.default.addQueryParam(url, "scope", scope);
            url = UrlUtility_1.default.addQueryParam(url, "state", this.state.id);
            if (oidc) {
                url = UrlUtility_1.default.addQueryParam(url, "nonce", this.state.nonce);
            }
            var optional = { prompt: prompt, display: display, max_age: max_age, ui_locales: ui_locales, id_token_hint: id_token_hint, login_hint: login_hint, acr_values: acr_values };
            for (var key in optional) {
                if (optional[key]) {
                    url = UrlUtility_1.default.addQueryParam(url, key, optional[key]);
                }
            }
            this.url = url;
        }
        SigninRequest.isOidc = function (response_type) {
            var result = response_type.split(/\s+/g).filter(function (item) {
                return item === "id_token";
            });
            return !!(result[0]);
        };
        SigninRequest.isOAuth = function (response_type) {
            var result = response_type.split(/\s+/g).filter(function (item) {
                return item === "token";
            });
            return !!(result[0]);
        };
        return SigninRequest;
    }());
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = SigninRequest;
});
// Copyright (c) Brock Allen & Dominick Baier. All rights reserved.
// Licensed under the Apache License, Version 2.0. See LICENSE in the project root for license information.
define("src/SigninResponse", ["require", "exports", "src/UrlUtility"], function (require, exports, UrlUtility_2) {
    "use strict";
    var OidcScope = "openid";
    var SigninResponse = (function () {
        function SigninResponse(url) {
            var values = UrlUtility_2.default.parseUrlFragment(url, "#");
            this.error = values.error;
            this.error_description = values.error_description;
            this.error_uri = values.error_uri;
            this.state = values.state;
            this.id_token = values.id_token;
            this.session_state = values.session_state;
            this.access_token = values.access_token;
            this.token_type = values.token_type;
            this.scope = values.scope;
            this.profile = undefined; // will be set from ResponseValidator
            var expires_in = parseInt(values.expires_in);
            if (typeof expires_in === 'number' && expires_in > 0) {
                this.expires_at = (Date.now() / 1000) + expires_in;
            }
        }
        Object.defineProperty(SigninResponse.prototype, "expires_in", {
            get: function () {
                if (this.expires_at) {
                    return this.expires_at - (Date.now() / 1000);
                }
                return undefined;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(SigninResponse.prototype, "expired", {
            get: function () {
                var expires_in = this.expires_in;
                if (expires_in !== undefined) {
                    return expires_in <= 0;
                }
                return undefined;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(SigninResponse.prototype, "scopes", {
            get: function () {
                return (this.scope || "").split(" ");
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(SigninResponse.prototype, "isOpenIdConnect", {
            get: function () {
                return this.scopes.indexOf(OidcScope) >= 0;
            },
            enumerable: true,
            configurable: true
        });
        return SigninResponse;
    }());
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = SigninResponse;
});
// Copyright (c) Brock Allen & Dominick Baier. All rights reserved.
// Licensed under the Apache License, Version 2.0. See LICENSE in the project root for license information.
define("src/SignoutRequest", ["require", "exports", "src/Log", "src/UrlUtility", "src/State"], function (require, exports, Log_18, UrlUtility_3, State_2) {
    "use strict";
    var SignoutRequest = (function () {
        function SignoutRequest(_a) {
            var url = _a.url, id_token_hint = _a.id_token_hint, post_logout_redirect_uri = _a.post_logout_redirect_uri, data = _a.data;
            if (!url) {
                Log_18.default.error("No url passed to SignoutRequest");
                throw new Error("url");
            }
            if (id_token_hint) {
                url = UrlUtility_3.default.addQueryParam(url, "id_token_hint", id_token_hint);
                if (post_logout_redirect_uri) {
                    url = UrlUtility_3.default.addQueryParam(url, "post_logout_redirect_uri", post_logout_redirect_uri);
                    if (data) {
                        this.state = new State_2.default({ data: data });
                        url = UrlUtility_3.default.addQueryParam(url, "state", this.state.id);
                    }
                }
            }
            this.url = url;
        }
        return SignoutRequest;
    }());
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = SignoutRequest;
});
// Copyright (c) Brock Allen & Dominick Baier. All rights reserved.
// Licensed under the Apache License, Version 2.0. See LICENSE in the project root for license information.
define("src/SignoutResponse", ["require", "exports", "src/UrlUtility"], function (require, exports, UrlUtility_4) {
    "use strict";
    var SignoutResponse = (function () {
        function SignoutResponse(url) {
            var values = UrlUtility_4.default.parseUrlFragment(url, "?");
            this.error = values.error;
            this.error_description = values.error_description;
            this.error_uri = values.error_uri;
            this.state = values.state;
        }
        return SignoutResponse;
    }());
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = SignoutResponse;
});
// Copyright (c) Brock Allen & Dominick Baier. All rights reserved.
// Licensed under the Apache License, Version 2.0. See LICENSE in the project root for license information.
define("src/OidcClient", ["require", "exports", "src/Log", "src/OidcClientSettings", "src/ErrorResponse", "src/SigninRequest", "src/SigninResponse", "src/SignoutRequest", "src/SignoutResponse", "src/SigninState", "src/State"], function (require, exports, Log_19, OidcClientSettings_1, ErrorResponse_2, SigninRequest_1, SigninResponse_1, SignoutRequest_1, SignoutResponse_1, SigninState_2, State_3) {
    "use strict";
    var OidcClient = (function () {
        function OidcClient(settings) {
            if (settings === void 0) { settings = {}; }
            if (settings instanceof OidcClientSettings_1.default) {
                this._settings = settings;
            }
            else {
                this._settings = new OidcClientSettings_1.default(settings);
            }
        }
        Object.defineProperty(OidcClient.prototype, "_stateStore", {
            get: function () {
                return this.settings.stateStore;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(OidcClient.prototype, "_validator", {
            get: function () {
                return this.settings.validator;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(OidcClient.prototype, "_metadataService", {
            get: function () {
                return this.settings.metadataService;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(OidcClient.prototype, "settings", {
            get: function () {
                return this._settings;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(OidcClient.prototype, "metadataService", {
            get: function () {
                return this._metadataService;
            },
            enumerable: true,
            configurable: true
        });
        OidcClient.prototype.createSigninRequest = function (_a, stateStore) {
            var _this = this;
            var _b = _a === void 0 ? {} : _a, _c = _b.response_type, response_type = _c === void 0 ? "" : _c, _d = _b.scope, scope = _d === void 0 ? "" : _d, _e = _b.redirect_uri, redirect_uri = _e === void 0 ? "" : _e, _f = _b.data, data = _f === void 0 ? {} : _f, _g = _b.prompt, prompt = _g === void 0 ? "" : _g, _h = _b.display, display = _h === void 0 ? "" : _h, _j = _b.max_age, max_age = _j === void 0 ? "" : _j, _k = _b.ui_locales, ui_locales = _k === void 0 ? "" : _k, _l = _b.id_token_hint, id_token_hint = _l === void 0 ? "" : _l, _m = _b.login_hint, login_hint = _m === void 0 ? "" : _m, _o = _b.acr_values, acr_values = _o === void 0 ? "" : _o;
            Log_19.default.info("OidcClient.createSigninRequest");
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
            var authority = this._settings.authority;
            return this._metadataService.getAuthorizationEndpoint().then(function (url) {
                Log_19.default.info("Received authorization endpoint", url);
                var request = new SigninRequest_1.default({
                    url: url,
                    client_id: client_id,
                    redirect_uri: redirect_uri,
                    response_type: response_type,
                    scope: scope,
                    data: data,
                    authority: authority,
                    prompt: prompt, display: display, max_age: max_age, ui_locales: ui_locales, id_token_hint: id_token_hint, login_hint: login_hint, acr_values: acr_values
                });
                var state = request.state;
                stateStore = stateStore || _this._stateStore;
                return stateStore.set(state.id, state.toStorageString()).then(function () {
                    return request;
                });
            });
        };
        OidcClient.prototype.processSigninResponse = function (url, stateStore) {
            var _this = this;
            Log_19.default.info("OidcClient.processSigninResponse");
            var response = new SigninResponse_1.default(url);
            if (!response.state) {
                Log_19.default.error("No state in response");
                return Promise.reject(new Error("No state in response"));
            }
            stateStore = stateStore || this._stateStore;
            return stateStore.remove(response.state).then(function (storedStateString) {
                if (!storedStateString) {
                    Log_19.default.error("No matching state found in storage");
                    throw new Error("No matching state found in storage");
                }
                var state = SigninState_2.default.fromStorageString(storedStateString);
                Log_19.default.info("Received state from storage; validating response");
                return _this._validator.validateSigninResponse(state, response);
            });
        };
        OidcClient.prototype.createSignoutRequest = function (_a, stateStore) {
            var _this = this;
            var _b = _a === void 0 ? {} : _a, _c = _b.id_token_hint, id_token_hint = _c === void 0 ? "" : _c, _d = _b.data, data = _d === void 0 ? {} : _d, _e = _b.post_logout_redirect_uri, post_logout_redirect_uri = _e === void 0 ? "" : _e;
            Log_19.default.info("OidcClient.createSignoutRequest");
            post_logout_redirect_uri = post_logout_redirect_uri || this._settings.post_logout_redirect_uri;
            return this._metadataService.getEndSessionEndpoint().then(function (url) {
                Log_19.default.info("Received end session endpoint", url);
                var request = new SignoutRequest_1.default({
                    url: url,
                    id_token_hint: id_token_hint,
                    post_logout_redirect_uri: post_logout_redirect_uri,
                    data: data
                });
                var state = request.state;
                if (state) {
                    Log_19.default.info("Signout request has state to persist");
                    stateStore = stateStore || _this._stateStore;
                    stateStore.set(state.id, state.toStorageString());
                }
                return request;
            });
        };
        OidcClient.prototype.processSignoutResponse = function (url, stateStore) {
            var _this = this;
            Log_19.default.info("OidcClient.processSignoutResponse");
            var response = new SignoutResponse_1.default(url);
            if (!response.state) {
                Log_19.default.info("No state in response");
                if (response.error) {
                    Log_19.default.warn("Response was error", response.error);
                    return Promise.reject(new ErrorResponse_2.default(response));
                }
                return Promise.resolve(response);
            }
            var stateKey = response.state;
            stateStore = stateStore || this._stateStore;
            return stateStore.remove(stateKey).then(function (storedStateString) {
                if (!storedStateString) {
                    Log_19.default.error("No matching state found in storage");
                    throw new Error("No matching state found in storage");
                }
                var state = State_3.default.fromStorageString(storedStateString);
                Log_19.default.info("Received state from storage; validating response");
                return _this._validator.validateSignoutResponse(state, response);
            });
        };
        OidcClient.prototype.clearStaleState = function (stateStore) {
            Log_19.default.info("OidcClient.clearStaleState");
            stateStore = stateStore || this._stateStore;
            return State_3.default.clearStaleState(stateStore, this.settings.staleStateAge);
        };
        return OidcClient;
    }());
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = OidcClient;
});
// Copyright (c) Brock Allen & Dominick Baier. All rights reserved.
// Licensed under the Apache License, Version 2.0. See LICENSE in the project root for license information.
define("src/PopupWindow", ["require", "exports", "src/Log"], function (require, exports, Log_20) {
    "use strict";
    var CheckForPopupClosedInterval = 500;
    var DefaultPopupFeatures = 'location=no,toolbar=no,width=500,height=500,left=100,top=100';
    var DefaultPopupTarget = "_blank";
    var PopupWindow = (function () {
        function PopupWindow(params) {
            var _this = this;
            Log_20.default.info("PopupWindow.ctor");
            this._promise = new Promise(function (resolve, reject) {
                _this._resolve = resolve;
                _this._reject = reject;
            });
            this._boundMessageEvent = this._message.bind(this);
            window.addEventListener("message", this._boundMessageEvent, false);
            var features = params.popupWindowFeatures || DefaultPopupFeatures;
            var target = params.popupWindowTarget || DefaultPopupTarget;
            this._popup = window.open('', target, features);
            if (this._popup) {
                Log_20.default.info("popup successfully created");
                this._checkForPopupClosedTimer = window.setInterval(this._checkForPopupClosed.bind(this), CheckForPopupClosedInterval);
            }
        }
        PopupWindow.prototype.navigate = function (params) {
            Log_20.default.info("PopupWindow.navigate");
            if (!this._popup) {
                this._error("Error opening popup window");
            }
            else if (!params || !params.url) {
                this._error("No url provided");
            }
            else {
                Log_20.default.info("Setting URL in popup");
                this._popup.focus();
                this._popup.window.location = params.url;
            }
            return this.promise;
        };
        Object.defineProperty(PopupWindow.prototype, "promise", {
            get: function () {
                return this._promise;
            },
            enumerable: true,
            configurable: true
        });
        PopupWindow.prototype._success = function (data) {
            this._cleanup();
            Log_20.default.info("Successful response from popup window");
            this._resolve(data);
        };
        PopupWindow.prototype._error = function (message) {
            this._cleanup();
            Log_20.default.error(message);
            this._reject(new Error(message));
        };
        PopupWindow.prototype._cleanup = function () {
            Log_20.default.info("PopupWindow._cleanup");
            window.removeEventListener("message", this._boundMessageEvent, false);
            window.clearInterval(this._checkForPopupClosedTimer);
            this._checkForPopupClosedTimer = null;
            this._boundMessageEvent = null;
            if (this._popup) {
                this._popup.close();
            }
            this._popup = null;
        };
        PopupWindow.prototype._checkForPopupClosed = function () {
            Log_20.default.info("PopupWindow._checkForPopupClosed");
            if (!this._popup || this._popup.closed) {
                this._error("Popup window closed");
            }
        };
        PopupWindow.prototype._message = function (e) {
            Log_20.default.info("PopupWindow._message");
            if (e.origin === this._origin &&
                e.source === this._popup.window) {
                Log_20.default.info("processing message");
                var url = e.data || e.source.location.href; // for IE9
                this._cleanup();
                if (url) {
                    this._success({ url: url });
                }
                else {
                    this._error("Invalid response from popup");
                }
            }
        };
        Object.defineProperty(PopupWindow.prototype, "_origin", {
            get: function () {
                return location.protocol + "//" + location.host;
            },
            enumerable: true,
            configurable: true
        });
        PopupWindow.notifyOpener = function (url) {
            Log_20.default.info("PopupWindow.notifyOpener");
            if (window.opener) {
                url = url || window.location.href;
                if (url) {
                    Log_20.default.info("posting url message to opener");
                    window.opener.postMessage(url, location.protocol + "//" + location.host);
                }
            }
        };
        return PopupWindow;
    }());
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = PopupWindow;
});
// Copyright (c) Brock Allen & Dominick Baier. All rights reserved.
// Licensed under the Apache License, Version 2.0. See LICENSE in the project root for license information.
define("src/PopupNavigator", ["require", "exports", "src/Log", "src/PopupWindow"], function (require, exports, Log_21, PopupWindow_1) {
    "use strict";
    var PopupNavigator = (function () {
        function PopupNavigator() {
        }
        PopupNavigator.prototype.prepare = function (params) {
            var popup = new PopupWindow_1.default(params);
            return Promise.resolve(popup);
        };
        PopupNavigator.prototype.callback = function (url) {
            Log_21.default.info("PopupNavigator.callback");
            try {
                PopupWindow_1.default.notifyOpener(url);
                return Promise.resolve();
            }
            catch (e) {
                return Promise.reject(e);
            }
        };
        return PopupNavigator;
    }());
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = PopupNavigator;
});
// Copyright (c) Brock Allen & Dominick Baier. All rights reserved.
// Licensed under the Apache License, Version 2.0. See LICENSE in the project root for license information.
define("src/RedirectNavigator", ["require", "exports", "src/Log"], function (require, exports, Log_22) {
    "use strict";
    var RedirectNavigator = (function () {
        function RedirectNavigator() {
        }
        RedirectNavigator.prototype.prepare = function () {
            return Promise.resolve(this);
        };
        RedirectNavigator.prototype.navigate = function (params) {
            Log_22.default.info("RedirectNavigator.navigate");
            if (!params || !params.url) {
                Log_22.default.error("No url provided");
                return Promise.reject(new Error("No url provided"));
            }
            window.location = params.url;
            return Promise.resolve();
        };
        Object.defineProperty(RedirectNavigator.prototype, "url", {
            get: function () {
                Log_22.default.info("RedirectNavigator.url");
                return window.location.href;
            },
            enumerable: true,
            configurable: true
        });
        return RedirectNavigator;
    }());
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = RedirectNavigator;
});
// Copyright (c) Brock Allen & Dominick Baier. All rights reserved.
// Licensed under the Apache License, Version 2.0. See LICENSE in the project root for license information.
define("src/SilentRenewService", ["require", "exports", "src/Log"], function (require, exports, Log_23) {
    "use strict";
    var SilentRenewService = (function () {
        function SilentRenewService(userManager) {
            this._userManager = userManager;
            this._userManager.events.addAccessTokenExpiring(this._tokenExpiring.bind(this));
        }
        SilentRenewService.prototype._tokenExpiring = function () {
            var _this = this;
            Log_23.default.info("SilentRenewService automatically renewing access token");
            this._userManager.signinSilent().then(function (user) {
                Log_23.default.info("Silent token renewal successful");
            }, function (err) {
                Log_23.default.error("Error from signinSilent:", err.message);
                _this._userManager.events._raiseSilentRenewError(err);
            });
        };
        return SilentRenewService;
    }());
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = SilentRenewService;
});
// Copyright (c) Brock Allen & Dominick Baier. All rights reserved.
// Licensed under the Apache License, Version 2.0. See LICENSE in the project root for license information.
define("src/User", ["require", "exports", "src/Log"], function (require, exports, Log_24) {
    "use strict";
    var User = (function () {
        function User(_a) {
            var id_token = _a.id_token, session_state = _a.session_state, access_token = _a.access_token, token_type = _a.token_type, scope = _a.scope, profile = _a.profile, expires_at = _a.expires_at, state = _a.state;
            this.id_token = id_token;
            this.session_state = session_state;
            this.access_token = access_token;
            this.token_type = token_type;
            this.scope = scope;
            this.profile = profile;
            this.expires_at = expires_at;
            this.state = state;
        }
        Object.defineProperty(User.prototype, "expires_in", {
            get: function () {
                if (this.expires_at) {
                    return this.expires_at - (Date.now() / 1000);
                }
                return undefined;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(User.prototype, "expired", {
            get: function () {
                var expires_in = this.expires_in;
                if (expires_in !== undefined) {
                    return expires_in <= 0;
                }
                return undefined;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(User.prototype, "scopes", {
            get: function () {
                return (this.scope || "").split(" ");
            },
            enumerable: true,
            configurable: true
        });
        User.prototype.toStorageString = function () {
            Log_24.default.info("User.toStorageString");
            return JSON.stringify({
                id_token: this.id_token,
                session_state: this.session_state,
                access_token: this.access_token,
                token_type: this.token_type,
                scope: this.scope,
                profile: this.profile,
                expires_at: this.expires_at
            });
        };
        User.fromStorageString = function (storageString) {
            Log_24.default.info("User.fromStorageString");
            return new User(JSON.parse(storageString));
        };
        return User;
    }());
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = User;
});
// Copyright (c) Brock Allen & Dominick Baier. All rights reserved.
// Licensed under the Apache License, Version 2.0. See LICENSE in the project root for license information.
define("src/UserManagerSettings", ["require", "exports", "src/OidcClientSettings", "src/RedirectNavigator", "src/PopupNavigator", "src/IFrameNavigator", "src/WebStorageStateStore", "src/Global"], function (require, exports, OidcClientSettings_2, RedirectNavigator_1, PopupNavigator_1, IFrameNavigator_1, WebStorageStateStore_2, Global_5) {
    "use strict";
    var DefaultAccessTokenExpiringNotificationTime = 60;
    var UserManagerSettings = (function (_super) {
        __extends(UserManagerSettings, _super);
        function UserManagerSettings(_a) {
            var _b = _a === void 0 ? {} : _a, _c = _b.popup_redirect_uri, popup_redirect_uri = _c === void 0 ? "" : _c, _d = _b.popupWindowFeatures, popupWindowFeatures = _d === void 0 ? "" : _d, _e = _b.popupWindowTarget, popupWindowTarget = _e === void 0 ? "" : _e, _f = _b.silent_redirect_uri, silent_redirect_uri = _f === void 0 ? "" : _f, _g = _b.automaticSilentRenew, automaticSilentRenew = _g === void 0 ? false : _g, _h = _b.accessTokenExpiringNotificationTime, accessTokenExpiringNotificationTime = _h === void 0 ? DefaultAccessTokenExpiringNotificationTime : _h, _j = _b.redirectNavigator, redirectNavigator = _j === void 0 ? new RedirectNavigator_1.default() : _j, _k = _b.popupNavigator, popupNavigator = _k === void 0 ? new PopupNavigator_1.default() : _k, _l = _b.iframeNavigator, iframeNavigator = _l === void 0 ? new IFrameNavigator_1.default() : _l, _m = _b.userStore, userStore = _m === void 0 ? new WebStorageStateStore_2.default({ store: Global_5.default.sessionStorage }) : _m;
            _super.call(this, arguments[0]);
            this._popup_redirect_uri = popup_redirect_uri;
            this._popupWindowFeatures = popupWindowFeatures;
            this._popupWindowTarget = popupWindowTarget;
            this._silent_redirect_uri = silent_redirect_uri;
            this._automaticSilentRenew = !!automaticSilentRenew;
            this._accessTokenExpiringNotificationTime = accessTokenExpiringNotificationTime;
            this._redirectNavigator = redirectNavigator;
            this._popupNavigator = popupNavigator;
            this._iframeNavigator = iframeNavigator;
            this._userStore = userStore;
        }
        Object.defineProperty(UserManagerSettings.prototype, "popup_redirect_uri", {
            get: function () {
                return this._popup_redirect_uri;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(UserManagerSettings.prototype, "popupWindowFeatures", {
            get: function () {
                return this._popupWindowFeatures;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(UserManagerSettings.prototype, "popupWindowTarget", {
            get: function () {
                return this._popupWindowTarget;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(UserManagerSettings.prototype, "silent_redirect_uri", {
            get: function () {
                return this._silent_redirect_uri;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(UserManagerSettings.prototype, "automaticSilentRenew", {
            get: function () {
                return !!(this.silent_redirect_uri && this._automaticSilentRenew);
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(UserManagerSettings.prototype, "accessTokenExpiringNotificationTime", {
            get: function () {
                return this._accessTokenExpiringNotificationTime;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(UserManagerSettings.prototype, "redirectNavigator", {
            get: function () {
                return this._redirectNavigator;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(UserManagerSettings.prototype, "popupNavigator", {
            get: function () {
                return this._popupNavigator;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(UserManagerSettings.prototype, "iframeNavigator", {
            get: function () {
                return this._iframeNavigator;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(UserManagerSettings.prototype, "userStore", {
            get: function () {
                return this._userStore;
            },
            enumerable: true,
            configurable: true
        });
        return UserManagerSettings;
    }(OidcClientSettings_2.default));
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = UserManagerSettings;
});
// Copyright (c) Brock Allen & Dominick Baier. All rights reserved.
// Licensed under the Apache License, Version 2.0. See LICENSE in the project root for license information.
define("src/UserManagerEvents", ["require", "exports", "src/Log", "src/AccessTokenEvents", "src/Event"], function (require, exports, Log_25, AccessTokenEvents_1, Event_2) {
    "use strict";
    var UserManagerEvents = (function (_super) {
        __extends(UserManagerEvents, _super);
        function UserManagerEvents(settings) {
            _super.call(this, settings);
            this._userLoaded = new Event_2.default("User loaded");
            this._userUnloaded = new Event_2.default("User unloaded");
            this._silentRenewError = new Event_2.default("Silent renew error");
        }
        UserManagerEvents.prototype.load = function (user) {
            Log_25.default.info("UserManagerEvents.load");
            _super.prototype.load.call(this, user);
            this._userLoaded.raise(user);
        };
        UserManagerEvents.prototype.unload = function () {
            Log_25.default.info("UserManagerEvents.unload");
            _super.prototype.unload.call(this);
            this._userUnloaded.raise();
        };
        UserManagerEvents.prototype.addUserLoaded = function (cb) {
            this._userLoaded.addHandler(cb);
        };
        UserManagerEvents.prototype.removeUserLoaded = function (cb) {
            this._userLoaded.removeHandler(cb);
        };
        UserManagerEvents.prototype.addUserUnloaded = function (cb) {
            this._userUnloaded.addHandler(cb);
        };
        UserManagerEvents.prototype.removeUserUnloaded = function (cb) {
            this._userUnloaded.removeHandler(cb);
        };
        UserManagerEvents.prototype.addSilentRenewError = function (cb) {
            this._silentRenewError.addHandler(cb);
        };
        UserManagerEvents.prototype.removeSilentRenewError = function (cb) {
            this._silentRenewError.removeHandler(cb);
        };
        UserManagerEvents.prototype._raiseSilentRenewError = function (e) {
            Log_25.default.info("UserManagerEvents._raiseSilentRenewError", e.message);
            this._silentRenewError.raise(e);
        };
        return UserManagerEvents;
    }(AccessTokenEvents_1.default));
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = UserManagerEvents;
});
// Copyright (c) Brock Allen & Dominick Baier. All rights reserved.
// Licensed under the Apache License, Version 2.0. See LICENSE in the project root for license information.
define("src/UserManager", ["require", "exports", "src/Log", "src/OidcClient", "src/UserManagerSettings", "src/User", "src/UserManagerEvents", "src/SilentRenewService"], function (require, exports, Log_26, OidcClient_1, UserManagerSettings_1, User_1, UserManagerEvents_1, SilentRenewService_1) {
    "use strict";
    var UserManager = (function (_super) {
        __extends(UserManager, _super);
        function UserManager(settings) {
            if (!(settings instanceof UserManagerSettings_1.default)) {
                settings = new UserManagerSettings_1.default(settings);
            }
            _super.call(this, settings);
            this._events = new UserManagerEvents_1.default(settings);
            if (this.settings.automaticSilentRenew) {
                Log_26.default.info("automaticSilentRenew is configured, setting up silent renew");
                this._silentRenewService = new SilentRenewService_1.default(this);
            }
        }
        Object.defineProperty(UserManager.prototype, "_redirectNavigator", {
            get: function () {
                return this.settings.redirectNavigator;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(UserManager.prototype, "_popupNavigator", {
            get: function () {
                return this.settings.popupNavigator;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(UserManager.prototype, "_iframeNavigator", {
            get: function () {
                return this.settings.iframeNavigator;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(UserManager.prototype, "_userStore", {
            get: function () {
                return this.settings.userStore;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(UserManager.prototype, "events", {
            get: function () {
                return this._events;
            },
            enumerable: true,
            configurable: true
        });
        UserManager.prototype.getUser = function () {
            Log_26.default.info("UserManager.getUser");
            return this._loadUser().then(function (user) {
                if (user) {
                    Log_26.default.info("user loaded");
                    return user;
                }
                else {
                    Log_26.default.info("user not found in storage");
                    return null;
                }
            });
        };
        UserManager.prototype.removeUser = function () {
            var _this = this;
            Log_26.default.info("UserManager.removeUser");
            return this._storeUser(null).then(function () {
                Log_26.default.info("user removed from storage");
                _this._events.unload();
            });
        };
        UserManager.prototype.signinPopup = function (args) {
            if (args === void 0) { args = {}; }
            Log_26.default.info("UserManager.signinPopup");
            var url = args.redirect_uri || this.settings.popup_redirect_uri || this.settings.redirect_uri;
            if (!url) {
                Log_26.default.error("No popup_redirect_uri or redirect_uri configured");
                return Promise.reject(new Error("No popup_redirect_uri or redirect_uri configured"));
            }
            args.redirect_uri = url;
            args.display = "popup";
            return this._signin(args, this._popupNavigator, {
                startUrl: url,
                popupWindowFeatures: args.popupWindowFeatures || this.settings.popupWindowFeatures,
                popupWindowTarget: args.popupWindowTarget || this.settings.popupWindowTarget
            });
        };
        UserManager.prototype.signinPopupCallback = function (url) {
            Log_26.default.info("UserManager.signinPopupCallback");
            return this._signinCallback(url, this._popupNavigator);
        };
        UserManager.prototype.signinSilent = function (args) {
            if (args === void 0) { args = {}; }
            Log_26.default.info("UserManager.signinSilent");
            var url = args.redirect_uri || this.settings.silent_redirect_uri;
            if (!url) {
                Log_26.default.error("No silent_redirect_uri configured");
                return Promise.reject(new Error("No silent_redirect_uri configured"));
            }
            args.redirect_uri = url;
            args.prompt = "none";
            return this._signin(args, this._iframeNavigator);
        };
        UserManager.prototype.signinSilentCallback = function (url) {
            Log_26.default.info("UserManager.signinSilentCallback");
            return this._signinCallback(url, this._iframeNavigator);
        };
        UserManager.prototype._signin = function (args, navigator, navigatorParams) {
            var _this = this;
            if (navigatorParams === void 0) { navigatorParams = {}; }
            Log_26.default.info("_signin");
            return this._signinStart(args, navigator, navigatorParams).then(function (navResponse) {
                return _this._signinEnd(navResponse.url);
            });
        };
        UserManager.prototype._signinCallback = function (url, navigator) {
            Log_26.default.info("_signinCallback");
            return navigator.callback(url);
        };
        UserManager.prototype._signout = function (args, navigator, navigatorParams) {
            var _this = this;
            if (navigatorParams === void 0) { navigatorParams = {}; }
            Log_26.default.info("_signout");
            return this._signoutStart(args, navigator, navigatorParams).then(function (navResponse) {
                return _this._signoutEnd(navResponse.url);
            });
        };
        UserManager.prototype._signoutCallback = function (url, navigator) {
            Log_26.default.info("_signoutCallback");
            return navigator.callback(url);
        };
        UserManager.prototype.signinRedirect = function (args) {
            Log_26.default.info("UserManager.signinRedirect");
            return this._signinStart(args, this._redirectNavigator);
        };
        UserManager.prototype.signinRedirectCallback = function (url) {
            Log_26.default.info("UserManager.signinRedirectCallback");
            return this._signinEnd(url || this._redirectNavigator.url);
        };
        UserManager.prototype.signoutRedirect = function (args) {
            Log_26.default.info("UserManager.signoutRedirect");
            return this._signoutStart(args, this._redirectNavigator);
        };
        UserManager.prototype.signoutRedirectCallback = function (url) {
            Log_26.default.info("UserManager.signoutRedirectCallback");
            return this._signoutEnd(url || this._redirectNavigator.url);
        };
        UserManager.prototype._signinStart = function (args, navigator, navigatorParams) {
            var _this = this;
            if (navigatorParams === void 0) { navigatorParams = {}; }
            Log_26.default.info("_signinStart");
            return navigator.prepare(navigatorParams).then(function (handle) {
                Log_26.default.info("got navigator window handle");
                return _this.createSigninRequest(args).then(function (signinRequest) {
                    Log_26.default.info("got signin request");
                    navigatorParams.url = signinRequest.url;
                    return handle.navigate(navigatorParams);
                });
            });
        };
        UserManager.prototype._signinEnd = function (url) {
            var _this = this;
            Log_26.default.info("_signinEnd");
            return this.processSigninResponse(url).then(function (signinResponse) {
                Log_26.default.info("got signin response");
                var user = new User_1.default(signinResponse);
                return _this._storeUser(user).then(function () {
                    Log_26.default.info("user stored");
                    _this._events.load(user);
                    return user;
                });
            });
        };
        UserManager.prototype._signoutStart = function (args, navigator, navigatorParams) {
            var _this = this;
            if (args === void 0) { args = {}; }
            if (navigatorParams === void 0) { navigatorParams = {}; }
            Log_26.default.info("_signoutStart");
            return navigator.prepare(navigatorParams).then(function (handle) {
                Log_26.default.info("got navigator window handle");
                return _this.getUser().then(function (user) {
                    Log_26.default.info("loaded current user from storage");
                    var id_token = args.id_token_hint || user && user.id_token;
                    if (id_token) {
                        Log_26.default.info("Setting id_token into signout request");
                        args.id_token_hint = id_token;
                    }
                    return _this.removeUser().then(function () {
                        Log_26.default.info("user removed, creating signout request");
                        return _this.createSignoutRequest(args).then(function (signoutRequest) {
                            Log_26.default.info("got signout request");
                            navigatorParams.url = signoutRequest.url;
                            return handle.navigate(navigatorParams);
                        });
                    });
                });
            });
        };
        UserManager.prototype._signoutEnd = function (url) {
            Log_26.default.info("_signoutEnd");
            return this.processSignoutResponse(url).then(function (signoutResponse) {
                Log_26.default.info("got signout response");
                return signoutResponse;
            });
        };
        Object.defineProperty(UserManager.prototype, "_userStoreKey", {
            get: function () {
                return "user:" + this.settings.authority + ":" + this.settings.client_id;
            },
            enumerable: true,
            configurable: true
        });
        UserManager.prototype._loadUser = function () {
            Log_26.default.info("_loadUser");
            return this._userStore.get(this._userStoreKey).then(function (storageString) {
                if (storageString) {
                    Log_26.default.info("user storageString loaded");
                    return User_1.default.fromStorageString(storageString);
                }
                Log_26.default.info("no user storageString");
                return null;
            });
        };
        UserManager.prototype._storeUser = function (user) {
            if (user) {
                Log_26.default.info("_storeUser storing user");
                var storageString = user.toStorageString();
                return this._userStore.set(this._userStoreKey, storageString);
            }
            else {
                Log_26.default.info("_storeUser removing user storage");
                return this._userStore.remove(this._userStoreKey);
            }
        };
        return UserManager;
    }(OidcClient_1.default));
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = UserManager;
});
