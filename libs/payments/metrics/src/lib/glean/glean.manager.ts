/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */
import {
  CartMetrics,
  CmsMetricsData,
  CommonMetrics,
  PaymentProvidersType,
  PaymentsGleanProvider,
} from './glean.types';
import { Inject, Injectable } from '@nestjs/common';
import { type PaymentsGleanServerEventsLogger } from './glean.provider';
import { mapSession } from './utils/mapSession';
import { mapUtm } from './utils/mapUtm';
import { mapSubscription } from './utils/mapSubscription';
import { mapRelyingParty } from './utils/mapRelyingParty';
import { normalizeGleanFalsyValues } from './utils/normalizeGleanFalsyValues';

@Injectable()
export class PaymentsGleanManager {
  constructor(
    @Inject(PaymentsGleanProvider)
    private paymentsGleanServerEventsLogger: PaymentsGleanServerEventsLogger
  ) {}

  recordFxaPaySetupView(metrics: {
    commonMetricsData: CommonMetrics;
    cartMetricsData: CartMetrics;
    cmsMetricsData: CmsMetricsData;
  }) {
    this.paymentsGleanServerEventsLogger.recordPaySetupView(
      this.populateCommonMetrics(metrics)
    );
  }

  recordFxaPaySetupEngage(metrics: {
    commonMetricsData: CommonMetrics;
    cartMetricsData: CartMetrics;
    cmsMetricsData: CmsMetricsData;
  }) {
    this.paymentsGleanServerEventsLogger.recordPaySetupEngage(
      this.populateCommonMetrics(metrics)
    );
  }

  recordFxaPaySetupSubmit(
    metrics: {
      commonMetricsData: CommonMetrics;
      cartMetricsData: CartMetrics;
      cmsMetricsData: CmsMetricsData;
    },
    paymentProvider?: PaymentProvidersType
  ) {
    this.paymentsGleanServerEventsLogger.recordPaySetupSubmit({
      ...this.populateCommonMetrics(metrics),
      subscription_payment_provider: normalizeGleanFalsyValues(paymentProvider),
    });
  }

  recordFxaPaySetupSuccess(
    metrics: {
      commonMetricsData: CommonMetrics;
      cartMetricsData: CartMetrics;
      cmsMetricsData: CmsMetricsData;
    },
    paymentProvider?: PaymentProvidersType
  ) {
    const commonMetrics = this.populateCommonMetrics(metrics);

    this.paymentsGleanServerEventsLogger.recordPaySetupSuccess({
      ...commonMetrics,
      subscription_payment_provider: normalizeGleanFalsyValues(paymentProvider),
    });
  }

  recordFxaPaySetupFail(
    metrics: {
      commonMetricsData: CommonMetrics;
      cartMetricsData: CartMetrics;
      cmsMetricsData: CmsMetricsData;
    },
    paymentProvider?: PaymentProvidersType
  ) {
    const commonMetrics = this.populateCommonMetrics(metrics);

    this.paymentsGleanServerEventsLogger.recordPaySetupFail({
      ...commonMetrics,
      subscription_payment_provider: normalizeGleanFalsyValues(paymentProvider),
    });
  }

  private populateCommonMetrics(metrics: {
    commonMetricsData: CommonMetrics;
    cartMetricsData: CartMetrics;
    cmsMetricsData: CmsMetricsData;
  }) {
    const { commonMetricsData, cartMetricsData, cmsMetricsData } = metrics;
    return {
      user_agent: commonMetricsData.userAgent,
      ip_address: commonMetricsData.ipAddress,
      account_user_id: normalizeGleanFalsyValues(cartMetricsData.uid),
      ...mapRelyingParty(commonMetricsData.searchParams),
      ...mapSession(
        commonMetricsData.searchParams,
        commonMetricsData.deviceType
      ),
      ...mapSubscription({
        commonMetricsData,
        cartMetricsData,
        cmsMetricsData,
      }),
      ...mapUtm(commonMetricsData.searchParams),
    };
  }
}
