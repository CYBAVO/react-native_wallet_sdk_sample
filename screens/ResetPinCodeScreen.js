/**
 * Copyright (c) 2019 CYBAVO, Inc.
 * https://www.cybavo.com
 *
 * All rights reserved.
 */
import React, { Component } from 'react';
import { View } from 'react-native';
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
  NumericPinCodeInputView,
} from '@cybavo/react-native-wallet-service';
import { colorPrimary, PIN_CODE_LENGTH } from '../Constants';
import { toastError } from '../Helpers';

class ResetPinCodeScreen extends Component {
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
          <Title style={{ color: colorPrimary }}>Reset PIN code</Title>
        </Body>
        <Right />
      </Header>
    ),
  });

  state = {
    loading: false,
    pinCodeLength: 0,
    done: false,
  };

  _inputPinCode = pinCodeLength => {
    this.setState({ pinCodeLength });
  };

  _resetPinCode = async () => {
    const { navigation } = this.props;
    const { recoveryCode } = navigation.state.params;

    this.setState({ loading: true });
    try {
      const pinSecret = await this.refs.pinCodeInput.submit();
      await Auth.recoverPinCode(pinSecret, recoveryCode);
      this.setState({ done: true });
    } catch (error) {
      console.log('_resetPinCode failed', error);
      toastError(error);
    }
    this.setState({ loading: false });
  };

  _goSetupSecurityQuestions = () => {
    const { pinSecret } = this.state;
    const { navigation } = this.props;
    navigation.replace({
      routeName: 'SetupSecurityQuestions',
      params: {
        pinSecret,
      },
    });
  };

  _quit = async () => {
    const { navigation } = this.props;
    navigation.goBack();
  };

  render() {
    const { loading, pinCodeLength, done } = this.state;
    const isValid = pinCodeLength >= PIN_CODE_LENGTH;
    return (
      <Container style={{ padding: 16 }}>
        <View
          style={{
            flex: 1,
            flexDirection: 'column',
            justifyContent: 'space-between',
          }}
        >
          <Text
            style={{
              color: colorPrimary,
              fontSize: 20,
              marginBottom: 16,
            }}
          >
            Input your new PIN code
          </Text>

          <Text
            style={{
              color: 'gray',
              fontSize: 32,
              textAlign: 'center',
              letterSpacing: 16,
            }}
          >
            {`${'*'.repeat(pinCodeLength)}${'-'.repeat(
              PIN_CODE_LENGTH - pinCodeLength
            )}`}
          </Text>

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
            backspaceButtonWidth={72}
            backspaceButtonHeight={72}
            backspaceButtonBorderRadius={36}
            backspaceButtonBackgroundColor="#EEEEEE80"
            backspaceButtonTextColor="black"
            backspaceButtonTextSize={12}
            androidButtonRippleColor="#80808080"
            disabled={loading}
            onChanged={this._inputPinCode}
          />
        </View>

        {!done && (
          <Button
            full
            disabled={loading || !isValid}
            onPress={this._resetPinCode}
          >
            <Text>Submit</Text>
          </Button>
        )}
        {done && (
          <>
            <Button
              full
              disabled={loading}
              onPress={this._goSetupSecurityQuestions}
            >
              <Text>Reset security questions</Text>
            </Button>
            <Button full transparent disabled={loading} onPress={this._quit}>
              <Text>Skip</Text>
            </Button>
          </>
        )}
      </Container>
    );
  }
}

export default ResetPinCodeScreen;
