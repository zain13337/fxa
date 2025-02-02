/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

import React from 'react';
import classNames from 'classnames';
import { useFtlMsgResolver } from '../../../models';
import {
  AlertFullIcon as AlertIcon,
  BackupCodesDisabledIcon,
  BackupCodesIcon,
  BackupRecoverySmsDisabledIcon,
  BackupRecoverySmsIcon,
  CheckmarkGreenIcon,
  LightbulbIcon,
} from '../../Icons';
import { FtlMsg } from 'fxa-react/lib/utils';
import { ButtonIconTrash } from '../ButtonIcon';
import LinkExternal, {
  LinkExternalProps,
} from 'fxa-react/components/LinkExternal';

type SubRowProps = {
  ctaGleanId: string;
  ctaMessage: string;
  icon: React.ReactNode;
  idPrefix: string;
  isEnabled: boolean;
  localizedRowTitle: string;
  localizedDeleteIconTitle?: string;
  message: React.ReactNode;
  onCtaClick: () => void;
  onDeleteClick?: () => void;
  localizedDescription?: string;
  localizedInfoMessage?: string;
  linkExternalProps?: LinkExternalProps;
};

export type BackupPhoneSubRowProps = Pick<
  SubRowProps,
  'onCtaClick' | 'onDeleteClick'
> & {
  phoneNumber?: string;
  showDescription?: boolean;
};

const SubRow = ({
  ctaGleanId,
  ctaMessage,
  icon,
  idPrefix,
  isEnabled,
  localizedDescription,
  localizedInfoMessage,
  message,
  onCtaClick,
  onDeleteClick,
  localizedRowTitle,
  localizedDeleteIconTitle,
  linkExternalProps,
}: SubRowProps) => {
  const StatusIcon = () => (
    <span className="grow-0 shrink-0 ">
      {isEnabled ? (
        <CheckmarkGreenIcon className="mt-1" mode="enabled" />
      ) : (
        <AlertIcon className="m-0" mode="attention" />
      )}
    </span>
  );

  const ExtraInfoLink = () => {
    return linkExternalProps ? (
      <LinkExternal
        href={linkExternalProps.href}
        className="link-blue inline ms-2"
        data-glean-id={linkExternalProps.gleanDataAttrs?.id}
      >
        {linkExternalProps.children}
      </LinkExternal>
    ) : null;
  };

  return (
    <div
      className={classNames(
        'flex flex-col w-full max-w-full mt-8 p-4 @mobileLandscape/unitRow:mt-4 @mobileLandscape/unitRow:rounded-lg border items-start text-sm gap-2',
        {
          'bg-grey-10 border-transparent': !isEnabled,
          'bg-white border-grey-100': isEnabled,
        }
      )}
    >
      <div
        className={classNames(
          'flex flex-col @mobileLandscape/unitRow:flex-row w-full max-w-full items-start text-sm gap-4'
        )}
        data-testid={`${idPrefix}-sub-row`}
      >
        <div className="flex flex-row justify-between flex-1 flex-wrap items-center">
          <div className="flex items-center gap-2">
            <div className="grow-0 shrink-0">{icon}</div>
            <p className="font-semibold">{localizedRowTitle}</p>
          </div>
          <div>
            <div className="flex items-center gap-1">
              <StatusIcon />
              {message}
            </div>
            {!localizedDescription &&
              !localizedInfoMessage &&
              linkExternalProps && <ExtraInfoLink />}
          </div>
          {localizedDescription && (
            <p className="text-sm w-full mx-2 mt-2">
              {localizedDescription}{' '}
              {!localizedInfoMessage && linkExternalProps && <ExtraInfoLink />}
            </p>
          )}
        </div>
        <button
          className="cta-base-common cta-neutral cta-base-p shrink-0 mt-0 w-full @mobileLandscape/unitRow:w-auto @mobileLandscape/unitRow:text-xs @mobileLandscape/unitRow:py-1 @mobileLandscape/unitRow:px-5 @mobileLandscape/unitRow:mt-0"
          onClick={onCtaClick}
          data-glean-id={ctaGleanId}
        >
          {ctaMessage}
        </button>
        {onDeleteClick && localizedDeleteIconTitle && (
          <>
            <div className="@mobileLandscape/unitRow:hidden w-full shrink-0">
              <FtlMsg id="tfa-row-backup-phone-delete-button">
                <button
                  className="cta-base-common cta-neutral cta-base-p -mt-2 w-full"
                  onClick={onDeleteClick}
                  title={localizedDeleteIconTitle}
                  data-glean-id={`${idPrefix}-delete-button`}
                >
                  Remove
                </button>
              </FtlMsg>
            </div>
            <div className="hidden @mobileLandscape/unitRow:flex">
              <ButtonIconTrash
                onClick={onDeleteClick}
                title={localizedDeleteIconTitle}
                gleanDataAttrs={{ id: `${idPrefix}-delete-button` }}
              />
            </div>
          </>
        )}
      </div>
      {localizedInfoMessage && (
        <div className="flex w-full max-w-full mt-2 gap-2 bg-gradient-to-tr from-blue-600/10 to-purple-500/10 rounded-md l py-2 px-4 mt-1 items-center">
          <LightbulbIcon className="shrink-0" />
          <p className="text-sm">
            {localizedInfoMessage}
            {linkExternalProps && <ExtraInfoLink />}
          </p>
        </div>
      )}
    </div>
  );
};

