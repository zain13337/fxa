/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

// AUTOGENERATED BY glean_parser v14.5.1. DO NOT EDIT. DO NOT COMMIT.

import EventMetricType from '@mozilla/glean/private/metrics/event';

/**
 * Indicates the user entered an age in the "Age" section that is 13 or below. If
 * they do this, they encounter a page that does not let them continue to register
 * their account.
 *
 * Generated from `reg.age_invalid`.
 */
export const ageInvalid = new EventMetricType(
  {
    category: 'reg',
    name: 'age_invalid',
    sendInPings: ['events'],
    lifetime: 'ping',
    disabled: false,
  },
  []
);

/**
 * User clicked on "Change email" link at the top of the registration form.
 *
 * Generated from `reg.change_email_link_click`.
 */
export const changeEmailLinkClick = new EventMetricType(
  {
    category: 'reg',
    name: 'change_email_link_click',
    sendInPings: ['events'],
    lifetime: 'ping',
    disabled: false,
  },
  []
);

/**
 * User interacted with the Sync "Choose What to Sync" options during account
 * registration.
 *
 * Generated from `reg.cwts_engage`.
 */
export const cwtsEngage = new EventMetricType(
  {
    category: 'reg',
    name: 'cwts_engage',
    sendInPings: ['events'],
    lifetime: 'ping',
    disabled: false,
  },
  []
);

/**
 * TODO
 *
 * Generated from `reg.engage`.
 */
export const engage = new EventMetricType<{
  reason?: string;
}>(
  {
    category: 'reg',
    name: 'engage',
    sendInPings: ['events'],
    lifetime: 'ping',
    disabled: false,
  },
  ['reason']
);

/**
 * Event that indicates engagement with the Marketing section of the registration
 * funnel (Standard funnel only)
 *
 * Generated from `reg.marketing_engage`.
 */
export const marketingEngage = new EventMetricType(
  {
    category: 'reg',
    name: 'marketing_engage',
    sendInPings: ['events'],
    lifetime: 'ping',
    disabled: false,
  },
  []
);

/**
 * Registration Email Confirm Attempt
 * Event that indicates a user attempted to confirm their email through clicking
 * "Confirm". See Registration Visuals/Steps in this document for more visual
 * detail.'
 *
 * Generated from `reg.signup_code_submit`.
 */
export const signupCodeSubmit = new EventMetricType(
  {
    category: 'reg',
    name: 'signup_code_submit',
    sendInPings: ['events'],
    lifetime: 'ping',
    disabled: false,
  },
  []
);

/**
 * Registration Confirm Email Page View
 * A page view of the email confirmation step, indicating the user successfully
 * submitted their email/password information'
 *
 * Generated from `reg.signup_code_view`.
 */
export const signupCodeView = new EventMetricType(
  {
    category: 'reg',
    name: 'signup_code_view',
    sendInPings: ['events'],
    lifetime: 'ping',
    disabled: false,
  },
  []
);

/**
 * Registration Submission Click (Attempt)
 * Event that indicates a user attempted to submit the registration form by
 * clicking
 * "Create account". This could ultimately be a success or failure.'
 *
 * Generated from `reg.submit`.
 */
export const submit = new EventMetricType(
  {
    category: 'reg',
    name: 'submit',
    sendInPings: ['events'],
    lifetime: 'ping',
    disabled: false,
  },
  []
);

/**
 * Registration Submission Attempt Success
 * Event that indicates an attempt to submit a registration (clicking "Create
 * account") was successful.'
 *
 * Generated from `reg.submit_success`.
 */
export const submitSuccess = new EventMetricType(
  {
    category: 'reg',
    name: 'submit_success',
    sendInPings: ['events'],
    lifetime: 'ping',
    disabled: false,
  },
  []
);

/**
 * Confirmation of Registration Successful.
 * Indicates an account was successfully registered and created.
 *
 * Generated from `reg.success_view`.
 */
export const successView = new EventMetricType(
  {
    category: 'reg',
    name: 'success_view',
    sendInPings: ['events'],
    lifetime: 'ping',
    disabled: false,
  },
  []
);

/**
 * Registration Page View
 * A successful view/load event of the registration page. See here for more
 * context
 * on registration pages and steps.'
 *
 * Generated from `reg.view`.
 */
export const view = new EventMetricType(
  {
    category: 'reg',
    name: 'view',
    sendInPings: ['events'],
    lifetime: 'ping',
    disabled: false,
  },
  []
);

/**
 * User clicked on "Why do we ask" link on registration form.
 *
 * Generated from `reg.why_do_we_ask_link_click`.
 */
export const whyDoWeAskLinkClick = new EventMetricType(
  {
    category: 'reg',
    name: 'why_do_we_ask_link_click',
    sendInPings: ['events'],
    lifetime: 'ping',
    disabled: false,
  },
  []
);
