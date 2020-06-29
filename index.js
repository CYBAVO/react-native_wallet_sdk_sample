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

import { AppRegistry, Platform, AsyncStorage } from 'react-native';
import PushNotificationIOS from '@react-native-community/push-notification-ios';
import AppWrapper from './AppWrapper';
import { GoogleSignin } from 'react-native-google-signin';
import { name as appName } from './app.json';
import * as WeChat from 'react-native-wechat-lib';
import {
  SERVICE_ENDPOINT,
  SERVICE_API_CODE,
  SERVICE_API_CODE_IOS,
  GOOGLE_SIGN_IN_WEB_CLI_ID,
  GOOGLE_SENDER_ID,
  WECHAT_SIGN_IN_APP_ID,
  WECHAT_UNIVERSAL_LINK,
} from './BuildConfig.json';

import RNPushNotification from 'react-native-push-notification';
// init wallet SDK
WalletSdk.init({
  endpoint: SERVICE_ENDPOINT,
  apiCode: Platform.OS === 'android' ? SERVICE_API_CODE : SERVICE_API_CODE_IOS,
  apnsSandbox: true,
});

// init Google Sign-in
GoogleSignin.configure({
  offlineAccess: false,
  webClientId: GOOGLE_SIGN_IN_WEB_CLI_ID,
});

// init WeChat Sign-in
WeChat.registerApp(WECHAT_SIGN_IN_APP_ID, WECHAT_UNIVERSAL_LINK).then();

const localNotificatiopnIos = notification => {
  // required on iOS only (see fetchCompletionHandler docs: https://facebook.github.io/react-native/docs/pushnotificationios.html)
  notification.finish(PushNotificationIOS.FetchResult.NoData);
  if (
    notification.data &&
    notification.data.data &&
    notification.data.data.jsonBody
  ) {
    let data = CYBAVOPushNotification.parse(
      JSON.stringify(notification.data.data.jsonBody)
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
    console.debug(
      'onNotification' +
        Wallets.Transaction.Direction.IN +
        ',' +
        data.walletID +
        ',' +
        data.type +
        ',' +
        data.fee +
        ',' +
        data.currency +
        ',' +
        data.timestamp +
        ',' +
        data.tokenAddress
    );
  }
};
const localNotificatiopnAndroid = notification => {
  let jsonbody =
    notification['pinpoint.jsonBody'] ||
    (notification.data && notification.data['pinpoint.jsonBody']);
  if (jsonbody) {
    let data = CYBAVOPushNotification.parse(jsonbody);
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
    console.debug(
      'onNotification' +
        Wallets.Transaction.Direction.IN +
        ',' +
        data.walletID +
        ',' +
        data.type +
        ',' +
        data.fee +
        ',' +
        data.currency +
        ',' +
        data.timestamp +
        ',' +
        data.tokenAddress
    );
  }
};

//init push
RNPushNotification.configure({
  popInitialNotification: true,
  requestPermissions: true,
  onRegister: async token => {
    console.log('onRegister:', token.token);
    AsyncStorage.setItem('pushDeviceToken', token.token).then(() =>
      console.debug('save pushDeviceToken done')
    );
  },
  senderID: GOOGLE_SENDER_ID,
  onNotification: notification => {
    console.log('onNotification', notification);
    if (Platform.OS === 'ios') {
      localNotificatiopnIos(notification);
    } else {
      localNotificatiopnAndroid(notification);
    }
  },
});
export function getPushToken() {
  if (Platform.OS === 'ios') {
    return AsyncStorage.getItem('pushDeviceToken');
  } else {
    // use firebsae instance id since for some reason react-native-push-notification onRegister not invoked
    // TODO: may need to return APNS token for iOS
    return AsyncStorage.getItem('pushDeviceToken');
  }
}
AppRegistry.registerComponent(appName, () => AppWrapper);
