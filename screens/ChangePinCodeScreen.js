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
  Header,
  Left,
  Body,
  Right,
  Icon,
  Title,
  Label,
  Toast,
} from 'native-base';
import { Auth } from '@cybavo/react-native-wallet-service';
import { colorPrimary, PIN_CODE_LENGTH } from '../Constants';
import InputPinCodeModal from '../components/InputPinCodeModal';
import { toastError } from '../Helpers';

class ChangePinCodeScreen extends Component {
  static navigationOptions = ({ navigation }) => ({
    header: (
      <Header>
        <Left>
          <Button transparent onPress={() => navigation.goBack()}>
            <Icon name="arrow-back" />
          </Button>
        </Left>
        <Body>
          <Title>Change PIN code</Title>
        </Body>
        <Right />
      </Header>
    ),
  });

  state = {
    loading: false,
    inputPinCode: null,
    pinSecret: null,
    newPinSecret: null,
  };

  _startInputPinCode = target => {
    this.setState({ inputPinCode: target });
  };

  _finishInputPinCode = () => {
    this.setState({ inputPinCode: null });
  };

  _onInputPinCode = pinSecret => {
    const { inputPinCode } = this.state;
    if (inputPinCode === 'pinCode') {
      this.setState({ pinSecret: pinSecret });
    } else if (inputPinCode === 'newPinCode') {
      this.setState({ newPinSecret: pinSecret });
    }
    this._finishInputPinCode();
  };

  _changePinCode = async () => {
    const { navigation } = this.props;
    const { newPinSecret, pinSecret } = this.state;
    this.setState({ loading: true });
    try {
      await Auth.changePinCode(newPinSecret, pinSecret);
      Toast.show({ text: 'Change PIN code successfully' });
      navigation.goBack();
    } catch (error) {
      console.log('_changePinCode failed', error);
      toastError(error);
    }
    this.setState({ loading: false });
  };

  render() {
    const { loading, pinSecret, newPinSecret, inputPinCode } = this.state;
    const isValid = pinSecret && newPinSecret;
    return (
      <Container style={{ padding: 16 }}>
        <Content>
          <Text
            style={{
              color: colorPrimary,
              fontSize: 22,
              marginBottom: 16,
            }}
          >
            Plcease enter current PIN code and the new PIN code
          </Text>

          <Label>Current PIN code</Label>
          <Button
            full
            transparent
            disabled={loading}
            onPress={() => this._startInputPinCode('pinCode')}
          >
            <Text
              style={{
                letterSpacing: !!pinSecret ? 16 : undefined,
                fontSize: !!pinSecret ? 32 : undefined,
              }}
            >
              {!!pinSecret ? '*'.repeat(PIN_CODE_LENGTH) : 'Click to input'}
            </Text>
          </Button>

          <Label
            style={{
              marginTop: 16,
            }}
          >
            New PIN code
          </Label>
          <Button
            full
            transparent
            disabled={loading}
            onPress={() => this._startInputPinCode('newPinCode')}
          >
            <Text
              style={{
                letterSpacing: !!newPinSecret ? 16 : undefined,
                fontSize: !!newPinSecret ? 32 : undefined,
              }}
            >
              {!!newPinSecret ? '*'.repeat(PIN_CODE_LENGTH) : 'Click to input'}
            </Text>
          </Button>
        </Content>

        <Button
          full
          disabled={loading || !isValid}
          onPress={this._changePinCode}
        >
          <Text>Submit</Text>
        </Button>

        <InputPinCodeModal
          isVisible={!!inputPinCode}
          loading={loading}
          onCancel={this._finishInputPinCode}
          onInputPinCode={this._onInputPinCode}
        />
      </Container>
    );
  }
}

export default ChangePinCodeScreen;
