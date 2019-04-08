/**
 * Copyright (c) 2019 CYBAVO, Inc.
 * https://www.cybavo.com
 *
 * All rights reserved.
 */
import {
  USER_STATE_LOADING,
  USER_STATE_ERROR,
  USER_UPDATE_USER_STATE,
} from '../actions/user';
import { COMMON_RESET } from '../actions/common';

const defaultState = {
  userState: {
    loading: false,
    error: null,
  },
};

function user(state = defaultState, action) {
  switch (action.type) {
    case COMMON_RESET:
      return defaultState;
    case USER_STATE_LOADING:
      return {
        ...state,
        userState: {
          ...state.userState,
          loading: action.loading,
          error: null,
        },
      };
    case USER_STATE_ERROR:
      return {
        ...state,
        userState: {
          ...state.userState,
          loading: false,
          error: action.error,
        },
      };
    case USER_UPDATE_USER_STATE:
      return {
        ...state,
        userState: {
          ...action.userState,
          loading: false,
          error: null,
        },
      };
    default:
      return state;
  }
}

export default user;
