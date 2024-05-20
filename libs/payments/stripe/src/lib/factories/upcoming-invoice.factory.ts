/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

import { faker } from '@faker-js/faker';
import { StripeUpcomingInvoice } from '../stripe.client.types';
import { StripeInvoiceLineItemFactory } from './invoice-line-item.factory';

export const StripeUpcomingInvoiceFactory = (
  override?: Partial<StripeUpcomingInvoice>
): StripeUpcomingInvoice => ({
  object: 'invoice',
  account_country: null,
  account_name: null,
  account_tax_ids: null,
  amount_due: faker.number.int({ max: 1000 }),
  amount_paid: 0,
  amount_remaining: faker.number.int({ max: 1000 }),
  amount_shipping: 0,
  application: null,
  application_fee_amount: null,
  attempt_count: 0,
  attempted: true,
  automatic_tax: {
    enabled: true,
    liability: null,
    status: 'complete',
  },
  billing_reason: null,
  charge: faker.string.alphanumeric(10),
  collection_method: 'charge_automatically',
  created: faker.number.int(),
  currency: faker.finance.currencyCode(),
  custom_fields: null,
  customer: `cus_${faker.string.alphanumeric({ length: 14 })}`,
  customer_address: null,
  customer_email: faker.internet.email(),
  customer_name: null,
  customer_phone: null,
  customer_shipping: null,
  customer_tax_exempt: null,
  default_payment_method: faker.string.alphanumeric(10),
  default_source: faker.string.alphanumeric(10),
  default_tax_rates: [],
  description: null,
  discount: null,
  discounts: [],
  due_date: null,
  ending_balance: null,
  effective_at: null,
  footer: null,
  from_invoice: null,
  issuer: {
    type: 'self',
  },
  last_finalization_error: null,
  latest_revision: null,
  lines: {
    object: 'list',
    data: [StripeInvoiceLineItemFactory()],
    has_more: false,
    url: faker.internet.url(),
  },
  livemode: false,
  metadata: null,
  next_payment_attempt: null,
  number: null,
  on_behalf_of: null,
  paid: false,
  paid_out_of_band: false,
  payment_intent: faker.string.alphanumeric(10),
  payment_settings: {
    default_mandate: null,
    payment_method_options: null,
    payment_method_types: null,
  },
  period_end: faker.number.int({ min: 1000000 }),
  period_start: faker.number.int({ max: 1000000 }),
  post_payment_credit_notes_amount: 0,
  pre_payment_credit_notes_amount: 0,
  quote: null,
  receipt_number: null,
  rendering: null,
  shipping_cost: null,
  shipping_details: null,
  starting_balance: faker.number.int({ max: 1000 }),
  statement_descriptor: null,
  status: null,
  status_transitions: {
    finalized_at: null,
    marked_uncollectible_at: null,
    paid_at: null,
    voided_at: null,
  },
  subscription: `sub_${faker.string.alphanumeric({ length: 24 })}`,
  subscription_details: null,
  subtotal: faker.number.int({ max: 1000 }),
  subtotal_excluding_tax: faker.number.int({ max: 1000 }),
  tax: faker.number.int({ max: 1000 }),
  test_clock: null,
  total: faker.number.int({ max: 1000 }),
  total_discount_amounts: null,
  total_excluding_tax: faker.number.int({ max: 1000 }),
  total_tax_amounts: [],
  transfer_data: null,
  webhooks_delivered_at: null,
  ...override,
});
