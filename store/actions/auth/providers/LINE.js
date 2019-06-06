/**
 * Copyright (c) 2019 CYBAVO, Inc.
 * https://www.cybavo.com
 *
 * All rights reserved.
 */

import { NativeModules } from 'react-native';

const { LineLoginManager } = NativeModules;

export default {
  async signIn() {
    try {
    console.log('LINE.signIn...');
    
    user = await LineLoginManager.loginWithPermissions(["email", "profile", "openid"])
    console.log('LINE.signIn currentAccessToken', await LineLoginManager.currentAccessToken());
    console.log('LINE.signIn user', user)
    console.log('LINE.signIn name', user.profile.displayName)
    const {
      accessToken: {
        accessToken: idToken,
      },
      profile: { displayName: name, pictureURL: avatar },
    } = user;
    console.log('LINE.signIn obj', { idToken, name, avatar })
    return { idToken, name, avatar };

  } catch (error) {
    console.log('LINE.signIn failed', error);
    throw error;
  }
  },
  async signOut() {
    console.log('LINE.signOut...');
  },
};
