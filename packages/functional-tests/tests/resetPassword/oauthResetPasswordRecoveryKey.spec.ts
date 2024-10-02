/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

import { expect, test } from '../../lib/fixtures/standard';
import { ResetPasswordPage } from '../../pages/resetPassword';
import { SigninPage } from '../../pages/signin';

test.describe('severity-1 #smoke', () => {
  test.describe('oauth reset password with recovery key', () => {
    test('reset password with account recovery key', async ({
      target,
      pages: { page, recoveryKey, relier, resetPassword, settings, signin },
      testAccountTracker,
    }) => {
      const credentials = await testAccountTracker.signUp();
      const newPassword = testAccountTracker.generatePassword();

      await signin.goto();
      await signin.fillOutEmailFirstForm(credentials.email);
      await signin.fillOutPasswordForm(credentials.password);

      // Goes to settings and enables the account recovery key on user's account.
      await settings.recoveryKey.createButton.click();
      const accountRecoveryKey = await recoveryKey.createRecoveryKey(
        credentials.password,
        'hint'
      );
      await settings.signOut();

      // Make sure user is not signed in, and goes to the relier (ie 123done)
      await relier.goto();

      await relier.clickEmailFirst();

      await beginPasswordReset(credentials.email, resetPassword, signin);

      const code = await target.emailClient.getResetPasswordCode(
        credentials.email
      );

      await resetPassword.fillOutResetPasswordCodeForm(code);
      await resetPassword.fillOutRecoveryKeyForm(accountRecoveryKey);
      await resetPassword.fillOutNewPasswordForm(newPassword);

      await expect(page).toHaveURL(/reset_password_with_recovery_key_verified/);
      await expect(resetPassword.passwordResetSuccessMessage).toBeVisible();
      await expect(resetPassword.generateRecoveryKeyButton).toBeVisible();

      // User is shown a prompt to generate a new recovery key
      // and is signed in after the password reset so can click through to create a new key.
      await resetPassword.generateRecoveryKeyButton.click();
      await expect(recoveryKey.accountRecoveryKeyHeading).toBeVisible();
      await recoveryKey.createRecoveryKey(newPassword, 'hint');

      // Currently redirects to settings page after creating a new recovery key
      // In FXA-7904, we will redirect back to the relier after a new key is autogenerated.
      await expect(settings.settingsHeading).toBeVisible();
      await expect(settings.recoveryKey.status).toHaveText('Enabled');

      // update password for cleanup function
      credentials.password = newPassword;
    });
  });

  async function beginPasswordReset(
    email: string,
    resetPassword: ResetPasswordPage,
    signin: SigninPage
  ): Promise<void> {
    await signin.fillOutEmailFirstForm(email);
    await signin.forgotPasswordLink.click();
    await resetPassword.fillOutEmailForm(email);
  }
});
