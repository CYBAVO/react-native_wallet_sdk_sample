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
  Toast,
} from 'native-base';
import {
  Auth,
  NumericPinCodeInputView,
} from '@cybavo/react-native-wallet-service';
import { colorPrimary, PIN_CODE_LENGTH } from '../Constants';
import { toastError } from '../Helpers';

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
          <Title style={{ color: colorPrimary }}>Restore PIN code</Title>
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

  _restorePinCode = async () => {
    const { navigation } = this.props;
    const { questions, answers } = navigation.state.params;

    this.setState({ loading: true });
    try {
      const pinSecret = await this.refs.pinCodeInput.submit();
      await Auth.restorePinCode(
        pinSecret,
        {
          question: questions[0],
          answer: answers[0],
        },
        {
          question: questions[1],
          answer: answers[1],
        },
        {
          question: questions[2],
          answer: answers[2],
        }
      );
      Toast.show({ text: 'Restore PIN code successfully' });
      this._quit();
    } catch (error) {
      console.log('_restorePinCode failed', error);
      toastError(error);
    }
    this.setState({ loading: false });
  };

  _quit = async () => {
    const { navigation } = this.props;
    navigation.goBack();
  };

  render() {
    const { loading, pinCodeLength } = this.state;
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
              marginBottom: 16,
              fontSize: 20,
            }}
          >
            Questions verified successfully. Please enter your new PIN code.
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
            androidButtonRippleColor="#80808080"
            disabled={!loading}
            onChanged={this._inputPinCode}
          />
        </View>
        <Button
          full
          disabled={loading || !isValid}
          onPress={this._restorePinCode}
        >
          <Text>Submit</Text>
        </Button>
      </Container>
    );
  }
}

export default SetupPinCodeScreen;
