/**
 * Feature detection
 * @type {{XmlHttpRequest, XDomainRequest, addEventListener, querySelector, matchMedia}}
 * @private
 */
_featureDetection = (function () {
  'use strict';

  /**
   * Detect support for XMLHttpRequest
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
   * Detect support for querySelector
   * IE8+
   * @returns {boolean}
   */
  function querySelector() {
    return typeof document.querySelector !== 'undefined';
  }

  /**
   * Detect support for addEventListener
   * IE9+
   * @returns {boolean}
   */
  function addEventListener() {
    return typeof window.addEventListener !== 'undefined';
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

    XmlHttpRequest:   xmlHttpRequest,
    XDomainRequest:   xDomainRequest,

    addEventListener: addEventListener,
    querySelector:    querySelector,
    matchMedia:       matchMedia

  };

})();
