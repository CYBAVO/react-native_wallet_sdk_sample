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
} from 'native-base';
import { Auth } from '@cybavo/react-native-wallet-service';
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
    pinCode: '',
    done: false,
  };

  _inputPinCode = pinCode => {
    this.setState({ pinCode });
  };

  _resetPinCode = async () => {
    const { navigation } = this.props;
    const { pinCode } = this.state;
    const { recoveryCode } = navigation.state.params;
    this.setState({ loading: true });
    try {
      await Auth.recoverPinCode(pinCode, recoveryCode);
      this.setState({ done: true });
    } catch (error) {
      console.log('_resetPinCode failed', error);
      toastError(error);
    }
    this.setState({ loading: false });
  };

  _goSetupSecurityQuestions = () => {
    const { pinCode } = this.state;
    const { navigation } = this.props;
    navigation.replace({
      routeName: 'SetupSecurityQuestions',
      params: {
        pinCode,
      },
    });
  };

  _quit = async () => {
    const { navigation } = this.props;
    navigation.goBack();
  };

  render() {
    const { loading, pinCode, done } = this.state;
    const isValid = pinCode.length >= PIN_CODE_LENGTH;
    return (
      <Container style={{ padding: 16 }}>
        <Content>
          <Text
            style={{
              color: colorPrimary,
              fontSize: 20,
              marginTop: 56,
              marginBottom: 16,
            }}
          >
            Input your new PIN code
          </Text>

          <Item regular stackedLabel>
            <Input
              secureTextEntry
              keyboardType="number-pad"
              maxLength={PIN_CODE_LENGTH}
              editable={!loading && !done}
              value={pinCode}
              onChangeText={this._inputPinCode}
              placeholder="PIN code"
            />
          </Item>
        </Content>

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
