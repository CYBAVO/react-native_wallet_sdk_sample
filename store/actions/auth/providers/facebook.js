/**
 * Copyright (c) 2019 CYBAVO, Inc.
 * https://www.cybavo.com
 *
 * All rights reserved.
 */
import { LoginManager, AccessToken } from 'react-native-fbsdk';
import { GraphRequest, GraphRequestManager } from 'react-native-fbsdk';

export default {
  async signIn() {
    try {
      console.log('Facebook.signIn...');
      // eslint-disable-next-line no-undef
      result = await LoginManager.logInWithReadPermissions([
        'public_profile',
        'email',
      ]);
      // eslint-disable-next-line no-undef
      if (result.isCancelled) {
        throw new Error('Cancelled');
      }
      // eslint-disable-next-line no-undef
      data = await AccessToken.getCurrentAccessToken();
      let idToken;
      // eslint-disable-next-line no-undef
      idToken = data.accessToken.toString();

      var me = await getMe(idToken);
      var email = me.email;
      var name = me.name;
      console.log('Facebook.signIn...me', me);

      // return { idToken,  me.name, me.email, ''};
      return { idToken, name, email };
    } catch (error) {
      console.log('Facebook.signIn failed', error);
      throw error;
    }
  },
  async signOut() {
    console.log('Facebook.signOut...');
  },
};
var getMe = token => {
  const profileRequestParams = {
    fields: {
      string: 'id, name, email',
    },
  };

  const profileRequestConfig = {
    httpMethod: 'GET',
    version: 'v2.5',
    parameters: profileRequestParams,
    accessToken: token,
  };

  return new Promise(function(resolve, reject) {
    const infoRequest = new GraphRequest(
      '/me',
      profileRequestConfig,
      (error, result) => {
        if (error) {
          console.log('Error fetching data: ' + error.toString());
          reject(error);
        } else {
          console.log('Success fetching data: ' + result.toString());
          resolve(result);
        }
      }
    );
    // Start the graph request.
    new GraphRequestManager().addRequest(infoRequest).start();
  });
};
