/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

import React, { ReactNode } from 'react';
import { render } from '@testing-library/react';
import { History } from '@reach/router';
import App from '.';
import { Account, AppContext, useInitialSettingsState } from '../../models';
import {
  mockAppContext,
  MOCK_ACCOUNT,
  renderWithRouter,
  mockSession,
} from '../../models/mocks';
import { Config } from '../../lib/config';
import * as NavTiming from 'fxa-shared/metrics/navigation-timing';
import { HomePath } from '../../constants';
import AppLocalizationProvider from 'fxa-react/lib/AppLocalizationProvider';

jest.mock('../../models', () => ({
  ...jest.requireActual('../../models'),
  useInitialSettingsState: jest.fn(),
}));

jest.mock('./ScrollToTop', () => ({
  __esModule: true,
  ScrollToTop: ({ children }: { children: ReactNode }) => (
    <span data-testid="ScrollTop">{children}</span>
  ),
}));

const flowQueryParams = {
  deviceId: 'x',
  flowBeginTime: 1,
  flowId: 'x',
};

describe('performance metrics', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  const navSpy = jest.spyOn(NavTiming, 'observeNavigationTiming');

  const config = {
    metrics: { navTiming: { enabled: true, endpoint: '/foobar' } },
  } as Config;

  afterEach(() => {
    navSpy.mockClear();
  });

  it('observeNavigationTiming is called when metrics collection is enabled', () => {
    (useInitialSettingsState as jest.Mock).mockReturnValueOnce({
      loading: true,
    });
    const account = {
      metricsEnabled: true,
      hasPassword: true,
    } as unknown as Account;
    render(
      <AppContext.Provider value={mockAppContext({ account, config })}>
        <App {...{ flowQueryParams }} />
      </AppContext.Provider>
    );
    expect(NavTiming.observeNavigationTiming).toHaveBeenCalledWith('/foobar');
  });

  it('observeNavigationTiming is not called when metrics collection is disabled', () => {
    (useInitialSettingsState as jest.Mock).mockReturnValueOnce({
      loading: true,
    });
    const account = {
      metricsEnabled: false,
      hasPassword: true,
    } as unknown as Account;
    render(
      <AppContext.Provider value={mockAppContext({ account, config })}>
        <AppContext.Provider value={mockAppContext({ account, config })}>
          <App {...{ flowQueryParams }} />
        </AppContext.Provider>
      </AppContext.Provider>
    );
    expect(NavTiming.observeNavigationTiming).not.toHaveBeenCalled();
  });
});

