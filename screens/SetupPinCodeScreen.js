/**
 * Copyright (c) 2019 CYBAVO, Inc.
 * https://www.cybavo.com
 *
 * All rights reserved.
 */
import React, { Component } from 'react';
import { connect } from 'react-redux';
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
    pinCode: '',
  };

  _inputPinCode = pinCode => {
    this.setState({ pinCode });
  };

  _setupPinCode = async () => {
    const { fetchUserState, fetchWallets } = this.props;
    const { pinCode } = this.state;
    this.setState({ loading: true });
    try {
      await Auth.setupPinCode(pinCode);
    } catch (error) {
      console.warn(error);
    }
    await fetchUserState();
    fetchWallets();
    this.setState({ loading: false });
  };

  _goCreateWallet = () => {
    const { navigation } = this.props;
    navigation.replace({
      routeName: 'CreateWallet',
    });
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
    const { loading, pinCode } = this.state;
    const { userState } = this.props;
    const isValid = pinCode.length >= PIN_CODE_LENGTH;
    return (
      <Container style={{ padding: 16 }}>
        <Content>
          <Text
            style={{
              color: colorPrimary,
              fontSize: 32,
              marginTop: 56,
              marginBottom: 16,
            }}
          >
            {`Please\nsetup your PIN code`}
          </Text>

          <Item regular stackedLabel>
            <Input
              secureTextEntry
              keyboardType="number-pad"
              maxLength={PIN_CODE_LENGTH}
              editable={!loading && !userState.setPin}
              value={pinCode}
              onChangeText={this._inputPinCode}
              placeholder="PIN code"
            />
          </Item>
        </Content>

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
            <Text style={{ color: colorPrimary, marginBottom: 16 }}>
              PIN code setup successfully. Do you want to create a wallet now?
            </Text>
            <Button full disabled={loading} onPress={this._goCreateWallet}>
              <Text>Create Wallet Now</Text>
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
