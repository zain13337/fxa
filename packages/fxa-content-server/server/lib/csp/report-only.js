/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */


/**
 * reportOnlyCspMiddleware is where to declare experimental rules that
 * will not cause a resource to be blocked if it runs afowl of a rule, but will
 * cause the resource to be reported.
 */
module.exports = function (config) {
  var CDN_URL = config.get('static_resource_url');
  var PUBLIC_URL = config.get('public_url');
  var SELF = "'self'";

  function addCdnRuleIfRequired(target) {
    if (CDN_URL !== PUBLIC_URL) {
      target.push(CDN_URL);
    }

    return target;
  }

  return {
    reportOnly: true,
    reportUri: config.get('csp.reportOnlyUri'),
    scriptSrc: addCdnRuleIfRequired([
      SELF
    ])
  };
};
