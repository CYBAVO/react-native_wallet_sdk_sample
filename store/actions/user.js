/**
 * Copyright (c) 2019 CYBAVO, Inc.
 * https://www.cybavo.com
 *
 * All rights reserved.
 */
import { Auth } from '@cybavo/react-native-wallet-service';
// import NavigationService from '../../NavigationService';

export const USER_STATE_LOADING = 'USER_STATE_LOADING';
export const USER_STATE_ERROR = 'USER_STATE_ERROR';
export const USER_UPDATE_USER_STATE = 'USER_UPDATE_USER_STATE';

export function fetchUserState() {
  return async dispatch => {
    dispatch({ type: USER_STATE_LOADING, loading: true });
    try {
      const { userState } = await Auth.getUserState();
      dispatch({ type: USER_UPDATE_USER_STATE, userState });
    } catch (error) {
      dispatch({ type: USER_STATE_ERROR, error });
    }
    dispatch({ type: USER_STATE_LOADING, loading: false });
  };
}
