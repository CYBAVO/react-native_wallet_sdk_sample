/**
 * Copyright (c) 2019 CYBAVO, Inc.
 * https://www.cybavo.com
 *
 * All rights reserved.
 */
import React, { Component } from 'react';
import { View } from 'react-native';
import { connect } from 'react-redux';
import {
  Container,
  Button,
  Text,
  Header,
  Left,
  Body,
  Right,
  Icon,
  Title,
} from 'native-base';
import {
  Auth,
  Wallets,
  NumericPinCodeInputView,
} from '@cybavo/react-native-wallet-service';
import { fetchUserState, fetchWallets } from '../store/actions';
import { colorPrimary, PIN_CODE_LENGTH } from '../Constants';

class SetupPinCodeScreen extends Component {
  static navigationOptions = ({ navigation }) => ({
    header: (
      <Header
        noShadow
        style={{
          backgroundColor: 'transparent',
        }}
      >
        <Left>
          <Button transparent onPress={() => navigation.goBack()}>
            <Icon name="arrow-back" style={{ color: colorPrimary }} />
          </Button>
        </Left>
        <Body>
          <Title style={{ color: colorPrimary }}>Setup PIN code</Title>
        </Body>
        <Right />
      </Header>
    ),
  });

  state = {
    loading: false,
    pinCodeLength: 0,
  };

  _inputPinCode = pinCodeLength => {
    this.setState({ pinCodeLength });
  };

  _setupPinCode = async () => {
    const { fetchUserState, fetchWallets } = this.props;
    this.setState({ loading: true });
    try {
      const pinSecret = await this.refs.pinCodeInput.submit();
      // setup PIN code and retain PinSecret
      await Auth.setupPinCode({ pinSecret, retain: true });
      // create default wallet with retained PinSecret
      await Wallets.createWallet(
        60, // currency
        '', // tokenAddress
        0, // parentWalletId
        'My Ethereum', // name
        pinSecret, // pinSecret
        {} // extraAttributes
      );
    } catch (error) {
      console.warn(error);
    }
    await fetchUserState();
    fetchWallets();
    this.setState({ loading: false });
  };

  _quit = async () => {
    const { navigation } = this.props;
    navigation.goBack();
  };

  render() {
    const { loading, pinCodeLength } = this.state;
    const { userState } = this.props;
    const isValid = pinCodeLength >= PIN_CODE_LENGTH;
    return (
      <Container style={{ padding: 16 }}>
        <View style={{ flex: 1, flexDirection: 'column' }}>
          <Text
            style={{
              color: colorPrimary,
              fontSize: 32,
            }}
          >
            {`Please\nsetup your PIN code`}
          </Text>

          <Text
            style={{
              color: 'gray',
              fontSize: 32,
              marginTop: 32,
              textAlign: 'center',
              letterSpacing: 16,
            }}
          >
            {`${'*'.repeat(pinCodeLength)}${'-'.repeat(
              PIN_CODE_LENGTH - pinCodeLength
            )}`}
          </Text>

          <View style={{ flex: 1 }} />

          {!userState.setPin && (
            <NumericPinCodeInputView
              ref="pinCodeInput"
              style={{ marginBottom: 16 }}
              maxLength={PIN_CODE_LENGTH}
              fixedOrder={true}
              hapticFeedback={true}
              horizontalSpacing={16}
              verticalSpacing={8}
              buttonWidth={72}
              buttonHeight={72}
              buttonBorderRadius={36}
              buttonBackgroundColor="#EEEEEE80"
              buttonTextColor="black"
              buttonTextSize={12}
              androidButtonRippleColor="#80808080"
              disabled={!loading}
              onChanged={this._inputPinCode}
            />
          )}
        </View>

        {!userState.setPin && (
          <Button
            full
            disabled={loading || !isValid}
            onPress={this._setupPinCode}
          >
            <Text>Submit</Text>
          </Button>
        )}
        {userState.setPin && (
          <>
            <Text
              style={{
                color: colorPrimary,
                marginBottom: 16,
                textAlign: 'center',
              }}
            >
              Congrations! You are ready to go!
            </Text>
            <Button full disabled={loading} onPress={this._quit}>
              <Text>Go to wallets</Text>
            </Button>
          </>
        )}
      </Container>
    );
  }
}

const mapStateToProps = (state, ownProps) => {
  return {
    userState: state.user.userState,
  };
};

const mapDispatchToProps = (dispatch, ownProps) => {
  return {
    fetchWallets: () => dispatch(fetchWallets()),
    fetchUserState: () => dispatch(fetchUserState()),
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(SetupPinCodeScreen);
