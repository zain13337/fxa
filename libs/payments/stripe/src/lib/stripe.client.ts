/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

import { Injectable } from '@nestjs/common';
import { Stripe } from 'stripe';

import {
  StripeCustomer,
  StripeDeletedCustomer,
  StripeInvoice,
  StripeSubscription,
  StripeUpcomingInvoice,
} from './stripe.client.types';
import { StripeConfig } from './stripe.config';

/**
 * A wrapper for Stripe that enforces that results have deterministic typings
 * that represent their expanded/unexpanded state.
 */
@Injectable()
export class StripeClient {
  private readonly stripe: Stripe;
  constructor(private stripeConfig: StripeConfig) {
    this.stripe = new Stripe(this.stripeConfig.apiKey, {
      apiVersion: '2022-11-15',
      maxNetworkRetries: 3,
    });
  }

  /**
   * Retrieves a customer record directly from Stripe
   *
   * @param customerId The Stripe customer ID of the customer to fetch
   * @returns The customer record for the customerId provided
   */
  async fetchCustomer(
    customerId: string,
    params?: Stripe.CustomerRetrieveParams
  ) {
    const result = await this.stripe.customers.retrieve(customerId, {
      ...params,
      expand: ['tax'],
    });
    return result as StripeCustomer | StripeDeletedCustomer;
  }

  /**
   * Updates customer object with the values of the parameters passed
   *
   * @param customerId The Stripe customer ID of the customer to update
   * @param params Values to be updated in customer object
   * @returns The updated customer object or throws an error if paramaters are invalid
   */
  async updateCustomer(
    customerId: string,
    params?: Stripe.CustomerUpdateParams
  ) {
    const result = await this.stripe.customers.update(customerId, {
      ...params,
      expand: ['tax'],
    });

    return result as StripeCustomer;
  }

  /**
   * Retrieves subscriptions directly from Stripe
   */
  async fetchSubscriptions(params?: Stripe.SubscriptionListParams) {
    const result = await this.stripe.subscriptions.list({
      ...params,
      expand: undefined,
    });

    return result as Stripe.ApiList<StripeSubscription>;
  }

  async retrieveUpcomingInvoice(params?: Stripe.InvoiceRetrieveUpcomingParams) {
    const result = await this.stripe.invoices.retrieveUpcoming({
      ...params,
      expand: undefined,
    });
    return result as StripeUpcomingInvoice;
  }

  async finalizeInvoice(
    invoiceId: string,
    params?: Stripe.InvoiceFinalizeInvoiceParams
  ) {
    const result = await this.stripe.invoices.finalizeInvoice(invoiceId, {
      ...params,
      expand: undefined,
    });
    return result as StripeInvoice;
  }
}
