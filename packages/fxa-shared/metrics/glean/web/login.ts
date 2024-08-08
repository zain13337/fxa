/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

// AUTOGENERATED BY glean_parser v14.5.1. DO NOT EDIT. DO NOT COMMIT.

import EventMetricType from '@mozilla/glean/private/metrics/event';

/**
 * Event that indicates a user attempted to authenticate by clicking
 * "Confirm" on the 2FA backup codes page.
 *
 * Generated from `login.backup_code_submit`.
 */
export const backupCodeSubmit = new EventMetricType(
  {
    category: 'login',
    name: 'backup_code_submit',
    sendInPings: ['events'],
    lifetime: 'ping',
    disabled: false,
  },
  []
);

/**
 * Event that indicates the user successfully authenticated via 2FA backup
 * codes.
 *
 * Generated from `login.backup_code_success_view`.
 */
export const backupCodeSuccessView = new EventMetricType(
  {
    category: 'login',
    name: 'backup_code_success_view',
    sendInPings: ['events'],
    lifetime: 'ping',
    disabled: false,
  },
  []
);

/**
 * Event that indicates a successful view/load of the 2FA backup codes
 * authentication page on the login funnel. The page prompts the user to
 * enter a backup code.
 *
 * Generated from `login.backup_code_view`.
 */
export const backupCodeView = new EventMetricType(
  {
    category: 'login',
    name: 'backup_code_view',
    sendInPings: ['events'],
    lifetime: 'ping',
    disabled: false,
  },
  []
);

/**
 * Event that indicates user clicked on "Use a different account" link on login
 * page.
 *
 * Generated from `login.diff_account_link_click`.
 */
export const diffAccountLinkClick = new EventMetricType(
  {
    category: 'login',
    name: 'diff_account_link_click',
    sendInPings: ['events'],
    lifetime: 'ping',
    disabled: false,
  },
  []
);

/**
 * Login Email Confirm Attempted
 * Event that indicates a user attempted to confirm email in the login by entering
 * in Code to "confirm" & click button to submit. See the Login + 2FA section
 * of this document for visual detail.'
 *
 * Generated from `login.email_confirmation_submit`.
 */
export const emailConfirmationSubmit = new EventMetricType(
  {
    category: 'login',
    name: 'email_confirmation_submit',
    sendInPings: ['events'],
    lifetime: 'ping',
    disabled: false,
  },
  []
);

/**
 * Login Email Confirmed.
 * Indicates that user successfully confirmed their email for the login flow
 * by entering the code sent in the confirmation email.
 *
 * Generated from `login.email_confirmation_success_view`.
 */
export const emailConfirmationSuccessView = new EventMetricType(
  {
    category: 'login',
    name: 'email_confirmation_success_view',
    sendInPings: ['events'],
    lifetime: 'ping',
    disabled: false,
  },
  []
);

/**
 * Login Confirm Email Page View (FE)
 * Event that indicates a successful view/load of the email confirmation page
 * following the login page view.'
 *
 * Generated from `login.email_confirmation_view`.
 */
export const emailConfirmationView = new EventMetricType(
  {
    category: 'login',
    name: 'email_confirmation_view',
    sendInPings: ['events'],
    lifetime: 'ping',
    disabled: false,
  },
  []
);

/**
 * Indicates a user engaged with the password field on login by
 * focusing/clicking/type.
 *
 * Generated from `login.engage`.
 */
export const engage = new EventMetricType(
  {
    category: 'login',
    name: 'engage',
    sendInPings: ['events'],
    lifetime: 'ping',
    disabled: false,
  },
  []
);

/**
 * Login Password Reset Click
 * User clicks on the "Forgot Password" Link.'
 *
 * Generated from `login.forgot_pwd_submit`.
 */
export const forgotPwdSubmit = new EventMetricType(
  {
    category: 'login',
    name: 'forgot_pwd_submit',
    sendInPings: ['events'],
    lifetime: 'ping',
    disabled: false,
  },
  []
);

/**
 * Login Submission Attempt
 * An event that indicates a user attempted to login by clicking "Sign in" on
 * the login page'
 *
 * Generated from `login.submit`.
 */
export const submit = new EventMetricType(
  {
    category: 'login',
    name: 'submit',
    sendInPings: ['events'],
    lifetime: 'ping',
    disabled: false,
  },
  []
);

/**
 * Login Submission Failure (UI)
 * Event that indicates an attempt to login by clicking "Sign in" on the login
 * page was not successful. Ideally we would have additional data on why the
 * login failed. We might expect most reasons to be "Incorrect password".'
 *
 * Generated from `login.submit_frontend_error`.
 */
export const submitFrontendError = new EventMetricType<{
  reason?: string;
}>(
  {
    category: 'login',
    name: 'submit_frontend_error',
    sendInPings: ['events'],
    lifetime: 'ping',
    disabled: false,
  },
  ['reason']
);

/**
 * Login Submission Success
 * Event that indicates an attempt to login by clicking "Sign in" on the login
 * page was successful.'
 *
 * Generated from `login.submit_success`.
 */
export const submitSuccess = new EventMetricType(
  {
    category: 'login',
    name: 'submit_success',
    sendInPings: ['events'],
    lifetime: 'ping',
    disabled: false,
  },
  []
);

/**
 * Login 2FA Submission Attempt
 * Event that indicates a user attempted to authenticate by clicking "Confirm"
 * on the 2FA page view.'
 *
 * Generated from `login.totp_code_submit`.
 */
export const totpCodeSubmit = new EventMetricType(
  {
    category: 'login',
    name: 'totp_code_submit',
    sendInPings: ['events'],
    lifetime: 'ping',
    disabled: false,
  },
  []
);

/**
 * Login 2FA Success (FE)
 * Event that indicates a user successfully authenticated via 2FA.'
 *
 * Generated from `login.totp_code_success_view`.
 */
export const totpCodeSuccessView = new EventMetricType(
  {
    category: 'login',
    name: 'totp_code_success_view',
    sendInPings: ['events'],
    lifetime: 'ping',
    disabled: false,
  },
  []
);

/**
 * Login 2FA Page View (FE)
 * Event that indicates a successful view/load of the 2FA authentication page
 * following the login page view. The page prompts the user to enter the security
 * code obtained through additional authentication.'
 *
 * Generated from `login.totp_form_view`.
 */
export const totpFormView = new EventMetricType(
  {
    category: 'login',
    name: 'totp_form_view',
    sendInPings: ['events'],
    lifetime: 'ping',
    disabled: false,
  },
  []
);

/**
 * Login Page View (FE)
 * A successful view/load of the login page.'
 *
 * Generated from `login.view`.
 */
export const view = new EventMetricType<{
  third_party_links?: boolean;
}>(
  {
    category: 'login',
    name: 'view',
    sendInPings: ['events'],
    lifetime: 'ping',
    disabled: false,
  },
  ['third_party_links']
);
