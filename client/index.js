/* eslint-disable global-require */

import React from 'react';
import { Provider } from 'react-redux';
import ReactDOM from 'react-dom';
import WebFontLoader from 'webfontloader';
import BrowserRouter from 'react-router-dom/BrowserRouter';
import { withAsyncComponents } from 'react-async-component';
import { ApolloProvider } from 'react-apollo';

import configureStore from '../shared/state/store';
import client from '../shared/state/apolloClient';
import App from '../shared/scenes/App';

// Get the DOM Element that will host our React application.
const MOUNT_POINT = window.document.getElementById('app');
WebFontLoader.load({
  google: { families: ['Roboto:200,400,700'] },
});
const preloadedState = window.__PRELOADED_STATE__;
const store = configureStore(preloadedState);

function renderApp(TheApp) {
  const app = (
    <ApolloProvider store={ store } client={ client }>
    <BrowserRouter>
      <TheApp />
    </BrowserRouter>
  </ApolloProvider>
  );

  withAsyncComponents(app).then(({ appWithAsyncComponents }) =>
    ReactDOM.render(appWithAsyncComponents, MOUNT_POINT),
  );
}

renderApp(App);
require('./registerServiceWorker');

if (process.env.BUILD_FLAG_IS_DEV && module.hot) {
  module.hot.accept('./index.js');
  module.hot.accept(
    '../shared/scenes/App',
    () => renderApp(require('../shared/scenes/App').default),
  );
}
