import { createStore, applyMiddleware, compose } from 'redux'

import { logger } from '../middleware'
import rootReducer from '../reducers'
import rootSagas from '../sagas'

import createSagaMiddleware from 'redux-saga';
import createLogger from 'redux-logger'

import DevTools from '../containers/DevTools'


export default function configure(initialState) {
  const create = window.devToolsExtension
    ? window.devToolsExtension()(createStore)
    : createStore

  var sagaMiddleware = createSagaMiddleware();
  const createStoreWithMiddleware = applyMiddleware(
    logger
  )(create)

  //const store = createStoreWithMiddleware(rootReducer, initialState)
  const store = createStore(
    rootReducer,
    compose(
      applyMiddleware(
        sagaMiddleware,
        // createLogger()
      ),
      DevTools.instrument()
    ))

  sagaMiddleware.run(rootSagas)

  store.runSaga = sagaMiddleware.run;
  if (module.hot) {
    module.hot.accept('../reducers', () => {
      const nextReducer = require('../reducers/index')
      store.replaceReducer(nextReducer)
    })
  }

  return store
}
