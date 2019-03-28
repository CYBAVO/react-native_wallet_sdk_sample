import { combineReducers } from 'redux';
import auth from './auth';
import user from './user';
import wallets from './wallets';
import currency from './currency';
import balance from './balance';
const walletApp = combineReducers({
  auth,
  user,
  wallets,
  currency,
  balance,
});

export default walletApp;
