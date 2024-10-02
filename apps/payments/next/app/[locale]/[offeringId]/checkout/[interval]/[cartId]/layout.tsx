/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */
import { headers } from 'next/headers';

import { CouponForm, PurchaseDetails } from '@fxa/payments/ui';
import {
  fetchCMSData,
  getApp,
  getCartAction,
  Details,
  PriceInterval,
  SubscriptionTitle,
  TermsAndPrivacy,
} from '@fxa/payments/ui/server';
import { DEFAULT_LOCALE } from '@fxa/shared/l10n';
import { config } from 'apps/payments/next/config';
import { MetricsWrapper } from '@fxa/payments/ui';

// TODO - Replace these placeholders as part of FXA-8227
export const metadata = {
  title: 'Mozilla accounts',
  description: 'Mozilla accounts',
};

export interface CheckoutParams {
  cartId: string;
  locale: string;
  interval: string;
  offeringId: string;
}

export interface CheckoutSearchParams {
  experiment?: string;
  promotion_code?: string;
}

export default async function RootLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: CheckoutParams;
}) {
  // Temporarily defaulting to `accept-language`
  // This to be updated in FXA-9404
  //const locale = getLocaleFromRequest(
  //  params,
  //  headers().get('accept-language')
  //);
  const locale = headers().get('accept-language') || DEFAULT_LOCALE;
  const cmsDataPromise = fetchCMSData(params.offeringId, locale);
  const cartDataPromise = getCartAction(params.cartId);
  const l10n = getApp().getL10n(locale);
  const [cms, cart] = await Promise.all([cmsDataPromise, cartDataPromise]);

  return (
    <MetricsWrapper cart={cart}>
      <SubscriptionTitle cartState={cart.state} l10n={l10n} />

      <section
        className="mb-6 tablet:mt-6 tablet:min-w-[18rem] tablet:max-w-xs tablet:col-start-2 tablet:col-end-auto tablet:row-start-1 tablet:row-end-3"
        aria-label="Purchase details"
      >
        <PurchaseDetails
          priceInterval={
            <PriceInterval
              l10n={l10n}
              currency={cart.invoicePreview.currency}
              interval={cart.interval}
              listAmount={cart.invoicePreview.listAmount}
            />
          }
          purchaseDetails={
            cms.defaultPurchase.data.attributes.purchaseDetails.data.attributes.localizations.data.at(
              0
            )?.attributes ||
            cms.defaultPurchase.data.attributes.purchaseDetails.data.attributes
          }
        >
          <Details
            l10n={l10n}
            interval={cart.interval}
            invoice={cart.invoicePreview}
            purchaseDetails={
              cms.defaultPurchase.data.attributes.purchaseDetails.data.attributes.localizations.data.at(
                0
              )?.attributes ||
              cms.defaultPurchase.data.attributes.purchaseDetails.data
                .attributes
            }
          />
        </PurchaseDetails>
        <CouponForm
          cartId={cart.id}
          cartVersion={cart.version}
          promoCode={cart.couponCode}
          readOnly={false}
        />
      </section>

      <div className="bg-white rounded-b-lg shadow-sm shadow-grey-300 border-t-0 mb-6 pt-4 px-4 pb-14 text-grey-600 desktop:px-12 desktop:pb-12 rounded-t-lg tablet:rounded-t-none">
        {children}
        <TermsAndPrivacy
          l10n={l10n}
          {...cart}
          {...(cms.commonContent.data.attributes.localizations.data.at(0)
            ?.attributes || cms.commonContent.data.attributes)}
          {...(cms.defaultPurchase.data.attributes.purchaseDetails.data.attributes.localizations.data.at(
            0
          )?.attributes ||
            cms.defaultPurchase.data.attributes.purchaseDetails.data
              .attributes)}
          contentServerUrl={config.contentServerUrl}
          showFXALinks={true}
        />
      </div>
    </MetricsWrapper>
  );
}
