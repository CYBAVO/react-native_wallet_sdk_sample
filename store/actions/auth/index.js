/**
 * Copyright (c) 2019 CYBAVO, Inc.
 * https://www.cybavo.com
 *
 * All rights reserved.
 */
import { WalletSdk, Auth } from '@cybavo/react-native-wallet-service';
import NavigationService from '../../../NavigationService';
import { COMMON_RESET } from '../common';
import Google from './providers/google';
import WeChat from './providers/wechat';
import Facebook from './providers/facebook';
import LINE from './providers/LINE';
import Apple from './providers/apple';
import { Crashlytics } from 'react-native-fabric';
import { AsyncStorage } from 'react-native';

const { ErrorCodes } = WalletSdk;

// AUTH
export const AUTH_LOADING = 'AUTH_LOADING';
export const AUTH_ERROR = 'AUTH_ERROR';
export const AUTH_UPDATE_SIGN_IN_STATE = 'AUTH_UPDATE_SIGN_IN_STATE';
export const AUTH_UPDATE_IDENTITY = 'AUTH_UPDATE_IDENTITY';

async function signInWithToken(idToken, identityProvider) {
  console.log('signInWithToken... ', identityProvider);
  const resp = await Auth.signIn(idToken, identityProvider);
  console.log('signInWithToken... Done', resp);
  return resp;
}

async function signUpWithToken(idToken, identityProvider, extraAttributes) {
  console.log('signUpWithToken... ', identityProvider);
  const resp = await Auth.signUp(idToken, identityProvider, extraAttributes);
  console.log('signInWithToken... Done', resp);
  return resp;
}
export function setPushDeviceToken() {
  return async (dispatch, getState) => {
    const token = await AsyncStorage.getItem('pushDeviceToken');
    console.log('setPushDeviceToken from asyncStorage... ', token);
    const resp = await Auth.setPushDeviceToken(token);
    console.log('setPushDeviceToken from asyncStorage... Done', resp);
    return resp;
  };
}

function updateSignInState(signInState) {
  console.log('updateSignInState:', signInState);
  return async (dispatch, getState) => {
    // if (getState().auth.signInState == signInState && signInState != 0) {
    //   console.log('updateSignInState:', signInState);
    //   return;
    // }
    await dispatch({ type: AUTH_UPDATE_SIGN_IN_STATE, signInState });
    if (signInState === Auth.SignInState.UNKNOWN) {
      NavigationService.navigate('Init');
    } else if (signInState === Auth.SignInState.SIGNED_IN) {
      // dispatch(setPushDeviceToken());
      NavigationService.navigate('Main');
    } else if (signInState === Auth.SignInState.SESSION_EXPIRED) {
      NavigationService.navigate('SessionExpired');
    } else if (signInState === Auth.SignInState.SIGNED_OUT) {
      NavigationService.navigate('Auth');
      dispatch({ type: COMMON_RESET });
    } else {
      // SESSION_INVALID
      // ++id provider sign out++
      const identityProvider = getState.auth.identity.provider;
      dispatch({ type: AUTH_LOADING, loading: true })
      const idProvider = IDENTITY_PROVIDERS[identityProvider];
      console.log('idProvider.signOut...', idProvider);
      if (idProvider) {
        await idProvider.signOut();
      }
      console.log('idProvider.signOut... Done');
      dispatch({ type: AUTH_LOADING, loading: false });
      // ++reset status++
      NavigationService.navigate('Auth');
      dispatch({ type: COMMON_RESET });
    }
  };
}
const IDENTITY_PROVIDERS = {
  Google: Google,
  WeChat: WeChat,
  Facebook: Facebook,
  LINE: LINE,
  Apple: Apple,
};

export function signIn(identityProvider) {
  return async dispatch => {
    const idProvider = IDENTITY_PROVIDERS[identityProvider];
    console.log('signIn...', idProvider);
    dispatch({ type: AUTH_LOADING, loading: true });
    let userToken;
    const identity = {
      provider: identityProvider,
      name: '',
      email: '',
      avatar: '',
    };
    try {
      console.log('auth.signIn...');
      const { idToken, name, email, avatar } = await idProvider.signIn();
      identity.name = name;
      identity.email = email;
      identity.avatar = avatar;
      console.log('auth.signIn...', idToken);
      if (email) {
        Crashlytics.setUserEmail(email);
      }
      userToken = idToken;
      console.log('signInWithToken...');
      await signInWithToken(userToken, identityProvider);
      dispatch({
        type: AUTH_UPDATE_IDENTITY,
        ...identity,
      });
      console.log('signInWithToken... Done');
    } catch (error) {
      console.log('signIn failed', error);
      if (ErrorCodes.ErrRegistrationRequired === error.code) {
        // signUp needed
        try {
          console.log('signUpWithToken...');
          await signUpWithToken(userToken, identityProvider, {
            user_name: identity.name, //Required for Apple Auth. Optional for other services
          });
          console.log('signUpWithToken... Done');
          console.log('signInWithToken#2...');
          await signInWithToken(userToken, identityProvider);
          dispatch({
            type: AUTH_UPDATE_IDENTITY,
            ...identity,
          });
          console.log('signInWithToken#2... Done');
        } catch (error) {
          console.log('signUp - signIn failed', error);
          await idProvider.signOut();
          dispatch({ type: AUTH_ERROR, error });
        }
      } else {
        console.log('signIn failed', error);
        console.log('auth.signOut...');
        await idProvider.signOut();
        console.log('auth.signOut... Done');
        dispatch({ type: AUTH_ERROR, error });
      }
    }
    dispatch({ type: AUTH_LOADING, loading: false });
    console.log('signIn... Done');
  };
}

export function signOut() {
  return async (dispatch, getState) => {
    const identityProvider = getState().auth.identity.provider;
    dispatch({ type: AUTH_LOADING, loading: true });
    console.log('Auth.signOut...');
    await Auth.signOut();
    console.log('Auth.signOut... Done');
    const idProvider = IDENTITY_PROVIDERS[identityProvider];
    console.log('idProvider.signOut...', idProvider);
    if (idProvider) {
      await idProvider.signOut();
    }
    console.log('idProvider.signOut... Done');
    dispatch({ type: AUTH_LOADING, loading: false });
  };
}

export function initAuth() {
  return async dispatch => {
    dispatch({ type: AUTH_LOADING, loading: true });
    const signInState = await Auth.getSignInState();
    dispatch(updateSignInState(signInState));
    dispatch({ type: AUTH_LOADING, loading: false });

    // register evenrt listener
    Auth.addListener(Auth.Events.onSignInStateChanged, signInState => {
      console.log('updateSignInState:', signInState);
      dispatch(updateSignInState(signInState));
      if (signInState === Auth.SignInState.SIGNED_IN) {
        dispatch(setPushDeviceToken());
      }
    });
  };
}
