/**
 * Copyright (c) 2019 CYBAVO, Inc.
 * https://www.cybavo.com
 *
 * All rights reserved.
 */
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { View } from 'react-native';
import {
  Container,
  Header,
  Text,
  Spinner,
  Right,
  Icon,
  Button,
} from 'native-base';
import { WalletSdk } from '@cybavo/react-native-wallet-service';
import { GoogleSigninButton } from 'react-native-google-signin';
import { signIn } from '../store/actions';
import { colorPrimary, colorAccent, colorPrimaryDark } from '../Constants';
import { SERVICE_ENDPOINT } from '../BuildConfig.json';
import { toastError } from '../Helpers';

const {
  sdkInfo: { VERSION_NAME, VERSION_CODE, BUILD_TYPE },
} = WalletSdk;

class SignInScreen extends Component {
  static navigationOptions = ({ navigation }) => ({
    header: (
      <Header
        noShadow
        style={{
          backgroundColor: colorPrimary,
        }}
      >
        <Right
          style={{
            flexDirection: 'column',
            alignItems: 'flex-end',
          }}
        >
          <Text
            style={{ color: 'white', opacity: 0.5, fontSize: 10 }}
          >{`${VERSION_NAME} (${VERSION_CODE}) - ${BUILD_TYPE}`}</Text>
          <Text style={{ color: 'white', opacity: 0.5, fontSize: 10 }}>
            {SERVICE_ENDPOINT}
          </Text>
        </Right>
      </Header>
    ),
  });

  componentDidUpdate = (prevProps, prevState) => {
    const { error } = this.props;
    if (error && prevProps.error !== error) {
      toastError(error);
    }
  };

  render() {
    const {
      loading,
      googleSignIn,
      wechatSignIn,
      facebookSignIn,
      lineSignIn,
    } = this.props;

    return (
      <Container>
        <View
          size={3}
          style={{
            flex: 1,
            flexDirection: 'column',
            justifyContent: 'flex-end',
            backgroundColor: colorPrimary,
          }}
        >
          <Text
            style={{
              padding: 36,
              fontSize: 42,
              color: 'white',
            }}
          >
            {`Sign In\nWith\nSocial\nAccounts`}
          </Text>
        </View>
        <View
          size={1}
          style={{
            backgroundColor: colorPrimaryDark,
            flexDirection: 'column',
            alignItems: 'center',
            paddingHorizontal: 16,
            paddingBottom: 16,
          }}
        >
          <Spinner
            style={{ opacity: loading ? 1 : 0 }}
            size="small"
            color={colorAccent}
          />
          <Button
            full
            success
            style={{ margin: 4, height: 40 }}
            onPress={wechatSignIn}
            disabled={loading}
          >
            <View
              style={{ flex: 1, flexDirection: 'row', alignItems: 'center' }}
            >
              <Icon type="MaterialCommunityIcons" name="wechat" />
              <Text style={{ flex: 1, textAlign: 'center' }}>
                Sign in with WeChat
              </Text>
            </View>
          </Button>
          <GoogleSigninButton
            style={{ alignSelf: 'stretch', height: 48 }}
            size={GoogleSigninButton.Size.Wide}
            color={GoogleSigninButton.Color.Light}
            onPress={googleSignIn}
            disabled={loading}
          />
          <Button
            full
            style={{ margin: 4, height: 40 }}
            onPress={facebookSignIn}
            disabled={loading}
          >
            <View
              style={{ flex: 1, flexDirection: 'row', alignItems: 'center' }}
            >
              <Icon
                type="MaterialCommunityIcons"
                name="facebook"
                backgroundColor="#3b5998"
              />
              <Text style={{ flex: 1, textAlign: 'center' }}>
                Sign in with Facebook
              </Text>
            </View>
          </Button>
          <Button
            full
            style={{ margin: 4, height: 40, backgroundColor: '#00c300' }}
            onPress={lineSignIn}
            disabled={loading}
          >
            <View
              style={{ flex: 1, flexDirection: 'row', alignItems: 'center' }}
            >
              <Text style={{ flex: 1, textAlign: 'center' }}>
                Sign in with LINE
              </Text>
            </View>
          </Button>
        </View>
      </Container>
    );
  }
}

const mapStateToProps = (state, ownProps) => {
  return {
    signInState: state.auth.signInState,
    loading: state.auth.loading,
    error: state.auth.error,
  };
};

const mapDispatchToProps = (dispatch, ownProps) => {
  return {
    googleSignIn: () => dispatch(signIn('Google')),
    wechatSignIn: () => dispatch(signIn('WeChat')),
    facebookSignIn: () => dispatch(signIn('Facebook')),
    lineSignIn: () => dispatch(signIn('LINE')),
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(SignInScreen);
