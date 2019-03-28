import { WalletSdk } from '@cybavo/react-native-wallet-service';
import { AppRegistry } from 'react-native';
import AppWrapper from './AppWrapper';
import { GoogleSignin } from 'react-native-google-signin';
import { name as appName } from './app.json';
import * as WeChat from 'react-native-wechat';
import {
  SERVICE_ENDPOINT,
  SERVICE_API_CODE,
  GOOGLE_SIGN_IN_WEB_CLI_ID,
  WECHAT_APP_ID,
} from './BuildConfig.json';

// init wallet SDK
WalletSdk.init({
  endpoint: SERVICE_ENDPOINT,
  apiCode: SERVICE_API_CODE,
});

// init Google Sign-in
GoogleSignin.configure({
  offlineAccess: false,
  webClientId: GOOGLE_SIGN_IN_WEB_CLI_ID,
});

// init WeChat Sign-in
WeChat.registerApp(WECHAT_APP_ID);

AppRegistry.registerComponent(appName, () => AppWrapper);
