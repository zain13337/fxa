/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

import { LocalizerRsc } from '@fxa/shared/l10n/server';
import { formatPlanPricing } from '../../../utils/helpers';

type PriceIntervalProps = {
  l10n: LocalizerRsc;
  currency: string;
  interval: string;
  listAmount: number;
  totalAmount?: number;
};

export async function PriceInterval(props: PriceIntervalProps) {
  const { l10n, currency, interval, listAmount, totalAmount } = props;
  return l10n.getString(
    `plan-price-interval-${interval}`,
    {
      amount: l10n.getLocalizedCurrency(totalAmount || listAmount, currency),
    },
    formatPlanPricing(totalAmount || listAmount, currency, interval)
  );
}
