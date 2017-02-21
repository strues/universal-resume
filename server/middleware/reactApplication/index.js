
import React from 'react';
import Helmet from 'react-helmet';
import { renderToString, renderToStaticMarkup } from 'react-dom/server';
import { StaticRouter } from 'react-router-dom';
import { withAsyncComponents } from 'react-async-component';
import { ApolloProvider } from 'react-apollo';
import { getDataFromTree } from 'react-apollo/lib/server';
import { createNetworkInterface } from 'apollo-client';
import styleSheet from 'styled-components/lib/models/StyleSheet';

import config from '../../../config';
import configureStore from '../../../shared/state/store';
import App from '../../../shared/scenes/App';
import ServerHTML from './ServerHTML';
import createApolloClient from './createApolloClient';

const store = configureStore({});
const graphqlUrl = 'http://localhost:1337/graphql';


export default function reactApplicationMiddleware(req, res) {
  if (typeof res.locals.nonce !== 'string') {
    throw new Error('A "nonce" value has not been attached to the res');
  }
  const nonce = res.locals.nonce;

  if (config('disableSSR')) {
    if (process.env.BUILD_FLAG_IS_DEV) {
      // eslint-disable-next-line no-console
      console.log('==> Handling react route without SSR');
    }

    const html = renderToStaticMarkup(<ServerHTML nonce={ nonce } />);
    res.status(200).send(html);
    return;
  }

  const reactRouterContext = {};

  const client = createApolloClient({
    ssrMode: true,
    networkInterface: createNetworkInterface({
      uri: graphqlUrl,
      credentials: 'same-origin',
      headers: req.headers,
    }),
  });

  const app = (
    <ApolloProvider client={ client } store={ store }>
    <StaticRouter location={ req.url } context={ reactRouterContext }>
      <App />
    </StaticRouter>
  </ApolloProvider>
  );
  const styles = styleSheet.rules().map(rule => rule.cssText).join('\n');

  withAsyncComponents(app)
  .then(({ appWithAsyncComponents, state, STATE_IDENTIFIER }) => {
    getDataFromTree(appWithAsyncComponents).then(() => {
      const html = renderToStaticMarkup(
      <ServerHTML
        reactAppString={ renderToString(appWithAsyncComponents) }
        nonce={ nonce }
        styles={ styles }
        helmet={ Helmet.rewind() }
        asyncComponents={ { state, STATE_IDENTIFIER } }
        state={ store.getState() }
      />,
    );

      if (reactRouterContext.url) {
        res.status(302).setHeader('Location', reactRouterContext.url);
        res.end();
        return;
      }

      res
      .status(
        reactRouterContext.missed
          ? 404
          : 200,
      )
      .send(`<!DOCTYPE html>${html}`);
    });
  });
}
