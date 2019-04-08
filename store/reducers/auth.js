/**
 * Copyright (c) 2019 CYBAVO, Inc.
 * https://www.cybavo.com
 *
 * All rights reserved.
 */
import { Auth } from '@cybavo/react-native-wallet-service';
import {
  AUTH_LOADING,
  AUTH_ERROR,
  AUTH_UPDATE_SIGN_IN_STATE,
  AUTH_UPDATE_IDENTITY,
} from '../actions/auth';
import { COMMON_RESET } from '../actions/common';
const { SignInState } = Auth;

const defaultState = {
  loading: false,
  error: null,
  signInState: SignInState.UNKNOWN,
  identity: {
    provider: null,
    name: '',
    email: '',
    avatar: '',
  },
};

function auth(state = defaultState, action) {
  switch (action.type) {
    case COMMON_RESET: {
      return defaultState;
    }
    case AUTH_LOADING:
      return {
        ...state,
        loading: action.loading,
        error: null,
      };
    case AUTH_ERROR:
      return {
        ...state,
        error: action.error,
      };
    case AUTH_UPDATE_SIGN_IN_STATE:
      const { signInState = SignInState.UNKNOW } = action;
      return {
        ...state,
        signInState: signInState,
        error: null,
      };
    case AUTH_UPDATE_IDENTITY:
      const { provider, name, email, avatar } = action;
      return {
        ...state,
        identity: {
          ...state.identity,
          provider,
          name,
          email,
          avatar,
        },
      };
    default:
      return state;
  }
}

export default auth;
