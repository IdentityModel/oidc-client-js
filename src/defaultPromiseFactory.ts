/// <reference path="../typings/es6-promise/es6-promise.d.ts" />

/**
 * @constructor
 * @param {Promise} promise
 */
class DefaultPromise<T> {
    
    constructor(private promise: PromiseLike<T>) {}

    /**
     * @param {function(*):*} successCallback
     * @param {function(*):*} errorCallback
     * @returns {DefaultPromise}
     */
    then<TResult>(successCallback?: (value: T) => TResult | PromiseLike<TResult>, errorCallback?: (reason: any) => TResult | PromiseLike<TResult>) {
        var childPromise = this.promise.then(successCallback, errorCallback);
        return new DefaultPromise(childPromise);
    };

    /**
     *
     * @param {function(*):*} errorCallback
     * @returns {DefaultPromise}
     */
    catch<TResult>(errorCallback: (reason: any) => TResult | PromiseLike<TResult>) {
        var childPromise = this.promise.then(null, errorCallback);
        return new DefaultPromise(childPromise);
    };
}

/**
 * @constructor
 */
class DefaultPromiseFactory {

    resolve<T>(value: T) {
        return new DefaultPromise(Promise.resolve(value));
    };

    reject<T>(reason: T) {
        return new DefaultPromise(Promise.reject(reason));
    };

    /**
     * @param {function(resolve:function, reject:function)} callback
     * @returns {DefaultPromise}
     */
    create<T>(callback: (resolve : (value?: T | Thenable<T>) => void, reject: (error?: any) => void) => void) {
        return new DefaultPromise(new Promise(callback));
    };
}

var _promiseFactory: DefaultPromiseFactory = new DefaultPromiseFactory();