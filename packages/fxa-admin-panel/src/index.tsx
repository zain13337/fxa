/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

import React from 'react';
import ReactDOM from 'react-dom';
import { ApolloProvider } from '@apollo/client';
import { ApolloClient, createHttpLink, InMemoryCache } from '@apollo/client';
import { setContext } from '@apollo/client/link/context';
import { config, readConfigFromMeta } from './lib/config';
import App from './App';
import './styles/tailwind.out.css';

readConfigFromMeta(headQuerySelector);

const httpLink = createHttpLink({
  uri: `${config.servers.admin.url}/graphql`,
});

const authLink = setContext((_, { headers }) => ({
  headers: {
    ...headers,
    ...(process.env.NODE_ENV === 'development' && {
      'oidc-claim-id-token-email': 'johndope@example.com',
    }),
  },
}));

const client = new ApolloClient({
  link: authLink.concat(httpLink),
  cache: new InMemoryCache(),
});

ReactDOM.render(
  <ApolloProvider {...{ client }}>
    <App />
  </ApolloProvider>,
  document.getElementById('root')
);

function headQuerySelector(name: string) {
  return document.head.querySelector(name);
}
