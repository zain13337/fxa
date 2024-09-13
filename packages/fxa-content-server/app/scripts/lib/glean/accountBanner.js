/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

// AUTOGENERATED BY glean_parser v14.5.2. DO NOT EDIT. DO NOT COMMIT.

import EventMetricType from '@mozilla/glean/private/metrics/event';

/**
 * User sees the promotion to setup a recovery key in settings page.
 *
 * Generated from `account_banner.create_recovery_key_view`.
 */
export const createRecoveryKeyView = new EventMetricType(
  {
    category: 'account_banner',
    name: 'create_recovery_key_view',
    sendInPings: ['events'],
    lifetime: 'ping',
    disabled: false,
  },
  []
);
