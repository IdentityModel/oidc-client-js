/**
 * Browser detection
 * @type {{isIE8, isIE9}}
 * @private
 */
_browserDetection = (function (featureDetection) {
  'use strict';

  // Default to global featureDetection object
  featureDetection = featureDetection || _featureDetection;

  // Stop execution if featureDetection is undefined
  if (!featureDetection) throw new Error('[browserDetection] : _featureDetection undefined');

  /**
   * Detect IE8
   * @returns {boolean}
   */
  function isIE8() {
    return featureDetection.xmlHttpRequest() && featureDetection.xDomainRequest() && !featureDetection.msPerformance();
  }

  /**
   * Detect IE9
   * @returns {boolean}
   */
  function isIE9() {
    return featureDetection.xmlHttpRequest() && featureDetection.xDomainRequest()  && featureDetection.msPerformance() && !featureDetection.matchMedia();
  }

  return {

    // Internet Explorer
    isIE8:  isIE8,
    isIE9:  isIE9

  };

})();