describe('App component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.spyOn(console, 'error').mockImplementation(() => {});
    (useInitialSettingsState as jest.Mock).mockReturnValue({ loading: false });
  });

  it('renders `LoadingSpinner` component when loading initial state is true', () => {
    (useInitialSettingsState as jest.Mock).mockReturnValueOnce({
      loading: true,
    });
    const { getByLabelText } = renderWithRouter(
      <App {...{ flowQueryParams }} />
    );

    expect(getByLabelText('Loading…')).toBeInTheDocument();
  });

  it('renders `AppErrorDialog` component when settings query errors', () => {
    (useInitialSettingsState as jest.Mock).mockReturnValueOnce({
      error: { message: 'Error' },
    });
    const { getByRole } = renderWithRouter(<App {...{ flowQueryParams }} />);

    expect(getByRole('heading', { level: 2 })).toHaveTextContent(
      'General application error'
    );
  });

  it('routes to PageSettings', async () => {
    const {
      getByTestId,
      history: { navigate },
    } = renderWithRouter(<App {...{ flowQueryParams }} />, { route: HomePath });

    await navigate(HomePath);

    expect(getByTestId('settings-profile')).toBeInTheDocument();
  });

  it('routes to PageDisplayName', async () => {
    const {
      getByTestId,
      history: { navigate },
    } = renderWithRouter(<App {...{ flowQueryParams }} />, { route: HomePath });

    await navigate(HomePath + '/display_name');

    expect(getByTestId('input-label')).toHaveTextContent('Enter display name');
  });

  it('routes to PageAvatar', async () => {
    const {
      getAllByTestId,
      history: { navigate },
    } = renderWithRouter(<App {...{ flowQueryParams }} />, { route: HomePath });

    await navigate(HomePath + '/avatar');

    expect(getAllByTestId('avatar-nondefault')[0]).toBeInTheDocument();
  });

  it('routes to PageChangePassword', async () => {
    const session = mockSession(true);
    const {
      getByTestId,
      history: { navigate },
    } = renderWithRouter(
      <AppContext.Provider value={mockAppContext({ session })}>
        <App {...{ flowQueryParams }} />
      </AppContext.Provider>,
      { route: HomePath }
    );

    await navigate(HomePath + '/change_password');

    expect(getByTestId('change-password-requirements')).toBeInTheDocument();
  });

  it('routes to PageSecondaryEmailAdd', async () => {
    const session = mockSession(true);
    const {
      getByTestId,
      history: { navigate },
    } = renderWithRouter(
      <AppContext.Provider value={mockAppContext({ session })}>
        <App {...{ flowQueryParams }} />
      </AppContext.Provider>,
      { route: HomePath }
    );

    await navigate(HomePath + '/emails');

    expect(getByTestId('secondary-email-input')).toBeInTheDocument();
  });

  it('routes to PageSecondaryEmailVerify', async () => {
    const session = mockSession(true);
    const {
      getByTestId,
      history: { navigate },
    } = renderWithRouter(
      <AppContext.Provider value={mockAppContext({ session })}>
        <App {...{ flowQueryParams }} />
      </AppContext.Provider>,
      { route: HomePath }
    );

    await navigate(HomePath + '/emails/verify');

    expect(getByTestId('secondary-email-verify-form')).toBeInTheDocument();
  });

  it('routes to PageTwoStepAuthentication', async () => {
    const session = mockSession(true);
    const {
      getByTestId,
      history: { navigate },
    } = renderWithRouter(
      <AppContext.Provider value={mockAppContext({ session })}>
        <App {...{ flowQueryParams }} />
      </AppContext.Provider>,
      { route: HomePath }
    );

    await navigate(HomePath + '/two_step_authentication');

    expect(getByTestId('totp-input')).toBeInTheDocument();
  });

  it('routes to Page2faReplaceRecoveryCodes', async () => {
    const session = mockSession(true);
    const {
      getByTestId,
      history: { navigate },
    } = renderWithRouter(
      <AppContext.Provider value={mockAppContext({ session })}>
        <App {...{ flowQueryParams }} />
      </AppContext.Provider>,
      { route: HomePath }
    );

    await navigate(HomePath + '/two_step_authentication/replace_codes');

    expect(getByTestId('2fa-recovery-codes')).toBeInTheDocument();
  });

  it('routes to PageDeleteAccount', async () => {
    const session = mockSession(true);
    const {
      getByTestId,
      history: { navigate },
    } = renderWithRouter(
      <AppContext.Provider value={mockAppContext({ session })}>
        <App {...{ flowQueryParams }} />
      </AppContext.Provider>,
      { route: HomePath }
    );

    await navigate(HomePath + '/delete_account');

    expect(getByTestId('delete-account-confirm')).toBeInTheDocument();
  });

  it('redirects to ConnectedServices', async () => {
    const {
      history,
      history: { navigate },
    } = renderWithRouter(<App {...{ flowQueryParams }} />, { route: HomePath });

    await navigate(HomePath + '/clients');

    expect(history.location.pathname).toBe('/settings#connected-services');
  });

  it('redirects to PageAvatar', async () => {
    const {
      history,
      history: { navigate },
    } = renderWithRouter(<App {...{ flowQueryParams }} />, { route: HomePath });

    await navigate(HomePath + '/avatar/change');

    expect(history.location.pathname).toBe('/settings/avatar');
  });

  it('redirects to CreatePassword', async () => {
    const {
      history,
      history: { navigate },
    } = renderWithRouter(<App {...{ flowQueryParams }} />, { route: HomePath });

    await navigate(HomePath + '/create_password');
    expect(history.location.pathname).toBe('/settings/change_password');
  });

  describe('prevents access to certain routes when account has no password', () => {
    let history: History;

    beforeEach(async () => {
      const account = {
        ...MOCK_ACCOUNT,
        hasPassword: false,
      } as unknown as Account;

      const config = {
        l10n: { strict: true },
        metrics: { navTiming: { enabled: true, endpoint: '/foobar' } },
      } as Config;

      ({ history } = renderWithRouter(
        <AppContext.Provider value={mockAppContext({ account, config })}>
          <AppLocalizationProvider
            messages={{ en: ['testo: lol'] }}
            reportError={() => {}}
          >
            <App {...{ flowQueryParams }} />
          </AppLocalizationProvider>
        </AppContext.Provider>,
        { route: HomePath }
      ));
    });

    it('redirects PageRecoveryKeyCreate', async () => {
      await history.navigate(HomePath + '/account_recovery');
      expect(history.location.pathname).toBe('/settings');
    });

    it('redirects PageTwoStepAuthentication', async () => {
      await history.navigate(HomePath + '/two_step_authentication');
      expect(history.location.pathname).toBe('/settings');
    });

    it('redirects Page2faReplaceRecoveryCodes', async () => {
      await history.navigate(
        HomePath + '/two_step_authentication/replace_codes'
      );
      expect(history.location.pathname).toBe('/settings');
    });

    it('redirects ChangePassword', async () => {
      await history.navigate(HomePath + '/change_password');
      expect(history.location.pathname).toBe('/settings/create_password');
    });
  });
});
