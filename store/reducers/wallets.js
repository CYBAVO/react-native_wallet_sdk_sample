/**
 * Copyright (c) 2019 CYBAVO, Inc.
 * https://www.cybavo.com
 *
 * All rights reserved.
 */
import {
  WALLETS_LOADING,
  WALLETS_ERROR,
  WALLETS_UPDATE_WALLET_LIST,
  WALLETS_UPDATE_WALLET,
} from '../actions/wallets';
import { COMMON_RESET } from '../actions/common';

const defaultState = {
  loading: false,
  error: null,
  wallets: null,
};

function wallets(state = defaultState, action) {
  switch (action.type) {
    case COMMON_RESET:
      return defaultState;
    case WALLETS_LOADING:
      return {
        ...state,
        loading: action.loading,
        error: null,
      };
    case WALLETS_ERROR:
      return {
        ...state,
        loading: false,
        error: action.error,
      };
    case WALLETS_UPDATE_WALLET_LIST:
      return {
        ...state,
        wallets: action.wallets,
        error: null,
      };
    case WALLETS_UPDATE_WALLET:
      if (!state.wallets) {
        return {
          ...state,
          wallets: [action.wallet],
          error: null,
        };
      }
      return {
        ...state,
        wallets: state.wallets.map(w => {
          if (w.walletId === action.walletId) {
            return {
              ...w,
              ...action.wallet,
            };
          }
          return w;
        }),
        error: null,
      };
    default:
      return state;
  }
}

export default wallets;
