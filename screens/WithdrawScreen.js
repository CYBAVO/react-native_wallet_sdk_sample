/**
 * Copyright (c) 2019 CYBAVO, Inc.
 * https://www.cybavo.com
 *
 * All rights reserved.
 */
import React, { Component } from 'react';
import { View, StyleSheet } from 'react-native';
import {
  Container,
  Button,
  Text,
  Header,
  Title,
  Body,
  Icon,
  Left,
  Right,
  Form,
  Item,
  Label,
  Input,
  Picker,
  Spinner,
} from 'native-base';
import { WalletSdk, Wallets } from '@cybavo/react-native-wallet-service';
import CurrencyIcon from '../components/CurrencyIcon';
import CurrencyText from '../components/CurrencyText';
import { colorPrimary, colorAccent } from '../Constants';
import Balance from '../components/Balance';
import InputPinCodeModal from '../components/InputPinCodeModal';
import { toastError } from '../Helpers';
const { ErrorCodes } = WalletSdk;

const placeholderTextColor = '#ffffff80';
const styles = StyleSheet.create({
  label: {
    color: 'white',
  },
  input: {
    color: 'white',
  },
});

const ACTION_WITHDRAW = 'withdraw';
const ACTION_SECURE_TOKEN = 'secure_token';

export default class WithdrawScreen extends Component {
  static navigationOptions = ({ navigation }) => ({
    header: (
      <Header noShadow>
        <Left>
          <Button transparent onPress={() => navigation.goBack()}>
            <Icon name="arrow-back" />
          </Button>
        </Left>
        <Body>
          <Title>Deposit</Title>
        </Body>
        <Right />
      </Header>
    ),
  });

  state = {
    outgoingAddress: '',
    amout: '',
    selectedFee: null,
    pinCode: '',
    fee: null,
    usage: null,
    loading: false,
    inputPinCode: null,
  };

  componentDidMount = () => {
    this._fetchWithdrawInfo();
  };

  _setOutgoingAddress = outgoingAddress => {
    this.setState({ outgoingAddress });
  };

  _goScan = () => {
    this.props.navigation.navigate('Scan', {
      onResult: this._setOutgoingAddress,
    });
  };

  _fetchWithdrawInfo = async () => {
    this.setState({ loading: true });
    const { navigation } = this.props;
    const wallet = navigation.state.params.wallet;
    try {
      const fee = await Wallets.getTransactionFee(wallet.currency);
      const usage = await Wallets.getWalletUsage(wallet.walletId);
      this.setState({ fee, usage });
    } catch (error) {
      console.log('_fetchWithdrawInfo failed', error);
      toastError(error);
      this.setState({ fee: null, usage: null, error });
    }
    this.setState({ loading: false });
  };

  _inputPinCode = action => {
    this.setState({ inputPinCode: action });
  };

  _finishInputPinCode = () => {
    this.setState({ inputPinCode: null });
  };

  _requestSecureToken = async pinCode => {
    this.setState({ loading: true });
    try {
      await Wallets.requestSecureToken(pinCode);
      await this._createTransactionWithSecureToken(false);
    } catch (error) {
      console.log('_requestSecureToken failed', error);
      toastError(error);
    }
    this.setState({ loading: false });
  };

  _createTransaction = async pinCode => {
    const { outgoingAddress, amount, selectedFee, fee } = this.state;
    const { navigation } = this.props;
    const wallet = navigation.state.params.wallet;
    const transactionFee = fee[selectedFee];
    this.setState({ loading: true });
    try {
      await Wallets.createTransaction(
        wallet.walletId,
        outgoingAddress,
        amount,
        transactionFee ? transactionFee.amount : '0',
        '',
        pinCode
      );
      navigation.goBack();
    } catch (error) {
      console.log('Wallets.createTransaction failed', error);
      toastError(error);
      this._finishInputPinCode();
    }
    if (navigation.state.params && navigation.state.params.onComplete) {
      navigation.state.params.onComplete();
    }
    this.setState({ loading: false });
  };

  _createTransactionWithSecureToken = async requestToken => {
    const { outgoingAddress, amount, selectedFee, fee } = this.state;
    const { navigation } = this.props;
    const wallet = navigation.state.params.wallet;
    const transactionFee = fee[selectedFee];
    this.setState({ loading: true });
    try {
      await Wallets.createTransaction(
        wallet.walletId,
        outgoingAddress,
        amount,
        transactionFee ? transactionFee.amount : '0',
        ''
      );
      navigation.goBack();
    } catch (error) {
      if (
        requestToken &&
        ErrorCodes.ErrUserSecureTokenNotReady === error.code
      ) {
        this._inputPinCode(ACTION_SECURE_TOKEN);
      } else {
        console.log('_createTransactionWithSecureToken failed', error);
        toastError(error);
      }
    }
    if (navigation.state.params && navigation.state.params.onComplete) {
      navigation.state.params.onComplete();
    }
    this.setState({ loading: false });
  };

