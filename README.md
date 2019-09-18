# CYBAVO Wallet SDK for React Native

[![NPM](https://nodeico.herokuapp.com/@cybavo/react-native-wallet-service.svg)](https://npmjs.com/package/@cybavo/react-native-wallet-service)

## Installation

```shell
npm install @cybavo/react-native-wallet-service --save
react-native link @cybavo/react-native-wallet-service
```

```shell
yarn add @cybavo/react-native-wallet-service
react-native link @cybavo/react-native-wallet-service
```

# CYBABO Wallet SDK for React Native - Sample

Sample app for integrating CYBAVO Wallet App SDK, https://www.cybavo.com/wallet-app-sdk/

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
## Android
1. Clone the source code from GitHub
2. Install the dependencies
   ```
   yarn install
   ```
3. Edit or create `android/local.properties` to config Maven repository URL / credentials provided by CYBAVO
   ```
   walletsdk.maven.url=$MAVEN_REPO_URL
   walletsdk.maven.username=$MAVEN_REPO_USRENAME
   walletsdk.maven.password=$MAVEN_REPO_PASSWORD
   ```
4. Place your `google-services.json` file downloaded from Firebase to `android/app` [(LearnMore)](https://github.com/react-native-community/react-native-google-signin/blob/master/docs/get-config-file.md)
5. Edit `BuildConfig.json` ➜ `MY_GOOGLE_SIGN_IN_WEB_CLI_ID` to your Google sign-in client ID
6. Edit `BuildConfig.json` ➜ `SERVICE_ENDPOINT` to point to your Wallet Service endpoont
7. Register your app on CYBAVO WALLET MANAGEMENT system web > Administration > System settings, input `package name` and `Signature keystore SHA1 fingerprint`, follow the instruction to retrieve an `API Code`.
8. Edit `BuildConfig.json` ➜ `SERVICE_API_CODE` to fill in your `API Code`
9. Edit `BuildConfig.json` ➜ `MY_WECHAT_SIGN_IN_APP_ID` to fill in your `WeChat app id`
10. Edit `android/app/src/main/res/values/strings.xml` ➜ `MY_FACEBOOK_APP_ID` to fill in your `Facebook app id`
10. Edit `android/app/src/main/res/values/strings.xml` ➜ `MY_LINE_CHANNEL_ID` to fill in your `LINE channel scheme`
11.
## iOS
1. Clone the source code from GitHub
2. Install the dependencies
   ```
   yarn install
   ```
3. Place ssh key requested from CYBAVO to ~/.ssh/ (rename it if nessersary)
4. Edit `ios/Podfile`, Replace source 'https://bitbucket.org/cybavo/Specs.git' with
https://bitbucket.org/cybavo/Specs.git if using Xcode < 10.2
https://bitbucket.org/cybavo/Specs_501.git if using Xcode >= 10.2
5. Run `pod install` in `ios/`
6. Place your `GoogleService-Info.plist` file downloaded from Firebase to `ios/` [(LearnMore)](https://github.com/react-native-community/react-native-google-signin/blob/master/docs/get-config-file.md)
7. Open your project configuration: double-click the project name in the left tree view. Select your app from the TARGETS section, then select the Info tab, and expand the URL Types section. Replace `Identifier` and `URL Schemes` with `CLIENT_ID" and `REVERSED_CLIENT_ID` in your `GoogleService-Info.plist`. [(LearnMore)](https://developers.google.com/identity/sign-in/ios/start-integrating)
8. Replace `MY_FACEBOOK_SIGN_IN_APP_ID` with your `Facebook app id`
9. Replace `MY_LINE_CHANNEL_SCHEME` with your `LINE channel scheme`
10. Edit `BuildConfig.json` ➜ `MY_GOOGLE_SIGN_IN_WEB_CLI_ID` to your Google sign-in client ID
11. Edit `BuildConfig.json` ➜ `SERVICE_ENDPOINT` to point to your Wallet Service endpoont
12. Register your app on CYBAVO WALLET MANAGEMENT system web > Administration > System settings, input `bundle id`, follow the instruction to retrieve an `API Code`.
13. Edit `BuildConfig.json` ➜ `SERVICE_API_CODE` to fill in yout `API Code`
14. Edit `BuildConfig.json` ➜ `MY_WECHAT_SIGN_IN_APP_ID` to fill in yout `WeChat app id`

# Features

- Sign in / Sign up with 3rd-party account system - Google, WeChat(微信)
- Wallet Creation / Editing
- Wallet Deposit / Withdrawal
- Transaction History query
- PIN Code configuration: Setup / Change / Recovery
