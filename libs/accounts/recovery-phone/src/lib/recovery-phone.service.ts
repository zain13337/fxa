/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

import { Injectable } from '@nestjs/common';
import { SmsManager } from './sms.manager';
import { OtpManager } from '@fxa/shared/otp';
import { RecoveryPhoneConfig } from './recovery-phone.service.config';
import { RecoveryPhoneManager } from './recovery-phone.manager';
import {
  RecoveryNumberNotExistsError,
  RecoveryNumberNotSupportedError,
} from './recovery-phone.errors';
import { MessageInstance } from 'twilio/lib/rest/api/v2010/account/message';

@Injectable()
export class RecoveryPhoneService {
  constructor(
    private readonly recoveryPhoneManager: RecoveryPhoneManager,
    private readonly smsManager: SmsManager,
    private readonly otpCode: OtpManager,
    private readonly config: RecoveryPhoneConfig
  ) {}

  /**
   * Checks to see if a user can set up a recovery phone number. This is based on the
   * user's region, if they have backup codes, or if they already set up a recovery phone.
   *
   * @param uid
   * @param region
   */
  public async available(uid: string, region: string): Promise<boolean> {
    if (!this.config.enabled) {
      return false;
    }

    if (!this.config.allowedRegions?.includes(region)) {
      return false;
    }

    const hasConfirmed = await this.hasConfirmed(uid);
    if (hasConfirmed.exists) {
      return false;
    }

    // User can set up a recovery phone if they have backup codes
    return await this.recoveryPhoneManager.hasRecoveryCodes(uid);
  }

  /**
   * Setups (ie registers) a new phone number to an account uid. Accomplishes setup
   * by sending the phone number provided an OTP code to verify.
   * @param uid The account id
   * @param phoneNumber The phone number to register
   * @returns True if code was sent and stored
   */
  public async setupPhoneNumber(uid: string, phoneNumber: string) {
    if (this.config.sms && this.config.sms.validNumberPrefixes) {
      const allowed = this.config.sms.validNumberPrefixes.some((check) => {
        return phoneNumber.startsWith(check);
      });

      if (!allowed) {
        throw new RecoveryNumberNotSupportedError(phoneNumber);
      }
    }

    const code = await this.otpCode.generateCode();
    const msg = await this.smsManager.sendSMS({
      to: phoneNumber,
      body: code,
    });

    if (!this.isSuccessfulSmsSend(msg)) {
      return false;
    }

    await this.recoveryPhoneManager.storeUnconfirmed(
      uid,
      code,
      phoneNumber,
      true
    );
    return true;
  }

  /**
   * Confirms a UID code. This will also and finalizes the phone number setup if the code provided was
   * intended for phone number setup.
   * @param uid An account id
   * @param code A otp code
   * @returns True if successful
   */
  public async confirmCode(uid: string, code: string) {
    const data = await this.recoveryPhoneManager.getUnconfirmed(uid, code);

    // If there is no data, it means there's no record of this code being sent to the uid provided
    if (data == null) {
      return false;
    }

    // If this was for a setup operation. Register the phone number to the uid.
    if (data.isSetup === true) {
      const lookupData = await this.smsManager.phoneNumberLookup(
        data.phoneNumber
      );
      await this.recoveryPhoneManager.registerPhoneNumber(
        uid,
        data.phoneNumber,
        lookupData
      );
    }

    // There was a record matching, the uid / code. The confirmation was successful.
    return true;
  }

  /**
   * Remove phone number from an account. Each user can only have one associated
   * phone number.
   *
   * @param uid An account id
   */
  public async removePhoneNumber(uid: string) {
    return await this.recoveryPhoneManager.removePhoneNumber(uid);
  }

  /**
   * Checks if the given uid has confirmed a phone number.
   * @param uid Account id
   * @returns If the account has confirmed, returns {exists:true, phoneNumber }. If not returns {exists:false}
   */
  public async hasConfirmed(
    uid: string
  ): Promise<{ exists: boolean; phoneNumber?: string }> {
    try {
      const { phoneNumber } =
        await this.recoveryPhoneManager.getConfirmedPhoneNumber(uid);
      return {
        exists: true,
        phoneNumber,
      };
    } catch (err) {
      if (err instanceof RecoveryNumberNotExistsError) {
        // no-op - we handle the error, and just return false;
        return {
          exists: false,
          phoneNumber: undefined,
        };
      }
      // Something unexpected happened...
      throw err;
    }
  }

  /**
   * Sends an totp code to a user
   * @param uid Account id
   * @returns True if message didn't fail to send.
   */
  public async sendCode(uid: string) {
    const { phoneNumber } =
      await this.recoveryPhoneManager.getConfirmedPhoneNumber(uid);
    const code = await this.otpCode.generateCode();
    await this.recoveryPhoneManager.storeUnconfirmed(
      uid,
      code,
      phoneNumber,
      false
    );
    const msg = await this.smsManager.sendSMS({
      to: phoneNumber,
      body: `${code}`, // TODO: Other text or translation around code?
    });

    return this.isSuccessfulSmsSend(msg);
  }

  private isSuccessfulSmsSend(msg: MessageInstance) {
    if (
      msg == null ||
      msg.status === 'failed' ||
      msg.status === 'canceled' ||
      msg.status === 'undelivered'
    ) {
      return false;
    }

    // TBD: Need to check other message states?

    return true;
  }
}
