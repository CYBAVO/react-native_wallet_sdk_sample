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
  Label,
  Toast,
} from 'native-base';
import { Auth } from '@cybavo/react-native-wallet-service';
import { colorPrimary, PIN_CODE_LENGTH } from '../Constants';
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
    pinCode: '',
    newPinCode: '',
  };

  _inputPinCode = pinCode => {
    this.setState({ pinCode });
  };

  _inputNewPinCode = newPinCode => {
    this.setState({ newPinCode });
  };

  _changePinCode = async () => {
    const { navigation } = this.props;
    const { pinCode, newPinCode } = this.state;
    this.setState({ loading: true });
    try {
      await Auth.changePinCode(newPinCode, pinCode);
      Toast.show({ text: 'Change PIN code successfully' });
      navigation.goBack();
    } catch (error) {
      console.log('_changePinCode failed', error);
      toastError(error);
    }
    this.setState({ loading: false });
  };

  render() {
    const { loading, pinCode, newPinCode } = this.state;
    const isValid =
      pinCode.length >= PIN_CODE_LENGTH && newPinCode.length >= PIN_CODE_LENGTH;
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
          <Item regular>
            <Input
              secureTextEntry
              keyboardType="number-pad"
              maxLength={PIN_CODE_LENGTH}
              editable={!loading}
              value={pinCode}
              onChangeText={this._inputPinCode}
              placeholder="Your PIN code"
            />
          </Item>

          <Label
            style={{
              marginTop: 16,
            }}
          >
            New PIN code
          </Label>
          <Item regular>
            <Input
              secureTextEntry
              keyboardType="number-pad"
              maxLength={PIN_CODE_LENGTH}
              editable={!loading}
              value={newPinCode}
              onChangeText={this._inputNewPinCode}
              placeholder="New PIN code"
            />
          </Item>
        </Content>

        <Button
          full
          disabled={loading || !isValid}
          onPress={this._changePinCode}
        >
          <Text>Submit</Text>
        </Button>
      </Container>
    );
  }
}

export default ChangePinCodeScreen;
