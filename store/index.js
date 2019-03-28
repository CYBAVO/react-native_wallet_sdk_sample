import { applyMiddleware, createStore } from 'redux';
import { persistStore, persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import ReduxThunk from 'redux-thunk';
import logger from 'redux-logger';
import reducers from './reducers';

const persistConfig = {
  key: 'auth.identity',
  storage,
};

const persistedReducer = persistReducer(persistConfig, reducers);

export const store = createStore(
  persistedReducer,
  applyMiddleware(ReduxThunk, logger)
);
export const persistor = persistStore(store);

export default { store, persistor };
