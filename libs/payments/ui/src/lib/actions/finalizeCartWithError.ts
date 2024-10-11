/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

'use server';

import { plainToClass } from 'class-transformer';
import { getApp } from '../nestapp/app';
import { FinalizeCartWithErrorArgs } from '../nestapp/validators/FinalizeCartWithErrorArgs';
import { CartErrorReasonId } from '@fxa/shared/db/mysql/account/kysely-types';

export const finalizeCartWithError = async (
  cartId: string,
  errorReasonId: CartErrorReasonId
) => {
  return await getApp().getActionsService().finalizeCartWithError(
    plainToClass(FinalizeCartWithErrorArgs, {
      cartId,
      errorReasonId,
    })
  );
};
