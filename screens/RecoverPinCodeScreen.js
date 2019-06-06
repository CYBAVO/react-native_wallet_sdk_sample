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
import { colorPrimary, colorDanger } from '../Constants';
import { toastError } from '../Helpers';

const RECOVERY_CODE_LENGTH = 8;

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
          <Title style={{ color: colorPrimary }}>Recover PIN code</Title>
        </Body>
        <Right />
      </Header>
    ),
  });

  state = {
    loading: false,
    handleNum: '',
    recoveryCode: '',
  };

  _forgotPinCode = async () => {
    this.setState({ loading: true });
    try {
      const { handleNum } = await Auth.forgotPinCode();
      this.setState({ handleNum });
    } catch (error) {
      console.log('_forgotPinCode failed', error);
      toastError(error);
    }
    this.setState({ loading: false });
  };

  _inputRecoveryCode = recoveryCode => {
    this.setState({ recoveryCode });
  };

  _verifyRecoveryCode = async () => {
    const { recoveryCode } = this.state;

    this.setState({ loading: true });
    try {
      await Auth.verifyRecoveryCode(recoveryCode);
      this._goResetPinCode(recoveryCode);
    } catch (error) {
      console.log('_verifyRecoveryCode failed', error);
      toastError(error);
      this.setState({ loading: false });
    }
  };

  _goResetPinCode = async recoveryCode => {
    const { navigation } = this.props;
    navigation.replace({
      routeName: 'ResetPinCode',
      params: {
        recoveryCode,
      },
    });
  };

  render() {
    const { loading, handleNum, recoveryCode } = this.state;
    const isValid = recoveryCode.length >= RECOVERY_CODE_LENGTH;
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
            Contact us to help you to initiate the recovery
          </Text>

          <Button
            danger
            iconLeft
            disabled={!!handleNum}
            transparent={!!handleNum}
            onPress={this._forgotPinCode}
          >
            <Icon
              name={
                !!handleNum ? 'ios-checkmark-circle-outline' : 'ios-help-buoy'
              }
            />
            <Text>{!handleNum ? 'I forgot my PIN code!' : 'Request sent'}</Text>
          </Button>
          {!!handleNum && (
            <Text style={{ color: colorDanger, marginVertical: 8 }}>
              {`Your handler number is #${handleNum}.\nOnce our administrator granted your request, you will receive the recovery code. We may contact you to verify your identity.`}
            </Text>
          )}

          <Text style={{ color: colorPrimary, marginVertical: 16 }}>
            I already have the recovery Code:
          </Text>

          <Item regular>
            <Input
              secureTextEntry
              keyboardType="number-pad"
              returnKeyType='done'
              maxLength={RECOVERY_CODE_LENGTH}
              editable={!loading}
              value={recoveryCode}
              onChangeText={this._inputRecoveryCode}
              placeholder="Recovery code"
            />
          </Item>
        </Content>
        <Button
          full
          style={{
            marginTop: 16,
          }}
          disabled={loading || !isValid}
          onPress={this._verifyRecoveryCode}
        >
          <Text>Submit</Text>
        </Button>
      </Container>
    );
  }
}

export default SetupPinCodeScreen;
