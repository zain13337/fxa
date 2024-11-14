/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

export enum SupportedPages {
  START = 'start',
  PROCESSING = 'processing',
  NEEDS_INPUT = 'needs_input',
  SUCCESS = 'success',
  ERROR = 'error',
}

export type CheckoutParams = {
  cartId: string;
  locale: string;
  interval: string;
  offeringId: string;
};
