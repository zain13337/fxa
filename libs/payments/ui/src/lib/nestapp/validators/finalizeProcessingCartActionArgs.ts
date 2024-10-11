/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

import { IsString } from 'class-validator';

export class FinalizeProcessingCartActionArgs {
  @IsString()
  cartId!: string;
}
