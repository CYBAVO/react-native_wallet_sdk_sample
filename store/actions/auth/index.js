import { WalletSdk, Auth } from '@cybavo/react-native-wallet-service';
import { DeviceEventEmitter } from 'react-native';
import NavigationService from '../../../NavigationService';
import { COMMON_RESET } from '../common';
import Google from './providers/google';
import WeChat from './providers/wechat';

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

async function signUpWithToken(idToken, identityProvider) {
  console.log('signUpWithToken... ', identityProvider);
  const resp = await Auth.signUp(idToken, identityProvider);
  console.log('signInWithToken... Done', resp);
  return resp;
}

function updateSignInState(signInState) {
  console.log('updateSignInState:', signInState);
  return async dispatch => {
    await dispatch({ type: AUTH_UPDATE_SIGN_IN_STATE, signInState });
    if (signInState === Auth.SignInState.UNKNOWN) {
      NavigationService.navigate('Init');
    } else if (signInState === Auth.SignInState.SIGNED_IN) {
      NavigationService.navigate('Main');
    } else if (signInState === Auth.SignInState.SESSION_EXPIRED) {
      NavigationService.navigate('SessionExpired');
    } else if (signInState === Auth.SignInState.SIGNED_OUT) {
      NavigationService.navigate('Auth');
      dispatch({ type: COMMON_RESET });
    } else {
      // SESSION_INVALID
      dispatch(signOut());
    }
  };
}
const IDENTITY_PROVIDERS = {
  Google: Google,
  WeChat: WeChat,
};

export function signIn(identityProvider) {
  return async dispatch => {
    const idProvider = IDENTITY_PROVIDERS[identityProvider];
    console.log('signIn...', idProvider);
    dispatch({ type: AUTH_LOADING, loading: true });
    let userToken;
    try {
      console.log('auth.signIn...');
      const { idToken, name, email, avatar } = await idProvider.signIn();
      console.log('auth.signIn...', idToken);
      userToken = idToken;
      console.log('signInWithToken...');
      await signInWithToken(userToken, identityProvider);
      dispatch({
        type: AUTH_UPDATE_IDENTITY,
        provider: identityProvider,
        name,
        email,
        avatar,
      });
      console.log('signInWithToken... Done');
    } catch (error) {
      console.log('signIn failed', error);
      if (ErrorCodes.ErrRegistrationRequired === error.code) {
        // signUp needed
        try {
          console.log('signUpWithToken...');
          await signUpWithToken(userToken, identityProvider);
          console.log('signUpWithToken... Done');
          console.log('signInWithToken#2...');
          await signInWithToken(userToken, identityProvider);
          dispatch({ type: AUTH_UPDATE_IDENTITY, identityProvider });
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
      console.log('auth.signOut#2...');
      await idProvider.signOut();
      console.log('auth.signOut#2... Done');
      dispatch({ type: AUTH_ERROR, error });
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
    DeviceEventEmitter.addListener(
      Auth.Events.onSignInStateChanged,
      signInState => {
        console.log('updateSignInState:', signInState);
        dispatch(updateSignInState(signInState));
      }
    );
  };
}
