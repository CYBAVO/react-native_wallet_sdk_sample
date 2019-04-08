/**
 * Copyright (c) 2019 CYBAVO, Inc.
 * https://www.cybavo.com
 *
 * All rights reserved.
 */
import React, { Component } from 'react';
import {
  Container,
  Content,
  Button,
  Text,
  Item,
  Input,
  Header,
  Left,
  Body,
  Right,
  Icon,
  Title,
  Toast,
} from 'native-base';
import { Auth } from '@cybavo/react-native-wallet-service';
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
    pinCode: '',
  };

  _inputPinCode = pinCode => {
    this.setState({ pinCode });
  };

  _restorePinCode = async () => {
    const { pinCode } = this.state;
    const { navigation } = this.props;
    const { questions, answers } = navigation.state.params;

    this.setState({ loading: true });
    try {
      await Auth.restorePinCode(
        pinCode,
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
    const { loading, pinCode } = this.state;
    const isValid = pinCode.length >= PIN_CODE_LENGTH;
    return (
      <Container style={{ padding: 16 }}>
        <Content>
          <Text
            style={{
              color: colorPrimary,
              marginBottom: 16,
              fontSize: 20,
            }}
          >
            Questions verified successfully. Please enter your new PIN code.
          </Text>

          <Item regular stackedLabel>
            <Input
              secureTextEntry
              keyboardType="number-pad"
              maxLength={PIN_CODE_LENGTH}
              editable={!loading}
              value={pinCode}
              onChangeText={this._inputPinCode}
              placeholder="PIN code"
            />
          </Item>
        </Content>
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