  render() {
    const {
      loading,
      outgoingAddress,
      amount,
      selectedFee,
      fee,
      usage,
      inputPinCode,
    } = this.state;
    const { navigation } = this.props;
    const wallet = navigation.state.params.wallet;

    const isValid = !!amount && !!outgoingAddress;

    return (
      <Container
        style={{
          backgroundColor: colorPrimary,
        }}
      >
        {/* Currency */}
        <View
          style={{
            marginTop: 16,
            flexDirection: 'row',
            alignSelf: 'center',
            alignItems: 'center',
          }}
        >
          <CurrencyIcon {...wallet} dimension={42} />
          <CurrencyText
            {...wallet}
            textStyle={{
              fontSize: 24,
              color: 'white',
              marginStart: 8,
            }}
          />
        </View>

        {/* Balance */}
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'baseline',
            justifyContent: 'center',
            marginVertical: 8,
          }}
        >
          <Balance
            {...wallet}
            textStyle={{
              color: 'white',
              fontSize: 24,
              maxWidth: '60%',
              opacity: 0.75,
            }}
          />
          <CurrencyText
            {...wallet}
            symbol
            textStyle={{
              color: 'white',
              fontSize: 24,
              marginLeft: 8,
              opacity: 0.75,
            }}
          />
        </View>

        {/* usage */}
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <Text style={{ color: 'white', flex: 1, textAlign: 'right' }}>{`${
            usage ? usage.dailyTransactionAmountUsage : '…'
          } ${wallet.currencySymbol} Today`}</Text>
          <View
            style={{
              backgroundColor: 'white',
              opacity: 0.75,
              width: 1.3,
              alignSelf: 'stretch',
              marginHorizontal: 8,
            }}
          />
          <Text style={{ color: 'white', flex: 1, textAlign: 'left' }}>{`${
            usage ? usage.dailyTransactionAmountQuota : '…'
          } ${wallet.currencySymbol} Daily`}</Text>
        </View>

        <Form style={{ marginTop: 16 }}>
          <Item stackedLabel>
            <Label style={styles.label}>Address</Label>
            <View style={{ flexDirection: 'row' }}>
              <Input
                style={styles.input}
                keyboardType="email-address"
                placeholder={'Address to deposit'}
                placeholderTextColor={placeholderTextColor}
                editable={!loading}
                value={outgoingAddress}
                onChangeText={outgoingAddress =>
                  this.setState({ outgoingAddress })
                }
              />
              <Button transparent onPress={this._goScan}>
                <Icon name="qr-scanner" style={{ color: 'white' }} />
              </Button>
            </View>
          </Item>

          <Item stackedLabel>
            <Label style={styles.label}>Amount</Label>

            <Input
              style={styles.input}
              keyboardType="number-pad"
              placeholder={'Amount to withdraw deposit'}
              placeholderTextColor={placeholderTextColor}
              editable={!loading}
              value={amount}
              onChangeText={amount => this.setState({ amount })}
            />
          </Item>
          <Item stackedLabel>
            <Label style={styles.label}>Transaction fee</Label>

            <Picker
              style={{ width: '100%', color: 'white' }}
              mode="dropdown"
              enabled={!loading}
              selectedValue={selectedFee}
              onValueChange={selectedFee => this.setState({ selectedFee })}
            >
              {fee &&
                Object.entries(fee).map(([key, { amount, description }]) => (
                  <Picker.Item
                    key={key}
                    label={`${amount} - ${description}`}
                    value={key}
                  />
                ))}
            </Picker>
          </Item>
        </Form>

        <View
          style={{
            flex: 1,
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          {loading && <Spinner color={colorAccent} />}
        </View>
        <View
          style={{
            flexDirection: 'row',
            padding: 16,
          }}
        >
          <Button
            bordered
            light
            full
            disabled={loading || !isValid}
            style={{ flex: 1, marginRight: 8 }}
            onPress={() => this._createTransactionWithSecureToken(true)}
          >
            <Text>Send w. Token</Text>
          </Button>
          <Button
            bordered
            light
            full
            disabled={loading || !isValid}
            style={{ flex: 1, marginLeft: 8 }}
            onPress={() => this._inputPinCode(ACTION_WITHDRAW)}
          >
            <Text>Send</Text>
          </Button>
        </View>

        <InputPinCodeModal
          isVisible={!!inputPinCode}
          onCancel={() => {
            this._finishInputPinCode();
          }}
          loading={loading}
          onInputPinCode={pinCode => {
            if (inputPinCode === ACTION_WITHDRAW) {
              this._createTransaction(pinCode);
            } else {
              this._requestSecureToken(pinCode);
            }
          }}
        />
      </Container>
    );
  }
}
