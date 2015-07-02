/**
 * Feature detection
 * @type {{XmlHttpRequest, XDomainRequst, ActiveXObject}}
 * @private
 */
_featureDetection = (function () {
  'use strict';

  /**
   * Detect support for XMLHTTPRequest
   * IE7+
   * @returns {boolean}
   */
  function xmlHttpRequest() {
    return typeof window.XMLHttpRequest !== 'undefined';
  }

  /**
   * Detect support for XDomainRequest
   * IE8 - IE10
   * @returns {boolean}
   */
  function xDomainRequest() {
    return typeof window.XDomainRequest !== 'undefined';
  }

  /**
   * Detect support for ActiveXObject
   * IE7 - IE10
   * @returns {boolean}
   */
  function activeXObject() {
    return typeof window.ActiveXObject !== 'undefined';
  }

  /**
   * Detect support for msPerformance
   * IE9+
   * @returns {boolean}
   */
  function msPerformance() {
    return typeof window.msPerformance !== 'undefined';
  }

  /**
   * Detect support for matchMedia
   * IE10+
   * @returns {boolean}
   */
  function matchMedia() {
    return typeof window.matchMedia !== 'undefined';
  }

  return {

    // Network related
    XmlHttpRequest:   xmlHttpRequest,
    XDomainRequst:    xDomainRequest,
    ActiveXObject:    activeXObject,

    // Browser identification related
    msPerformance:    msPerformance,
    matchMedia:       matchMedia

  };

})();
