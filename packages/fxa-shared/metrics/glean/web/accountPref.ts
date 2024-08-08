/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

// AUTOGENERATED BY glean_parser v14.5.1. DO NOT EDIT. DO NOT COMMIT.

import EventMetricType from '@mozilla/glean/private/metrics/event';

/**
 * Click on Apple logo to download Firefox on Apple
 *
 * Generated from `account_pref.apple_submit`.
 */
export const appleSubmit = new EventMetricType(
  {
    category: 'account_pref',
    name: 'apple_submit',
    sendInPings: ['events'],
    lifetime: 'ping',
    disabled: false,
  },
  []
);

/**
 * The user clicked "Unlink" from account preferences for their Apple linked
 * account.
 *
 * Generated from `account_pref.apple_unlink_submit`.
 */
export const appleUnlinkSubmit = new EventMetricType<{
  reason?: string;
}>(
  {
    category: 'account_pref',
    name: 'apple_unlink_submit',
    sendInPings: ['events'],
    lifetime: 'ping',
    disabled: false,
  },
  ['reason']
);

/**
 * The user clicked "Unlink" from the confirmation modal for their Apple linked
 * account.
 *
 * Generated from `account_pref.apple_unlink_submit_confirm`.
 */
export const appleUnlinkSubmitConfirm = new EventMetricType<{
  reason?: string;
}>(
  {
    category: 'account_pref',
    name: 'apple_unlink_submit_confirm',
    sendInPings: ['events'],
    lifetime: 'ping',
    disabled: false,
  },
  ['reason']
);

/**
 * Click on "Change" on account settings page to change password for account
 *
 * Generated from `account_pref.change_password_submit`.
 */
export const changePasswordSubmit = new EventMetricType(
  {
    category: 'account_pref',
    name: 'change_password_submit',
    sendInPings: ['events'],
    lifetime: 'ping',
    disabled: false,
  },
  []
);

/**
 * Click on "Signout" under Connected Services to sign out of device/service
 *
 * Generated from `account_pref.device_signout`.
 */
export const deviceSignout = new EventMetricType<{
  reason?: string;
}>(
  {
    category: 'account_pref',
    name: 'device_signout',
    sendInPings: ['events'],
    lifetime: 'ping',
    disabled: false,
  },
  ['reason']
);

/**
 * Click on "Add" or "Change" on account settings page to add or change display
 * name
 *
 * Generated from `account_pref.display_name_submit`.
 */
export const displayNameSubmit = new EventMetricType(
  {
    category: 'account_pref',
    name: 'display_name_submit',
    sendInPings: ['events'],
    lifetime: 'ping',
    disabled: false,
  },
  []
);

/**
 * Click on Google Play logo to download Firefox on Android
 *
 * Generated from `account_pref.google_play_submit`.
 */
export const googlePlaySubmit = new EventMetricType(
  {
    category: 'account_pref',
    name: 'google_play_submit',
    sendInPings: ['events'],
    lifetime: 'ping',
    disabled: false,
  },
  []
);

/**
 * The user clicked "Unlink" from account preferences for their Google linked
 * account.
 *
 * Generated from `account_pref.google_unlink_submit`.
 */
export const googleUnlinkSubmit = new EventMetricType<{
  reason?: string;
}>(
  {
    category: 'account_pref',
    name: 'google_unlink_submit',
    sendInPings: ['events'],
    lifetime: 'ping',
    disabled: false,
  },
  ['reason']
);

/**
 * The user clicked "Unlink" from the confirmation modal for their Google linked
 * account.
 *
 * Generated from `account_pref.google_unlink_submit_confirm`.
 */
export const googleUnlinkSubmitConfirm = new EventMetricType<{
  reason?: string;
}>(
  {
    category: 'account_pref',
    name: 'google_unlink_submit_confirm',
    sendInPings: ['events'],
    lifetime: 'ping',
    disabled: false,
  },
  ['reason']
);

/**
 * User clicked the question mark icon "Help" link in the account settings page
 * header
 *
 * Generated from `account_pref.help`.
 */
export const help = new EventMetricType(
  {
    category: 'account_pref',
    name: 'help',
    sendInPings: ['events'],
    lifetime: 'ping',
    disabled: false,
  },
  []
);

/**
 * Click on "Create" or "Change" button on account settings page to add a recovery
 * key to the account
 *
 * Generated from `account_pref.recovery_key_submit`.
 */
export const recoveryKeySubmit = new EventMetricType(
  {
    category: 'account_pref',
    name: 'recovery_key_submit',
    sendInPings: ['events'],
    lifetime: 'ping',
    disabled: false,
  },
  []
);

/**
 * Click on "Add" button on account settings page to add secondary email
 *
 * Generated from `account_pref.secondary_email_submit`.
 */
export const secondaryEmailSubmit = new EventMetricType(
  {
    category: 'account_pref',
    name: 'secondary_email_submit',
    sendInPings: ['events'],
    lifetime: 'ping',
    disabled: false,
  },
  []
);

/**
 * User clicked the "Can't scan code?" link
 *
 * Generated from `account_pref.two_step_auth_scan_code_link`.
 */
export const twoStepAuthScanCodeLink = new EventMetricType(
  {
    category: 'account_pref',
    name: 'two_step_auth_scan_code_link',
    sendInPings: ['events'],
    lifetime: 'ping',
    disabled: false,
  },
  []
);
/**
 * User started the 2FA setup process by viewing step 1 of the funnel, complete
 * with QR code for scanning.
 *
 * Generated from `account_pref.two_step_auth_qr_view`.
 */
export const twoStepAuthQrView = new EventMetricType(
  {
    category: 'account_pref',
    name: 'two_step_auth_qr_view',
    sendInPings: ['events'],
    lifetime: 'ping',
    disabled: false,
  },
  []
);

/**
 * Click on "Add" button on account settings page for adding 2FA to account
 *
 * Generated from `account_pref.two_step_auth_submit`.
 */
export const twoStepAuthSubmit = new EventMetricType(
  {
    category: 'account_pref',
    name: 'two_step_auth_submit',
    sendInPings: ['events'],
    lifetime: 'ping',
    disabled: false,
  },
  []
);

/**
 * View of the account settings page
 *
 * Generated from `account_pref.view`.
 */
export const view = new EventMetricType(
  {
    category: 'account_pref',
    name: 'view',
    sendInPings: ['events'],
    lifetime: 'ping',
    disabled: false,
  },
  []
);
