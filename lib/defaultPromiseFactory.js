/**
 * @constructor
 * @param {Promise} promise
 */
function DefaultPromise(promise) {

    /**
     * @param {function(*):*} successCallback
     * @param {function(*):*} errorCallback
     * @returns {DefaultPromise}
     */
    this.then = function (successCallback, errorCallback) {
        var childPromise = promise.then(successCallback, errorCallback);

        return new DefaultPromise(childPromise);
    };

    /**
     *
     * @param {function(*):*} errorCallback
     * @returns {DefaultPromise}
     */
    this.catch = function (errorCallback) {
        var childPromise = promise.catch(errorCallback);

        return new DefaultPromise(childPromise);
    };
}

/**
 * @constructor
 */
function DefaultPromiseFactory() {

    this.resolve = function (value) {
        return new DefaultPromise(Promise.resolve(value));
    };

    this.reject = function (reason) {
        return new DefaultPromise(Promise.reject(reason));
    };

    /**
     * @param {function(resolve:function, reject:function)} callback
     * @returns {DefaultPromise}
     */
    this.create = function (callback) {
        return new DefaultPromise(new Promise(callback));
    };
}

_promiseFactory = new DefaultPromiseFactory();