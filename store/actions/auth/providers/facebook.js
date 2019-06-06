/**
 * Copyright (c) 2019 CYBAVO, Inc.
 * https://www.cybavo.com
 *
 * All rights reserved.
 */
import { LoginManager, AccessToken } from "react-native-fbsdk";
import { GraphRequest, GraphRequestManager } from 'react-native-fbsdk';

export default {
    async signIn() {
        try {
            console.log('Facebook.signIn...');
            result = await LoginManager.logInWithReadPermissions(["public_profile"])
            if (result.isCancelled) {
                throw new Error('Cancelled');
            }
            data = await AccessToken.getCurrentAccessToken()
            idToken = data.accessToken.toString()

            me = await getMe()

            console.log('Facebook.signIn...me', me);

            return {
                idToken: idToken,
                name: me.name,
                email: me.email,
                avatar: '',
            };
        } catch (error) {
            console.log('Facebook.signIn failed', error);
            throw error;
        }
    },
    async signOut() {
        console.log('Facebook.signOut...');
    },
};

var getMe = () => {
    return new Promise(function (resolve, reject) {
        const infoRequest = new GraphRequest(
            '/me',
            null,
            (error, result) =>  {
                if (error) {
                  console.log('Error fetching data: ' + error.toString());
                  reject(error)
                } else {
                  console.log('Success fetching data: ' + result.toString());
                  resolve(result)
                }
              },
          );
          // Start the graph request.
          new GraphRequestManager().addRequest(infoRequest).start();
    });
};