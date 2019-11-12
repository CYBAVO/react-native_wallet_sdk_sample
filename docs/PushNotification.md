# Setup push notification
## Requirements
- React native wallet sdk `@cybavo/react-native-wallet-service@1.2.27`
- iOS wallet sdk `'CYBAVOWallet', '~> 1.2.161'`
- Android wallet sdk `com.cybavo.wallet:wallet-sdk-lib:1.2.1403`
## Installation and configuration
1. Install and configure AWS Amplify push notification, please refer to [this](https://aws-amplify.github.io/docs/js/push-notifications).
2. Setup AWS Mobile Hub. Please refer to [this](../docs/PushNotificationAws.md).
## Working with the API
1. For iOS, you can set if it's apns sandbox while init WalletSdk
    ```javascript 1.8
   WalletSdk.init({
     endpoint: SERVICE_ENDPOINT,
     apiCode: SERVICE_API_CODE,
     apnsSandbox: true,
   });
    ```
2. After receive the push token, call `Auth.setPushDeviceToken`
    ```javascript 1.8
    PushNotification.onRegister((token) => {
     //Save the token and set push token after signin
      AsyncStorage.setItem('pushDeviceToken', token)
          .then(() =>
          console.debug('save pushDeviceToken done')
        );
    });
   
   //This function should be called once signin
   function setPushDeviceToken() {
     return async (dispatch, getState) => {
       const token = await AsyncStorage.getItem('pushDeviceToken');
       const resp = await Auth.setPushDeviceToken(token);
       return resp;
     };
   }
    ```
3. Receive the notification in `PushNotification.onNotification(notification => {})` and utilize `CYBAVOPushNotification.parse(json)` to parse the json string.
    
    iOS 
    ```javascript 1.8
    PushNotification.onNotification(notification => {
        let data = CYBAVOPushNotification.parse(
              JSON.stringify(notification._data.data.jsonBody)
            )
    });
    ```
    Android 
    ```javascript 1.8
    PushNotification.onNotification(notification => {
        let data = CYBAVOPushNotification.parse(
              notification.data['pinpoint.jsonBody']
            );
    });
    ```
