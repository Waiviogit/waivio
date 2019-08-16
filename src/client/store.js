import { createPromise } from 'redux-promise-middleware';
import thunk from 'redux-thunk';
import { applyMiddleware, createStore, compose } from 'redux';
import { routerMiddleware } from 'connected-react-router';
import steemAPI from './steemAPI';
import createBusyAPI from '../common/services/createBusyAPI';
import { createHistory } from './history';
import errorMiddleware from './helpers/errorMiddleware';
import createReducer from './reducers';

export default (steemConnectAPI, waivioAPI, currUrl) => {
  const history = createHistory(currUrl);
  let preloadedState;
  if (typeof window !== 'undefined') {
    /* eslint-disable no-underscore-dangle */
    preloadedState = window.__PRELOADED_STATE__;
    delete window.__PRELOADED_STATE__;
    /* eslint-enable no-underscore-dangle */
  }

  const middleware = [
    errorMiddleware,
    createPromise({
      promiseTypeSuffixes: ['START', 'SUCCESS', 'ERROR'],
    }),
    thunk.withExtraArgument({
      steemAPI,
      waivioAPI,
      steemConnectAPI,
      busyAPI: createBusyAPI(),
    }),
    routerMiddleware(history),
  ];

  let enhancer;
  if (typeof window !== 'undefined') {
    // eslint-disable-next-line no-underscore-dangle
    const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
    enhancer = composeEnhancers(applyMiddleware(...middleware));
  } else {
    enhancer = compose(applyMiddleware(...middleware));
  }

  const store = createStore(createReducer(history), preloadedState, enhancer);

  // Hot reloading
  if (module.hot) {
    module.hot.accept('./reducers', () => {
      store.replaceReducer(createReducer(history));
    });
  }

  return store;
};
