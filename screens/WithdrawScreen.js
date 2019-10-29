/**
 * Copyright (c) 2019 CYBAVO, Inc.
 * https://www.cybavo.com
 *
 * All rights reserved.
 */
import React, { Component } from 'react';
import { View, StyleSheet, Alert } from 'react-native';
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
import { colorPrimary, colorAccent, Coin } from '../Constants';
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

const hasMemo = wallet => {
  return [Coin.EOS, Coin.XRP].includes(wallet.currency);
};

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
          <Title>Withdraw</Title>
        </Body>
        <Right />
      </Header>
    ),
  });

  state = {
    outgoingAddress: '',
    amout: '',
    memo: '',
    description: '',
    selectedFee: null,
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

  _confirmTransaction = async action => {
    const { outgoingAddress, amount, selectedFee, fee } = this.state;
    const { navigation } = this.props;
    const wallet = navigation.state.params.wallet;
    const transactionFee = fee[selectedFee];

    try {
      // console.log(wallet.currency, wallet.tokenAddress, amount, transactionFee);
      const {
        tranasctionAmout,
        platformFee,
        blockchainFee,
      } = await Wallets.estimateTransaction(
        wallet.currency,
        wallet.tokenAddress,
        amount,
        transactionFee ? transactionFee.amount : '0'
      );

      let mesasge = `Destination:\n${outgoingAddress}\n`;
      if (tranasctionAmout && tranasctionAmout !== '0') {
        mesasge += `\nTransaction Amount:\n${tranasctionAmout}\n`;
      }
      if (platformFee && platformFee !== '0') {
        mesasge += `\nPlatform Fee:\n${platformFee}\n`;
      }
      if (blockchainFee && blockchainFee !== '0') {
        mesasge += `\nBlockchain Fee:\n${blockchainFee}\n`;
      }

      Alert.alert(
        'Confirm Transaction',
        mesasge,
        [{ text: 'Cancel' }, { text: 'Confirm', onPress: action }],
        { cancelable: true }
      );

      // console.log(result);
    } catch (error) {
      console.log('_confirmTransaction failed', error);
      toastError(error);
    }
  };

  _inputPinCode = action => {
    this.setState({ inputPinCode: action });
  };

  _finishInputPinCode = () => {
    this.setState({ inputPinCode: null });
  };

  _requestSecureToken = async pinSecret => {
    this.setState({ loading: true });
    try {
      await Wallets.requestSecureToken(pinSecret);
      await this._createTransactionWithSecureToken(false);
    } catch (error) {
      console.log('_requestSecureToken failed', error);
      toastError(error);
    }
    this.setState({ loading: false });
  };

  _createTransaction = async pinSecret => {
    const {
      outgoingAddress,
      amount,
      selectedFee,
      fee,
      memo,
      description,
    } = this.state;
    const { navigation } = this.props;
    const wallet = navigation.state.params.wallet;
    const transactionFee = fee[selectedFee];

    let extras = {};
    if (hasMemo(wallet)) {
      extras = {
        ...extras,
        memo,
      };
    }

    this.setState({ loading: true });
    try {
      await Wallets.createTransaction(
        wallet.walletId,
        outgoingAddress,
        amount,
        transactionFee ? transactionFee.amount : '0',
        description,
        pinSecret,
        extras
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
    const { outgoingAddress, amount, selectedFee, fee, memo } = this.state;
    const { navigation } = this.props;
    const wallet = navigation.state.params.wallet;
    const transactionFee = fee[selectedFee];

    let extras = {};
    if (hasMemo(wallet)) {
      extras = {
        ...extras,
        memo,
      };
    }

    this.setState({ loading: true });
    try {
      await Wallets.createTransaction(
        wallet.walletId,
        outgoingAddress,
        amount,
        transactionFee ? transactionFee.amount : '0',
        '',
        undefined, // no pin code for secure token
        extras
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
      memo,
      selectedFee,
      fee,
      usage,
      inputPinCode,
      description,
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
              keyboardType="numeric"
              returnKeyType="done"
              placeholder={'Amount to withdraw deposit'}
              placeholderTextColor={placeholderTextColor}
              editable={!loading}
              value={amount}
              onChangeText={amount => this.setState({ amount })}
            />
          </Item>

          {hasMemo(wallet) && (
            <Item stackedLabel>
              <Label style={styles.label}>Memo</Label>

              <Input
                style={styles.input}
                keyboardType="email-address"
                returnKeyType="done"
                placeholder={'Memo / dst.tag for this transaction…'}
                placeholderTextColor={placeholderTextColor}
                editable={!loading}
                value={memo}
                onChangeText={memo => this.setState({ memo })}
              />
            </Item>
          )}

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

          <Item stackedLabel>
            <Label style={styles.label}>Description</Label>
            <Input
              style={styles.input}
              autoCapitalize="sentences"
              returnKeyType="done"
              placeholder={
                'Description for this transaction, private to this wallet.'
              }
              placeholderTextColor={placeholderTextColor}
              editable={!loading}
              value={description}
              onChangeText={description => this.setState({ description })}
            />
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
            onPress={() =>
              this._confirmTransaction(() =>
                this._createTransactionWithSecureToken(true)
              )
            }
          >
            <Text>Send w. Token</Text>
          </Button>
          <Button
            bordered
            light
            full
            disabled={loading || !isValid}
            style={{ flex: 1, marginLeft: 8 }}
            onPress={() =>
              this._confirmTransaction(() =>
                this._inputPinCode(ACTION_WITHDRAW)
              )
            }
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
          onInputPinCode={pinSecret => {
            if (inputPinCode === ACTION_WITHDRAW) {
              this._createTransaction(pinSecret);
            } else {
              this._requestSecureToken(pinSecret);
            }
          }}
        />
      </Container>
    );
  }
}