export const BackupCodesSubRow = ({
  numCodesAvailable,
  onCtaClick,
}: Pick<SubRowProps, 'onCtaClick'> & {
  numCodesAvailable?: number;
}) => {
  const ftlMsgResolver = useFtlMsgResolver();
  const hasCodesRemaining = !!numCodesAvailable && numCodesAvailable > 0;
  const icon = hasCodesRemaining ? (
    <BackupCodesIcon className="-ms-1 -my-2 scale-50" />
  ) : (
    <BackupCodesDisabledIcon className="-ms-1 -my-2 scale-50" />
  );
  const message = hasCodesRemaining ? (
    <FtlMsg id="tfa-row-backup-codes-available" vars={{ numCodesAvailable }}>
      <p>{`${numCodesAvailable} codes remaining`}</p>
    </FtlMsg>
  ) : (
    <FtlMsg id="tfa-row-backup-codes-not-available">
      <p>No codes available</p>
    </FtlMsg>
  );
  const ctaMessage = hasCodesRemaining
    ? ftlMsgResolver.getMsg('tfa-row-backup-codes-get-new-cta', 'Get new codes')
    : ftlMsgResolver.getMsg('tfa-row-backup-codes-add-cta', 'Add');

  const ctaGleanId = hasCodesRemaining
    ? 'account_pref_two_step_auth_codes_get_new_submit'
    : 'account_pref_two_step_auth_codes_add_submit';

  return (
    <SubRow
      {...{
        ctaGleanId,
        ctaMessage,
        icon,
        message,
        onCtaClick,
      }}
      idPrefix="backup-authentication-codes"
      localizedRowTitle={ftlMsgResolver.getMsg(
        'tfa-row-backup-codes-title',
        'Backup authentication codes'
      )}
      isEnabled={hasCodesRemaining}
      localizedDescription={ftlMsgResolver.getMsg(
        'tfa-row-backup-codes-description-2',
        'This is the safest recovery method if you canʼt use your mobile device or authenticator app.'
      )}
    />
  );
};

export const BackupPhoneSubRow = ({
  phoneNumber,
  onCtaClick,
  onDeleteClick,
}: BackupPhoneSubRowProps) => {
  const ftlMsgResolver = useFtlMsgResolver();
  const hasPhoneNumber = !!phoneNumber;
  const icon = hasPhoneNumber ? (
    <BackupRecoverySmsIcon className="-ms-1 -my-2 scale-50" />
  ) : (
    <BackupRecoverySmsDisabledIcon className="-ms-1 -my-2 scale-50" />
  );
  const message = hasPhoneNumber ? (
    // We will likely want to only retrieve the last 4 digits of the phone number from the backend
    // but adding a slice here just in case to ensure only the last 4 digits are displayed
    // u2022 is a bullet point character
    // This format works for a North American phone number, but may need to be adjusted for other formats
    // durring next phases of SMS feature rollout
    // Phone numbers should always be displayed left-to-right, *including* in rtl languages
    // • is a bullet point character (\u2022)
    <p dir="ltr">{`••• ••• ${phoneNumber.slice(-4)}`}</p>
  ) : (
    <FtlMsg id="tfa-row-backup-phone-not-available">
      <p>No recovery phone number available</p>
    </FtlMsg>
  );
  const ctaMessage = hasPhoneNumber
    ? ftlMsgResolver.getMsg('tfa-row-backup-phone-change-cta', 'Change')
    : ftlMsgResolver.getMsg('tfa-row-backup-phone-add-cta', 'Add');

  const ctaGleanId = hasPhoneNumber
    ? 'account_pref_two_step_auth_phone_change_submit'
    : 'account_pref_two_step_auth_phone_add_submit';

  const localizedDeleteIconTitle = ftlMsgResolver.getMsg(
    'tfa-row-backup-phone-delete-title',
    'Remove backup recovery phone'
  );

  const linkExternalProps = {
    // TODO add a link to the knowledge base article once it is available
    href: '',
    children: ftlMsgResolver.getMsg(
      'tfa-row-backup-phone-sim-swap-risk-link',
      'Learn about SIM swap risk'
    ),
    gleanDataAttrs: {
      id: 'account_pref_two_step_auth_phone_learn_more_link',
    },
  };

  return (
    <SubRow
      idPrefix="backup-recovery-phone"
      isEnabled={hasPhoneNumber}
      {...(hasPhoneNumber && !onDeleteClick
        ? {
            // info message should only be shown when a phone number is set and the user can't delete it
            // (i.e. when the user has no other recovery method)
            localizedInfoMessage: ftlMsgResolver.getMsg(
              'tfa-row-backup-phone-delete-restriction',
              'If you want to remove your backup recovery phone, add backup authentication codes or disable two-step authentication first to avoid getting locked out of your account.'
            ),
          }
        : null)}
      {...((!hasPhoneNumber || (hasPhoneNumber && onDeleteClick)) && {
        // description should not be shown when the user can't delete the phone number (only one message displayed at a time)
        // description should only be shown when both backup authentication codes and backup recovery phone
        // are available recovery methods (description is intended to allow for comparison of the two methods)
        localizedDescription: ftlMsgResolver.getMsg(
          'tfa-row-backup-phone-description',
          'This is the easier recovery method if you canʼt use your authenticator app.'
        ),
      })}
      {...{
        ctaGleanId,
        ctaMessage,
        icon,
        message,
        onCtaClick,
        onDeleteClick,
        localizedDeleteIconTitle,
        linkExternalProps,
      }}
      localizedRowTitle={ftlMsgResolver.getMsg(
        'tfa-row-backup-phone-title',
        'Backup recovery phone'
      )}
    />
  );
};

export default SubRow;
