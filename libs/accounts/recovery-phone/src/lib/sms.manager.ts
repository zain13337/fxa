/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

import { LOGGER_PROVIDER } from '@fxa/shared/log';
import { StatsDService } from '@fxa/shared/metrics/statsd';
import { Inject, Injectable, LoggerService } from '@nestjs/common';
import { StatsD } from 'hot-shots';
import { Twilio } from 'twilio';
import { SmsManagerConfig } from './sms.manger.config';
import { TwilioProvider } from './twilio.provider';
import {
  RecoveryNumberInvalidFormatError,
  RecoveryNumberNotSupportedError,
  TwilioErrorCodes,
} from './recovery-phone.errors';

@Injectable()
export class SmsManager {
  constructor(
    @Inject(TwilioProvider) private readonly client: Twilio,
    @Inject(StatsDService) private readonly metrics: StatsD,
    @Inject(LOGGER_PROVIDER) private readonly log: LoggerService,
    private readonly config: SmsManagerConfig
  ) {}

  public async phoneNumberLookup(phoneNumber: string) {
    const result = await this.client.lookups.v2
      .phoneNumbers(phoneNumber)
      .fetch();
    // Calling toJSON converts PhoneNumberInstance into a
    // object that just holds state and can be serialized.
    return result.toJSON();
  }

  public async sendSMS({
    to,
    body,
    uid,
  }: {
    to: string;
    body: string;
    uid?: string;
  }) {
    if (body.length > this.config.maxMessageLength) {
      throw new Error(
        `Body cannot be greater than ${this.config.maxMessageLength} characters.`
      );
    }

    if (this.config.validNumberPrefixes) {
      if (
        !this.config.validNumberPrefixes.some((prefix) => to.startsWith(prefix))
      ) {
        throw new RecoveryNumberNotSupportedError(to);
      }
    }

    try {
      const msg = await this.client.messages.create({
        to,
        // TODO: Should this just be passed in every time or set from config?
        //       Will we always send from the same number?
        from: this.config.from,
        body,
      });
      // Typically the message will be in queued status. The following metric and log
      // can help track or debug send problems.
      this.metrics.increment('sms.send.' + msg.status);
      this.log.log('SMS sent', {
        sid: msg.sid,
        status: msg.status,
      });
      return msg;
    } catch (err) {
      this.metrics.increment('sms.send.error');

      if (err.code === TwilioErrorCodes.INVALID_TO_PHONE_NUMBER) {
        throw new RecoveryNumberInvalidFormatError(uid || '', to, err);
      }
      throw err;
    }
  }
}
