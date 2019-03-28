[![NPM](https://nodeico.herokuapp.com/@cybavo/react-native-wallet-service.svg)](https://npmjs.com/package/@cybavo/react-native-wallet-service)

```shell
npm install @cybavo/react-native-wallet-service --save
react-native link @cybavo/react-native-wallet-service
```

```shell
yarn add @cybavo/react-native-wallet-service
react-native link @cybavo/react-native-wallet-service
```

# CYBABO Wallet APP SDK for React Native - Sample

Sample app for integrating Cybavo Wallet App SDK, https://www.cybavo.com/wallet-app-sdk/

![image](https://github.com/CYBAVO/react-native_wallet_sdk_sample/raw/master/image/sc_wallet_list.png)
![image](https://github.com/CYBAVO/react-native_wallet_sdk_sample/raw/master/image/sc_wallet_detail.png)

## Institutional-grade security for your customers

Protect your customers’ wallets with the same robust technology we use to protect the most important cryptocurrency exchanges. CYBAVO Wallet App SDK allows you to develop your own cryptocurrency wallet, backed by CYBAVO private key protection technology.

### Mobile SDK

Use CYBAVO Wallet App SDK to easily develop secure wallets for your users without having to code any cryptography on your side. Our SDK allows you to perform the most common operations, such as creating a wallet, querying balances and executing cryptocurrency payments.

### Secure key management system

Key management is the most critical part of cryptocurrency storage. CYBAVO Wallet App SDK makes our robust private key storage system available to all of your users. Our unique encryption scheme and a shared responsibility model offers top notch protection for your customer’s keys.

### CYBAVO Security Cloud

Cryptocurrency transactions performed by wallets developed with CYBAVO Wallet App SDK will be shielded by our Security Cloud, ensuring their integrity.

## Complete solution for cryptocurrency wallets

### Cost saving

Leverage your in-house developing team and develop mobile cryptocurrency apps without compromising on security.

### Fast development

Quickly and easily develop cryptocurrency applications using mobile native languages, without having to worry about cryptographic code.

### Full Node maintenance

Leverage CYBAVO Wallet App SDK infrastructure and avoid maintaining a full node for your application.

Feel free to contact us for product inquiries or mail us: info@cybavo.com

# CYBAVO

A group of cybersecurity experts making crypto-currency wallet secure and usable for your daily business operation.

We provide VAULT, wallet, ledger service for cryptocurrency. Trusted by many exchanges and stable-coin ico teams, please feel free to contact us when your company or business need any help in cryptocurrency operation.

# Setup

1. Edit `android/local.properties` to config Maven repository URL / credentials provided by CYBAVO

   ```
   walletsdk.maven.url=$MAVEN_REPO_URL
   walletsdk.maven.username=$MAVEN_REPO_USRENAME
   walletsdk.maven.password=$MAVEN_REPO_PASSWORD
   ```

2. Place your `google-services.json` file downloaded from Firebase to `android/app` [(LearnMore)](https://github.com/react-native-community/react-native-google-signin/blob/master/docs/android-guide.md)

3. Edit `BuildConfig.json` ➜ `GOOGLE_SIGN_IN_WEB_CLI_ID` to your Google sign-in client ID
4. Edit `BuildConfig.json` ➜ `SERVICE_ENDPOINT` to point to your Wallet Service endpoont
5. Register your app on CYBAVO WALLET MANAGEMENT system web > Administration > System settings, input `package name` and `Signature keystore SHA1 fingerprint`, follow the instruction to retrieve an `API Code`.
6. Edit `BuildConfig.json` ➜ `SERVICE_API_CODE` to fill in yout `API Code`
7. Edit `BuildConfig.json` ➜ `WECHAT_APP_ID` to fill in yout `WeChat app id`

# Features

- Sign in / Sign up with 3rd-party account system - Google Account
- Wallet Creation / Editing
- Wallet Deposit / Withdrawal
- Transaction History query
- PIN Code configuration: Setup / Change / Recovery
- Payment Intent support

  - Action: `com.cybavo.example.wallet.action.PAY`
  - Parameters:
    - `pay_currency (int)`: Currency to pay with
    - `pay_token_address (String)`: Currency token address to pay with
    - `pay_amount (String)`: Amount to pay for
    - `pay_target_address (String)`: Target address to pay to
  - Sample:

  ```java
  void pay() {
      Intent intent = new Intent("com.cybavo.example.wallet.action.PAY");
      intent.putExtra("pay_currency", 60); // ETH
      intent.putExtra("pay_token_address", ""); // Just ETH, no token specified
      intent.putExtra("pay_amount", "3.14"); // We want to pay 3.14 ETH
      intent.putExtra("pay_target_address", "0xf6DabB290FCE73f5617ED381ca90dBb7af0E8295"); // To this address
      intent.addFlags(Intent.FLAG_ACTIVITY_NEW_TASK | Intent.FLAG_ACTIVITY_CLEAR_TOP);
      startActivityForResult(i, 1234);
  }

  @Override
  protected void onActivityResult(int requestCode, int resultCode, @Nullable Intent data) {
      super.onActivityResult(requestCode, resultCode, data);
      if (requestCode == 1234 && resultCode == Activity.RESULT_OK) {
          // Payment successfully...
      }
  }
  ```
