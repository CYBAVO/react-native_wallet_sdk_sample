/**
 * Copyright (c) 2019 CYBAVO, Inc.
 * https://www.cybavo.com
 *
 * All rights reserved.
 */
import {
  PushNotification as CYBAVOPushNotification,
  Wallets,
  WalletSdk,
} from '@cybavo/react-native-wallet-service';

import {
  AppRegistry,
  Platform,
  PushNotificationIOS,
  AsyncStorage,
  NativeModules,
} from 'react-native';
import AppWrapper from './AppWrapper';
import { GoogleSignin } from 'react-native-google-signin';
import { name as appName } from './app.json';
import * as WeChat from 'react-native-wechat';
import {
  SERVICE_ENDPOINT,
  SERVICE_API_CODE,
  GOOGLE_SIGN_IN_WEB_CLI_ID,
  WECHAT_SIGN_IN_APP_ID,
} from './BuildConfig.json';

import Amplify from 'aws-amplify';
import aws_exports from './aws-exports';
import PushNotification from '@aws-amplify/pushnotification';
import RNPushNotification from 'react-native-push-notification';
const { MyModule } = NativeModules;
Amplify.configure(aws_exports);
PushNotification.configure(aws_exports);
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
WeChat.registerApp(WECHAT_SIGN_IN_APP_ID);
//
const localNotificatiopnIos = notification => {
  // required on iOS only (see fetchCompletionHandler docs: https://facebook.github.io/react-native/docs/pushnotificationios.html)
  notification.finish(PushNotificationIOS.FetchResult.NoData);
  if (
    notification._data &&
    notification._data.data &&
    notification._data.data.jsonBody
  ) {
    let data = CYBAVOPushNotification.parse(
      JSON.stringify(notification._data.data.jsonBody)
    );
    if (data.direction == Wallets.Transaction.Direction.IN) {
      RNPushNotification.localNotification({
        id: '120',
        title: 'Transaction Received',
        message: 'Amount ' + data.amount + ' from ' + data.fromAddress,
        vibrate: true,
      });
    } else {
      RNPushNotification.localNotification({
        id: '121',
        title: 'Transaction Sent',
        message: 'Amount ' + data.amount + ' to ' + data.toAddress,
        vibrate: true,
      });
    }
    console.debug('onNotification'+Wallets.Transaction.Direction.IN + ","+ data.walletID + ',' + data.type + "," + data.fee + "," + data.currency + "," + data.timestamp+","+data.tokenAddress);
  }
};
const localNotificatiopnAndroid = notification => {
  if (notification.data && notification.data['pinpoint.jsonBody']) {
    let data = CYBAVOPushNotification.parse(
      notification.data['pinpoint.jsonBody']
    );
    if (data.direction == Wallets.Transaction.Direction.IN) {
      MyModule.localNotification({
        id: '120',
        title: 'Transaction Received',
        message: 'Amount ' + data.amount + ' from ' + data.fromAddress,
        vibrate: true,
      });
    } else {
      MyModule.localNotification({
        id: '121',
        title: 'Transaction Sent',
        message: 'Amount ' + data.amount + ' to ' + data.toAddress,
        vibrate: true,
      });
    }
    console.debug('onNotification' + Wallets.Transaction.Direction.IN + "," + data.walletID + ',' + data.type + "," + data.fee + "," + data.currency + "," + data.timestamp + "," + data.tokenAddress);
  }
};

// init push
PushNotification.onNotification(notification => {
  if (Platform.OS === 'ios') {
    localNotificatiopnIos(notification);
  } else {
    localNotificatiopnAndroid(notification);
  }
});
PushNotification.onRegister(token => {
  console.debug('eee_token:' + token);
  // eslint-disable-next-line no-undef
  AsyncStorage.setItem('pushDeviceToken', token)
    .then(() =>
    console.debug('save pushDeviceToken done')
  );
});
AppRegistry.registerComponent(appName, () => AppWrapper);
