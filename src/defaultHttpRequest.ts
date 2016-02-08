/// <reference path="./defaultPromiseFactory.ts" />

/**
 * @constructor
 */
class DefaultHttpRequest {

    /**
     * @name _promiseFactory
     * @type DefaultPromiseFactory
     */

    /**
     * @param {XMLHttpRequest} xhr
     * @param {object.<string, string>} headers
     */
    private setHeaders(xhr: XMLHttpRequest, headers: { [header: string]: string }) {
        var keys = Object.keys(headers);

        for (var i = 0; i < keys.length; i++) {
            var key = keys[i];
            var value = headers[key];

            xhr.setRequestHeader(key, value);
        }
    }

    /**
     * @param {string} url
     * @param {{ headers: object.<string, string> }} [config]
     * @returns {Promise}
     */
     getJSON<T>(url: string, config: { headers: { [header: string]: string } }) {
        return _promiseFactory.create((resolve, reject) => {

            try {
                var xhr = new XMLHttpRequest();
                xhr.open("GET", url);
                xhr.responseType = "json";

                if (config) {
                    if (config.headers) {
                        this.setHeaders(xhr, config.headers);
                    }
                }

                xhr.onload = function () {
                    try {
                        if (xhr.status === 200) {
                            var response: string | T = "";
                            // To support IE9 get the response from xhr.responseText not xhr.response
                            if ("XDomainRequest" in window) {
                                response = xhr.responseText;
                            } else {
                                response = xhr.response;
                            }
                            if (typeof response === "string") {
                                response = JSON.parse(<string>response);
                            }
                            resolve(<T>response);
                        }
                        else {
                            reject(Error(xhr.statusText + "(" + xhr.status + ")"));
                        }
                    }
                    catch (err) {
                        reject(err);
                    }
                };

                xhr.onerror = function () {
                    reject(Error("Network error"));
                };

                xhr.send();
            }
            catch (err) {
                return reject(err);
            }
        });
    };
}

var _httpRequest = new DefaultHttpRequest();
