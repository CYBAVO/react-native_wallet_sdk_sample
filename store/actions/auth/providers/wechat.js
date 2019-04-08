/**
 * Copyright (c) 2019 CYBAVO, Inc.
 * https://www.cybavo.com
 *
 * All rights reserved.
 */
import * as WeChat from 'react-native-wechat';

export default {
  async signIn() {
    console.log('WeChat.isWXAppInstalled...');
    const installed = await WeChat.isWXAppInstalled();
    console.log('WeChat.isWXAppInstalled... Done', installed);
    if (!installed) {
      throw new Error('WeChat not installed');
    }
    console.log('WeChat.sendAuthRequest...');
    const resp = await WeChat.sendAuthRequest(
      'snsapi_userinfo',
      'wechat_sdk_demo'
    );
    console.log('WeChat.sendAuthRequest... Done', resp);
    const { code: idToken } = resp;
    return {
      idToken,
      name: 'WeChat user',
      email: 'user@wechat.com',
      avatar: '',
    };
  },
  async signOut() {
    console.log('WeChat.signOut...');
    // no signout
  },
};
