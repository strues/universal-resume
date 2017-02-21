import { createStore, compose, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
import client from './apolloClient';
import reducers from './reducers';

export default function configureStore(history, preloadedState) {
  // Redux middleware
  const middleware = [thunk, client.middleware()];

  // Development enhancers
  const enhancers = [];

  if (typeof window === 'object') {
    const devToolsExtension = window.devToolsExtension;
    if (typeof devToolsExtension === 'function') {
      enhancers.push(devToolsExtension());
    }
  }

  // Creating the store
  const store = createStore(reducers, preloadedState, compose(
    applyMiddleware(...middleware),
    ...enhancers,
  ));

  // Hot reload
  if (module.hot) {
    module.hot.accept('./reducers', () => store.replaceReducer(require('./reducers').default));
  }

  return store;
}
